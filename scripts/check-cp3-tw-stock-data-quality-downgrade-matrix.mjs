import fs from "node:fs";

const reportPath = "docs/CP3_TW_STOCK_DATA_QUALITY_DOWNGRADE_MATRIX_2026-05-29.md";

const requiredPhrases = [
  "Status: draft, not approved",
  "Define how Taiwan stock scoring must degrade",
  "draft matrix only",
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
  "price-trend missing: max data_quality_score = 0",
  "any source-rights blocker: max data_quality_score = 0",
  "Forbidden public claims before CP3 approval",
  "Every market must have its own data-quality matrix before public real scores",
  "REVISE",
  "review Taiwan stock data-quality downgrade matrix by role"
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
