import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CHAIRMAN_AUTHORIZATION_SCOPE_READINESS_SUMMARY_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 chairman authorization scope readiness summary role review recorded",
  "REVISE",
  "chairman authorization scope readiness summary role review only",
  "reviewed local-only authorization-scope\nreadiness guidance",
  "does not approve authorization",
  "does not schedule a formal\nmeeting",
  "does not create an authorization packet",
  "does not create a real request\npacket",
  "does not connect to Supabase",
  "does not run SQL",
  "does not fetch market\ndata",
  "does not parse market rows",
  "does not write Supabase",
  "does not write\nstaging rows",
  "does not write daily_prices",
  "does not create seed SQL",
  "does not\nwire runtime code",
  "does not set scoreSource=real",
  "does not clear source-depth\nnot_ready",
  "does not make public claims",
  "docs/reviews/CP3_CHAIRMAN_AUTHORIZATION_SCOPE_READINESS_SUMMARY_2026-05-30.md reviewed",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary.mjs reviewed",
  "scripts/check-cp3-ceo-option-status-convergence.mjs reviewed",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "CEO accepts Option D as active main line",
  "CEO accepts Option E as hard guardrail",
  "PM accepts the summary as checkable local-only guidance",
  "Engineering confirms no Supabase connection is introduced",
  "Engineering confirms no SQL execution is introduced",
  "Engineering confirms no runtime wiring is introduced",
  "QA accepts checker coverage for the readiness summary role review",
  "Legal confirms source-rights remain unresolved",
  "Legal confirms no authorization packet is created",
  "Investment confirms CP3 source-depth production gate remains not_ready",
  "Design confirms this role review creates no new runtime UI state",
  "Marketing confirms no public claim is created",
  "accepted as reviewed local-only authorization-scope readiness guidance",
  "not accepted as authorization approval",
  "not accepted as formal meeting approval",
  "not accepted as packet creation approval",
  "not accepted as external execution approval",
  "Next safe slice: record CP3 chairman authorization scope readiness checkpoint summary",
  "The next safe slice must remain local-only",
  "The next safe slice must not approve authorization",
  "The next safe slice must not schedule a formal meeting",
  "The next safe slice must not create an authorization packet",
  "The next safe slice must not create a real request packet",
  "The next safe slice must not connect to Supabase",
  "The next safe slice must not run SQL",
  "The next safe slice must not fetch market data",
  "The next safe slice must not parse market rows",
  "The next safe slice must not write staging rows",
  "The next safe slice must not write daily_prices",
  "The next safe slice must not create seed SQL",
  "The next safe slice must not wire runtime code",
  "The next safe slice must not set scoreSource=real",
  "The next safe slice must not clear source-depth not_ready",
  "The next safe slice must not make public claims",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary-role-review.mjs passes",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary.mjs passes",
  "scripts/check-stock-decision-compass.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready"
];

const forbiddenPhrases = [
  "authorization is approved",
  "formal meeting is scheduled",
  "authorization packet creation is approved",
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
