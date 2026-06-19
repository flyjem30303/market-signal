import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const CONFIRM_ENV = "A1_FULL_TWSE_EQUITY_CANDIDATE_GENERATION_CONFIRM";
const CONFIRM_PHRASE = "A1_FULL_TWSE_EQUITY_CANDIDATE_GENERATION_2026_06_18";
const SEED_PATH = "data/seeds/stocks.seed.json";
const OUTPUT_DIR = "tmp/a1-full-twse-equity-candidates";
const SOURCE_ID = "twse-stock-day";
const SOURCE_URL_TEMPLATE = "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date={YYYYMMDD}&stockNo={symbol}";
const USER_AGENT = "taiwan-market-signal-a1-full-candidate/0.1";

const requestedMonths = 3;
const batchSize = 50;
const requestDelayMs = 900;
const batchPauseMs = 30000;
const stopIfHttp429CountAtLeast = 3;
const failureRateStopPercent = 15;

if (process.env[CONFIRM_ENV] !== CONFIRM_PHRASE) {
  console.log(
    JSON.stringify(
      {
        status: "preflight_blocked_missing_confirmation",
        requiredEnv: CONFIRM_ENV,
        requiredPhrase: CONFIRM_PHRASE,
        remoteFetchAttempted: false,
        filesWritten: false,
        sqlExecuted: false,
        supabaseConnectionAttempted: false,
        supabaseWrite: false,
        stagingRowsCreated: false,
        dailyPricesMutation: false,
        sourcePayloadStored: false,
        sourceUrlPayloadPrinted: false,
        stockIdListPrinted: false,
        secretsPrinted: false,
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      null,
      2
    )
  );
  process.exit(0);
}

const startedAt = new Date();
const runId = crypto.randomUUID();
const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
const symbols = seed.filter(isActiveTwseListedCommonStock).map((stock) => stock.symbol);
const monthKeys = buildRecentMonthKeys(startedAt, requestedMonths);
const outputPath = path.join(
  OUTPUT_DIR,
  `${formatTimestamp(startedAt)}-candidate.json`
);

const candidatePrices = [];
const httpStatusSummary = {};
const parserFlagSummary = {};
const zeroRowMonthCount = { count: 0 };
let outOfWindowRowCount = 0;
let attemptedRequests = 0;
let failedRequests = 0;
let http429Count = 0;

for (let offset = 0; offset < symbols.length; offset += batchSize) {
  const batch = symbols.slice(offset, offset + batchSize);

  for (const symbol of batch) {
    for (const monthKey of monthKeys) {
      attemptedRequests += 1;
      const url = buildStockDayUrl(monthKey, symbol);
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "user-agent": USER_AGENT
        }
      });

      httpStatusSummary[String(response.status)] = (httpStatusSummary[String(response.status)] ?? 0) + 1;
      if (response.status === 429) http429Count += 1;
      if (http429Count >= stopIfHttp429CountAtLeast) {
        throwStopped("http_429_stop_line_reached");
      }

      const text = await response.text();
      const parsed = parseJson(text);
      const rows = Array.isArray(parsed.data) ? parsed.data : [];

      if (!response.ok || parsed.stat !== "OK") {
        failedRequests += 1;
        addParserFlag(parserFlagSummary, !response.ok ? `http_${response.status}` : `stat_${String(parsed.stat ?? "missing")}`);
        maybeStopForFailureRate();
        await sleep(requestDelayMs);
        continue;
      }

      if (rows.length === 0) {
        zeroRowMonthCount.count += 1;
      }

      for (const sourceRow of rows) {
        const normalized = normalizeStockDayRow(sourceRow, symbol, startedAt, runId);
        if (normalized) {
          if (!isTradeDateInsideRequestedWindow(normalized.trade_date, monthKeys)) {
            outOfWindowRowCount += 1;
            addParserFlag(parserFlagSummary, "row_outside_requested_window");
            continue;
          }
          candidatePrices.push(normalized);
        } else {
          addParserFlag(parserFlagSummary, "row_parse_failed");
        }
      }

      await sleep(requestDelayMs);
    }
  }

  if (offset + batchSize < symbols.length) {
    await sleep(batchPauseMs);
  }
}

const finishedAt = new Date();
const sortedCandidatePrices = sortRowsAsc(candidatePrices);
const artifact = {
  runId,
  sourceId: SOURCE_ID,
  targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
  sourcePayloadIncluded: false,
  sourceUrlPayloadIncluded: false,
  secretsIncluded: false,
  sourcePayloadStored: false,
  sourceUrlPayloadPrinted: false,
  stockIdListPrinted: false,
  candidateRun: {
    run_id: runId,
    run_type: "staging_candidate",
    source_id: SOURCE_ID,
    source_url_template: SOURCE_URL_TEMPLATE,
    requested_symbol_count: symbols.length,
    requested_month_count: monthKeys.length,
    attempted_request_count: attemptedRequests,
    failed_request_count: failedRequests,
    total_candidate_row_count: sortedCandidatePrices.length,
    duplicate_trade_dates: countDuplicateTradeDates(sortedCandidatePrices),
    out_of_window_row_count: outOfWindowRowCount,
    zero_row_month_count: zeroRowMonthCount.count,
    http_status_summary: httpStatusSummary,
    parser_flag_summary: parserFlagSummary,
    rate_limit_policy: {
      mode: "full_twse_equity_symbol_month_fetch",
      requestDelayMs,
      batchSize,
      batchPauseMs,
      stopIfHttp429CountAtLeast,
      failureRateStopPercent
    },
    started_at: startedAt.toISOString(),
    finished_at: finishedAt.toISOString(),
    review_status: "pending_post_run_review",
    decision: "candidate_artifact_generated_no_staging_write"
  },
  candidatePrices: sortedCandidatePrices
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      status: "a1_full_twse_equity_rate_limited_candidate_artifact_generated",
      artifactPath: outputPath,
      attemptedRequests,
      candidatePriceRows: sortedCandidatePrices.length,
      outOfWindowRowCount,
      filesWritten: true,
      sqlExecuted: false,
      supabaseConnectionAttempted: false,
      supabaseWrite: false,
      stagingRowsCreated: false,
      dailyPricesMutation: false,
      sourcePayloadStored: false,
      sourceUrlPayloadPrinted: false,
      stockIdListPrinted: false,
      secretsPrinted: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function isActiveTwseListedCommonStock(stock) {
  return (
    stock?.country === "TW" &&
    stock?.exchange === "TWSE" &&
    stock?.asset_type === "stock" &&
    stock?.is_etf === false &&
    stock?.is_active === true &&
    typeof stock?.symbol === "string" &&
    /^\d{4}$/u.test(stock.symbol)
  );
}

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

function isTradeDateInsideRequestedWindow(tradeDate, requestedMonthKeys) {
  const requestedMonths = new Set(requestedMonthKeys.map((monthKey) => `${monthKey.slice(0, 4)}-${monthKey.slice(4, 6)}`));
  return requestedMonths.has(String(tradeDate ?? "").slice(0, 7));
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function normalizeStockDayRow(row, symbol, fetchedAt, runId) {
  if (!Array.isArray(row) || row.length < 9) return null;

  const tradeDate = parseRocDate(row[0]);
  const volume = parseNumber(row[1]);
  const tradeValue = parseNumber(row[2]);
  const openPrice = parseNumber(row[3]);
  const highPrice = parseNumber(row[4]);
  const lowPrice = parseNumber(row[5]);
  const closePrice = parseNumber(row[6]);
  const priceChange = parseSignedNumber(row[7]);
  const transactionCount = parseNumber(row[8]);

  const values = [volume, tradeValue, openPrice, highPrice, lowPrice, closePrice, transactionCount];
  if (!tradeDate || values.some((value) => !Number.isFinite(value) || value < 0)) return null;

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
    run_id: runId,
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
  if (!normalized || normalized === "--") return NaN;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : NaN;
}

function parseSignedNumber(value) {
  const normalized = String(value ?? "")
    .replaceAll(",", "")
    .replace(/[^\d.-]/gu, "")
    .trim();
  if (!normalized || normalized === "--") return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function hashJson(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function sortRowsAsc(rows) {
  return [...rows].sort((a, b) => {
    const byDate = a.trade_date.localeCompare(b.trade_date);
    return byDate !== 0 ? byDate : a.symbol.localeCompare(b.symbol);
  });
}

function countDuplicateTradeDates(rows) {
  const seen = new Set();
  let duplicates = 0;
  for (const row of rows) {
    const key = `${row.symbol}|${row.trade_date}`;
    if (seen.has(key)) duplicates += 1;
    seen.add(key);
  }
  return duplicates;
}

function addParserFlag(summary, flag) {
  summary[flag] = (summary[flag] ?? 0) + 1;
}

function maybeStopForFailureRate() {
  if (attemptedRequests < 20) return;
  const failureRate = (failedRequests / attemptedRequests) * 100;
  if (failureRate > failureRateStopPercent) throwStopped("failure_rate_stop_line_reached");
}

function throwStopped(reason) {
  console.log(
    JSON.stringify(
      {
        status: "stopped",
        reason,
        attemptedRequests,
        filesWritten: false,
        sqlExecuted: false,
        supabaseConnectionAttempted: false,
        dailyPricesMutation: false,
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      null,
      2
    )
  );
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTimestamp(date) {
  return date.toISOString().replace(/[-:]/gu, "").replace(/\.\d{3}Z$/u, "Z");
}
