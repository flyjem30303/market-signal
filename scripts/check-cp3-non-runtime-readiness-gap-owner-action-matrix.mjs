import fs from "node:fs";

const reportPath = "docs/reviews/CP3_NON_RUNTIME_READINESS_GAP_OWNER_ACTION_MATRIX_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 non-runtime readiness gap owner-action matrix recorded",
  "PROCEED",
  "role-owned local actions",
  "without moving into runtime implementation",
  "external systems",
  "real-data\nprocessing",
  "authorization execution",
  "public release claims",
  "does not approve authorization",
  "does not schedule a formal meeting",
  "does not create an authorization packet",
  "does not create a real request packet",
  "does not create real evidence artifact files",
  "does not connect to Supabase",
  "does\nnot run SQL",
  "does not fetch market data",
  "does not parse market rows",
  "does not\nwrite Supabase",
  "does not write staging rows",
  "does not write daily_prices",
  "does\nnot create seed SQL",
  "does not wire runtime code",
  "does not set scoreSource=real",
  "does not clear source-depth not_ready",
  "does not make public claims",
  "OWNER-ACTION-001 source-depth evidence",
  "Owner: CEO and Investment",
  "Local action now: define evidence completeness questions and decision criteria",
  "Still blocked: real evidence files, market data fetch, market row parsing, source-depth not_ready clearance",
  "OWNER-ACTION-002 runtime UI copy approval",
  "Owner: CEO, Design, Legal, Marketing",
  "Still blocked: runtime UI copy implementation, public claims, release wording",
  "OWNER-ACTION-003 runtime data state naming",
  "Owner: CEO, Engineering, QA",
  "Still blocked: runtime data state implementation, scoreSource=real, production state transition",
  "OWNER-ACTION-004 public claim wording",
  "Owner: CEO, Legal, Investment, Marketing",
  "Still blocked: public claims, marketing release copy, user-facing real-data assurance",
  "OWNER-ACTION-005 source-rights and redistribution",
  "Owner: Legal",
  "Still blocked: source-rights approval, redistribution approval, production data-source claim",
  "OWNER-ACTION-006 real-data validation authorization",
  "Owner: Chairman and CEO",
  "Still blocked: authorization approval, validator execution against Supabase, external read validation",
  "OWNER-ACTION-007 Supabase and SQL execution authorization",
  "Still blocked: Supabase connection, SQL execution, staging writes, daily_prices writes",
  "OWNER-ACTION-008 scoreSource=real transition",
  "Owner: Chairman, CEO, Investment",
  "Still blocked: scoreSource=real, real-data product claim, source-depth not_ready clearance",
  "OWNER-ACTION-009 chairman authorization scope",
  "Still blocked: formal authorization request, authorization packet creation, meeting scheduling",
  "OWNER-ACTION-010 production readiness acceptance criteria",
  "Owner: CEO, PM, QA",
  "Still blocked: production readiness approval, public release readiness, runtime launch",
  "COORDINATION-RULE-001 CEO owns prioritization and scope containment",
  "COORDINATION-RULE-002 PM converts owner actions into small local-only slices",
  "COORDINATION-RULE-003 Engineering owns checker feasibility and runtime boundary detection",
  "COORDINATION-RULE-004 QA owns pass/fail language for static and local-only gates",
  "COORDINATION-RULE-005 Legal owns rights, redistribution, and public-claim constraints",
  "COORDINATION-RULE-006 Investment owns source credibility and evidence sufficiency questions",
  "COORDINATION-RULE-007 Design owns copy clarity only after CEO approves a non-runtime copy slice",
  "COORDINATION-RULE-008 Marketing owns public-facing wording only after Legal and CEO approval",
  "COORDINATION-RULE-009 Chairman approval is required before any external-system or real-data action",
  "COORDINATION-RULE-010 All roles must stop when local-only work would become implementation",
  "FAST-LANE-001 prefer one document plus one checker for normal local-only slices",
  "FAST-LANE-002 role review is required only when boundary meaning changes",
  "FAST-LANE-003 checkpoint summary is required only after a meaningful decision change",
  "FAST-LANE-004 do not repeat governance-only packets when an owner-action matrix is enough",
  "FAST-LANE-005 every slice must preserve public data source mock",
  "FAST-LANE-006 every slice must preserve CP3 source-depth production gate not_ready",
  "FAST-LANE-007 every slice must keep scoreSource=real blocked",
  "FAST-LANE-008 every slice must keep Supabase and SQL execution blocked",
  "NEXT-ACTION-001 prepare owner-action acceptance criteria for source-depth evidence",
  "NEXT-ACTION-002 prepare owner-action acceptance criteria for runtime state naming",
  "NEXT-ACTION-003 prepare owner-action acceptance criteria for public claim wording",
  "NEXT-ACTION-004 prepare owner-action acceptance criteria for Supabase and SQL authorization boundaries",
  "NEXT-ACTION-005 prepare owner-action acceptance criteria for scoreSource=real transition",
  "CEO pace assessment: move faster than prior governance-only loops",
  "CEO pace assessment: keep local-only controls firm",
  "CEO pace assessment: avoid formal meeting or authorization work until a specific approval question is mature",
  "CEO pace assessment: prioritize owner-action acceptance criteria before any packet or external-system step",
  "CEO pace assessment: treat this matrix as a working map, not an approval artifact",
  "scripts/check-cp3-non-runtime-readiness-gap-owner-action-matrix.mjs passes",
  "scripts/check-cp3-non-runtime-readiness-gap-summary.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "CP3 source-depth production gate remains not_ready",
  "scoreSource=real remains blocked",
  "Supabase and SQL execution remain blocked"
];

const forbiddenPhrases = [
  "authorization is approved",
  "authorization has been approved",
  "formal meeting is scheduled",
  "authorization packet is created",
  "real request packet is created",
  "real evidence artifact files are created",
  "Supabase connection is allowed",
  "SQL execution is allowed",
  "market data fetch is allowed",
  "market rows are parsed",
  "staging rows are written",
  "daily_prices rows are written",
  "seed SQL is created",
  "runtime code is wired",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public data source is real",
  "public claims are approved",
  "release readiness is approved"
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
