import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_GO_NO_GO_RECORD_NO_EXECUTION.md";
const artifactPath = "data/evidence-intake/phase-1-runtime-promotion-operator-go-no-go-record-no-execution.json";
const executionReviewCheckerPath = "scripts/check-phase-1-runtime-promotion-one-attempt-execution-review-packet-no-execution.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const doc = read(docPath);
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const executionReview = runJson(executionReviewCheckerPath);

validateDependency();
validateDocs();
validateArtifact();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_operator_go_no_go_record_no_execution_ready"
        : "phase_1_runtime_promotion_operator_go_no_go_record_no_execution_blocked",
      recordDecision: artifact.recordDecision ?? null,
      currentGoNoGoDecision: artifact.currentGoNoGoDecision ?? null,
      freshPmGoNoGoForExecutionPresent: artifact.freshPmGoNoGoForExecutionPresent === true,
      acceptedAuthorizationResponsePresent: artifact.acceptedAuthorizationResponsePresent === true,
      boundedAttemptExecutableNow: false,
      writeGateExecutableNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok ? artifact.nextRoute : "keep_mock_and_request_repair",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateDependency() {
  expect(executionReview.status, "ok", "executionReview.status");
  expect(
    executionReview.guardedStatus,
    "phase_1_runtime_promotion_one_attempt_execution_review_packet_no_execution_ready",
    "executionReview.guardedStatus"
  );
  expect(executionReview.currentAcceptedAuthorizationResponsePresent, false, "executionReview.currentAcceptedAuthorizationResponsePresent");
  expect(executionReview.boundedAttemptExecutableNow, false, "executionReview.boundedAttemptExecutableNow");
  expect(executionReview.writeGateExecutableNow, false, "executionReview.writeGateExecutableNow");
  expect(executionReview.publicDataSource, "mock", "executionReview.publicDataSource");
  expect(executionReview.scoreSource, "mock", "executionReview.scoreSource");
}

function validateDocs() {
  for (const [label, text, phrases] of [
    [
      docPath,
      doc,
      [
        "Status: `phase_1_runtime_promotion_operator_go_no_go_record_no_execution_ready`",
        "Decision: `PREPARE_OPERATOR_GO_NO_GO_RECORD_KEEP_MOCK`",
        "`currentGoNoGoDecision=NO_GO_KEEP_MOCK_WAITING_REAL_ACCEPTED_AUTHORIZATION`",
        "`freshPmGoNoGoForExecutionPresent=false`",
        "`acceptedAuthorizationResponsePresent=false`",
        "`allPreExecutionDependenciesReady=true`",
        "`recordShapePrepared=true`",
        "`boundedAttemptExecutableNow=false`",
        "`writeGateExecutableNow=false`",
        "`runnerExecutableNow=false`",
        "`promotionAllowedNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "`await_real_accepted_authorization_and_fresh_pm_go_no_go_or_keep_mock`"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Runtime Promotion Operator Go/No-Go Record",
        "phase_1_runtime_promotion_operator_go_no_go_record_no_execution_ready",
        "PREPARE_OPERATOR_GO_NO_GO_RECORD_KEEP_MOCK"
      ]
    ]
  ]) {
    for (const phrase of phrases) if (!text.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
    for (const phrase of hardStops()) if (!text.includes(phrase)) problems.push(`${label} missing hard stop: ${phrase}`);
  }
}

function validateArtifact() {
  expect(artifact.recordMode, "phase_1_runtime_promotion_operator_go_no_go_record_no_execution", "artifact.recordMode");
  expect(artifact.recordLabel, "PHASE_1_RUNTIME_PROMOTION_OPERATOR_GO_NO_GO_RECORD_NO_EXECUTION", "artifact.recordLabel");
  expect(artifact.recordDecision, "PREPARE_OPERATOR_GO_NO_GO_RECORD_KEEP_MOCK", "artifact.recordDecision");
  expect(
    artifact.sourceExecutionReviewStatus,
    "phase_1_runtime_promotion_one_attempt_execution_review_packet_no_execution_ready",
    "artifact.sourceExecutionReviewStatus"
  );
  expect(artifact.recordShapePrepared, true, "artifact.recordShapePrepared");
  expect(artifact.currentGoNoGoDecision, "NO_GO_KEEP_MOCK_WAITING_REAL_ACCEPTED_AUTHORIZATION", "artifact.currentGoNoGoDecision");
  expect(artifact.freshPmGoNoGoForExecutionPresent, false, "artifact.freshPmGoNoGoForExecutionPresent");
  expect(artifact.acceptedAuthorizationResponsePresent, false, "artifact.acceptedAuthorizationResponsePresent");
  expect(artifact.allPreExecutionDependenciesReady, true, "artifact.allPreExecutionDependenciesReady");
  expect(artifact.targetTable, "daily_prices", "artifact.targetTable");
  expect(artifact.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", "artifact.targetScope");
  expect(artifact.maxRowsPerAttempt, 178, "artifact.maxRowsPerAttempt");
  expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
  expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
  expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
  expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(artifact.nextRoute, "await_real_accepted_authorization_and_fresh_pm_go_no_go_or_keep_mock", "artifact.nextRoute");
  expectArray(
    artifact.allowedFutureDecisions,
    ["GO_ONE_BOUNDED_WRITE_ATTEMPT_AFTER_ALL_GATES_PASS", "NO_GO_KEEP_MOCK", "REPAIR_REQUIRED_KEEP_MOCK"],
    "artifact.allowedFutureDecisions"
  );
  expectArray(
    artifact.decisionRequirementsForFutureGo,
    [
      "real_accepted_bounded_write_authorization_response",
      "fresh_pm_go_no_go_recorded",
      "candidate_artifact_set_accepted",
      "server_only_credential_presence_shape_reviewed",
      "readback_required_and_aggregate_only",
      "rollback_or_quarantine_required",
      "post_run_review_required",
      "runtime_promotion_stays_separate"
    ],
    "artifact.decisionRequirementsForFutureGo"
  );

  for (const key of [
    "sqlExecuted",
    "sqlGenerated",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "stagingRowsCreated",
    "dailyPricesMutated",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "envMutated",
    "runtimeFlagMutated",
    "publicDataSourcePromoted",
    "scoreSourcePromoted",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(artifact.safety?.[key], false, `artifact.safety.${key}`);
  }
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-runtime-promotion-operator-go-no-go-record-no-execution"] !==
    "node scripts/check-phase-1-runtime-promotion-operator-go-no-go-record-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-runtime-promotion-operator-go-no-go-record-no-execution`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-operator-go-no-go-record-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing operator go/no-go record checker registration`);
  }
  if (!reviewGate.includes('"phase-1-runtime-promotion-operator-go-no-go-record-no-execution"')) {
    problems.push(`${reviewGatePath} missing operator go/no-go record focused gate name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [docPath, doc],
    [artifactPath, artifactText],
    [projectStatusPath, projectStatus]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}: ${run.stderr || run.stdout}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${scriptPath} did not emit JSON: ${error.message}`);
    return {};
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

function hardStops() {
  return [
    "SQL execution",
    "SQL generation",
    "Supabase client import",
    "Supabase read/write",
    "Supabase connection",
    "staging-row creation",
    "`daily_prices` mutation",
    "market-data fetch",
    "market-data ingestion",
    "candidate-row acceptance",
    "raw payload output",
    "row payload output",
    "stock-id payload output",
    "secret or environment value output",
    "production environment mutation",
    "runtime flag mutation",
    "`publicDataSource=supabase`",
    "`scoreSource=real`",
    "real-time precision claim",
    "complete-market coverage claim",
    "investment-advice claim"
  ];
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"boundedAttemptExecutableNow"\s*:\s*true/u,
    /"writeGateExecutableNow"\s*:\s*true/u,
    /"runnerExecutableNow"\s*:\s*true/u,
    /"promotionAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /\b(setx|vercel\s+env|supabase\s+db|psql|alter\s+table|drop\s+table)\b/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
