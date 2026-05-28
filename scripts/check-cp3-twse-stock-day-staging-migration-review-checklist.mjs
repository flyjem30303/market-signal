import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_REVIEW_CHECKLIST_2026-05-29.md";

const requiredPhrases = [
  "Status: migration review checklist recorded",
  "REVISE",
  "checklist only",
  "no migration file",
  "no SQL code block",
  "no Supabase writes",
  "no staging writes",
  "no daily_prices writes",
  "no seed SQL",
  "no table creation",
  "no raw market rows stored",
  "no CSV / JSON market data files",
  "no scoreSource=real",
  "no public backtest claims",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "CEO approval required before migration implementation",
  "source_id: twse-stock-day",
  "total_parsed_row_count: 787",
  "decision: ready_for_review",
  "A / PM+Dev must confirm",
  "B / Marketing must confirm",
  "C / Investment must confirm",
  "D / Legal must confirm",
  "E / CEO must confirm",
  "F / Design must confirm",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "unique(run_id, exchange_code, symbol, trade_date) is accepted",
  "RLS implementation plan exists before migration",
  "cleanup is scoped by run_id only",
  "dry-run cleanup count is required before deletion",
  "Explicit Blockers",
  "legal approval missing",
  "CEO approval missing",
  "production table write included",
  "scoreSource=real dependency included",
  "The next step is a role review of this checklist, not SQL implementation",
  "record role review for TWSE STOCK_DAY staging migration checklist",
  "do not create migration file",
  "do not run SQL",
  "do not create staging tables"
];

const forbiddenPhrases = [
  "```sql",
  "CREATE TABLE ",
  "ALTER TABLE ",
  "INSERT INTO ",
  "CREATE INDEX ",
  "supabase.from(",
  ".insert(",
  ".upsert(",
  "createClient",
  "@supabase/supabase-js"
];

const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

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
