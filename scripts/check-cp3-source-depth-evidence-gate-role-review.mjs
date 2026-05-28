import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_GATE_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence gate role review recorded",
  "REVISE",
  "accepted as a local-only planning artifact",
  "does not approve historical ingestion, remote validation, Supabase reads, SQL execution, runtime repository work, public UI wiring, production",
  "source-depth approval, or public claims",
  "scripts/check-cp3-source-depth-evidence-gate-draft.mjs passes",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "scripts/check-cp3-runtime-policy-draft.mjs passes",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs passes",
  "TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit",
  "review gates pass",
  "source-depth evidence matrix",
  "owner, required artifact, checker, current status, and blocked runtime action",
  "source-depth evidence and claim approval are both no longer not_ready",
  "price history, fundamental history, missing-date handling, corporate-action handling",
  "inactive-symbol handling, endpoint stability, field semantics, market-calendar",
  "sample-size thresholds, and reproducibility separate",
  "source-rights evidence, backtest approval, or public claim approval",
  "Do not fetch market",
  "do not run validators against Supabase",
  "do not write SQL",
  "do not clear source-depth not_ready",
  "unavailable, internal_review, partial, or stale future display states",
  "owner, required artifact, checker, current status, blocked runtime action, and future display implication",
  "role review only",
  "do not create JSON sample artifacts",
  "do not create JSON market data",
  "do not create CSV market data",
  "do not fetch market data",
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
  "draft CP3 source-depth evidence matrix"
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
