import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_DRY_RUN_HUMAN_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status",
  "REVISE",
  "Controlled dry-run",
  "ready_for_review",
  "source_id: twse-stock-day",
  "symbol: 2330",
  "requested_months: 39",
  "successful_months: 39",
  "total_parsed_row_count: 787",
  "duplicate_trade_dates: 0",
  "missing_required_field_count: 0",
  "non_numeric_price_count: 0",
  "no Supabase writes",
  "no staging writes",
  "no daily_prices writes",
  "no raw market rows stored",
  "no CSV / JSON market data files",
  "no scoreSource=real",
  "no public backtest claims",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "A / PM+Dev",
  "B / Marketing",
  "C / Investment",
  "D / Legal",
  "E / CEO",
  "F / Design",
  "staging boundary design",
  "do not create staging tables",
  "do not create seed SQL"
];

const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));

console.log(
  JSON.stringify(
    {
      missing,
      report: reportPath,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
