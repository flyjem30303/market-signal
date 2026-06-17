import fs from "node:fs";

const decisionGatePath = getArg("--decision-gate");
const problems = [];

if (!decisionGatePath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_packet_blocked_missing_decision_gate",
    executionPacketPreparedNow: false,
    nextRoute: "provide_current_scope_bounded_write_execution_decision_gate",
    problems: ["--decision-gate is required"]
  }));
  process.exit(1);
}

const decisionGate = parseJson(readFile(decisionGatePath, "execution decision gate JSON"), decisionGatePath);
const accepted = validateDecisionGate(decisionGate) && problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_bounded_write_execution_packet_ready_no_execution"
    : "phase_1_current_scope_bounded_write_execution_packet_blocked_no_execution",
  executionPacketPreparedNow: accepted,
  executionPacket: accepted ? makeExecutionPacket(decisionGate) : null,
  nextRoute: accepted
    ? "await_separate_current_scope_bounded_write_runner_authorization_no_execution"
    : "keep_mock_and_repair_current_scope_bounded_write_execution_packet",
  problems
}));

if (!accepted) process.exit(1);

function validateDecisionGate(result) {
  expect(result.status, "ok", "decisionGate.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_bounded_write_execution_decision_gate_ready_no_execution",
    "decisionGate.guardedStatus"
  );
  expect(result.executionDecisionAcceptedNow, true, "decisionGate.executionDecisionAcceptedNow");
  expect(result.executionPacketPreparationAllowedNow, true, "decisionGate.executionPacketPreparationAllowedNow");
  expect(result.operatorAuthorizationResponseAcceptedNow, true, "decisionGate.operatorAuthorizationResponseAcceptedNow");
  expect(result.candidateArtifactPathReferencePresent, true, "decisionGate.candidateArtifactPathReferencePresent");
  expect(result.rollbackScopeConfirmed, true, "decisionGate.rollbackScopeConfirmed");
  expect(result.postRunReviewOwnerConfirmed, true, "decisionGate.postRunReviewOwnerConfirmed");
  expect(result.readbackPlanConfirmed, true, "decisionGate.readbackPlanConfirmed");
  expect(result.abortSwitchPresent, true, "decisionGate.abortSwitchPresent");
  expectSafeFlags(result, "decisionGate");
  if (containsForbiddenPayloadKeys(result)) problems.push("decision gate must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("decision gate must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope execution packet");
  return problems.length === 0;
}

function makeExecutionPacket(result) {
  return {
    packetMode: "current_scope_bounded_write_execution_packet_no_execution",
    attemptId: result.attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    candidateArtifactPathReferencePresent: true,
    requiredRuntimeInputs: [
      "server_only_supabase_url_presence",
      "server_only_service_role_or_write_credential_presence",
      "operator_execute_switch_value_not_logged",
      "operator_confirmation_phrase_value_not_logged",
      "current_scope_candidate_artifact_path_reference",
      "dry_run_or_abort_switch_presence"
    ],
    requiredStopConditions: [
      "missing_server_only_runtime_inputs",
      "candidate_artifact_contains_row_raw_or_stock_id_payload",
      "candidate_artifact_scope_mismatch",
      "duplicate_rejected_or_missing_required_field_count_above_zero",
      "readback_plan_missing",
      "rollback_plan_missing",
      "public_runtime_promotion_requested_in_same_step"
    ],
    requiredReadbackPlan: [
      "aggregate_count_readback_after_attempt",
      "affected_date_range_readback_after_attempt",
      "duplicate_rejection_summary_after_attempt",
      "no_secret_no_row_payload_post_run_summary"
    ],
    requiredRollbackPlan: [
      "quarantine_or_rollback_decision_after_attempt",
      "attempt_id_scoped_reversal_or_noop_record",
      "operator_review_required_before_any_second_attempt"
    ],
    requiredPostRunReview: [
      "pm_reviews_aggregate_counts_only",
      "public_runtime_source_stays_mock_until_separate_promotion_gate",
      "score_source_stays_mock_until_separate_promotion_gate",
      "daily_prices_mutation_summary_required_if_future_attempt_runs"
    ],
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
    scoreSource: "mock"
  };
}

function safePayload(fields) {
  return {
    ...fields,
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
    scoreSource: "mock"
  };
}

function expectSafeFlags(value, label) {
  if (!value || typeof value !== "object") return;
  for (const [field, expected] of [
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

function emit(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
