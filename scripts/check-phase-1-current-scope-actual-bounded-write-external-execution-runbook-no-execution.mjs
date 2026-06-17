import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-current-scope-actual-bounded-write-external-execution-runbook-no-execution.json";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_EXTERNAL_EXECUTION_RUNBOOK_NO_EXECUTION.md";
const finalGoCheckerPath = "scripts/check-phase-1-current-scope-actual-bounded-write-attempt-actual-execution-final-go-no-execution.mjs";
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
const finalGo = runJson(finalGoCheckerPath);

validateFinalGoDependency();
validateArtifact();
validateDoc();
validateRegistration();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;
console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution_ready"
    : "phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution_blocked",
  decision: artifact.decision ?? null,
  finalGoDependencyReady: finalGo.status === "ok",
  externalExecutionRunbookPreparedNow: ok,
  actualWriteAttemptAllowedHere: false,
  sqlExecuted: false,
  supabaseWriteAttempted: false,
  dailyPricesMutated: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  nextRoute: ok
    ? "external_operator_may_execute_one_bounded_attempt_then_post_run_review_or_keep_mock"
    : "keep_mock_and_repair_external_execution_runbook",
  problems
}, null, 2));

if (!ok) process.exit(1);

function validateFinalGoDependency() {
  expect(finalGo.status, "ok", "finalGo.status");
  expect(
    finalGo.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution_ready",
    "finalGo.guardedStatus"
  );
  expect(finalGo.actualExecutionFinalGoPreparedNow, true, "finalGo.actualExecutionFinalGoPreparedNow");
  expect(finalGo.actualExecutionFinalGoAcceptedNow, false, "finalGo.actualExecutionFinalGoAcceptedNow");
  expect(finalGo.finalExecutionAllowedNow, false, "finalGo.finalExecutionAllowedNow");
  expect(finalGo.actualWriteAttemptAllowedNow, false, "finalGo.actualWriteAttemptAllowedNow");
}

function validateArtifact() {
  expect(artifact.packetMode, "phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution", "artifact.packetMode");
  expect(
    artifact.status,
    "phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution_ready",
    "artifact.status"
  );
  expect(
    artifact.decision,
    "PREPARE_EXTERNAL_EXECUTION_RUNBOOK_KEEP_MOCK_UNTIL_POST_RUN_REVIEW",
    "artifact.decision"
  );
  expect(artifact.sourceFinalGoGuardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution_ready", "artifact.sourceFinalGoGuardedStatus");
  expect(artifact.phase1Universe, "twii_plus_listed_stock_daily_close", "artifact.phase1Universe");
  expect(artifact.scope, "twii_plus_listed_stock_daily_close", "artifact.scope");
  expect(artifact.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "artifact.operationKind");
  expect(artifact.currentRoute, "await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates", "artifact.currentRoute");
  expectArray(artifact.scopeExclusions, ["0050", "006208", "etf_all_phase_1_1"], "artifact.scopeExclusions");

  expect(artifact.operatorRunbook?.executionOwner, "CEO/PM external operator", "artifact.operatorRunbook.executionOwner");
  expect(artifact.operatorRunbook?.maxAttemptCount, 1, "artifact.operatorRunbook.maxAttemptCount");
  expect(artifact.operatorRunbook?.dryRunFirstRequired, true, "artifact.operatorRunbook.dryRunFirstRequired");
  expect(artifact.operatorRunbook?.insertMissingOnlyRequired, true, "artifact.operatorRunbook.insertMissingOnlyRequired");
  expect(artifact.operatorRunbook?.noRawPayloadAllowed, true, "artifact.operatorRunbook.noRawPayloadAllowed");
  expect(artifact.operatorRunbook?.noSecretsInArtifactAllowed, true, "artifact.operatorRunbook.noSecretsInArtifactAllowed");
  expect(artifact.operatorRunbook?.executeHere, false, "artifact.operatorRunbook.executeHere");
  expectArray(artifact.operatorRunbook?.requiredInputs, [
    "accepted_actual_execution_final_go_packet",
    "server_only_runtime_values_present_outside_repo",
    "sanitized_candidate_artifact_path",
    "explicit_execute_switch",
    "confirmation_phrase",
    "post_run_review_output_path"
  ], "artifact.operatorRunbook.requiredInputs");

  expect(artifact.postRunReview?.required, true, "artifact.postRunReview.required");
  expect(artifact.postRunReview?.aggregateOnly, true, "artifact.postRunReview.aggregateOnly");
  expect(artifact.postRunReview?.requiredTiming, "immediate_after_attempt", "artifact.postRunReview.requiredTiming");
  expectArray(artifact.postRunReview?.mustRecord, [
    "attemptId",
    "insertedRows",
    "rejectedRows",
    "duplicateRows",
    "readbackRows",
    "mutationSummary",
    "problems",
    "promotionRecommendation"
  ], "artifact.postRunReview.mustRecord");

  expect(artifact.rollbackOrQuarantine?.required, true, "artifact.rollbackOrQuarantine.required");
  expect(artifact.rollbackOrQuarantine?.defaultAction, "quarantine_then_keep_mock", "artifact.rollbackOrQuarantine.defaultAction");
  expect(artifact.rollbackOrQuarantine?.promotionBlockedUntilReview, true, "artifact.rollbackOrQuarantine.promotionBlockedUntilReview");
  expectArray(artifact.rollbackOrQuarantine?.triggerConditions, [
    "insertedRowsExceedExpected",
    "duplicateRowsNonZero",
    "readbackMismatch",
    "unexpectedSymbol",
    "unexpectedDateWindow",
    "runnerProblemNonEmpty"
  ], "artifact.rollbackOrQuarantine.triggerConditions");

  for (const [field, expected] of [
    ["actualWriteAttemptAllowedHere", false],
    ["externalExecutionRunbookPreparedNow", true],
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
    "Status: `phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution_ready`",
    "Decision: `PREPARE_EXTERNAL_EXECUTION_RUNBOOK_KEEP_MOCK_UNTIL_POST_RUN_REVIEW`",
    "Current route: `await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates`",
    "Universe: `twii_plus_listed_stock_daily_close`",
    "Excluded for Phase 1: `0050`, `006208`, `etf_all_phase_1_1`",
    "`maxAttemptCount=1`",
    "`dryRunFirstRequired=true`",
    "`insertMissingOnlyRequired=true`",
    "`actualWriteAttemptAllowedHere=false`",
    "`postRunReview.required=true`",
    "`postRunReview.aggregateOnly=true`",
    "`rollbackOrQuarantine.defaultAction=quarantine_then_keep_mock`",
    "`publicDataSource=mock`",
    "`scoreSource=mock`",
    "external_operator_may_execute_one_bounded_attempt_then_post_run_review_or_keep_mock"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-external-execution-runbook-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-external-execution-runbook-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing current-scope external execution runbook checker script`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-external-execution-runbook-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope external execution runbook checker registration`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-external-execution-runbook-no-execution"')) {
    problems.push(`${reviewGatePath} missing current-scope external execution runbook focused gate name`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Phase 1 Current-Scope Actual Bounded Write External Execution Runbook",
    "phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution_ready",
    "PREPARE_EXTERNAL_EXECUTION_RUNBOOK_KEEP_MOCK_UNTIL_POST_RUN_REVIEW",
    "external_operator_may_execute_one_bounded_attempt_then_post_run_review_or_keep_mock"
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
    /"actualWriteAttemptAllowedHere"\s*:\s*true/u,
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
