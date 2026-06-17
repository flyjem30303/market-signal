import fs from "node:fs";

const acceptancePath = getArg("--final-operator-execution-acceptance");
const problems = [];

if (!acceptancePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_blocked_missing_inputs",
    actualExecutionFinalGoPreparedNow: false,
    actualExecutionFinalGoAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance",
    problems: ["--final-operator-execution-acceptance is required"]
  }));
  process.exit(1);
}

const acceptance = parseJson(readFile(acceptancePath, "final operator execution acceptance JSON"), acceptancePath);
const packetInput = validateAcceptance(acceptance);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_blocked_no_execution",
  actualExecutionFinalGoPreparedNow: accepted,
  actualExecutionFinalGoAcceptedNow: false,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptActualExecutionFinalGoPacket: accepted
    ? buildActualExecutionFinalGoPacket(packetInput)
    : null,
  nextRoute: accepted
    ? "await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_actual_execution_final_go",
  problems
}));

if (!accepted) process.exit(1);

function validateAcceptance(input) {
  expect(input.status, "ok", "finalOperatorExecutionAcceptance.status");
  expect(
    input.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution_ready",
    "finalOperatorExecutionAcceptance.guardedStatus"
  );
  expect(input.finalOperatorExecutionAcceptancePreparedNow, true, "finalOperatorExecutionAcceptance.finalOperatorExecutionAcceptancePreparedNow");
  expect(input.finalOperatorExecutionAcceptedNow, false, "finalOperatorExecutionAcceptance.finalOperatorExecutionAcceptedNow");
  expect(input.finalExecutionAllowedNow, false, "finalOperatorExecutionAcceptance.finalExecutionAllowedNow");
  expect(input.actualWriteAttemptAllowedNow, false, "finalOperatorExecutionAcceptance.actualWriteAttemptAllowedNow");
  expectSafeFlags(input, "finalOperatorExecutionAcceptance");
  if (containsForbiddenPayloadKeys(input)) problems.push("final operator execution acceptance input must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(input)) problems.push("final operator execution acceptance input must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(input)) problems.push("deferred ETF symbols must not be part of actual execution final go input");

  const packet = input.actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket;
  if (!packet || typeof packet !== "object") {
    problems.push("finalOperatorExecutionAcceptance.actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket must be an object");
    return {};
  }

  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution", "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.packetMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.attemptId must be a string");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.operationKind");
  expect(packet.acceptancePreparedNow, true, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.acceptancePreparedNow");
  expect(packet.finalOperatorExecutionAcceptedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.finalOperatorExecutionAcceptedNow");
  expect(packet.runtimeExecutionAuthorizedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.runtimeExecutionAuthorizedNow");
  expect(packet.commandValuesIncludedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.commandValuesIncludedNow");
  expect(packet.serverOnlyRuntimeInputsIncludedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.serverOnlyRuntimeInputsIncludedNow");
  expect(packet.candidateArtifactPathReferenceOnly, true, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.candidateArtifactPathReferenceOnly");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.actualWriteAttemptAllowedNow");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution", "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.requiredNextPacket");
  expectSafeFlags(packet, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket");
  return packet;
}

function buildActualExecutionFinalGoPacket(packet) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution",
    attemptId: packet.attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    finalOperatorExecutionAcceptancePresent: true,
    actualExecutionFinalGoPreparedNow: true,
    actualExecutionFinalGoAcceptedNow: false,
    runtimeExecutionAuthorizedNow: false,
    commandValuesIncludedNow: false,
    serverOnlyRuntimeInputsIncludedNow: false,
    candidateArtifactPathReferenceOnly: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    requiredNextRoute: "await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates",
    actualExecutionStoplines: [
      "missing_explicit_external_actual_execution_decision",
      "actual_execution_final_go_already_accepted",
      "server_only_runtime_values_present",
      "command_values_present_before_external_execution",
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
