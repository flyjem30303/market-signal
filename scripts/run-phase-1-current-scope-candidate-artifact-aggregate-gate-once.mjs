import fs from "node:fs";

const headerResultPath = getArg("--header-result");
const candidateArtifactPath = getArg("--candidate-artifact");
const problems = [];

if (!headerResultPath || !candidateArtifactPath) {
  emit({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_aggregate_gate_blocked_missing_inputs",
    candidateArtifactAggregateAcceptedNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "provide_header_result_and_candidate_artifact_paths",
    problems: [
      !headerResultPath ? "--header-result is required" : null,
      !candidateArtifactPath ? "--candidate-artifact is required" : null
    ].filter(Boolean)
  });
  process.exit(1);
}

const headerResult = parseJson(readFile(headerResultPath, "header result JSON"), headerResultPath);
const artifact = parseJson(readFile(candidateArtifactPath, "candidate artifact JSON"), candidateArtifactPath);
const accepted = problems.length === 0 && validateHeaderResult(headerResult) && validateAggregateContract(artifact, headerResult);

emit({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_candidate_artifact_aggregate_gate_accepted_no_rows"
    : "phase_1_current_scope_candidate_artifact_aggregate_gate_blocked_no_rows",
  headerResultPath,
  candidateArtifactAggregateAcceptedNow: accepted,
  artifactId: accepted ? artifact.artifactId : null,
  phase1Universe: accepted ? artifact.phase1Universe : null,
  scope: accepted ? artifact.scope : null,
  coverageWindowSessions: accepted ? artifact.coverageWindowSessions : null,
  aggregateRowCount: accepted ? artifact.aggregateRowCount : null,
  symbolsCoveredCount: accepted ? artifact.symbolsCoveredCount : null,
  dateBounds: accepted ? artifact.dateBounds : null,
  duplicateCount: accepted ? artifact.duplicateCount : null,
  rejectedCount: accepted ? artifact.rejectedCount : null,
  missingRequiredFieldCount: accepted ? artifact.missingRequiredFieldCount : null,
  forbiddenFieldCount: accepted ? artifact.forbiddenFieldCount : null,
  candidateArtifactContentOutputNow: false,
  candidateRowsAcceptedNow: false,
  writeGateOpenedNow: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  nextRoute: accepted
    ? "prepare_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads"
    : "keep_mock_and_request_aggregate_contract_repair",
  problems
});

if (!accepted) process.exit(1);

function validateHeaderResult(result) {
  expect(result.status, "ok", "headerResult.status");
  expect(result.guardedStatus, "phase_1_current_scope_candidate_artifact_header_gate_accepted_no_rows", "headerResult.guardedStatus");
  expect(result.candidateArtifactHeaderAcceptedNow, true, "headerResult.candidateArtifactHeaderAcceptedNow");
  expect(result.candidateArtifactContentOutputNow, false, "headerResult.candidateArtifactContentOutputNow");
  expect(result.candidateRowsAcceptedNow, false, "headerResult.candidateRowsAcceptedNow");
  expect(result.writeGateOpenedNow, false, "headerResult.writeGateOpenedNow");
  expect(result.publicDataSource, "mock", "headerResult.publicDataSource");
  expect(result.scoreSource, "mock", "headerResult.scoreSource");
  return problems.length === 0;
}

function validateAggregateContract(artifact, headerResult) {
  expect(artifact.phase1Universe, "twii_plus_listed_stock_daily_close", "artifact.phase1Universe");
  expect(artifact.scope, "twii_plus_listed_stock_daily_close", "artifact.scope");
  expect(artifact.sanitizedAggregateOnly, true, "artifact.sanitizedAggregateOnly");
  expect(artifact.rawPayloadIncluded, false, "artifact.rawPayloadIncluded");
  expect(artifact.rowPayloadIncluded, false, "artifact.rowPayloadIncluded");
  expect(artifact.stockIdPayloadIncluded, false, "artifact.stockIdPayloadIncluded");
  expect(artifact.secretsIncluded, false, "artifact.secretsIncluded");

  if (artifact.artifactId !== headerResult.artifactId) problems.push("artifact.artifactId must match headerResult.artifactId");
  if (artifact.phase1Universe !== headerResult.phase1Universe) problems.push("artifact.phase1Universe must match headerResult.phase1Universe");
  if (artifact.scope !== headerResult.scope) problems.push("artifact.scope must match headerResult.scope");
  if (artifact.aggregateRowCount !== headerResult.aggregateRowCount) problems.push("artifact.aggregateRowCount must match headerResult.aggregateRowCount");
  if (artifact.symbolsCoveredCount !== headerResult.symbolsCoveredCount) problems.push("artifact.symbolsCoveredCount must match headerResult.symbolsCoveredCount");

  for (const [field, value] of [
    ["coverageWindowSessions", artifact.coverageWindowSessions],
    ["aggregateRowCount", artifact.aggregateRowCount],
    ["symbolsCoveredCount", artifact.symbolsCoveredCount]
  ]) {
    if (!Number.isFinite(value) || value <= 0) problems.push(`artifact.${field} must be a positive number`);
  }
  if (Number.isFinite(artifact.aggregateRowCount) && Number.isFinite(artifact.symbolsCoveredCount)) {
    if (artifact.aggregateRowCount < artifact.symbolsCoveredCount) {
      problems.push("artifact.aggregateRowCount must be greater than or equal to artifact.symbolsCoveredCount");
    }
  }

  if (!artifact.dateBounds || typeof artifact.dateBounds !== "object") {
    problems.push("artifact.dateBounds must be an object");
  } else {
    for (const field of ["start", "end"]) {
      const value = artifact.dateBounds[field];
      if (typeof value !== "string" || value.trim() === "" || value === "EXAMPLE_ONLY") {
        problems.push(`artifact.dateBounds.${field} must be present and not EXAMPLE_ONLY`);
      }
    }
  }

  for (const field of ["duplicateCount", "rejectedCount", "missingRequiredFieldCount", "forbiddenFieldCount"]) {
    if (artifact[field] !== 0) problems.push(`artifact.${field} must be 0`);
  }

  if (artifact.safetyFlags?.publicDataSource !== "mock") problems.push("artifact.safetyFlags.publicDataSource must remain mock");
  if (artifact.safetyFlags?.scoreSource !== "mock") problems.push("artifact.safetyFlags.scoreSource must remain mock");
  for (const [field, expected] of Object.entries({
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false
  })) {
    if (artifact.safetyFlags?.[field] !== expected) problems.push(`artifact.safetyFlags.${field} must be ${expected}`);
  }

  if (containsForbiddenPayloadKeys(artifact)) problems.push("artifact must not include row/raw/stock-id payload fields");
  if (containsDeferredSymbols(artifact)) problems.push("deferred ETF symbols must not be part of current-scope artifact");
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
