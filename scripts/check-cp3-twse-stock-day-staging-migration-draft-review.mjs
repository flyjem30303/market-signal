import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_DRAFT_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: migration draft recorded",
  "REVISE",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "scripts/check-supabase-twse-stock-day-staging-schema.mjs",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "RLS enabled on staging tables",
  "static checker only",
  "draft review only",
  "no SQL execution",
  "no Supabase writes",
  "no staging writes",
  "no daily_prices writes",
  "no seed SQL",
  "no raw market rows stored",
  "no CSV / JSON market data files",
  "no scoreSource=real",
  "no public backtest claims",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "CEO approval required before running migration",
  "checker reads migration draft from disk",
  "checker does not connect to Supabase",
  "checker does not use SUPABASE_SERVICE_ROLE_KEY",
  "checker does not run SQL",
  "checker does not write market rows",
  "A / PM+Dev",
  "B / Marketing",
  "C / Investment",
  "D / Legal",
  "E / CEO",
  "F / Design",
  "record role review for TWSE STOCK_DAY staging migration draft",
  "do not run SQL",
  "do not write Supabase"
];

const forbiddenPhrases = [
  "```sql",
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
