import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_BOUNDED_READONLY_RUNNER_BOUNDARY.md";
const attemptId = "phase1-data-online-readonly-20260615-a";
const summaryPath = `tmp/phase-1-data-online-readonly-boundary-${attemptId}.json`;
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const operatorDecision = parseJson(
  readText("data/evidence-intake/phase-1-readonly-operator-decision-record.json"),
  "data/evidence-intake/phase-1-readonly-operator-decision-record.json"
);

const runner = runJson("scripts/run-phase-1-data-online-bounded-readonly-attempt-once.mjs", "runner boundary", [
  "--attempt-id",
  attemptId,
  "--scope",
  "aggregate-readonly-daily-prices-level1-coverage",
  "--aggregate-only",
  "--confirm",
  "CEO_APPROVED_PHASE1_DATA_ONLINE_READONLY_ONCE",
  "--real-readonly-boundary",
  "true"
]);

const postRun = runJson("scripts/report-phase-1-data-online-bounded-readonly-post-run-review.mjs", "post-run review", [
  "--summary-path",
  summaryPath
]);

validatePrerequisites();
validateRunnerBoundary();
validatePostRun();
validateDoc();
validateRegistration();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_bounded_readonly_runner_boundary_ready"
    : "phase_1_data_online_bounded_readonly_runner_boundary_blocked",
  packetMode: "bounded_readonly_runner_boundary",
  attemptId,
  runnerStatus: runner.status ?? null,
  runnerOutcome: runner.outcome ?? null,
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
  expect(operatorDecision.status, "readonly_operator_decision_record_ready_no_execution", "operator decision status");
  expect(
    operatorDecision.operatorDecision,
    "accepted_for_exactly_one_bounded_readonly_attempt_implementation",
    "operator decision"
  );
  expect(operatorDecision.remoteAttemptedNow, false, "operator remoteAttemptedNow");
  expect(operatorDecision.executionOccurredNow, false, "operator executionOccurredNow");
}

function validateRunnerBoundary() {
  if (
    ![
      "phase_1_data_online_bounded_readonly_boundary_blocked_missing_env",
      "phase_1_data_online_bounded_readonly_boundary_dry_run_ready"
    ].includes(runner.status)
  ) {
    problems.push(`runner status must be boundary missing-env or dry-run-ready, got ${JSON.stringify(runner.status)}`);
  }
  if (
    ![
      "blocked_missing_env_no_remote_attempt",
      "dry_run_real_readonly_boundary_ready_no_remote_attempt"
    ].includes(runner.outcome)
  ) {
    problems.push(`runner outcome must be safe boundary outcome, got ${JSON.stringify(runner.outcome)}`);
  }
  expect(runner.attemptId, attemptId, "runner attemptId");
  expect(runner.summaryPath, summaryPath.replace(/\\/g, "/"), "runner summaryPath");
  expect(runner.confirmationPresent, true, "runner confirmationPresent");
  expect(runner.executionAuthorizedNow, false, "runner executionAuthorizedNow");
  expect(runner.readonlyAttemptExecutableNow, false, "runner readonlyAttemptExecutableNow");
  expect(runner.remoteAttempted, false, "runner remoteAttempted");
  expect(runner.remoteExecutionImplemented, true, "runner remoteExecutionImplemented");
  expect(runner.boundaryMode, "real_readonly_boundary_dry_run", "runner boundaryMode");
  if (!Array.isArray(runner.requiredEnvNames) || runner.requiredEnvNames.join(",") !== "NEXT_PUBLIC_SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY") {
    problems.push("runner requiredEnvNames must list only sanitized Supabase env names");
  }
  if (!runner.envPresence || typeof runner.envPresence !== "object") problems.push("runner envPresence object required");
  if (runner.safety?.secretsPrinted !== false) problems.push("runner must not print secrets");
  assertRunnerSafety(runner.safety, "runner safety");
}

function validatePostRun() {
  if (
    ![
      "phase_1_data_online_bounded_readonly_post_run_review_accepted_missing_env_boundary",
      "phase_1_data_online_bounded_readonly_post_run_review_accepted_boundary_dry_run_ready"
    ].includes(postRun.status)
  ) {
    problems.push(`post-run status must accept boundary output, got ${JSON.stringify(postRun.status)}`);
  }
  if (
    ![
      "accepted_missing_env_boundary_no_remote_attempt",
      "accepted_real_readonly_boundary_dry_run_ready_no_remote_attempt"
    ].includes(postRun.outcome)
  ) {
    problems.push(`post-run outcome must accept safe boundary output, got ${JSON.stringify(postRun.outcome)}`);
  }
  expect(postRun.summaryPath, summaryPath.replace(/\\/g, "/"), "post-run summaryPath");
  expect(postRun.remoteAttempted, false, "post-run remoteAttempted");
  assertReviewSafety(postRun.safety, "post-run safety");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_bounded_readonly_runner_boundary_ready",
    "bounded_readonly_runner_boundary",
    "real_readonly_boundary_dry_run",
    "run:phase-1-data-online-bounded-readonly-attempt-once",
    "report:phase-1-data-online-bounded-readonly-post-run-review",
    "phase_1_data_online_bounded_readonly_boundary_blocked_missing_env",
    "phase_1_data_online_bounded_readonly_boundary_dry_run_ready",
    "attemptId=phase1-data-online-readonly-20260615-a",
    "remoteAttempted=false",
    "executionAuthorizedNow=false",
    "readonlyAttemptExecutableNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "No SQL",
    "No Supabase write",
    "No staging rows",
    "No `daily_prices` mutation",
    "No market-row fetch",
    "No raw payload output",
    "No secret output",
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
    scripts["check:phase-1-data-online-bounded-readonly-runner-boundary"] !==
    "node scripts/check-phase-1-data-online-bounded-readonly-runner-boundary.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-bounded-readonly-runner-boundary");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-bounded-readonly-runner-boundary.mjs")) {
    problems.push("review gate missing bounded readonly runner boundary checker command");
  }
  if (!reviewGate.includes('"phase-1-data-online-bounded-readonly-runner-boundary"')) {
    problems.push("focused review gate missing bounded readonly runner boundary checker name");
  }
}

function assertRunnerSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") problems.push(`${label} must stay mock/mock`);
  for (const key of [
    "sqlExecuted",
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
