import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_SEPARATE_BOUNDED_ATTEMPT_REVIEW_PACKET.md";
const packetPath = "data/evidence-intake/phase-1-runtime-promotion-operator-packet.draft.json";
const operatorSummaryPath = "docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_REVIEW_SUMMARY.md";
const packetIntakeCheckerPath = "scripts/check-phase-1-runtime-promotion-operator-packet-intake.mjs";
const operatorSummaryCheckerPath = "scripts/check-phase-1-runtime-promotion-operator-review-summary.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const packet = JSON.parse(read(packetPath));
const operatorSummary = read(operatorSummaryPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const packetIntake = runJson(packetIntakeCheckerPath);
const summaryCheck = runJson(operatorSummaryCheckerPath);

for (const phrase of [
  "Status: `phase_1_runtime_promotion_separate_bounded_attempt_review_packet_ready_no_execution`",
  "Decision: `PREPARE_BOUNDED_ATTEMPT_REVIEW_KEEP_MOCK`",
  "`promotionAllowedNow=false`",
  "`dryRunOnlyAllowedNow=true`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`operatorDecision=RUN_PROMOTION_DRY_RUN_ONLY`",
  "`phase_1_runtime_promotion_operator_authorization_request_packet`",
  "Current decision: keep mock",
  "The future authorization request must stay separate from execution"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "phase_1_runtime_promotion_operator_packet_intake_ready_no_execution",
  "phase_1_runtime_promotion_operator_review_summary_ready_no_execution",
  "Runtime flag",
  "rollback owner",
  "readback shape",
  "post-promotion review owner",
  "not investment advice",
  "reversible"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing precondition phrase: ${phrase}`);
}

for (const phrase of [
  "SQL execution",
  "Supabase read/write",
  "staging-row creation",
  "`daily_prices` mutation",
  "market-data fetch",
  "raw payload",
  "production environment mutation",
  "runtime flag mutation",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "real-time precision claim",
  "complete-market coverage claim",
  "investment-advice claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

expect(packet.packetLabel, "PHASE_1_OPERATOR_PACKET_DRAFT_NO_EXECUTION", "packet.packetLabel");
expect(packet.operatorDecision, "RUN_PROMOTION_DRY_RUN_ONLY", "packet.operatorDecision");
expect(packet.promotionAllowedNow, false, "packet.promotionAllowedNow");
expect(packet.dryRunOnlyAllowedNow, true, "packet.dryRunOnlyAllowedNow");
expect(packet.publicDataSource, "mock", "packet.publicDataSource");
expect(packet.scoreSource, "mock", "packet.scoreSource");
expect(packet.runtimeFlagName, "NEXT_PUBLIC_DATA_SOURCE", "packet.runtimeFlagName");
expect(packet.runtimeFlagTargetValue, "supabase", "packet.runtimeFlagTargetValue");

expect(packetIntake.status, "ok", "packetIntake.status");
expect(packetIntake.guardedStatus, "phase_1_runtime_promotion_operator_packet_intake_ready_no_execution", "packetIntake.guardedStatus");
expect(summaryCheck.status, "ok", "summaryCheck.status");
expect(summaryCheck.guardedStatus, "phase_1_runtime_promotion_operator_review_summary_ready_no_execution", "summaryCheck.guardedStatus");

if (!operatorSummary.includes("`phase_1_runtime_promotion_separate_bounded_attempt_review_packet`")) {
  problems.push(`${operatorSummaryPath} must route to separate bounded attempt review packet`);
}

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-separate-bounded-attempt-review-packet"] !==
  "node scripts/check-phase-1-runtime-promotion-separate-bounded-attempt-review-packet.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-separate-bounded-attempt-review-packet script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-separate-bounded-attempt-review-packet")) {
  problems.push(`${reviewGatePath} missing separate bounded attempt review packet registration`);
}

for (const [label, text] of [
  [docPath, doc],
  [operatorSummaryPath, operatorSummary],
  [packetPath, JSON.stringify(packet)]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
  }
}

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_separate_bounded_attempt_review_packet_ready_no_execution"
        : "phase_1_runtime_promotion_separate_bounded_attempt_review_packet_blocked",
      decision: "PREPARE_BOUNDED_ATTEMPT_REVIEW_KEEP_MOCK",
      promotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_runtime_promotion_operator_authorization_request_packet",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
}

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${scriptPath} did not emit JSON: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"promotionAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
