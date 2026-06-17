import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_EXECUTION_AUTHORIZATION_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-actual-execution-authorization-"));

try {
  const acceptedPacketPath = writeJson("accepted-execution-packet.json", makeAcceptedExecutionPacket());
  const blockedPacketPath = writeJson("blocked-execution-packet.json", {
    ...makeAcceptedExecutionPacket(),
    status: "blocked"
  });
  const missingPacketPath = writeJson("missing-execution-packet-object.json", {
    ...makeAcceptedExecutionPacket(),
    actualBoundedWriteAttemptExecutionPacket: null
  });
  const rowPayloadPath = writeJson("row-payload-execution-packet.json", {
    ...makeAcceptedExecutionPacket(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-execution-packet.json", {
    ...makeAcceptedExecutionPacket(),
    secret: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-execution-packet.json", {
    ...makeAcceptedExecutionPacket(),
    scoreSource: "real"
  });
  const etfPath = writeJson("deferred-etf-execution-packet.json", {
    ...makeAcceptedExecutionPacket(),
    note: "0050 remains deferred"
  });
  const executablePath = writeJson("executable-execution-packet.json", {
    ...makeAcceptedExecutionPacket(),
    runnerExecutableNow: true
  });
  const executedPath = writeJson("executed-execution-packet.json", {
    ...makeAcceptedExecutionPacket(),
    sqlExecuted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--execution-packet", acceptedPacketPath]));
  validateRejectedRun("blocked execution packet", runNode(["--execution-packet", blockedPacketPath]));
  validateRejectedRun("missing execution packet object", runNode(["--execution-packet", missingPacketPath]));
  validateRejectedRun("row payload execution packet", runNode(["--execution-packet", rowPayloadPath]));
  validateRejectedRun("secret execution packet", runNode(["--execution-packet", secretPath]));
  validateRejectedRun("real promotion execution packet", runNode(["--execution-packet", realPromotionPath]));
  validateRejectedRun("deferred ETF execution packet", runNode(["--execution-packet", etfPath]));
  validateRejectedRun("executable execution packet", runNode(["--execution-packet", executablePath]));
  validateRejectedRun("executed execution packet", runNode(["--execution-packet", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution_blocked",
    acceptedExecutionPacketReady: true,
    blockedExecutionPacketRejected: true,
    missingExecutionPacketRejected: true,
    rowPayloadRejected: true,
    secretExecutionPacketRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableExecutionPacketRejected: true,
    executedExecutionPacketRejected: true,
    actualExecutionAuthorizationPreparedNow: true,
    actualExecutionAuthorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    dryRunExecutableNow: false,
    dryRunExecutedNow: false,
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
      ? "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_execution_authorization",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedExecutionPacket() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_no_execution_ready",
    actualExecutionPacketPreparedNow: true,
    finalGoResponseAcceptedNow: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualBoundedWriteAttemptExecutionPacket: {
      packetMode: "current_scope_actual_bounded_write_attempt_execution_packet_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      acceptedFinalGoDecision: "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
      finalGoResponseAcceptedNow: true,
      finalExecutionAllowedNow: false,
      actualWriteAttemptAllowedNow: false,
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_execution_authorization_no_execution",
      requiredRuntimeInputs: [
        "server_only_supabase_url_presence",
        "server_only_write_credential_presence",
        "operator_execute_switch_value_not_logged",
        "operator_confirmation_phrase_value_not_logged",
        "current_scope_candidate_artifact_path_reference",
        "abort_switch_presence"
      ],
      requiredStopConditions: [
        "missing_separate_execution_authorization",
        "missing_server_only_runtime_inputs",
        "candidate_artifact_contains_row_raw_or_stock_id_payload",
        "candidate_artifact_scope_mismatch",
        "duplicate_rejected_or_missing_required_field_count_above_zero",
        "readback_plan_missing",
        "rollback_plan_missing",
        "public_runtime_promotion_requested_in_same_step"
      ],
      dryRunExecutableNow: false,
      dryRunExecutedNow: false,
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
    dryRunExecutableNow: false,
    dryRunExecutedNow: false,
    runnerExecutableNow: false,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution",
    problems: []
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.actualExecutionAuthorizationPreparedNow, false, "missingArgs.actualExecutionAuthorizationPreparedNow");
  expect(result.output.actualExecutionAuthorizationAcceptedNow, false, "missingArgs.actualExecutionAuthorizationAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted execution authorization should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.actualExecutionAuthorizationPreparedNow, true, "accepted.actualExecutionAuthorizationPreparedNow");
  expect(result.output.actualExecutionAuthorizationAcceptedNow, false, "accepted.actualExecutionAuthorizationAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const authorization = result.output.actualBoundedWriteAttemptExecutionAuthorization;
  if (!authorization || typeof authorization !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptExecutionAuthorization must be an object");
    return;
  }
  expect(authorization.authorizationMode, "current_scope_actual_bounded_write_attempt_execution_authorization_no_execution", "actualBoundedWriteAttemptExecutionAuthorization.authorizationMode");
  expect(authorization.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptExecutionAuthorization.attemptId");
  expect(authorization.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionAuthorization.phase1Universe");
  expect(authorization.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionAuthorization.scope");
  expect(authorization.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptExecutionAuthorization.operationKind");
  expect(authorization.requiredAuthorizationDecision, "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_EXECUTION", "actualBoundedWriteAttemptExecutionAuthorization.requiredAuthorizationDecision");
  expect(authorization.acceptedExecutionPacketPresent, true, "actualBoundedWriteAttemptExecutionAuthorization.acceptedExecutionPacketPresent");
  expect(authorization.finalGoResponseAcceptedNow, true, "actualBoundedWriteAttemptExecutionAuthorization.finalGoResponseAcceptedNow");
  expect(authorization.actualExecutionAuthorizationAcceptedNow, false, "actualBoundedWriteAttemptExecutionAuthorization.actualExecutionAuthorizationAcceptedNow");
  expect(authorization.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptExecutionAuthorization.actualWriteAttemptAllowedNow");
  expect(authorization.runnerMustRemainFailClosed, true, "actualBoundedWriteAttemptExecutionAuthorization.runnerMustRemainFailClosed");
  expect(authorization.candidateArtifactPathReadinessRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.candidateArtifactPathReadinessRequired");
  expect(authorization.insertMissingOnlyContractRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.insertMissingOnlyContractRequired");
  expect(authorization.aggregateReadbackContractRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.aggregateReadbackContractRequired");
  expect(authorization.rollbackOrQuarantinePlanRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.rollbackOrQuarantinePlanRequired");
  expect(authorization.postRunReviewRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.postRunReviewRequired");
  expect(authorization.publicRuntimeMustStayMock, true, "actualBoundedWriteAttemptExecutionAuthorization.publicRuntimeMustStayMock");
  expect(authorization.scoreSourceMustStayMock, true, "actualBoundedWriteAttemptExecutionAuthorization.scoreSourceMustStayMock");
  expect(authorization.requiredNextPacket, "current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution", "actualBoundedWriteAttemptExecutionAuthorization.requiredNextPacket");
  if (!Array.isArray(authorization.actualExecutionAuthorizationStoplines) || authorization.actualExecutionAuthorizationStoplines.length < 6) {
    problems.push("actualBoundedWriteAttemptExecutionAuthorization.actualExecutionAuthorizationStoplines must contain at least 6 items");
  }
  expectSafeFlags(authorization, "actualBoundedWriteAttemptExecutionAuthorization");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expect(result.output.finalExecutionAllowedNow, false, `${label}.finalExecutionAllowedNow`);
  expect(result.output.actualWriteAttemptAllowedNow, false, `${label}.actualWriteAttemptAllowedNow`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution_ready",
      "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_EXECUTION",
      "actualExecutionAuthorizationPreparedNow=true",
      "actualExecutionAuthorizationAcceptedNow=false",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Execution Authorization",
      "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution_ready",
      "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing actual bounded write attempt execution authorization checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-no-execution"')) {
    problems.push(`${reviewGatePath} missing actual bounded write attempt execution authorization focused name`);
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
    ["dryRunExecutableNow", false],
    ["dryRunExecutedNow", false],
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
    /dryRunExecutableNow"\s*:\s*true/u,
    /dryRunExecutedNow"\s*:\s*true/u,
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
