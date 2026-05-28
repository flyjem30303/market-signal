import fs from "node:fs";

const reportPath = "docs/reviews/CP3_RUNTIME_STATE_SOURCE_GATE_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 runtime state source gate role review recorded",
  "REVISE",
  "accepted as a local-only governance artifact",
  "does not approve runtime repository work, public UI wiring, Supabase validation, SQL execution, remote reads, production score-source switching, or public claim changes",
  "scripts/check-cp3-runtime-state-source-gate-draft.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "non-runtime sample state packet schema",
  "validate mock, unavailable, real_candidate, and approved states",
  "fallback_display_state",
  "source_depth_state remains a hard blocker",
  "source-depth not_ready",
  "blocks personalized investment advice",
  "predictive claims",
  "backtest claims before approval",
  "disclosure_approval_state",
  "claim_approval_state",
  "local-only runtime state sample packet draft",
  "do not implement a repository",
  "do not connect to Supabase",
  "do not import policy or copy tokens into public pages",
  "stable vocabulary before layout implementation",
  "mock, unavailable, real_candidate, and blocked-real examples",
  "role review only",
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
  "draft CP3 runtime state sample packet"
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
