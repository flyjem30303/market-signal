import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CEO_OPTION_STATUS_CONVERGENCE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 CEO option status convergence recorded",
  "REVISE",
  "Option D as the main line",
  "Option E as the hard guardrail",
  "Option B as a\nlimited support tool",
  "Option A / Option C as paused auxiliary paths",
  "does not approve authorization",
  "does not schedule a formal meeting",
  "does not create an authorization packet",
  "does not connect to Supabase",
  "does not run SQL",
  "does not fetch market data",
  "does not write staging rows",
  "does not write daily_prices",
  "does not\ncreate seed SQL",
  "does not set scoreSource=real",
  "does\nnot clear source-depth not_ready",
  "Option D is the active main line",
  "Option E is the always-on hard guardrail",
  "Option B is a limited support tool",
  "Option A is paused as over-deep governance documentation",
  "Option C is paused as non-urgent public mock disclosure work",
  "Default next safe slice: Option D",
  "Apply Option E to every slice",
  "Use Option B only when Option D needs readiness structure",
  "Use Option A only to repair governance coverage",
  "Use Option C only to repair mock disclosure clarity",
  "Do not run all options in parallel",
  "Do not treat option convergence as authorization",
  "Do not treat option convergence as approval workflow start",
  "Do not treat option convergence as a packet creation instruction",
  "CEO recommendation: continue Option D main line with Option E guardrail",
  "The next safe slice must remain local-only",
  "The next safe slice must not approve authorization",
  "The next safe slice must not schedule a formal meeting",
  "The next safe slice must not create an authorization packet",
  "The next safe slice must not connect to Supabase",
  "The next safe slice must not run SQL",
  "The next safe slice must not fetch market data",
  "The next safe slice must not set scoreSource=real",
  "scripts/check-cp3-ceo-option-status-convergence.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready"
];

const forbiddenPhrases = [
  "Option A is the active main line",
  "Option B is the active main line",
  "Option C is the active main line",
  "All options are active main lines",
  "option convergence approves authorization",
  "option convergence starts approval workflow",
  "option convergence creates an authorization packet",
  "source-depth production gate is ready",
  "public data source is real"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
