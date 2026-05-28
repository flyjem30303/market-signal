import fs from "node:fs";

const reportPath = "docs/reviews/CP3_NON_RUNTIME_UI_COPY_TOKEN_DRAFT_APPROVAL_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 non-runtime UI copy token draft approval gate recorded",
  "PROCEED",
  "drafting non-runtime UI copy tokens",
  "does not approve shipping copy",
  "draft non-runtime UI copy tokens",
  "include mock, internal_review, partial, stale, unavailable, and approved states",
  "add static guard against imports from public pages and public components",
  "approval gate only",
  "do not import copy tokens into public pages",
  "do not import copy tokens into public components",
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
  "draft non-runtime CP3 UI copy token artifact"
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
