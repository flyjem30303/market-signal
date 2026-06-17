import fs from "node:fs";

const preflightResultPath = getArg("--preflight-result");
const problems = [];

if (!preflightResultPath) {
  emit({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_blocked_missing_preflight",
    operatorAuthorizationPacketPreparedNow: false,
    operatorAuthorizationAcceptedNow: false,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "provide_bounded_write_authorization_preflight_result",
    problems: ["--preflight-result is required"]
  });
  process.exit(1);
}

const preflight = parseJson(readFile(preflightResultPath, "bounded write authorization preflight JSON"), preflightResultPath);
const accepted = problems.length === 0 && validatePreflight(preflight);

emit({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_ready_no_execution"
    : "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_blocked_no_execution",
  preflightResultPath,
  operatorAuthorizationPacketPreparedNow: accepted,
  operatorAuthorizationAcceptedNow: false,
  boundedWriteExecutableNow: false,
  candidateRowsAcceptedNow: false,
  writeGateOpenedNow: false,
  sqlExecuted: false,
  supabaseWriteAttempted: false,
  dailyPricesMutated: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  authorizationPacket: accepted ? makeAuthorizationPacket(preflight) : null,
  nextRoute: accepted
    ? "await_explicit_operator_bounded_write_authorization_response_no_execution"
    : "keep_mock_and_request_bounded_write_preflight_repair",
  problems
});

if (!accepted) process.exit(1);

function validatePreflight(result) {
  expect(result.status, "ok", "preflight.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_ready_no_execution",
    "preflight.guardedStatus"
  );
  expect(result.preflightPreparedNow, true, "preflight.preflightPreparedNow");
  expect(result.operatorAuthorizationRequired, true, "preflight.operatorAuthorizationRequired");
  expect(result.boundedWriteExecutableNow, false, "preflight.boundedWriteExecutableNow");
  expect(result.candidateRowsAcceptedNow, false, "preflight.candidateRowsAcceptedNow");
  expect(result.writeGateOpenedNow, false, "preflight.writeGateOpenedNow");
  expect(result.sqlExecuted, false, "preflight.sqlExecuted");
  expect(result.supabaseWriteAttempted, false, "preflight.supabaseWriteAttempted");
  expect(result.dailyPricesMutated, false, "preflight.dailyPricesMutated");
  expect(result.publicDataSource, "mock", "preflight.publicDataSource");
  expect(result.scoreSource, "mock", "preflight.scoreSource");
  expect(result.phase1Universe, "twii_plus_listed_stock_daily_close", "preflight.phase1Universe");
  expect(result.scope, "twii_plus_listed_stock_daily_close", "preflight.scope");

  const packet = result.preflightPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("preflight.preflightPacket must be an object");
  } else {
    for (const [field, minimum] of [
      ["requiredFutureInputs", 5],
      ["stopConditions", 5],
      ["rollbackReadbackRequirements", 3],
      ["postRunReviewRequirements", 3]
    ]) {
      if (!Array.isArray(packet[field]) || packet[field].length < minimum) {
        problems.push(`preflight.preflightPacket.${field} must contain at least ${minimum} items`);
      }
    }
    expect(packet.operatorAuthorizationRequired, true, "preflight.preflightPacket.operatorAuthorizationRequired");
    expect(packet.boundedWriteExecutableNow, false, "preflight.preflightPacket.boundedWriteExecutableNow");
    expect(packet.candidateRowsAcceptedNow, false, "preflight.preflightPacket.candidateRowsAcceptedNow");
    expect(packet.writeGateOpenedNow, false, "preflight.preflightPacket.writeGateOpenedNow");
    expect(packet.sqlExecuted, false, "preflight.preflightPacket.sqlExecuted");
    expect(packet.supabaseWriteAttempted, false, "preflight.preflightPacket.supabaseWriteAttempted");
    expect(packet.dailyPricesMutated, false, "preflight.preflightPacket.dailyPricesMutated");
    expect(packet.publicDataSource, "mock", "preflight.preflightPacket.publicDataSource");
    expect(packet.scoreSource, "mock", "preflight.preflightPacket.scoreSource");
  }

  if (containsForbiddenPayloadKeys(result)) problems.push("preflight result must not include row/raw/stock-id payload fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope preflight result");
  return problems.length === 0;
}

function makeAuthorizationPacket(result) {
  return {
    packetMode: "explicit_operator_bounded_write_authorization_packet_no_execution",
    sourcePreflightStatus: result.guardedStatus,
    artifactId: result.artifactId,
    phase1Universe: result.phase1Universe,
    scope: result.scope,
    requiredFutureAuthorizationFields: [
      "operatorDecision",
      "attemptId",
      "candidateArtifactPathReference",
      "executeSwitch",
      "confirmationPhrase",
      "rollbackScope",
      "postRunReviewOwner"
    ],
    acceptedFutureDecisionValue: "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT",
    rejectedFutureDecisionValue: "REJECT_OR_REPAIR",
    requiredFutureAssertions: [
      "candidateArtifactPathReferencePointsToReviewedAggregateArtifact",
      "executeSwitchIsPresentButValueIsNotLogged",
      "confirmationPhraseIsPresentButValueIsNotLogged",
      "rollbackScopeIsConfirmed",
      "postRunReviewOwnerIsNamed",
      "publicRuntimePromotionIsSeparate"
    ],
    requiredStopConditions: result.preflightPacket.stopConditions,
    requiredRollbackReadbackRequirements: result.preflightPacket.rollbackReadbackRequirements,
    requiredPostRunReviewRequirements: result.preflightPacket.postRunReviewRequirements,
    envValuesReadNow: false,
    secretValuesOutputNow: false,
    confirmationPhraseValueOutputNow: false,
    operatorAuthorizationAcceptedNow: false,
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
