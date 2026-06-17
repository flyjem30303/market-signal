import fs from "node:fs";

const preExecutionReviewPath = getArg("--pre-execution-review");
const problems = [];

if (!preExecutionReviewPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_bounded_write_final_execution_packet_blocked_missing_inputs",
    boundedWriteFinalExecutionPacketPreparedNow: false,
    finalExecutionAllowedNow: false,
    nextRoute: "provide_pre_execution_review",
    problems: ["--pre-execution-review is required"]
  }));
  process.exit(1);
}

const reviewResult = parseJson(readFile(preExecutionReviewPath, "pre-execution review JSON"), preExecutionReviewPath);
validatePreExecutionReviewResult(reviewResult);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_bounded_write_final_execution_packet_no_execution_ready"
    : "phase_1_current_scope_bounded_write_final_execution_packet_blocked_no_execution",
  boundedWriteFinalExecutionPacketPreparedNow: accepted,
  finalExecutionAllowedNow: false,
  boundedWriteFinalExecutionPacket: accepted
    ? buildFinalExecutionPacket(reviewResult.boundedWritePreExecutionReview.attemptId)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_final_operator_go_no_go_no_execution"
    : "keep_mock_and_repair_current_scope_bounded_write_final_execution_packet",
  problems
}));

if (!accepted) process.exit(1);

function validatePreExecutionReviewResult(result) {
  expect(result.status, "ok", "preExecutionReview.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_bounded_write_pre_execution_review_no_execution_ready",
    "preExecutionReview.guardedStatus"
  );
  expect(result.boundedWritePreExecutionReviewPreparedNow, true, "preExecutionReview.boundedWritePreExecutionReviewPreparedNow");
  expectSafeFlags(result, "preExecutionReview");
  if (containsForbiddenPayloadKeys(result)) problems.push("pre-execution review must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("pre-execution review must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope final execution packet input");

  const review = result.boundedWritePreExecutionReview;
  if (!review || typeof review !== "object") {
    problems.push("preExecutionReview.boundedWritePreExecutionReview must be an object");
    return;
  }
  expect(review.reviewMode, "current_scope_bounded_write_pre_execution_review_no_execution", "boundedWritePreExecutionReview.reviewMode");
  if (!review.attemptId || typeof review.attemptId !== "string") problems.push("boundedWritePreExecutionReview.attemptId must be a string");
  expect(review.phase1Universe, "twii_plus_listed_stock_daily_close", "boundedWritePreExecutionReview.phase1Universe");
  expect(review.scope, "twii_plus_listed_stock_daily_close", "boundedWritePreExecutionReview.scope");
  expect(review.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "boundedWritePreExecutionReview.operationKind");
  expect(review.acceptedAuthorizationResponsePresent, true, "boundedWritePreExecutionReview.acceptedAuthorizationResponsePresent");
  expect(review.candidateArtifactPathReadinessRequired, true, "boundedWritePreExecutionReview.candidateArtifactPathReadinessRequired");
  expect(review.aggregateOnlyEvidenceRequired, true, "boundedWritePreExecutionReview.aggregateOnlyEvidenceRequired");
  expect(review.noPayloadBoundaryRequired, true, "boundedWritePreExecutionReview.noPayloadBoundaryRequired");
  expect(review.insertMissingOnlyContractRequired, true, "boundedWritePreExecutionReview.insertMissingOnlyContractRequired");
  expect(review.aggregateReadbackContractRequired, true, "boundedWritePreExecutionReview.aggregateReadbackContractRequired");
  expect(review.rollbackOrQuarantinePlanRequired, true, "boundedWritePreExecutionReview.rollbackOrQuarantinePlanRequired");
  expect(review.finalOperatorGoNoGoRequired, true, "boundedWritePreExecutionReview.finalOperatorGoNoGoRequired");
  expect(review.requiredNextPacket, "current_scope_bounded_write_final_execution_packet_no_execution", "boundedWritePreExecutionReview.requiredNextPacket");
  if (!Array.isArray(review.preExecutionStoplines) || review.preExecutionStoplines.length < 6) {
    problems.push("boundedWritePreExecutionReview.preExecutionStoplines must contain at least 6 items");
  }
  expectSafeFlags(review, "boundedWritePreExecutionReview");
}

function buildFinalExecutionPacket(attemptId) {
  return safePayload({
    packetMode: "current_scope_bounded_write_final_execution_packet_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    requiredFinalDecision: "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT",
    finalGoNoGoAcceptedNow: false,
    candidateArtifactPathReadinessRequired: true,
    aggregateOnlyEvidenceRequired: true,
    noPayloadBoundaryRequired: true,
    insertMissingOnlyContractRequired: true,
    aggregateReadbackContractRequired: true,
    rollbackOrQuarantinePlanRequired: true,
    postRunReviewRequired: true,
    publicRuntimeMustStayMock: true,
    scoreSourceMustStayMock: true,
    explicitExecutionStoplines: [
      "missing_final_operator_go_no_go",
      "candidate_artifact_path_not_ready",
      "row_raw_or_stock_id_payload_present",
      "secret_or_confirmation_value_present",
      "real_promotion_requested",
      "sql_or_write_already_attempted"
    ],
    requiredNextPacket: "current_scope_final_operator_go_no_go_no_execution"
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
