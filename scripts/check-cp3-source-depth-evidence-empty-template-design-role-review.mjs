import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_EMPTY_TEMPLATE_DESIGN_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence empty template design role review recorded",
  "REVISE",
  "accepted as a local-only governance artifact",
  "does not approve creating `docs/evidence`, creating future evidence template files, creating future evidence artifact files",
  "source-depth approval, or public claims",
  "docs/CP3_SOURCE_DEPTH_EVIDENCE_EMPTY_TEMPLATE_DESIGN_2026-05-29.md",
  "scripts/check-cp3-source-depth-evidence-empty-template-design.mjs",
  "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_ARTIFACT_CHECKLIST_PLAN_ROLE_REVIEW_2026-05-29.md",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "scripts/check-cp3-source-depth-evidence-empty-template-design.mjs passes",
  "scripts/check-cp3-source-depth-evidence-artifact-checklist-plan-role-review.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "future path, required headings, placeholder rules, static checker requirements, and guardrails",
  "not template creation",
  "Public-Claim Boundary",
  "no public claims approved",
  "does not approve SEO copy claims, model quality claims, or scoreSource real claims",
  "Evidence Category, Market And Asset Scope, Symbol Scope, Date",
  "Trading Date Count Summary, Field Availability Summary",
  "Reproducibility Steps, Limitations, Review Owner, Approval Status, and CEO",
  "Source-Rights Boundary",
  "reject public claim approval language, source-rights approval language, backtest approval language",
  "raw market rows, CSV market data, JSON market data, Supabase reads, and SQL execution",
  "local-only CP3 source-depth evidence template creation approval",
  "must not create docs/evidence",
  "create the template file",
  "create evidence",
  "create the future evidence checker",
  "fetch market data",
  "parse market rows",
  "connect to Supabase",
  "run SQL",
  "clear source-depth not_ready",
  "Display-State Boundary",
  "non-runtime",
  "CEO selects local-only source-depth evidence template creation approval gate",
  "still does not authorize creating docs/evidence, template files, evidence files, or evidence checkers",
  "template creation approval gate",
  "whether a blank template file can be created in a future slice",
  "role review only",
  "do not create docs/evidence folder",
  "do not create future evidence template file",
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
  "draft CP3 source-depth evidence template creation approval gate"
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
