import fs from "node:fs";

const sqlPath = "supabase/seed/002_seed_latest_market_data.sql";
const sql = fs.readFileSync(sqlPath, "utf8");
const priceDates = uniqueDates(sectionBetween(sql, "insert into public.daily_prices", "insert into public.daily_fundamentals"));
const fundamentalDates = uniqueDates(sectionBetween(sql, "insert into public.daily_fundamentals", "on conflict"));
const requirements = {
  min_price_trade_dates: 756,
  min_fundamental_trade_dates: 252,
  preferred_start_date: "2020-01-01"
};
const blockers = [
  priceDates.length >= requirements.min_price_trade_dates ? null : "price-history-depth-not-ready",
  fundamentalDates.length >= requirements.min_fundamental_trade_dates ? null : "fundamental-history-depth-not-ready",
  priceDates[0] <= requirements.preferred_start_date ? null : "price-history-starts-after-2020-01-01",
  fundamentalDates[0] <= requirements.preferred_start_date ? null : "fundamental-history-starts-after-2020-01-01"
].filter(Boolean);

console.log(
  JSON.stringify(
    {
      blockers,
      fundamental_date_count: fundamentalDates.length,
      fundamental_first_date: fundamentalDates[0] ?? null,
      fundamental_latest_date: fundamentalDates.at(-1) ?? null,
      price_date_count: priceDates.length,
      price_first_date: priceDates[0] ?? null,
      price_latest_date: priceDates.at(-1) ?? null,
      requirements,
      source: sqlPath,
      status: blockers.length === 0 ? "ok" : "not_ready"
    },
    null,
    2
  )
);

if (blockers.length > 0) {
  process.exitCode = 1;
}

function sectionBetween(value, start, end) {
  const startIndex = value.indexOf(start);
  const endIndex = value.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) return "";
  return value.slice(startIndex, endIndex);
}

function uniqueDates(section) {
  return [...new Set([...section.matchAll(/'(\d{4}-\d{2}-\d{2})'/g)].map((match) => match[1]))].sort();
}
