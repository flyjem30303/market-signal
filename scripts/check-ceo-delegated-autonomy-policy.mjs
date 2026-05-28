import fs from "node:fs";

const reportPath = "docs/reviews/CEO_DELEGATED_AUTONOMY_POLICY_2026-05-29.md";

const requiredPhrases = [
  "Status: active autonomy policy recorded",
  "CEO may autonomously lead the project for several hours",
  "CEO May Proceed Without Asking",
  "write docs",
  "write static checkers",
  "run local static checks",
  "stage and commit project changes",
  "Keep public data source mock",
  "do not set scoreSource=real",
  "CP3 source-depth production gate remains not_ready",
  "no raw market data committed",
  "CEO Must Not Do Without A Specific Gate",
  "run SQL against Supabase",
  "write Supabase rows",
  "create production daily_prices rows",
  "write staging rows",
  "enable scoreSource=real",
  "commit .env.local",
  "CEO may draft and review TWSE STOCK_DAY staging migration files",
  "CEO may not execute the migration until a separate execution approval gate",
  "continue other local work instead of waiting idle",
  "Commit each coherent slice",
  "record CEO migration execution approval gate for TWSE STOCK_DAY staging"
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
