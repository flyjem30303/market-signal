import fs from "node:fs";

const reportPath = "docs/reviews/CP3_LOCAL_ONLY_OPEN_DECISION_LEDGER_REFRESH_CHECKPOINT_SUMMARY_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 local-only open decision ledger refresh checkpoint summary recorded",
  "PROCEED",
  "local-only\ndecision tracking checkpoint",
  "no pending\nitem has been approved or converted into execution",
  "CEO pace assessment: authorization-prep execution is not too fast",
  "CEO pace assessment: authorization-prep governance is slightly too detailed",
  "CEO pace assessment: project movement is safe but can be leaner",
  "CEO pace assessment: fast-lane should continue for documentation and static-checker work",
  "CEO pace assessment: repeated checkpoint summaries should be reduced when boundary meaning is unchanged",
  "CEO pace assessment: role review remains required when runtime, public claim, data source, authorization, or external-system meaning changes",
  "CEO pace assessment: chairman review remains required before authorization, packet, meeting, Supabase, SQL, real data, scoreSource=real, or public claim work",
  "project is not rushing the dangerous parts",
  "The slow part is the\namount of governance paperwork",
  "use fewer repeated checkpoint-only slices when the same boundary\nhas already been confirmed",
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
  "docs/reviews/CP3_LOCAL_ONLY_OPEN_DECISION_LEDGER_REFRESH_2026-05-30.md closed as local-only decision tracking",
  "docs/reviews/CP3_CURRENT_STATE_BRIEFING_COPY_ALIGNMENT_CHECKPOINT_SUMMARY_2026-05-30.md remains current briefing checkpoint",
  "docs/reviews/CP3_LOCAL_ONLY_DECISION_QUALITY_ACCELERATION_PLAN_2026-05-30.md remains current fast-lane policy",
  "scripts/check-cp3-local-only-open-decision-ledger-refresh.mjs remains required",
  "scripts/check-cp3-current-state-briefing-copy-alignment-checkpoint-summary.mjs remains required",
  "scripts/check-review-gates.mjs remains the aggregate gate",
  "Finding: fast-lane decisions remain local-only only",
  "Finding: role-review decisions remain not approved for implementation",
  "Finding: chairman-decision items remain pending not approved",
  "Finding: no pending item has been marked approved",
  "Finding: no pending item has been converted into executable task",
  "Finding: no authorization packet has been created",
  "Finding: no real request packet has been created",
  "Finding: no Supabase connection has been introduced",
  "Finding: no SQL execution has been introduced",
  "Finding: no real market data fetch has been introduced",
  "Finding: no runtime wiring has been introduced",
  "Finding: public data source remains mock",
  "Finding: CP3 source-depth production gate remains not_ready",
  "Cadence adjustment: continue fast-lane documentation and static-checker work",
  "Cadence adjustment: prefer one document plus one checker per coherent decision-quality slice",
  "Cadence adjustment: skip separate role review when the same boundary has already been reviewed and unchanged",
  "Cadence adjustment: skip checkpoint summary when it would only repeat the immediately previous document",
  "Cadence adjustment: add checkpoint summary only when it closes a meaningful loop or changes next-slice direction",
  "Cadence adjustment: stop and review when authorization, runtime, external data, data source, scoreSource=real, or public claim meaning changes",
  "Next safe slice: continue fast-lane with CP3 runtime copy approval gate only if UI copy is requested",
  "Alternative next safe slice: shift from governance-only docs to a non-runtime readiness gap summary",
  "CEO recommendation: shift from governance-only docs to a non-runtime readiness gap summary",
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
  "scripts/check-cp3-local-only-open-decision-ledger-refresh-checkpoint-summary.mjs passes",
  "scripts/check-cp3-local-only-open-decision-ledger-refresh.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready"
];

const forbiddenPhrases = [
  "Status: approved",
  "CEO Decision: APPROVE",
  "Approval Status: approved",
  "authorization is approved",
  "formal meeting is scheduled",
  "authorization packet is created",
  "real request packet is created",
  "Supabase connection is allowed",
  "SQL execution is allowed",
  "market data fetch is allowed",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public data source is real",
  "public claims are approved"
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
