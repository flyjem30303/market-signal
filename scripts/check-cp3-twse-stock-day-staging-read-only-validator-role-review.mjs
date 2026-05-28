import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_READ_ONLY_VALIDATOR_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: read-only validator role review recorded",
  "REVISE",
  "Running it against Supabase is still not approved",
  "role review only",
  "do not run validator",
  "do not connect to Supabase",
  "do not run SQL",
  "do not write Supabase",
  "do not write staging rows",
  "do not write daily_prices",
  "do not create seed SQL",
  "do not store raw market rows",
  "do not set scoreSource=real",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "validator has explicit target confirmation guard",
  "validator has no insert / upsert / update / delete / rpc mutation",
  "A / PM+Dev",
  "D / Legal",
  "record CEO remote read-only validation approval gate"
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
