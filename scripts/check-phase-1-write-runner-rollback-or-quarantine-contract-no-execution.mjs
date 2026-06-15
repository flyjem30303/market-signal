import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-write-runner-rollback-or-quarantine-contract-no-execution.json";
const reportPath = "scripts/report-phase-1-write-runner-rollback-or-quarantine-contract-no-execution.mjs";
const sourceReadbackPath = "data/evidence-intake/phase-1-write-runner-aggregate-readback-contract-no-execution.json";
const docPath = "docs/PHASE_1_WRITE_RUNNER_ROLLBACK_OR_QUARANTINE_CONTRACT_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const sourceReadback = parseJson(readText(sourceReadbackPath), sourceReadbackPath);
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

validateSourceReadback();
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
        ? "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready"
        : "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_blocked",
      recoveryDecision: artifact.recoveryDecision ?? null,
      rollbackOrQuarantinePrepared: artifact.rollbackOrQuarantinePrepared ?? null,
      automaticRepairAllowedNow: artifact.automaticRepairAllowedNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateSourceReadback() {
  expect(
    sourceReadback.status,
    "phase_1_write_runner_aggregate_readback_contract_no_execution_ready",
    "source readback status"
  );
  expect(sourceReadback.readbackContractPrepared, true, "source readbackContractPrepared");
  expect(sourceReadback.aggregateOnlyOutput, true, "source aggregateOnlyOutput");
  expect(sourceReadback.nextRoute, "phase_1_write_runner_rollback_or_quarantine_contract_no_execution", "source nextRoute");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready", "artifact status");
  expect(artifact.recoveryMode, "rollback_or_quarantine_contract_no_execution", "recoveryMode");
  expect(
    artifact.sourceReadbackStatus,
    "phase_1_write_runner_aggregate_readback_contract_no_execution_ready",
    "sourceReadbackStatus"
  );
  expect(
    artifact.recoveryDecision,
    "rollback_or_quarantine_contract_prepared_but_write_execution_still_blocked",
    "recoveryDecision"
  );
  expect(artifact.rollbackOrQuarantinePrepared, true, "rollbackOrQuarantinePrepared");
  expect(artifact.automaticRepairAllowedNow, false, "automaticRepairAllowedNow");
  expect(artifact.automaticRetryAllowedNow, false, "automaticRetryAllowedNow");
  expect(artifact.overwriteRepairAllowedNow, false, "overwriteRepairAllowedNow");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.implementationAllowedNow, false, "implementationAllowedNow");
  expect(artifact.nextRoute, "phase_1_write_runner_post_write_review_contract_no_execution", "nextRoute");

  expectArray(artifact.stopConditions, [
    "readback_rows_mismatch",
    "duplicate_rows_gt_zero",
    "rejected_rows_gt_zero",
    "missing_rows_after_attempt_not_zero",
    "unexpected_table_or_scope",
    "supabase_error_or_timeout",
    "operator_abort"
  ], "stopConditions");

  expectArray(artifact.allowedRecoveryActions, [
    "stop_public_promotion",
    "keep_publicDataSource_mock",
    "keep_scoreSource_mock",
    "write_post_run_review",
    "record_aggregate_failure_only",
    "prepare_human_repair_decision"
  ], "allowedRecoveryActions");

  expectArray(artifact.forbiddenRecoveryActions, [
    "automatic_second_write_attempt",
    "upsert_existing_rows",
    "overwrite_existing_rows",
    "delete_existing_rows",
    "truncate_table",
    "print_row_payloads",
    "print_raw_payloads",
    "print_secrets"
  ], "forbiddenRecoveryActions");

  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReport() {
  expect(report.status, "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready", "report status");
  expect(report.recoveryDecision, artifact.recoveryDecision, "report recoveryDecision");
  expect(report.rollbackOrQuarantinePrepared, true, "report rollbackOrQuarantinePrepared");
  expect(report.automaticRepairAllowedNow, false, "report automaticRepairAllowedNow");
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 Write Runner Rollback Or Quarantine Contract",
    "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready",
    "rollback_or_quarantine_contract_prepared_but_write_execution_still_blocked",
    "sourceReadbackStatus=phase_1_write_runner_aggregate_readback_contract_no_execution_ready",
    "rollbackOrQuarantinePrepared=true",
    "automaticRepairAllowedNow=false",
    "automaticRetryAllowedNow=false",
    "overwriteRepairAllowedNow=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "stopConditions",
    "allowedRecoveryActions",
    "forbiddenRecoveryActions",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No automatic second write attempt",
    "No overwrite repair",
    "No row payload output",
    "No public real-data promotion"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-write-runner-rollback-or-quarantine-contract-no-execution"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-write-runner-rollback-or-quarantine-contract-no-execution");
  }
  if (
    packageJson.scripts?.["check:phase-1-write-runner-rollback-or-quarantine-contract-no-execution"] !==
    "node scripts/check-phase-1-write-runner-rollback-or-quarantine-contract-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-runner-rollback-or-quarantine-contract-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-rollback-or-quarantine-contract-no-execution.mjs")) {
    problems.push("review gate missing phase 1 rollback or quarantine contract checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-rollback-or-quarantine-contract-no-execution"')) {
    problems.push("focused review gate missing phase 1 rollback or quarantine contract checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 rollback or quarantine contract slice",
    "docs/PHASE_1_WRITE_RUNNER_ROLLBACK_OR_QUARANTINE_CONTRACT_NO_EXECUTION.md",
    "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready",
    "rollback_or_quarantine_contract_prepared_but_write_execution_still_blocked",
    "automaticRepairAllowedNow=false",
    "nextRoute=phase_1_write_runner_post_write_review_contract_no_execution"
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
    /automaticRepairAllowedNow"\s*:\s*true/u,
    /automaticRetryAllowedNow"\s*:\s*true/u,
    /overwriteRepairAllowedNow"\s*:\s*true/u,
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
    "automaticSecondWriteAttempt",
    "overwriteRepairAttempted",
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
