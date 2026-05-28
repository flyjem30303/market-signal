import fs from "node:fs";

const path = "docs/reviews/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_2026-05-29.md";
const requiredPhrases = [
  "Status: source-depth metadata smoke recorded",
  "REVISE",
  "one TWSE listed symbol only: 2330",
  "one selected route only: exchangeReport/STOCK_DAY",
  "start_month: 2023-03-01",
  "end_month: 2026-05-01",
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
  "month_count:",
  "total_row_count:",
  "target_row_count: 756",
  "unique_observed_month_count:",
  "first_observed_date:",
  "last_observed_date:",
  "zero_row_months:",
  "smoke_status:",
  "HTTP status summary:",
  "schema fields:",
  "zero-row month handling documented",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock"
];

const content = fs.readFileSync(path, "utf8");
const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));

console.log(
  JSON.stringify(
    {
      missing,
      report: path,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
