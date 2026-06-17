import fs from "node:fs";

const executionPacketPath = getArg("--execution-packet");
const problems = [];

if (!executionPacketPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_blocked_missing_inputs",
    actualExecutionAuthorizationPreparedNow: false,
    actualExecutionAuthorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_bounded_write_attempt_execution_packet",
    problems: ["--execution-packet is required"]
  }));
  process.exit(1);
}

const executionPacketResult = parseJson(readFile(executionPacketPath, "actual bounded write execution packet JSON"), executionPacketPath);
const packet = validateExecutionPacketResult(executionPacketResult);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_blocked_no_execution",
  actualExecutionAuthorizationPreparedNow: accepted,
  actualExecutionAuthorizationAcceptedNow: false,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptExecutionAuthorization: accepted
    ? buildActualExecutionAuthorization(packet)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_execution_authorization",
  problems
}));

if (!accepted) process.exit(1);

function validateExecutionPacketResult(result) {
  expect(result.status, "ok", "executionPacketResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_no_execution_ready",
    "executionPacketResult.guardedStatus"
  );
  expect(result.actualExecutionPacketPreparedNow, true, "executionPacketResult.actualExecutionPacketPreparedNow");
  expect(result.finalGoResponseAcceptedNow, true, "executionPacketResult.finalGoResponseAcceptedNow");
  expect(result.finalExecutionAllowedNow, false, "executionPacketResult.finalExecutionAllowedNow");
  expect(result.actualWriteAttemptAllowedNow, false, "executionPacketResult.actualWriteAttemptAllowedNow");
  expectSafeFlags(result, "executionPacketResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("execution packet result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("execution packet result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope execution authorization input");

  const packet = result.actualBoundedWriteAttemptExecutionPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("executionPacketResult.actualBoundedWriteAttemptExecutionPacket must be an object");
    return {};
  }

  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_execution_packet_no_execution", "actualBoundedWriteAttemptExecutionPacket.packetMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("actualBoundedWriteAttemptExecutionPacket.attemptId must be a string");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptExecutionPacket.operationKind");
  expect(packet.acceptedFinalGoDecision, "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "actualBoundedWriteAttemptExecutionPacket.acceptedFinalGoDecision");
  expect(packet.finalGoResponseAcceptedNow, true, "actualBoundedWriteAttemptExecutionPacket.finalGoResponseAcceptedNow");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptExecutionPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptExecutionPacket.actualWriteAttemptAllowedNow");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_execution_authorization_no_execution", "actualBoundedWriteAttemptExecutionPacket.requiredNextPacket");
  expectSafeFlags(packet, "actualBoundedWriteAttemptExecutionPacket");
  return packet;
}

function buildActualExecutionAuthorization(packet) {
  return safePayload({
    authorizationMode: "current_scope_actual_bounded_write_attempt_execution_authorization_no_execution",
    attemptId: packet.attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    requiredAuthorizationDecision: "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_EXECUTION",
    acceptedExecutionPacketPresent: true,
    finalGoResponseAcceptedNow: true,
    actualExecutionAuthorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    runnerMustRemainFailClosed: true,
    candidateArtifactPathReadinessRequired: true,
    insertMissingOnlyContractRequired: true,
    aggregateReadbackContractRequired: true,
    rollbackOrQuarantinePlanRequired: true,
    postRunReviewRequired: true,
    publicRuntimeMustStayMock: true,
    scoreSourceMustStayMock: true,
    actualExecutionAuthorizationStoplines: [
      "execution_authorization_response_missing",
      "server_only_runtime_inputs_not_verified",
      "candidate_artifact_path_not_ready",
      "row_raw_or_stock_id_payload_present",
      "secret_or_confirmation_value_present",
      "real_promotion_requested",
      "sql_or_write_already_attempted"
    ],
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution"
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
