import fs from "node:fs";

const dryRunReviewPacketPath = getArg("--dry-run-review-packet");
const dryRunReviewAcceptancePath = getArg("--dry-run-review-acceptance");
const problems = [];

if (!dryRunReviewPacketPath || !dryRunReviewAcceptancePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_dry_run_review_acceptance_gate_blocked_missing_inputs",
    dryRunReviewAcceptedNow: false,
    futureBoundedWriteReadinessReviewPreparedNow: false,
    nextRoute: "provide_dry_run_review_packet_and_acceptance_decision",
    problems: [
      "--dry-run-review-packet is required",
      "--dry-run-review-acceptance is required"
    ].filter((problem) =>
      (!dryRunReviewPacketPath && problem.includes("packet")) ||
      (!dryRunReviewAcceptancePath && problem.includes("acceptance"))
    )
  }));
  process.exit(1);
}

const packetResult = parseJson(
  readFile(dryRunReviewPacketPath, "dry-run review packet JSON"),
  dryRunReviewPacketPath
);
const acceptanceDecision = parseJson(
  readFile(dryRunReviewAcceptancePath, "dry-run review acceptance JSON"),
  dryRunReviewAcceptancePath
);

const packet = validatePacketResult(packetResult);
validateAcceptanceDecision(acceptanceDecision, packet);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_dry_run_review_acceptance_gate_ready_no_execution"
    : "phase_1_current_scope_dry_run_review_acceptance_gate_blocked_no_execution",
  dryRunReviewAcceptedNow: accepted,
  futureBoundedWriteReadinessReviewPreparedNow: accepted,
  futureBoundedWriteReadinessReview: accepted ? buildFutureReadinessReview(packet.attemptId) : null,
  nextRoute: accepted
    ? "prepare_current_scope_bounded_write_execution_readiness_review_no_execution"
    : "keep_mock_and_repair_dry_run_review_acceptance_inputs",
  problems
}));

if (!accepted) process.exit(1);

function validatePacketResult(result) {
  expect(result.status, "ok", "packetResult.status");
  expect(result.guardedStatus, "phase_1_current_scope_dry_run_review_packet_ready_no_execution", "packetResult.guardedStatus");
  expect(result.dryRunReviewPacketPreparedNow, true, "packetResult.dryRunReviewPacketPreparedNow");
  expectSafeFlags(result, "packetResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("dry-run review packet result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("dry-run review packet result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope dry-run review acceptance input");

  const packet = result.dryRunReviewPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("packetResult.dryRunReviewPacket must be an object");
    return {};
  }

  expect(packet.packetMode, "current_scope_dry_run_review_packet_no_execution", "dryRunReviewPacket.packetMode");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "dryRunReviewPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "dryRunReviewPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "dryRunReviewPacket.operationKind");
  if (!packet.attemptId || typeof packet.attemptId !== "string") problems.push("dryRunReviewPacket.attemptId must be a string");
  for (const field of [
    "requiredReviewSections",
    "requiredAggregateEvidence",
    "requiredFailureEvidence",
    "requiredNoPayloadEvidence",
    "requiredDecisionOptions"
  ]) {
    if (!Array.isArray(packet[field]) || packet[field].length < 3) problems.push(`dryRunReviewPacket.${field} must contain at least 3 items`);
  }
  expectSafeFlags(packet, "dryRunReviewPacket");
  return packet;
}

function validateAcceptanceDecision(decision, packet) {
  if (containsForbiddenPayloadKeys(decision)) problems.push("dry-run review acceptance must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(decision)) problems.push("dry-run review acceptance must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(decision)) problems.push("deferred ETF symbols must not be part of current-scope dry-run review acceptance decision");
  expectSafeFlags(decision, "dryRunReviewAcceptance");

  expect(
    decision.dryRunReviewAcceptanceDecision,
    "ACCEPT_CURRENT_SCOPE_DRY_RUN_REVIEW_PACKET",
    "dryRunReviewAcceptance.dryRunReviewAcceptanceDecision"
  );
  expect(decision.attemptId, packet.attemptId, "dryRunReviewAcceptance.attemptId");
  for (const field of [
    "dryRunReviewPacketPreparedNow",
    "requiredReviewSectionsConfirmed",
    "aggregateEvidenceConfirmed",
    "failureEvidenceConfirmed",
    "noPayloadEvidenceConfirmed",
    "decisionOptionsConfirmed",
    "publicRuntimeStaysMockConfirmed",
    "scoreSourceStaysMockConfirmed"
  ]) {
    expect(decision[field], true, `dryRunReviewAcceptance.${field}`);
  }
}

function buildFutureReadinessReview(attemptId) {
  return safePayload({
    reviewMode: "current_scope_bounded_write_execution_readiness_review_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    dryRunReviewPacketAcceptedNow: true,
    requiredNextRoute: "prepare_current_scope_bounded_write_execution_readiness_review_no_execution",
    requiredReadinessSections: [
      "accepted_dry_run_review_packet_summary",
      "bounded_write_preconditions_summary",
      "no_payload_no_secret_boundary_summary",
      "separate_operator_authorization_stopline"
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
