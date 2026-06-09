import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_AUTHORIZED_ATTEMPT_RESULT_20260609.md";
const runnerPath = "scripts/run-twii-bounded-readonly-preflight-once.mjs";
const postRunReviewPath = "scripts/report-twii-bounded-readonly-preflight-post-run-review.mjs";
const packetReportPath = "scripts/report-twii-bounded-readonly-preflight-single-attempt-execution-packet.mjs";

const attemptId = "twii-bounded-readonly-preflight-20260609-a";
const confirmationToken = "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE";
const authorizationPhrase = "CEO_AUTHORIZES_ONE_TWII_BOUNDED_READONLY_PREFLIGHT_ATTEMPT_20260609_A";
const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";
const outDir = "tmp/twii-bounded-readonly-preflight-20260609-a";
const boundarySummaryPath = `${outDir}/twii-bounded-readonly-preflight-boundary-${attemptId}.json`;
const executeSummaryPath = `${outDir}/twii-bounded-readonly-preflight-stub-${attemptId}.json`;

const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Status: `twii_bounded_readonly_preflight_authorized_attempt_blocked_execute_not_enabled_no_remote_attempt`",
  authorizationPhrase,
  attemptId,
  confirmationToken,
  candidateArtifactPath,
  "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready",
  "ready_for_single_remote_readonly_attempt_not_executed",
  "accepted_real_readonly_boundary_dry_run_no_remote_attempt",
  "twii_bounded_readonly_preflight_real_readonly_boundary_blocked_execute_not_enabled",
  "blocked_execute_requested_no_remote_attempt",
  "twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path",
  "No SQL",
  "No Supabase connection",
  "No Supabase read",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const packet = runJson([packetReportPath]);
if (packet.status !== "twii_bounded_readonly_preflight_single_attempt_execution_packet_ready_not_executed") {
  problems.push("single-attempt execution packet must remain ready not executed");
}
assertReportSafety(packet.safety, "packet safety", [
  "sqlAllowed",
  "supabaseConnectionAllowedInThisPacket",
  "supabaseReadAllowedInThisPacket",
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
]);

const boundaryDryRun = runJson([
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
if (boundaryDryRun.status !== "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready") {
  problems.push("pre-run boundary dry-run must be ready");
}
if (boundaryDryRun.outcome !== "ready_for_single_remote_readonly_attempt_not_executed") {
  problems.push("pre-run boundary dry-run outcome must be not executed");
}
assertRunnerSafety(boundaryDryRun.safety, "boundary dry-run safety");

const boundaryReview = runJson([postRunReviewPath, "--summary-path", boundarySummaryPath]);
if (boundaryReview.outcome !== "accepted_real_readonly_boundary_dry_run_no_remote_attempt") {
  problems.push("boundary post-run review must accept dry-run");
}
assertReviewSafety(boundaryReview.safety, "boundary post-run review safety");

const executeAttempt = runJson([
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
  "--authorization-phrase",
  authorizationPhrase,
  "--out-dir",
  outDir
]);
if (executeAttempt.status !== "twii_bounded_readonly_preflight_real_readonly_boundary_blocked_execute_not_enabled") {
  problems.push("execute attempt must be blocked because execute is not enabled");
}
if (executeAttempt.outcome !== "blocked_execute_requested_no_remote_attempt") {
  problems.push("execute attempt outcome must be blocked no remote attempt");
}
assertRunnerSafety(executeAttempt.safety, "execute attempt safety");

const executeReview = runJsonAllowFailure([postRunReviewPath, "--summary-path", executeSummaryPath]);
if (executeReview.status !== "blocked" || executeReview.outcome !== "blocked") {
  problems.push("execute post-run review must remain blocked");
}
assertReviewSafety(executeReview.safety, "execute post-run review safety");

const ready = problems.length === 0;
const report = {
  status: ready
    ? "twii_bounded_readonly_preflight_authorized_attempt_blocked_execute_not_enabled_no_remote_attempt"
    : "blocked",
  outcome: ready ? "blocked_execute_not_enabled_no_remote_attempt" : "blocked",
  docPath,
  attemptId,
  authorizationPhrase,
  boundarySummaryPath,
  executeSummaryPath,
  preRunBoundaryDryRunStatus: boundaryDryRun.status ?? null,
  preRunBoundaryPostRunReviewStatus: boundaryReview.status ?? null,
  readonlyAttemptStatus: executeAttempt.status ?? null,
  readonlyAttemptPostRunReviewStatus: executeReview.status ?? null,
  nextRecommendedSlice: "twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadAttempted: false,
    supabaseWriteAttempted: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
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

function runJsonAllowFailure(args) {
  const run = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${args[0]} stdout is not valid JSON`);
    return {};
  }
}

function assertReportSafety(safety, label, falseKeys) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of falseKeys) {
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
