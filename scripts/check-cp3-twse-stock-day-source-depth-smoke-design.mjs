import fs from "node:fs";

const path = "docs/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_DESIGN_2026-05-29.md";
const requiredPhrases = [
  "Status: smoke design drafted",
  "REVISE",
  "STOCK_DAY returned month-level historical ranges for 2330",
  "confirm price history can plausibly reach at least 756 trading dates",
  "one TWSE listed symbol only: 2330",
  "one selected route only: exchangeReport/STOCK_DAY",
  "start_month: 2023-03-01",
  "end_month: 2026-05-01",
  "expected_months: 39",
  "expected_trading_dates_target: 756",
  "zero_row_months",
  "maximum 39 month probes",
  "minimum 800 ms delay between requests",
  "no parallel requests",
  "no raw market rows stored",
  "no CSV / JSON data files written",
  "no Supabase writes",
  "no daily_prices writes",
  "no scoreSource=real",
  "no public backtest claims",
  "source-depth gate remains not_ready unless CEO separately approves ingestion",
  "Automated collection, storage, attribution, and derived-score rights remain unresolved",
  "Keep public data source mock",
  "CP3 source-depth production gate remains not_ready"
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
