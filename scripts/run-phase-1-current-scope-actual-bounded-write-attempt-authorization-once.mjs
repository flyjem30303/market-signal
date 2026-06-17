import fs from "node:fs";

const executionGatePath = getArg("--execution-gate");
const problems = [];

if (!executionGatePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_authorization_blocked_missing_inputs",
    actualBoundedWriteAttemptAuthorizationPreparedNow: false,
    actualWriteAttemptAuthorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_single_bounded_write_attempt_execution_gate",
    problems: ["--execution-gate is required"]
  }));
  process.exit(1);
}

const executionGateResult = parseJson(readFile(executionGatePath, "single bounded write attempt execution gate JSON"), executionGatePath);
validateExecutionGate(executionGateResult);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_authorization_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_authorization_blocked_no_execution",
  actualBoundedWriteAttemptAuthorizationPreparedNow: accepted,
  actualWriteAttemptAuthorizationAcceptedNow: false,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptAuthorization: accepted
    ? buildActualBoundedWriteAttemptAuthorization(executionGateResult.singleBoundedWriteAttemptExecutionGate.attemptId)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_actual_bounded_write_attempt_authorization_response_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_authorization",
  problems
}));

if (!accepted) process.exit(1);

function validateExecutionGate(result) {
  expect(result.status, "ok", "executionGate.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_single_bounded_write_attempt_execution_gate_no_execution_ready",
    "executionGate.guardedStatus"
  );
  expect(result.singleBoundedWriteAttemptExecutionGatePreparedNow, true, "executionGate.singleBoundedWriteAttemptExecutionGatePreparedNow");
  expect(result.finalExecutionAllowedNow, false, "executionGate.finalExecutionAllowedNow");
  expectSafeFlags(result, "executionGate");
  if (containsForbiddenPayloadKeys(result)) problems.push("execution gate must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("execution gate must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope actual authorization input");

  const gate = result.singleBoundedWriteAttemptExecutionGate;
  if (!gate || typeof gate !== "object") {
    problems.push("executionGate.singleBoundedWriteAttemptExecutionGate must be an object");
    return;
  }
  expect(gate.gateMode, "current_scope_single_bounded_write_attempt_execution_gate_no_execution", "singleBoundedWriteAttemptExecutionGate.gateMode");
  if (!gate.attemptId || typeof gate.attemptId !== "string") problems.push("singleBoundedWriteAttemptExecutionGate.attemptId must be a string");
  expect(gate.phase1Universe, "twii_plus_listed_stock_daily_close", "singleBoundedWriteAttemptExecutionGate.phase1Universe");
  expect(gate.scope, "twii_plus_listed_stock_daily_close", "singleBoundedWriteAttemptExecutionGate.scope");
  expect(gate.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "singleBoundedWriteAttemptExecutionGate.operationKind");
  expect(gate.acceptedFinalDecision, "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT", "singleBoundedWriteAttemptExecutionGate.acceptedFinalDecision");
  expect(gate.finalGoNoGoAcceptedNow, true, "singleBoundedWriteAttemptExecutionGate.finalGoNoGoAcceptedNow");
  expect(gate.finalExecutionAllowedNow, false, "singleBoundedWriteAttemptExecutionGate.finalExecutionAllowedNow");
  expect(gate.actualWriteAttemptAllowedNow, false, "singleBoundedWriteAttemptExecutionGate.actualWriteAttemptAllowedNow");
  expect(gate.runnerMustRemainFailClosed, true, "singleBoundedWriteAttemptExecutionGate.runnerMustRemainFailClosed");
  expect(gate.candidateArtifactPathReadinessRequired, true, "singleBoundedWriteAttemptExecutionGate.candidateArtifactPathReadinessRequired");
  expect(gate.insertMissingOnlyContractRequired, true, "singleBoundedWriteAttemptExecutionGate.insertMissingOnlyContractRequired");
  expect(gate.aggregateReadbackContractRequired, true, "singleBoundedWriteAttemptExecutionGate.aggregateReadbackContractRequired");
  expect(gate.rollbackOrQuarantinePlanRequired, true, "singleBoundedWriteAttemptExecutionGate.rollbackOrQuarantinePlanRequired");
  expect(gate.postRunReviewRequired, true, "singleBoundedWriteAttemptExecutionGate.postRunReviewRequired");
  expect(gate.publicRuntimeMustStayMock, true, "singleBoundedWriteAttemptExecutionGate.publicRuntimeMustStayMock");
  expect(gate.scoreSourceMustStayMock, true, "singleBoundedWriteAttemptExecutionGate.scoreSourceMustStayMock");
  expect(gate.requiredNextPacket, "current_scope_actual_bounded_write_attempt_authorization", "singleBoundedWriteAttemptExecutionGate.requiredNextPacket");
  expectSafeFlags(gate, "singleBoundedWriteAttemptExecutionGate");
}

function buildActualBoundedWriteAttemptAuthorization(attemptId) {
  return safePayload({
    authorizationMode: "current_scope_actual_bounded_write_attempt_authorization_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    requiredAuthorizationDecision: "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
    acceptedFinalDecisionPresent: true,
    singleExecutionGateReady: true,
    actualWriteAttemptAuthorizationAcceptedNow: false,
    actualWriteAttemptAllowedNow: false,
    runnerMustRemainFailClosed: true,
    candidateArtifactPathReadinessRequired: true,
    insertMissingOnlyContractRequired: true,
    aggregateReadbackContractRequired: true,
    rollbackOrQuarantinePlanRequired: true,
    postRunReviewRequired: true,
    publicRuntimeMustStayMock: true,
    scoreSourceMustStayMock: true,
    actualAuthorizationStoplines: [
      "actual_authorization_response_missing",
      "candidate_artifact_path_not_ready",
      "row_raw_or_stock_id_payload_present",
      "secret_or_confirmation_value_present",
      "real_promotion_requested",
      "sql_or_write_already_attempted"
    ],
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_authorization_response_no_execution"
  });
}

function safePayload(fields) {
  return {
    ...fields,
    dryRunExecutableNow: false,
    dryRunExecutedNow: false,
    envValuesReadNow: false,
    secretValuesOutputNow: false,
    confirmationPhraseValueOutputNow: false,
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

function expectSafeFlags(value, label) {
  if (!value || typeof value !== "object") return;
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
    if (value[field] !== undefined) expect(value[field], expected, `${label}.${field}`);
  }
}

function containsDeferredSymbols(value) {
  if (typeof value === "string") return /\b(0050|006208)\b/u.test(value);
  if (Array.isArray(value)) return value.some(containsDeferredSymbols);
  if (value && typeof value === "object") return Object.values(value).some(containsDeferredSymbols);
  return false;
}

function containsForbiddenPayloadKeys(value) {
  if (!value || typeof value !== "object") return false;
  for (const key of Object.keys(value)) {
    if (/^(rows|raw|payload|rawPayload|rowPayload|stockIds|stockIdPayload)$/iu.test(key)) return true;
  }
  return Object.values(value).some(containsForbiddenPayloadKeys);
}

function containsSecretOrConfirmationValueKeys(value) {
  if (!value || typeof value !== "object") return false;
  for (const key of Object.keys(value)) {
    if (/^(env|envValues|secret|secrets|executeSwitchValue|confirmationPhraseValue|password|token|serviceRoleKey|supabaseKey)$/iu.test(key)) {
      return true;
    }
  }
  return Object.values(value).some(containsSecretOrConfirmationValueKeys);
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function readFile(filePath, label) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${label}: ${error.message}`);
    return "{}";
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

function emit(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
