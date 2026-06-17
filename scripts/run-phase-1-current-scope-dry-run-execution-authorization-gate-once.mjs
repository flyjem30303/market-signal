import fs from "node:fs";

const dryRunPacketPath = getArg("--dry-run-packet");
const dryRunExecutionAuthorizationPath = getArg("--dry-run-execution-authorization");
const problems = [];

if (!dryRunPacketPath || !dryRunExecutionAuthorizationPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_dry_run_execution_authorization_gate_blocked_missing_inputs",
    dryRunExecutionAuthorizationAcceptedNow: false,
    futureDryRunReviewPreparedNow: false,
    dryRunExecutableNow: false,
    dryRunExecutedNow: false,
    nextRoute: "provide_dry_run_packet_and_dry_run_execution_authorization",
    problems: [
      ...(!dryRunPacketPath ? ["--dry-run-packet is required"] : []),
      ...(!dryRunExecutionAuthorizationPath ? ["--dry-run-execution-authorization is required"] : [])
    ]
  }));
  process.exit(1);
}

const dryRunPacketResult = parseJson(readFile(dryRunPacketPath, "dry-run packet JSON"), dryRunPacketPath);
const dryRunExecutionAuthorization = parseJson(
  readFile(dryRunExecutionAuthorizationPath, "dry-run execution authorization JSON"),
  dryRunExecutionAuthorizationPath
);

validateDryRunPacketResult(dryRunPacketResult);
validateDryRunExecutionAuthorization(dryRunExecutionAuthorization, dryRunPacketResult);

const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_dry_run_execution_authorization_gate_ready_no_execution"
    : "phase_1_current_scope_dry_run_execution_authorization_gate_blocked_no_execution",
  dryRunExecutionAuthorizationAcceptedNow: accepted,
  futureDryRunReviewPreparedNow: accepted,
  dryRunExecutableNow: false,
  dryRunExecutedNow: false,
  futureDryRunReview: accepted ? buildFutureDryRunReview(dryRunPacketResult.dryRunPacket.attemptId) : null,
  nextRoute: accepted
    ? "prepare_current_scope_dry_run_review_packet_no_execution"
    : "keep_mock_and_repair_dry_run_execution_authorization",
  problems
}));

if (!accepted) process.exit(1);

function validateDryRunPacketResult(result) {
  expect(result.status, "ok", "dryRunPacketResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_write_runner_dry_run_packet_ready_no_execution",
    "dryRunPacketResult.guardedStatus"
  );
  expect(result.dryRunPacketPreparedNow, true, "dryRunPacketResult.dryRunPacketPreparedNow");
  expect(result.dryRunExecutedNow, false, "dryRunPacketResult.dryRunExecutedNow");
  expectSafeFlags(result, "dryRunPacketResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("dry-run packet result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("dry-run packet result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope dry-run packet result");

  const packet = result.dryRunPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("dryRunPacketResult.dryRunPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_write_runner_dry_run_packet_no_execution", "dryRunPacket.packetMode");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "dryRunPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "dryRunPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "dryRunPacket.operationKind");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("dryRunPacket.attemptId must be a string");
  for (const field of [
    "requiredAggregateChecks",
    "requiredInputPresenceChecks",
    "requiredNoPayloadChecks",
    "requiredNoWriteChecks",
    "requiredReviewOutputs"
  ]) {
    if (!Array.isArray(packet[field]) || packet[field].length < 3) problems.push(`dryRunPacket.${field} must contain at least 3 items`);
  }
  expectSafeFlags(packet, "dryRunPacket");
}

function validateDryRunExecutionAuthorization(authorization, packetResult) {
  if (containsForbiddenPayloadKeys(authorization)) problems.push("dry-run execution authorization must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(authorization)) problems.push("dry-run execution authorization must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(authorization)) problems.push("deferred ETF symbols must not be part of current-scope dry-run execution authorization");
  expectSafeFlags(authorization, "dryRunExecutionAuthorization");
  if (authorization.dryRunExecutableNow === true) problems.push("dry-run execution authorization must not set dryRunExecutableNow=true");
  if (authorization.dryRunExecutedNow === true) problems.push("dry-run execution authorization must not set dryRunExecutedNow=true");

  expect(
    authorization.dryRunExecutionAuthorizationDecision,
    "APPROVE_PREPARE_CURRENT_SCOPE_DRY_RUN_EXECUTION_REVIEW",
    "dryRunExecutionAuthorization.dryRunExecutionAuthorizationDecision"
  );
  expect(authorization.attemptId, packetResult.dryRunPacket?.attemptId, "dryRunExecutionAuthorization.attemptId");
  expect(authorization.dryRunPacketPreparedNow, true, "dryRunExecutionAuthorization.dryRunPacketPreparedNow");
  expect(authorization.aggregateChecksConfirmed, true, "dryRunExecutionAuthorization.aggregateChecksConfirmed");
  expect(authorization.inputPresenceChecksConfirmed, true, "dryRunExecutionAuthorization.inputPresenceChecksConfirmed");
  expect(authorization.noPayloadChecksConfirmed, true, "dryRunExecutionAuthorization.noPayloadChecksConfirmed");
  expect(authorization.noWriteChecksConfirmed, true, "dryRunExecutionAuthorization.noWriteChecksConfirmed");
  expect(authorization.reviewOutputsConfirmed, true, "dryRunExecutionAuthorization.reviewOutputsConfirmed");
  expect(authorization.publicRuntimeStaysMockConfirmed, true, "dryRunExecutionAuthorization.publicRuntimeStaysMockConfirmed");
  expect(authorization.scoreSourceStaysMockConfirmed, true, "dryRunExecutionAuthorization.scoreSourceStaysMockConfirmed");
}

function buildFutureDryRunReview(attemptId) {
  return safePayload({
    reviewMode: "current_scope_dry_run_execution_review_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    dryRunPacketAcceptedNow: true,
    dryRunExecutionAuthorizationRecordedNow: true,
    requiredNextPacket: "current_scope_dry_run_review_packet_no_execution",
    dryRunExecutableNow: false,
    dryRunExecutedNow: false
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
