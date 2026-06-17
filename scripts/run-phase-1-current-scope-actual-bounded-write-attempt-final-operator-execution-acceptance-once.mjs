import fs from "node:fs";

const authorizationPath = getArg("--runtime-execution-authorization");
const problems = [];

if (!authorizationPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_blocked_missing_inputs",
    finalOperatorExecutionAcceptancePreparedNow: false,
    finalOperatorExecutionAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_bounded_write_attempt_runtime_execution_authorization",
    problems: ["--runtime-execution-authorization is required"]
  }));
  process.exit(1);
}

const authorization = parseJson(readFile(authorizationPath, "runtime execution authorization JSON"), authorizationPath);
const packetInput = validateAuthorization(authorization);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_blocked_no_execution",
  finalOperatorExecutionAcceptancePreparedNow: accepted,
  finalOperatorExecutionAcceptedNow: false,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket: accepted
    ? buildFinalOperatorExecutionAcceptancePacket(packetInput)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance",
  problems
}));

if (!accepted) process.exit(1);

function validateAuthorization(input) {
  expect(input.status, "ok", "runtimeExecutionAuthorization.status");
  expect(
    input.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution_ready",
    "runtimeExecutionAuthorization.guardedStatus"
  );
  expect(input.runtimeExecutionAuthorizationPreparedNow, true, "runtimeExecutionAuthorization.runtimeExecutionAuthorizationPreparedNow");
  expect(input.runtimeExecutionAuthorizedNow, false, "runtimeExecutionAuthorization.runtimeExecutionAuthorizedNow");
  expect(input.finalExecutionAllowedNow, false, "runtimeExecutionAuthorization.finalExecutionAllowedNow");
  expect(input.actualWriteAttemptAllowedNow, false, "runtimeExecutionAuthorization.actualWriteAttemptAllowedNow");
  expectSafeFlags(input, "runtimeExecutionAuthorization");
  if (containsForbiddenPayloadKeys(input)) problems.push("runtime execution authorization input must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(input)) problems.push("runtime execution authorization input must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(input)) problems.push("deferred ETF symbols must not be part of final operator execution acceptance input");

  const packet = input.actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("runtimeExecutionAuthorization.actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket must be an object");
    return {};
  }

  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution", "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.packetMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.attemptId must be a string");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.operationKind");
  expect(packet.authorizationPreparedNow, true, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.authorizationPreparedNow");
  expect(packet.runtimeExecutionAuthorizedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.runtimeExecutionAuthorizedNow");
  expect(packet.commandValuesIncludedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.commandValuesIncludedNow");
  expect(packet.serverOnlyRuntimeInputsIncludedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.serverOnlyRuntimeInputsIncludedNow");
  expect(packet.candidateArtifactPathReferenceOnly, true, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.candidateArtifactPathReferenceOnly");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.actualWriteAttemptAllowedNow");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution", "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.requiredNextPacket");
  expectSafeFlags(packet, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket");
  return packet;
}

function buildFinalOperatorExecutionAcceptancePacket(packet) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution",
    attemptId: packet.attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptancePreparedNow: true,
    finalOperatorExecutionAcceptedNow: false,
    runtimeExecutionAuthorizedNow: false,
    commandValuesIncludedNow: false,
    serverOnlyRuntimeInputsIncludedNow: false,
    candidateArtifactPathReferenceOnly: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution",
    finalOperatorAcceptanceStoplines: [
      "missing_separate_actual_execution_final_go",
      "server_only_runtime_values_present",
      "command_values_present_before_final_go",
      "operator_acceptance_already_true",
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
