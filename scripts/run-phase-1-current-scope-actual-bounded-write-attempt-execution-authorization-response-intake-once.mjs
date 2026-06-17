import fs from "node:fs";

const authorizationPath = getArg("--execution-authorization");
const responsePath = getArg("--execution-authorization-response");
const problems = [];

if (!authorizationPath || !responsePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_blocked_missing_inputs",
    actualExecutionAuthorizationAcceptedNow: false,
    finalExecutionReadinessPreparedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_execution_authorization_and_response",
    problems: [
      !authorizationPath ? "--execution-authorization is required" : null,
      !responsePath ? "--execution-authorization-response is required" : null
    ].filter(Boolean)
  }));
  process.exit(1);
}

const authorizationResult = parseJson(readFile(authorizationPath, "actual execution authorization JSON"), authorizationPath);
const response = parseJson(readFile(responsePath, "actual execution authorization response JSON"), responsePath);

const authorization = validateAuthorizationResult(authorizationResult);
validateAuthorizationResponse(response, authorization);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_blocked_no_execution",
  actualExecutionAuthorizationAcceptedNow: accepted,
  finalExecutionReadinessPreparedNow: accepted,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptFinalExecutionReadinessPacket: accepted
    ? buildFinalExecutionReadinessPacket(authorization.attemptId)
    : null,
  nextRoute: accepted
    ? "prepare_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake",
  problems
}));

if (!accepted) process.exit(1);

function validateAuthorizationResult(result) {
  expect(result.status, "ok", "executionAuthorizationResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution_ready",
    "executionAuthorizationResult.guardedStatus"
  );
  expect(result.actualExecutionAuthorizationPreparedNow, true, "executionAuthorizationResult.actualExecutionAuthorizationPreparedNow");
  expect(result.actualExecutionAuthorizationAcceptedNow, false, "executionAuthorizationResult.actualExecutionAuthorizationAcceptedNow");
  expect(result.finalExecutionAllowedNow, false, "executionAuthorizationResult.finalExecutionAllowedNow");
  expect(result.actualWriteAttemptAllowedNow, false, "executionAuthorizationResult.actualWriteAttemptAllowedNow");
  expectSafeFlags(result, "executionAuthorizationResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("execution authorization result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("execution authorization result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of execution authorization response intake input");

  const authorization = result.actualBoundedWriteAttemptExecutionAuthorization;
  if (!authorization || typeof authorization !== "object") {
    problems.push("executionAuthorizationResult.actualBoundedWriteAttemptExecutionAuthorization must be an object");
    return {};
  }

  expect(authorization.authorizationMode, "current_scope_actual_bounded_write_attempt_execution_authorization_no_execution", "actualBoundedWriteAttemptExecutionAuthorization.authorizationMode");
  if (!authorization.attemptId || typeof authorization.attemptId !== "string") problems.push("actualBoundedWriteAttemptExecutionAuthorization.attemptId must be a string");
  expect(authorization.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionAuthorization.phase1Universe");
  expect(authorization.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionAuthorization.scope");
  expect(authorization.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptExecutionAuthorization.operationKind");
  expect(authorization.requiredAuthorizationDecision, "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_EXECUTION", "actualBoundedWriteAttemptExecutionAuthorization.requiredAuthorizationDecision");
  expect(authorization.acceptedExecutionPacketPresent, true, "actualBoundedWriteAttemptExecutionAuthorization.acceptedExecutionPacketPresent");
  expect(authorization.finalGoResponseAcceptedNow, true, "actualBoundedWriteAttemptExecutionAuthorization.finalGoResponseAcceptedNow");
  expect(authorization.actualExecutionAuthorizationAcceptedNow, false, "actualBoundedWriteAttemptExecutionAuthorization.actualExecutionAuthorizationAcceptedNow");
  expect(authorization.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptExecutionAuthorization.finalExecutionAllowedNow");
  expect(authorization.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptExecutionAuthorization.actualWriteAttemptAllowedNow");
  expect(authorization.runnerMustRemainFailClosed, true, "actualBoundedWriteAttemptExecutionAuthorization.runnerMustRemainFailClosed");
  expect(authorization.candidateArtifactPathReadinessRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.candidateArtifactPathReadinessRequired");
  expect(authorization.insertMissingOnlyContractRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.insertMissingOnlyContractRequired");
  expect(authorization.aggregateReadbackContractRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.aggregateReadbackContractRequired");
  expect(authorization.rollbackOrQuarantinePlanRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.rollbackOrQuarantinePlanRequired");
  expect(authorization.postRunReviewRequired, true, "actualBoundedWriteAttemptExecutionAuthorization.postRunReviewRequired");
  expect(authorization.publicRuntimeMustStayMock, true, "actualBoundedWriteAttemptExecutionAuthorization.publicRuntimeMustStayMock");
  expect(authorization.scoreSourceMustStayMock, true, "actualBoundedWriteAttemptExecutionAuthorization.scoreSourceMustStayMock");
  expect(authorization.requiredNextPacket, "current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution", "actualBoundedWriteAttemptExecutionAuthorization.requiredNextPacket");
  expectSafeFlags(authorization, "actualBoundedWriteAttemptExecutionAuthorization");
  return authorization;
}

function validateAuthorizationResponse(response, authorization) {
  if (containsForbiddenPayloadKeys(response)) problems.push("execution authorization response must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(response)) problems.push("execution authorization response must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(response)) problems.push("deferred ETF symbols must not be part of execution authorization response");
  expectSafeFlags(response, "executionAuthorizationResponse");

  expect(response.responseMode, "current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution", "executionAuthorizationResponse.responseMode");
  expect(response.authorizationDecision, "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_EXECUTION", "executionAuthorizationResponse.authorizationDecision");
  expect(response.attemptId, authorization.attemptId, "executionAuthorizationResponse.attemptId");
  for (const field of [
    "acceptedExecutionPacketReviewedConfirmed",
    "finalGoResponseReviewedConfirmed",
    "candidateArtifactPathReadyConfirmed",
    "serverOnlyRuntimeInputsReviewedConfirmed",
    "insertMissingOnlyContractReviewedConfirmed",
    "aggregateReadbackContractReviewedConfirmed",
    "rollbackOrQuarantinePlanReviewedConfirmed",
    "postRunReviewReviewedConfirmed",
    "publicRuntimeStaysMockConfirmed",
    "scoreSourceStaysMockConfirmed",
    "runnerMustRemainFailClosedConfirmed"
  ]) {
    expect(response[field], true, `executionAuthorizationResponse.${field}`);
  }
}

function buildFinalExecutionReadinessPacket(attemptId) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptedExecutionAuthorizationResponsePresent: true,
    actualExecutionAuthorizationAcceptedNow: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    runnerMustRemainFailClosed: true,
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution",
    hardStopsStillApply: [
      "sql_not_executed",
      "supabase_write_not_attempted",
      "daily_prices_not_mutated",
      "candidate_rows_not_accepted",
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
