import fs from "node:fs";

const pathResultPath = getArg("--path-result");
const problems = [];

if (!pathResultPath) {
  emit({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_header_gate_blocked_missing_path_result",
    candidateArtifactHeaderAcceptedNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "provide_current_scope_candidate_artifact_path_shape_result_json",
    problems: ["--path-result is required"]
  });
  process.exit(1);
}

const pathResult = parseJson(readFile(pathResultPath, "path result JSON"), pathResultPath);
const candidatePath = validatePathResult(pathResult) ? pathResult.candidateArtifactPath : null;
const artifact = candidatePath ? parseJson(readFile(candidatePath, "candidate artifact JSON"), candidatePath) : {};
const accepted = problems.length === 0 && validateArtifactHeader(artifact);

emit({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_candidate_artifact_header_gate_accepted_no_rows"
    : "phase_1_current_scope_candidate_artifact_header_gate_blocked_no_rows",
  pathResultPath,
  candidateArtifactHeaderAcceptedNow: accepted,
  artifactId: accepted ? artifact.artifactId : null,
  phase1Universe: accepted ? artifact.phase1Universe : null,
  scope: accepted ? artifact.scope : null,
  aggregateRowCount: accepted ? artifact.aggregateRowCount : null,
  symbolsCoveredCount: accepted ? artifact.symbolsCoveredCount : null,
  candidateArtifactContentOutputNow: false,
  candidateRowsAcceptedNow: false,
  writeGateOpenedNow: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  nextRoute: accepted
    ? "prepare_candidate_artifact_aggregate_contract_gate_no_row_payloads"
    : "keep_mock_and_request_repair",
  problems
});

if (!accepted) process.exit(1);

function validatePathResult(result) {
  expect(result.status, "ok", "pathResult.status");
  expect(result.guardedStatus, "phase_1_current_scope_candidate_artifact_path_shape_gate_ready_no_row_payloads", "pathResult.guardedStatus");
  expect(result.candidateArtifactPathShapeReadyNow, true, "pathResult.candidateArtifactPathShapeReadyNow");
  expect(result.candidateArtifactReadNow, false, "pathResult.candidateArtifactReadNow");
  expect(result.candidateRowsAcceptedNow, false, "pathResult.candidateRowsAcceptedNow");
  expect(result.writeGateOpenedNow, false, "pathResult.writeGateOpenedNow");
  expect(result.publicDataSource, "mock", "pathResult.publicDataSource");
  expect(result.scoreSource, "mock", "pathResult.scoreSource");
  if (typeof result.candidateArtifactPath !== "string" || result.candidateArtifactPath.trim() === "") {
    problems.push("pathResult.candidateArtifactPath must be a non-empty string");
  }
  return problems.length === 0;
}

function validateArtifactHeader(artifact) {
  for (const field of [
    "artifactId",
    "phase1Universe",
    "scope",
    "sourceLane",
    "coverageWindowSessions",
    "aggregateRowCount",
    "symbolsCoveredCount",
    "dateBounds",
    "duplicateCount",
    "rejectedCount",
    "missingRequiredFieldCount",
    "forbiddenFieldCount",
    "sanitizedAggregateOnly",
    "rawPayloadIncluded",
    "rowPayloadIncluded",
    "stockIdPayloadIncluded",
    "secretsIncluded",
    "safetyFlags"
  ]) {
    if (!(field in artifact)) problems.push(`artifact.${field} is required`);
  }
  expect(artifact.phase1Universe, "twii_plus_listed_stock_daily_close", "artifact.phase1Universe");
  expect(artifact.scope, "twii_plus_listed_stock_daily_close", "artifact.scope");
  expect(artifact.sanitizedAggregateOnly, true, "artifact.sanitizedAggregateOnly");
  expect(artifact.rawPayloadIncluded, false, "artifact.rawPayloadIncluded");
  expect(artifact.rowPayloadIncluded, false, "artifact.rowPayloadIncluded");
  expect(artifact.stockIdPayloadIncluded, false, "artifact.stockIdPayloadIncluded");
  expect(artifact.secretsIncluded, false, "artifact.secretsIncluded");
  if (!artifact.dateBounds || typeof artifact.dateBounds !== "object") problems.push("artifact.dateBounds must be an object");
  if (typeof artifact.aggregateRowCount !== "number") problems.push("artifact.aggregateRowCount must be a number");
  if (typeof artifact.symbolsCoveredCount !== "number") problems.push("artifact.symbolsCoveredCount must be a number");
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
