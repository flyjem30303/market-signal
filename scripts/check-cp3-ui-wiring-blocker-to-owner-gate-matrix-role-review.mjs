import fs from "node:fs";

const reportPath = "docs/reviews/CP3_UI_WIRING_BLOCKER_TO_OWNER_GATE_MATRIX_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 UI wiring blocker-to-owner gate matrix role review recorded",
  "REVISE",
  "accepted as a local-only governance artifact",
  "does not approve runtime wiring, public UI imports, Supabase validation, SQL execution, production score-source switching, or public claim changes",
  "scripts/check-cp3-ui-wiring-blocker-to-owner-gate-matrix.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "runtime state source gate",
  "source-depth production gate not_ready",
  "block personalized investment advice",
  "predictive claims",
  "disclosure approval",
  "local-only runtime state source gate draft",
  "defines what public UI would be allowed to know later",
  "still blocking runtime wiring today",
  "CEO selects runtime state source gate draft as first future checker",
  "must not connect to Supabase",
  "run SQL",
  "read remote data",
  "import policy into public pages",
  "import copy tokens into public pages",
  "clear source-depth not_ready",
  "role review only",
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
  "do not clear source-depth not_ready",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "draft CP3 runtime state source gate"
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
