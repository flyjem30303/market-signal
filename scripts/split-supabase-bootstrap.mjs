import fs from "node:fs";
import path from "node:path";

const outputDir = "supabase/bootstrap-parts";
const parts = [
  {
    name: "001_schema.sql",
    source: "supabase/migrations/0001_initial_schema.sql"
  },
  {
    name: "002_etf_schema.sql",
    source: "supabase/migrations/0002_etf_data_model.sql"
  },
  {
    name: "003_markets.sql",
    source: "supabase/seed/000_seed_markets.sql"
  },
  {
    name: "004_stocks.sql",
    source: "supabase/seed/001_seed_stocks.sql"
  },
  {
    name: "005_latest_market_data.sql",
    source: "supabase/seed/002_seed_latest_market_data.sql"
  },
  {
    name: "006_data_runs.sql",
    source: "supabase/seed/003_seed_data_runs.sql"
  }
];

const verificationSql = `-- Verification queries.
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

function readSqlFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing SQL input: ${filePath}`);
  }

  return fs.readFileSync(filePath, "utf8").trim();
}

fs.rmSync(outputDir, { force: true, recursive: true });
fs.mkdirSync(outputDir, { recursive: true });

const manifest = [];

for (const part of parts) {
  const outputPath = path.join(outputDir, part.name);
  const sql = `-- Taiwan Market Signal Supabase bootstrap part.
-- Source: ${part.source}
-- Run parts in filename order.

${readSqlFile(part.source)}
`;

  fs.writeFileSync(outputPath, sql);
  manifest.push({
    file: outputPath.replaceAll("\\", "/"),
    source: part.source
  });
}

const verificationPath = path.join(outputDir, "007_verification.sql");
fs.writeFileSync(verificationPath, verificationSql);
manifest.push({
  file: verificationPath.replaceAll("\\", "/"),
  source: "generated verification queries"
});

fs.writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify({ generated_at: new Date().toISOString(), parts: manifest }, null, 2));

console.log(JSON.stringify({ output_dir: outputDir, parts: manifest, status: "ok" }, null, 2));
