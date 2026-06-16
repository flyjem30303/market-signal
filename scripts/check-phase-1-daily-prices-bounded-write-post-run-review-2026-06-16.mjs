import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-daily-prices-bounded-write-post-run-review-2026-06-16.json";
const runnerPath = "scripts/run-phase-1-daily-prices-bounded-insert-missing-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const runner = read(runnerPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);

validateArtifact();
validateRunnerTransport();
validateRegistration();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_daily_prices_bounded_write_post_run_review_2026_06_16_ready"
        : "phase_1_daily_prices_bounded_write_post_run_review_2026_06_16_blocked",
      postRunStatus: artifact.status ?? null,
      coverageCompleteAfterWrite: artifact.coverageCompleteAfterWrite === true,
      rollbackRequiredNow: artifact.rollbackRequiredNow === true,
      quarantineRequiredNow: artifact.quarantineRequiredNow === true,
      publicDataSource: "mock",
      scoreSource: "mock",
      promotionAllowedNow: false,
      nextRoute: ok ? artifact.nextRoute : "keep_mock_and_repair_post_run_evidence",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateArtifact() {
  expect(artifact.evidenceMode, "phase_1_daily_prices_bounded_write_post_run_review", "artifact.evidenceMode");
  expect(artifact.status, "phase_1_daily_prices_bounded_insert_missing_passed_readback", "artifact.status");
  expect(artifact.authorizationId, "PHASE1-DAILY-PRICES-BOUNDED-WRITE-2026-06-16-A", "artifact.authorizationId");
  expect(artifact.boundedAttemptScope, "twii_and_etf_phase_1_missing_row_closure_only", "artifact.boundedAttemptScope");
  expect(artifact.targetTable, "daily_prices", "artifact.targetTable");
  expect(artifact.candidateRowCount, 178, "artifact.candidateRowCount");
  expect(artifact.symbolCounts?.TWII, 60, "artifact.symbolCounts.TWII");
  expect(artifact.symbolCounts?.["0050"], 59, "artifact.symbolCounts.0050");
  expect(artifact.symbolCounts?.["006208"], 59, "artifact.symbolCounts.006208");
  expect(artifact.executionRequested, true, "artifact.executionRequested");
  expect(artifact.remoteAttempted, true, "artifact.remoteAttempted");
  expect(artifact.connectionAttempted, true, "artifact.connectionAttempted");
  expect(artifact.stockMappingComplete, true, "artifact.stockMappingComplete");
  expect(artifact.readbackAttempted, true, "artifact.readbackAttempted");
  expect(artifact.existingRowsBeforeWrite, 178, "artifact.existingRowsBeforeWrite");
  expect(artifact.plannedInsertRows, 0, "artifact.plannedInsertRows");
  expect(artifact.skippedExistingRows, 178, "artifact.skippedExistingRows");
  expect(artifact.insertedRows, 0, "artifact.insertedRows");
  expect(artifact.finalRowsAfterWrite, 178, "artifact.finalRowsAfterWrite");
  expect(artifact.missingRowsAfterWrite, 0, "artifact.missingRowsAfterWrite");
  expect(artifact.coverageCompleteAfterWrite, true, "artifact.coverageCompleteAfterWrite");
  expect(artifact.writeSucceeded, false, "artifact.writeSucceeded");
  expect(artifact.rollbackRequiredNow, false, "artifact.rollbackRequiredNow");
  expect(artifact.quarantineRequiredNow, false, "artifact.quarantineRequiredNow");
  expect(
    artifact.rollbackQuarantineDecision,
    "not_required_no_rows_mutated_and_readback_complete",
    "artifact.rollbackQuarantineDecision"
  );
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
  expect(artifact.nextRoute, "prepare_mock_to_real_promotion_review_no_flag_change", "artifact.nextRoute");
  if (!Array.isArray(artifact.problems) || artifact.problems.length !== 0) {
    problems.push("artifact.problems must be an empty array");
  }
  for (const key of [
    "sqlExecuted",
    "marketDataFetched",
    "marketDataIngested",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "sourcePromotion",
    "scorePromotion",
    "updateAttempted",
    "upsertAttempted",
    "deleteAttempted"
  ]) {
    expect(artifact.safety?.[key], false, `artifact.safety.${key}`);
  }
  expect(artifact.safety?.insertOnlyMissingKeys, true, "artifact.safety.insertOnlyMissingKeys");
}

function validateRunnerTransport() {
  if (!runner.includes('await import("ws")')) problems.push(`${runnerPath} must import ws for Node 20 Supabase transport`);
  if (!runner.includes("realtime:")) problems.push(`${runnerPath} must pass realtime options to createClient`);
  if (!runner.includes("transport: ws")) problems.push(`${runnerPath} must pass ws transport to createClient`);
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-daily-prices-bounded-write-post-run-review-2026-06-16"] !==
    "node scripts/check-phase-1-daily-prices-bounded-write-post-run-review-2026-06-16.mjs"
  ) {
    problems.push(`${packagePath} missing post-run review checker script`);
  }
  if (!pkg.dependencies?.ws) problems.push(`${packagePath} missing ws dependency`);
  if (!reviewGate.includes("scripts/check-phase-1-daily-prices-bounded-write-post-run-review-2026-06-16.mjs")) {
    problems.push(`${reviewGatePath} missing post-run review checker registration`);
  }
  if (!reviewGate.includes('"phase-1-daily-prices-bounded-write-post-run-review-2026-06-16"')) {
    problems.push(`${reviewGatePath} missing post-run review focused gate name`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Daily Prices Bounded Write Post-Run Review",
    "phase_1_daily_prices_bounded_insert_missing_passed_readback",
    "not_required_no_rows_mutated_and_readback_complete"
  ]) {
    if (!projectStatus.includes(phrase)) problems.push(`${projectStatusPath} missing phrase: ${phrase}`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [artifactPath, artifactText],
    [projectStatusPath, projectStatus]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
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

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /"promotionAllowedNow"\s*:\s*true/u,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
