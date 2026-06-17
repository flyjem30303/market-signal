import fs from "node:fs";

const packetPath = getArg("--runtime-execution-command-packet");
const problems = [];

if (!packetPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_blocked_missing_inputs",
    runtimeExecutionAuthorizationPreparedNow: false,
    runtimeExecutionAuthorizedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet",
    problems: ["--runtime-execution-command-packet is required"]
  }));
  process.exit(1);
}

const input = parseJson(readFile(packetPath, "runtime execution command packet JSON"), packetPath);
const commandPacket = validateRuntimeCommandPacket(input);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_blocked_no_execution",
  runtimeExecutionAuthorizationPreparedNow: accepted,
  runtimeExecutionAuthorizedNow: false,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket: accepted
    ? buildRuntimeExecutionAuthorizationPacket(commandPacket)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_runtime_execution_authorization",
  problems
}));

if (!accepted) process.exit(1);

function validateRuntimeCommandPacket(input) {
  expect(input.status, "ok", "runtimeExecutionCommandPacket.status");
  expect(
    input.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution_ready",
    "runtimeExecutionCommandPacket.guardedStatus"
  );
  expect(input.runtimeExecutionCommandPacketPreparedNow, true, "runtimeExecutionCommandPacket.runtimeExecutionCommandPacketPreparedNow");
  expect(input.runtimeExecutionCommandPreparedNow, false, "runtimeExecutionCommandPacket.runtimeExecutionCommandPreparedNow");
  expect(input.finalExecutionAllowedNow, false, "runtimeExecutionCommandPacket.finalExecutionAllowedNow");
  expect(input.actualWriteAttemptAllowedNow, false, "runtimeExecutionCommandPacket.actualWriteAttemptAllowedNow");
  expectSafeFlags(input, "runtimeExecutionCommandPacket");
  if (containsForbiddenPayloadKeys(input)) problems.push("runtime execution command packet input must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(input)) problems.push("runtime execution command packet input must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(input)) problems.push("deferred ETF symbols must not be part of runtime execution authorization input");

  const packet = input.actualBoundedWriteAttemptRuntimeExecutionCommandPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("runtimeExecutionCommandPacket.actualBoundedWriteAttemptRuntimeExecutionCommandPacket must be an object");
    return {};
  }

  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.packetMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("actualBoundedWriteAttemptRuntimeExecutionCommandPacket.attemptId must be a string");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.operationKind");
  expect(packet.commandValuesIncludedNow, false, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.commandValuesIncludedNow");
  expect(packet.serverOnlyRuntimeInputsIncludedNow, false, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.serverOnlyRuntimeInputsIncludedNow");
  expect(packet.candidateArtifactPathReferenceOnly, true, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.candidateArtifactPathReferenceOnly");
  expect(packet.requiredRuntimeCommandStillExternal, true, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.requiredRuntimeCommandStillExternal");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.requiredNextPacket");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.actualWriteAttemptAllowedNow");
  expectSafeFlags(packet, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket");
  return packet;
}

function buildRuntimeExecutionAuthorizationPacket(packet) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution",
    attemptId: packet.attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    authorizationPreparedNow: true,
    runtimeExecutionAuthorizedNow: false,
    commandValuesIncludedNow: false,
    serverOnlyRuntimeInputsIncludedNow: false,
    candidateArtifactPathReferenceOnly: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution",
    runtimeAuthorizationStoplines: [
      "missing_separate_final_operator_execution_acceptance",
      "server_only_runtime_values_present",
      "command_values_present_before_acceptance",
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
