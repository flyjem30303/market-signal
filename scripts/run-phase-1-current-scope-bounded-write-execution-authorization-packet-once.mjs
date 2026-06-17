import fs from "node:fs";

const readinessReviewPath = getArg("--readiness-review");
const problems = [];

if (!readinessReviewPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_authorization_packet_blocked_missing_inputs",
    boundedWriteExecutionAuthorizationPacketPreparedNow: false,
    nextRoute: "provide_bounded_write_execution_readiness_review_output",
    problems: ["--readiness-review is required"]
  }));
  process.exit(1);
}

const readinessResult = parseJson(
  readFile(readinessReviewPath, "bounded write readiness review JSON"),
  readinessReviewPath
);

const readiness = validateReadinessReviewResult(readinessResult);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_bounded_write_execution_authorization_packet_no_execution_ready"
    : "phase_1_current_scope_bounded_write_execution_authorization_packet_blocked_no_execution",
  boundedWriteExecutionAuthorizationPacketPreparedNow: accepted,
  boundedWriteExecutionAuthorizationPacket: accepted ? buildAuthorizationPacket(readiness.attemptId) : null,
  nextRoute: accepted
    ? "await_separate_current_scope_bounded_write_execution_authorization_response_no_execution"
    : "keep_mock_and_repair_bounded_write_execution_authorization_packet_inputs",
  problems
}));

if (!accepted) process.exit(1);

function validateReadinessReviewResult(result) {
  expect(result.status, "ok", "readinessResult.status");
  expect(result.guardedStatus, "phase_1_current_scope_bounded_write_execution_readiness_review_no_execution_ready", "readinessResult.guardedStatus");
  expect(result.boundedWriteExecutionReadinessReviewPreparedNow, true, "readinessResult.boundedWriteExecutionReadinessReviewPreparedNow");
  expectSafeFlags(result, "readinessResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("readiness result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("readiness result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope authorization packet input");

  const review = result.boundedWriteExecutionReadinessReview;
  if (!review || typeof review !== "object") {
    problems.push("readinessResult.boundedWriteExecutionReadinessReview must be an object");
    return {};
  }
  expect(review.reviewMode, "current_scope_bounded_write_execution_readiness_review_no_execution", "boundedWriteExecutionReadinessReview.reviewMode");
  expect(review.phase1Universe, "twii_plus_listed_stock_daily_close", "boundedWriteExecutionReadinessReview.phase1Universe");
  expect(review.scope, "twii_plus_listed_stock_daily_close", "boundedWriteExecutionReadinessReview.scope");
  expect(review.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "boundedWriteExecutionReadinessReview.operationKind");
  expect(review.requiredNextPacket, "current_scope_bounded_write_execution_authorization_packet_no_execution", "boundedWriteExecutionReadinessReview.requiredNextPacket");
  if (!review.attemptId || typeof review.attemptId !== "string") problems.push("boundedWriteExecutionReadinessReview.attemptId must be a string");
  for (const field of [
    "acceptedDryRunReviewRequired",
    "aggregateOnlyEvidenceRequired",
    "serverOnlyCredentialPresenceCheckRequired",
    "sanitizedCandidateArtifactPathShapeCheckRequired",
    "insertMissingOnlyContractRequired",
    "aggregateReadbackContractRequired",
    "rollbackOrQuarantinePlanRequired",
    "separateOperatorAuthorizationRequired"
  ]) {
    expect(review[field], true, `boundedWriteExecutionReadinessReview.${field}`);
  }
  if (!Array.isArray(review.readinessStoplines) || review.readinessStoplines.length < 5) {
    problems.push("boundedWriteExecutionReadinessReview.readinessStoplines must contain at least 5 items");
  }
  expectSafeFlags(review, "boundedWriteExecutionReadinessReview");
  return review;
}

function buildAuthorizationPacket(attemptId) {
  return safePayload({
    packetMode: "current_scope_bounded_write_execution_authorization_packet_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    authorizationDecisionRequired: "APPROVE_PREPARE_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_RESPONSE",
    operatorMustConfirm: [
      "accepted_dry_run_review_exists",
      "readiness_review_exists",
      "aggregate_only_evidence_reviewed",
      "server_only_credential_presence_checked",
      "sanitized_candidate_artifact_path_shape_checked",
      "insert_missing_only_contract_reviewed",
      "aggregate_readback_contract_reviewed",
      "rollback_or_quarantine_plan_reviewed",
      "public_runtime_stays_mock",
      "score_source_stays_mock"
    ],
    explicitStoplines: [
      "do_not_execute_sql_from_this_packet",
      "do_not_write_supabase_from_this_packet",
      "do_not_mutate_daily_prices_from_this_packet",
      "do_not_output_secret_or_confirmation_values",
      "do_not_promote_public_runtime_to_real"
    ],
    requiredResponseMode: "current_scope_bounded_write_execution_authorization_response_no_execution"
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
