import fs from "node:fs";

const intakePath = getArg("--final-go-response-intake");
const problems = [];

if (!intakePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_blocked_missing_inputs",
    actualExecutionPacketPreparedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    nextRoute: "provide_current_scope_actual_final_go_response_intake",
    problems: ["--final-go-response-intake is required"]
  }));
  process.exit(1);
}

const intake = parseJson(readFile(intakePath, "actual bounded write final go response intake JSON"), intakePath);
const responseIntake = validateFinalGoResponseIntake(intake);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_blocked_no_execution",
  actualExecutionPacketPreparedNow: accepted,
  finalGoResponseAcceptedNow: accepted,
  finalExecutionAllowedNow: false,
  actualWriteAttemptAllowedNow: false,
  actualBoundedWriteAttemptExecutionPacket: accepted
    ? buildActualExecutionPacket(responseIntake)
    : null,
  nextRoute: accepted
    ? "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution"
    : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_execution_packet",
  problems
}));

if (!accepted) process.exit(1);

function validateFinalGoResponseIntake(input) {
  expect(input.status, "ok", "finalGoResponseIntake.status");
  expect(
    input.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_final_go_response_intake_no_execution_ready",
    "finalGoResponseIntake.guardedStatus"
  );
  expect(input.finalGoResponseAcceptedNow, true, "finalGoResponseIntake.finalGoResponseAcceptedNow");
  expect(input.finalOperatorGoNoGoAcceptedNow, true, "finalGoResponseIntake.finalOperatorGoNoGoAcceptedNow");
  expect(input.finalExecutionAllowedNow, false, "finalGoResponseIntake.finalExecutionAllowedNow");
  expect(input.actualWriteAttemptAllowedNow, false, "finalGoResponseIntake.actualWriteAttemptAllowedNow");
  expectSafeFlags(input, "finalGoResponseIntake");
  if (containsForbiddenPayloadKeys(input)) problems.push("final go response intake must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(input)) problems.push("final go response intake must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(input)) problems.push("deferred ETF symbols must not be part of current-scope actual execution packet input");

  const responseIntake = input.actualBoundedWriteAttemptFinalGoResponseIntake;
  if (!responseIntake || typeof responseIntake !== "object") {
    problems.push("finalGoResponseIntake.actualBoundedWriteAttemptFinalGoResponseIntake must be an object");
    return {};
  }

  expect(responseIntake.responseMode, "current_scope_actual_bounded_write_attempt_final_go_response_no_execution", "actualBoundedWriteAttemptFinalGoResponseIntake.responseMode");
  expect(responseIntake.acceptedFinalGoDecision, "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "actualBoundedWriteAttemptFinalGoResponseIntake.acceptedFinalGoDecision");
  if (!responseIntake.attemptId || typeof responseIntake.attemptId !== "string") problems.push("actualBoundedWriteAttemptFinalGoResponseIntake.attemptId must be a string");
  expect(responseIntake.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalGoResponseIntake.phase1Universe");
  expect(responseIntake.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalGoResponseIntake.scope");
  expect(responseIntake.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptFinalGoResponseIntake.operationKind");
  expect(responseIntake.finalGoResponseAcceptedNow, true, "actualBoundedWriteAttemptFinalGoResponseIntake.finalGoResponseAcceptedNow");
  expect(responseIntake.finalOperatorGoNoGoAcceptedNow, true, "actualBoundedWriteAttemptFinalGoResponseIntake.finalOperatorGoNoGoAcceptedNow");
  expect(responseIntake.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptFinalGoResponseIntake.finalExecutionAllowedNow");
  expect(responseIntake.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptFinalGoResponseIntake.actualWriteAttemptAllowedNow");
  expect(responseIntake.actualWriteAttemptStillRequiresSeparateExecutionPacket, true, "actualBoundedWriteAttemptFinalGoResponseIntake.actualWriteAttemptStillRequiresSeparateExecutionPacket");
  expect(responseIntake.requiredNextPacket, "current_scope_actual_bounded_write_attempt_execution_packet_no_execution", "actualBoundedWriteAttemptFinalGoResponseIntake.requiredNextPacket");
  expectSafeFlags(responseIntake, "actualBoundedWriteAttemptFinalGoResponseIntake");
  return responseIntake;
}

function buildActualExecutionPacket(responseIntake) {
  return safePayload({
    packetMode: "current_scope_actual_bounded_write_attempt_execution_packet_no_execution",
    attemptId: responseIntake.attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    acceptedFinalGoDecision: "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
    finalGoResponseAcceptedNow: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    requiredNextPacket: "current_scope_actual_bounded_write_attempt_execution_authorization_no_execution",
    requiredRuntimeInputs: [
      "server_only_supabase_url_presence",
      "server_only_write_credential_presence",
      "operator_execute_switch_value_not_logged",
      "operator_confirmation_phrase_value_not_logged",
      "current_scope_candidate_artifact_path_reference",
      "abort_switch_presence"
    ],
    requiredStopConditions: [
      "missing_separate_execution_authorization",
      "missing_server_only_runtime_inputs",
      "candidate_artifact_contains_row_raw_or_stock_id_payload",
      "candidate_artifact_scope_mismatch",
      "duplicate_rejected_or_missing_required_field_count_above_zero",
      "readback_plan_missing",
      "rollback_plan_missing",
      "public_runtime_promotion_requested_in_same_step"
    ],
    requiredReadbackPlan: [
      "aggregate_count_readback_after_future_attempt",
      "affected_date_range_readback_after_future_attempt",
      "duplicate_rejection_summary_after_future_attempt",
      "no_secret_no_row_payload_post_run_summary"
    ],
    requiredRollbackPlan: [
      "quarantine_or_rollback_decision_after_future_attempt",
      "attempt_id_scoped_reversal_or_noop_record",
      "operator_review_required_before_any_second_attempt"
    ],
    requiredPostRunReview: [
      "pm_reviews_aggregate_counts_only",
      "public_runtime_source_stays_mock_until_separate_promotion_gate",
      "score_source_stays_mock_until_separate_promotion_gate",
      "daily_prices_mutation_summary_required_if_future_attempt_runs"
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
