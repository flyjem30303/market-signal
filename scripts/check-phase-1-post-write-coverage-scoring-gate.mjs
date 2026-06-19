import fs from "node:fs";

const postRunReviewPath =
  "data/evidence-intake/phase-1-current-scope-bounded-insert-missing-post-run-review-2026-06-19-shard-001.json";
const problems = [];

const postRunReviewText = readText(postRunReviewPath);
const postRunReview = parseJson(postRunReviewText, postRunReviewPath);

expect(postRunReview.packetMode, "phase_1_current_scope_bounded_insert_missing_post_run_review", "postRunReview.packetMode");
expect(postRunReview.status, "phase_1_current_scope_bounded_insert_missing_passed_readback", "postRunReview.status");
expect(postRunReview.candidateRows, 500, "postRunReview.candidateRows");
expect(postRunReview.maxRows, 500, "postRunReview.maxRows");
expect(postRunReview.existingRowsBeforeWrite, 63, "postRunReview.existingRowsBeforeWrite");
expect(postRunReview.plannedInsertRows, 437, "postRunReview.plannedInsertRows");
expect(postRunReview.insertedRows, 437, "postRunReview.insertedRows");
expect(postRunReview.skippedExistingRows, 63, "postRunReview.skippedExistingRows");
expect(postRunReview.finalRowsAfterWrite, 500, "postRunReview.finalRowsAfterWrite");
expect(postRunReview.missingRowsAfterWrite, 0, "postRunReview.missingRowsAfterWrite");
expect(postRunReview.coverageCompleteAfterWrite, true, "postRunReview.coverageCompleteAfterWrite");
expect(postRunReview.writeSucceeded, true, "postRunReview.writeSucceeded");
expect(postRunReview.publicDataSource, "mock", "postRunReview.publicDataSource");
expect(postRunReview.scoreSource, "mock", "postRunReview.scoreSource");
expect(postRunReview.sqlExecuted, false, "postRunReview.sqlExecuted");
expect(postRunReview.marketDataFetched, false, "postRunReview.marketDataFetched");
expect(postRunReview.marketDataIngested, false, "postRunReview.marketDataIngested");
expect(postRunReview.rawPayloadOutput, false, "postRunReview.rawPayloadOutput");
expect(postRunReview.rowPayloadOutput, false, "postRunReview.rowPayloadOutput");
expect(postRunReview.stockIdPayloadOutput, false, "postRunReview.stockIdPayloadOutput");
expect(postRunReview.secretsOutput, false, "postRunReview.secretsOutput");
expect(postRunReview.sourcePromotion, false, "postRunReview.sourcePromotion");
expect(postRunReview.scorePromotion, false, "postRunReview.scorePromotion");
expect(postRunReview.updateAttempted, false, "postRunReview.updateAttempted");
expect(postRunReview.upsertAttempted, false, "postRunReview.upsertAttempted");
expect(postRunReview.deleteAttempted, false, "postRunReview.deleteAttempted");
expect(postRunReview.insertOnlyMissingKeys, true, "postRunReview.insertOnlyMissingKeys");
if (!Array.isArray(postRunReview.problems) || postRunReview.problems.length !== 0) {
  problems.push(`${postRunReviewPath} problems must be an empty array`);
}

for (const pattern of [
  /\bsb_secret_/iu,
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
  /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
  /https:\/\/[a-z0-9.-]+supabase/iu,
  /"stock_id"\s*:/u,
  /"stockIds"\s*:/u,
  /"rawPayload"\s*:/u,
  /"rowBody"\s*:/u,
  /publicDataSource"\s*:\s*"supabase"/u,
  /scoreSource"\s*:\s*"real"/u,
  /guaranteed return/iu,
  /buy now/iu
]) {
  if (pattern.test(postRunReviewText)) problems.push(`${postRunReviewPath} contains forbidden pattern ${pattern}`);
}

const ok = problems.length === 0;
const output = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_post_write_coverage_scoring_gate_ready_for_runtime_promotion_review"
    : "phase_1_post_write_coverage_scoring_gate_blocked",
  acceptedCoverageRows: ok ? 500 : null,
  insertedRows: ok ? 437 : null,
  skippedExistingRows: ok ? 63 : null,
  finalCandidateKeyRows: ok ? 500 : null,
  missingRowsAfterWrite: ok ? 0 : null,
  rowCoverageScoringAccepted: ok,
  runtimePromotionAllowedNow: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  nextRoute: ok
    ? "phase_1_runtime_promotion_gate_preflight_mock_to_supabase_review"
    : "repair_phase_1_post_write_coverage_evidence_before_promotion_review",
  safety: {
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    marketDataFetched: false,
    marketDataIngested: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    sourcePromotion: false,
    scorePromotion: false
  },
  problems
};

console.log(JSON.stringify(output, null, 2));
if (!ok) process.exit(1);

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, filePath) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${filePath} JSON parse failed: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}
