import fs from "node:fs";

const reportPath = "docs/CP3_TWSE_STOCK_DAY_STAGING_READ_ONLY_VALIDATION_SCRIPT_DESIGN_2026-05-29.md";

const requiredPhrases = [
  "Status: design only",
  "REVISE",
  "design only",
  "do not create database-connected script",
  "do not connect to Supabase",
  "do not run SQL",
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
  "scripts/validate-supabase-twse-stock-day-staging-readonly.mjs",
  "This file must not be created until a separate CEO gate approves read-only",
  "staging_twse_stock_day_runs table existence",
  "staging_twse_stock_day_prices table existence",
  "RLS enabled status",
  "candidate row count by run_id",
  "raw market rows",
  "read-only client configuration only",
  "no insert",
  "no upsert",
  "no delete",
  "no update",
  "no raw SQL execution",
  "record CEO read-only validation script approval gate"
];

const forbiddenPhrases = [
  "```sql",
  "supabase.from(",
  ".insert(",
  ".upsert(",
  ".delete(",
  ".update(",
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
