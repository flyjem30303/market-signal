import fs from "node:fs";

const reportPath = "docs/reviews/CP3_RUNTIME_POLICY_DRAFT_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 runtime policy draft role review recorded",
  "REVISE",
  "accepted as a non-runtime artifact",
  "not approved for imports into public pages",
  "not approved for imports into public pages, public components",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
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
  "Runtime wiring remains blocked",
  "record CEO CP3 runtime policy implementation-readiness gate"
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
