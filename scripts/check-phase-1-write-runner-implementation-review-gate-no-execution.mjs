import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-runner-implementation-review-gate-no-execution.json";
const inputPostRunPath = "data/evidence-intake/phase-1-write-gate-runner-stub-post-run-review-no-execution.json";
const docPath = "docs/PHASE_1_WRITE_RUNNER_IMPLEMENTATION_REVIEW_GATE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const inputPostRun = parseJson(readText(inputPostRunPath), inputPostRunPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);

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
        ? "phase_1_write_runner_implementation_review_gate_no_execution_ready"
        : "phase_1_write_runner_implementation_review_gate_no_execution_blocked",
      implementationReviewReady: artifact.implementationReviewReady ?? null,
      implementationAllowedNow: artifact.implementationAllowedNow ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      fullLevel1MissingRows: artifact.targetRows?.fullLevel1MissingRows ?? null,
      nextRoute: artifact.nextRoute ?? null,
      publicDataSource: artifact.safety?.publicDataSource ?? null,
      scoreSource: artifact.safety?.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(inputPostRun.status, "phase_1_write_gate_runner_stub_post_run_review_no_execution_ready", "input post-run status");
  expect(inputPostRun.runnerStubReviewed, true, "input runnerStubReviewed");
  expect(inputPostRun.runnerStubOutcomeAccepted, true, "input runnerStubOutcomeAccepted");
  expect(inputPostRun.executionAllowedNow, false, "input executionAllowedNow");
  expect(inputPostRun.writeGateExecutableNow, false, "input writeGateExecutableNow");
  expect(inputPostRun.nextRoute, "phase_1_write_runner_implementation_review_gate_no_execution", "input nextRoute");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_runner_implementation_review_gate_no_execution_ready", "artifact status");
  expect(artifact.packetMode, "write_runner_implementation_review_gate_no_execution", "packetMode");
  expect(artifact.inputPostRunReview, "phase_1_write_gate_runner_stub_post_run_review_no_execution_ready", "inputPostRunReview");
  expect(artifact.implementationReviewReady, true, "implementationReviewReady");
  expect(artifact.implementationAllowedNow, false, "implementationAllowedNow");
  expect(artifact.runnerExecutableNow, false, "runnerExecutableNow");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(
    artifact.reviewDecision,
    "implementation_review_ready_but_real_runner_implementation_still_blocked",
    "reviewDecision"
  );
  expect(artifact.boundedAttemptScope, "twii_and_etf_phase_1_missing_row_closure_only", "boundedAttemptScope");
  expect(artifact.targetTable, "daily_prices", "targetTable");
  expect(artifact.nextRoute, "phase_1_write_runner_implementation_scope_packet_no_execution", "nextRoute");

  for (const [key, expected] of Object.entries({
    fullLevel1ExpectedRows: 360,
    fullLevel1ObservedRows: 182,
    fullLevel1MissingRows: 178,
    twiiMissingRows: 60,
    etfMissingRows: 118
  })) {
    expect(artifact.targetRows?.[key], expected, `targetRows.${key}`);
  }

  const controls = artifact.implementationControls ?? {};
  expect(controls.runnerStubPostRunReviewAccepted, true, "implementationControls.runnerStubPostRunReviewAccepted");
  for (const key of [
    "supabaseClientImplementationAllowed",
    "credentialPresenceCheckImplementationAllowed",
    "boundedInsertMissingOnlyImplementationAllowed",
    "aggregateReadbackImplementationAllowed",
    "rollbackOrQuarantineImplementationAllowed",
    "runtimePromotionImplementationAllowed"
  ]) {
    expect(controls[key], false, `implementationControls.${key}`);
  }

  expectArray(artifact.requiredBeforeImplementation, [
    "operator_final_go_no_go",
    "sanitized_candidate_artifact_paths_for_twii_and_etf",
    "server_only_credential_presence_review",
    "insert_missing_only_contract_review",
    "aggregate_readback_contract_review",
    "rollback_or_quarantine_contract_review",
    "post_run_review_contract_review",
    "runtime_promotion_contract_review"
  ], "requiredBeforeImplementation");

  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_write_runner_implementation_review_gate_no_execution_ready",
    "write_runner_implementation_review_gate_no_execution",
    "inputPostRunReview=phase_1_write_gate_runner_stub_post_run_review_no_execution_ready",
    "implementationReviewReady=true",
    "implementationAllowedNow=false",
    "runnerExecutableNow=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "reviewDecision=implementation_review_ready_but_real_runner_implementation_still_blocked",
    "boundedAttemptScope=twii_and_etf_phase_1_missing_row_closure_only",
    "targetTable=daily_prices",
    "nextRoute=phase_1_write_runner_implementation_scope_packet_no_execution",
    "fullLevel1ExpectedRows=360",
    "fullLevel1ObservedRows=182",
    "fullLevel1MissingRows=178",
    "twiiMissingRows=60",
    "etfMissingRows=118",
    "runnerStubPostRunReviewAccepted=true",
    "supabaseClientImplementationAllowed=false",
    "credentialPresenceCheckImplementationAllowed=false",
    "boundedInsertMissingOnlyImplementationAllowed=false",
    "aggregateReadbackImplementationAllowed=false",
    "rollbackOrQuarantineImplementationAllowed=false",
    "runtimePromotionImplementationAllowed=false",
    "operator_final_go_no_go",
    "sanitized_candidate_artifact_paths_for_twii_and_etf",
    "server_only_credential_presence_review",
    "insert_missing_only_contract_review",
    "aggregate_readback_contract_review",
    "rollback_or_quarantine_contract_review",
    "post_run_review_contract_review",
    "runtime_promotion_contract_review",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No Supabase client import",
    "No SQL",
    "No `daily_prices` mutation",
    "No candidate row acceptance",
    "No public real-data claim",
    "No investment advice"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-write-runner-implementation-review-gate-no-execution"] !==
    "node scripts/check-phase-1-write-runner-implementation-review-gate-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-runner-implementation-review-gate-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-implementation-review-gate-no-execution.mjs")) {
    problems.push("review gate missing write runner implementation review gate checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-implementation-review-gate-no-execution"')) {
    problems.push("focused review gate missing write runner implementation review gate checker");
  }
}

function validateBoundaries() {
  const forbiddenPatterns = [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /sb_secret_/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /"executeSwitchValue"\s*:/u,
    /"confirmationPhraseValue"\s*:/u,
    /"operatorDecisionValue"\s*:/u,
    /"credentialValue"\s*:/u,
    /valuesRead"\s*:\s*true/u,
    /valuesStored"\s*:\s*true/u,
    /valuesPrinted"\s*:\s*true/u,
    /valuesHashed"\s*:\s*true/u,
    /valuesCompared"\s*:\s*true/u,
    /valuesTransformed"\s*:\s*true/u,
    /sqlExecuted"\s*:\s*true/u,
    /supabaseClientImported"\s*:\s*true/u,
    /supabaseConnectionAttempted"\s*:\s*true/u,
    /supabaseReadAttempted"\s*:\s*true/u,
    /supabaseWriteAttempted"\s*:\s*true/u,
    /dailyPricesMutated"\s*:\s*true/u,
    /candidateRowsAccepted"\s*:\s*true/u,
    /marketDataFetched"\s*:\s*true/u,
    /marketDataIngested"\s*:\s*true/u,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /implementationAllowedNow"\s*:\s*true/u,
    /executionAllowedNow"\s*:\s*true/u,
    /writeGateExecutableNow"\s*:\s*true/u
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(artifactRaw)) problems.push(`${artifactPath} contains forbidden pattern ${pattern}`);
    if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${pattern}`);
  }
}

function validateSafety(safety, label) {
  expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(safety.scoreSource, "mock", `${label}.scoreSource`);
  for (const key of [
    "valuesRead",
    "valuesStored",
    "valuesPrinted",
    "valuesHashed",
    "valuesCompared",
    "valuesTransformed",
    "credentialValueRead",
    "credentialValueStored",
    "credentialValuePrinted",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(safety[key], false, `${label}.${key}`);
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

function readText(filePath) {
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
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}
