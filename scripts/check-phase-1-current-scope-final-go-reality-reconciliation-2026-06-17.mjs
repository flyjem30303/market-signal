import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-current-scope-final-go-reality-reconciliation-2026-06-17.json";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_FINAL_GO_REALITY_RECONCILIATION_2026_06_17.md";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const doc = read(docPath);
const projectStatus = read(projectStatusPath);

validateArtifact();
validateDoc();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;
console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_current_scope_final_go_reality_reconciled_repair_required"
    : "phase_1_current_scope_final_go_reality_reconciliation_blocked",
  reconciledFinalGoForWriteAttempt: artifact.reconciledFinalGoForWriteAttempt ?? null,
  reconciledFinalGoForKeepMockProductFinish: artifact.reconciledFinalGoForKeepMockProductFinish ?? null,
  nextRoute: artifact.acceptedNextRoute ?? null,
  publicDataSource: "mock",
  scoreSource: "mock",
  problems
}, null, 2));

if (!ok) process.exit(1);

function validateArtifact() {
  expect(artifact.packetMode, "phase_1_current_scope_final_go_reality_reconciliation", "artifact.packetMode");
  expect(artifact.status, "phase_1_current_scope_final_go_reconciled_repair_required", "artifact.status");
  expect(
    artifact.decision,
    "FINAL_GO_NOT_ALLOWED_UNTIL_CURRENT_SCOPE_CANDIDATE_AND_RUNNER_REPAIRED",
    "artifact.decision"
  );
  expect(artifact.phase1Universe, "twii_plus_listed_stock_daily_close", "artifact.phase1Universe");
  expect(artifact.scope, "twii_plus_listed_stock_daily_close", "artifact.scope");
  expect(artifact.previousFinalGoReadinessClaim, true, "artifact.previousFinalGoReadinessClaim");
  expect(artifact.reconciledFinalGoForWriteAttempt, false, "artifact.reconciledFinalGoForWriteAttempt");
  expect(artifact.reconciledFinalGoForKeepMockProductFinish, true, "artifact.reconciledFinalGoForKeepMockProductFinish");
  expect(artifact.acceptedNextRoute, "repair_current_scope_candidate_and_runner_before_any_write_final_go", "artifact.acceptedNextRoute");
  expectArrayIncludes(artifact.hardBlockers, [
    "current_scope_sanitized_row_payload_candidate_missing",
    "current_scope_executable_insert_missing_runner_missing",
    "current_scope_dry_run_against_current_payload_missing",
    "current_scope_post_run_review_bound_to_current_payload_missing"
  ], "artifact.hardBlockers");
  expectArrayIncludes(artifact.explicitlyRejectedInputs, [
    "tmp/phase-1-sanitized-row-payload-candidate.json",
    "data/candidates/tw-equity-staging-candidate.json",
    "data/candidates/phase-1-etf-sanitized-candidate.json"
  ], "artifact.explicitlyRejectedInputs");
  for (const [field, expected] of Object.entries({
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    rawPayloadIncluded: false,
    rowPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  })) {
    expect(artifact[field], expected, `artifact.${field}`);
  }
}

function validateDoc() {
  for (const phrase of [
    "Status: `phase_1_current_scope_final_go_reconciled_repair_required`",
    "Decision: `FINAL_GO_NOT_ALLOWED_UNTIL_CURRENT_SCOPE_CANDIDATE_AND_RUNNER_REPAIRED`",
    "`reconciledFinalGoForWriteAttempt=false`",
    "`reconciledFinalGoForKeepMockProductFinish=true`",
    "`repair_current_scope_candidate_and_runner_before_any_write_final_go`"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Phase 1 Current-Scope Final-Go Reality Reconciliation",
    "phase_1_current_scope_final_go_reconciled_repair_required",
    "FINAL_GO_NOT_ALLOWED_UNTIL_CURRENT_SCOPE_CANDIDATE_AND_RUNNER_REPAIRED",
    "repair_current_scope_candidate_and_runner_before_any_write_final_go"
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

function expectArrayIncludes(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  for (const item of expected) {
    if (!actual.includes(item)) problems.push(`${label} missing ${item}`);
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
    /"supabaseConnectionAttempted"\s*:\s*true/u,
    /"supabaseWriteAttempted"\s*:\s*true/u,
    /"dailyPricesMutated"\s*:\s*true/u,
    /"marketDataFetched"\s*:\s*true/u,
    /"rawPayloadIncluded"\s*:\s*true/u,
    /"rowPayloadIncluded"\s*:\s*true/u,
    /"stockIdPayloadIncluded"\s*:\s*true/u,
    /"secretsIncluded"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
