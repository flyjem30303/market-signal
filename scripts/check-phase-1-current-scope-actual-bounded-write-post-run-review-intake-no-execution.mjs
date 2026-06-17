import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-current-scope-actual-bounded-write-post-run-review-intake-no-execution.json";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_POST_RUN_REVIEW_INTAKE_NO_EXECUTION.md";
const runbookCheckerPath = "scripts/check-phase-1-current-scope-actual-bounded-write-external-execution-runbook-no-execution.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const runbook = runJson(runbookCheckerPath);

validateRunbookDependency();
validateArtifact();
validateDoc();
validateRegistration();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;
console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_current_scope_actual_bounded_write_post_run_review_intake_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_post_run_review_intake_no_execution_blocked",
  decision: artifact.decision ?? null,
  runbookDependencyReady: runbook.status === "ok",
  postRunReviewIntakePreparedNow: ok,
  externalAttemptExecutedHere: false,
  sqlExecuted: false,
  supabaseWriteAttempted: false,
  dailyPricesMutated: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  nextRoute: ok
    ? "await_external_aggregate_post_run_review_or_keep_mock"
    : "keep_mock_and_repair_post_run_review_intake",
  problems
}, null, 2));

if (!ok) process.exit(1);

function validateRunbookDependency() {
  expect(runbook.status, "ok", "runbook.status");
  expect(
    runbook.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution_ready",
    "runbook.guardedStatus"
  );
  expect(runbook.externalExecutionRunbookPreparedNow, true, "runbook.externalExecutionRunbookPreparedNow");
  expect(runbook.actualWriteAttemptAllowedHere, false, "runbook.actualWriteAttemptAllowedHere");
}

function validateArtifact() {
  expect(artifact.packetMode, "phase_1_current_scope_actual_bounded_write_post_run_review_intake_no_execution", "artifact.packetMode");
  expect(
    artifact.status,
    "phase_1_current_scope_actual_bounded_write_post_run_review_intake_no_execution_ready",
    "artifact.status"
  );
  expect(
    artifact.decision,
    "PREPARE_AGGREGATE_POST_RUN_REVIEW_INTAKE_KEEP_MOCK",
    "artifact.decision"
  );
  expect(artifact.sourceRunbookGuardedStatus, "phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution_ready", "artifact.sourceRunbookGuardedStatus");
  expect(artifact.phase1Universe, "twii_plus_listed_stock_daily_close", "artifact.phase1Universe");
  expect(artifact.scope, "twii_plus_listed_stock_daily_close", "artifact.scope");
  expect(artifact.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "artifact.operationKind");
  expect(artifact.intakeMode, "aggregate_only_external_result", "artifact.intakeMode");
  expect(artifact.externalAttemptExecutedHere, false, "artifact.externalAttemptExecutedHere");
  expect(artifact.postRunReviewIntakePreparedNow, true, "artifact.postRunReviewIntakePreparedNow");

  expectArray(artifact.acceptedReviewFields, [
    "attemptId",
    "attemptStatus",
    "insertedRows",
    "rejectedRows",
    "duplicateRows",
    "readbackRows",
    "mutationSummary",
    "problemCount",
    "promotionRecommendation",
    "rollbackOrQuarantineDecision"
  ], "artifact.acceptedReviewFields");
  expectArray(artifact.rejectedReviewFields, [
    "rawPayload",
    "rowPayload",
    "stockIds",
    "secrets",
    "envValues",
    "serviceRoleKey",
    "sqlText"
  ], "artifact.rejectedReviewFields");

  expect(artifact.acceptanceRules?.aggregateOnly, true, "artifact.acceptanceRules.aggregateOnly");
  expect(artifact.acceptanceRules?.promotionDefault, "keep_mock_until_accepted_review", "artifact.acceptanceRules.promotionDefault");
  expect(artifact.acceptanceRules?.quarantineOnProblemCountGreaterThanZero, true, "artifact.acceptanceRules.quarantineOnProblemCountGreaterThanZero");
  expect(artifact.acceptanceRules?.rejectIfDuplicateRowsNonZero, true, "artifact.acceptanceRules.rejectIfDuplicateRowsNonZero");
  expect(artifact.acceptanceRules?.rejectIfReadbackMismatch, true, "artifact.acceptanceRules.rejectIfReadbackMismatch");

  for (const [field, expected] of [
    ["sqlExecuted", false],
    ["supabaseWriteAttempted", false],
    ["dailyPricesMutated", false],
    ["marketDataFetched", false],
    ["rawPayloadIncluded", false],
    ["rowPayloadIncluded", false],
    ["stockIdPayloadIncluded", false],
    ["secretsIncluded", false],
    ["publicDataSource", "mock"],
    ["scoreSource", "mock"]
  ]) {
    expect(artifact[field], expected, `artifact.${field}`);
  }
}

function validateDoc() {
  for (const phrase of [
    "Status: `phase_1_current_scope_actual_bounded_write_post_run_review_intake_no_execution_ready`",
    "Decision: `PREPARE_AGGREGATE_POST_RUN_REVIEW_INTAKE_KEEP_MOCK`",
    "Source runbook: `phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution_ready`",
    "Universe: `twii_plus_listed_stock_daily_close`",
    "Intake mode: `aggregate_only_external_result`",
    "`externalAttemptExecutedHere=false`",
    "`postRunReviewIntakePreparedNow=true`",
    "`promotionDefault=keep_mock_until_accepted_review`",
    "`quarantineOnProblemCountGreaterThanZero=true`",
    "`publicDataSource=mock`",
    "`scoreSource=mock`",
    "await_external_aggregate_post_run_review_or_keep_mock"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-post-run-review-intake-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-post-run-review-intake-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing current-scope post-run review intake checker script`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-post-run-review-intake-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope post-run review intake checker registration`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-post-run-review-intake-no-execution"')) {
    problems.push(`${reviewGatePath} missing current-scope post-run review intake focused gate name`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Phase 1 Current-Scope Actual Bounded Write Post-Run Review Intake",
    "phase_1_current_scope_actual_bounded_write_post_run_review_intake_no_execution_ready",
    "PREPARE_AGGREGATE_POST_RUN_REVIEW_INTAKE_KEEP_MOCK",
    "await_external_aggregate_post_run_review_or_keep_mock"
  ]) {
    if (!projectStatus.includes(phrase)) problems.push(`${projectStatusPath} missing phrase: ${phrase}`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [artifactPath, artifactText],
    [docPath, doc],
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

function forbiddenPatterns() {
  return [
    /from\s+["']@supabase\/supabase-js["']/iu,
    /createClient\s*\(/iu,
    /\.from\s*\(/iu,
    /\.insert\s*\(/iu,
    /\.update\s*\(/iu,
    /\.delete\s*\(/iu,
    /\.upsert\s*\(/iu,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"externalAttemptExecutedHere"\s*:\s*true/u,
    /"sqlExecuted"\s*:\s*true/u,
    /"supabaseWriteAttempted"\s*:\s*true/u,
    /"dailyPricesMutated"\s*:\s*true/u,
    /"marketDataFetched"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /\b(setx|vercel\s+env|supabase\s+db|psql|alter\s+table|drop\s+table)\b/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
