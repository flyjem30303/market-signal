import fs from "node:fs";

const finalGoPacketPath = getArg("--final-go-packet");
const finalGoResponsePath = getArg("--final-go-response");
const problems = [];

if (!finalGoPacketPath || !finalGoResponsePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_final_go_response_intake_blocked_missing_inputs",
    finalGoResponseAcceptedNow: false,
    finalOperatorGoNoGoAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_final_go_packet_and_response",
    problems: [
      !finalGoPacketPath ? "--final-go-packet is required" : null,
      !finalGoResponsePath ? "--final-go-response is required" : null
    ].filter(Boolean)
  }));
  process.exit(1);
}

const finalGoPacketResult = parseJson(readFile(finalGoPacketPath, "actual bounded write final go packet JSON"), finalGoPacketPath);
const finalGoResponse = parseJson(readFile(finalGoResponsePath, "actual bounded write final go response JSON"), finalGoResponsePath);
const finalGoPacket = validateFinalGoPacketResult(finalGoPacketResult);
validateFinalGoResponse(finalGoResponse, finalGoPacket);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_final_go_response_intake_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_final_go_response_intake_blocked_no_execution",
  finalGoResponseAcceptedNow: accepted,
  finalOperatorGoNoGoAcceptedNow: accepted,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptFinalGoResponseIntake: accepted
    ? buildFinalGoResponseIntake(finalGoPacket.attemptId)
    : null,
  nextRoute: accepted
    ? "prepare_current_scope_actual_bounded_write_attempt_execution_packet_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_final_go_response_intake",
  problems
}));

if (!accepted) process.exit(1);

function validateFinalGoPacketResult(result) {
  expect(result.status, "ok", "finalGoPacketResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_no_execution_ready",
    "finalGoPacketResult.guardedStatus"
  );
  expect(result.finalGoPacketPreparedNow, true, "finalGoPacketResult.finalGoPacketPreparedNow");
  expect(result.finalOperatorGoNoGoAcceptedNow, false, "finalGoPacketResult.finalOperatorGoNoGoAcceptedNow");
  expect(result.finalExecutionAllowedNow, false, "finalGoPacketResult.finalExecutionAllowedNow");
  expect(result.actualWriteAttemptAllowedNow, false, "finalGoPacketResult.actualWriteAttemptAllowedNow");
  expectSafeFlags(result, "finalGoPacketResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("final go packet result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("final go packet result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope final go response input");

  const packet = result.actualBoundedWriteAttemptFinalGoPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("finalGoPacketResult.actualBoundedWriteAttemptFinalGoPacket must be an object");
    return {};
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_final_go_packet_no_execution", "actualBoundedWriteAttemptFinalGoPacket.packetMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("actualBoundedWriteAttemptFinalGoPacket.attemptId must be a string");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalGoPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalGoPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptFinalGoPacket.operationKind");
  expect(packet.requiredFinalGoDecision, "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "actualBoundedWriteAttemptFinalGoPacket.requiredFinalGoDecision");
  expect(packet.acceptedActualAuthorizationResponsePresent, true, "actualBoundedWriteAttemptFinalGoPacket.acceptedActualAuthorizationResponsePresent");
  expect(packet.finalOperatorGoNoGoAcceptedNow, false, "actualBoundedWriteAttemptFinalGoPacket.finalOperatorGoNoGoAcceptedNow");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptFinalGoPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptFinalGoPacket.actualWriteAttemptAllowedNow");
  expect(packet.runnerMustRemainFailClosed, true, "actualBoundedWriteAttemptFinalGoPacket.runnerMustRemainFailClosed");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_final_go_response_no_execution", "actualBoundedWriteAttemptFinalGoPacket.requiredNextPacket");
  expectSafeFlags(packet, "actualBoundedWriteAttemptFinalGoPacket");
  return packet;
}

function validateFinalGoResponse(response, packet) {
  if (containsForbiddenPayloadKeys(response)) problems.push("final go response must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(response)) problems.push("final go response must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(response)) problems.push("deferred ETF symbols must not be part of current-scope final go response");
  expectSafeFlags(response, "finalGoResponse");

  expect(response.responseMode, "current_scope_actual_bounded_write_attempt_final_go_response_no_execution", "finalGoResponse.responseMode");
  expect(response.finalGoDecision, "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "finalGoResponse.finalGoDecision");
  expect(response.attemptId, packet.attemptId, "finalGoResponse.attemptId");
  expect(response.phase1Universe, "twii_plus_listed_stock_daily_close", "finalGoResponse.phase1Universe");
  expect(response.scope, "twii_plus_listed_stock_daily_close", "finalGoResponse.scope");
  expect(response.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "finalGoResponse.operationKind");

  for (const field of [
    "finalGoPacketReviewedConfirmed",
    "actualAuthorizationResponseAcceptedConfirmed",
    "singleAttemptScopeConfirmed",
    "insertMissingOnlyContractConfirmed",
    "aggregateReadbackContractConfirmed",
    "rollbackOrQuarantinePlanConfirmed",
    "postRunReviewConfirmed",
    "publicRuntimeStaysMockConfirmed",
    "scoreSourceStaysMockConfirmed",
    "runnerMustRemainFailClosedConfirmed",
    "understandsThisStillDoesNotExecuteNow"
  ]) {
    expect(response[field], true, `finalGoResponse.${field}`);
  }
}

function buildFinalGoResponseIntake(attemptId) {
  return safePayload({
    responseMode: "current_scope_actual_bounded_write_attempt_final_go_response_no_execution",
    acceptedFinalGoDecision: "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    finalGoResponseAcceptedNow: true,
    finalOperatorGoNoGoAcceptedNow: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualWriteAttemptStillRequiresSeparateExecutionPacket: true,
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_execution_packet_no_execution",
    hardStopsStillApply: [
      "sql_not_executed",
      "supabase_write_not_attempted",
      "daily_prices_not_mutated",
      "candidate_rows_not_accepted",
      "public_runtime_stays_mock",
      "score_source_stays_mock"
    ]
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
