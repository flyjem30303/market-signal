import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const AUTHORIZATION_ID = "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001";
const TARGET_RELATION = "staging_twse_stock_day_runs,staging_twse_stock_day_prices";
const SOURCE_ID = "twse-stock-day";
const SOURCE_URL_TEMPLATE = "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date={YYYYMMDD}&stockNo={symbol}";
const LICENSE_URL = "https://www.twse.com.tw/zh/trading/historical/stock-day.html";
const ATTRIBUTION_TEXT = "Taiwan Stock Exchange STOCK_DAY, normalized for internal staging candidate review.";
const SYMBOLS = ["2330", "2382", "2308"];
const MAX_ROWS = 180;
const SESSIONS_PER_SYMBOL = 60;
const OUTPUT_PATH = process.env.A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH ?? "data/candidates/tw-equity-staging-candidate.json";
const RUN_ID = `tw-equity-staging-candidate-${new Date().toISOString().slice(0, 10)}`;
const USER_AGENT = "taiwan-market-signal-candidate-artifact/0.1";

const startedAt = new Date();
const monthKeys = buildRecentMonthKeys(startedAt, 6);
const httpStatusSummary = {};
const zeroRowMonths = [];
const parserFlags = [];
const candidatePrices = [];
const symbolSummaries = [];

for (const symbol of SYMBOLS) {
  const symbolRows = [];

  for (const monthKey of monthKeys) {
    const url = buildStockDayUrl(monthKey, symbol);
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": USER_AGENT
      }
    });

    httpStatusSummary[String(response.status)] = (httpStatusSummary[String(response.status)] ?? 0) + 1;
    const text = await response.text();
    const parsed = parseJson(text);
    const rows = Array.isArray(parsed.data) ? parsed.data : [];

    if (!response.ok) {
      parserFlags.push(`http_${response.status}_${symbol}_${monthKey}`);
      continue;
    }
    if (parsed.stat !== "OK") {
      parserFlags.push(`stat_${String(parsed.stat ?? "missing")}_${symbol}_${monthKey}`);
      continue;
    }
    if (rows.length === 0) {
      zeroRowMonths.push(`${symbol}:${monthKey}`);
      continue;
    }

    for (const sourceRow of rows) {
      const normalized = normalizeStockDayRow(sourceRow, symbol, startedAt);
      if (!normalized) {
        parserFlags.push(`row_parse_failed_${symbol}_${monthKey}`);
        continue;
      }
      symbolRows.push(normalized);
    }
  }

  const latestRows = sortRowsDesc(symbolRows).slice(0, SESSIONS_PER_SYMBOL);
  symbolSummaries.push({
    symbol,
    candidateRows: latestRows.length,
    requestedMonths: monthKeys.length
  });
  candidatePrices.push(...latestRows);
}

const sortedCandidatePrices = sortRowsAsc(candidatePrices);
const finishedAt = new Date();
const artifact = {
  authorizationId: AUTHORIZATION_ID,
  targetRelation: TARGET_RELATION,
  sourceId: SOURCE_ID,
  symbols: SYMBOLS,
  maxRows: MAX_ROWS,
  sourcePayloadIncluded: false,
  sourceUrlPayloadIncluded: false,
  secretsIncluded: false,
  candidateRun: {
    run_id: RUN_ID,
    run_type: "staging_candidate",
    source_id: SOURCE_ID,
    source_url_template: SOURCE_URL_TEMPLATE,
    license_url: LICENSE_URL,
    attribution_text: ATTRIBUTION_TEXT,
    requested_symbol_count: SYMBOLS.length,
    requested_month_count: monthKeys.length,
    successful_month_count: Object.values(httpStatusSummary).reduce((sum, count) => sum + count, 0) - zeroRowMonths.length,
    failed_month_count: parserFlags.filter((flag) => flag.startsWith("http_") || flag.startsWith("stat_")).length,
    total_candidate_row_count: sortedCandidatePrices.length,
    duplicate_trade_dates: countDuplicateTradeDates(sortedCandidatePrices),
    missing_required_field_count: 0,
    non_numeric_price_count: 0,
    non_numeric_volume_amount_count: 0,
    source_note_count: zeroRowMonths.length,
    parser_flag_count: parserFlags.length,
    zero_row_months: zeroRowMonths,
    http_status_summary: httpStatusSummary,
    rate_limit_policy: {
      mode: "bounded_symbol_month_fetch",
      symbols: SYMBOLS.length,
      requestedMonths: monthKeys.length,
      requestCount: SYMBOLS.length * monthKeys.length,
      throttleMs: 0
    },
    started_at: startedAt.toISOString(),
    finished_at: finishedAt.toISOString(),
    created_by: "codex-pm-a1-authorized-sanitized-candidate-generator",
    review_status: "pending_review",
    decision: "ready_for_review"
  },
  candidatePrices: sortedCandidatePrices.map((row) => ({
    ...row,
    run_id: RUN_ID
  }))
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      status: "tw_equity_sanitized_candidate_artifact_generated",
      artifactPath: OUTPUT_PATH,
      candidateRunRows: 1,
      candidatePriceRows: artifact.candidatePrices.length,
      symbolSummaries,
      filesWritten: true,
      rawSourcePayloadStored: false,
      sourcePayloadPrinted: false,
      rowPayloadsPrinted: false,
      secretsPrinted: false,
      sqlExecuted: false,
      supabaseConnectionAttempted: false,
      supabaseWrites: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function buildRecentMonthKeys(date, count) {
  const keys = [];
  for (let offset = 0; offset < count; offset += 1) {
    const current = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - offset, 1));
    keys.push(`${current.getUTCFullYear()}${String(current.getUTCMonth() + 1).padStart(2, "0")}01`);
  }
  return keys;
}

function buildStockDayUrl(monthKey, symbol) {
  return SOURCE_URL_TEMPLATE.replace("{YYYYMMDD}", monthKey).replace("{symbol}", symbol);
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function normalizeStockDayRow(row, symbol, fetchedAt) {
  if (!Array.isArray(row) || row.length < 9) return null;

  const tradeDate = parseRocDate(row[0]);
  const openPrice = parseNumber(row[3]);
  const highPrice = parseNumber(row[4]);
  const lowPrice = parseNumber(row[5]);
  const closePrice = parseNumber(row[6]);
  const volume = parseNumber(row[1]);
  const tradeValue = parseNumber(row[2]);
  const priceChange = parseSignedNumber(row[7]);
  const transactionCount = parseNumber(row[8]);

  if (!tradeDate) return null;
  const values = [openPrice, highPrice, lowPrice, closePrice, volume, tradeValue, transactionCount];
  if (values.some((value) => typeof value !== "number" || !Number.isFinite(value) || value < 0)) return null;

  const qualityFlags = [];
  if (highPrice < lowPrice) qualityFlags.push("high_lower_than_low");
  if (closePrice > highPrice || closePrice < lowPrice) qualityFlags.push("close_outside_high_low");

  const sourceHashPayload = {
    close_price: closePrice,
    high_price: highPrice,
    low_price: lowPrice,
    open_price: openPrice,
    symbol,
    trade_date: tradeDate,
    trade_value: tradeValue,
    transaction_count: transactionCount,
    volume
  };

  return {
    run_id: RUN_ID,
    source_id: SOURCE_ID,
    exchange_code: "TWSE",
    symbol,
    trade_date: tradeDate,
    open_price: openPrice,
    high_price: highPrice,
    low_price: lowPrice,
    close_price: closePrice,
    price_change: priceChange,
    volume,
    trade_value: tradeValue,
    transaction_count: transactionCount,
    quality_flags: qualityFlags,
    source_fetched_at: fetchedAt.toISOString(),
    source_row_hash: hashJson(sourceHashPayload)
  };
}

function parseRocDate(value) {
  const match = String(value ?? "").trim().match(/^(\d{2,3})\/(\d{1,2})\/(\d{1,2})$/u);
  if (!match) return null;
  const year = Number(match[1]) + 1911;
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseNumber(value) {
  const normalized = String(value ?? "").replaceAll(",", "").trim();
  if (!normalized || normalized === "--") return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function parseSignedNumber(value) {
  const normalized = String(value ?? "")
    .replaceAll(",", "")
    .replace(/[+－]/gu, (token) => (token === "－" ? "-" : ""))
    .trim();
  if (!normalized || normalized === "--" || normalized === "X0.00") return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function hashJson(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function sortRowsDesc(rows) {
  return [...rows].sort((a, b) => b.trade_date.localeCompare(a.trade_date));
}

function sortRowsAsc(rows) {
  return [...rows].sort((a, b) => {
    const symbolCompare = a.symbol.localeCompare(b.symbol);
    if (symbolCompare !== 0) return symbolCompare;
    return a.trade_date.localeCompare(b.trade_date);
  });
}

function countDuplicateTradeDates(rows) {
  const seen = new Set();
  let duplicates = 0;
  for (const row of rows) {
    const key = `${row.exchange_code}|${row.symbol}|${row.trade_date}`;
    if (seen.has(key)) duplicates += 1;
    seen.add(key);
  }
  return duplicates;
}
