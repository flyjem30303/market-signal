import fs from "node:fs";

const intakePath = getArg("--execution-authorization-response-intake");
const problems = [];

if (!intakePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_blocked_missing_inputs",
    finalExecutionReadinessPacketPreparedNow: false,
    finalExecutionGoNoGoAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_execution_authorization_response_intake",
    problems: ["--execution-authorization-response-intake is required"]
  }));
  process.exit(1);
}

const intake = parseJson(readFile(intakePath, "actual execution authorization response intake JSON"), intakePath);
const packetInput = validateIntake(intake);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_blocked_no_execution",
  finalExecutionReadinessPacketPreparedNow: accepted,
  finalExecutionGoNoGoAcceptedNow: false,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptFinalExecutionReadinessPacket: accepted
    ? buildFinalExecutionReadinessPacket(packetInput.attemptId)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet",
  problems
}));

if (!accepted) process.exit(1);

function validateIntake(input) {
  expect(input.status, "ok", "executionAuthorizationResponseIntake.status");
  expect(
    input.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_no_execution_ready",
    "executionAuthorizationResponseIntake.guardedStatus"
  );
  expect(input.actualExecutionAuthorizationAcceptedNow, true, "executionAuthorizationResponseIntake.actualExecutionAuthorizationAcceptedNow");
  expect(input.finalExecutionReadinessPreparedNow, true, "executionAuthorizationResponseIntake.finalExecutionReadinessPreparedNow");
  expect(input.finalExecutionAllowedNow, false, "executionAuthorizationResponseIntake.finalExecutionAllowedNow");
  expect(input.actualWriteAttemptAllowedNow, false, "executionAuthorizationResponseIntake.actualWriteAttemptAllowedNow");
  expectSafeFlags(input, "executionAuthorizationResponseIntake");
  if (containsForbiddenPayloadKeys(input)) problems.push("execution authorization response intake must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(input)) problems.push("execution authorization response intake must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(input)) problems.push("deferred ETF symbols must not be part of final execution readiness packet input");

  const packet = input.actualBoundedWriteAttemptFinalExecutionReadinessPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("executionAuthorizationResponseIntake.actualBoundedWriteAttemptFinalExecutionReadinessPacket must be an object");
    return {};
  }

  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.packetMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("actualBoundedWriteAttemptFinalExecutionReadinessPacket.attemptId must be a string");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.operationKind");
  expect(packet.acceptedExecutionAuthorizationResponsePresent, true, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.acceptedExecutionAuthorizationResponsePresent");
  expect(packet.actualExecutionAuthorizationAcceptedNow, true, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.actualExecutionAuthorizationAcceptedNow");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.actualWriteAttemptAllowedNow");
  expect(packet.runnerMustRemainFailClosed, true, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.runnerMustRemainFailClosed");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.requiredNextPacket");
  expectSafeFlags(packet, "actualBoundedWriteAttemptFinalExecutionReadinessPacket");
  return packet;
}

function buildFinalExecutionReadinessPacket(attemptId) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    requiredFinalExecutionGoNoGoDecision: "FINAL_GO_EXECUTE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
    acceptedExecutionAuthorizationResponsePresent: true,
    actualExecutionAuthorizationAcceptedNow: true,
    finalExecutionGoNoGoAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    runnerMustRemainFailClosed: true,
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_final_execution_go_no_go_no_execution",
    finalExecutionStoplines: [
      "missing_separate_final_execution_go_no_go",
      "server_only_runtime_inputs_not_verified",
      "candidate_artifact_path_not_ready",
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
