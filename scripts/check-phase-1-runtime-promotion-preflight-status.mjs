import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_PREFLIGHT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const postWriteGatePath = "scripts/check-phase-1-post-write-coverage-scoring-gate.mjs";
const dataOnlineGatePath = "scripts/check-phase-1-data-online-go-no-go-status.mjs";
const runtimePromotionGatePath = "scripts/check-runtime-promotion-readiness-summary.mjs";
const runtimeSummaryPath = "src/lib/runtime-promotion-readiness-summary.ts";
const nextGateQueuePath = "src/lib/post-readonly-next-gate-queue.ts";
const problems = [];

const doc = readText(docPath);
const packageJson = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const runtimeSummary = readText(runtimeSummaryPath);
const nextGateQueue = readText(nextGateQueuePath);
const postWriteGate = runJson(postWriteGatePath);
const dataOnlineGate = runJson(dataOnlineGatePath);
const runtimePromotionGate = runJson(runtimePromotionGatePath);

for (const phrase of [
  "phase_1_runtime_promotion_preflight_ready_no_go",
  "KEEP_MOCK_RUNTIME_PREPARE_REAL_PROMOTION_REVIEW",
  "NO_GO_FOR_REAL_RUNTIME_PROMOTION",
  "row coverage is complete",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Data quality",
  "Freshness display",
  "Source disclosure",
  "Rollback / fail-closed",
  "Public copy boundary",
  "phase_1_runtime_promotion_preflight_quality_freshness_source_rollback_copy_review"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

expect(postWriteGate.status, "ok", "postWriteGate.status");
expect(postWriteGate.missingRowsAfterWrite, 0, "postWriteGate.missingRowsAfterWrite");
expect(postWriteGate.rowCoverageScoringAccepted, true, "postWriteGate.rowCoverageScoringAccepted");
expect(postWriteGate.runtimePromotionAllowedNow, false, "postWriteGate.runtimePromotionAllowedNow");
expect(postWriteGate.publicDataSource, "mock", "postWriteGate.publicDataSource");
expect(postWriteGate.scoreSource, "mock", "postWriteGate.scoreSource");

expect(dataOnlineGate.status, "ok", "dataOnlineGate.status");
expect(dataOnlineGate.accepted, true, "dataOnlineGate.accepted");
expect(dataOnlineGate.decision, "DATA_COVERAGE_COMPLETE_BUT_RUNTIME_PROMOTION_NO_GO", "dataOnlineGate.decision");
expect(dataOnlineGate.runtimePromotionAllowedNow, false, "dataOnlineGate.runtimePromotionAllowedNow");

expect(runtimePromotionGate.status, "ok", "runtimePromotionGate.status");

for (const phrase of [
  "promotion_gate_pending",
  "coverage_complete_promotion_pending",
  "prepare_runtime_promotion_gate_preflight",
  "missingRows: 0",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runtimeSummary.includes(phrase)) problems.push(`${runtimeSummaryPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "runtime_promotion_preflight_preparation",
  "row_coverage",
  "status: \"local_ready\"",
  "data_quality",
  "source_depth",
  "needs_role_review"
]) {
  if (!nextGateQueue.includes(phrase)) problems.push(`${nextGateQueuePath} missing phrase: ${phrase}`);
}

if (
  packageJson.scripts?.["check:phase-1-runtime-promotion-preflight-status"] !==
  "node scripts/check-phase-1-runtime-promotion-preflight-status.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-preflight-status`);
}

if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-preflight-status.mjs")) {
  problems.push(`${reviewGatePath} missing checker command`);
}

if (!reviewGate.includes('"phase-1-runtime-promotion-preflight-status"')) {
  problems.push(`${reviewGatePath} missing focused gate name`);
}

for (const [label, text] of [
  [docPath, doc],
  [runtimeSummaryPath, runtimeSummary],
  [nextGateQueuePath, nextGateQueue]
]) {
  for (const pattern of [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /SQL execution is approved/u,
    /Supabase write is approved/u,
    /guaranteed return/iu,
    /buy now/iu
  ]) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
  }
}

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_preflight_ready_no_go"
        : "phase_1_runtime_promotion_preflight_blocked",
      decision: "KEEP_MOCK_RUNTIME_PREPARE_REAL_PROMOTION_REVIEW",
      promotionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      readyGates: ["row_coverage", "data_online_no_go", "runtime_readiness_summary"],
      needsReviewGates: ["data_quality", "freshness_display", "source_disclosure", "rollback_fail_closed", "public_copy_boundary"],
      nextRoute: "phase_1_runtime_promotion_preflight_quality_freshness_source_rollback_copy_review",
      safety: {
        sqlExecuted: false,
        supabaseWriteAttempted: false,
        stagingRowsCreated: false,
        dailyPricesMutated: false,
        marketDataFetched: false,
        rawPayloadOutput: false,
        rowPayloadOutput: false,
        stockIdPayloadOutput: false,
        secretsOutput: false,
        publicDataSourcePromoted: false,
        scoreSourcePromoted: false
      },
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 2,
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

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "{}";
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}
