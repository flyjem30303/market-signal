import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-write-gate-fail-closed-runner-stub.json";
const inputPacketPath = "data/evidence-intake/phase-1-write-gate-execution-packet-draft-no-execution.json";
const docPath = "docs/PHASE_1_WRITE_GATE_FAIL_CLOSED_RUNNER_STUB.md";
const runnerPath = "scripts/run-phase-1-write-gate-fail-closed-runner-stub.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const inputPacket = parseJson(readText(inputPacketPath), inputPacketPath);
const doc = readText(docPath);
const runnerSource = readText(runnerPath);
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
        ? "phase_1_write_gate_fail_closed_runner_stub_ready_no_execution"
        : "phase_1_write_gate_fail_closed_runner_stub_blocked",
      runnerStubReady: artifact.runnerStubReady ?? null,
      runnerStatus: runnerSummary.runnerStatus ?? null,
      executionAllowedNow: artifact.executionAllowedNow ?? null,
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
  expect(inputPacket.status, "phase_1_write_gate_execution_packet_draft_no_execution_ready", "input packet status");
  expect(inputPacket.executionPacketDraftReady, true, "input executionPacketDraftReady");
  expect(inputPacket.executionAllowedNow, false, "input executionAllowedNow");
  expect(inputPacket.writeGateExecutableNow, false, "input writeGateExecutableNow");
  expect(
    inputPacket.nextRoute,
    "phase_1_write_gate_runner_stub_or_operator_execution_packet_review",
    "input nextRoute"
  );
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_gate_fail_closed_runner_stub_ready_no_execution", "artifact status");
  expect(artifact.packetMode, "write_gate_fail_closed_runner_stub_no_execution", "packetMode");
  expect(artifact.inputExecutionPacket, "phase_1_write_gate_execution_packet_draft_no_execution_ready", "inputExecutionPacket");
  expect(artifact.runnerStubReady, true, "runnerStubReady");
  expect(artifact.runnerMode, "fail_closed_no_execution", "runnerMode");
  expect(artifact.runnerExecutableNow, false, "runnerExecutableNow");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.boundedAttemptScope, "twii_and_etf_phase_1_missing_row_closure_only", "boundedAttemptScope");
  expect(artifact.targetTable, "daily_prices", "targetTable");
  expect(artifact.nextRoute, "phase_1_write_gate_runner_stub_post_run_review_no_execution", "nextRoute");

  for (const [key, expected] of Object.entries({
    fullLevel1ExpectedRows: 360,
    fullLevel1ObservedRows: 182,
    fullLevel1MissingRows: 178,
    twiiMissingRows: 60,
    etfMissingRows: 118
  })) {
    expect(artifact.targetRows?.[key], expected, `targetRows.${key}`);
  }

  expectArray(artifact.blockedUntil, [
    "operator_final_go_no_go",
    "sanitized_candidate_artifact_paths",
    "server_only_credentials_present",
    "insert_missing_only_runner_implementation_review",
    "aggregate_readback_runner_implementation_review",
    "rollback_or_quarantine_decision",
    "post_run_review_packet",
    "runtime_promotion_decision"
  ], "blockedUntil");

  const contract = artifact.runnerOutputContract ?? {};
  expect(contract.status, "phase_1_write_gate_fail_closed_runner_stub_blocked_no_execution", "runnerOutputContract.status");
  expect(contract.outcome, "runner_stub_is_fail_closed_and_does_not_execute", "runnerOutputContract.outcome");
  for (const key of [
    "mustReturnJson",
    "mustNotImportSupabase",
    "mustNotReadCredentialValues",
    "mustNotExecuteSql",
    "mustNotMutateDailyPrices",
    "mustNotPrintRawPayloads",
    "mustKeepRuntimeMock"
  ]) {
    expect(contract[key], true, `runnerOutputContract.${key}`);
  }

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
  expect(runnerSummary.runnerStubReady, true, "runnerSummary.runnerStubReady");
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
    "phase_1_write_gate_fail_closed_runner_stub_ready_no_execution",
    "write_gate_fail_closed_runner_stub_no_execution",
    "inputExecutionPacket=phase_1_write_gate_execution_packet_draft_no_execution_ready",
    "runnerStubReady=true",
    "runnerMode=fail_closed_no_execution",
    "runnerExecutableNow=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "boundedAttemptScope=twii_and_etf_phase_1_missing_row_closure_only",
    "targetTable=daily_prices",
    "nextRoute=phase_1_write_gate_runner_stub_post_run_review_no_execution",
    "fullLevel1ExpectedRows=360",
    "fullLevel1ObservedRows=182",
    "fullLevel1MissingRows=178",
    "twiiMissingRows=60",
    "etfMissingRows=118",
    "operator_final_go_no_go",
    "sanitized_candidate_artifact_paths",
    "server_only_credentials_present",
    "insert_missing_only_runner_implementation_review",
    "aggregate_readback_runner_implementation_review",
    "rollback_or_quarantine_decision",
    "post_run_review_packet",
    "runtime_promotion_decision",
    "status=phase_1_write_gate_fail_closed_runner_stub_blocked_no_execution",
    "outcome=runner_stub_is_fail_closed_and_does_not_execute",
    "mustReturnJson=true",
    "mustNotImportSupabase=true",
    "mustNotReadCredentialValues=true",
    "mustNotExecuteSql=true",
    "mustNotMutateDailyPrices=true",
    "mustNotPrintRawPayloads=true",
    "mustKeepRuntimeMock=true",
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
    packageJson.scripts?.["run:phase-1-write-gate-fail-closed-runner-stub"] !==
    "node scripts/run-phase-1-write-gate-fail-closed-runner-stub.mjs"
  ) {
    problems.push("package.json missing run:phase-1-write-gate-fail-closed-runner-stub");
  }
  if (
    packageJson.scripts?.["check:phase-1-write-gate-fail-closed-runner-stub"] !==
    "node scripts/check-phase-1-write-gate-fail-closed-runner-stub.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-gate-fail-closed-runner-stub");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-gate-fail-closed-runner-stub.mjs")) {
    problems.push("review gate missing fail-closed runner stub checker");
  }
  if (!reviewGate.includes('"phase-1-write-gate-fail-closed-runner-stub"')) {
    problems.push("focused review gate missing fail-closed runner stub checker");
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
    /executionAllowedNow"\s*:\s*true/u,
    /writeGateExecutableNow"\s*:\s*true/u
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(artifactRaw)) problems.push(`${artifactPath} contains forbidden pattern ${pattern}`);
    if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${pattern}`);
    if (pattern.test(runnerSource)) problems.push(`${runnerPath} contains forbidden pattern ${pattern}`);
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
