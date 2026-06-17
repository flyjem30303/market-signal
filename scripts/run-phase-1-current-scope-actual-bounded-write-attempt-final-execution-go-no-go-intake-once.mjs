import fs from "node:fs";

const readinessPath = getArg("--final-execution-readiness-packet");
const responsePath = getArg("--final-execution-go-no-go-response");
const problems = [];

if (!readinessPath || !responsePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_blocked_missing_inputs",
    finalExecutionGoNoGoAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_and_go_no_go_response",
    problems: [
      "--final-execution-readiness-packet is required",
      "--final-execution-go-no-go-response is required"
    ]
  }));
  process.exit(1);
}

const readinessInput = parseJson(readFile(readinessPath, "final execution readiness packet JSON"), readinessPath);
const responseInput = parseJson(readFile(responsePath, "final execution go/no-go response JSON"), responsePath);
const readinessPacket = validateReadiness(readinessInput);
const response = validateResponse(responseInput, readinessPacket);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_blocked_no_execution",
  finalExecutionGoNoGoAcceptedNow: accepted,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptExecutionHandoffPacket: accepted
    ? buildExecutionHandoffPacket(readinessPacket, response)
    : null,
  nextRoute: accepted
    ? "prepare_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake",
  problems
}));

if (!accepted) process.exit(1);

function validateReadiness(input) {
  expect(input.status, "ok", "finalExecutionReadinessPacket.status");
  expect(
    input.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution_ready",
    "finalExecutionReadinessPacket.guardedStatus"
  );
  expect(input.finalExecutionReadinessPacketPreparedNow, true, "finalExecutionReadinessPacket.finalExecutionReadinessPacketPreparedNow");
  expect(input.finalExecutionGoNoGoAcceptedNow, false, "finalExecutionReadinessPacket.finalExecutionGoNoGoAcceptedNow");
  expect(input.finalExecutionAllowedNow, false, "finalExecutionReadinessPacket.finalExecutionAllowedNow");
  expect(input.actualWriteAttemptAllowedNow, false, "finalExecutionReadinessPacket.actualWriteAttemptAllowedNow");
  expectSafeFlags(input, "finalExecutionReadinessPacket");
  if (containsForbiddenPayloadKeys(input)) problems.push("final execution readiness packet must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(input)) problems.push("final execution readiness packet must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(input)) problems.push("deferred ETF symbols must not be part of current-scope final execution go/no-go intake");

  const packet = input.actualBoundedWriteAttemptFinalExecutionReadinessPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("finalExecutionReadinessPacket.actualBoundedWriteAttemptFinalExecutionReadinessPacket must be an object");
    return {};
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.packetMode");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.operationKind");
  expect(packet.requiredFinalExecutionGoNoGoDecision, "FINAL_GO_EXECUTE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.requiredFinalExecutionGoNoGoDecision");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.actualWriteAttemptAllowedNow");
  expectSafeFlags(packet, "actualBoundedWriteAttemptFinalExecutionReadinessPacket");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("actualBoundedWriteAttemptFinalExecutionReadinessPacket.attemptId must be a string");
  return packet;
}

function validateResponse(input, readinessPacket) {
  expect(input.responseMode, "current_scope_actual_bounded_write_attempt_final_execution_go_no_go_response_no_execution", "finalExecutionGoNoGoResponse.responseMode");
  expect(input.decision, "FINAL_GO_EXECUTE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "finalExecutionGoNoGoResponse.decision");
  expect(input.attemptId, readinessPacket.attemptId, "finalExecutionGoNoGoResponse.attemptId");
  expect(input.phase1Universe, "twii_plus_listed_stock_daily_close", "finalExecutionGoNoGoResponse.phase1Universe");
  expect(input.scope, "twii_plus_listed_stock_daily_close", "finalExecutionGoNoGoResponse.scope");
  expect(input.finalExecutionAllowedNow, false, "finalExecutionGoNoGoResponse.finalExecutionAllowedNow");
  expect(input.actualWriteAttemptAllowedNow, false, "finalExecutionGoNoGoResponse.actualWriteAttemptAllowedNow");
  expectSafeFlags(input, "finalExecutionGoNoGoResponse");
  if (containsForbiddenPayloadKeys(input)) problems.push("final execution go/no-go response must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(input)) problems.push("final execution go/no-go response must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(input)) problems.push("deferred ETF symbols must not be part of current-scope final execution go/no-go response");

  const requiredConfirmations = [
    "finalExecutionReadinessPacketReviewed",
    "candidateArtifactPathReady",
    "serverOnlyRuntimeInputsReviewed",
    "insertMissingOnlyContractReviewed",
    "aggregateReadbackRequired",
    "rollbackOrQuarantineReviewed",
    "postRunReviewRequired",
    "publicDataSourceRemainsMock",
    "scoreSourceRemainsMock",
    "runnerRemainsFailClosedUntilSeparateExecutionPacket"
  ];
  const confirmations = input.confirmations;
  if (!confirmations || typeof confirmations !== "object") {
    problems.push("finalExecutionGoNoGoResponse.confirmations must be an object");
  } else {
    for (const key of requiredConfirmations) expect(confirmations[key], true, `finalExecutionGoNoGoResponse.confirmations.${key}`);
  }
  return input;
}

function buildExecutionHandoffPacket(readinessPacket, response) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution",
    attemptId: readinessPacket.attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptedFinalExecutionGoNoGoPresent: true,
    finalExecutionGoNoGoDecision: response.decision,
    finalExecutionGoNoGoAcceptedNow: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    runnerMustRemainFailClosed: true,
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution",
    executionHandoffStoplines: [
      "missing_separate_execution_handoff_packet_check",
      "missing_actual_runtime_execution_command_packet",
      "missing_server_only_runtime_inputs",
      "row_or_raw_payload_present",
      "secret_or_confirmation_value_present",
      "deferred_etf_scope_present",
      "real_runtime_promotion_requested",
      "sql_or_write_flag_already_true",
      "public_runtime_not_mock",
      "score_source_not_mock"
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
