import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CHAIRMAN_AUTHORIZATION_SCOPE_READINESS_CHECKPOINT_SUMMARY_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 chairman authorization scope readiness checkpoint summary recorded",
  "REVISE",
  "local-only governance checkpoint",
  "preserving Option D as the active main line",
  "Option E as the hard guardrail",
  "does not approve authorization",
  "does not schedule a\nformal meeting",
  "does not create an authorization packet",
  "does not create a real\nrequest packet",
  "does not connect to Supabase",
  "does not run SQL",
  "does not fetch\nmarket data",
  "does not parse market rows",
  "does not write Supabase",
  "does not\nwrite staging rows",
  "does not write daily_prices",
  "does not create seed SQL",
  "does\nnot wire runtime code",
  "does not set scoreSource=real",
  "does not clear\nsource-depth not_ready",
  "does not make public claims",
  "docs/reviews/CP3_CHAIRMAN_AUTHORIZATION_SCOPE_READINESS_SUMMARY_2026-05-30.md closed as local-only guidance",
  "docs/reviews/CP3_CHAIRMAN_AUTHORIZATION_SCOPE_READINESS_SUMMARY_ROLE_REVIEW_2026-05-30.md closed as role-reviewed governance confirmation",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary.mjs remains required",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary-role-review.mjs remains required",
  "Finding: Option D remains the active main line",
  "Finding: Option E remains the always-on hard guardrail",
  "Finding: no chairman authorization has been granted",
  "Finding: no formal meeting has been scheduled",
  "Finding: no authorization packet has been created",
  "Finding: no real request packet has been created",
  "Finding: no external system action has been taken",
  "Finding: public data source remains mock",
  "Finding: CP3 source-depth production gate remains not_ready",
  "CEO closes this loop as local-only governance readiness",
  "PM closes this loop as tracked and checkable",
  "Engineering closes this loop with no runtime or database change",
  "QA closes this loop with review gate coverage",
  "Legal closes this loop with source-rights and public claims unresolved",
  "Investment closes this loop with no real score or model-readiness claim",
  "Design closes this loop with no new UI state",
  "Marketing closes this loop with no public release claim",
  "Next safe slice: prepare CP3 local-only decision-quality acceleration plan",
  "The next safe slice may reduce governance overhead if boundaries remain explicit",
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
  "scripts/check-cp3-chairman-authorization-scope-readiness-checkpoint-summary.mjs passes",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary-role-review.mjs passes",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready"
];

const forbiddenPhrases = [
  "authorization is approved",
  "authorization has been approved",
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
