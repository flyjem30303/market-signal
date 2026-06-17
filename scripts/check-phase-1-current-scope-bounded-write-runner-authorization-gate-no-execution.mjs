import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-bounded-write-runner-authorization-gate-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_BOUNDED_WRITE_RUNNER_AUTHORIZATION_GATE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-runner-authorization-"));

try {
  const acceptedPacketPath = writeJson("accepted-packet.json", makeAcceptedExecutionPacket());
  const blockedPacketPath = writeJson("blocked-packet.json", { ...makeAcceptedExecutionPacket(), status: "blocked" });
  const acceptedAuthorizationPath = writeJson("accepted-authorization.json", makeAcceptedAuthorization());
  const rejectedAuthorizationPath = writeJson("rejected-authorization.json", { runnerAuthorizationDecision: "REJECT_OR_REPAIR" });
  const rowPayloadAuthorizationPath = writeJson("row-payload-authorization.json", { ...makeAcceptedAuthorization(), rows: [] });
  const secretAuthorizationPath = writeJson("secret-authorization.json", { ...makeAcceptedAuthorization(), token: "DO_NOT_LOG" });
  const realPromotionAuthorizationPath = writeJson("real-promotion-authorization.json", { ...makeAcceptedAuthorization(), scoreSource: "real" });
  const etfAuthorizationPath = writeJson("etf-authorization.json", { ...makeAcceptedAuthorization(), note: "0050 deferred scope" });
  const executableAuthorizationPath = writeJson("executable-authorization.json", { ...makeAcceptedAuthorization(), runnerExecutableNow: true });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--execution-packet", acceptedPacketPath, "--runner-authorization", acceptedAuthorizationPath]));
  validateRejectedRun(
    "rejected authorization",
    runNode(["--execution-packet", acceptedPacketPath, "--runner-authorization", rejectedAuthorizationPath]),
    "phase_1_current_scope_bounded_write_runner_authorization_gate_rejected_or_repair_no_execution"
  );
  validateRejectedRun("blocked packet", runNode(["--execution-packet", blockedPacketPath, "--runner-authorization", acceptedAuthorizationPath]));
  validateRejectedRun("row payload authorization", runNode(["--execution-packet", acceptedPacketPath, "--runner-authorization", rowPayloadAuthorizationPath]));
  validateRejectedRun("secret authorization", runNode(["--execution-packet", acceptedPacketPath, "--runner-authorization", secretAuthorizationPath]));
  validateRejectedRun("real promotion authorization", runNode(["--execution-packet", acceptedPacketPath, "--runner-authorization", realPromotionAuthorizationPath]));
  validateRejectedRun("etf authorization", runNode(["--execution-packet", acceptedPacketPath, "--runner-authorization", etfAuthorizationPath]));
  validateRejectedRun("executable authorization", runNode(["--execution-packet", acceptedPacketPath, "--runner-authorization", executableAuthorizationPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_bounded_write_runner_authorization_gate_no_execution_ready"
      : "phase_1_current_scope_bounded_write_runner_authorization_gate_no_execution_blocked",
    acceptedRunnerAuthorizationReady: true,
    rejectedOrRepairAuthorizationRecorded: true,
    blockedPacketRejected: true,
    rowPayloadRejected: true,
    secretAuthorizationRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableAuthorizationRejected: true,
    runnerAuthorizationAcceptedNow: true,
    runnerExecutableNow: false,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: ok ? "prepare_current_scope_write_capable_runner_scaffold_no_execution" : "keep_mock_and_repair_runner_authorization_gate",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedExecutionPacket() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_packet_ready_no_execution",
    executionPacketPreparedNow: true,
    executionPacket: {
      packetMode: "current_scope_bounded_write_execution_packet_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      candidateArtifactPathReferencePresent: true,
      requiredRuntimeInputs: ["server_only_supabase_url_presence", "server_only_write_credential_presence", "abort_switch_presence"],
      requiredStopConditions: ["missing_runtime_inputs", "scope_mismatch", "readback_plan_missing"],
      requiredReadbackPlan: ["aggregate_count_readback_after_attempt", "affected_date_range_readback_after_attempt", "duplicate_rejection_summary_after_attempt"],
      requiredRollbackPlan: ["quarantine_decision_after_attempt", "attempt_id_scoped_reversal_or_noop_record", "operator_review_required_before_second_attempt"],
      requiredPostRunReview: ["pm_reviews_aggregate_counts_only", "public_runtime_source_stays_mock", "score_source_stays_mock"],
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
    nextRoute: "await_separate_current_scope_bounded_write_runner_authorization_no_execution",
    problems: []
  };
}

function makeAcceptedAuthorization() {
  return {
    runnerAuthorizationDecision: "APPROVE_PREPARE_WRITE_CAPABLE_RUNNER_SCAFFOLD",
    attemptId: "phase-1-current-scope-attempt-example",
    executionPacketPreparedNow: true,
    operationKindConfirmed: true,
    runtimeInputsPlanConfirmed: true,
    stopConditionsConfirmed: true,
    readbackPlanConfirmed: true,
    rollbackPlanConfirmed: true,
    postRunReviewConfirmed: true,
    abortSwitchPresent: true
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.runnerAuthorizationAcceptedNow, false, "missing.runnerAuthorizationAcceptedNow");
  expect(run.output.runnerScaffoldPreparationAllowedNow, false, "missing.runnerScaffoldPreparationAllowedNow");
  expectSafeFlags(run.output, "missing");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(run.output.guardedStatus, "phase_1_current_scope_bounded_write_runner_authorization_gate_ready_no_execution", "accepted.guardedStatus");
  expect(run.output.runnerAuthorizationAcceptedNow, true, "accepted.runnerAuthorizationAcceptedNow");
  expect(run.output.runnerScaffoldPreparationAllowedNow, true, "accepted.runnerScaffoldPreparationAllowedNow");
  expect(run.output.runnerExecutableNow, false, "accepted.runnerExecutableNow");
  expect(run.output.executionPacketPreparedNow, true, "accepted.executionPacketPreparedNow");
  expect(run.output.operationKindConfirmed, true, "accepted.operationKindConfirmed");
  expect(run.output.runtimeInputsPlanConfirmed, true, "accepted.runtimeInputsPlanConfirmed");
  expect(run.output.stopConditionsConfirmed, true, "accepted.stopConditionsConfirmed");
  expect(run.output.readbackPlanConfirmed, true, "accepted.readbackPlanConfirmed");
  expect(run.output.rollbackPlanConfirmed, true, "accepted.rollbackPlanConfirmed");
  expect(run.output.postRunReviewConfirmed, true, "accepted.postRunReviewConfirmed");
  expect(run.output.abortSwitchPresent, true, "accepted.abortSwitchPresent");
  expect(run.output.nextRoute, "prepare_current_scope_write_capable_runner_scaffold_no_execution", "accepted.nextRoute");
  expectSafeFlags(run.output, "accepted");
}

function validateRejectedRun(label, run, expectedGuardedStatus = null) {
  expect(run.exitCode, 1, `${label}.exitCode`);
  expect(run.output.status, "blocked", `${label}.status`);
  if (expectedGuardedStatus) expect(run.output.guardedStatus, expectedGuardedStatus, `${label}.guardedStatus`);
  expect(run.output.runnerExecutableNow, false, `${label}.runnerExecutableNow`);
  expectSafeFlags(run.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_bounded_write_runner_authorization_gate_no_execution_ready",
      "run:phase-1-current-scope-bounded-write-runner-authorization-gate-once",
      "check:phase-1-current-scope-bounded-write-runner-authorization-gate-no-execution",
      "--execution-packet",
      "--runner-authorization",
      "APPROVE_PREPARE_WRITE_CAPABLE_RUNNER_SCAFFOLD",
      "REJECT_OR_REPAIR",
      "`runnerExecutableNow=false`",
      "`boundedWriteExecutableNow=false`",
      "`candidateRowsAcceptedNow=false`",
      "`writeGateOpenedNow=false`",
      "`sqlExecuted=false`",
      "`supabaseWriteAttempted=false`",
      "`dailyPricesMutated=false`",
      "`publicDataSource=mock`",
      "`scoreSource=mock`",
      "prepare_current_scope_write_capable_runner_scaffold_no_execution"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Bounded Write Runner Authorization Gate",
      "phase_1_current_scope_bounded_write_runner_authorization_gate_no_execution_ready",
      "prepare_current_scope_write_capable_runner_scaffold_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-bounded-write-runner-authorization-gate-once"] !==
    "node scripts/run-phase-1-current-scope-bounded-write-runner-authorization-gate-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-bounded-write-runner-authorization-gate-no-execution"] !==
    "node scripts/check-phase-1-current-scope-bounded-write-runner-authorization-gate-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-bounded-write-runner-authorization-gate-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing runner authorization checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-bounded-write-runner-authorization-gate-no-execution"')) {
    problems.push(`${reviewGatePath} missing runner authorization focused name`);
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
