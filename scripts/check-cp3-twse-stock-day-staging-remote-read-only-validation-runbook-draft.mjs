import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_REMOTE_READ_ONLY_VALIDATION_RUNBOOK_DRAFT_2026-05-29.md";

const requiredPhrases = [
  "Status: remote read-only validation runbook draft recorded",
  "REVISE",
  "This runbook is a draft only",
  "does not approve remote execution",
  "runbook draft only",
  "do not run validator",
  "do not connect to Supabase",
  "do not run SQL",
  "do not write Supabase",
  "do not write staging rows",
  "do not write daily_prices",
  "do not create seed SQL",
  "do not store raw market rows",
  "do not commit CSV / JSON market data files",
  "do not set scoreSource=real",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "service role usage approval: not_ready",
  "target Supabase environment confirmation: not_ready",
  "legal approval for remote metadata reads: not_ready",
  "remote command approval: not_ready",
  "not approved to run",
  "TWSE_STOCK_DAY_STAGING_READONLY_CONFIRMATION=TWSE_STOCK_DAY_STAGING_READONLY node scripts/validate-supabase-twse-stock-day-staging-readonly.mjs",
  "any requested mutation",
  "no raw market rows",
  "Execution remains blocked",
  "review remote read-only validation runbook draft by role"
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
