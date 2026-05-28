import fs from "node:fs";

const TWSE_DAILY_PRICES_URL =
  "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL";
const TWSE_DAILY_VALUATION_URL =
  "https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_d";
const STOCK_SEED_PATH = "data/seeds/stocks.seed.json";
const DAILY_MARKET_SQL_PATH = "supabase/seed/002_seed_latest_market_data.sql";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

function parseDate(value) {
  if (!value) return null;
  const compact = String(value).trim().replaceAll("/", "").replaceAll("-", "");

  if (/^\d{8}$/.test(compact)) {
    return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
  }

  if (/^\d{7}$/.test(compact)) {
    const year = Number(compact.slice(0, 3)) + 1911;
    return `${year}-${compact.slice(3, 5)}-${compact.slice(5, 7)}`;
  }

  return null;
}

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlNumber(value) {
  if (value === null || value === undefined) return "null";

  const normalized = String(value).trim().replaceAll(",", "");
  if (!normalized || normalized === "--") return "null";

  const number = Number(normalized);
  return Number.isFinite(number) ? String(number) : "null";
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "taiwan-market-signal/0.1",
    },
  });

  if (!response.ok) {
    throw new Error(`TWSE request failed: ${response.status} ${response.statusText}`);
  }

  const records = await response.json();
  if (!Array.isArray(records)) {
    throw new Error(`TWSE response was not an array: ${url}`);
  }

  return records;
}

function loadKnownSymbols() {
  const stocks = JSON.parse(fs.readFileSync(STOCK_SEED_PATH, "utf8"));
  return new Set(stocks.map((stock) => stock.symbol));
}

function normalizeDailyPrice(record, knownSymbols) {
  const symbol = String(record.Code ?? "").trim();
  const tradeDate = parseDate(record.Date);

  if (!knownSymbols.has(symbol) || !tradeDate) return null;

  return {
    symbol,
    trade_date: tradeDate,
    open: record.OpeningPrice,
    high: record.HighestPrice,
    low: record.LowestPrice,
    close: record.ClosingPrice,
    volume: record.TradeVolume,
    turnover: record.TradeValue,
  };
}

function normalizeDailyFundamental(record, knownSymbols) {
  const symbol = String(record.Code ?? "").trim();
  const tradeDate = parseDate(record.Date);

  if (!knownSymbols.has(symbol) || !tradeDate) return null;

  return {
    symbol,
    trade_date: tradeDate,
    pe: record.PEratio,
    pb: record.PBratio,
    dividend_yield: record.DividendYield,
  };
}

function buildDailyPricesSql(rows) {
  if (rows.length === 0) return "";

  const values = rows.map((row) => `(
  ${sqlString(row.symbol)},
  ${sqlString(row.trade_date)},
  ${sqlNumber(row.open)},
  ${sqlNumber(row.high)},
  ${sqlNumber(row.low)},
  ${sqlNumber(row.close)},
  ${sqlNumber(row.volume)},
  ${sqlNumber(row.turnover)}
)`);

  return `insert into public.daily_prices (
  stock_id,
  trade_date,
  open,
  high,
  low,
  close,
  volume,
  turnover
)
select
  stocks.id,
  incoming.trade_date::date,
  incoming.open,
  incoming.high,
  incoming.low,
  incoming.close,
  incoming.volume,
  incoming.turnover
from (
  values
${values.join(",\n")}
) as incoming(symbol, trade_date, open, high, low, close, volume, turnover)
join public.stocks on stocks.symbol = incoming.symbol
on conflict (stock_id, trade_date) do update set
  open = excluded.open,
  high = excluded.high,
  low = excluded.low,
  close = excluded.close,
  volume = excluded.volume,
  turnover = excluded.turnover;
`;
}

function buildDailyFundamentalsSql(rows) {
  if (rows.length === 0) return "";

  const values = rows.map((row) => `(
  ${sqlString(row.symbol)},
  ${sqlString(row.trade_date)},
  ${sqlNumber(row.pe)},
  ${sqlNumber(row.pb)},
  ${sqlNumber(row.dividend_yield)}
)`);

  return `insert into public.daily_fundamentals (
  stock_id,
  trade_date,
  pe,
  pb,
  dividend_yield
)
select
  stocks.id,
  incoming.trade_date::date,
  incoming.pe,
  incoming.pb,
  incoming.dividend_yield
from (
  values
${values.join(",\n")}
) as incoming(symbol, trade_date, pe, pb, dividend_yield)
join public.stocks on stocks.symbol = incoming.symbol
on conflict (stock_id, trade_date) do update set
  pe = excluded.pe,
  pb = excluded.pb,
  dividend_yield = excluded.dividend_yield;
`;
}

const knownSymbols = loadKnownSymbols();
const [dailyPriceRecords, dailyValuationRecords] = await Promise.all([
  fetchJson(TWSE_DAILY_PRICES_URL),
  fetchJson(TWSE_DAILY_VALUATION_URL),
]);

const dailyPrices = dailyPriceRecords
  .map((record) => normalizeDailyPrice(record, knownSymbols))
  .filter(Boolean);

const dailyFundamentals = dailyValuationRecords
  .map((record) => normalizeDailyFundamental(record, knownSymbols))
  .filter(Boolean);

if (dryRun) {
  console.log(
    JSON.stringify(
      {
        daily_price_source: TWSE_DAILY_PRICES_URL,
        daily_valuation_source: TWSE_DAILY_VALUATION_URL,
        known_symbols: knownSymbols.size,
        daily_price_records: dailyPriceRecords.length,
        matched_daily_prices: dailyPrices.length,
        daily_valuation_records: dailyValuationRecords.length,
        matched_daily_fundamentals: dailyFundamentals.length,
        price_sample: dailyPrices.slice(0, 3),
        valuation_sample: dailyFundamentals.slice(0, 3),
      },
      null,
      2,
    ),
  );
} else {
  const generatedAt = new Date().toISOString();
  const sql = `-- Latest TWSE daily market data.
-- Generated at ${generatedAt}.
-- Sources:
-- ${TWSE_DAILY_PRICES_URL}
-- ${TWSE_DAILY_VALUATION_URL}

${buildDailyPricesSql(dailyPrices)}

${buildDailyFundamentalsSql(dailyFundamentals)}
`;

  fs.mkdirSync("supabase/seed", { recursive: true });
  fs.writeFileSync(DAILY_MARKET_SQL_PATH, sql);
  console.log(`Generated ${DAILY_MARKET_SQL_PATH}`);
  console.log(`Matched ${dailyPrices.length} daily price rows`);
  console.log(`Matched ${dailyFundamentals.length} daily fundamental rows`);
}
