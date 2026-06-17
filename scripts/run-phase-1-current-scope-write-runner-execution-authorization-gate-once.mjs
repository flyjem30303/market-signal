import fs from "node:fs";

const runnerScaffoldPath = getArg("--runner-scaffold");
const runnerExecutionAuthorizationPath = getArg("--runner-execution-authorization");
const problems = [];

if (!runnerScaffoldPath || !runnerExecutionAuthorizationPath) {
  emit(safePayload({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_write_runner_execution_authorization_gate_blocked_missing_inputs",
    runnerExecutionAuthorizationAcceptedNow: false,
    futureExecutionAttemptPreparedNow: false,
    runnerExecutableNow: false,
    nextRoute: "provide_runner_scaffold_and_runner_execution_authorization",
    problems: [
      ...(!runnerScaffoldPath ? ["--runner-scaffold is required"] : []),
      ...(!runnerExecutionAuthorizationPath ? ["--runner-execution-authorization is required"] : [])
    ]
  }));
  process.exit(1);
}

const runnerScaffoldResult = parseJson(readFile(runnerScaffoldPath, "runner scaffold JSON"), runnerScaffoldPath);
const runnerExecutionAuthorization = parseJson(readFile(runnerExecutionAuthorizationPath, "runner execution authorization JSON"), runnerExecutionAuthorizationPath);

validateRunnerScaffoldResult(runnerScaffoldResult);
validateRunnerExecutionAuthorization(runnerExecutionAuthorization, runnerScaffoldResult);

const accepted = problems.length === 0;

emit(safePayload({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_write_runner_execution_authorization_gate_ready_no_execution"
    : "phase_1_current_scope_write_runner_execution_authorization_gate_blocked_no_execution",
  runnerExecutionAuthorizationAcceptedNow: accepted,
  futureExecutionAttemptPreparedNow: accepted,
  runnerExecutableNow: false,
  futureExecutionAttempt: accepted ? buildFutureExecutionAttempt(runnerScaffoldResult.runnerScaffold.attemptId) : null,
  nextRoute: accepted
    ? "prepare_current_scope_write_runner_dry_run_packet_no_execution"
    : "keep_mock_and_repair_write_runner_execution_authorization",
  problems
}));

if (!accepted) process.exit(1);

function validateRunnerScaffoldResult(result) {
  expect(result.status, "ok", "runnerScaffoldResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_write_capable_runner_scaffold_ready_no_execution",
    "runnerScaffoldResult.guardedStatus"
  );
  expect(result.runnerScaffoldPreparedNow, true, "runnerScaffoldResult.runnerScaffoldPreparedNow");
  expectSafeFlags(result, "runnerScaffoldResult");
  if (containsForbiddenPayloadKeys(result)) problems.push("runner scaffold result must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(result)) problems.push("runner scaffold result must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope runner scaffold result");

  const scaffold = result.runnerScaffold;
  if (!scaffold || typeof scaffold !== "object") {
    problems.push("runnerScaffoldResult.runnerScaffold must be an object");
    return;
  }
  expect(scaffold.scaffoldMode, "write_capable_scaffold_no_execution", "runnerScaffold.scaffoldMode");
  expect(scaffold.runnerMode, "write_capable_scaffold_no_execution", "runnerScaffold.runnerMode");
  expect(scaffold.phase1Universe, "twii_plus_listed_stock_daily_close", "runnerScaffold.phase1Universe");
  expect(scaffold.scope, "twii_plus_listed_stock_daily_close", "runnerScaffold.scope");
  expect(scaffold.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "runnerScaffold.operationKind");
  if (!scaffold.attemptId || typeof scaffold.attemptId !== "string") problems.push("runnerScaffold.attemptId must be a string");
  for (const field of [
    "requiredServerInputs",
    "requiredRuntimeGuards",
    "requiredDryRunGuards",
    "requiredAbortConditions",
    "requiredReadbackReview",
    "requiredRollbackReview"
  ]) {
    if (!Array.isArray(scaffold[field]) || scaffold[field].length < 3) problems.push(`runnerScaffold.${field} must contain at least 3 items`);
  }
  expectSafeFlags(scaffold, "runnerScaffold");
}

function validateRunnerExecutionAuthorization(authorization, scaffoldResult) {
  if (containsForbiddenPayloadKeys(authorization)) problems.push("runner execution authorization must not include row/raw/stock-id payload fields");
  if (containsSecretOrConfirmationValueKeys(authorization)) problems.push("runner execution authorization must not include secret/env/confirmation value fields");
  if (containsDeferredSymbols(authorization)) problems.push("deferred ETF symbols must not be part of current-scope runner execution authorization");
  expectSafeFlags(authorization, "runnerExecutionAuthorization");
  if (authorization.runnerExecutableNow === true) problems.push("runner execution authorization must not set runnerExecutableNow=true");

  expect(
    authorization.runnerExecutionAuthorizationDecision,
    "APPROVE_PREPARE_ONE_BOUNDED_WRITE_RUNNER_EXECUTION_ATTEMPT",
    "runnerExecutionAuthorization.runnerExecutionAuthorizationDecision"
  );
  expect(authorization.attemptId, scaffoldResult.runnerScaffold?.attemptId, "runnerExecutionAuthorization.attemptId");
  expect(authorization.runnerScaffoldPreparedNow, true, "runnerExecutionAuthorization.runnerScaffoldPreparedNow");
  expect(authorization.operationKindConfirmed, true, "runnerExecutionAuthorization.operationKindConfirmed");
  expect(authorization.runtimeGuardsConfirmed, true, "runnerExecutionAuthorization.runtimeGuardsConfirmed");
  expect(authorization.dryRunGuardsConfirmed, true, "runnerExecutionAuthorization.dryRunGuardsConfirmed");
  expect(authorization.abortConditionsConfirmed, true, "runnerExecutionAuthorization.abortConditionsConfirmed");
  expect(authorization.readbackReviewConfirmed, true, "runnerExecutionAuthorization.readbackReviewConfirmed");
  expect(authorization.rollbackReviewConfirmed, true, "runnerExecutionAuthorization.rollbackReviewConfirmed");
  expect(authorization.postRunReviewConfirmed, true, "runnerExecutionAuthorization.postRunReviewConfirmed");
  expect(authorization.publicRuntimeStaysMockConfirmed, true, "runnerExecutionAuthorization.publicRuntimeStaysMockConfirmed");
  expect(authorization.scoreSourceStaysMockConfirmed, true, "runnerExecutionAuthorization.scoreSourceStaysMockConfirmed");
}

function buildFutureExecutionAttempt(attemptId) {
  return safePayload({
    attemptMode: "one_bounded_write_runner_execution_attempt_no_execution",
    attemptId,
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    runnerScaffoldAcceptedNow: true,
    runnerExecutionAuthorizationRecordedNow: true,
    requiredNextPacket: "current_scope_write_runner_dry_run_packet_no_execution",
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
