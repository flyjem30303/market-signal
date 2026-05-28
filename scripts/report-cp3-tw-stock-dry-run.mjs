import fs from "node:fs";

const symbol = process.argv[2] ?? "2330";
const sqlPath = "supabase/seed/002_seed_latest_market_data.sql";
const modelVersion = "tw-stock-signal-v0.1-candidate-dry-run";
const missingModuleFlags = ["fundamentals", "flow", "market-context", "macro-risk"];
const warnings = ["internal dry-run only", "incomplete model modules", "not investment advice"];

const sql = fs.readFileSync(sqlPath, "utf8");
const priceRows = parseRows(sectionBetween(sql, "insert into public.daily_prices", "insert into public.daily_fundamentals"), 10);
const fundamentalRows = parseRows(sectionBetween(sql, "insert into public.daily_fundamentals", "on conflict"), 7);
const price = priceRows.find((row) => row.symbol === symbol);
const valuation = fundamentalRows.find((row) => row.symbol === symbol);

if (!price) {
  console.error(`No dry-run price row found for symbol ${symbol}`);
  process.exit(1);
}

const priceModule = scorePriceTrend(price);
const valuationModule = scoreValuation(valuation);
const moduleScores = [priceModule, valuationModule];
const healthScore = weightedAverage(moduleScores, "health");
const riskScore = weightedAverage(moduleScores, "risk");
const compositeScore = clamp(Math.round(healthScore - riskScore * 0.35 + 35), 0, 100);
const staleDataFlags = [
  "historical-depth-not-validated",
  "dry-run-latest-row-only",
  ...(valuation ? [] : ["valuation-missing"])
];
const dataQualityScore = valuation ? 45 : 35;
const report = {
  title: "CP3 Taiwan Stock Dry-Run Report",
  status: "report",
  generated_at: new Date().toISOString(),
  dry_run: {
    country: price.country,
    exchange: price.exchange,
    symbol,
    score_date: price.trade_date,
    model_version: modelVersion,
    scoreSource: "mock",
    public_eligible: false,
    health_score: healthScore,
    risk_score: riskScore,
    composite_score: compositeScore,
    signal: signalFor(compositeScore, riskScore, missingModuleFlags),
    data_quality_score: dataQualityScore,
    data_quality_grade: dataQualityScore >= 50 ? "C" : "D",
    module_scores: moduleScores,
    missing_module_flags: missingModuleFlags,
    stale_data_flags: staleDataFlags,
    warnings
  },
  source: {
    file: sqlPath,
    persistence: "none",
    writes: []
  }
};

console.log(JSON.stringify(report, null, 2));

function sectionBetween(value, start, end) {
  const startIndex = value.indexOf(start);
  const endIndex = value.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) return "";
  return value.slice(startIndex, endIndex);
}

function parseRows(section, fieldCount) {
  const rowPattern = /\(([\s\S]*?)\)/g;
  const rows = [];
  for (const match of section.matchAll(rowPattern)) {
    const fields = splitSqlFields(match[1]);
    if (fields.length !== fieldCount || fields[0] !== "TW") continue;
    rows.push(
      fieldCount === 10
        ? {
            country: fields[0],
            exchange: fields[1],
            symbol: fields[2],
            trade_date: fields[3],
            open: toNumber(fields[4]),
            high: toNumber(fields[5]),
            low: toNumber(fields[6]),
            close: toNumber(fields[7]),
            volume: toNumber(fields[8]),
            turnover: toNumber(fields[9])
          }
        : {
            country: fields[0],
            exchange: fields[1],
            symbol: fields[2],
            trade_date: fields[3],
            pe: toNumber(fields[4]),
            pb: toNumber(fields[5]),
            dividend_yield: toNumber(fields[6])
          }
    );
  }
  return rows;
}

function splitSqlFields(value) {
  return value
    .split(",")
    .map((field) => field.trim())
    .map((field) => field.replace(/^'|'$/g, ""));
}

function toNumber(value) {
  if (value === "null" || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function scorePriceTrend(row) {
  const intradayReturn = row.open && row.close ? (row.close - row.open) / row.open : 0;
  const intradayRange = row.low && row.high && row.close ? (row.high - row.low) / row.close : 0;
  return {
    module_key: "price-trend",
    health: clamp(Math.round(50 + intradayReturn * 600), 0, 100),
    risk: clamp(Math.round(40 + intradayRange * 800), 0, 100),
    weight: 0.18,
    status: "dry_run"
  };
}

function scoreValuation(row) {
  if (!row) {
    return {
      module_key: "valuation",
      health: 35,
      risk: 70,
      weight: 0.16,
      status: "dry_run"
    };
  }

  const peHealth = row.pe ? clamp(85 - row.pe, 10, 85) : 35;
  const pbHealth = row.pb ? clamp(80 - row.pb * 4, 10, 80) : 35;
  const yieldHealth = row.dividend_yield ? clamp(40 + row.dividend_yield * 4, 0, 75) : 30;
  const health = Math.round((peHealth + pbHealth + yieldHealth) / 3);
  const risk = clamp(Math.round(100 - health + (row.pe && row.pe > 30 ? 10 : 0)), 0, 100);

  return {
    module_key: "valuation",
    health,
    risk,
    weight: 0.16,
    status: "dry_run"
  };
}

function weightedAverage(rows, field) {
  const weight = rows.reduce((sum, row) => sum + row.weight, 0);
  return Math.round(rows.reduce((sum, row) => sum + row[field] * row.weight, 0) / weight);
}

function signalFor(compositeScore, riskScore, missingModules) {
  if (missingModules.length > 0 && compositeScore >= 62) return "orange";
  if (riskScore >= 88) return "deep-red";
  if (compositeScore >= 76 && riskScore < 62) return "green";
  if (compositeScore >= 62 && riskScore < 70) return "yellow";
  if (compositeScore >= 48 || riskScore < 78) return "orange";
  return "red";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
