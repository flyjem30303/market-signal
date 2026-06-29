#!/usr/bin/env node

const MODEL_VERSION = "phase1-price-derived-v1";
const PAGE_SIZE = 1000;
const SAMPLE_LIMIT = 12;
const TWSE_STOCK_DAY_ALL_URL = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL";
const TWSE_MI_INDEX_URL = "https://www.twse.com.tw/exchangeReport/MI_INDEX";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running listed ETF freshness.`);
  }
  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

async function restGet(path) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`
    }
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`${path} query failed: ${json?.message ?? response.statusText}`);
  return json;
}

const activeEtfs = await readAllActiveListedEtfs();
const latestPriceDate = await latestDate("daily_prices");
const latestScoreDate = await latestDate("daily_scores", `model_version=eq.${MODEL_VERSION}`);

const [latestPriceRows, latestScoreRows] = await Promise.all([
  latestPriceDate ? readLatestRows("daily_prices", activeEtfs.map((asset) => asset.id), latestPriceDate) : [],
  latestScoreDate
    ? readLatestRows("daily_scores", activeEtfs.map((asset) => asset.id), latestScoreDate, `model_version=eq.${MODEL_VERSION}`)
    : []
]);

const latestPriceStockIds = new Set(latestPriceRows.map((row) => row.stock_id));
const latestScoreStockIds = new Set(latestScoreRows.map((row) => row.stock_id));
const missingLatestPrice = activeEtfs.filter((asset) => !latestPriceStockIds.has(asset.id));
const missingLatestScore = activeEtfs.filter((asset) => !latestScoreStockIds.has(asset.id));
const twseRowsByCode = await fetchLatestRowsByCode(latestPriceDate);
const excludedFromSameDayDenominator = classifySameDayDenominatorExclusions(missingLatestPrice, twseRowsByCode);
const includedActiveEtfs = activeEtfs.filter(
  (asset) => !excludedFromSameDayDenominator.some((row) => row.symbol === asset.symbol)
);
const includedLatestPriceCount = includedActiveEtfs.filter((asset) => latestPriceStockIds.has(asset.id)).length;
const includedLatestScoreCount = includedActiveEtfs.filter((asset) => latestScoreStockIds.has(asset.id)).length;

const result = {
  activeListedEtfCount: activeEtfs.length,
  adjustedCoveragePolicy: "exclude_latest_twse_absent_or_no_parseable_close_from_same_day_denominator",
  adjustedListedEtfCount: includedActiveEtfs.length,
  adjustedPriceCoverageCount: includedLatestPriceCount,
  adjustedPriceCoveragePct: pct(includedLatestPriceCount, includedActiveEtfs.length),
  adjustedScoreCoverageCount: includedLatestScoreCount,
  adjustedScoreCoveragePct: pct(includedLatestScoreCount, includedActiveEtfs.length),
  excludedFromSameDayDenominatorCount: excludedFromSameDayDenominator.length,
  excludedFromSameDayDenominatorSample: excludedFromSameDayDenominator.slice(0, SAMPLE_LIMIT),
  latestPriceCoverageCount: latestPriceStockIds.size,
  latestPriceCoveragePct: pct(latestPriceStockIds.size, activeEtfs.length),
  latestPriceDate,
  latestScoreCoverageCount: latestScoreStockIds.size,
  latestScoreCoveragePct: pct(latestScoreStockIds.size, activeEtfs.length),
  latestScoreDate,
  missingLatestPriceCount: missingLatestPrice.length,
  missingLatestPriceSample: sampleSymbols(missingLatestPrice),
  missingLatestScoreCount: missingLatestScore.length,
  missingLatestScoreSample: sampleSymbols(missingLatestScore),
  modelVersion: MODEL_VERSION,
  status:
    activeEtfs.length > 0 &&
    latestPriceDate &&
    latestScoreDate &&
    latestPriceDate === latestScoreDate &&
    includedLatestPriceCount === includedActiveEtfs.length &&
    includedLatestScoreCount === includedActiveEtfs.length
      ? "ok"
      : "review"
};

console.log(JSON.stringify(result, null, 2));

if (result.status !== "ok") {
  process.exitCode = 1;
}

async function readAllActiveListedEtfs() {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const batch = await restGet(
      `stocks?select=id,symbol,name&country=eq.TW&exchange=eq.TWSE&asset_type=eq.etf&is_active=eq.true&order=symbol.asc&offset=${offset}&limit=${PAGE_SIZE}`
    );
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
}

async function latestDate(table, extraFilter = null) {
  const filter = extraFilter ? `&${extraFilter}` : "";
  const rows = await restGet(`${table}?select=trade_date${filter}&order=trade_date.desc&limit=1`);
  return rows?.[0]?.trade_date ?? null;
}

async function readLatestRows(table, stockIds, tradeDate, extraFilter = null) {
  const rows = [];
  for (let start = 0; start < stockIds.length; start += 100) {
    const ids = stockIds.slice(start, start + 100).join(",");
    const filter = extraFilter ? `&${extraFilter}` : "";
    rows.push(
      ...(await restGet(
        `${table}?select=stock_id&trade_date=eq.${encodeURIComponent(tradeDate)}${filter}&stock_id=in.(${ids})`
      ))
    );
  }
  return rows;
}

function pct(value, total) {
  return total > 0 ? Math.round((value / total) * 10000) / 100 : 0;
}

function sampleSymbols(rows) {
  return rows.slice(0, SAMPLE_LIMIT).map((row) => row.symbol);
}

async function fetchLatestRowsByCode(targetDate) {
  const stockDayRows = await fetchTwseLatestRowsByCode();
  const stockDayLatestDate = newestDate([...stockDayRows.values()].map((row) => normalizeDate(row.Date)).filter(Boolean));
  if (!targetDate || stockDayLatestDate === targetDate) return stockDayRows;
  return fetchMiIndexRowsByCode(targetDate);
}

async function fetchTwseLatestRowsByCode() {
  const response = await fetch(TWSE_STOCK_DAY_ALL_URL, {
    headers: {
      accept: "application/json, text/plain;q=0.9, */*;q=0.1",
      "cache-control": "no-cache",
      "user-agent": "market-signal-phase1.1-etf-freshness/1.0 (+https://github.com/flyjem30303/market-signal)"
    }
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`TWSE ETF code presence fetch failed: ${response.status} ${response.statusText}`);
  if (/^\s*</u.test(text)) throw new Error("TWSE ETF code presence fetch returned an HTML payload.");
  const rows = JSON.parse(text);
  if (!Array.isArray(rows)) throw new Error("TWSE ETF code presence fetch returned a non-array payload.");
  return new Map(
    rows
      .map((row) => [String(row.Code ?? "").trim().toUpperCase(), row])
      .filter(([code]) => Boolean(code))
  );
}

async function fetchMiIndexRowsByCode(tradeDate) {
  const response = await fetch(
    `${TWSE_MI_INDEX_URL}?${new URLSearchParams({ response: "json", type: "ALLBUT0999", date: tradeDate.replaceAll("-", "") }).toString()}`,
    {
      headers: {
        accept: "application/json, text/plain;q=0.9, */*;q=0.1",
        "cache-control": "no-cache",
        "user-agent": "market-signal-phase1.1-etf-freshness/1.0 (+https://github.com/flyjem30303/market-signal)"
      }
    }
  );
  const text = await response.text();
  if (!response.ok) throw new Error(`TWSE MI_INDEX ETF code presence fetch failed: ${response.status} ${response.statusText}`);
  if (/^\s*</u.test(text)) throw new Error("TWSE MI_INDEX ETF code presence fetch returned an HTML payload.");
  const payload = JSON.parse(text);
  if (payload?.stat !== "OK" || !Array.isArray(payload?.tables)) throw new Error("TWSE MI_INDEX ETF code presence fetch returned an invalid payload.");
  const table = payload.tables.find((item) => Array.isArray(item?.fields) && item.fields.includes("證券代號") && item.fields.includes("收盤價"));
  if (!table || !Array.isArray(table.data)) throw new Error("TWSE MI_INDEX ETF code presence fetch did not include daily close table.");
  return new Map(
    table.data
      .map((row) => [
        String(row?.[0] ?? "").trim().toUpperCase(),
        {
          ClosingPrice: row?.[8],
          Code: row?.[0],
          Date: tradeDate
        }
      ])
      .filter(([code]) => Boolean(code))
  );
}

function classifySameDayDenominatorExclusions(missingAssets, rowsByCode) {
  return missingAssets
    .map((asset) => {
      const row = rowsByCode.get(String(asset.symbol).toUpperCase());
      if (!row) {
        return {
          reason: "not_present_in_latest_twse_payload",
          symbol: asset.symbol
        };
      }
      if (numberValue(row.ClosingPrice) == null) {
        return {
          reason: "present_without_parseable_close",
          symbol: asset.symbol
        };
      }
      return null;
    })
    .filter(Boolean);
}

function newestDate(dates) {
  return dates.slice().sort().at(-1) ?? null;
}

function normalizeDate(value) {
  const raw = stringValue(value).replace(/\//g, "-");
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const compactRoc = raw.match(/^(\d{3})(\d{2})(\d{2})$/);
  if (compactRoc) return `${Number(compactRoc[1]) + 1911}-${compactRoc[2]}-${compactRoc[3]}`;
  const compactIso = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactIso) return `${compactIso[1]}-${compactIso[2]}-${compactIso[3]}`;
  return null;
}

function stringValue(value) {
  return value == null ? "" : String(value).trim();
}

function numberValue(value) {
  const raw = stringValue(value).replace(/,/g, "");
  if (!raw || raw === "--") return null;
  const number = Number(raw);
  return Number.isFinite(number) ? number : null;
}
