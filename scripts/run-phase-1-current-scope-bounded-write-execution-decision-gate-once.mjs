import fs from "node:fs";

const responseIntakePath = getArg("--response-intake");
const executionDecisionPath = getArg("--execution-decision");
const problems = [];

if (!responseIntakePath || !executionDecisionPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_decision_gate_blocked_missing_inputs",
    executionDecisionAcceptedNow: false,
    executionPacketPreparationAllowedNow: false,
    nextRoute: "provide_response_intake_and_execution_decision",
    problems: [
      ...(!responseIntakePath ? ["--response-intake is required"] : []),
      ...(!executionDecisionPath ? ["--execution-decision is required"] : [])
    ]
  }));
  process.exit(1);
}

const responseIntake = parseJson(readFile(responseIntakePath, "response intake JSON"), responseIntakePath);
const executionDecision = parseJson(readFile(executionDecisionPath, "execution decision JSON"), executionDecisionPath);

validateResponseIntake(responseIntake);
const decisionMode = validateExecutionDecision(executionDecision, responseIntake);
const accepted = problems.length === 0 && decisionMode === "accepted";
const rejectedOrRepair = decisionMode === "rejected_or_repair";

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_bounded_write_execution_decision_gate_ready_no_execution"
    : rejectedOrRepair
      ? "phase_1_current_scope_bounded_write_execution_decision_gate_rejected_or_repair_no_execution"
      : "phase_1_current_scope_bounded_write_execution_decision_gate_blocked_no_execution",
  executionDecisionAcceptedNow: accepted,
  executionDecisionRecordedNow: accepted || rejectedOrRepair,
  rejectedOrRepairDecisionRecordedNow: rejectedOrRepair,
  executionPacketPreparationAllowedNow: accepted,
  attemptId: accepted ? executionDecision.attemptId : null,
  operatorAuthorizationResponseAcceptedNow: accepted,
  candidateArtifactPathReferencePresent: accepted,
  rollbackScopeConfirmed: accepted,
  postRunReviewOwnerConfirmed: accepted,
  readbackPlanConfirmed: accepted,
  abortSwitchPresent: accepted,
  nextRoute: accepted
    ? "prepare_current_scope_bounded_write_execution_packet_no_execution"
    : rejectedOrRepair
      ? "keep_mock_and_request_execution_decision_repair"
      : "keep_mock_and_repair_execution_decision_gate",
  problems
}));

if (!accepted) process.exit(1);

function validateResponseIntake(result) {
  expect(result.status, "ok", "responseIntake.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_accepted_no_execution",
    "responseIntake.guardedStatus"
  );
  expect(result.operatorAuthorizationResponseAcceptedNow, true, "responseIntake.operatorAuthorizationResponseAcceptedNow");
  expect(result.operatorAuthorizationAcceptedNow, true, "responseIntake.operatorAuthorizationAcceptedNow");
  expect(result.candidateArtifactPathReferencePresent, true, "responseIntake.candidateArtifactPathReferencePresent");
  expect(result.rollbackScopePresent, true, "responseIntake.rollbackScopePresent");
  expectSafeFlags(result, "responseIntake");
  if (containsForbiddenPayloadKeys(result)) problems.push("response intake must not include row/raw/stock-id payload fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope response intake");
}

function validateExecutionDecision(decision, intake) {
  if (containsForbiddenPayloadKeys(decision)) problems.push("execution decision must not include row/raw/stock-id payload or secret fields");
  if (containsSecretOrConfirmationValueKeys(decision)) problems.push("execution decision must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(decision)) problems.push("deferred ETF symbols must not be part of current-scope execution decision");
  expectSafeFlags(decision, "executionDecision");

  if (decision.executionDecision === "REJECT_OR_REPAIR") return "rejected_or_repair";
  expect(decision.executionDecision, "APPROVE_PREPARE_ONE_BOUNDED_WRITE_EXECUTION_PACKET", "executionDecision.executionDecision");
  expect(decision.attemptId, intake.attemptId, "executionDecision.attemptId");
  expect(decision.operatorAuthorizationResponseAcceptedNow, true, "executionDecision.operatorAuthorizationResponseAcceptedNow");
  expect(decision.candidateArtifactPathReferencePresent, true, "executionDecision.candidateArtifactPathReferencePresent");
  expect(decision.rollbackScopeConfirmed, true, "executionDecision.rollbackScopeConfirmed");
  expect(decision.postRunReviewOwnerConfirmed, true, "executionDecision.postRunReviewOwnerConfirmed");
  expect(decision.readbackPlanConfirmed, true, "executionDecision.readbackPlanConfirmed");
  expect(decision.abortSwitchPresent, true, "executionDecision.abortSwitchPresent");
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
