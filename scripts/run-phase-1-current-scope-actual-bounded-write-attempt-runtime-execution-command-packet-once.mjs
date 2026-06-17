import fs from "node:fs";

const handoffPath = getArg("--execution-handoff-packet");
const problems = [];

if (!handoffPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_blocked_missing_inputs",
    runtimeExecutionCommandPacketPreparedNow: false,
    runtimeExecutionCommandPreparedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_bounded_write_attempt_execution_handoff_packet",
    problems: ["--execution-handoff-packet is required"]
  }));
  process.exit(1);
}

const handoff = parseJson(readFile(handoffPath, "execution handoff packet JSON"), handoffPath);
const packetInput = validateHandoff(handoff);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_blocked_no_execution",
  runtimeExecutionCommandPacketPreparedNow: accepted,
  runtimeExecutionCommandPreparedNow: false,
  finalExecutionGoNoGoAcceptedNow: accepted,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptRuntimeExecutionCommandPacket: accepted
    ? buildRuntimeExecutionCommandPacket(packetInput)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet",
  problems
}));

if (!accepted) process.exit(1);

function validateHandoff(input) {
  expect(input.status, "ok", "executionHandoff.status");
  expect(
    input.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution_ready",
    "executionHandoff.guardedStatus"
  );
  expect(input.executionHandoffPacketPreparedNow, true, "executionHandoff.executionHandoffPacketPreparedNow");
  expect(input.finalExecutionGoNoGoAcceptedNow, true, "executionHandoff.finalExecutionGoNoGoAcceptedNow");
  expect(input.finalExecutionAllowedNow, false, "executionHandoff.finalExecutionAllowedNow");
  expect(input.actualWriteAttemptAllowedNow, false, "executionHandoff.actualWriteAttemptAllowedNow");
  expectSafeFlags(input, "executionHandoff");
  if (containsForbiddenPayloadKeys(input)) problems.push("execution handoff must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(input)) problems.push("execution handoff must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(input)) problems.push("deferred ETF symbols must not be part of runtime execution command packet input");

  const packet = input.actualBoundedWriteAttemptExecutionHandoffPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("executionHandoff.actualBoundedWriteAttemptExecutionHandoffPacket must be an object");
    return {};
  }

  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution", "actualBoundedWriteAttemptExecutionHandoffPacket.packetMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("actualBoundedWriteAttemptExecutionHandoffPacket.attemptId must be a string");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionHandoffPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionHandoffPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptExecutionHandoffPacket.operationKind");
  expect(packet.finalExecutionGoNoGoAcceptedNow, true, "actualBoundedWriteAttemptExecutionHandoffPacket.finalExecutionGoNoGoAcceptedNow");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptExecutionHandoffPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptExecutionHandoffPacket.actualWriteAttemptAllowedNow");
  expect(packet.requiredOperatorRuntimeValuesStillExternal, true, "actualBoundedWriteAttemptExecutionHandoffPacket.requiredOperatorRuntimeValuesStillExternal");
  expect(packet.serverOnlyRuntimeInputsMustNotBeLogged, true, "actualBoundedWriteAttemptExecutionHandoffPacket.serverOnlyRuntimeInputsMustNotBeLogged");
  expect(packet.candidateArtifactPathReferenceOnly, true, "actualBoundedWriteAttemptExecutionHandoffPacket.candidateArtifactPathReferenceOnly");
  expect(packet.postRunReviewRequired, true, "actualBoundedWriteAttemptExecutionHandoffPacket.postRunReviewRequired");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution", "actualBoundedWriteAttemptExecutionHandoffPacket.requiredNextPacket");
  expectSafeFlags(packet, "actualBoundedWriteAttemptExecutionHandoffPacket");
  return packet;
}

function buildRuntimeExecutionCommandPacket(packet) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution",
    attemptId: packet.attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    commandValuesIncludedNow: false,
    serverOnlyRuntimeInputsIncludedNow: false,
    candidateArtifactPathReferenceOnly: true,
    requiredRuntimeCommandStillExternal: true,
    requiredRuntimeCommandShape: [
      "candidate_artifact_path_reference",
      "target_table_daily_prices",
      "insert_missing_only",
      "aggregate_readback_required",
      "post_run_review_required"
    ],
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution",
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    runtimeCommandStoplines: [
      "missing_separate_runtime_execution_authorization",
      "server_only_runtime_values_present",
      "command_values_present_before_authorization",
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
