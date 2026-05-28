import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_REMOTE_READ_ONLY_VALIDATION_APPROVAL_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CEO remote read-only validation approval gate recorded",
  "REVISE",
  "CEO does not approve running the read-only validator against Supabase yet",
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
  "legal approval for remote metadata reads not recorded",
  "remote command approval not recorded",
  "record remote read-only validation readiness checklist"
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
