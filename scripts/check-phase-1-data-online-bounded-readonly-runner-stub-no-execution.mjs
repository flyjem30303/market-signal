import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_BOUNDED_READONLY_RUNNER_STUB_NO_EXECUTION.md";
const attemptId = "phase1-data-online-readonly-20260615-a";
const summaryPath = `tmp/phase-1-data-online-readonly-stub-${attemptId}.json`;
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const packet = runJson(
  "scripts/check-phase-1-data-online-bounded-readonly-attempt-packet-no-execution.mjs",
  "bounded readonly attempt packet"
);

const runner = runJson("scripts/run-phase-1-data-online-bounded-readonly-attempt-once.mjs", "runner stub", [
  "--attempt-id",
  attemptId,
  "--scope",
  "aggregate-readonly-daily-prices-level1-coverage",
  "--aggregate-only"
]);
const postRun = runJson("scripts/report-phase-1-data-online-bounded-readonly-post-run-review.mjs", "post-run review", [
  "--summary-path",
  summaryPath
]);

validatePrerequisites();
validateRunner();
validatePostRun();
validateDoc();
validateRegistration();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_bounded_readonly_runner_stub_no_execution_ready"
    : "phase_1_data_online_bounded_readonly_runner_stub_no_execution_blocked",
  packetMode: "bounded_readonly_runner_stub_no_execution",
  runnerStubReady: ok,
  attemptId,
  runnerStatus: runner.status ?? null,
  postRunReviewStatus: postRun.status ?? null,
  executionAuthorizedNow: false,
  readonlyAttemptExecutableNow: false,
  remoteAttempted: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(packet.status, "ok", "packet status");
  expect(
    packet.guardedStatus,
    "phase_1_data_online_bounded_readonly_attempt_packet_no_execution_ready",
    "packet guarded status"
  );
  expect(packet.attemptId, attemptId, "packet attemptId");
  expect(packet.executionAuthorizedNow, false, "packet executionAuthorizedNow");
  expect(packet.readonlyAttemptExecutableNow, false, "packet readonlyAttemptExecutableNow");
}

function validateRunner() {
  expect(runner.status, "phase_1_data_online_bounded_readonly_stub_blocked_confirmation_required", "runner status");
  expect(runner.outcome, "blocked_fail_closed_no_remote_attempt", "runner outcome");
  expect(runner.attemptId, attemptId, "runner attemptId");
  expect(runner.summaryPath, summaryPath.replace(/\\/g, "/"), "runner summaryPath");
  expect(runner.confirmationPresent, false, "runner confirmationPresent");
  expect(runner.executionAuthorizedNow, false, "runner executionAuthorizedNow");
  expect(runner.remoteAttempted, false, "runner remoteAttempted");
  assertRunnerSafety(runner.safety, "runner safety");
}

function validatePostRun() {
  expect(
    postRun.status,
    "phase_1_data_online_bounded_readonly_post_run_review_accepted_fail_closed_stub",
    "post-run status"
  );
  expect(postRun.outcome, "accepted_fail_closed_stub_no_remote_attempt", "post-run outcome");
  expect(postRun.summaryPath, summaryPath.replace(/\\/g, "/"), "post-run summaryPath");
  expect(postRun.remoteAttempted, false, "post-run remoteAttempted");
  assertReviewSafety(postRun.safety, "post-run safety");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_bounded_readonly_runner_stub_no_execution_ready",
    "bounded_readonly_runner_stub_no_execution",
    "run:phase-1-data-online-bounded-readonly-attempt-once",
    "report:phase-1-data-online-bounded-readonly-post-run-review",
    "phase_1_data_online_bounded_readonly_stub_blocked_confirmation_required",
    "blocked_fail_closed_no_remote_attempt",
    "accepted_fail_closed_stub_no_remote_attempt",
    "attemptId=phase1-data-online-readonly-20260615-a",
    "remoteAttempted=false",
    "executionAuthorizedNow=false",
    "readonlyAttemptExecutableNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No SQL",
    "No Supabase read or write",
    "No staging rows",
    "No `daily_prices` mutation",
    "No market-row fetch",
    "No raw payload output",
    "No source promotion",
    "No score promotion",
    "No public real-data claim",
    "No investment advice"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);
}

function validateRegistration() {
  const scripts = packageJson.scripts ?? {};
  if (
    scripts["run:phase-1-data-online-bounded-readonly-attempt-once"] !==
    "node scripts/run-phase-1-data-online-bounded-readonly-attempt-once.mjs"
  ) {
    problems.push("package.json missing run:phase-1-data-online-bounded-readonly-attempt-once");
  }
  if (
    scripts["report:phase-1-data-online-bounded-readonly-post-run-review"] !==
    "node scripts/report-phase-1-data-online-bounded-readonly-post-run-review.mjs"
  ) {
    problems.push("package.json missing report:phase-1-data-online-bounded-readonly-post-run-review");
  }
  if (
    scripts["check:phase-1-data-online-bounded-readonly-runner-stub-no-execution"] !==
    "node scripts/check-phase-1-data-online-bounded-readonly-runner-stub-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-bounded-readonly-runner-stub-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-bounded-readonly-runner-stub-no-execution.mjs")) {
    problems.push("review gate missing bounded readonly runner stub checker command");
  }
  if (!reviewGate.includes('"phase-1-data-online-bounded-readonly-runner-stub-no-execution"')) {
    problems.push("focused review gate missing bounded readonly runner stub checker name");
  }
}

function assertRunnerSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") problems.push(`${label} must stay mock/mock`);
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function assertReviewSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") problems.push(`${label} must stay mock/mock`);
  for (const key of [
    "sqlAllowed",
    "supabaseConnectionAllowed",
    "supabaseReadAllowedByThisReview",
    "supabaseWriteAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function runJson(filePath, label, args = []) {
  const run = spawnSync(process.execPath, [filePath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${label} exited ${run.status}`);
  return parseJson(run.stdout, label);
}
