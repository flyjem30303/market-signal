import fs from "node:fs";

const runnerAuthorizationPath = getArg("--runner-authorization");
const problems = [];

if (!runnerAuthorizationPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_write_capable_runner_scaffold_blocked_missing_inputs",
    runnerScaffoldPreparedNow: false,
    runnerExecutableNow: false,
    nextRoute: "provide_runner_authorization_gate_output",
    problems: ["--runner-authorization is required"]
  }));
  process.exit(1);
}

const runnerAuthorization = parseJson(readFile(runnerAuthorizationPath, "runner authorization gate JSON"), runnerAuthorizationPath);

validateRunnerAuthorization(runnerAuthorization);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_write_capable_runner_scaffold_ready_no_execution"
    : "phase_1_current_scope_write_capable_runner_scaffold_blocked_no_execution",
  runnerScaffoldPreparedNow: accepted,
  runnerExecutableNow: false,
  runnerScaffold: accepted ? buildScaffold(runnerAuthorization.attemptId) : null,
  nextRoute: accepted
    ? "await_separate_current_scope_write_runner_execution_authorization_no_execution"
    : "keep_mock_and_repair_runner_scaffold_inputs",
  problems
}));

if (!accepted) process.exit(1);

function validateRunnerAuthorization(result) {
  expect(result.status, "ok", "runnerAuthorization.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_bounded_write_runner_authorization_gate_ready_no_execution",
    "runnerAuthorization.guardedStatus"
  );
  expect(result.runnerAuthorizationAcceptedNow, true, "runnerAuthorization.runnerAuthorizationAcceptedNow");
  expect(result.runnerScaffoldPreparationAllowedNow, true, "runnerAuthorization.runnerScaffoldPreparationAllowedNow");
  expect(result.runnerExecutableNow, false, "runnerAuthorization.runnerExecutableNow");
  expect(result.executionPacketPreparedNow, true, "runnerAuthorization.executionPacketPreparedNow");
  expect(result.operationKindConfirmed, true, "runnerAuthorization.operationKindConfirmed");
  expect(result.runtimeInputsPlanConfirmed, true, "runnerAuthorization.runtimeInputsPlanConfirmed");
  expect(result.stopConditionsConfirmed, true, "runnerAuthorization.stopConditionsConfirmed");
  expect(result.readbackPlanConfirmed, true, "runnerAuthorization.readbackPlanConfirmed");
  expect(result.rollbackPlanConfirmed, true, "runnerAuthorization.rollbackPlanConfirmed");
  expect(result.postRunReviewConfirmed, true, "runnerAuthorization.postRunReviewConfirmed");
  expect(result.abortSwitchPresent, true, "runnerAuthorization.abortSwitchPresent");
  expectSafeFlags(result, "runnerAuthorization");

  if (!result.attemptId || typeof result.attemptId !== "string") {
    problems.push("runnerAuthorization.attemptId must be a string");
  }
  if (containsForbiddenPayloadKeys(result)) {
    problems.push("runner authorization result must not include row/raw/stock-id payload fields");
  }
  if (containsSecretOrConfirmationValueKeys(result)) {
    problems.push("runner authorization result must not include secret/env/confirmation value fields");
  }
  if (containsDeferredSymbols(result)) {
    problems.push("deferred ETF symbols must not be part of current-scope runner scaffold inputs");
  }
}

function buildScaffold(attemptId) {
  return safePayload({
    scaffoldMode: "write_capable_scaffold_no_execution",
    runnerMode: "write_capable_scaffold_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    requiredServerInputs: [
      "server_only_supabase_url_presence",
      "server_only_write_credential_presence",
      "operator_execute_switch_value_not_logged",
      "operator_confirmation_phrase_value_not_logged"
    ],
    requiredRuntimeGuards: [
      "abort_if_any_required_server_input_missing",
      "abort_if_candidate_artifact_scope_mismatch",
      "abort_if_candidate_artifact_contains_row_raw_or_stock_id_payload",
      "abort_if_public_runtime_promotion_requested"
    ],
    requiredDryRunGuards: [
      "dry_run_summary_before_any_future_write",
      "dry_run_reports_counts_only",
      "dry_run_outputs_no_secrets",
      "dry_run_outputs_no_row_payloads"
    ],
    requiredAbortConditions: [
      "missing_runtime_inputs",
      "scope_mismatch",
      "duplicate_or_rejected_rows_present",
      "readback_or_rollback_plan_missing"
    ],
    requiredReadbackReview: [
      "aggregate_count_readback",
      "affected_date_range_readback",
      "duplicate_rejection_summary"
    ],
    requiredRollbackReview: [
      "attempt_id_scoped_rollback_or_noop_record",
      "quarantine_decision",
      "pm_review_before_second_attempt"
    ],
    envValuesReadNow: false,
    secretValuesOutputNow: false,
    confirmationPhraseValueOutputNow: false,
    runnerExecutableNow: false
  });
}

function safePayload(fields) {
  return {
    ...fields,
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
