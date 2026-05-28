import fs from "node:fs";

const reportPath = "docs/CP3_UI_WIRING_BLOCKER_TO_OWNER_GATE_MATRIX_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 UI wiring blocker-to-owner gate matrix recorded",
  "REVISE",
  "does not clear any blocker",
  "owner, required evidence, checker, exit condition, and blocked runtime action",
  "planning readiness with launch readiness",
  "Runtime state source not approved",
  "Source-depth production gate remains not_ready",
  "UI placement implementation not approved",
  "Legal disclosure copy not approved",
  "Public claim approval not approved",
  "Production score-source gate not approved",
  "Rollback and monitoring not approved",
  "Importing policy into public pages or wiring policy into data fetching",
  "Setting `scoreSource=real`",
  "Importing UI copy tokens into public pages or public components",
  "Showing score interpretation without required disclosure",
  "Publishing validated, predictive, or backtest-based public claims",
  "Releasing runtime score UI without fallback and monitoring",
  "future runtime source gate checker",
  "future source-depth evidence checker",
  "future UI placement implementation checker",
  "future legal disclosure checker",
  "future claim release checker",
  "future production score-source gate checker",
  "future rollback and monitoring checker",
  "scripts/check-cp3-runtime-policy-draft.mjs blocks public policy imports",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs blocks public copy token imports",
  "scripts/check-review-gates.mjs includes this blocker-to-owner matrix checker",
  "blocker-to-owner gate matrix only",
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
  "do not make public backtest claims",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "Runtime wiring remains blocked",
  "record CP3 UI wiring blocker-to-owner gate matrix role review"
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
