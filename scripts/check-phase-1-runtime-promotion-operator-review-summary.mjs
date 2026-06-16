import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_REVIEW_SUMMARY.md";
const packetPath = "data/evidence-intake/phase-1-runtime-promotion-operator-packet.draft.json";
const intakeCheckerPath = "scripts/check-phase-1-runtime-promotion-operator-packet-intake.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const packet = JSON.parse(read(packetPath));
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const intake = runJson(intakeCheckerPath);

for (const phrase of [
  "Status: `phase_1_runtime_promotion_operator_review_summary_ready_no_execution`",
  "Decision: `KEEP_MOCK_AND_PREPARE_SEPARATE_BOUNDED_PROMOTION_ATTEMPT_REVIEW`",
  "`phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution`",
  "`promotionAllowedNow=false`",
  "`dryRunOnlyAllowedNow=true`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`operatorDecision=RUN_PROMOTION_DRY_RUN_ONLY`",
  "`phase_1_runtime_promotion_separate_bounded_attempt_review_packet`",
  "Keep mock runtime now"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const field of [
  "runtimeFlagName",
  "runtimeFlagTargetValue",
  "rollbackOwner",
  "rollbackCommand",
  "readbackCommand",
  "productionSmokeCommand",
  "postPromotionReviewOwner",
  "publicCopyFallbackLine",
  "freshnessFallbackLine"
]) {
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing reviewed field ${field}`);
  if (typeof packet[field] !== "string" || packet[field].trim() === "") {
    problems.push(`${packetPath} missing non-empty ${field}`);
  }
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
expect(packet.promotionAllowedNow, false, "packet.promotionAllowedNow");
expect(packet.dryRunOnlyAllowedNow, true, "packet.dryRunOnlyAllowedNow");
expect(packet.publicDataSource, "mock", "packet.publicDataSource");
expect(packet.scoreSource, "mock", "packet.scoreSource");
expect(packet.operatorDecision, "RUN_PROMOTION_DRY_RUN_ONLY", "packet.operatorDecision");

expect(intake.status, "ok", "intake.status");
expect(intake.runnerStatus, "phase_1_runtime_promotion_dry_run_packet_shape_ready_no_execution", "intake.runnerStatus");
expect(intake.publicDataSource, "mock", "intake.publicDataSource");
expect(intake.scoreSource, "mock", "intake.scoreSource");

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-operator-review-summary"] !==
  "node scripts/check-phase-1-runtime-promotion-operator-review-summary.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-operator-review-summary script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-operator-review-summary")) {
  problems.push(`${reviewGatePath} missing operator review summary registration`);
}

for (const [label, text] of [
  [docPath, doc],
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
        ? "phase_1_runtime_promotion_operator_review_summary_ready_no_execution"
        : "phase_1_runtime_promotion_operator_review_summary_blocked",
      decision: "KEEP_MOCK_AND_PREPARE_SEPARATE_BOUNDED_PROMOTION_ATTEMPT_REVIEW",
      promotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: "phase_1_runtime_promotion_separate_bounded_attempt_review_packet",
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
