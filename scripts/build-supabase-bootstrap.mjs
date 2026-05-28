import fs from "node:fs";

const outputPath = "supabase/bootstrap.sql";
const inputFiles = [
  "supabase/migrations/0001_initial_schema.sql",
  "supabase/migrations/0002_etf_data_model.sql",
  "supabase/seed/000_seed_markets.sql",
  "supabase/seed/001_seed_stocks.sql",
  "supabase/seed/002_seed_latest_market_data.sql",
  "supabase/seed/003_seed_data_runs.sql",
];

function readSqlFile(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`Missing SQL input: ${path}`);
  }

  return fs.readFileSync(path, "utf8").trim();
}

const generatedAt = new Date().toISOString();
const sections = inputFiles.map((path) => {
  const sql = readSqlFile(path);
  return `-- ============================================================================
-- Source: ${path}
-- ============================================================================

${sql}
`;
});

const bootstrapSql = `-- Taiwan Market Signal Supabase bootstrap SQL.
-- Generated at ${generatedAt}.
-- Run this in a new Supabase project's SQL editor.

begin;

${sections.join("\n")}

commit;

-- Verification queries.
select count(*) as stocks_count from public.stocks;
select count(*) as market_exchanges_count from public.market_exchanges;
select count(*) as daily_prices_count from public.daily_prices;
select count(*) as daily_fundamentals_count from public.daily_fundamentals;
select count(*) as etf_profiles_count from public.etf_profiles;
select count(*) as etf_daily_metrics_count from public.etf_daily_metrics;
select count(*) as etf_holdings_count from public.etf_holdings;
select target_table, status, row_count, data_end_date from public.data_runs order by target_table;
select max(trade_date) as latest_price_date from public.daily_prices;
select max(trade_date) as latest_fundamental_date from public.daily_fundamentals;
`;

fs.writeFileSync(outputPath, bootstrapSql);
console.log(`Generated ${outputPath}`);
