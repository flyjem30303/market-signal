import fs from "node:fs";

const DAILY_MARKET_SQL_PATH = "supabase/seed/002_seed_latest_market_data.sql";
const OUTPUT_PATH = "supabase/seed/003_seed_data_runs.sql";

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function extractLatestDate(sql, tableName) {
  const marker =
    tableName === "daily_prices"
      ? /as incoming\(country, exchange, symbol, trade_date, open, high, low, close, volume, turnover\)/u
      : /as incoming\(country, exchange, symbol, trade_date, pe, pb, dividend_yield\)/u;

  const markerIndex = sql.search(marker);
  const section = markerIndex === -1 ? sql : sql.slice(0, markerIndex);
  const dates = [...section.matchAll(/'(\d{4}-\d{2}-\d{2})'/gu)].map((match) => match[1]);
  return dates.at(-1) ?? null;
}

function countValueRows(sql, tableName) {
  const startText =
    tableName === "daily_prices"
      ? "insert into public.daily_prices"
      : "insert into public.daily_fundamentals";
  const endText =
    tableName === "daily_prices"
      ? "insert into public.daily_fundamentals"
      : "on conflict (stock_id, trade_date) do update set";

  const startIndex = sql.indexOf(startText);
  const endIndex = tableName === "daily_prices" ? sql.indexOf(endText, startIndex + 1) : sql.length;
  if (startIndex === -1 || endIndex === -1) return 0;

  const section = sql.slice(startIndex, endIndex);
  return (section.match(/\n\(/gu) ?? []).length;
}

const dailyMarketSql = fs.existsSync(DAILY_MARKET_SQL_PATH)
  ? fs.readFileSync(DAILY_MARKET_SQL_PATH, "utf8")
  : "";

const generatedAt = new Date().toISOString();
const latestPriceDate = extractLatestDate(dailyMarketSql, "daily_prices");
const latestFundamentalDate = extractLatestDate(dailyMarketSql, "daily_fundamentals");
const dailyPriceRows = countValueRows(dailyMarketSql, "daily_prices");
const dailyFundamentalRows = countValueRows(dailyMarketSql, "daily_fundamentals");

const runs = [
  {
    run_key: "bootstrap-market-exchanges",
    source_name: "local seed",
    source_url: "data/seeds/markets.seed.json",
    target_table: "market_exchanges",
    status: "success",
    row_count: 4,
    data_start_date: null,
    data_end_date: null,
    notes: "Seeded market metadata registry. Only TWSE is active.",
  },
  {
    run_key: "bootstrap-stocks",
    source_name: "TWSE OpenAPI",
    source_url: "https://openapi.twse.com.tw/v1/opendata/t187ap03_L",
    target_table: "stocks",
    status: "success",
    row_count: 1086,
    data_start_date: null,
    data_end_date: null,
    notes: "Seeded manual index / ETF placeholders plus TWSE listed common stocks.",
  },
  {
    run_key: "bootstrap-daily-prices",
    source_name: "TWSE OpenAPI",
    source_url: "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL",
    target_table: "daily_prices",
    status: "success",
    row_count: dailyPriceRows,
    data_start_date: latestPriceDate,
    data_end_date: latestPriceDate,
    notes: "Latest available daily OHLCV snapshot for symbols known in stock seed.",
  },
  {
    run_key: "bootstrap-daily-fundamentals",
    source_name: "TWSE OpenAPI",
    source_url: "https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_d",
    target_table: "daily_fundamentals",
    status: "success",
    row_count: dailyFundamentalRows,
    data_start_date: latestFundamentalDate,
    data_end_date: latestFundamentalDate,
    notes: "Latest available PE, PB, and dividend yield snapshot for symbols known in stock seed.",
  },
];

const values = runs.map((run) => `(
  ${sqlString(run.run_key)},
  ${sqlString(run.source_name)},
  ${sqlString(run.source_url)},
  ${sqlString(run.target_table)},
  ${sqlString(run.status)},
  ${run.row_count},
  ${sqlString(run.data_start_date)},
  ${sqlString(run.data_end_date)},
  ${sqlString(generatedAt)},
  ${sqlString(generatedAt)},
  ${sqlString(run.notes)}
)`);

const sql = `insert into public.data_runs (
  run_key,
  source_name,
  source_url,
  target_table,
  status,
  row_count,
  data_start_date,
  data_end_date,
  started_at,
  finished_at,
  notes
) values
${values.join(",\n")}
on conflict (run_key) do update set
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  target_table = excluded.target_table,
  status = excluded.status,
  row_count = excluded.row_count,
  data_start_date = excluded.data_start_date,
  data_end_date = excluded.data_end_date,
  started_at = excluded.started_at,
  finished_at = excluded.finished_at,
  notes = excluded.notes,
  updated_at = now();
`;

fs.writeFileSync(OUTPUT_PATH, sql);
console.log(`Generated ${OUTPUT_PATH}`);
