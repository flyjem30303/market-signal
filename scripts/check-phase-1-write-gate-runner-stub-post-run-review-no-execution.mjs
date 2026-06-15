import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-write-gate-runner-stub-post-run-review-no-execution.json";
const inputStubPath = "data/evidence-intake/phase-1-write-gate-fail-closed-runner-stub.json";
const docPath = "docs/PHASE_1_WRITE_GATE_RUNNER_STUB_POST_RUN_REVIEW_NO_EXECUTION.md";
const runnerPath = "scripts/run-phase-1-write-gate-fail-closed-runner-stub.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const inputStub = parseJson(readText(inputStubPath), inputStubPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const runnerSummary = runJson(runnerPath, "phase 1 fail-closed runner stub");

validatePrerequisites();
validateArtifact();
validateRunnerSummary();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_write_gate_runner_stub_post_run_review_no_execution_ready"
        : "phase_1_write_gate_runner_stub_post_run_review_no_execution_blocked",
      runnerStubReviewed: artifact.runnerStubReviewed ?? null,
      runnerStatus: artifact.runnerStatus ?? null,
      runnerOutcome: artifact.runnerOutcome ?? null,
      executionAllowedNow: artifact.executionAllowedNow ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
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
  expect(inputStub.status, "phase_1_write_gate_fail_closed_runner_stub_ready_no_execution", "input stub status");
  expect(inputStub.runnerStubReady, true, "input runnerStubReady");
  expect(inputStub.runnerMode, "fail_closed_no_execution", "input runnerMode");
  expect(inputStub.executionAllowedNow, false, "input executionAllowedNow");
  expect(inputStub.writeGateExecutableNow, false, "input writeGateExecutableNow");
  expect(inputStub.nextRoute, "phase_1_write_gate_runner_stub_post_run_review_no_execution", "input nextRoute");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_gate_runner_stub_post_run_review_no_execution_ready", "artifact status");
  expect(artifact.packetMode, "write_gate_runner_stub_post_run_review_no_execution", "packetMode");
  expect(artifact.inputRunnerStub, "phase_1_write_gate_fail_closed_runner_stub_ready_no_execution", "inputRunnerStub");
  expect(artifact.runnerStubReviewed, true, "runnerStubReviewed");
  expect(artifact.runnerStubOutcomeAccepted, true, "runnerStubOutcomeAccepted");
  expect(artifact.runnerStatus, "phase_1_write_gate_fail_closed_runner_stub_blocked_no_execution", "runnerStatus");
  expect(artifact.runnerOutcome, "runner_stub_is_fail_closed_and_does_not_execute", "runnerOutcome");
  expect(artifact.runnerMode, "fail_closed_no_execution", "runnerMode");
  expect(artifact.runnerExecutableNow, false, "runnerExecutableNow");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.implementationAllowedNow, false, "implementationAllowedNow");
  expect(artifact.boundedAttemptScope, "twii_and_etf_phase_1_missing_row_closure_only", "boundedAttemptScope");
  expect(artifact.targetTable, "daily_prices", "targetTable");
  expect(artifact.nextRoute, "phase_1_write_runner_implementation_review_gate_no_execution", "nextRoute");

  for (const [key, expected] of Object.entries({
    fullLevel1ExpectedRows: 360,
    fullLevel1ObservedRows: 182,
    fullLevel1MissingRows: 178,
    twiiMissingRows: 60,
    etfMissingRows: 118
  })) {
    expect(artifact.targetRows?.[key], expected, `targetRows.${key}`);
  }

  expectArray(artifact.postRunAssertions, [
    "runner_returned_json",
    "runner_failed_closed",
    "no_sql_executed",
    "no_supabase_client_imported",
    "no_supabase_connection_attempted",
    "no_supabase_read_attempted",
    "no_supabase_write_attempted",
    "no_credential_value_read",
    "no_daily_prices_mutation",
    "no_candidate_rows_accepted",
    "no_raw_or_row_payload_printed",
    "runtime_remained_mock"
  ], "postRunAssertions");

  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateRunnerSummary() {
  expect(runnerSummary.status, "ok", "runnerSummary.status");
  expect(
    runnerSummary.runnerStatus,
    "phase_1_write_gate_fail_closed_runner_stub_blocked_no_execution",
    "runnerSummary.runnerStatus"
  );
  expect(runnerSummary.outcome, "runner_stub_is_fail_closed_and_does_not_execute", "runnerSummary.outcome");
  expect(runnerSummary.runnerMode, "fail_closed_no_execution", "runnerSummary.runnerMode");
  expect(runnerSummary.runnerExecutableNow, false, "runnerSummary.runnerExecutableNow");
  expect(runnerSummary.executionAllowedNow, false, "runnerSummary.executionAllowedNow");
  expect(runnerSummary.writeGateExecutableNow, false, "runnerSummary.writeGateExecutableNow");
  expect(runnerSummary.publicDataSource, "mock", "runnerSummary.publicDataSource");
  expect(runnerSummary.scoreSource, "mock", "runnerSummary.scoreSource");
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "credentialValueRead",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    expect(runnerSummary[key], false, `runnerSummary.${key}`);
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_write_gate_runner_stub_post_run_review_no_execution_ready",
    "write_gate_runner_stub_post_run_review_no_execution",
    "inputRunnerStub=phase_1_write_gate_fail_closed_runner_stub_ready_no_execution",
    "runnerStubReviewed=true",
    "runnerStubOutcomeAccepted=true",
    "runnerStatus=phase_1_write_gate_fail_closed_runner_stub_blocked_no_execution",
    "runnerOutcome=runner_stub_is_fail_closed_and_does_not_execute",
    "runnerMode=fail_closed_no_execution",
    "runnerExecutableNow=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "boundedAttemptScope=twii_and_etf_phase_1_missing_row_closure_only",
    "targetTable=daily_prices",
    "nextRoute=phase_1_write_runner_implementation_review_gate_no_execution",
    "fullLevel1ExpectedRows=360",
    "fullLevel1ObservedRows=182",
    "fullLevel1MissingRows=178",
    "twiiMissingRows=60",
    "etfMissingRows=118",
    "runner_returned_json",
    "runner_failed_closed",
    "no_sql_executed",
    "no_supabase_client_imported",
    "no_supabase_connection_attempted",
    "no_supabase_read_attempted",
    "no_supabase_write_attempted",
    "no_credential_value_read",
    "no_daily_prices_mutation",
    "no_candidate_rows_accepted",
    "no_raw_or_row_payload_printed",
    "runtime_remained_mock",
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
    packageJson.scripts?.["check:phase-1-write-gate-runner-stub-post-run-review-no-execution"] !==
    "node scripts/check-phase-1-write-gate-runner-stub-post-run-review-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-gate-runner-stub-post-run-review-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-gate-runner-stub-post-run-review-no-execution.mjs")) {
    problems.push("review gate missing runner stub post-run review checker");
  }
  if (!reviewGate.includes('"phase-1-write-gate-runner-stub-post-run-review-no-execution"')) {
    problems.push("focused review gate missing runner stub post-run review checker");
  }
}

function validateBoundaries() {
  const forbiddenPatterns = [
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

function runJson(filePath, label) {
  const run = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 60000,
    windowsHide: true
  });
  if (run.status !== 0) {
    problems.push(`${label} exited ${run.status}`);
    return {};
  }
  return parseJson(run.stdout, label);
}
