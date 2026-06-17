import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-current-scope-final-go-readiness-summary-no-execution.json";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_FINAL_GO_READINESS_SUMMARY_NO_EXECUTION.md";
const sourceCheckerPath = "scripts/check-phase-1-current-scope-actual-bounded-write-post-run-review-intake-no-execution.mjs";
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
const source = runJson(sourceCheckerPath);

validateSource();
validateArtifact();
validateDoc();
validateRegistration();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;
console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_current_scope_final_go_readiness_summary_no_execution_ready"
    : "phase_1_current_scope_final_go_readiness_summary_no_execution_blocked",
  decision: artifact.decision ?? null,
  finalGoReadinessReached: artifact.finalGoReadinessReached === true,
  nextDecision: ok ? "choose_write_attempt_or_keep_mock_product_finish" : "repair_final_go_readiness_summary",
  sqlExecuted: false,
  supabaseWriteAttempted: false,
  dailyPricesMutated: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  problems
}, null, 2));

if (!ok) process.exit(1);

function validateSource() {
  expect(source.status, "ok", "source.status");
  expect(
    source.guardedStatus,
    "phase_1_current_scope_actual_bounded_write_post_run_review_intake_no_execution_ready",
    "source.guardedStatus"
  );
  expect(source.postRunReviewIntakePreparedNow, true, "source.postRunReviewIntakePreparedNow");
  expect(source.externalAttemptExecutedHere, false, "source.externalAttemptExecutedHere");
}

function validateArtifact() {
  expect(artifact.packetMode, "phase_1_current_scope_final_go_readiness_summary_no_execution", "artifact.packetMode");
  expect(artifact.status, "phase_1_current_scope_final_go_readiness_summary_no_execution_ready", "artifact.status");
  expect(
    artifact.decision,
    "FINAL_GO_READINESS_REACHED_CHOOSE_WRITE_ATTEMPT_OR_KEEP_MOCK_PRODUCT_FINISH",
    "artifact.decision"
  );
  expect(artifact.sourcePostRunReviewIntakeStatus, "phase_1_current_scope_actual_bounded_write_post_run_review_intake_no_execution_ready", "artifact.sourcePostRunReviewIntakeStatus");
  expect(artifact.phase1Universe, "twii_plus_listed_stock_daily_close", "artifact.phase1Universe");
  expect(artifact.scope, "twii_plus_listed_stock_daily_close", "artifact.scope");
  expect(artifact.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "artifact.operationKind");
  expectArray(artifact.completedNoExecutionChain, [
    "actual_execution_final_go_packet",
    "external_execution_runbook",
    "aggregate_post_run_review_intake"
  ], "artifact.completedNoExecutionChain");
  expect(artifact.finalGoReadinessReached, true, "artifact.finalGoReadinessReached");
  expectArray(artifact.remainingChoices, [
    "execute_one_bounded_write_attempt_then_post_run_review",
    "keep_mock_and_finish_phase_1_public_product"
  ], "artifact.remainingChoices");
  expect(artifact.ceoRecommendation, "stop_adding_no_execution_gates_and_choose_one_remaining_route", "artifact.ceoRecommendation");
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
    "Status: `phase_1_current_scope_final_go_readiness_summary_no_execution_ready`",
    "Decision: `FINAL_GO_READINESS_REACHED_CHOOSE_WRITE_ATTEMPT_OR_KEEP_MOCK_PRODUCT_FINISH`",
    "Source post-run review intake: `phase_1_current_scope_actual_bounded_write_post_run_review_intake_no_execution_ready`",
    "`finalGoReadinessReached=true`",
    "`execute_one_bounded_write_attempt_then_post_run_review`",
    "`keep_mock_and_finish_phase_1_public_product`",
    "CEO recommendation: `stop_adding_no_execution_gates_and_choose_one_remaining_route`",
    "`publicDataSource=mock`",
    "`scoreSource=mock`"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-current-scope-final-go-readiness-summary-no-execution"] !==
    "node scripts/check-phase-1-current-scope-final-go-readiness-summary-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing final go readiness summary checker script`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-final-go-readiness-summary-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing final go readiness summary checker registration`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-final-go-readiness-summary-no-execution"')) {
    problems.push(`${reviewGatePath} missing final go readiness summary focused gate name`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Phase 1 Current-Scope Final Go Readiness Summary",
    "phase_1_current_scope_final_go_readiness_summary_no_execution_ready",
    "FINAL_GO_READINESS_REACHED_CHOOSE_WRITE_ATTEMPT_OR_KEEP_MOCK_PRODUCT_FINISH",
    "choose_write_attempt_or_keep_mock_product_finish"
  ]) {
    if (!projectStatus.includes(phrase)) problems.push(`${projectStatusPath} missing phrase: ${phrase}`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [[artifactPath, artifactText], [docPath, doc], [projectStatusPath, projectStatus]]) {
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
    /"sqlExecuted"\s*:\s*true/u,
    /"supabaseWriteAttempted"\s*:\s*true/u,
    /"dailyPricesMutated"\s*:\s*true/u,
    /"marketDataFetched"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
