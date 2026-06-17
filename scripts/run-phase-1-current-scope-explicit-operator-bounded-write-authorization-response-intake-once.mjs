import fs from "node:fs";

const authorizationPacketPath = getArg("--authorization-packet");
const operatorResponsePath = getArg("--operator-response");
const problems = [];

if (!authorizationPacketPath || !operatorResponsePath) {
  emit({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_blocked_missing_inputs",
    operatorAuthorizationResponseAcceptedNow: false,
    operatorAuthorizationAcceptedNow: false,
    acceptedDecisionRecordedNow: false,
    rejectedOrRepairDecisionRecordedNow: false,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "provide_authorization_packet_and_operator_response",
    problems: [
      ...(!authorizationPacketPath ? ["--authorization-packet is required"] : []),
      ...(!operatorResponsePath ? ["--operator-response is required"] : [])
    ]
  });
  process.exit(1);
}

const authorizationPacketResult = parseJson(readFile(authorizationPacketPath, "authorization packet JSON"), authorizationPacketPath);
const operatorResponse = parseJson(readFile(operatorResponsePath, "operator response JSON"), operatorResponsePath);

validateAuthorizationPacketResult(authorizationPacketResult);
const responseMode = validateOperatorResponse(operatorResponse);
const accepted = problems.length === 0 && responseMode === "accepted";
const rejectedOrRepair = responseMode === "rejected_or_repair";

emit({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_accepted_no_execution"
    : rejectedOrRepair
      ? "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_rejected_or_repair_no_execution"
      : "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_blocked_no_execution",
  operatorAuthorizationResponseAcceptedNow: accepted,
  operatorAuthorizationAcceptedNow: accepted,
  acceptedDecisionRecordedNow: accepted,
  rejectedOrRepairDecisionRecordedNow: rejectedOrRepair,
  attemptId: accepted ? operatorResponse.attemptId : null,
  candidateArtifactPathReferencePresent: accepted ? true : false,
  executeSwitchPresent: accepted ? true : false,
  confirmationPhrasePresent: accepted ? true : false,
  rollbackScopePresent: accepted ? true : false,
  postRunReviewOwner: accepted ? operatorResponse.postRunReviewOwner : null,
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
  scoreSource: "mock",
  nextRoute: accepted
    ? "prepare_current_scope_bounded_write_execution_decision_gate_no_execution"
    : rejectedOrRepair
      ? "keep_mock_and_request_operator_response_repair"
      : "keep_mock_and_repair_operator_authorization_response",
  problems
});

if (!accepted) process.exit(1);

function validateAuthorizationPacketResult(result) {
  expect(result.status, "ok", "authorizationPacketResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_ready_no_execution",
    "authorizationPacketResult.guardedStatus"
  );
  expect(result.operatorAuthorizationPacketPreparedNow, true, "authorizationPacketResult.operatorAuthorizationPacketPreparedNow");
  expect(result.operatorAuthorizationAcceptedNow, false, "authorizationPacketResult.operatorAuthorizationAcceptedNow");
  expect(result.boundedWriteExecutableNow, false, "authorizationPacketResult.boundedWriteExecutableNow");
  expect(result.candidateRowsAcceptedNow, false, "authorizationPacketResult.candidateRowsAcceptedNow");
  expect(result.writeGateOpenedNow, false, "authorizationPacketResult.writeGateOpenedNow");
  expect(result.sqlExecuted, false, "authorizationPacketResult.sqlExecuted");
  expect(result.supabaseWriteAttempted, false, "authorizationPacketResult.supabaseWriteAttempted");
  expect(result.dailyPricesMutated, false, "authorizationPacketResult.dailyPricesMutated");
  expect(result.publicDataSource, "mock", "authorizationPacketResult.publicDataSource");
  expect(result.scoreSource, "mock", "authorizationPacketResult.scoreSource");

  const packet = result.authorizationPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("authorizationPacketResult.authorizationPacket must be an object");
    return;
  }

  expect(packet.packetMode, "explicit_operator_bounded_write_authorization_packet_no_execution", "authorizationPacket.packetMode");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "authorizationPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "authorizationPacket.scope");
  expect(packet.acceptedFutureDecisionValue, "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT", "authorizationPacket.acceptedFutureDecisionValue");
  expect(packet.rejectedFutureDecisionValue, "REJECT_OR_REPAIR", "authorizationPacket.rejectedFutureDecisionValue");
  expect(packet.envValuesReadNow, false, "authorizationPacket.envValuesReadNow");
  expect(packet.secretValuesOutputNow, false, "authorizationPacket.secretValuesOutputNow");
  expect(packet.confirmationPhraseValueOutputNow, false, "authorizationPacket.confirmationPhraseValueOutputNow");
  expect(packet.operatorAuthorizationAcceptedNow, false, "authorizationPacket.operatorAuthorizationAcceptedNow");
  expect(packet.boundedWriteExecutableNow, false, "authorizationPacket.boundedWriteExecutableNow");
  expect(packet.candidateRowsAcceptedNow, false, "authorizationPacket.candidateRowsAcceptedNow");
  expect(packet.writeGateOpenedNow, false, "authorizationPacket.writeGateOpenedNow");
  expect(packet.sqlExecuted, false, "authorizationPacket.sqlExecuted");
  expect(packet.supabaseWriteAttempted, false, "authorizationPacket.supabaseWriteAttempted");
  expect(packet.dailyPricesMutated, false, "authorizationPacket.dailyPricesMutated");
  expect(packet.publicDataSource, "mock", "authorizationPacket.publicDataSource");
  expect(packet.scoreSource, "mock", "authorizationPacket.scoreSource");

  for (const field of [
    "operatorDecision",
    "attemptId",
    "candidateArtifactPathReference",
    "executeSwitch",
    "confirmationPhrase",
    "rollbackScope",
    "postRunReviewOwner"
  ]) {
    if (!packet.requiredFutureAuthorizationFields?.includes(field)) {
      problems.push(`authorizationPacket.requiredFutureAuthorizationFields missing ${field}`);
    }
  }
}

function validateOperatorResponse(response) {
  if (containsForbiddenPayloadKeys(response)) problems.push("operator response must not include row/raw/stock-id payload or secret fields");
  if (containsDeferredSymbols(response)) problems.push("deferred ETF symbols must not be part of current-scope authorization response");
  if (containsSecretOrConfirmationValueKeys(response)) {
    problems.push("operator response must not include secret/env/confirmation value fields");
  }

  if (response.publicDataSource && response.publicDataSource !== "mock") {
    problems.push("operator response must not promote publicDataSource");
  }
  if (response.scoreSource && response.scoreSource !== "mock") {
    problems.push("operator response must not promote scoreSource");
  }
  for (const flag of [
    "boundedWriteExecutableNow",
    "candidateRowsAcceptedNow",
    "writeGateOpenedNow",
    "sqlExecuted",
    "supabaseWriteAttempted",
    "dailyPricesMutated"
  ]) {
    if (response[flag] === true) problems.push(`operator response must not set ${flag}=true`);
  }

  if (response.operatorDecision === "REJECT_OR_REPAIR") return "rejected_or_repair";
  expect(response.operatorDecision, "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT", "operatorResponse.operatorDecision");
  expectNonEmptyString(response.attemptId, "operatorResponse.attemptId");
  expectNonEmptyString(response.candidateArtifactPathReference, "operatorResponse.candidateArtifactPathReference");
  expect(response.executeSwitchPresent, true, "operatorResponse.executeSwitchPresent");
  expect(response.confirmationPhrasePresent, true, "operatorResponse.confirmationPhrasePresent");
  expectNonEmptyString(response.rollbackScope, "operatorResponse.rollbackScope");
  expectNonEmptyString(response.postRunReviewOwner, "operatorResponse.postRunReviewOwner");
  return "accepted";
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

function expectNonEmptyString(actual, label) {
  if (typeof actual !== "string" || actual.trim().length === 0) {
    problems.push(`${label} must be a non-empty string`);
  }
}

function emit(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
