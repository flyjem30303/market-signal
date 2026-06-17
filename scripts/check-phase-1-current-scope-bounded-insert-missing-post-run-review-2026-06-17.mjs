import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-current-scope-bounded-insert-missing-post-run-review-2026-06-17.json";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const projectStatus = read(projectStatusPath);

validateArtifact();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;

console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_current_scope_bounded_insert_missing_post_run_review_accepted"
    : "phase_1_current_scope_bounded_insert_missing_post_run_review_blocked",
  decision: artifact.decision ?? null,
  coverageCompleteAfterWrite: artifact.coverageCompleteAfterWrite === true,
  insertedRows: artifact.insertedRows ?? null,
  missingRowsAfterWrite: artifact.missingRowsAfterWrite ?? null,
  publicDataSource: artifact.publicDataSource ?? null,
  scoreSource: artifact.scoreSource ?? null,
  nextRoute: ok
    ? "phase_1_runtime_promotion_gate_preflight_mock_to_supabase_review"
    : "repair_current_scope_bounded_insert_missing_post_run_review",
  problems
}, null, 2));

if (!ok) process.exit(1);

function validateArtifact() {
  expect(artifact.packetMode, "phase_1_current_scope_bounded_insert_missing_post_run_review", "artifact.packetMode");
  expect(artifact.status, "phase_1_current_scope_bounded_insert_missing_passed_readback", "artifact.status");
  expect(
    artifact.decision,
    "CURRENT_SCOPE_DAILY_PRICES_COVERAGE_COMPLETE_KEEP_RUNTIME_MOCK_UNTIL_PROMOTION_GATE",
    "artifact.decision"
  );
  expect(artifact.authorizationId, "PHASE1-CURRENT-SCOPE-BOUNDED-WRITE-2026-06-17-A", "artifact.authorizationId");
  expect(artifact.boundedAttemptScope, "twii_plus_listed_stock_daily_close", "artifact.boundedAttemptScope");
  expect(artifact.targetTable, "daily_prices", "artifact.targetTable");
  expect(artifact.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "artifact.operationKind");
  expect(artifact.candidateRows, 240, "artifact.candidateRows");
  expect(artifact.symbolsCoveredCount, 4, "artifact.symbolsCoveredCount");
  expect(artifact.dateBounds?.minTradeDate, "2026-03-11", "artifact.dateBounds.minTradeDate");
  expect(artifact.dateBounds?.maxTradeDate, "2026-06-15", "artifact.dateBounds.maxTradeDate");
  expect(artifact.remoteAttempted, true, "artifact.remoteAttempted");
  expect(artifact.connectionAttempted, true, "artifact.connectionAttempted");
  expect(artifact.stockMappingComplete, true, "artifact.stockMappingComplete");
  expect(artifact.readbackAttempted, true, "artifact.readbackAttempted");
  expect(artifact.existingRowsBeforeWrite, 240, "artifact.existingRowsBeforeWrite");
  expect(artifact.plannedInsertRows, 0, "artifact.plannedInsertRows");
  expect(artifact.skippedExistingRows, 240, "artifact.skippedExistingRows");
  expect(artifact.insertedRows, 0, "artifact.insertedRows");
  expect(artifact.finalRowsAfterWrite, 240, "artifact.finalRowsAfterWrite");
  expect(artifact.missingRowsAfterWrite, 0, "artifact.missingRowsAfterWrite");
  expect(artifact.coverageCompleteAfterWrite, true, "artifact.coverageCompleteAfterWrite");
  expect(artifact.writeSucceeded, false, "artifact.writeSucceeded");
  expect(artifact.sqlExecuted, false, "artifact.sqlExecuted");
  expect(artifact.marketDataFetched, false, "artifact.marketDataFetched");
  expect(artifact.marketDataIngested, false, "artifact.marketDataIngested");
  expect(artifact.rawPayloadOutput, false, "artifact.rawPayloadOutput");
  expect(artifact.rowPayloadOutput, false, "artifact.rowPayloadOutput");
  expect(artifact.stockIdPayloadOutput, false, "artifact.stockIdPayloadOutput");
  expect(artifact.secretsOutput, false, "artifact.secretsOutput");
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(artifact.sourcePromotion, false, "artifact.sourcePromotion");
  expect(artifact.scorePromotion, false, "artifact.scorePromotion");
  expect(artifact.updateAttempted, false, "artifact.updateAttempted");
  expect(artifact.upsertAttempted, false, "artifact.upsertAttempted");
  expect(artifact.deleteAttempted, false, "artifact.deleteAttempted");
  expect(artifact.insertOnlyMissingKeys, true, "artifact.insertOnlyMissingKeys");
  expectArray(artifact.problems, [], "artifact.problems");
  expect(artifact.nextRoute, "phase_1_runtime_promotion_gate_preflight_mock_to_supabase_review", "artifact.nextRoute");
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Phase 1 Current-Scope Bounded Insert-Missing Post-Run Review",
    "phase_1_current_scope_bounded_insert_missing_passed_readback",
    "CURRENT_SCOPE_DAILY_PRICES_COVERAGE_COMPLETE_KEEP_RUNTIME_MOCK_UNTIL_PROMOTION_GATE",
    "phase_1_runtime_promotion_gate_preflight_mock_to_supabase_review"
  ]) {
    if (!projectStatus.includes(phrase)) problems.push(`${projectStatusPath} missing phrase: ${phrase}`);
  }
}

function validateBoundaries() {
  for (const [field, expected] of [
    ["sqlExecuted", false],
    ["marketDataFetched", false],
    ["marketDataIngested", false],
    ["rawPayloadOutput", false],
    ["rowPayloadOutput", false],
    ["stockIdPayloadOutput", false],
    ["secretsOutput", false],
    ["publicDataSource", "mock"],
    ["scoreSource", "mock"],
    ["sourcePromotion", false],
    ["scorePromotion", false]
  ]) {
    expect(artifact[field], expected, `artifact.${field}`);
  }

  for (const pattern of [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"rowPayload"\s*:/iu,
    /"rawPayload"\s*:/iu,
    /"stockIds"\s*:/iu,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u
  ]) {
    if (pattern.test(artifactText)) problems.push(`${artifactPath} contains forbidden pattern ${pattern}`);
  }
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
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
