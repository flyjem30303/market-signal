import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_FRESH_PM_GO_NO_GO_AFTER_INPUT_CONVERGENCE_NO_EXECUTION.md";
const artifactPath =
  "data/evidence-intake/phase-1-runtime-promotion-fresh-pm-go-no-go-after-input-convergence-no-execution.json";
const runnerCheckerPath = "scripts/check-phase-1-write-runner-implementation-candidate.mjs";
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
const runnerCheck = runJson(runnerCheckerPath);

validateDependency();
validateDoc();
validateArtifact();
validateRegistration();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_fresh_pm_go_no_go_after_input_convergence_no_execution_ready"
        : "phase_1_runtime_promotion_fresh_pm_go_no_go_after_input_convergence_no_execution_blocked",
      recordDecision: artifact.recordDecision ?? null,
      freshPmGoNoGoForExecutionPresent: artifact.freshPmGoNoGoForExecutionPresent === true,
      acceptedAuthorizationResponsePresent: artifact.acceptedAuthorizationResponsePresent === true,
      preRunInputsConverged: artifact.preRunInputsConverged === true,
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
  expect(runnerCheck.status, "ok", "runnerCheck.status");
  expect(
    runnerCheck.guardedStatus,
    "phase_1_write_runner_implementation_candidate_blocked_no_execution_ready",
    "runnerCheck.guardedStatus"
  );
  expect(
    runnerCheck.convergedNextRoute,
    "fresh_pm_go_no_go_required_after_candidate_and_authorization_validation",
    "runnerCheck.convergedNextRoute"
  );
  expect(runnerCheck.publicDataSource, "mock", "runnerCheck.publicDataSource");
  expect(runnerCheck.scoreSource, "mock", "runnerCheck.scoreSource");
}

function validateDoc() {
  for (const phrase of [
    "Status: `phase_1_runtime_promotion_fresh_pm_go_no_go_after_input_convergence_no_execution_ready`",
    "Decision: `GO_PREPARE_ONE_BOUNDED_WRITE_ATTEMPT_EXECUTION_PACKET_KEEP_MOCK`",
    "`freshPmGoNoGoForExecutionPresent=true`",
    "`acceptedAuthorizationResponsePresent=true`",
    "`candidateArtifactSetAccepted=true`",
    "`serverOnlyCredentialPresenceReviewed=true`",
    "`readbackRequiredAndAggregateOnly=true`",
    "`rollbackOrQuarantineRequired=true`",
    "`postRunReviewRequired=true`",
    "`runtimePromotionStaysSeparate=true`",
    "`preRunInputsConverged=true`",
    "`rowCount=178`",
    "`authorizationOperatorDecision=APPROVE_ONE_BOUNDED_WRITE_ATTEMPT`",
    "`boundedAttemptAuthorizedForNextPacket=true`",
    "`boundedAttemptExecutableNow=false`",
    "`writeGateExecutableNow=false`",
    "`runnerExecutableNow=false`",
    "`promotionAllowedNow=false`",
    "`publicDataSource=mock`",
    "`scoreSource=mock`",
    "`prepare_final_bounded_write_execution_packet_no_execution`"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

function validateArtifact() {
  expect(
    artifact.recordMode,
    "phase_1_runtime_promotion_fresh_pm_go_no_go_after_input_convergence_no_execution",
    "artifact.recordMode"
  );
  expect(
    artifact.recordLabel,
    "PHASE_1_RUNTIME_PROMOTION_FRESH_PM_GO_NO_GO_AFTER_INPUT_CONVERGENCE_NO_EXECUTION",
    "artifact.recordLabel"
  );
  expect(artifact.recordDecision, "GO_PREPARE_ONE_BOUNDED_WRITE_ATTEMPT_EXECUTION_PACKET_KEEP_MOCK", "artifact.recordDecision");
  expect(artifact.sourceRunnerStatus, "phase_1_write_runner_implementation_candidate_ready_for_separate_review", "artifact.sourceRunnerStatus");
  for (const key of [
    "freshPmGoNoGoForExecutionPresent",
    "acceptedAuthorizationResponsePresent",
    "candidateArtifactSetAccepted",
    "serverOnlyCredentialPresenceReviewed",
    "readbackRequiredAndAggregateOnly",
    "rollbackOrQuarantineRequired",
    "postRunReviewRequired",
    "runtimePromotionStaysSeparate",
    "preRunInputsConverged"
  ]) {
    expect(artifact[key], true, `artifact.${key}`);
  }
  expect(artifact.localEvidencePathPolicy?.mustStayGitIgnored, true, "artifact.localEvidencePathPolicy.mustStayGitIgnored");
  expect(artifact.localEvidencePathPolicy?.mustNotBeCommitted, true, "artifact.localEvidencePathPolicy.mustNotBeCommitted");
  expect(artifact.localEvidencePathPolicy?.rawPayloadCommitAllowed, false, "artifact.localEvidencePathPolicy.rawPayloadCommitAllowed");
  expect(artifact.localEvidencePathPolicy?.rowPayloadCommitAllowed, false, "artifact.localEvidencePathPolicy.rowPayloadCommitAllowed");
  expect(
    artifact.localEvidencePathPolicy?.acceptedAuthorizationResponseCommitAllowed,
    false,
    "artifact.localEvidencePathPolicy.acceptedAuthorizationResponseCommitAllowed"
  );
  expect(artifact.validatedAggregateEvidence?.rowCount, 178, "artifact.validatedAggregateEvidence.rowCount");
  expect(artifact.validatedAggregateEvidence?.symbolCounts?.TWII, 60, "artifact.validatedAggregateEvidence.symbolCounts.TWII");
  expect(artifact.validatedAggregateEvidence?.symbolCounts?.["0050"], 59, "artifact.validatedAggregateEvidence.symbolCounts.0050");
  expect(artifact.validatedAggregateEvidence?.symbolCounts?.["006208"], 59, "artifact.validatedAggregateEvidence.symbolCounts.006208");
  expect(artifact.validatedAggregateEvidence?.duplicateCount, 0, "artifact.validatedAggregateEvidence.duplicateCount");
  expect(artifact.validatedAggregateEvidence?.missingRequiredFieldCount, 0, "artifact.validatedAggregateEvidence.missingRequiredFieldCount");
  expect(artifact.validatedAggregateEvidence?.forbiddenFieldCount, 0, "artifact.validatedAggregateEvidence.forbiddenFieldCount");
  expect(artifact.validatedAggregateEvidence?.invalidTradeDateCount, 0, "artifact.validatedAggregateEvidence.invalidTradeDateCount");
  expect(
    artifact.validatedAggregateEvidence?.authorizationOperatorDecision,
    "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT",
    "artifact.validatedAggregateEvidence.authorizationOperatorDecision"
  );
  expect(artifact.allowedNextStep, "prepare_final_bounded_write_execution_packet_no_execution", "artifact.allowedNextStep");
  expect(artifact.targetTable, "daily_prices", "artifact.targetTable");
  expect(artifact.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", "artifact.targetScope");
  expect(artifact.maxRowsPerAttempt, 178, "artifact.maxRowsPerAttempt");
  expect(artifact.boundedAttemptAuthorizedForNextPacket, true, "artifact.boundedAttemptAuthorizedForNextPacket");
  expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
  expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
  expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
  expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(artifact.nextRoute, "prepare_final_bounded_write_execution_packet_no_execution", "artifact.nextRoute");

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
    pkg.scripts?.["check:phase-1-runtime-promotion-fresh-pm-go-no-go-after-input-convergence-no-execution"] !==
    "node scripts/check-phase-1-runtime-promotion-fresh-pm-go-no-go-after-input-convergence-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing fresh PM go/no-go checker script`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-fresh-pm-go-no-go-after-input-convergence-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing fresh PM go/no-go checker registration`);
  }
  if (!reviewGate.includes('"phase-1-runtime-promotion-fresh-pm-go-no-go-after-input-convergence-no-execution"')) {
    problems.push(`${reviewGatePath} missing fresh PM go/no-go focused gate name`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Runtime Promotion Fresh PM Go/No-Go After Input Convergence",
    "phase_1_runtime_promotion_fresh_pm_go_no_go_after_input_convergence_no_execution_ready",
    "GO_PREPARE_ONE_BOUNDED_WRITE_ATTEMPT_EXECUTION_PACKET_KEEP_MOCK"
  ]) {
    if (!projectStatus.includes(phrase)) problems.push(`${projectStatusPath} missing phrase: ${phrase}`);
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
