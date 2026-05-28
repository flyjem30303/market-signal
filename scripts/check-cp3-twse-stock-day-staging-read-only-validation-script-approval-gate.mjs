import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_READ_ONLY_VALIDATION_SCRIPT_APPROVAL_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CEO read-only validation script approval gate recorded",
  "PROCEED",
  "CEO approves creating a read-only validation script draft and a static safety",
  "CEO does not approve running the script against Supabase yet",
  "draft approval only",
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
  "do not make public backtest claims",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "CEO approval required before remote read-only validation",
  "scripts/validate-supabase-twse-stock-day-staging-readonly.mjs",
  "scripts/check-twse-stock-day-staging-readonly-validator-safety.mjs",
  "metadata-only query plan",
  "fail-closed behavior",
  "create read-only validator draft and static safety checker"
];

const forbiddenPhrases = [
  "```sql",
  ".insert(",
  ".upsert(",
  ".delete(",
  ".update("
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
