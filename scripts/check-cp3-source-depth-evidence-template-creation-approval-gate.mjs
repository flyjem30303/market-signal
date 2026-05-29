import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_TEMPLATE_CREATION_APPROVAL_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence template creation approval gate recorded",
  "REVISE",
  "local-only governance artifact",
  "does not approve creating `docs/evidence`, creating the template file, creating future evidence artifact files",
  "source-depth approval, or public claims",
  "docs/CP3_SOURCE_DEPTH_EVIDENCE_EMPTY_TEMPLATE_DESIGN_2026-05-29.md",
  "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_EMPTY_TEMPLATE_DESIGN_ROLE_REVIEW_2026-05-29.md",
  "scripts/check-cp3-source-depth-evidence-empty-template-design-role-review.mjs",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "approval gate only",
  "decides whether future blank template creation may be proposed",
  "does not create the folder",
  "does not create the template file",
  "does not create evidence files",
  "does not create the future evidence checker",
  "does not validate source-depth evidence",
  "does not clear source-depth not_ready",
  "empty template design exists",
  "empty template design role review exists",
  "future template path is docs/evidence/CP3_SOURCE_DEPTH_<CATEGORY>_EVIDENCE_TEMPLATE.md",
  "template status remains not_ready",
  "placeholder values use TODO only",
  "Public-Claim Boundary remains required",
  "Source-Rights Boundary remains required",
  "Display-State Boundary remains required",
  "future template file contains no raw market rows",
  "future template file contains no CSV market data",
  "future template file contains no JSON market data",
  "future template file contains no Supabase reads",
  "future template file contains no SQL execution",
  "future template file contains no scoreSource=real",
  "future template file contains no approved status",
  "future template file contains no public claim approval language",
  "future template file contains no source-rights approval language",
  "future template file contains no backtest approval language",
  "creating docs/evidence folder in this slice",
  "creating template file in this slice",
  "creating evidence artifact files in this slice",
  "creating future evidence checker in this slice",
  "fetching market data in this slice",
  "parsing market rows in this slice",
  "connecting to Supabase in this slice",
  "running SQL in this slice",
  "create CP3 source-depth evidence blank template file",
  "TODO placeholders and not_ready status",
  "scripts/check-cp3-source-depth-evidence-template-creation-approval-gate.mjs must pass",
  "scripts/check-cp3-source-depth-evidence-empty-template-design-role-review.mjs must pass",
  "scripts/check-review-gates.mjs must include this approval gate",
  "TypeScript noEmit must pass",
  "template creation approval gate only",
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
  "still does not create any file",
  "role review for this approval gate",
  "record CP3 source-depth evidence template creation approval gate role review"
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
