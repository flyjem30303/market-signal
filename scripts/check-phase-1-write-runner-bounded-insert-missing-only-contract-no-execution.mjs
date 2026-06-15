import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-write-runner-bounded-insert-missing-only-contract-no-execution.json";
const reportPath = "scripts/report-phase-1-write-runner-bounded-insert-missing-only-contract-no-execution.mjs";
const inputGatePath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads.json";
const docPath = "docs/PHASE_1_WRITE_RUNNER_BOUNDED_INSERT_MISSING_ONLY_CONTRACT_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const inputGate = parseJson(readText(inputGatePath), inputGatePath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const status = readText(statusPath);

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
if (reportRun.status !== 0) problems.push("report script must exit 0");
const report = parseJson(reportRun.stdout ?? "", "report stdout");

validatePrerequisites();
validateArtifact();
validateReport();
validateDoc();
validateRegistration();
validateStatus();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready"
        : "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_blocked",
      contractDecision: artifact.contractDecision ?? null,
      contractReadyForImplementation: artifact.contractReadyForImplementation ?? null,
      executionAllowedNow: artifact.writeBoundary?.executionAllowedNow ?? null,
      writeGateExecutableNow: artifact.writeBoundary?.writeGateExecutableNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(
    inputGate.status,
    "phase_1_etf_sanitized_candidate_artifact_path_intake_waiting_a1_reply_no_row_payloads",
    "input status"
  );
  expect(inputGate.blockedUntilA1Reply, true, "input blockedUntilA1Reply");
  expect(inputGate.candidateArtifactPathAccepted, false, "input candidateArtifactPathAccepted");
  expect(inputGate.expectedMissingRows, 118, "input expectedMissingRows");
  expect(inputGate.executionAllowedNow, false, "input executionAllowedNow");
  expect(inputGate.writeGateExecutableNow, false, "input writeGateExecutableNow");
  expect(inputGate.implementationAllowedNow, false, "input implementationAllowedNow");
}

function validateArtifact() {
  expect(
    artifact.status,
    "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready",
    "artifact status"
  );
  expect(artifact.contractMode, "bounded_insert_missing_only_contract_no_execution", "contractMode");
  expect(
    artifact.sourceIntakeStatus,
    "phase_1_etf_sanitized_candidate_artifact_path_intake_waiting_a1_reply_no_row_payloads",
    "sourceIntakeStatus"
  );
  expect(
    artifact.contractDecision,
    "bounded_insert_missing_only_contract_prepared_but_candidate_artifact_set_incomplete",
    "contractDecision"
  );
  expect(artifact.contractPrepared, true, "contractPrepared");
  expect(artifact.candidateArtifactSetComplete, false, "candidateArtifactSetComplete");
  expect(artifact.contractReadyForImplementation, false, "contractReadyForImplementation");
  expect(artifact.targetTable, "daily_prices", "targetTable");
  expect(artifact.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", "targetScope");
  expect(artifact.insertMode, "missing_only", "insertMode");
  expect(artifact.allowedMutationKind, "future_insert_only_after_all_gates_pass", "allowedMutationKind");
  expect(artifact.requiredConflictKey, "symbol,trade_date", "requiredConflictKey");
  expect(artifact.maxRowsPerAttempt, 178, "maxRowsPerAttempt");
  expect(artifact.nextRoute, "phase_1_write_runner_aggregate_readback_contract_no_execution", "nextRoute");

  for (const [key, expected] of Object.entries({
    fullLevel1ExpectedRows: 360,
    fullLevel1ObservedRows: 182,
    fullLevel1MissingRows: 178,
    twiiMissingRows: 60,
    etfMissingRows: 118
  })) {
    expect(artifact.targetRows?.[key], expected, `targetRows.${key}`);
  }

  for (const [key, expected] of Object.entries({
    upsertAllowed: false,
    updateAllowed: false,
    deleteAllowed: false,
    truncateAllowed: false,
    overwriteAllowed: false,
    candidateRowAcceptanceAllowedNow: false,
    dailyPricesMutationAllowedNow: false,
    supabaseWriteAllowedNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  })) {
    expect(artifact.writeBoundary?.[key], expected, `writeBoundary.${key}`);
  }

  expect(artifact.writeBoundary?.duplicateRowPolicy, "reject_or_skip_existing_rows", "duplicateRowPolicy");

  expectArray(artifact.requiredBeforeExecution, [
    "a1_etf_sanitized_candidate_artifact_path_intake_accepted",
    "twii_candidate_artifact_intake_accepted",
    "credential_presence_shape_accepted",
    "bounded_insert_missing_only_contract_accepted",
    "aggregate_readback_contract_ready",
    "rollback_or_quarantine_contract_ready",
    "post_write_review_contract_ready",
    "operator_final_go_no_go"
  ], "requiredBeforeExecution");

  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReport() {
  expect(report.status, "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready", "report status");
  expect(report.contractDecision, artifact.contractDecision, "report contractDecision");
  expect(report.contractReadyForImplementation, false, "report contractReadyForImplementation");
  expect(report.executionAllowedNow, false, "report executionAllowedNow");
  expect(report.writeGateExecutableNow, false, "report writeGateExecutableNow");
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 Write Runner Bounded Insert Missing-Only Contract",
    "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready",
    "bounded_insert_missing_only_contract_prepared_but_candidate_artifact_set_incomplete",
    "sourceIntakeStatus=phase_1_etf_sanitized_candidate_artifact_path_intake_waiting_a1_reply_no_row_payloads",
    "contractPrepared=true",
    "candidateArtifactSetComplete=false",
    "contractReadyForImplementation=false",
    "targetTable=daily_prices",
    "targetScope=twii_and_etf_phase_1_missing_row_closure_only",
    "insertMode=missing_only",
    "allowedMutationKind=future_insert_only_after_all_gates_pass",
    "requiredConflictKey=symbol,trade_date",
    "maxRowsPerAttempt=178",
    "fullLevel1ExpectedRows=360",
    "fullLevel1ObservedRows=182",
    "fullLevel1MissingRows=178",
    "twiiMissingRows=60",
    "etfMissingRows=118",
    "upsertAllowed=false",
    "updateAllowed=false",
    "deleteAllowed=false",
    "overwriteAllowed=false",
    "candidateRowAcceptanceAllowedNow=false",
    "dailyPricesMutationAllowedNow=false",
    "supabaseWriteAllowedNow=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No SQL",
    "No Supabase write",
    "No raw market data fetch",
    "No candidate row acceptance",
    "No public real-data promotion"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-write-runner-bounded-insert-missing-only-contract-no-execution"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-write-runner-bounded-insert-missing-only-contract-no-execution");
  }
  if (
    packageJson.scripts?.["check:phase-1-write-runner-bounded-insert-missing-only-contract-no-execution"] !==
    "node scripts/check-phase-1-write-runner-bounded-insert-missing-only-contract-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-runner-bounded-insert-missing-only-contract-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-bounded-insert-missing-only-contract-no-execution.mjs")) {
    problems.push("review gate missing phase 1 bounded insert contract checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-bounded-insert-missing-only-contract-no-execution"')) {
    problems.push("focused review gate missing phase 1 bounded insert contract checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 bounded insert missing-only contract slice",
    "docs/PHASE_1_WRITE_RUNNER_BOUNDED_INSERT_MISSING_ONLY_CONTRACT_NO_EXECUTION.md",
    "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready",
    "bounded_insert_missing_only_contract_prepared_but_candidate_artifact_set_incomplete",
    "candidateArtifactSetComplete=false",
    "contractReadyForImplementation=false",
    "nextRoute=phase_1_write_runner_aggregate_readback_contract_no_execution"
  ];
  for (const token of requiredTokens) if (!status.includes(token)) problems.push(`${statusPath} missing ${token}`);
}

function validateBoundaries() {
  const texts = [
    [artifactPath, artifactRaw],
    [docPath, doc],
    ["report stdout", reportRun.stdout ?? ""]
  ];
  const forbiddenPatterns = [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\.rpc\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /dailyPricesMutationAllowedNow"\s*:\s*true/u,
    /supabaseWriteAllowedNow"\s*:\s*true/u,
    /executionAllowedNow"\s*:\s*true/u,
    /writeGateExecutableNow"\s*:\s*true/u,
    /candidateRowAcceptanceAllowedNow"\s*:\s*true/u
  ];
  for (const [label, text] of texts) {
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function validateSafety(safety, label) {
  expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(safety.scoreSource, "mock", `${label}.scoreSource`);
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "rowPayloadRead",
    "rawPayloadRead",
    "rowPayloadOutput",
    "rawPayloadOutput",
    "secretsOutput",
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
