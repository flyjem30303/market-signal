import fs from "node:fs";

const reportPath = "docs/reviews/CP3_UI_STATE_DISCLOSURE_PLACEMENT_PLAN_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 UI state and disclosure placement plan role review recorded",
  "REVISE",
  "not approved for UI implementation",
  "role review only",
  "do not import policy into public pages",
  "do not import policy into public components",
  "do not wire policy into data fetching",
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
  "D / Legal",
  "F / Design",
  "Hidden or hover-only caveats are not sufficient",
  "record CEO gate for non-runtime CP3 UI copy token draft"
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
