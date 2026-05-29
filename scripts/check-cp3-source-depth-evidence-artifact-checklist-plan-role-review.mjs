import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_ARTIFACT_CHECKLIST_PLAN_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence artifact checklist plan role review recorded",
  "REVISE",
  "accepted as a local-only governance artifact",
  "does not approve creating `docs/evidence`, creating future evidence artifact files, creating the future evidence checker",
  "source-depth approval, or public claims",
  "docs/CP3_SOURCE_DEPTH_EVIDENCE_ARTIFACT_CHECKLIST_PLAN_2026-05-29.md",
  "scripts/check-cp3-source-depth-evidence-artifact-checklist-plan.mjs",
  "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_CHECKER_PLAN_ROLE_REVIEW_2026-05-29.md",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "scripts/check-cp3-source-depth-evidence-artifact-checklist-plan.mjs passes",
  "scripts/check-cp3-source-depth-evidence-checker-plan-role-review.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "template sections, owners, readiness rules, file naming, and non-input boundaries",
  "not one that creates docs/evidence or evidence artifact files",
  "public claim boundary owner",
  "artifact approval does not imply public claim approval",
  "public-claim boundary",
  "Evidence Category, Market And Asset Scope, Symbol Scope, Date Range Summary",
  "Trading Date Count Summary, Field Availability Summary, Sample Size Summary, Reproducibility Steps",
  "Limitations, Review Owner, Approval Status, and CEO Synthesis",
  "embedding raw market rows, CSV / JSON market data files, Supabase reads, SQL execution",
  "source-rights approval claims",
  "local-only CP3 source-depth evidence empty template design",
  "must not create docs/evidence",
  "create evidence artifact",
  "create JSON samples",
  "fetch market data",
  "parse market rows",
  "connect to Supabase",
  "run SQL",
  "clear source-depth not_ready",
  "unavailable, internal_review, partial, stale, or approved",
  "textual and non-runtime",
  "CEO selects local-only source-depth evidence empty template design",
  "evidence artifact creation remains blocked",
  "future Markdown template and static checker requirements",
  "without creating docs/evidence, without evidence files, and without market data",
  "role review only",
  "do not create docs/evidence folder",
  "do not create future evidence artifact files",
  "do not create future evidence checker",
  "do not create JSON sample artifacts",
  "do not create JSON market data",
  "do not create CSV market data",
  "do not fetch market data",
  "do not parse market rows",
  "do not run source-depth validator against Supabase",
  "do not import copy tokens into public pages",
  "do not import copy tokens into public components",
  "do not import policy into public pages",
  "do not import policy into public components",
  "do not wire policy into data fetching",
  "do not implement runtime repository",
  "do not read remote data",
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
  "do not clear source-depth not_ready",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "draft CP3 source-depth evidence empty template design"
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
