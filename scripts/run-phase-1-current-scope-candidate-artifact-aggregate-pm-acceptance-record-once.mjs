import fs from "node:fs";

const aggregateResultPath = getArg("--aggregate-result");
const pmDecision = getArg("--pm-decision");
const problems = [];

if (!aggregateResultPath || !pmDecision) {
  emit({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_blocked_missing_inputs",
    pmDecision: pmDecision ?? null,
    pmAcceptanceRecordedNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "provide_aggregate_result_and_explicit_pm_decision",
    problems: [
      !aggregateResultPath ? "--aggregate-result is required" : null,
      !pmDecision ? "--pm-decision is required" : null
    ].filter(Boolean)
  });
  process.exit(1);
}

const aggregateResult = parseJson(readFile(aggregateResultPath, "aggregate result JSON"), aggregateResultPath);
const accepted = problems.length === 0 && validatePmDecision(pmDecision) && validateAggregateResult(aggregateResult);

emit({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_accepted_no_rows"
    : "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_blocked_no_rows",
  aggregateResultPath,
  pmDecision,
  pmAcceptanceRecordedNow: accepted,
  artifactId: accepted ? aggregateResult.artifactId : null,
  phase1Universe: accepted ? aggregateResult.phase1Universe : null,
  scope: accepted ? aggregateResult.scope : null,
  coverageWindowSessions: accepted ? aggregateResult.coverageWindowSessions : null,
  aggregateRowCount: accepted ? aggregateResult.aggregateRowCount : null,
  symbolsCoveredCount: accepted ? aggregateResult.symbolsCoveredCount : null,
  dateBounds: accepted ? aggregateResult.dateBounds : null,
  candidateArtifactContentOutputNow: false,
  candidateRowsAcceptedNow: false,
  writeGateOpenedNow: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  nextRoute: accepted
    ? "prepare_candidate_artifact_bounded_write_authorization_preflight_no_execution"
    : "keep_mock_and_request_pm_or_aggregate_repair",
  problems
});

if (!accepted) process.exit(1);

function validatePmDecision(decision) {
  if (decision !== "accepted") {
    problems.push("pmDecision must be accepted for this record gate to proceed");
  }
  return problems.length === 0;
}

function validateAggregateResult(result) {
  expect(result.status, "ok", "aggregateResult.status");
  expect(result.guardedStatus, "phase_1_current_scope_candidate_artifact_aggregate_gate_accepted_no_rows", "aggregateResult.guardedStatus");
  expect(result.candidateArtifactAggregateAcceptedNow, true, "aggregateResult.candidateArtifactAggregateAcceptedNow");
  expect(result.phase1Universe, "twii_plus_listed_stock_daily_close", "aggregateResult.phase1Universe");
  expect(result.scope, "twii_plus_listed_stock_daily_close", "aggregateResult.scope");
  expect(result.candidateArtifactContentOutputNow, false, "aggregateResult.candidateArtifactContentOutputNow");
  expect(result.candidateRowsAcceptedNow, false, "aggregateResult.candidateRowsAcceptedNow");
  expect(result.writeGateOpenedNow, false, "aggregateResult.writeGateOpenedNow");
  expect(result.publicDataSource, "mock", "aggregateResult.publicDataSource");
  expect(result.scoreSource, "mock", "aggregateResult.scoreSource");

  for (const [field, value] of [
    ["coverageWindowSessions", result.coverageWindowSessions],
    ["aggregateRowCount", result.aggregateRowCount],
    ["symbolsCoveredCount", result.symbolsCoveredCount]
  ]) {
    if (!Number.isFinite(value) || value <= 0) problems.push(`aggregateResult.${field} must be a positive number`);
  }
  if (Number.isFinite(result.aggregateRowCount) && Number.isFinite(result.symbolsCoveredCount)) {
    if (result.aggregateRowCount < result.symbolsCoveredCount) {
      problems.push("aggregateResult.aggregateRowCount must be greater than or equal to aggregateResult.symbolsCoveredCount");
    }
  }

  if (!result.dateBounds || typeof result.dateBounds !== "object") {
    problems.push("aggregateResult.dateBounds must be an object");
  } else {
    for (const field of ["start", "end"]) {
      const value = result.dateBounds[field];
      if (typeof value !== "string" || value.trim() === "" || value === "EXAMPLE_ONLY") {
        problems.push(`aggregateResult.dateBounds.${field} must be present and not EXAMPLE_ONLY`);
      }
    }
  }

  for (const field of ["duplicateCount", "rejectedCount", "missingRequiredFieldCount", "forbiddenFieldCount"]) {
    if (result[field] !== 0) problems.push(`aggregateResult.${field} must be 0`);
  }
  if (containsForbiddenPayloadKeys(result)) problems.push("aggregate result must not include row/raw/stock-id payload fields");
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope aggregate result");
  return problems.length === 0;
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
