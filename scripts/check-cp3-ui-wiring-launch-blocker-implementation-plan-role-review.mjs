import fs from "node:fs";

const reportPath = "docs/reviews/CP3_UI_WIRING_LAUNCH_BLOCKER_IMPLEMENTATION_PLAN_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 UI wiring launch-blocker implementation plan role review recorded",
  "REVISE",
  "accepted as a local-only governance artifact",
  "not approved for public UI wiring",
  "not approved for public UI wiring, production score-source switching, Supabase validation, SQL execution, or public claim changes",
  "scripts/check-cp3-ui-wiring-launch-blocker-implementation-plan.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "blocker-to-owner gate matrix",
  "owner, evidence, checker",
  "source-depth evidence gate is the critical blocker",
  "no personalized investment advice",
  "market-specific delay wording",
  "model limitation wording",
  "planning readiness with launch readiness",
  "explicit owners",
  "evidence, checker, exit condition",
  "blocked runtime action",
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
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "draft CP3 UI wiring blocker-to-owner gate matrix"
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
