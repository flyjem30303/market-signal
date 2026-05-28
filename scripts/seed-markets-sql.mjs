import fs from "node:fs";

const markets = JSON.parse(fs.readFileSync("data/seeds/markets.seed.json", "utf8"));

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

const values = markets.map((market) => `(
  ${sqlString(market.country)},
  ${sqlString(market.exchange)},
  ${sqlString(market.name)},
  ${sqlString(market.display_name)},
  ${sqlString(market.currency)},
  ${sqlString(market.timezone)},
  ${sqlString(market.locale)},
  ${market.is_active ? "true" : "false"}
)`);

const sql = `insert into public.market_exchanges (
  country,
  exchange,
  name,
  display_name,
  currency,
  timezone,
  locale,
  is_active
) values
${values.join(",\n")}
on conflict (country, exchange) do update set
  name = excluded.name,
  display_name = excluded.display_name,
  currency = excluded.currency,
  timezone = excluded.timezone,
  locale = excluded.locale,
  is_active = excluded.is_active,
  updated_at = now();
`;

fs.mkdirSync("supabase/seed", { recursive: true });
fs.writeFileSync("supabase/seed/000_seed_markets.sql", sql);
console.log("Generated supabase/seed/000_seed_markets.sql");
