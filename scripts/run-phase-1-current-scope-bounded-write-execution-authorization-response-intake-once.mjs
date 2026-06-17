import fs from "node:fs";

const authorizationPacketPath = getArg("--authorization-packet");
const authorizationResponsePath = getArg("--authorization-response");
const problems = [];

if (!authorizationPacketPath || !authorizationResponsePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_authorization_response_intake_blocked_missing_inputs",
    boundedWriteExecutionAuthorizationResponseAcceptedNow: false,
    futurePreExecutionReviewPreparedNow: false,
    nextRoute: "provide_authorization_packet_and_response",
    problems: [
      !authorizationPacketPath ? "--authorization-packet is required" : null,
      !authorizationResponsePath ? "--authorization-response is required" : null
    ].filter(Boolean)
  }));
  process.exit(1);
}

const packetResult = parseJson(readFile(authorizationPacketPath, "authorization packet JSON"), authorizationPacketPath);
const response = parseJson(readFile(authorizationResponsePath, "authorization response JSON"), authorizationResponsePath);

const packet = validateAuthorizationPacketResult(packetResult);
validateAuthorizationResponse(response, packet);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_bounded_write_execution_authorization_response_intake_no_execution_ready"
    : "phase_1_current_scope_bounded_write_execution_authorization_response_intake_blocked_no_execution",
  boundedWriteExecutionAuthorizationResponseAcceptedNow: accepted,
  futurePreExecutionReviewPreparedNow: accepted,
  futurePreExecutionReview: accepted ? buildFuturePreExecutionReview(packet.attemptId) : null,
  nextRoute: accepted
    ? "prepare_current_scope_bounded_write_pre_execution_review_no_execution"
    : "keep_mock_and_repair_bounded_write_execution_authorization_response",
  problems
}));

if (!accepted) process.exit(1);

function validateAuthorizationPacketResult(result) {
  expect(result.status, "ok", "packetResult.status");
  expect(result.guardedStatus, "phase_1_current_scope_bounded_write_execution_authorization_packet_no_execution_ready", "packetResult.guardedStatus");
  expect(result.boundedWriteExecutionAuthorizationPacketPreparedNow, true, "packetResult.boundedWriteExecutionAuthorizationPacketPreparedNow");
  expectSafeFlags(result, "packetResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("authorization packet result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("authorization packet result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope authorization response intake input");

  const packet = result.boundedWriteExecutionAuthorizationPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("packetResult.boundedWriteExecutionAuthorizationPacket must be an object");
    return {};
  }
  expect(packet.packetMode, "current_scope_bounded_write_execution_authorization_packet_no_execution", "boundedWriteExecutionAuthorizationPacket.packetMode");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "boundedWriteExecutionAuthorizationPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "boundedWriteExecutionAuthorizationPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "boundedWriteExecutionAuthorizationPacket.operationKind");
  expect(packet.authorizationDecisionRequired, "APPROVE_PREPARE_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_RESPONSE", "boundedWriteExecutionAuthorizationPacket.authorizationDecisionRequired");
  expect(packet.requiredResponseMode, "current_scope_bounded_write_execution_authorization_response_no_execution", "boundedWriteExecutionAuthorizationPacket.requiredResponseMode");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("boundedWriteExecutionAuthorizationPacket.attemptId must be a string");
  if (!Array.isArray(packet.operatorMustConfirm) || packet.operatorMustConfirm.length < 8) {
    problems.push("boundedWriteExecutionAuthorizationPacket.operatorMustConfirm must contain at least 8 items");
  }
  if (!Array.isArray(packet.explicitStoplines) || packet.explicitStoplines.length < 5) {
    problems.push("boundedWriteExecutionAuthorizationPacket.explicitStoplines must contain at least 5 items");
  }
  expectSafeFlags(packet, "boundedWriteExecutionAuthorizationPacket");
  return packet;
}

function validateAuthorizationResponse(response, packet) {
  if (containsForbiddenPayloadKeys(response)) problems.push("authorization response must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(response)) problems.push("authorization response must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(response)) problems.push("deferred ETF symbols must not be part of current-scope authorization response");
  expectSafeFlags(response, "authorizationResponse");

  expect(response.responseMode, "current_scope_bounded_write_execution_authorization_response_no_execution", "authorizationResponse.responseMode");
  expect(response.authorizationDecision, "APPROVE_PREPARE_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_RESPONSE", "authorizationResponse.authorizationDecision");
  expect(response.attemptId, packet.attemptId, "authorizationResponse.attemptId");
  for (const field of [
    "acceptedDryRunReviewExistsConfirmed",
    "readinessReviewExistsConfirmed",
    "aggregateOnlyEvidenceReviewedConfirmed",
    "serverOnlyCredentialPresenceCheckedConfirmed",
    "sanitizedCandidateArtifactPathShapeCheckedConfirmed",
    "insertMissingOnlyContractReviewedConfirmed",
    "aggregateReadbackContractReviewedConfirmed",
    "rollbackOrQuarantinePlanReviewedConfirmed",
    "publicRuntimeStaysMockConfirmed",
    "scoreSourceStaysMockConfirmed"
  ]) {
    expect(response[field], true, `authorizationResponse.${field}`);
  }
}

function buildFuturePreExecutionReview(attemptId) {
  return safePayload({
    reviewMode: "current_scope_bounded_write_pre_execution_review_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptedAuthorizationResponsePresent: true,
    requiredNextPacket: "current_scope_bounded_write_pre_execution_review_no_execution",
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
