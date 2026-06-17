import fs from "node:fs";

const authorizationResponseIntakePath = getArg("--authorization-response-intake");
const problems = [];

if (!authorizationResponseIntakePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_bounded_write_pre_execution_review_blocked_missing_inputs",
    boundedWritePreExecutionReviewPreparedNow: false,
    nextRoute: "provide_authorization_response_intake",
    problems: ["--authorization-response-intake is required"]
  }));
  process.exit(1);
}

const intake = parseJson(readFile(authorizationResponseIntakePath, "authorization response intake JSON"), authorizationResponseIntakePath);
validateAuthorizationResponseIntake(intake);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_bounded_write_pre_execution_review_no_execution_ready"
    : "phase_1_current_scope_bounded_write_pre_execution_review_blocked_no_execution",
  boundedWritePreExecutionReviewPreparedNow: accepted,
  boundedWritePreExecutionReview: accepted ? buildPreExecutionReview(intake.futurePreExecutionReview.attemptId) : null,
  nextRoute: accepted
    ? "prepare_current_scope_bounded_write_final_execution_packet_no_execution"
    : "keep_mock_and_repair_current_scope_bounded_write_pre_execution_review",
  problems
}));

if (!accepted) process.exit(1);

function validateAuthorizationResponseIntake(intake) {
  expect(intake.status, "ok", "authorizationResponseIntake.status");
  expect(
    intake.guardedStatus,
    "phase_1_current_scope_bounded_write_execution_authorization_response_intake_no_execution_ready",
    "authorizationResponseIntake.guardedStatus"
  );
  expect(
    intake.boundedWriteExecutionAuthorizationResponseAcceptedNow,
    true,
    "authorizationResponseIntake.boundedWriteExecutionAuthorizationResponseAcceptedNow"
  );
  expect(intake.futurePreExecutionReviewPreparedNow, true, "authorizationResponseIntake.futurePreExecutionReviewPreparedNow");
  expectSafeFlags(intake, "authorizationResponseIntake");
  if (containsForbiddenPayloadKeys(intake)) problems.push("authorization response intake must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(intake)) problems.push("authorization response intake must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(intake)) problems.push("deferred ETF symbols must not be part of current-scope pre-execution review input");

  const review = intake.futurePreExecutionReview;
  if (!review || typeof review !== "object") {
    problems.push("authorizationResponseIntake.futurePreExecutionReview must be an object");
    return;
  }
  expect(review.reviewMode, "current_scope_bounded_write_pre_execution_review_no_execution", "futurePreExecutionReview.reviewMode");
  if (!review.attemptId || typeof review.attemptId !== "string") problems.push("futurePreExecutionReview.attemptId must be a string");
  expect(review.phase1Universe, "twii_plus_listed_stock_daily_close", "futurePreExecutionReview.phase1Universe");
  expect(review.scope, "twii_plus_listed_stock_daily_close", "futurePreExecutionReview.scope");
  expect(review.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "futurePreExecutionReview.operationKind");
  expect(review.acceptedAuthorizationResponsePresent, true, "futurePreExecutionReview.acceptedAuthorizationResponsePresent");
  expect(review.requiredNextPacket, "current_scope_bounded_write_pre_execution_review_no_execution", "futurePreExecutionReview.requiredNextPacket");
  expectSafeFlags(review, "futurePreExecutionReview");
}

function buildPreExecutionReview(attemptId) {
  return safePayload({
    reviewMode: "current_scope_bounded_write_pre_execution_review_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptedAuthorizationResponsePresent: true,
    candidateArtifactPathReadinessRequired: true,
    aggregateOnlyEvidenceRequired: true,
    noPayloadBoundaryRequired: true,
    insertMissingOnlyContractRequired: true,
    aggregateReadbackContractRequired: true,
    rollbackOrQuarantinePlanRequired: true,
    finalOperatorGoNoGoRequired: true,
    preExecutionStoplines: [
      "missing_accepted_authorization_response",
      "candidate_artifact_path_not_ready",
      "row_raw_or_stock_id_payload_present",
      "secret_or_confirmation_value_present",
      "real_promotion_requested",
      "write_or_sql_already_attempted"
    ],
    requiredNextPacket: "current_scope_bounded_write_final_execution_packet_no_execution"
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
