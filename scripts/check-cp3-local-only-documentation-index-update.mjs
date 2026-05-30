import fs from "node:fs";

const reportPath = "docs/reviews/CP3_LOCAL_ONLY_DOCUMENTATION_INDEX_UPDATE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 local-only documentation index update recorded",
  "PROCEED",
  "fast-lane local-only documentation\nslice under the acceleration plan",
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
  "docs/reviews/CP3_CEO_OPTION_STATUS_CONVERGENCE_2026-05-30.md",
  "docs/reviews/CP3_CHAIRMAN_AUTHORIZATION_SCOPE_READINESS_SUMMARY_2026-05-30.md",
  "docs/reviews/CP3_CHAIRMAN_AUTHORIZATION_SCOPE_READINESS_SUMMARY_ROLE_REVIEW_2026-05-30.md",
  "docs/reviews/CP3_CHAIRMAN_AUTHORIZATION_SCOPE_READINESS_CHECKPOINT_SUMMARY_2026-05-30.md",
  "docs/reviews/CP3_LOCAL_ONLY_DECISION_QUALITY_ACCELERATION_PLAN_2026-05-30.md",
  "scripts/check-cp3-ceo-option-status-convergence.mjs remains required",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary.mjs remains required",
  "scripts/check-cp3-chairman-authorization-scope-readiness-summary-role-review.mjs remains required",
  "scripts/check-cp3-chairman-authorization-scope-readiness-checkpoint-summary.mjs remains required",
  "scripts/check-cp3-local-only-decision-quality-acceleration-plan.mjs remains required",
  "scripts/check-review-gates.mjs remains the aggregate gate",
  "Option D remains the active main line",
  "Option E remains the hard guardrail",
  "Fast-lane local-only documentation work is allowed",
  "Role review is required when boundary meaning changes",
  "Chairman review is required before authorization, packet, meeting, external system, real data, or public claim work",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready",
  "Purpose: reduce context-recovery cost for CEO and PM",
  "Purpose: avoid editing legacy handoff files with possible encoding risk in this slice",
  "Purpose: make the current 2026-05-30 decision chain easy to audit",
  "Purpose: preserve a single next-slice recommendation",
  "Purpose: keep local-only acceleration visible without weakening stop-and-review boundaries",
  "Next safe slice: prepare CP3 local-only documentation index role review only if the index changes boundary meaning",
  "Alternative next safe slice: continue fast-lane with current-state briefing copy alignment",
  "CEO recommendation: continue fast-lane with current-state briefing copy alignment",
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
  "scripts/check-cp3-local-only-documentation-index-update.mjs passes",
  "scripts/check-cp3-local-only-decision-quality-acceleration-plan.mjs passes",
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
