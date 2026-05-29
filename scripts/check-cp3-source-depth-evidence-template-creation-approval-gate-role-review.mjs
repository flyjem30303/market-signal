import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_TEMPLATE_CREATION_APPROVAL_GATE_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence template creation approval gate role review recorded",
  "PROCEED",
  "approves only a future slice that creates a blank source-depth evidence template file",
  "does not approve creating evidence artifact files, creating the future evidence checker",
  "source-depth approval, or public claims",
  "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_TEMPLATE_CREATION_APPROVAL_GATE_2026-05-29.md",
  "scripts/check-cp3-source-depth-evidence-template-creation-approval-gate.mjs",
  "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_EMPTY_TEMPLATE_DESIGN_ROLE_REVIEW_2026-05-29.md",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "scripts/check-cp3-source-depth-evidence-template-creation-approval-gate.mjs passes",
  "scripts/check-cp3-source-depth-evidence-empty-template-design-role-review.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "create only the blank template file",
  "minimal static checker for that template",
  "docs/evidence folder only if needed",
  "Public-Claim Boundary",
  "no public claims approved",
  "must not approve SEO copy claims, model quality claims, or scoreSource real claims",
  "does not include market data, fabricated dates, fabricated trading",
  "fabricated field coverage",
  "rejects public claim approval language, source-rights approval language, backtest approval",
  "raw market rows, CSV market data, JSON market data, Supabase reads",
  "local-only CP3 source-depth evidence blank template file",
  "may create docs/evidence only as a folder for the blank template",
  "may create a static template checker",
  "must not create evidence",
  "fetch market data",
  "parse market rows",
  "connect to Supabase",
  "run SQL",
  "clear source-depth not_ready",
  "Display-State Boundary",
  "textual and non-runtime",
  "CEO approves blank template file creation as the next slice",
  "permits the next slice to create a blank template file and static checker only",
  "still does not permit evidence artifact files, market data, Supabase reads, SQL execution",
  "role review only",
  "do not create docs/evidence folder in this slice",
  "do not create future evidence template file in this slice",
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
  "create CP3 source-depth evidence blank template file",
  "create static checker for blank template only"
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
