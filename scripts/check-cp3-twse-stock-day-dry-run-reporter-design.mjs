import fs from "node:fs";

const path = "docs/CP3_TWSE_STOCK_DAY_DRY_RUN_REPORTER_DESIGN_2026-05-29.md";
const requiredPhrases = [
  "Status: design only",
  "REVISE",
  "report-only dry-run",
  "do not implement reporter yet",
  "do not write Supabase",
  "do not create staging tables",
  "do not write daily_prices",
  "do not commit raw market data",
  "do not commit CSV / JSON market data",
  "do not set scoreSource=real",
  "do not run CP3 backtests",
  "keep CP3 source-depth production gate not_ready",
  "keep public data source mock",
  "CEO approval required before reporter implementation",
  "source_id: twse-stock-day",
  "minimum_delay_ms: 800",
  "discard raw rows after counting validation results",
  "no raw market rows stored",
  "no staging writes",
  "duplicate_trade_dates",
  "missing_required_field_count",
  "non_numeric_price_count",
  "non_numeric_volume_amount_count",
  "decision: report_only / blocked / ready_for_review",
  "CP3 source-depth production gate remains not_ready",
  "No database client should be imported by this reporter",
  "implement controlled dry-run reporter only if CEO approves"
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
