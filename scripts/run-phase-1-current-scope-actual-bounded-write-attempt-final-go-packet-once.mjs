import fs from "node:fs";

const intakePath = getArg("--authorization-response-intake");
const problems = [];

if (!intakePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_blocked_missing_inputs",
    finalGoPacketPreparedNow: false,
    finalOperatorGoNoGoAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_authorization_response_intake",
    problems: ["--authorization-response-intake is required"]
  }));
  process.exit(1);
}

const intake = parseJson(readFile(intakePath, "actual bounded write authorization response intake JSON"), intakePath);
const packetInput = validateIntake(intake);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_blocked_no_execution",
  finalGoPacketPreparedNow: accepted,
  finalOperatorGoNoGoAcceptedNow: false,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptFinalGoPacket: accepted
    ? buildFinalGoPacket(packetInput.attemptId)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_actual_bounded_write_attempt_final_go_response_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_final_go_packet",
  problems
}));

if (!accepted) process.exit(1);

function validateIntake(input) {
  expect(input.status, "ok", "authorizationResponseIntake.status");
  expect(
    input.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_authorization_response_intake_no_execution_ready",
    "authorizationResponseIntake.guardedStatus"
  );
  expect(input.actualWriteAttemptAuthorizationAcceptedNow, true, "authorizationResponseIntake.actualWriteAttemptAuthorizationAcceptedNow");
  expect(input.finalExecutionAllowedNow, false, "authorizationResponseIntake.finalExecutionAllowedNow");
  expect(input.actualWriteAttemptAllowedNow, false, "authorizationResponseIntake.actualWriteAttemptAllowedNow");
  expectSafeFlags(input, "authorizationResponseIntake");
  if (containsForbiddenPayloadKeys(input)) problems.push("authorization response intake must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(input)) problems.push("authorization response intake must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(input)) problems.push("deferred ETF symbols must not be part of current-scope final go packet input");

  const packet = input.actualBoundedWriteAttemptFinalGoPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("authorizationResponseIntake.actualBoundedWriteAttemptFinalGoPacket must be an object");
    return {};
  }

  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_final_go_packet_no_execution", "actualBoundedWriteAttemptFinalGoPacket.packetMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("actualBoundedWriteAttemptFinalGoPacket.attemptId must be a string");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalGoPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalGoPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptFinalGoPacket.operationKind");
  expect(packet.acceptedActualAuthorizationResponsePresent, true, "actualBoundedWriteAttemptFinalGoPacket.acceptedActualAuthorizationResponsePresent");
  expect(packet.actualWriteAttemptAuthorizationAcceptedNow, true, "actualBoundedWriteAttemptFinalGoPacket.actualWriteAttemptAuthorizationAcceptedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptFinalGoPacket.actualWriteAttemptAllowedNow");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptFinalGoPacket.finalExecutionAllowedNow");
  expect(packet.runnerMustRemainFailClosed, true, "actualBoundedWriteAttemptFinalGoPacket.runnerMustRemainFailClosed");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_final_go_packet_no_execution", "actualBoundedWriteAttemptFinalGoPacket.requiredNextPacket");
  expectSafeFlags(packet, "actualBoundedWriteAttemptFinalGoPacket");
  return packet;
}

function buildFinalGoPacket(attemptId) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_final_go_packet_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    requiredFinalGoDecision: "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
    acceptedActualAuthorizationResponsePresent: true,
    finalOperatorGoNoGoAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    runnerMustRemainFailClosed: true,
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_final_go_response_no_execution",
    finalGoStoplines: [
      "missing_separate_final_go_response",
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
