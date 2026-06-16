import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_ONE_ATTEMPT_EXECUTION_REVIEW_PACKET_NO_EXECUTION.md";
const artifactPath = "data/evidence-intake/phase-1-runtime-promotion-one-attempt-execution-review-packet-no-execution.json";
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

const dependencyCheckers = [
  {
    key: "check:phase-1-runtime-promotion-bounded-write-authorization-response-branch-fixtures",
    scriptPath: "scripts/check-phase-1-runtime-promotion-bounded-write-authorization-response-branch-fixtures.mjs",
    expectedStatus: "phase_1_runtime_promotion_bounded_write_authorization_response_branch_fixtures_ready_no_execution"
  },
  {
    key: "check:phase-1-runtime-promotion-one-bounded-write-attempt-runner-preparation-no-execution",
    scriptPath: "scripts/check-phase-1-runtime-promotion-one-bounded-write-attempt-runner-preparation-no-execution.mjs",
    expectedStatus: "phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution_ready"
  },
  {
    key: "check:phase-1-sanitized-row-payload-candidate-validator",
    scriptPath: "scripts/check-phase-1-sanitized-row-payload-candidate-validator.mjs",
    expectedStatus: "phase_1_sanitized_row_payload_candidate_validator_ready_no_committed_market_rows"
  },
  {
    key: "check:phase-1-write-runner-credential-presence-shape-checker-no-secret-values",
    scriptPath: "scripts/check-phase-1-write-runner-credential-presence-shape-checker-no-secret-values.mjs",
    expectedStatus: "phase_1_write_runner_credential_presence_shape_checker_no_secret_values_ready"
  },
  {
    key: "check:phase-1-write-runner-bounded-insert-missing-only-contract-no-execution",
    scriptPath: "scripts/check-phase-1-write-runner-bounded-insert-missing-only-contract-no-execution.mjs",
    expectedStatus: "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready"
  },
  {
    key: "check:phase-1-write-runner-aggregate-readback-contract-no-execution",
    scriptPath: "scripts/check-phase-1-write-runner-aggregate-readback-contract-no-execution.mjs",
    expectedStatus: "phase_1_write_runner_aggregate_readback_contract_no_execution_ready"
  },
  {
    key: "check:phase-1-write-runner-rollback-or-quarantine-contract-no-execution",
    scriptPath: "scripts/check-phase-1-write-runner-rollback-or-quarantine-contract-no-execution.mjs",
    expectedStatus: "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready"
  },
  {
    key: "check:phase-1-write-runner-post-write-review-contract-no-execution",
    scriptPath: "scripts/check-phase-1-write-runner-post-write-review-contract-no-execution.mjs",
    expectedStatus: "phase_1_write_runner_post_write_review_contract_no_execution_ready"
  }
];

const dependencyStatuses = [];
for (const checker of dependencyCheckers) {
  if (pkg.scripts?.[checker.key] !== `node ${checker.scriptPath}`) problems.push(`${packagePath} missing ${checker.key}`);
  if (!reviewGate.includes(checker.scriptPath)) problems.push(`${reviewGatePath} missing ${checker.scriptPath}`);
  const result = runJson(checker.scriptPath);
  expect(result.status, "ok", `${checker.key}.status`);
  expect(result.guardedStatus, checker.expectedStatus, `${checker.key}.guardedStatus`);
  dependencyStatuses.push(result.guardedStatus);
}

validateDocs();
validateArtifact(dependencyStatuses);
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_one_attempt_execution_review_packet_no_execution_ready"
        : "phase_1_runtime_promotion_one_attempt_execution_review_packet_no_execution_blocked",
      reviewDecision: artifact.reviewDecision ?? null,
      acceptedAuthorizationBranchProven: artifact.acceptedAuthorizationBranchProven === true,
      currentAcceptedAuthorizationResponsePresent: artifact.currentAcceptedAuthorizationResponsePresent === true,
      executionReviewPacketPrepared: artifact.executionReviewPacketPrepared === true,
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

function validateDocs() {
  for (const [label, text, phrases] of [
    [
      docPath,
      doc,
      [
        "Status: `phase_1_runtime_promotion_one_attempt_execution_review_packet_no_execution_ready`",
        "Decision: `PREPARE_ONE_ATTEMPT_EXECUTION_REVIEW_KEEP_MOCK`",
        "`targetTable=daily_prices`",
        "`targetScope=twii_and_etf_phase_1_missing_row_closure_only`",
        "`maxRowsPerAttempt=178`",
        "`acceptedAuthorizationBranchProven=true`",
        "`currentAcceptedAuthorizationResponsePresent=false`",
        "`executionReviewPacketPrepared=true`",
        "`boundedAttemptExecutableNow=false`",
        "`writeGateExecutableNow=false`",
        "`runnerExecutableNow=false`",
        "`promotionAllowedNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "`await_real_accepted_bounded_write_authorization_response_or_keep_mock`"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Runtime Promotion One-Attempt Execution Review Packet",
        "phase_1_runtime_promotion_one_attempt_execution_review_packet_no_execution_ready",
        "PREPARE_ONE_ATTEMPT_EXECUTION_REVIEW_KEEP_MOCK"
      ]
    ]
  ]) {
    for (const phrase of phrases) if (!text.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
    for (const phrase of hardStops()) if (!text.includes(phrase)) problems.push(`${label} missing hard stop: ${phrase}`);
  }
}

function validateArtifact(expectedStatuses) {
  expect(artifact.packetMode, "phase_1_runtime_promotion_one_attempt_execution_review_packet_no_execution", "artifact.packetMode");
  expect(
    artifact.packetLabel,
    "PHASE_1_RUNTIME_PROMOTION_ONE_ATTEMPT_EXECUTION_REVIEW_PACKET_NO_EXECUTION",
    "artifact.packetLabel"
  );
  expect(artifact.reviewDecision, "PREPARE_ONE_ATTEMPT_EXECUTION_REVIEW_KEEP_MOCK", "artifact.reviewDecision");
  expect(
    artifact.sourceBranchFixtureStatus,
    "phase_1_runtime_promotion_bounded_write_authorization_response_branch_fixtures_ready_no_execution",
    "artifact.sourceBranchFixtureStatus"
  );
  expect(
    artifact.sourceRunnerPreparationStatus,
    "phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution_ready",
    "artifact.sourceRunnerPreparationStatus"
  );
  expect(artifact.acceptedAuthorizationBranchProven, true, "artifact.acceptedAuthorizationBranchProven");
  expect(artifact.currentAcceptedAuthorizationResponsePresent, false, "artifact.currentAcceptedAuthorizationResponsePresent");
  expect(artifact.executionReviewPacketPrepared, true, "artifact.executionReviewPacketPrepared");
  expect(artifact.targetTable, "daily_prices", "artifact.targetTable");
  expect(artifact.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", "artifact.targetScope");
  expect(artifact.maxRowsPerAttempt, 178, "artifact.maxRowsPerAttempt");
  expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
  expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
  expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
  expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(artifact.nextRoute, "await_real_accepted_bounded_write_authorization_response_or_keep_mock", "artifact.nextRoute");

  expectArray(
    artifact.requiredGateInputs,
    [
      "accepted_bounded_write_authorization_response",
      "phase_1_sanitized_row_payload_candidate_validator",
      "phase_1_write_runner_credential_presence_shape_checker_no_secret_values",
      "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution",
      "phase_1_write_runner_aggregate_readback_contract_no_execution",
      "phase_1_write_runner_rollback_or_quarantine_contract_no_execution",
      "phase_1_write_runner_post_write_review_contract_no_execution",
      "fresh_pm_go_no_go"
    ],
    "artifact.requiredGateInputs"
  );
  expectArray(artifact.requiredGateStatuses, expectedStatuses, "artifact.requiredGateStatuses");
  expectArray(
    artifact.reviewOutcomeRequiredBeforeExecution,
    [
      "candidate_artifact_set_accepted",
      "server_only_credential_presence_shape_reviewed",
      "readback_required_and_aggregate_only",
      "rollback_or_quarantine_required",
      "post_run_review_required",
      "runtime_promotion_stays_separate",
      "fresh_pm_go_no_go_recorded"
    ],
    "artifact.reviewOutcomeRequiredBeforeExecution"
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
    pkg.scripts?.["check:phase-1-runtime-promotion-one-attempt-execution-review-packet-no-execution"] !==
    "node scripts/check-phase-1-runtime-promotion-one-attempt-execution-review-packet-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-runtime-promotion-one-attempt-execution-review-packet-no-execution`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-one-attempt-execution-review-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing one-attempt execution review checker registration`);
  }
  if (!reviewGate.includes('"phase-1-runtime-promotion-one-attempt-execution-review-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing one-attempt execution review focused gate name`);
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
