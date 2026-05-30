import fs from "node:fs";

const reportPath = "docs/reviews/CP3_CURRENT_STATE_BRIEFING_COPY_ALIGNMENT_CHECKPOINT_SUMMARY_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 current-state briefing copy alignment checkpoint summary recorded",
  "PROCEED",
  "local-only internal governance checkpoint",
  "ready for CEO and PM context recovery",
  "not approved for\nruntime UI",
  "public website copy",
  "marketing copy",
  "investor-facing claims",
  "external communication",
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
  "docs/reviews/CP3_CURRENT_STATE_BRIEFING_COPY_ALIGNMENT_2026-05-30.md closed as internal governance copy",
  "docs/reviews/CP3_LOCAL_ONLY_DOCUMENTATION_INDEX_UPDATE_2026-05-30.md remains the current decision-chain index",
  "docs/reviews/CP3_LOCAL_ONLY_DECISION_QUALITY_ACCELERATION_PLAN_2026-05-30.md remains the fast-lane policy",
  "scripts/check-cp3-current-state-briefing-copy-alignment.mjs remains required",
  "scripts/check-cp3-local-only-documentation-index-update.mjs remains required",
  "scripts/check-review-gates.mjs remains the aggregate gate",
  "Finding: briefing copy is internal governance copy only",
  "Finding: no runtime UI copy has been updated",
  "Finding: no public website copy has been updated",
  "Finding: no marketing copy has been approved",
  "Finding: no investor-facing claim has been approved",
  "Finding: no chairman authorization has been granted",
  "Finding: no formal meeting has been scheduled",
  "Finding: no authorization packet has been created",
  "Finding: no real request packet has been created",
  "Finding: public data source remains mock",
  "Finding: CP3 source-depth production gate remains not_ready",
  "CEO closes this loop as chairman-facing internal context only",
  "PM closes this loop as a reusable status mouthpiece",
  "Engineering closes this loop with no runtime or database change",
  "QA closes this loop with review gate coverage",
  "Legal closes this loop with no public claim approval",
  "Investment closes this loop with no real-score or model-readiness claim",
  "Design closes this loop with no UI copy change",
  "Marketing closes this loop with no public campaign copy",
  "Next safe slice: prepare CP3 current-state briefing copy runtime approval gate only if UI copy is requested",
  "Alternative next safe slice: continue fast-lane with CP3 local-only open decision ledger refresh",
  "CEO recommendation: continue fast-lane with CP3 local-only open decision ledger refresh",
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
  "scripts/check-cp3-current-state-briefing-copy-alignment-checkpoint-summary.mjs passes",
  "scripts/check-cp3-current-state-briefing-copy-alignment.mjs passes",
  "scripts/check-cp3-local-only-documentation-index-update.mjs passes",
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
