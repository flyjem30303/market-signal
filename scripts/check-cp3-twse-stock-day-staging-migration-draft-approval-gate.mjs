import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_DRAFT_APPROVAL_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CEO migration draft approval gate recorded",
  "PROCEED",
  "CEO approves creating a candidate migration draft file and a static schema",
  "draft approval only",
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
  "source_id: twse-stock-day",
  "total_parsed_row_count: 787",
  "decision: ready_for_review",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "scripts/check-supabase-twse-stock-day-staging-schema.mjs",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "confirm no daily_prices modification exists",
  "connect to Supabase",
  "SUPABASE_SERVICE_ROLE_KEY",
  "A / PM+Dev",
  "B / Marketing",
  "C / Investment",
  "D / Legal",
  "E / CEO",
  "F / Design",
  "Approves draft creation only. Execution remains separately gated.",
  "create TWSE STOCK_DAY staging migration draft and static checker",
  "do not run SQL",
  "do not write Supabase",
  "do not create seed SQL"
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
