import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-write-runner-execution-authorization-gate-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_WRITE_RUNNER_EXECUTION_AUTHORIZATION_GATE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-runner-exec-auth-"));

try {
  const acceptedScaffoldPath = writeJson("accepted-runner-scaffold.json", makeAcceptedRunnerScaffold());
  const blockedScaffoldPath = writeJson("blocked-runner-scaffold.json", { ...makeAcceptedRunnerScaffold(), status: "blocked" });
  const acceptedAuthorizationPath = writeJson("accepted-runner-execution-authorization.json", makeAcceptedExecutionAuthorization());
  const rowPayloadAuthorizationPath = writeJson("row-payload-authorization.json", { ...makeAcceptedExecutionAuthorization(), rows: [] });
  const secretAuthorizationPath = writeJson("secret-authorization.json", { ...makeAcceptedExecutionAuthorization(), token: "DO_NOT_LOG" });
  const realPromotionAuthorizationPath = writeJson("real-promotion-authorization.json", { ...makeAcceptedExecutionAuthorization(), scoreSource: "real" });
  const etfAuthorizationPath = writeJson("etf-authorization.json", { ...makeAcceptedExecutionAuthorization(), note: "006208 deferred scope" });
  const executableAuthorizationPath = writeJson("executable-authorization.json", { ...makeAcceptedExecutionAuthorization(), runnerExecutableNow: true });
  const wrongDecisionAuthorizationPath = writeJson("wrong-decision-authorization.json", {
    ...makeAcceptedExecutionAuthorization(),
    runnerExecutionAuthorizationDecision: "APPROVE_WRITE_NOW"
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--runner-scaffold", acceptedScaffoldPath, "--runner-execution-authorization", acceptedAuthorizationPath]));
  validateRejectedRun("blocked scaffold", runNode(["--runner-scaffold", blockedScaffoldPath, "--runner-execution-authorization", acceptedAuthorizationPath]));
  validateRejectedRun("row payload authorization", runNode(["--runner-scaffold", acceptedScaffoldPath, "--runner-execution-authorization", rowPayloadAuthorizationPath]));
  validateRejectedRun("secret authorization", runNode(["--runner-scaffold", acceptedScaffoldPath, "--runner-execution-authorization", secretAuthorizationPath]));
  validateRejectedRun("real promotion authorization", runNode(["--runner-scaffold", acceptedScaffoldPath, "--runner-execution-authorization", realPromotionAuthorizationPath]));
  validateRejectedRun("etf authorization", runNode(["--runner-scaffold", acceptedScaffoldPath, "--runner-execution-authorization", etfAuthorizationPath]));
  validateRejectedRun("executable authorization", runNode(["--runner-scaffold", acceptedScaffoldPath, "--runner-execution-authorization", executableAuthorizationPath]));
  validateRejectedRun("wrong decision authorization", runNode(["--runner-scaffold", acceptedScaffoldPath, "--runner-execution-authorization", wrongDecisionAuthorizationPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_write_runner_execution_authorization_gate_no_execution_ready"
      : "phase_1_current_scope_write_runner_execution_authorization_gate_no_execution_blocked",
    acceptedRunnerExecutionAuthorizationReady: true,
    blockedScaffoldRejected: true,
    rowPayloadRejected: true,
    secretAuthorizationRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableAuthorizationRejected: true,
    wrongDecisionRejected: true,
    runnerExecutableNow: false,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: ok
      ? "prepare_current_scope_write_runner_dry_run_packet_no_execution"
      : "keep_mock_and_repair_write_runner_execution_authorization",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedRunnerScaffold() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_write_capable_runner_scaffold_ready_no_execution",
    runnerScaffoldPreparedNow: true,
    runnerExecutableNow: false,
    runnerScaffold: {
      scaffoldMode: "write_capable_scaffold_no_execution",
      runnerMode: "write_capable_scaffold_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      requiredServerInputs: ["server_only_supabase_url_presence", "server_only_write_credential_presence", "operator_execute_switch_value_not_logged"],
      requiredRuntimeGuards: ["abort_if_any_required_server_input_missing", "abort_if_candidate_artifact_scope_mismatch", "abort_if_public_runtime_promotion_requested"],
      requiredDryRunGuards: ["dry_run_summary_before_any_future_write", "dry_run_reports_counts_only", "dry_run_outputs_no_secrets"],
      requiredAbortConditions: ["missing_runtime_inputs", "scope_mismatch", "readback_or_rollback_plan_missing"],
      requiredReadbackReview: ["aggregate_count_readback", "affected_date_range_readback", "duplicate_rejection_summary"],
      requiredRollbackReview: ["attempt_id_scoped_rollback_or_noop_record", "quarantine_decision", "pm_review_before_second_attempt"],
      runnerExecutableNow: false,
      boundedWriteExecutableNow: false,
      candidateRowsAcceptedNow: false,
      writeGateOpenedNow: false,
      sqlExecuted: false,
      supabaseWriteAttempted: false,
      dailyPricesMutated: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "await_separate_current_scope_write_runner_execution_authorization_no_execution",
    problems: []
  };
}

function makeAcceptedExecutionAuthorization() {
  return {
    runnerExecutionAuthorizationDecision: "APPROVE_PREPARE_ONE_BOUNDED_WRITE_RUNNER_EXECUTION_ATTEMPT",
    attemptId: "phase-1-current-scope-attempt-example",
    runnerScaffoldPreparedNow: true,
    operationKindConfirmed: true,
    runtimeGuardsConfirmed: true,
    dryRunGuardsConfirmed: true,
    abortConditionsConfirmed: true,
    readbackReviewConfirmed: true,
    rollbackReviewConfirmed: true,
    postRunReviewConfirmed: true,
    publicRuntimeStaysMockConfirmed: true,
    scoreSourceStaysMockConfirmed: true,
    runnerExecutableNow: false,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_write_runner_execution_authorization_gate_blocked_missing_inputs", "missingArgs.guardedStatus");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted runner execution authorization should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_write_runner_execution_authorization_gate_ready_no_execution", "accepted.guardedStatus");
  expect(result.output.runnerExecutionAuthorizationAcceptedNow, true, "accepted.runnerExecutionAuthorizationAcceptedNow");
  expect(result.output.futureExecutionAttemptPreparedNow, true, "accepted.futureExecutionAttemptPreparedNow");
  expect(result.output.nextRoute, "prepare_current_scope_write_runner_dry_run_packet_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const attempt = result.output.futureExecutionAttempt;
  if (!attempt || typeof attempt !== "object") {
    problems.push("accepted.futureExecutionAttempt must be an object");
    return;
  }
  expect(attempt.attemptMode, "one_bounded_write_runner_execution_attempt_no_execution", "futureExecutionAttempt.attemptMode");
  expect(attempt.attemptId, "phase-1-current-scope-attempt-example", "futureExecutionAttempt.attemptId");
  expect(attempt.scope, "twii_plus_listed_stock_daily_close", "futureExecutionAttempt.scope");
  expect(attempt.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "futureExecutionAttempt.operationKind");
  expect(attempt.requiredNextPacket, "current_scope_write_runner_dry_run_packet_no_execution", "futureExecutionAttempt.requiredNextPacket");
  expectSafeFlags(attempt, "futureExecutionAttempt");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_write_runner_execution_authorization_gate_no_execution_ready",
      "APPROVE_PREPARE_ONE_BOUNDED_WRITE_RUNNER_EXECUTION_ATTEMPT",
      "prepare_current_scope_write_runner_dry_run_packet_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Write Runner Execution Authorization Gate",
      "phase_1_current_scope_write_runner_execution_authorization_gate_no_execution_ready",
      "prepare_current_scope_write_runner_dry_run_packet_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-write-runner-execution-authorization-gate-once"] !==
    "node scripts/run-phase-1-current-scope-write-runner-execution-authorization-gate-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-write-runner-execution-authorization-gate-no-execution"] !==
    "node scripts/check-phase-1-current-scope-write-runner-execution-authorization-gate-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-write-runner-execution-authorization-gate-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing runner execution authorization checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-write-runner-execution-authorization-gate-no-execution"')) {
    problems.push(`${reviewGatePath} missing runner execution authorization focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [[runnerPath, runnerSource], [docPath, doc]]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (/process\.env/u.test(runnerSource)) problems.push(`${runnerPath} must not read process.env`);
}

function runNode(args) {
  const run = spawnSync(process.execPath, [runnerPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let output = {};
  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${runnerPath} ${args.join(" ")} did not emit JSON: ${error.message}`);
  }
  return { exitCode: run.status, output };
}

function expectSafeFlags(output, label) {
  for (const [field, expected] of [
    ["runnerExecutableNow", false],
    ["boundedWriteExecutableNow", false],
    ["candidateRowsAcceptedNow", false],
    ["writeGateOpenedNow", false],
    ["sqlExecuted", false],
    ["supabaseWriteAttempted", false],
    ["dailyPricesMutated", false],
    ["publicDataSource", "mock"],
    ["scoreSource", "mock"]
  ]) {
    expect(output[field], expected, `${label}.${field}`);
  }
}

function writeJson(fileName, value) {
  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
  return filePath;
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
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
    /\.rpc\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /runnerExecutableNow"\s*:\s*true/u,
    /boundedWriteExecutableNow"\s*:\s*true/u,
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /writeGateOpenedNow"\s*:\s*true/u,
    /sqlExecuted"\s*:\s*true/u,
    /supabaseWriteAttempted"\s*:\s*true/u,
    /dailyPricesMutated"\s*:\s*true/u,
    /envValuesReadNow"\s*:\s*true/u,
    /secretValuesOutputNow"\s*:\s*true/u,
    /confirmationPhraseValueOutputNow"\s*:\s*true/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
