import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-request-no-fetch.json";
const sourcePathShapeGatePath =
  "data/evidence-intake/phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads.json";
const docPath = "docs/PHASE_1_ETF_SANITIZED_CANDIDATE_ARTIFACT_PATH_REQUEST_NO_FETCH.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = read(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const sourceGate = parseJson(read(sourcePathShapeGatePath), sourcePathShapeGatePath);
const doc = read(docPath);
const packageJson = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);

validatePrerequisites();
validateArtifact();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch_ready"
        : "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch_blocked",
      expectedMissingRows: artifact.expectedMissingRows ?? null,
      blockedUntilA1Reply: artifact.blockedUntilA1Reply ?? null,
      nextRouteIfA1Replies: artifact.nextRouteIfA1Replies ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(sourceGate.status, "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads_ready", "source gate status");
  expect(sourceGate.pathShape?.twiiCandidateArtifactPathExists, true, "source gate TWII path");
  expect(sourceGate.pathShape?.etfCandidateArtifactPathExists, false, "source gate ETF path");
  expect(sourceGate.pathShape?.candidateArtifactPathSetComplete, false, "source gate candidate set complete");
  expect(sourceGate.nextRoute, "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch", "source gate nextRoute");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch_ready", "artifact status");
  expect(artifact.requestMode, "a1_etf_sanitized_candidate_artifact_path_request_no_fetch", "requestMode");
  expect(artifact.sourcePathShapeGate, "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads_ready", "sourcePathShapeGate");
  expect(artifact.sourcePathShapeGatePath, sourcePathShapeGatePath, "sourcePathShapeGatePath");
  expect(artifact.requestOwner, "PM", "requestOwner");
  expect(artifact.requestedLane, "A1", "requestedLane");
  expect(artifact.targetLane, "ETF", "targetLane");
  expect(artifact.targetScope, "phase_1_core_etf_daily_prices_missing_rows", "targetScope");
  expect(artifact.targetTable, "daily_prices", "targetTable");
  expect(artifact.expectedMissingRows, 118, "expectedMissingRows");
  expectArray(artifact.requiredReplyFields, [
    "candidateArtifactPath",
    "artifactId",
    "lane",
    "scope",
    "sourceLane",
    "coverageWindowSessions",
    "candidateMissingRows",
    "expectedRows",
    "aggregateValidation",
    "fieldNames",
    "validationStatus",
    "sanitizedAggregateOnly",
    "rawPayloadIncluded",
    "rowPayloadIncluded",
    "stockIdPayloadIncluded",
    "secretsIncluded"
  ], "requiredReplyFields");
  const criteria = artifact.acceptanceCriteria ?? {};
  for (const [key, expected] of Object.entries({
    candidateArtifactPathRequired: true,
    artifactMustBeInDataCandidates: true,
    candidateMissingRowsMustEqual: 118,
    expectedRowsMustEqual: 118,
    duplicateRowsMustEqual: 0,
    rejectedRowsMustEqual: 0,
    missingRowsMustEqual: 0,
    sanitizedAggregateOnlyMustBe: true,
    rawPayloadIncludedMustBe: false,
    rowPayloadIncludedMustBe: false,
    stockIdPayloadIncludedMustBe: false,
    secretsIncludedMustBe: false
  })) {
    expect(criteria[key], expected, `acceptanceCriteria.${key}`);
  }
  expect(artifact.blockedUntilA1Reply, true, "blockedUntilA1Reply");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.implementationAllowedNow, false, "implementationAllowedNow");
  expect(artifact.nextRouteIfA1Replies, "phase_1_etf_sanitized_candidate_artifact_path_intake_no_row_payloads", "nextRouteIfA1Replies");
  expect(artifact.nextRouteIfA1CannotReply, "phase_1_etf_candidate_gap_remains_blocking_data_online", "nextRouteIfA1CannotReply");
  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch_ready",
    "a1_etf_sanitized_candidate_artifact_path_request_no_fetch",
    `sourcePathShapeGatePath=${sourcePathShapeGatePath}`,
    "requestedLane=A1",
    "targetLane=ETF",
    "targetScope=phase_1_core_etf_daily_prices_missing_rows",
    "targetTable=daily_prices",
    "expectedMissingRows=118",
    "candidateArtifactPath",
    "candidateMissingRows: 118",
    "expectedRows: 118",
    "sanitizedAggregateOnly: true",
    "rawPayloadIncluded: false",
    "rowPayloadIncluded: false",
    "stockIdPayloadIncluded: false",
    "secretsIncluded: false",
    "blockedUntilA1Reply=true",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No remote fetch requested",
    "No candidate artifact content read",
    "No `daily_prices` mutation",
    "phase_1_etf_sanitized_candidate_artifact_path_intake_no_row_payloads"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (packageJson.scripts?.["check:phase-1-etf-sanitized-candidate-artifact-path-request-no-fetch"] !== "node scripts/check-phase-1-etf-sanitized-candidate-artifact-path-request-no-fetch.mjs") {
    problems.push("package.json missing check:phase-1-etf-sanitized-candidate-artifact-path-request-no-fetch");
  }
  if (!reviewGate.includes("scripts/check-phase-1-etf-sanitized-candidate-artifact-path-request-no-fetch.mjs")) {
    problems.push("review gate missing ETF candidate artifact path request checker");
  }
  if (!reviewGate.includes('"phase-1-etf-sanitized-candidate-artifact-path-request-no-fetch"')) {
    problems.push("focused review gate missing ETF candidate artifact path request checker");
  }
}

function validateBoundaries() {
  for (const [filePath, text] of [
    [artifactPath, artifactRaw],
    [docPath, doc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
    }
  }
}

function validateSafety(safety, label) {
  expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(safety.scoreSource, "mock", `${label}.scoreSource`);
  for (const key of [
    "remoteFetchRequested",
    "marketDataFetched",
    "marketDataIngested",
    "candidateArtifactCreated",
    "candidateArtifactRead",
    "candidateRowPayloadRead",
    "rawPayloadRead",
    "stockIdPayloadRead",
    "rowPayloadOutput",
    "rawPayloadOutput",
    "secretsOutput",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(safety[key], false, `${label}.${key}`);
  }
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /remoteFetchRequested":\s*true/u,
    /marketDataFetched":\s*true/u,
    /candidateArtifactCreated":\s*true/u,
    /candidateRowsAccepted":\s*true/u,
    /dailyPricesMutated":\s*true/u
  ];
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectArray(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));
  if (missing.length > 0 || extra.length > 0) {
    problems.push(`${label} mismatch missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  }
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} must be JSON: ${error.message}`);
    return {};
  }
}
