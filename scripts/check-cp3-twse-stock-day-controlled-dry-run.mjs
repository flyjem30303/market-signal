import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_CONTROLLED_DRY_RUN_2026-05-29.md";
const reporterPath = "scripts/report-cp3-twse-stock-day-controlled-dry-run.mjs";

const requiredReportPhrases = [
  "Status: controlled dry-run report recorded",
  "REVISE",
  "report-only dry-run",
  "source_id: twse-stock-day",
  "symbol: 2330",
  "start_month: 2023-03-01",
  "end_month: 2026-05-01",
  "expected_months: 39",
  "minimum_delay_ms: 800",
  "no raw market rows stored",
  "no CSV / JSON data files written",
  "no Supabase writes",
  "no staging writes",
  "no daily_prices writes",
  "no scoreSource=real",
  "no public backtest claims",
  "decision:",
  "duplicate_trade_dates:",
  "missing_required_field_count:",
  "non_numeric_price_count:",
  "non_numeric_volume_amount_count:",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "ready_for_review means this report is internally consistent enough for human",
  "CEO approval required before ingestion"
];

const forbiddenReporterPhrases = [
  "@supabase/supabase-js",
  "createClient",
  ".insert(",
  ".upsert(",
  "SUPABASE_SERVICE_ROLE_KEY"
];

const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const reporter = fs.readFileSync(reporterPath, "utf8");
const missing = requiredReportPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenReporterPhrases.filter((phrase) => reporter.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      report: reportPath,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
