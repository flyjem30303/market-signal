import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_REAL_READONLY_RUNNER_BOUNDARY.md";
const finalGateReportPath = "scripts/report-twii-bounded-readonly-preflight-final-execution-gate.mjs";
const runnerPath = "scripts/run-twii-bounded-readonly-preflight-once.mjs";
const postRunReviewPath = "scripts/report-twii-bounded-readonly-preflight-post-run-review.mjs";
const attemptId = "twii-bounded-readonly-preflight-20260609-a";
const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";
const confirmationToken = "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE";
const outDir = "tmp/twii-bounded-readonly-preflight-20260609-a";
const summaryPath = `${outDir}/twii-bounded-readonly-preflight-boundary-${attemptId}.json`;

const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Status: `twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt`",
  "twii_bounded_readonly_preflight_final_execution_gate_ready_not_executed",
  "ready_for_explicit_single_attempt_decision_not_executed",
  "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready",
  "ready_for_single_remote_readonly_attempt_not_executed",
  "twii_bounded_readonly_preflight_real_readonly_boundary_blocked_execute_not_enabled",
  "blocked_execute_requested_no_remote_attempt",
  "twii_bounded_readonly_preflight_post_run_review_accepted_real_readonly_boundary_dry_run",
  "accepted_real_readonly_boundary_dry_run_no_remote_attempt",
  "ready_for_single_remote_readonly_attempt_authorization_not_executed",
  "--dry-run-real-readonly-boundary",
  "--execute",
  "No SQL",
  "No Supabase connection in this boundary slice",
  "No Supabase read in this boundary slice",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const finalGate = runJson([finalGateReportPath]);
if (finalGate.status !== "twii_bounded_readonly_preflight_final_execution_gate_ready_not_executed") {
  problems.push("final execution gate must remain ready not executed");
}
if (finalGate.outcome !== "ready_for_explicit_single_attempt_decision_not_executed") {
  problems.push("final execution gate outcome must remain ready for explicit decision");
}
assertReportSafety(finalGate.safety, "final gate safety", "supabaseConnectionAllowedInThisGate");

const dryRun = runJson([
  runnerPath,
  "--attempt-id",
  attemptId,
  "--candidate-artifact-path",
  candidateArtifactPath,
  "--mode",
  "aggregate-only-readonly",
  "--confirm",
  confirmationToken,
  "--dry-run-real-readonly-boundary",
  "--out-dir",
  outDir
]);
if (dryRun.status !== "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready") {
  problems.push("boundary dry-run must be ready");
}
if (dryRun.outcome !== "ready_for_single_remote_readonly_attempt_not_executed") {
  problems.push("boundary dry-run outcome must be not executed");
}
if (dryRun.remoteExecutionBoundaryImplemented !== true || dryRun.remoteExecutionImplemented !== false) {
  problems.push("boundary dry-run must implement boundary but not remote execution");
}
assertRunnerSafety(dryRun.safety, "boundary dry-run safety");

const executeBlocked = runJson([
  runnerPath,
  "--attempt-id",
  attemptId,
  "--candidate-artifact-path",
  candidateArtifactPath,
  "--mode",
  "aggregate-only-readonly",
  "--confirm",
  confirmationToken,
  "--execute",
  "--out-dir",
  outDir
]);
if (executeBlocked.status !== "twii_bounded_readonly_preflight_real_readonly_boundary_blocked_execute_not_enabled") {
  problems.push("execute path must be blocked in this build");
}
if (executeBlocked.outcome !== "blocked_execute_requested_no_remote_attempt") {
  problems.push("execute path outcome must block with no remote attempt");
}
assertRunnerSafety(executeBlocked.safety, "execute-blocked safety");

const postRunReview = runJson([postRunReviewPath, "--summary-path", summaryPath]);
if (postRunReview.status !== "twii_bounded_readonly_preflight_post_run_review_accepted_real_readonly_boundary_dry_run") {
  problems.push("post-run review must accept boundary dry-run summary");
}
if (postRunReview.outcome !== "accepted_real_readonly_boundary_dry_run_no_remote_attempt") {
  problems.push("post-run review outcome must accept boundary dry-run no remote");
}
assertReviewSafety(postRunReview.safety, "post-run review safety");

const ready = problems.length === 0;
const report = {
  status: ready ? "twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt" : "blocked",
  outcome: ready ? "ready_for_single_remote_readonly_attempt_authorization_not_executed" : "blocked",
  docPath,
  attemptId,
  candidateArtifactPath,
  summaryPath,
  dryRunStatus: dryRun.status ?? null,
  executeBlockedStatus: executeBlocked.status ?? null,
  postRunReviewStatus: postRunReview.status ?? null,
  nextRecommendedSlice: "twii_bounded_readonly_preflight_single_attempt_authorization",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseConnectionAllowedInThisBoundary: false,
    supabaseReadAllowedInThisBoundary: false,
    supabaseWriteAllowed: false,
    marketDataFetchAllowed: false,
    marketDataIngestAllowed: false,
    dailyPricesMutationAllowed: false,
    stagingRowsAllowed: false,
    candidateRowsAcceptanceAllowed: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutputAllowed: false,
    rowPayloadOutputAllowed: false,
    stockIdPayloadOutputAllowed: false,
    secretOutputAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ready) process.exit(1);

function runJson(args) {
  const run = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let parsed = {};
  try {
    parsed = JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${args[0]} stdout is not valid JSON`);
  }
  if (run.status !== 0) problems.push(`${args[0]} failed`);
  return parsed;
}

function assertReportSafety(safety, label, connectionKey) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    connectionKey,
    "supabaseWriteAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function assertRunnerSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function assertReviewSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseConnectionAllowed",
    "supabaseReadAllowedByThisReview",
    "supabaseWriteAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
