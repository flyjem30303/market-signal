import fs from "node:fs";

const path = "docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md";
const requiredPhrases = [
  "Status: design only",
  "REVISE",
  "do not implement ingestion yet",
  "do not write Supabase",
  "do not write daily_prices",
  "do not commit raw market data",
  "do not commit CSV / JSON market data",
  "do not set scoreSource=real",
  "do not run CP3 backtests",
  "keep CP3 source-depth production gate not_ready",
  "keep public data source mock",
  "CEO approval required before implementation",
  "dry-run reporter only",
  "no database writes",
  "source_id: twse-stock-day",
  "minimum_delay_ms: 800",
  "max_retries_per_month: 3",
  "run_type: dry-run / staging / production",
  "zero_row_months",
  "http_status_summary",
  "日期 -> trade_date",
  "成交股數 -> volume",
  "成交金額 -> trade_value",
  "開盤價 -> open_price",
  "最高價 -> high_price",
  "最低價 -> low_price",
  "收盤價 -> close_price",
  "漲跌價差 -> price_change",
  "成交筆數 -> transaction_count",
  "convert ROC year to Gregorian year",
  "do not infer missing prices silently",
  "production source-depth gate remains not_ready until CEO approves ingestion",
  "staging_twse_stock_day_prices",
  "D legal approval recorded",
  "corporate-action handling documented",
  "inactive / delisted symbol policy documented",
  "Proceed only to controlled dry-run reporter design",
  "do not create staging tables yet"
];

const content = fs.readFileSync(path, "utf8");
const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));

console.log(
  JSON.stringify(
    {
      design: path,
      missing,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
