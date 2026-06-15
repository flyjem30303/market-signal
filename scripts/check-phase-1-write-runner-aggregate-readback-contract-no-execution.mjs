import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-write-runner-aggregate-readback-contract-no-execution.json";
const reportPath = "scripts/report-phase-1-write-runner-aggregate-readback-contract-no-execution.mjs";
const sourceContractPath = "data/evidence-intake/phase-1-write-runner-bounded-insert-missing-only-contract-no-execution.json";
const docPath = "docs/PHASE_1_WRITE_RUNNER_AGGREGATE_READBACK_CONTRACT_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const sourceContract = parseJson(readText(sourceContractPath), sourceContractPath);
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

validateSourceContract();
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
        ? "phase_1_write_runner_aggregate_readback_contract_no_execution_ready"
        : "phase_1_write_runner_aggregate_readback_contract_no_execution_blocked",
      readbackDecision: artifact.readbackDecision ?? null,
      readbackContractPrepared: artifact.readbackContractPrepared ?? null,
      immediateReadbackAllowedNow: artifact.immediateReadbackAllowedNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateSourceContract() {
  expect(
    sourceContract.status,
    "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready",
    "source contract status"
  );
  expect(sourceContract.contractPrepared, true, "source contractPrepared");
  expect(sourceContract.candidateArtifactSetComplete, false, "source candidateArtifactSetComplete");
  expect(sourceContract.contractReadyForImplementation, false, "source contractReadyForImplementation");
  expect(sourceContract.nextRoute, "phase_1_write_runner_aggregate_readback_contract_no_execution", "source nextRoute");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_runner_aggregate_readback_contract_no_execution_ready", "artifact status");
  expect(artifact.readbackMode, "aggregate_readback_contract_no_execution", "readbackMode");
  expect(
    artifact.sourceContractStatus,
    "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready",
    "sourceContractStatus"
  );
  expect(
    artifact.readbackDecision,
    "aggregate_readback_contract_prepared_but_write_execution_still_blocked",
    "readbackDecision"
  );
  expect(artifact.readbackContractPrepared, true, "readbackContractPrepared");
  expect(artifact.sourceContractReadyForImplementation, false, "sourceContractReadyForImplementation");
  expect(artifact.aggregateOnlyOutput, true, "aggregateOnlyOutput");
  expect(artifact.immediateReadbackAllowedNow, false, "immediateReadbackAllowedNow");
  expect(artifact.supabaseReadAllowedNow, false, "supabaseReadAllowedNow");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.implementationAllowedNow, false, "implementationAllowedNow");
  expect(artifact.nextRoute, "phase_1_write_runner_rollback_or_quarantine_contract_no_execution", "nextRoute");

  for (const [key, expected] of Object.entries({
    fullLevel1ExpectedRows: 360,
    fullLevel1ObservedRows: 182,
    fullLevel1MissingRows: 178,
    twiiMissingRows: 60,
    etfMissingRows: 118
  })) {
    expect(artifact.targetRows?.[key], expected, `targetRows.${key}`);
  }

  expectArray(artifact.allowedAggregateFields, [
    "attemptId",
    "targetScope",
    "expectedRows",
    "candidateRows",
    "insertedRows",
    "duplicateRows",
    "rejectedRows",
    "readbackRows",
    "missingRowsAfterAttempt",
    "rollbackReady",
    "startedAt",
    "finishedAt"
  ], "allowedAggregateFields");

  expectArray(artifact.forbiddenOutputShapes, [
    "row_payloads",
    "raw_payloads",
    "stock_id_payloads",
    "source_values",
    "trade_date_lists",
    "secret_values",
    "credential_values"
  ], "forbiddenOutputShapes");

  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReport() {
  expect(report.status, "phase_1_write_runner_aggregate_readback_contract_no_execution_ready", "report status");
  expect(report.readbackDecision, artifact.readbackDecision, "report readbackDecision");
  expect(report.readbackContractPrepared, true, "report readbackContractPrepared");
  expect(report.immediateReadbackAllowedNow, false, "report immediateReadbackAllowedNow");
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 Write Runner Aggregate Readback Contract",
    "phase_1_write_runner_aggregate_readback_contract_no_execution_ready",
    "aggregate_readback_contract_prepared_but_write_execution_still_blocked",
    "sourceContractStatus=phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready",
    "readbackContractPrepared=true",
    "sourceContractReadyForImplementation=false",
    "aggregateOnlyOutput=true",
    "immediateReadbackAllowedNow=false",
    "supabaseReadAllowedNow=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "fullLevel1ExpectedRows=360",
    "fullLevel1ObservedRows=182",
    "fullLevel1MissingRows=178",
    "twiiMissingRows=60",
    "etfMissingRows=118",
    "allowedAggregateFields",
    "forbiddenOutputShapes",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No SQL",
    "No Supabase read",
    "No Supabase write",
    "No row payload output",
    "No raw payload output",
    "No public real-data promotion"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-write-runner-aggregate-readback-contract-no-execution"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-write-runner-aggregate-readback-contract-no-execution");
  }
  if (
    packageJson.scripts?.["check:phase-1-write-runner-aggregate-readback-contract-no-execution"] !==
    "node scripts/check-phase-1-write-runner-aggregate-readback-contract-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-runner-aggregate-readback-contract-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-aggregate-readback-contract-no-execution.mjs")) {
    problems.push("review gate missing phase 1 aggregate readback contract checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-aggregate-readback-contract-no-execution"')) {
    problems.push("focused review gate missing phase 1 aggregate readback contract checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 aggregate readback contract slice",
    "docs/PHASE_1_WRITE_RUNNER_AGGREGATE_READBACK_CONTRACT_NO_EXECUTION.md",
    "phase_1_write_runner_aggregate_readback_contract_no_execution_ready",
    "aggregate_readback_contract_prepared_but_write_execution_still_blocked",
    "aggregateOnlyOutput=true",
    "immediateReadbackAllowedNow=false",
    "nextRoute=phase_1_write_runner_rollback_or_quarantine_contract_no_execution"
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
    /supabaseReadAllowedNow"\s*:\s*true/u,
    /executionAllowedNow"\s*:\s*true/u,
    /writeGateExecutableNow"\s*:\s*true/u,
    /rowPayloadOutput"\s*:\s*true/u,
    /rawPayloadOutput"\s*:\s*true/u
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
    "supabaseReadAttempted",
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
