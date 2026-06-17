import fs from "node:fs";

const finalGoNoGoIntakePath = getArg("--final-go-no-go-intake");
const problems = [];

if (!finalGoNoGoIntakePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_single_bounded_write_attempt_execution_gate_blocked_missing_inputs",
    singleBoundedWriteAttemptExecutionGatePreparedNow: false,
    finalExecutionAllowedNow: false,
    nextRoute: "provide_final_go_no_go_intake",
    problems: ["--final-go-no-go-intake is required"]
  }));
  process.exit(1);
}

const intakeResult = parseJson(readFile(finalGoNoGoIntakePath, "final go/no-go intake JSON"), finalGoNoGoIntakePath);
validateFinalGoNoGoIntake(intakeResult);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_single_bounded_write_attempt_execution_gate_no_execution_ready"
    : "phase_1_current_scope_single_bounded_write_attempt_execution_gate_blocked_no_execution",
  singleBoundedWriteAttemptExecutionGatePreparedNow: accepted,
  finalExecutionAllowedNow: false,
  singleBoundedWriteAttemptExecutionGate: accepted
    ? buildSingleBoundedWriteAttemptExecutionGate(intakeResult.finalOperatorGoNoGoIntake.attemptId)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_actual_bounded_write_attempt_authorization"
    : "keep_mock_and_repair_current_scope_single_bounded_write_attempt_execution_gate",
  problems
}));

if (!accepted) process.exit(1);

function validateFinalGoNoGoIntake(result) {
  expect(result.status, "ok", "finalGoNoGoIntake.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_final_operator_go_no_go_intake_no_execution_ready",
    "finalGoNoGoIntake.guardedStatus"
  );
  expect(result.finalOperatorGoNoGoAcceptedNow, true, "finalGoNoGoIntake.finalOperatorGoNoGoAcceptedNow");
  expect(result.finalExecutionAllowedNow, false, "finalGoNoGoIntake.finalExecutionAllowedNow");
  expectSafeFlags(result, "finalGoNoGoIntake");
  if (containsForbiddenPayloadKeys(result)) problems.push("final go/no-go intake must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("final go/no-go intake must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope execution gate input");

  const intake = result.finalOperatorGoNoGoIntake;
  if (!intake || typeof intake !== "object") {
    problems.push("finalGoNoGoIntake.finalOperatorGoNoGoIntake must be an object");
    return;
  }
  expect(intake.decisionMode, "current_scope_final_operator_go_no_go_no_execution", "finalOperatorGoNoGoIntake.decisionMode");
  if (!intake.attemptId || typeof intake.attemptId !== "string") problems.push("finalOperatorGoNoGoIntake.attemptId must be a string");
  expect(intake.phase1Universe, "twii_plus_listed_stock_daily_close", "finalOperatorGoNoGoIntake.phase1Universe");
  expect(intake.scope, "twii_plus_listed_stock_daily_close", "finalOperatorGoNoGoIntake.scope");
  expect(intake.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "finalOperatorGoNoGoIntake.operationKind");
  expect(intake.acceptedFinalDecision, "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT", "finalOperatorGoNoGoIntake.acceptedFinalDecision");
  expect(intake.finalExecutionAllowedNow, false, "finalOperatorGoNoGoIntake.finalExecutionAllowedNow");
  expect(intake.finalExecutionStillRequiresSeparateGate, true, "finalOperatorGoNoGoIntake.finalExecutionStillRequiresSeparateGate");
  expect(intake.requiredNextPacket, "current_scope_single_bounded_write_attempt_execution_gate_no_execution", "finalOperatorGoNoGoIntake.requiredNextPacket");
  expectSafeFlags(intake, "finalOperatorGoNoGoIntake");
}

function buildSingleBoundedWriteAttemptExecutionGate(attemptId) {
  return safePayload({
    gateMode: "current_scope_single_bounded_write_attempt_execution_gate_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptedFinalDecision: "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT",
    finalGoNoGoAcceptedNow: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    runnerMustRemainFailClosed: true,
    candidateArtifactPathReadinessRequired: true,
    insertMissingOnlyContractRequired: true,
    aggregateReadbackContractRequired: true,
    rollbackOrQuarantinePlanRequired: true,
    postRunReviewRequired: true,
    publicRuntimeMustStayMock: true,
    scoreSourceMustStayMock: true,
    actualExecutionStoplines: [
      "separate_actual_write_attempt_authorization_missing",
      "candidate_artifact_path_not_ready",
      "row_raw_or_stock_id_payload_present",
      "secret_or_confirmation_value_present",
      "real_promotion_requested",
      "sql_or_write_already_attempted"
    ],
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_authorization"
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
