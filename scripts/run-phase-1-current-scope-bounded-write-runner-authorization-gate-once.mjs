import fs from "node:fs";

const executionPacketPath = getArg("--execution-packet");
const runnerAuthorizationPath = getArg("--runner-authorization");
const problems = [];

if (!executionPacketPath || !runnerAuthorizationPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_bounded_write_runner_authorization_gate_blocked_missing_inputs",
    runnerAuthorizationAcceptedNow: false,
    runnerScaffoldPreparationAllowedNow: false,
    runnerExecutableNow: false,
    nextRoute: "provide_execution_packet_and_runner_authorization",
    problems: [
      ...(!executionPacketPath ? ["--execution-packet is required"] : []),
      ...(!runnerAuthorizationPath ? ["--runner-authorization is required"] : [])
    ]
  }));
  process.exit(1);
}

const executionPacketResult = parseJson(readFile(executionPacketPath, "execution packet JSON"), executionPacketPath);
const runnerAuthorization = parseJson(readFile(runnerAuthorizationPath, "runner authorization JSON"), runnerAuthorizationPath);

validateExecutionPacketResult(executionPacketResult);
const authorizationMode = validateRunnerAuthorization(runnerAuthorization, executionPacketResult);
const accepted = problems.length === 0 && authorizationMode === "accepted";
const rejectedOrRepair = authorizationMode === "rejected_or_repair";

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_bounded_write_runner_authorization_gate_ready_no_execution"
    : rejectedOrRepair
      ? "phase_1_current_scope_bounded_write_runner_authorization_gate_rejected_or_repair_no_execution"
      : "phase_1_current_scope_bounded_write_runner_authorization_gate_blocked_no_execution",
  runnerAuthorizationAcceptedNow: accepted,
  runnerAuthorizationRecordedNow: accepted || rejectedOrRepair,
  rejectedOrRepairDecisionRecordedNow: rejectedOrRepair,
  runnerScaffoldPreparationAllowedNow: accepted,
  runnerExecutableNow: false,
  attemptId: accepted ? runnerAuthorization.attemptId : null,
  executionPacketPreparedNow: accepted,
  operationKindConfirmed: accepted,
  runtimeInputsPlanConfirmed: accepted,
  stopConditionsConfirmed: accepted,
  readbackPlanConfirmed: accepted,
  rollbackPlanConfirmed: accepted,
  postRunReviewConfirmed: accepted,
  abortSwitchPresent: accepted,
  nextRoute: accepted
    ? "prepare_current_scope_write_capable_runner_scaffold_no_execution"
    : rejectedOrRepair
      ? "keep_mock_and_request_runner_authorization_repair"
      : "keep_mock_and_repair_runner_authorization_gate",
  problems
}));

if (!accepted) process.exit(1);

function validateExecutionPacketResult(result) {
  expect(result.status, "ok", "executionPacketResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_bounded_write_execution_packet_ready_no_execution",
    "executionPacketResult.guardedStatus"
  );
  expect(result.executionPacketPreparedNow, true, "executionPacketResult.executionPacketPreparedNow");
  expectSafeFlags(result, "executionPacketResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("execution packet result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("execution packet result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope execution packet result");

  const packet = result.executionPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("executionPacketResult.executionPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_bounded_write_execution_packet_no_execution", "executionPacket.packetMode");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "executionPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "executionPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "executionPacket.operationKind");
  expect(packet.candidateArtifactPathReferencePresent, true, "executionPacket.candidateArtifactPathReferencePresent");
  for (const field of ["requiredRuntimeInputs", "requiredStopConditions", "requiredReadbackPlan", "requiredRollbackPlan", "requiredPostRunReview"]) {
    if (!Array.isArray(packet[field]) || packet[field].length < 3) problems.push(`executionPacket.${field} must contain at least 3 items`);
  }
  expectSafeFlags(packet, "executionPacket");
}

function validateRunnerAuthorization(authorization, executionPacketResult) {
  if (containsForbiddenPayloadKeys(authorization)) problems.push("runner authorization must not include row/raw/stock-id payload or secret fields");
  if (containsSecretOrConfirmationValueKeys(authorization)) problems.push("runner authorization must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(authorization)) problems.push("deferred ETF symbols must not be part of current-scope runner authorization");
  expectSafeFlags(authorization, "runnerAuthorization");
  if (authorization.runnerExecutableNow === true) problems.push("runner authorization must not set runnerExecutableNow=true");

  if (authorization.runnerAuthorizationDecision === "REJECT_OR_REPAIR") return "rejected_or_repair";
  expect(authorization.runnerAuthorizationDecision, "APPROVE_PREPARE_WRITE_CAPABLE_RUNNER_SCAFFOLD", "runnerAuthorization.runnerAuthorizationDecision");
  expect(authorization.attemptId, executionPacketResult.executionPacket?.attemptId, "runnerAuthorization.attemptId");
  expect(authorization.executionPacketPreparedNow, true, "runnerAuthorization.executionPacketPreparedNow");
  expect(authorization.operationKindConfirmed, true, "runnerAuthorization.operationKindConfirmed");
  expect(authorization.runtimeInputsPlanConfirmed, true, "runnerAuthorization.runtimeInputsPlanConfirmed");
  expect(authorization.stopConditionsConfirmed, true, "runnerAuthorization.stopConditionsConfirmed");
  expect(authorization.readbackPlanConfirmed, true, "runnerAuthorization.readbackPlanConfirmed");
  expect(authorization.rollbackPlanConfirmed, true, "runnerAuthorization.rollbackPlanConfirmed");
  expect(authorization.postRunReviewConfirmed, true, "runnerAuthorization.postRunReviewConfirmed");
  expect(authorization.abortSwitchPresent, true, "runnerAuthorization.abortSwitchPresent");
  return "accepted";
}

function safePayload(fields) {
  return {
    ...fields,
    envValuesReadNow: false,
    secretValuesOutputNow: false,
    confirmationPhraseValueOutputNow: false,
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
    if (/^(rows|raw|payload|rawPayload|rowPayload|stockIds|stockIdPayload|secrets|secret)$/iu.test(key)) return true;
  }
  return Object.values(value).some(containsForbiddenPayloadKeys);
}

function containsSecretOrConfirmationValueKeys(value) {
  if (!value || typeof value !== "object") return false;
  for (const key of Object.keys(value)) {
    if (/^(env|envValues|executeSwitchValue|confirmationPhraseValue|password|token|serviceRoleKey|supabaseKey)$/iu.test(key)) {
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
