import fs from "node:fs";

const stocks = JSON.parse(fs.readFileSync("data/seeds/stocks.seed.json", "utf8"));

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

const values = stocks.map((stock) => `(
  ${sqlString(stock.symbol)},
  ${sqlString(stock.name)},
  ${sqlString(stock.market)},
  ${sqlString(stock.country ?? "TW")},
  ${sqlString(stock.exchange ?? stock.market)},
  ${sqlString(stock.currency ?? "TWD")},
  ${sqlString(stock.timezone ?? "Asia/Taipei")},
  ${sqlString(stock.asset_type ?? (stock.is_etf ? "etf" : stock.market === "INDEX" ? "index" : "stock"))},
  ${sqlString(stock.industry)},
  ${sqlString(stock.listed_date)},
  ${stock.is_etf ? "true" : "false"},
  ${stock.is_active ? "true" : "false"}
)`);

const sql = `insert into public.stocks (
  symbol,
  name,
  market,
  country,
  exchange,
  currency,
  timezone,
  asset_type,
  industry,
  listed_date,
  is_etf,
  is_active
) values
${values.join(",\n")}
on conflict (country, exchange, symbol) do update set
  name = excluded.name,
  market = excluded.market,
  currency = excluded.currency,
  timezone = excluded.timezone,
  asset_type = excluded.asset_type,
  industry = excluded.industry,
  listed_date = excluded.listed_date,
  is_etf = excluded.is_etf,
  is_active = excluded.is_active,
  updated_at = now();
`;

fs.mkdirSync("supabase/seed", { recursive: true });
fs.writeFileSync("supabase/seed/001_seed_stocks.sql", sql);
console.log("Generated supabase/seed/001_seed_stocks.sql");
