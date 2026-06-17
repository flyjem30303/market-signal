import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-current-scope-write-closure-final-go-judgement-2026-06-17.json";
const postRunReviewPath = "data/evidence-intake/phase-1-current-scope-bounded-insert-missing-post-run-review-2026-06-17.json";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_WRITE_CLOSURE_FINAL_GO_JUDGEMENT_2026_06_17.md";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const postRunReview = parseJson(read(postRunReviewPath), postRunReviewPath);
const doc = read(docPath);
const projectStatus = read(projectStatusPath);

validateArtifact();
validateAgainstPostRunReview();
validateDoc();
validateProjectStatus();
validateBoundaries();

const ok = problems.length === 0;
console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_current_scope_write_closure_final_go_judgement_ready"
    : "phase_1_current_scope_write_closure_final_go_judgement_blocked",
  currentScopeWriteClosureFinalGo: artifact.currentScopeWriteClosureFinalGo ?? null,
  runtimePromotionFinalGo: artifact.runtimePromotionFinalGo ?? null,
  coverageCompleteAfterWrite: artifact.coverageCompleteAfterWrite ?? null,
  publicDataSource: artifact.publicDataSource ?? null,
  scoreSource: artifact.scoreSource ?? null,
  nextRoute: artifact.nextRoute ?? null,
  problems
}, null, 2));

if (!ok) process.exit(1);

function validateArtifact() {
  expect(artifact.packetMode, "phase_1_current_scope_write_closure_final_go_judgement", "artifact.packetMode");
  expect(artifact.status, "phase_1_current_scope_write_closure_final_go_judgement_ready", "artifact.status");
  expect(
    artifact.decision,
    "CURRENT_SCOPE_WRITE_CLOSURE_READY_FOR_FINAL_GO_JUDGEMENT_KEEP_RUNTIME_MOCK",
    "artifact.decision"
  );
  expect(artifact.phase1Universe, "twii_plus_listed_stock_daily_close", "artifact.phase1Universe");
  expect(artifact.scope, "twii_plus_listed_stock_daily_close", "artifact.scope");
  expect(artifact.targetTable, "daily_prices", "artifact.targetTable");
  expect(artifact.candidateAndRunnerReady, true, "artifact.candidateAndRunnerReady");
  expect(artifact.legacyEtfPacketExcluded, true, "artifact.legacyEtfPacketExcluded");
  expect(artifact.dryRunAndGuardChecksPassed, true, "artifact.dryRunAndGuardChecksPassed");
  expect(artifact.postRunReviewAccepted, true, "artifact.postRunReviewAccepted");
  expect(artifact.candidateRows, 240, "artifact.candidateRows");
  expect(artifact.symbolsCoveredCount, 4, "artifact.symbolsCoveredCount");
  expect(artifact.dateBounds?.minTradeDate, "2026-03-11", "artifact.dateBounds.minTradeDate");
  expect(artifact.dateBounds?.maxTradeDate, "2026-06-15", "artifact.dateBounds.maxTradeDate");
  expect(artifact.plannedInsertRows, 0, "artifact.plannedInsertRows");
  expect(artifact.insertedRows, 0, "artifact.insertedRows");
  expect(artifact.skippedExistingRows, 240, "artifact.skippedExistingRows");
  expect(artifact.finalRowsAfterWrite, 240, "artifact.finalRowsAfterWrite");
  expect(artifact.missingRowsAfterWrite, 0, "artifact.missingRowsAfterWrite");
  expect(artifact.coverageCompleteAfterWrite, true, "artifact.coverageCompleteAfterWrite");
  expect(artifact.currentScopeWriteClosureFinalGo, true, "artifact.currentScopeWriteClosureFinalGo");
  expect(artifact.runtimePromotionFinalGo, false, "artifact.runtimePromotionFinalGo");
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(artifact.sourcePromotion, false, "artifact.sourcePromotion");
  expect(artifact.scorePromotion, false, "artifact.scorePromotion");
  expect(artifact.sqlExecutedInThisJudgement, false, "artifact.sqlExecutedInThisJudgement");
  expect(artifact.supabaseWriteAttemptedInThisJudgement, false, "artifact.supabaseWriteAttemptedInThisJudgement");
  expect(artifact.dailyPricesMutatedInThisJudgement, false, "artifact.dailyPricesMutatedInThisJudgement");
  expect(artifact.marketDataFetchedInThisJudgement, false, "artifact.marketDataFetchedInThisJudgement");
  expect(artifact.rawPayloadOutput, false, "artifact.rawPayloadOutput");
  expect(artifact.rowPayloadOutput, false, "artifact.rowPayloadOutput");
  expect(artifact.stockIdPayloadOutput, false, "artifact.stockIdPayloadOutput");
  expect(artifact.secretsOutput, false, "artifact.secretsOutput");
  expectArrayIncludes(artifact.explicitlyRejectedInputs, [
    "tmp/phase-1-sanitized-row-payload-candidate.json",
    "data/candidates/tw-equity-staging-candidate.json",
    "data/candidates/phase-1-etf-sanitized-candidate.json"
  ], "artifact.explicitlyRejectedInputs");
  expectArrayIncludes(artifact.acceptedEvidence, [
    "check:phase-1-current-scope-sanitized-row-payload-candidate-artifact-validator",
    "check:phase-1-current-scope-local-candidate-assembly",
    "check:phase-1-current-scope-bounded-insert-missing-runner",
    "check:phase-1-current-scope-bounded-insert-missing-post-run-review-2026-06-17",
    "check:phase-1-runtime-promotion-preflight-status",
    "check:phase-1-runtime-promotion-explicit-go-no-go-decision"
  ], "artifact.acceptedEvidence");
  expectArray(artifact.problems, [], "artifact.problems");
  expect(
    artifact.nextRoute,
    "current_scope_write_closure_can_stop_or_continue_runtime_promotion_review",
    "artifact.nextRoute"
  );
}

function validateAgainstPostRunReview() {
  expect(postRunReview.status, "phase_1_current_scope_bounded_insert_missing_passed_readback", "postRunReview.status");
  expect(postRunReview.boundedAttemptScope, artifact.scope, "postRunReview.boundedAttemptScope");
  expect(postRunReview.targetTable, artifact.targetTable, "postRunReview.targetTable");
  expect(postRunReview.candidateRows, artifact.candidateRows, "postRunReview.candidateRows");
  expect(postRunReview.symbolsCoveredCount, artifact.symbolsCoveredCount, "postRunReview.symbolsCoveredCount");
  expect(postRunReview.plannedInsertRows, artifact.plannedInsertRows, "postRunReview.plannedInsertRows");
  expect(postRunReview.insertedRows, artifact.insertedRows, "postRunReview.insertedRows");
  expect(postRunReview.skippedExistingRows, artifact.skippedExistingRows, "postRunReview.skippedExistingRows");
  expect(postRunReview.finalRowsAfterWrite, artifact.finalRowsAfterWrite, "postRunReview.finalRowsAfterWrite");
  expect(postRunReview.missingRowsAfterWrite, artifact.missingRowsAfterWrite, "postRunReview.missingRowsAfterWrite");
  expect(postRunReview.coverageCompleteAfterWrite, artifact.coverageCompleteAfterWrite, "postRunReview.coverageCompleteAfterWrite");
  expect(postRunReview.publicDataSource, "mock", "postRunReview.publicDataSource");
  expect(postRunReview.scoreSource, "mock", "postRunReview.scoreSource");
}

function validateDoc() {
  for (const phrase of [
    "Status: `phase_1_current_scope_write_closure_final_go_judgement_ready`",
    "Decision: `CURRENT_SCOPE_WRITE_CLOSURE_READY_FOR_FINAL_GO_JUDGEMENT_KEEP_RUNTIME_MOCK`",
    "Current-scope write closure final-go: `true`",
    "Runtime promotion final-go: `false`",
    "`current_scope_write_closure_can_stop_or_continue_runtime_promotion_review`"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

function validateProjectStatus() {
  for (const phrase of [
    "Latest Phase 1 Current-Scope Write Closure Final-Go Judgement",
    "phase_1_current_scope_write_closure_final_go_judgement_ready",
    "CURRENT_SCOPE_WRITE_CLOSURE_READY_FOR_FINAL_GO_JUDGEMENT_KEEP_RUNTIME_MOCK",
    "current_scope_write_closure_can_stop_or_continue_runtime_promotion_review"
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
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"rawPayload"\s*:/iu,
    /"rowPayload"\s*:/iu,
    /"stockIds"\s*:/iu,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
