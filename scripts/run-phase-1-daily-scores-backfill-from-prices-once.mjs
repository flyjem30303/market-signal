import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const MODEL_VERSION = "phase1-price-derived-v1";
const PAGE_SIZE = 1000;

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 0) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] == null) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const writeEnabled = process.env.PHASE1_SCORE_BACKFILL_WRITE === "enabled";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const result = {
  dryRun: !writeEnabled,
  hasUrl: Boolean(url),
  hasServiceRoleKey: Boolean(serviceRoleKey),
  modelVersion: MODEL_VERSION,
  priceRowsRead: 0,
  scoreRowsPrepared: 0,
  scoreRowsWritten: 0,
  skippedRows: 0,
  status: "blocked"
};

if (!url || !serviceRoleKey) {
  result.reason = "missing_supabase_env";
  console.log(JSON.stringify(result, null, 2));
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false
  }
});

const prices = await readAllPrices();
result.priceRowsRead = prices.length;

const rows = buildScoreRows(prices);
result.scoreRowsPrepared = rows.length;
result.skippedRows = prices.length - rows.length;

if (!writeEnabled) {
  result.status = "dry_run_ok";
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

for (let start = 0; start < rows.length; start += PAGE_SIZE) {
  const batch = rows.slice(start, start + PAGE_SIZE);
  const { error } = await supabase.from("daily_scores").upsert(batch, {
    onConflict: "stock_id,trade_date,model_version"
  });
  if (error) {
    result.status = "write_failed";
    result.reason = error.message;
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  result.scoreRowsWritten += batch.length;
}

const readback = await supabase
  .from("daily_scores")
  .select("stock_id", { count: "exact", head: true })
  .eq("model_version", MODEL_VERSION);

result.readbackCount = readback.count;
result.readbackError = readback.error?.message ?? null;
result.status =
  !readback.error && readback.count === rows.length ? "ok" : "readback_mismatch";

console.log(JSON.stringify(result, null, 2));

if (result.status !== "ok") {
  process.exitCode = 1;
}

async function readAllPrices() {
  const rows = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from("daily_prices")
      .select("close, high, low, open, stock_id, trade_date, turnover, volume")
      .order("stock_id", { ascending: true })
      .order("trade_date", { ascending: true })
      .range(from, to);

    if (error) throw new Error(`Failed to read daily_prices: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}

function buildScoreRows(prices) {
  const byStock = groupBy(prices, (row) => row.stock_id);
  const rows = [];
  const lastUpdatedAt = new Date().toISOString();

  for (const series of byStock.values()) {
    const ordered = series
      .filter((row) => row.close != null)
      .sort((left, right) => left.trade_date.localeCompare(right.trade_date));

    for (let index = 0; index < ordered.length; index += 1) {
      const score = buildScore(ordered.slice(0, index + 1));
      const price = ordered[index];
      rows.push({
        composite_score: score.compositeScore,
        data_quality_grade: score.dataQualityGrade,
        data_quality_score: score.dataQualityScore,
        health_score: score.healthScore,
        last_updated_at: lastUpdatedAt,
        missing_module_flags: ["news_score_not_included_phase_1", "etf_full_coverage_phase_1_1"],
        model_version: MODEL_VERSION,
        risk_score: score.riskScore,
        signal: score.signal,
        stale_data_flags: [],
        stock_id: price.stock_id,
        trade_date: price.trade_date
      });
    }
  }

  return rows;
}

function buildScore(series) {
  const latest = series.at(-1);
  const previous = series.at(-2) ?? latest;
  const closes = series.map((point) => point.close).filter((value) => value != null);
  const volumes = series.map((point) => point.volume ?? 0);
  const returns = series.slice(1).map((point, index) => pctChange(point.close, series[index].close));
  const movingAverage = average(closes.slice(-Math.min(20, closes.length)));
  const averageClose = average(closes);
  const previousAverageVolume = average(volumes.slice(0, -1).slice(-Math.min(20, Math.max(1, volumes.length - 1))));
  const dailyChangePct = pctChange(latest.close, previous.close);

  const components = {
    dailyChangeScore: clampScore(50 + dailyChangePct * 8),
    dispersionScore: clampScore(100 - Math.abs((latest.close - averageClose) / averageClose) * 220),
    movingAveragePostureScore: clampScore(50 + ((latest.close - movingAverage) / movingAverage) * 180),
    volatilityScore: clampScore(100 - standardDeviation(returns) * 18),
    volumeChangeScore: clampScore(50 + pctChange(latest.volume ?? 0, previousAverageVolume) * 2)
  };

  const compositeScore = clampScore(
    components.dailyChangeScore * 0.24 +
      components.movingAveragePostureScore * 0.24 +
      components.volumeChangeScore * 0.16 +
      components.volatilityScore * 0.2 +
      components.dispersionScore * 0.16
  );
  const riskScore = clampScore(
    100 -
      (components.volatilityScore * 0.42 +
        components.movingAveragePostureScore * 0.24 +
        components.dailyChangeScore * 0.2 +
        components.dispersionScore * 0.14)
  );
  const healthScore = clampScore(compositeScore * 0.72 + components.volatilityScore * 0.16 + components.volumeChangeScore * 0.12);
  const dataQualityScore = latest.open != null && latest.high != null && latest.low != null && latest.volume != null ? 82 : 70;

  return {
    compositeScore,
    dataQualityGrade: dataQualityScore >= 80 ? "B" : "C",
    dataQualityScore,
    healthScore,
    riskScore,
    signal: signalFor(compositeScore)
  };
}

function signalFor(score) {
  if (score >= 75) return "green";
  if (score >= 62) return "yellow";
  if (score >= 48) return "orange";
  if (score >= 34) return "red";
  return "deep-red";
}

function pctChange(value, base) {
  return base > 0 ? ((value - base) / base) * 100 : 0;
}

function average(values) {
  return values.length === 0 ? 0 : values.reduce((total, value) => total + value, 0) / values.length;
}

function standardDeviation(values) {
  if (values.length === 0) return 0;
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(value) ? value : 50)));
}

function groupBy(items, getKey) {
  const map = new Map();

  for (const item of items) {
    const key = getKey(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }

  return map;
}
