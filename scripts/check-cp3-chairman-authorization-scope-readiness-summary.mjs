import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CHAIRMAN_AUTHORIZATION_SCOPE_READINESS_SUMMARY_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 chairman authorization scope readiness summary recorded",
  "REVISE",
  "future chairman authorization scope without granting\nauthorization",
  "does not approve authorization",
  "does not schedule a formal meeting",
  "does not create an authorization packet",
  "does not create a real request packet",
  "not connect to Supabase",
  "does not run SQL",
  "does not fetch market data",
  "does not write staging rows",
  "does\nnot write daily_prices",
  "does not create seed SQL",
  "does not set scoreSource=real",
  "does not clear source-depth not_ready",
  "Option D remains the active main line",
  "Option E remains the always-on hard guardrail",
  "Option B remains a limited support tool only when readiness structure is needed",
  "Option A remains paused unless governance coverage needs repair",
  "Option C remains paused unless mock disclosure clarity regresses",
  "Candidate scope: define which Taiwan stock source-depth question is being reviewed",
  "Candidate scope: define which market, symbol universe, and source category are in scope",
  "Candidate scope: define explicit stop conditions before any external-system action",
  "Chairman input required: approve or reject the exact scope boundary",
  "Chairman input required: confirm whether a formal review meeting is needed",
  "Chairman input required: confirm whether a packet should be prepared later",
  "Chairman input required: define the maximum allowed execution depth",
  "Chairman input required: define the required return-to-review checkpoint",
  "stop if this readiness summary is treated as authorization",
  "stop if this readiness summary is treated as approval workflow start",
  "stop if this readiness summary is used to create an authorization packet",
  "stop if this readiness summary is used to connect to Supabase",
  "stop if this readiness summary is used to run SQL",
  "stop if this readiness summary is used to fetch market data",
  "stop if this readiness summary is used to write staging rows",
  "stop if this readiness summary is used to set scoreSource=real",
  "CEO: keep Option D moving while preserving Option E",
  "PM: convert only the local readiness summary into checkable next tasks",
  "Engineering: do not connect to Supabase and do not run SQL",
  "QA: keep review gate coverage for local-only boundaries",
  "Legal/Compliance: treat all source-rights and public-claim questions as unresolved",
  "Investment: treat all real score and model-readiness claims as not_ready",
  "CEO recommendation: expose this authorization scope readiness summary in the local stock decision UI or record a role review for this summary",
  "The next safe slice must remain local-only",
  "The next safe slice must not approve authorization",
  "The next safe slice must not schedule a formal meeting",
  "The next safe slice must not create an authorization packet",
  "The next safe slice must not connect to Supabase",
  "The next safe slice must not run SQL",
  "The next safe slice must not set scoreSource=real",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary.mjs passes",
  "scripts/check-cp3-ceo-option-status-convergence.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready"
];

const forbiddenPhrases = [
  "authorization is approved",
  "formal meeting is scheduled",
  "authorization packet is created",
  "real request packet is created",
  "Supabase connection is allowed",
  "SQL execution is allowed",
  "market data fetch is allowed",
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
