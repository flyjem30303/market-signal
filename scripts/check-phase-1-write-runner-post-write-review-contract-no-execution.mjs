import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-write-runner-post-write-review-contract-no-execution.json";
const reportPath = "scripts/report-phase-1-write-runner-post-write-review-contract-no-execution.mjs";
const sourceRecoveryPath = "data/evidence-intake/phase-1-write-runner-rollback-or-quarantine-contract-no-execution.json";
const docPath = "docs/PHASE_1_WRITE_RUNNER_POST_WRITE_REVIEW_CONTRACT_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const sourceRecovery = parseJson(readText(sourceRecoveryPath), sourceRecoveryPath);
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

validateSourceRecovery();
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
        ? "phase_1_write_runner_post_write_review_contract_no_execution_ready"
        : "phase_1_write_runner_post_write_review_contract_no_execution_blocked",
      reviewDecision: artifact.reviewDecision ?? null,
      postWriteReviewPrepared: artifact.postWriteReviewPrepared ?? null,
      promotionAllowedNow: artifact.promotionAllowedNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateSourceRecovery() {
  expect(
    sourceRecovery.status,
    "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready",
    "source recovery status"
  );
  expect(sourceRecovery.rollbackOrQuarantinePrepared, true, "source rollbackOrQuarantinePrepared");
  expect(sourceRecovery.automaticRepairAllowedNow, false, "source automaticRepairAllowedNow");
  expect(sourceRecovery.nextRoute, "phase_1_write_runner_post_write_review_contract_no_execution", "source nextRoute");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_write_runner_post_write_review_contract_no_execution_ready", "artifact status");
  expect(artifact.reviewMode, "post_write_review_contract_no_execution", "reviewMode");
  expect(
    artifact.sourceRecoveryStatus,
    "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready",
    "sourceRecoveryStatus"
  );
  expect(
    artifact.reviewDecision,
    "post_write_review_contract_prepared_but_write_execution_still_blocked",
    "reviewDecision"
  );
  expect(artifact.postWriteReviewPrepared, true, "postWriteReviewPrepared");
  expect(artifact.aggregateOnlyReview, true, "aggregateOnlyReview");
  expect(artifact.promotionAllowedNow, false, "promotionAllowedNow");
  expect(artifact.publicDataSourcePromotionAllowedNow, false, "publicDataSourcePromotionAllowedNow");
  expect(artifact.scoreSourceRealPromotionAllowedNow, false, "scoreSourceRealPromotionAllowedNow");
  expect(artifact.executionAllowedNow, false, "executionAllowedNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.implementationAllowedNow, false, "implementationAllowedNow");
  expect(artifact.nextRoute, "phase_1_write_runner_candidate_artifact_set_acceptance_gate", "nextRoute");

  expectArray(artifact.requiredReviewSections, [
    "attempt_identity",
    "operator_decision",
    "candidate_artifact_set_status",
    "bounded_insert_summary",
    "aggregate_readback_summary",
    "rollback_or_quarantine_decision",
    "runtime_promotion_go_no_go",
    "public_disclosure_state",
    "next_action"
  ], "requiredReviewSections");

  expectArray(artifact.allowedReviewFields, [
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
    "promotionDecision",
    "publicDataSource",
    "scoreSource",
    "nextRoute"
  ], "allowedReviewFields");

  expectArray(artifact.forbiddenReviewFields, [
    "row_payloads",
    "raw_payloads",
    "trade_date_lists",
    "stock_id_payloads",
    "source_values",
    "credential_values",
    "secret_values",
    "investment_recommendations"
  ], "forbiddenReviewFields");

  validateSafety(artifact.safety ?? {}, "artifact.safety");
}

function validateReport() {
  expect(report.status, "phase_1_write_runner_post_write_review_contract_no_execution_ready", "report status");
  expect(report.reviewDecision, artifact.reviewDecision, "report reviewDecision");
  expect(report.postWriteReviewPrepared, true, "report postWriteReviewPrepared");
  expect(report.promotionAllowedNow, false, "report promotionAllowedNow");
}

function validateDoc() {
  const requiredTokens = [
    "Phase 1 Write Runner Post-Write Review Contract",
    "phase_1_write_runner_post_write_review_contract_no_execution_ready",
    "post_write_review_contract_prepared_but_write_execution_still_blocked",
    "sourceRecoveryStatus=phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready",
    "postWriteReviewPrepared=true",
    "aggregateOnlyReview=true",
    "promotionAllowedNow=false",
    "publicDataSourcePromotionAllowedNow=false",
    "scoreSourceRealPromotionAllowedNow=false",
    "executionAllowedNow=false",
    "writeGateExecutableNow=false",
    "implementationAllowedNow=false",
    "requiredReviewSections",
    "allowedReviewFields",
    "forbiddenReviewFields",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No row payload output",
    "No raw payload output",
    "No public real-data promotion",
    "No investment advice"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["report:phase-1-write-runner-post-write-review-contract-no-execution"] !==
    `node ${reportPath}`
  ) {
    problems.push("package.json missing report:phase-1-write-runner-post-write-review-contract-no-execution");
  }
  if (
    packageJson.scripts?.["check:phase-1-write-runner-post-write-review-contract-no-execution"] !==
    "node scripts/check-phase-1-write-runner-post-write-review-contract-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-write-runner-post-write-review-contract-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-write-runner-post-write-review-contract-no-execution.mjs")) {
    problems.push("review gate missing phase 1 post-write review contract checker");
  }
  if (!reviewGate.includes('"phase-1-write-runner-post-write-review-contract-no-execution"')) {
    problems.push("focused review gate missing phase 1 post-write review contract checker");
  }
}

function validateStatus() {
  const requiredTokens = [
    "Latest Phase 1 post-write review contract slice",
    "docs/PHASE_1_WRITE_RUNNER_POST_WRITE_REVIEW_CONTRACT_NO_EXECUTION.md",
    "phase_1_write_runner_post_write_review_contract_no_execution_ready",
    "post_write_review_contract_prepared_but_write_execution_still_blocked",
    "promotionAllowedNow=false",
    "nextRoute=phase_1_write_runner_candidate_artifact_set_acceptance_gate"
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
    /promotionAllowedNow"\s*:\s*true/u,
    /publicDataSourcePromotionAllowedNow"\s*:\s*true/u,
    /scoreSourceRealPromotionAllowedNow"\s*:\s*true/u,
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
