import fs from "node:fs";

const reportPath = "docs/reviews/CP3_RUNTIME_STATE_SAMPLE_PACKET_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 runtime state sample packet role review recorded",
  "REVISE",
  "accepted as a local-only planning artifact",
  "not approved as JSON seed data, market data, a runtime repository, public UI wiring, Supabase validation, SQL execution, production score-source switching, or public claim changes",
  "scripts/check-cp3-runtime-state-sample-packet-draft.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "sample packet validation gate",
  "cannot accidentally unlock approved display",
  "public_claim_level remains none or internal_only",
  "fallback_display_state",
  "source_depth_state not_ready",
  "forces fallback_display_state unavailable",
  "disclosure_approval_state",
  "claim_approval_state",
  "blocked_reason",
  "personalized investment advice",
  "predictive claims",
  "public backtest claims",
  "Do not create JSON market data",
  "do not implement a runtime repository",
  "do not import policy or copy tokens into public pages",
  "not enough to implement public UI",
  "mock, unavailable, real_candidate, and blocked_real examples cannot unlock public approved display or public claims",
  "role review only",
  "do not create JSON market data",
  "do not create CSV market data",
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
  "draft CP3 runtime state sample packet validation gate"
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
