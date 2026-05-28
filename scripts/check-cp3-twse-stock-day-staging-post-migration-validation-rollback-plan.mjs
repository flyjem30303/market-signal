import fs from "node:fs";

const reportPath = "docs/CP3_TWSE_STOCK_DAY_STAGING_POST_MIGRATION_VALIDATION_ROLLBACK_PLAN_2026-05-29.md";

const requiredPhrases = [
  "Status: plan only",
  "REVISE",
  "plan only",
  "do not run SQL",
  "do not connect to Supabase",
  "do not write Supabase",
  "do not write staging rows",
  "do not write daily_prices",
  "do not create seed SQL",
  "do not store raw market rows",
  "do not commit CSV / JSON market data files",
  "do not set scoreSource=real",
  "do not make public backtest claims",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "staging_twse_stock_day_runs table exists",
  "staging_twse_stock_day_prices table exists",
  "RLS is enabled on both staging tables",
  "no production daily_prices rows were changed",
  "rollback must not touch daily_prices",
  "rollback must require CEO approval before destructive execution",
  "cleanup by run_id only",
  "dry-run cleanup count before deletion",
  "A / PM+Dev",
  "D / Legal",
  "draft read-only post-migration validation script design"
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
