import fs from "node:fs";

const runnerExecutionAuthorizationPath = getArg("--runner-execution-authorization");
const problems = [];

if (!runnerExecutionAuthorizationPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_write_runner_dry_run_packet_blocked_missing_inputs",
    dryRunPacketPreparedNow: false,
    dryRunExecutedNow: false,
    runnerExecutableNow: false,
    nextRoute: "provide_runner_execution_authorization_gate_output",
    problems: ["--runner-execution-authorization is required"]
  }));
  process.exit(1);
}

const authorizationResult = parseJson(
  readFile(runnerExecutionAuthorizationPath, "runner execution authorization gate JSON"),
  runnerExecutionAuthorizationPath
);

validateAuthorizationResult(authorizationResult);
const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_write_runner_dry_run_packet_ready_no_execution"
    : "phase_1_current_scope_write_runner_dry_run_packet_blocked_no_execution",
  dryRunPacketPreparedNow: accepted,
  dryRunExecutedNow: false,
  runnerExecutableNow: false,
  dryRunPacket: accepted ? buildDryRunPacket(authorizationResult.futureExecutionAttempt.attemptId) : null,
  nextRoute: accepted
    ? "await_separate_current_scope_dry_run_execution_authorization_no_execution"
    : "keep_mock_and_repair_write_runner_dry_run_packet_inputs",
  problems
}));

if (!accepted) process.exit(1);

function validateAuthorizationResult(result) {
  expect(result.status, "ok", "authorizationResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_write_runner_execution_authorization_gate_ready_no_execution",
    "authorizationResult.guardedStatus"
  );
  expect(result.runnerExecutionAuthorizationAcceptedNow, true, "authorizationResult.runnerExecutionAuthorizationAcceptedNow");
  expect(result.futureExecutionAttemptPreparedNow, true, "authorizationResult.futureExecutionAttemptPreparedNow");
  expectSafeFlags(result, "authorizationResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("authorization result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("authorization result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope dry-run packet input");

  const attempt = result.futureExecutionAttempt;
  if (!attempt || typeof attempt !== "object") {
    problems.push("authorizationResult.futureExecutionAttempt must be an object");
    return;
  }
  expect(attempt.attemptMode, "one_bounded_write_runner_execution_attempt_no_execution", "futureExecutionAttempt.attemptMode");
  expect(attempt.phase1Universe, "twii_plus_listed_stock_daily_close", "futureExecutionAttempt.phase1Universe");
  expect(attempt.scope, "twii_plus_listed_stock_daily_close", "futureExecutionAttempt.scope");
  expect(attempt.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "futureExecutionAttempt.operationKind");
  expect(attempt.requiredNextPacket, "current_scope_write_runner_dry_run_packet_no_execution", "futureExecutionAttempt.requiredNextPacket");
  if (!attempt.attemptId || typeof attempt.attemptId !== "string") problems.push("futureExecutionAttempt.attemptId must be a string");
  expectSafeFlags(attempt, "futureExecutionAttempt");
}

function buildDryRunPacket(attemptId) {
  return safePayload({
    packetMode: "current_scope_write_runner_dry_run_packet_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    requiredAggregateChecks: [
      "candidate_row_count_matches_expected_missing_rows",
      "duplicate_row_count_is_zero",
      "rejected_row_count_is_zero",
      "affected_date_range_is_summary_only"
    ],
    requiredInputPresenceChecks: [
      "candidate_artifact_path_reference_present",
      "attempt_id_present",
      "server_runtime_inputs_not_read_in_packet_phase"
    ],
    requiredNoPayloadChecks: [
      "no_raw_payload_output",
      "no_row_payload_output",
      "no_stock_id_payload_output",
      "no_secret_or_confirmation_value_output"
    ],
    requiredNoWriteChecks: [
      "no_sql_execution",
      "no_supabase_connection",
      "no_daily_prices_mutation",
      "public_and_score_sources_stay_mock"
    ],
    requiredReviewOutputs: [
      "aggregate_counts_only",
      "scope_confirmation",
      "next_authorization_route"
    ],
    dryRunExecutedNow: false,
    envValuesReadNow: false,
    secretValuesOutputNow: false,
    confirmationPhraseValueOutputNow: false,
    runnerExecutableNow: false
  });
}

function safePayload(fields) {
  return {
    ...fields,
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
