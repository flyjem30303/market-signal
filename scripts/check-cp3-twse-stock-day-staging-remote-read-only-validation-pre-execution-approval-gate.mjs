import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_REMOTE_READ_ONLY_VALIDATION_PRE_EXECUTION_APPROVAL_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: remote read-only validation pre-execution approval gate recorded",
  "REVISE",
  "CEO does not approve remote read-only validation execution",
  "approval gate only",
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
  "service role usage approval not recorded",
  "target Supabase environment not confirmed",
  "remote command approval not recorded",
  "continue local-only CP3 decision-quality work",
  "commit pending local gate documents when .git write permission is available"
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
