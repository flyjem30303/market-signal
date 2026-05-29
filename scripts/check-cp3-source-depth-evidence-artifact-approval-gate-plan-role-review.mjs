import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_ARTIFACT_APPROVAL_GATE_PLAN_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence artifact approval gate plan role review recorded",
  "REVISE",
  "accepted as a local-only planning artifact",
  "future template-copy approval gate",
  "does not approve creating real evidence artifact files, filling template values, creating the future evidence checker",
  "source-depth approval, or public claims",
  "docs/CP3_SOURCE_DEPTH_EVIDENCE_ARTIFACT_APPROVAL_GATE_PLAN_2026-05-29.md",
  "scripts/check-cp3-source-depth-evidence-artifact-approval-gate-plan.mjs",
  "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_TEMPLATE_USAGE_GUIDE_ROLE_REVIEW_2026-05-29.md",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "scripts/check-cp3-source-depth-evidence-artifact-approval-gate-plan.mjs passes",
  "scripts/check-cp3-source-depth-evidence-template-usage-guide-role-review.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "separates approval to copy a template from approval to fill evidence values",
  "SAFE_CATEGORY",
  "path naming",
  "checker scope",
  "local-only packet rules",
  "APPROVE_TEMPLATE_COPY_ONLY does not approve public claim copy, model quality claims, SEO copy claims, or public backtest claims",
  "market and asset scope",
  "symbol scope policy",
  "date range policy",
  "field availability policy",
  "missing-date policy",
  "corporate-action policy",
  "inactive and delisted symbol policy",
  "rejects raw market rows, CSV market data, JSON market data, Supabase read output, SQL execution output",
  "source-rights approval without Legal review",
  "public claim approval without CEO synthesis",
  "local-only CP3 source-depth template-copy approval packet design",
  "APPROVE_TEMPLATE_COPY_ONLY",
  "must not create real evidence artifact",
  "fill template values",
  "create the future evidence checker",
  "fetch market data",
  "parse market rows",
  "connect to Supabase",
  "run SQL",
  "clear source-depth not_ready",
  "Display-State Boundary remains non-runtime",
  "rejects public UI wiring",
  "No UI component wiring, public page copy, or public state badge change is approved",
  "CEO selects local-only source-depth template-copy approval packet design",
  "does not approve template copy",
  "does not create evidence",
  "does not make source_depth_state reviewable",
  "template-copy approval packet design",
  "before asking CEO for APPROVE_TEMPLATE_COPY_ONLY",
  "role review only",
  "do not approve template copy",
  "do not create real evidence artifact files",
  "do not fill template values",
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
  "draft CP3 source-depth template-copy approval packet design"
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
