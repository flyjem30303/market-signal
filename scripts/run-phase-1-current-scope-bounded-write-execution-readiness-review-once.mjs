import fs from "node:fs";

const dryRunReviewAcceptancePath = getArg("--dry-run-review-acceptance");
const problems = [];

if (!dryRunReviewAcceptancePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_readiness_review_blocked_missing_inputs",
    boundedWriteExecutionReadinessReviewPreparedNow: false,
    nextRoute: "provide_dry_run_review_acceptance_gate_output",
    problems: ["--dry-run-review-acceptance is required"]
  }));
  process.exit(1);
}

const acceptanceResult = parseJson(
  readFile(dryRunReviewAcceptancePath, "dry-run review acceptance gate JSON"),
  dryRunReviewAcceptancePath
);

const readinessInput = validateAcceptanceResult(acceptanceResult);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_bounded_write_execution_readiness_review_no_execution_ready"
    : "phase_1_current_scope_bounded_write_execution_readiness_review_blocked_no_execution",
  boundedWriteExecutionReadinessReviewPreparedNow: accepted,
  boundedWriteExecutionReadinessReview: accepted ? buildReadinessReview(readinessInput.attemptId) : null,
  nextRoute: accepted
    ? "prepare_current_scope_bounded_write_execution_authorization_packet_no_execution"
    : "keep_mock_and_repair_bounded_write_execution_readiness_review_inputs",
  problems
}));

if (!accepted) process.exit(1);

function validateAcceptanceResult(result) {
  expect(result.status, "ok", "acceptanceResult.status");
  expect(result.guardedStatus, "phase_1_current_scope_dry_run_review_acceptance_gate_ready_no_execution", "acceptanceResult.guardedStatus");
  expect(result.dryRunReviewAcceptedNow, true, "acceptanceResult.dryRunReviewAcceptedNow");
  expect(result.futureBoundedWriteReadinessReviewPreparedNow, true, "acceptanceResult.futureBoundedWriteReadinessReviewPreparedNow");
  expectSafeFlags(result, "acceptanceResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("acceptance result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("acceptance result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope readiness review input");

  const review = result.futureBoundedWriteReadinessReview;
  if (!review || typeof review !== "object") {
    problems.push("acceptanceResult.futureBoundedWriteReadinessReview must be an object");
    return {};
  }
  expect(review.reviewMode, "current_scope_bounded_write_execution_readiness_review_no_execution", "futureBoundedWriteReadinessReview.reviewMode");
  expect(review.phase1Universe, "twii_plus_listed_stock_daily_close", "futureBoundedWriteReadinessReview.phase1Universe");
  expect(review.scope, "twii_plus_listed_stock_daily_close", "futureBoundedWriteReadinessReview.scope");
  expect(review.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "futureBoundedWriteReadinessReview.operationKind");
  expect(review.dryRunReviewPacketAcceptedNow, true, "futureBoundedWriteReadinessReview.dryRunReviewPacketAcceptedNow");
  expect(review.requiredNextRoute, "prepare_current_scope_bounded_write_execution_readiness_review_no_execution", "futureBoundedWriteReadinessReview.requiredNextRoute");
  if (!review.attemptId || typeof review.attemptId !== "string") problems.push("futureBoundedWriteReadinessReview.attemptId must be a string");
  if (!Array.isArray(review.requiredReadinessSections) || review.requiredReadinessSections.length < 3) {
    problems.push("futureBoundedWriteReadinessReview.requiredReadinessSections must contain at least 3 items");
  }
  expectSafeFlags(review, "futureBoundedWriteReadinessReview");
  return review;
}

function buildReadinessReview(attemptId) {
  return safePayload({
    reviewMode: "current_scope_bounded_write_execution_readiness_review_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptedDryRunReviewRequired: true,
    aggregateOnlyEvidenceRequired: true,
    serverOnlyCredentialPresenceCheckRequired: true,
    sanitizedCandidateArtifactPathShapeCheckRequired: true,
    insertMissingOnlyContractRequired: true,
    aggregateReadbackContractRequired: true,
    rollbackOrQuarantinePlanRequired: true,
    separateOperatorAuthorizationRequired: true,
    readinessStoplines: [
      "missing_or_mismatched_attempt_id",
      "row_raw_or_stock_id_payload_present",
      "secret_or_confirmation_value_present",
      "etf_scope_present",
      "real_promotion_requested",
      "write_or_sql_already_attempted"
    ],
    requiredNextPacket: "current_scope_bounded_write_execution_authorization_packet_no_execution"
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
