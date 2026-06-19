import fs from "node:fs";

const SEED_PATH = "data/seeds/stocks.seed.json";
const SAMPLE_SIZE = 2;
const TARGET_MONTH = "2024-05";
const REQUEST_DELAY_MS = 900;
const TIMEOUT_MS = 15000;
const USER_AGENT = "taiwan-market-signal-bounded-source-depth-pilot/0.1";

const stocks = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"))
  .filter(
    (stock) =>
      stock.country === "TW" &&
      stock.exchange === "TWSE" &&
      stock.asset_type === "stock" &&
      stock.is_etf === false &&
      stock.is_active === true &&
      /^\d{4}$/.test(stock.symbol)
  )
  .slice(0, SAMPLE_SIZE);

if (stocks.length !== SAMPLE_SIZE) {
  throw new Error(`Expected ${SAMPLE_SIZE} local seed sample stocks, got ${stocks.length}`);
}

const startedAt = new Date().toISOString();
const results = [];

for (const [index, stock] of stocks.entries()) {
  if (index > 0) await delay(REQUEST_DELAY_MS);
  results.push(await probeStockMonth(stock.symbol, index + 1));
}

const summary = summarize(results);
const report = {
  status: "ok",
  mode: "a1_bounded_source_depth_pilot_once",
  authorization: {
    source: "chairman_current_thread",
    scope: "bounded_source_depth_pilot",
    sampleSize: SAMPLE_SIZE,
    monthCount: 1
  },
  source: {
    route: "TWSE exchangeReport/STOCK_DAY",
    targetMonth: TARGET_MONTH,
    requestDelayMs: REQUEST_DELAY_MS,
    timeoutMs: TIMEOUT_MS,
    userAgent: USER_AGENT,
    sampleSymbolsPrinted: false,
    rawPayloadStored: false,
    rowPayloadStored: false
  },
  summary,
  sampleResults: results.map((result) => ({
    sampleOrdinal: result.sampleOrdinal,
    httpStatus: result.httpStatus,
    contentTypeFamily: result.contentTypeFamily,
    parserStatus: result.parserStatus,
    rowCountBucket: bucketRows(result.rowCount),
    hasFields: result.hasFields,
    hasTitle: result.hasTitle,
    errorClass: result.errorClass
  })),
  runtimeBoundary: {
    marketFetchAttempted: true,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWrite: false,
    stagingRowsCreated: false,
    dailyPricesMutation: false,
    secretsPrinted: false,
    stockIdPayloadIncluded: false,
    rowPayloadIncluded: false,
    rawPayloadIncluded: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  nextGate: {
    recommended: summary.pilotStatus === "source_route_plausible" ? "rate_limited_candidate_generation_plan" : "source_route_repair",
    stillBlockedUntil: [
      "full_universe_rate_limit_policy",
      "sanitized_candidate_artifact_approval",
      "staging_write_authorization",
      "daily_prices_insert_missing_merge_authorization",
      "public_source_and_real_score_promotion_approval"
    ]
  },
  startedAt,
  finishedAt: new Date().toISOString()
};

console.log(JSON.stringify(report, null, 2));

async function probeStockMonth(symbol, sampleOrdinal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const date = `${TARGET_MONTH.replace("-", "")}01`;
  const url = `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${date}&stockNo=${encodeURIComponent(symbol)}`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json,text/plain,*/*",
        "user-agent": USER_AGENT
      },
      signal: controller.signal
    });
    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();
    return parseResponse({ contentType, httpStatus: response.status, sampleOrdinal, text });
  } catch (error) {
    return {
      contentTypeFamily: "unavailable",
      errorClass: classifyError(error),
      hasFields: false,
      hasTitle: false,
      httpStatus: 0,
      parserStatus: "request_failed",
      rowCount: 0,
      sampleOrdinal
    };
  } finally {
    clearTimeout(timer);
  }
}

function parseResponse({ contentType, httpStatus, sampleOrdinal, text }) {
  const contentTypeFamily = contentType.includes("json") ? "json" : contentType ? "non_json" : "unknown";
  if (!text.trim().startsWith("{")) {
    return {
      contentTypeFamily,
      errorClass: "non_json_body",
      hasFields: false,
      hasTitle: false,
      httpStatus,
      parserStatus: "non_json_body",
      rowCount: 0,
      sampleOrdinal
    };
  }

  try {
    const parsed = JSON.parse(text);
    const rows = Array.isArray(parsed.data) ? parsed.data : [];
    return {
      contentTypeFamily,
      errorClass: "",
      hasFields: Array.isArray(parsed.fields) && parsed.fields.length > 0,
      hasTitle: typeof parsed.title === "string" && parsed.title.trim().length > 0,
      httpStatus,
      parserStatus: rows.length > 0 ? "parsed_with_rows" : "parsed_zero_rows",
      rowCount: rows.length,
      sampleOrdinal
    };
  } catch {
    return {
      contentTypeFamily,
      errorClass: "json_parse_failed",
      hasFields: false,
      hasTitle: false,
      httpStatus,
      parserStatus: "json_parse_failed",
      rowCount: 0,
      sampleOrdinal
    };
  }
}

function summarize(values) {
  const httpStatusCounts = countBy(values, (value) => String(value.httpStatus));
  const parserStatusCounts = countBy(values, (value) => value.parserStatus);
  const successfulSamples = values.filter((value) => value.httpStatus === 200 && value.parserStatus === "parsed_with_rows").length;
  const zeroRowSamples = values.filter((value) => value.httpStatus === 200 && value.parserStatus === "parsed_zero_rows").length;
  const failedSamples = values.length - successfulSamples - zeroRowSamples;

  return {
    sampleCount: values.length,
    successfulSamples,
    zeroRowSamples,
    failedSamples,
    httpStatusCounts,
    parserStatusCounts,
    pilotStatus: successfulSamples === values.length ? "source_route_plausible" : "source_route_needs_repair_or_retry"
  };
}

function countBy(values, keyOf) {
  return values.reduce((acc, value) => {
    const key = keyOf(value);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function bucketRows(value) {
  if (value === 0) return "0";
  if (value <= 10) return "1-10";
  if (value <= 25) return "11-25";
  return "26+";
}

function classifyError(error) {
  if (error instanceof Error && error.name === "AbortError") return "timeout";
  if (error instanceof Error) return error.name || "request_error";
  return "request_error";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
