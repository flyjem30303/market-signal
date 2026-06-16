import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_AUTHORIZATION_REQUEST_PACKET.md";
const boundedPacketPath = "docs/PHASE_1_RUNTIME_PROMOTION_SEPARATE_BOUNDED_ATTEMPT_REVIEW_PACKET.md";
const operatorPacketPath = "data/evidence-intake/phase-1-runtime-promotion-operator-packet.draft.json";
const boundedCheckerPath = "scripts/check-phase-1-runtime-promotion-separate-bounded-attempt-review-packet.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const boundedPacket = read(boundedPacketPath);
const operatorPacket = JSON.parse(read(operatorPacketPath));
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const boundedCheck = runJson(boundedCheckerPath);

for (const phrase of [
  "Status: `phase_1_runtime_promotion_operator_authorization_request_packet_ready_no_execution`",
  "Decision: `REQUEST_OPERATOR_AUTHORIZATION_KEEP_MOCK`",
  "`promotionAllowedNow=false`",
  "`dryRunOnlyAllowedNow=true`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`operatorDecision=RUN_PROMOTION_DRY_RUN_ONLY`",
  "`Authorize one bounded public-source promotion attempt preparation from mock toward the reviewed target, with rollback, readback, smoke, and post-run review required before any public real-data claim.`",
  "`REJECT_KEEP_MOCK`",
  "`APPROVE_DRY_RUN_ONLY`",
  "`APPROVE_BOUNDED_ATTEMPT_PREP_ONLY`",
  "No request outcome may directly execute mutation",
  "`keep_mock_and_request_repair`",
  "`phase_1_runtime_promotion_pre_execution_packet_no_execution`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "runtime flag name reviewed",
  "future target value reviewed",
  "rollback owner available",
  "rollback shape reviewed",
  "readback command shape reviewed",
  "production smoke command shape reviewed",
  "post-run review owner available",
  "public fallback copy reviewed",
  "freshness fallback copy reviewed",
  "no secret values printed or requested",
  "no raw row payloads printed or requested",
  "no investment advice or real-time guarantee"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing confirmation: ${phrase}`);
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

if (!boundedPacket.includes("`phase_1_runtime_promotion_operator_authorization_request_packet`")) {
  problems.push(`${boundedPacketPath} must route to operator authorization request packet`);
}

expect(boundedCheck.status, "ok", "boundedCheck.status");
expect(
  boundedCheck.guardedStatus,
  "phase_1_runtime_promotion_separate_bounded_attempt_review_packet_ready_no_execution",
  "boundedCheck.guardedStatus"
);
expect(operatorPacket.promotionAllowedNow, false, "operatorPacket.promotionAllowedNow");
expect(operatorPacket.dryRunOnlyAllowedNow, true, "operatorPacket.dryRunOnlyAllowedNow");
expect(operatorPacket.publicDataSource, "mock", "operatorPacket.publicDataSource");
expect(operatorPacket.scoreSource, "mock", "operatorPacket.scoreSource");

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-operator-authorization-request-packet"] !==
  "node scripts/check-phase-1-runtime-promotion-operator-authorization-request-packet.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-operator-authorization-request-packet script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-operator-authorization-request-packet")) {
  problems.push(`${reviewGatePath} missing operator authorization request packet registration`);
}

for (const [label, text] of [
  [docPath, doc],
  [boundedPacketPath, boundedPacket],
  [operatorPacketPath, JSON.stringify(operatorPacket)]
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
        ? "phase_1_runtime_promotion_operator_authorization_request_packet_ready_no_execution"
        : "phase_1_runtime_promotion_operator_authorization_request_packet_blocked",
      decision: "REQUEST_OPERATOR_AUTHORIZATION_KEEP_MOCK",
      promotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_runtime_promotion_operator_authorization_response_template",
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
