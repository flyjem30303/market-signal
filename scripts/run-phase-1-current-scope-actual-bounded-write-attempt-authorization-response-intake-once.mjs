import fs from "node:fs";

const authorizationPath = getArg("--authorization");
const authorizationResponsePath = getArg("--authorization-response");
const problems = [];

if (!authorizationPath || !authorizationResponsePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_authorization_response_intake_blocked_missing_inputs",
    actualWriteAttemptAuthorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_actual_authorization_and_response",
    problems: [
      !authorizationPath ? "--authorization is required" : null,
      !authorizationResponsePath ? "--authorization-response is required" : null
    ].filter(Boolean)
  }));
  process.exit(1);
}

const authorizationResult = parseJson(readFile(authorizationPath, "actual bounded write authorization JSON"), authorizationPath);
const response = parseJson(readFile(authorizationResponsePath, "actual bounded write authorization response JSON"), authorizationResponsePath);

const authorization = validateAuthorizationResult(authorizationResult);
validateAuthorizationResponse(response, authorization);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_authorization_response_intake_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_authorization_response_intake_blocked_no_execution",
  actualWriteAttemptAuthorizationAcceptedNow: accepted,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptFinalGoPacket: accepted
    ? buildActualBoundedWriteAttemptFinalGoPacket(authorization.attemptId)
    : null,
  nextRoute: accepted
    ? "prepare_current_scope_actual_bounded_write_attempt_final_go_packet_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_authorization_response_intake",
  problems
}));

if (!accepted) process.exit(1);

function validateAuthorizationResult(result) {
  expect(result.status, "ok", "authorizationResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_authorization_no_execution_ready",
    "authorizationResult.guardedStatus"
  );
  expect(result.actualBoundedWriteAttemptAuthorizationPreparedNow, true, "authorizationResult.actualBoundedWriteAttemptAuthorizationPreparedNow");
  expect(result.actualWriteAttemptAuthorizationAcceptedNow, false, "authorizationResult.actualWriteAttemptAuthorizationAcceptedNow");
  expect(result.finalExecutionAllowedNow, false, "authorizationResult.finalExecutionAllowedNow");
  expect(result.actualWriteAttemptAllowedNow, false, "authorizationResult.actualWriteAttemptAllowedNow");
  expectSafeFlags(result, "authorizationResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("authorization result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("authorization result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope authorization response intake input");

  const authorization = result.actualBoundedWriteAttemptAuthorization;
  if (!authorization || typeof authorization !== "object") {
    problems.push("authorizationResult.actualBoundedWriteAttemptAuthorization must be an object");
    return {};
  }
  expect(authorization.authorizationMode, "current_scope_actual_bounded_write_attempt_authorization_no_execution", "actualBoundedWriteAttemptAuthorization.authorizationMode");
  if (!authorization.attemptId || typeof authorization.attemptId !== "string") problems.push("actualBoundedWriteAttemptAuthorization.attemptId must be a string");
  expect(authorization.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptAuthorization.phase1Universe");
  expect(authorization.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptAuthorization.scope");
  expect(authorization.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptAuthorization.operationKind");
  expect(authorization.requiredAuthorizationDecision, "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "actualBoundedWriteAttemptAuthorization.requiredAuthorizationDecision");
  expect(authorization.acceptedFinalDecisionPresent, true, "actualBoundedWriteAttemptAuthorization.acceptedFinalDecisionPresent");
  expect(authorization.singleExecutionGateReady, true, "actualBoundedWriteAttemptAuthorization.singleExecutionGateReady");
  expect(authorization.actualWriteAttemptAuthorizationAcceptedNow, false, "actualBoundedWriteAttemptAuthorization.actualWriteAttemptAuthorizationAcceptedNow");
  expect(authorization.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptAuthorization.actualWriteAttemptAllowedNow");
  expect(authorization.runnerMustRemainFailClosed, true, "actualBoundedWriteAttemptAuthorization.runnerMustRemainFailClosed");
  expect(authorization.candidateArtifactPathReadinessRequired, true, "actualBoundedWriteAttemptAuthorization.candidateArtifactPathReadinessRequired");
  expect(authorization.insertMissingOnlyContractRequired, true, "actualBoundedWriteAttemptAuthorization.insertMissingOnlyContractRequired");
  expect(authorization.aggregateReadbackContractRequired, true, "actualBoundedWriteAttemptAuthorization.aggregateReadbackContractRequired");
  expect(authorization.rollbackOrQuarantinePlanRequired, true, "actualBoundedWriteAttemptAuthorization.rollbackOrQuarantinePlanRequired");
  expect(authorization.postRunReviewRequired, true, "actualBoundedWriteAttemptAuthorization.postRunReviewRequired");
  expect(authorization.publicRuntimeMustStayMock, true, "actualBoundedWriteAttemptAuthorization.publicRuntimeMustStayMock");
  expect(authorization.scoreSourceMustStayMock, true, "actualBoundedWriteAttemptAuthorization.scoreSourceMustStayMock");
  expect(authorization.requiredNextPacket, "current_scope_actual_bounded_write_attempt_authorization_response_no_execution", "actualBoundedWriteAttemptAuthorization.requiredNextPacket");
  expectSafeFlags(authorization, "actualBoundedWriteAttemptAuthorization");
  return authorization;
}

function validateAuthorizationResponse(response, authorization) {
  if (containsForbiddenPayloadKeys(response)) problems.push("authorization response must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(response)) problems.push("authorization response must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(response)) problems.push("deferred ETF symbols must not be part of current-scope authorization response");
  expectSafeFlags(response, "authorizationResponse");

  expect(response.responseMode, "current_scope_actual_bounded_write_attempt_authorization_response_no_execution", "authorizationResponse.responseMode");
  expect(response.authorizationDecision, "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "authorizationResponse.authorizationDecision");
  expect(response.attemptId, authorization.attemptId, "authorizationResponse.attemptId");
  for (const field of [
    "acceptedFinalDecisionReviewedConfirmed",
    "singleExecutionGateReviewedConfirmed",
    "candidateArtifactPathReadyConfirmed",
    "insertMissingOnlyContractReviewedConfirmed",
    "aggregateReadbackContractReviewedConfirmed",
    "rollbackOrQuarantinePlanReviewedConfirmed",
    "postRunReviewReviewedConfirmed",
    "publicRuntimeStaysMockConfirmed",
    "scoreSourceStaysMockConfirmed",
    "runnerMustRemainFailClosedConfirmed"
  ]) {
    expect(response[field], true, `authorizationResponse.${field}`);
  }
}

function buildActualBoundedWriteAttemptFinalGoPacket(attemptId) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_final_go_packet_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptedActualAuthorizationResponsePresent: true,
    actualWriteAttemptAuthorizationAcceptedNow: true,
    actualWriteAttemptAllowedNow: false,
    finalExecutionAllowedNow: false,
    runnerMustRemainFailClosed: true,
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_final_go_packet_no_execution",
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
