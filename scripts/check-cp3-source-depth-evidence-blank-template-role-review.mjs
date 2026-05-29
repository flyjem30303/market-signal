import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_BLANK_TEMPLATE_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence blank template role review recorded",
  "REVISE",
  "accepted as a local-only documentation template",
  "does not approve creating real evidence artifact files, creating source-depth evidence content, creating the future evidence checker",
  "source-depth approval, or public claims",
  "docs/evidence/CP3_SOURCE_DEPTH_CATEGORY_EVIDENCE_TEMPLATE.md",
  "scripts/check-cp3-source-depth-evidence-blank-template.mjs",
  "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_TEMPLATE_CREATION_APPROVAL_GATE_ROLE_REVIEW_2026-05-29.md",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "scripts/check-cp3-source-depth-evidence-blank-template.mjs passes",
  "scripts/check-cp3-source-depth-evidence-template-creation-approval-gate-role-review.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "Windows-safe file name",
  "preserving <CATEGORY> inside the document",
  "TODO / not_ready",
  "Public-Claim Boundary says no public",
  "do not approve public claims",
  "does not approve public claim copy, SEO copy claims, or model quality",
  "no fabricated dates, fabricated trading date counts, fabricated field",
  "no source-rights approval granted",
  "raw OHLCV, daily_prices, SQL executed",
  "Supabase read completed",
  "local-only CP3 source-depth evidence template usage guide",
  "must not create real evidence artifact files",
  "fill template values",
  "fetch market data",
  "parse market rows",
  "connect to Supabase",
  "run SQL",
  "clear source-depth not_ready",
  "Display-State Boundary says non-runtime",
  "no UI component wiring",
  "CEO selects local-only source-depth evidence template usage guide",
  "not an evidence artifact",
  "does not make source_depth_state reviewable",
  "usage guide",
  "without adding market data or approval claims",
  "role review only",
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
  "draft CP3 source-depth evidence template usage guide"
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
