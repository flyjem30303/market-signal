import fs from "node:fs";

const reportPath = "docs/reviews/CP3_RUNTIME_STATE_SAMPLE_PACKET_VALIDATION_GATE_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 runtime state sample packet validation gate role review recorded",
  "REVISE",
  "accepted as a local-only checker planning artifact",
  "does not approve structured JSON sample artifacts, JSON seed data, market data, runtime repository work, public UI wiring, Supabase validation, SQL execution, production score-source switching, or public claim changes",
  "scripts/check-cp3-runtime-state-sample-packet-validation-gate.mjs passes",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "structured sample artifacts should wait until source-depth evidence is closer",
  "source-depth evidence gate draft",
  "scoreSource=real is not sufficient for approved display",
  "source-depth evidence and claim approval are no longer not_ready",
  "source_depth_state not_ready must remain the central blocker",
  "forbidding personalized investment advice",
  "predictive claims",
  "public backtest claims",
  "Do not create JSON sample artifacts yet",
  "do not implement runtime repository work",
  "do not connect to Supabase",
  "source_depth_state not_ready",
  "what evidence is required before any real score can be considered for public display",
  "role review only",
  "do not create JSON sample artifacts",
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
  "draft CP3 source-depth evidence gate"
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
