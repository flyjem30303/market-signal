import fs from "node:fs";

const finalPacketPath = getArg("--final-execution-packet");
const operatorDecisionPath = getArg("--operator-decision");
const problems = [];

if (!finalPacketPath || !operatorDecisionPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_final_operator_go_no_go_intake_blocked_missing_inputs",
    finalOperatorGoNoGoAcceptedNow: false,
    finalExecutionAllowedNow: false,
    nextRoute: "provide_final_execution_packet_and_operator_decision",
    problems: [
      !finalPacketPath ? "--final-execution-packet is required" : null,
      !operatorDecisionPath ? "--operator-decision is required" : null
    ].filter(Boolean)
  }));
  process.exit(1);
}

const finalPacketResult = parseJson(readFile(finalPacketPath, "final execution packet JSON"), finalPacketPath);
const operatorDecision = parseJson(readFile(operatorDecisionPath, "operator decision JSON"), operatorDecisionPath);
const finalPacket = validateFinalExecutionPacketResult(finalPacketResult);
validateOperatorDecision(operatorDecision, finalPacket);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_final_operator_go_no_go_intake_no_execution_ready"
    : "phase_1_current_scope_final_operator_go_no_go_intake_blocked_no_execution",
  finalOperatorGoNoGoAcceptedNow: accepted,
  finalExecutionAllowedNow: false,
  finalOperatorGoNoGoIntake: accepted ? buildFinalOperatorGoNoGoIntake(finalPacket.attemptId) : null,
  nextRoute: accepted
    ? "prepare_current_scope_single_bounded_write_attempt_execution_gate_no_execution"
    : "keep_mock_and_repair_current_scope_final_operator_go_no_go_intake",
  problems
}));

if (!accepted) process.exit(1);

function validateFinalExecutionPacketResult(result) {
  expect(result.status, "ok", "finalExecutionPacketResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_bounded_write_final_execution_packet_no_execution_ready",
    "finalExecutionPacketResult.guardedStatus"
  );
  expect(result.boundedWriteFinalExecutionPacketPreparedNow, true, "finalExecutionPacketResult.boundedWriteFinalExecutionPacketPreparedNow");
  expect(result.finalExecutionAllowedNow, false, "finalExecutionPacketResult.finalExecutionAllowedNow");
  expectSafeFlags(result, "finalExecutionPacketResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("final execution packet result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("final execution packet result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope final operator go/no-go input");

  const packet = result.boundedWriteFinalExecutionPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("finalExecutionPacketResult.boundedWriteFinalExecutionPacket must be an object");
    return {};
  }
  expect(packet.packetMode, "current_scope_bounded_write_final_execution_packet_no_execution", "boundedWriteFinalExecutionPacket.packetMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("boundedWriteFinalExecutionPacket.attemptId must be a string");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "boundedWriteFinalExecutionPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "boundedWriteFinalExecutionPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "boundedWriteFinalExecutionPacket.operationKind");
  expect(packet.requiredFinalDecision, "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT", "boundedWriteFinalExecutionPacket.requiredFinalDecision");
  expect(packet.finalGoNoGoAcceptedNow, false, "boundedWriteFinalExecutionPacket.finalGoNoGoAcceptedNow");
  expect(packet.postRunReviewRequired, true, "boundedWriteFinalExecutionPacket.postRunReviewRequired");
  expect(packet.publicRuntimeMustStayMock, true, "boundedWriteFinalExecutionPacket.publicRuntimeMustStayMock");
  expect(packet.scoreSourceMustStayMock, true, "boundedWriteFinalExecutionPacket.scoreSourceMustStayMock");
  expect(packet.requiredNextPacket, "current_scope_final_operator_go_no_go_no_execution", "boundedWriteFinalExecutionPacket.requiredNextPacket");
  expectSafeFlags(packet, "boundedWriteFinalExecutionPacket");
  return packet;
}

function validateOperatorDecision(decision, packet) {
  if (containsForbiddenPayloadKeys(decision)) problems.push("operator decision must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(decision)) problems.push("operator decision must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(decision)) problems.push("deferred ETF symbols must not be part of current-scope final operator go/no-go decision");
  expectSafeFlags(decision, "operatorDecision");

  expect(decision.decisionMode, "current_scope_final_operator_go_no_go_no_execution", "operatorDecision.decisionMode");
  expect(decision.finalDecision, "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT", "operatorDecision.finalDecision");
  expect(decision.attemptId, packet.attemptId, "operatorDecision.attemptId");
  expect(decision.phase1Universe, "twii_plus_listed_stock_daily_close", "operatorDecision.phase1Universe");
  expect(decision.scope, "twii_plus_listed_stock_daily_close", "operatorDecision.scope");
  expect(decision.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "operatorDecision.operationKind");
  for (const field of [
    "finalPacketReviewedConfirmed",
    "candidateArtifactPathReadinessConfirmed",
    "aggregateOnlyEvidenceConfirmed",
    "noPayloadBoundaryConfirmed",
    "insertMissingOnlyContractConfirmed",
    "aggregateReadbackContractConfirmed",
    "rollbackOrQuarantinePlanConfirmed",
    "postRunReviewConfirmed",
    "publicRuntimeStaysMockConfirmed",
    "scoreSourceStaysMockConfirmed",
    "understandsThisDoesNotExecuteNow"
  ]) {
    expect(decision[field], true, `operatorDecision.${field}`);
  }
}

function buildFinalOperatorGoNoGoIntake(attemptId) {
  return safePayload({
    decisionMode: "current_scope_final_operator_go_no_go_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptedFinalDecision: "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT",
    finalExecutionAllowedNow: false,
    finalExecutionStillRequiresSeparateGate: true,
    requiredNextPacket: "current_scope_single_bounded_write_attempt_execution_gate_no_execution",
    hardStopsStillApply: [
      "sql_not_executed",
      "supabase_write_not_attempted",
      "daily_prices_not_mutated",
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
