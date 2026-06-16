import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_ONE_BOUNDED_WRITE_ATTEMPT_RUNNER_PREPARATION_NO_EXECUTION.md";
const artifactPath = "data/evidence-intake/phase-1-runtime-promotion-one-bounded-write-attempt-runner-preparation-no-execution.json";
const authorizationCheckerPath = "scripts/check-phase-1-runtime-promotion-bounded-write-authorization-response-intake-validator.mjs";
const runnerCandidateCheckerPath = "scripts/check-phase-1-write-runner-implementation-candidate.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const authorization = runJson(authorizationCheckerPath);
const runnerCandidate = runJson(runnerCandidateCheckerPath);

for (const phrase of [
  "Status: `phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution_ready`",
  "Decision: `PREPARE_FAIL_CLOSED_RUNNER_SHAPE_KEEP_MOCK`",
  "`sourceAuthorizationIntakeStatus=phase_1_runtime_promotion_bounded_write_authorization_response_intake_validator_ready_no_execution`",
  "`runnerDecision=PREPARE_FAIL_CLOSED_RUNNER_SHAPE_KEEP_MOCK`",
  "`authorizationAcceptedForNextPreparation=false`",
  "`runnerShapePrepared=true`",
  "`existingRunnerCandidateChecker=check:phase-1-write-runner-implementation-candidate`",
  "`existingRunnerCandidateStatus=phase_1_write_runner_implementation_candidate_blocked_no_execution_ready`",
  "`targetTable=daily_prices`",
  "`targetScope=twii_and_etf_phase_1_missing_row_closure_only`",
  "`maxRowsPerAttempt=178`",
  "`boundedAttemptExecutableNow=false`",
  "`writeGateExecutableNow=false`",
  "`runnerExecutableNow=false`",
  "`promotionAllowedNow=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`await_accepted_bounded_write_authorization_response_or_keep_mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of hardStops()) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

expect(authorization.status, "ok", "authorization.status");
expect(
  authorization.guardedStatus,
  "phase_1_runtime_promotion_bounded_write_authorization_response_intake_validator_ready_no_execution",
  "authorization.guardedStatus"
);
expect(authorization.authorizationAcceptedForNextPreparation, false, "authorization.authorizationAcceptedForNextPreparation");
expect(authorization.nextRoute, "keep_mock_and_request_repair", "authorization.nextRoute");

expect(runnerCandidate.status, "ok", "runnerCandidate.status");
expect(
  runnerCandidate.guardedStatus,
  "phase_1_write_runner_implementation_candidate_blocked_no_execution_ready",
  "runnerCandidate.guardedStatus"
);

expect(artifact.packetMode, "phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution", "artifact.packetMode");
expect(
  artifact.packetLabel,
  "PHASE_1_RUNTIME_PROMOTION_ONE_BOUNDED_WRITE_ATTEMPT_RUNNER_PREPARATION_NO_EXECUTION",
  "artifact.packetLabel"
);
expect(
  artifact.sourceAuthorizationIntakeStatus,
  "phase_1_runtime_promotion_bounded_write_authorization_response_intake_validator_ready_no_execution",
  "artifact.sourceAuthorizationIntakeStatus"
);
expect(artifact.runnerDecision, "PREPARE_FAIL_CLOSED_RUNNER_SHAPE_KEEP_MOCK", "artifact.runnerDecision");
expect(artifact.authorizationAcceptedForNextPreparation, false, "artifact.authorizationAcceptedForNextPreparation");
expect(artifact.runnerShapePrepared, true, "artifact.runnerShapePrepared");
expect(artifact.existingRunnerCandidateChecker, "check:phase-1-write-runner-implementation-candidate", "artifact.existingRunnerCandidateChecker");
expect(
  artifact.existingRunnerCandidateStatus,
  "phase_1_write_runner_implementation_candidate_blocked_no_execution_ready",
  "artifact.existingRunnerCandidateStatus"
);
expect(artifact.targetTable, "daily_prices", "artifact.targetTable");
expect(artifact.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", "artifact.targetScope");
expect(artifact.maxRowsPerAttempt, 178, "artifact.maxRowsPerAttempt");
expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
expect(artifact.scoreSource, "mock", "artifact.scoreSource");
expect(artifact.nextRoute, "await_accepted_bounded_write_authorization_response_or_keep_mock", "artifact.nextRoute");

expectArray(
  artifact.requiredBeforeExecution,
  [
    "accepted_bounded_write_authorization_response",
    "valid_sanitized_row_payload_candidate_artifact",
    "server_only_credential_presence_shape_check",
    "bounded_insert_missing_only_contract_ready",
    "aggregate_readback_contract_ready",
    "rollback_or_quarantine_contract_ready",
    "post_write_review_contract_ready",
    "fresh_pm_go_no_go"
  ],
  "artifact.requiredBeforeExecution"
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

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-one-bounded-write-attempt-runner-preparation-no-execution"] !==
  "node scripts/check-phase-1-runtime-promotion-one-bounded-write-attempt-runner-preparation-no-execution.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-one-bounded-write-attempt-runner-preparation-no-execution`);
}

if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-one-bounded-write-attempt-runner-preparation-no-execution.mjs")) {
  problems.push(`${reviewGatePath} missing one bounded write attempt runner preparation checker registration`);
}
if (!reviewGate.includes('"phase-1-runtime-promotion-one-bounded-write-attempt-runner-preparation-no-execution"')) {
  problems.push(`${reviewGatePath} missing one bounded write attempt runner preparation focused gate name`);
}

for (const [label, text] of [
  [docPath, doc],
  [artifactPath, artifactText]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
  }
}

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution_ready"
        : "phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution_blocked",
      runnerDecision: artifact.runnerDecision ?? null,
      authorizationAcceptedForNextPreparation: artifact.authorizationAcceptedForNextPreparation === true,
      runnerShapePrepared: artifact.runnerShapePrepared === true,
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

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${scriptPath} did not emit JSON: ${error.message}`);
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
    /"authorizationAcceptedForNextPreparation"\s*:\s*true/u,
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
