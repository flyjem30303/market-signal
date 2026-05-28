import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_EXECUTION_APPROVAL_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CEO migration execution approval gate recorded",
  "REVISE",
  "CEO does not approve running the staging migration yet",
  "execution approval gate only",
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
  "D legal execution readiness not recorded",
  "storage purpose approval not recorded",
  "service role posture not approved",
  "RLS review not approved",
  "rollback and cleanup procedure not approved",
  "post-migration validation plan not recorded",
  "record TWSE STOCK_DAY staging migration execution readiness review"
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
