import fs from "node:fs";

const DEFAULT_SEED_PATH = "data/seeds/stocks.seed.json";
const DEFAULT_MONTHS = 3;
const DEFAULT_SESSIONS_PER_MONTH = 22;
const DEFAULT_BATCH_SIZE = 50;

const options = parseOptions(process.argv.slice(2));
const seedPath = options.seedPath ?? DEFAULT_SEED_PATH;
const requestedMonths = readPositiveInteger(options.months, DEFAULT_MONTHS);
const sessionsPerMonth = readPositiveInteger(options.sessionsPerMonth, DEFAULT_SESSIONS_PER_MONTH);
const batchSize = readPositiveInteger(options.batchSize, DEFAULT_BATCH_SIZE);

const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
if (!Array.isArray(seed)) {
  throw new Error(`${seedPath} must contain a JSON array`);
}

const activeTwseListedStocks = seed.filter(isActiveTwseListedCommonStock);
const excluded = {
  etf: seed.filter((stock) => stock.country === "TW" && stock.exchange === "TWSE" && stock.is_etf === true).length,
  index: seed.filter((stock) => stock.country === "TW" && stock.exchange === "TWSE" && stock.asset_type === "index").length,
  inactive: seed.filter((stock) => stock.country === "TW" && stock.exchange === "TWSE" && stock.is_active === false).length,
  nonTwse: seed.filter((stock) => stock.exchange !== "TWSE").length,
  nonCommonStock: seed.filter((stock) => stock.country === "TW" && stock.exchange === "TWSE" && !isFourDigitSymbol(stock.symbol)).length
};

const activeListedStockCount = activeTwseListedStocks.length;
const theoreticalRequestCount = activeListedStockCount * requestedMonths;
const estimatedTradingSessionRows = activeListedStockCount * requestedMonths * sessionsPerMonth;
const batchCount = Math.ceil(activeListedStockCount / batchSize);

const report = {
  status: "ok",
  mode: "a1_full_twse_equity_inventory_dry_run",
  scope: {
    universe: "TWSE listed common-stock equities only",
    filter: {
      country: "TW",
      exchange: "TWSE",
      asset_type: "stock",
      is_etf: false,
      is_active: true,
      symbolPolicy: "four_digit_common_stock_symbol"
    },
    exclusions: excluded
  },
  sourceEvidence: {
    seedPath,
    seedTotalRows: seed.length,
    stockIdsPrinted: false,
    rowPayloadsPrinted: false,
    rawPayloadsPrinted: false
  },
  inventory: {
    activeListedStockCount,
    requestedMonths,
    sessionsPerMonth,
    theoreticalRequestCount,
    estimatedTradingSessionRows,
    batchSize,
    batchCount
  },
  runtimeBoundary: {
    dryRunOnly: true,
    marketFetchAttempted: false,
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
    recommended: "bounded_source_depth_pilot_after_source_rights_and_rate_limit_approval",
    stillBlockedUntil: [
      "twse_stock_day_source_rights",
      "rate_limit_policy",
      "bounded_sample_size",
      "candidate_artifact_path",
      "staging_write_authorization"
    ]
  }
};

console.log(JSON.stringify(report, null, 2));

function isActiveTwseListedCommonStock(stock) {
  return (
    stock?.country === "TW" &&
    stock?.exchange === "TWSE" &&
    stock?.asset_type === "stock" &&
    stock?.is_etf === false &&
    stock?.is_active === true &&
    isFourDigitSymbol(stock.symbol)
  );
}

function isFourDigitSymbol(symbol) {
  return typeof symbol === "string" && /^\d{4}$/.test(symbol);
}

function parseOptions(args) {
  const parsed = {};

  for (const arg of args) {
    const [key, value] = arg.split("=");
    if (key === "--seed") parsed.seedPath = value;
    if (key === "--months") parsed.months = value;
    if (key === "--sessions-per-month") parsed.sessionsPerMonth = value;
    if (key === "--batch-size") parsed.batchSize = value;
  }

  return parsed;
}

function readPositiveInteger(value, fallback) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Expected positive integer, got ${value}`);
  }
  return parsed;
}
