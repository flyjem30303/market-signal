import fs from "node:fs";

const dryRunAuthorizationPath = getArg("--dry-run-authorization");
const problems = [];

if (!dryRunAuthorizationPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_dry_run_review_packet_blocked_missing_inputs",
    dryRunReviewPacketPreparedNow: false,
    dryRunExecutedNow: false,
    nextRoute: "provide_dry_run_execution_authorization_gate_output",
    problems: ["--dry-run-authorization is required"]
  }));
  process.exit(1);
}

const authorizationResult = parseJson(
  readFile(dryRunAuthorizationPath, "dry-run execution authorization gate JSON"),
  dryRunAuthorizationPath
);

validateAuthorizationResult(authorizationResult);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_dry_run_review_packet_ready_no_execution"
    : "phase_1_current_scope_dry_run_review_packet_blocked_no_execution",
  dryRunReviewPacketPreparedNow: accepted,
  dryRunExecutedNow: false,
  dryRunReviewPacket: accepted ? buildReviewPacket(authorizationResult.futureDryRunReview.attemptId) : null,
  nextRoute: accepted
    ? "await_separate_current_scope_dry_run_review_acceptance_no_execution"
    : "keep_mock_and_repair_dry_run_review_packet_inputs",
  problems
}));

if (!accepted) process.exit(1);

function validateAuthorizationResult(result) {
  expect(result.status, "ok", "authorizationResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_dry_run_execution_authorization_gate_ready_no_execution",
    "authorizationResult.guardedStatus"
  );
  expect(result.dryRunExecutionAuthorizationAcceptedNow, true, "authorizationResult.dryRunExecutionAuthorizationAcceptedNow");
  expect(result.futureDryRunReviewPreparedNow, true, "authorizationResult.futureDryRunReviewPreparedNow");
  expectSafeFlags(result, "authorizationResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("authorization result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("authorization result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope dry-run review packet input");

  const review = result.futureDryRunReview;
  if (!review || typeof review !== "object") {
    problems.push("authorizationResult.futureDryRunReview must be an object");
    return;
  }
  expect(review.reviewMode, "current_scope_dry_run_execution_review_no_execution", "futureDryRunReview.reviewMode");
  expect(review.phase1Universe, "twii_plus_listed_stock_daily_close", "futureDryRunReview.phase1Universe");
  expect(review.scope, "twii_plus_listed_stock_daily_close", "futureDryRunReview.scope");
  expect(review.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "futureDryRunReview.operationKind");
  expect(review.requiredNextPacket, "current_scope_dry_run_review_packet_no_execution", "futureDryRunReview.requiredNextPacket");
  if (!review.attemptId || typeof review.attemptId !== "string") problems.push("futureDryRunReview.attemptId must be a string");
  expectSafeFlags(review, "futureDryRunReview");
}

function buildReviewPacket(attemptId) {
  return safePayload({
    packetMode: "current_scope_dry_run_review_packet_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    requiredReviewSections: [
      "scope_and_attempt_summary",
      "aggregate_evidence_summary",
      "failure_or_abort_summary",
      "no_payload_no_write_boundary_summary",
      "pm_decision_options"
    ],
    requiredAggregateEvidence: [
      "candidate_row_count_summary_only",
      "duplicate_row_count_summary_only",
      "rejected_row_count_summary_only",
      "affected_date_range_summary_only"
    ],
    requiredFailureEvidence: [
      "missing_required_input_summary",
      "scope_mismatch_summary",
      "abort_condition_summary"
    ],
    requiredNoPayloadEvidence: [
      "raw_payload_absent",
      "row_payload_absent",
      "stock_id_payload_absent",
      "secret_and_confirmation_values_absent"
    ],
    requiredDecisionOptions: [
      "accept_dry_run_review_and_prepare_bounded_write_execution_review",
      "reject_and_repair_dry_run_inputs",
      "hold_mock_and_request_pm_review"
    ],
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
