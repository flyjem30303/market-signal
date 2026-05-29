import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_CHECKER_PLAN_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence checker plan role review recorded",
  "REVISE",
  "accepted as a local-only governance artifact",
  "does not approve creating the future evidence checker, historical ingestion, remote validation, Supabase reads, SQL execution",
  "source-depth approval, or public claims",
  "docs/CP3_SOURCE_DEPTH_EVIDENCE_CHECKER_PLAN_2026-05-29.md",
  "scripts/check-cp3-source-depth-evidence-checker-plan.mjs",
  "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_MATRIX_ROLE_REVIEW_2026-05-29.md",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "scripts/check-cp3-source-depth-evidence-checker-plan.mjs passes",
  "scripts/check-cp3-source-depth-evidence-matrix-role-review.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "artifact shape, approval-status rules, failure messages, and explicit non-inputs",
  "not the future data parser or remote validator",
  "does not imply public claim approval, SEO copy claims, model quality claims, or scoreSource real claims",
  "price history depth, fundamental history depth",
  "preferred start date, continuous symbol coverage",
  "missing-date handling",
  "corporate-action handling",
  "inactive and delisted symbol handling",
  "endpoint stability, field semantics, market-calendar alignment, sample-size thresholds",
  "reproducibility separate",
  "source-rights approval, remote validation approval, backtest approval, public claim approval, and personalized investment advice boundaries",
  "local-only CP3 source-depth evidence artifact checklist plan",
  "must not create JSON samples",
  "parse market rows",
  "fetch market data",
  "connect to Supabase",
  "run SQL",
  "clear source-depth not_ready",
  "unavailable, internal_review, partial, stale, and approved",
  "must not be wired into public components",
  "CEO selects local-only source-depth evidence artifact checklist plan",
  "not permission to create the future evidence checker",
  "document templates, review owners, and readiness rules",
  "without market data or remote validation",
  "role review only",
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
  "draft CP3 source-depth evidence artifact checklist plan"
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
