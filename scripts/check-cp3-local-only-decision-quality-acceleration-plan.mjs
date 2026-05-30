import fs from "node:fs";

const reportPath = "docs/reviews/CP3_LOCAL_ONLY_DECISION_QUALITY_ACCELERATION_PLAN_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 local-only decision quality acceleration plan recorded",
  "PROCEED",
  "accelerates local-only decision-quality work",
  "does not reduce the non-negotiable boundaries",
  "documentation-only, static-checker-only, or\ninternal governance-only",
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
  "Rule 1: documentation-only slices may use a checkpoint summary instead of a separate role review",
  "Rule 2: static-checker-only slices may be batched when the same boundary is unchanged",
  "Rule 3: role review is required when a slice changes authorization boundary",
  "Rule 4: role review is required when a slice changes runtime UI meaning",
  "Rule 5: role review is required when a slice introduces a new public claim",
  "Rule 6: role review is required when a slice touches data source readiness",
  "Rule 7: checkpoint summary is enough when prior role review already covers the same local-only boundary",
  "Rule 8: CEO may choose the next slice without asking the chairman when it remains local-only",
  "Eligible: local-only checkpoint summary",
  "Eligible: local-only options map",
  "Eligible: static checker for existing documentation boundary",
  "Eligible: review gate registration",
  "Eligible: documentation index or handoff update",
  "Stop and review: any authorization approval",
  "Stop and review: any formal meeting scheduling",
  "Stop and review: any authorization packet creation",
  "Stop and review: any real request packet creation",
  "Stop and review: any Supabase connection",
  "Stop and review: any SQL execution",
  "Stop and review: any market data fetch",
  "Stop and review: any market row parsing",
  "Stop and review: any staging row write",
  "Stop and review: any daily_prices write",
  "Stop and review: any seed SQL creation",
  "Stop and review: any runtime code wiring",
  "Stop and review: any scoreSource=real change",
  "Stop and review: any source-depth not_ready clearance",
  "Stop and review: any public claim",
  "Default cadence: one coherent slice, one checker, one review gate entry, one commit",
  "Fast cadence: one checkpoint may cover multiple documentation-only continuations",
  "Slow cadence: require role review when boundary meaning changes",
  "Escalation cadence: ask chairman only when authorization, packet, meeting, external system, real data, or public claim is in scope",
  "PM may execute fast-lane eligible work without additional chairman input",
  "PM must keep public data source mock",
  "PM must keep CP3 source-depth production gate not_ready",
  "PM must keep review gates passing",
  "PM must commit each coherent passing slice",
  "PM must report when a stop-and-review condition appears",
  "Next safe slice: record CP3 acceleration plan role review only if boundary reviewers need confirmation",
  "Alternative next safe slice: continue with a fast-lane local-only documentation index update",
  "CEO recommendation: continue with fast-lane local-only documentation index update",
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
  "scripts/check-cp3-local-only-decision-quality-acceleration-plan.mjs passes",
  "scripts/check-cp3-chairman-authorization-scope-readiness-checkpoint-summary.mjs passes",
  "scripts/check-cp3-local-only-decision-quality-worklist.mjs passes",
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
