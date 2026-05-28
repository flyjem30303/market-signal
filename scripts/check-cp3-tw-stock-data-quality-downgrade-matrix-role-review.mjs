import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TW_STOCK_DATA_QUALITY_DOWNGRADE_MATRIX_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: Taiwan stock data-quality downgrade matrix role review recorded",
  "REVISE",
  "not approved for runtime scoring or public real-score claims",
  "role review only",
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
  "A / PM+Dev",
  "C / Investment",
  "D / Legal",
  "F / Design",
  "source-rights blocker should force unavailable",
  "draft global model-version naming rules"
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
