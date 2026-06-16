import fs from "node:fs";
import { spawnSync } from "node:child_process";

const candidatePath = "tmp/phase-1-sanitized-row-payload-candidate.json";
const postRunReviewPath = "data/evidence-intake/phase-1-daily-prices-bounded-write-post-run-review-2026-06-16.json";
const validatorPath = "scripts/validate-phase-1-sanitized-row-payload-candidate-artifact.mjs";
const problems = [];

const validator = runValidator();
const postRunReviewText = readText(postRunReviewPath);
const postRunReview = parseJson(postRunReviewText, postRunReviewPath);

expect(validator.status, "phase_1_sanitized_row_payload_candidate_artifact_validated_aggregate_only", "validator.status");
expect(validator.accepted, true, "validator.accepted");
expect(validator.rowCount, 178, "validator.rowCount");
expect(validator.duplicateCount, 0, "validator.duplicateCount");
expect(validator.missingRequiredFieldCount, 0, "validator.missingRequiredFieldCount");
expect(validator.forbiddenFieldCount, 0, "validator.forbiddenFieldCount");
expect(validator.invalidTradeDateCount, 0, "validator.invalidTradeDateCount");
expect(validator.invalidSourceMetadataCount, 0, "validator.invalidSourceMetadataCount");
expect(validator.invalidOptionalNumberCount, 0, "validator.invalidOptionalNumberCount");
expect(validator.safety?.publicDataSource, "mock", "validator.safety.publicDataSource");
expect(validator.safety?.scoreSource, "mock", "validator.safety.scoreSource");

for (const [symbol, count] of Object.entries({ "0050": 59, "006208": 59, TWII: 60 })) {
  expect(validator.symbolCounts?.[symbol], count, `validator.symbolCounts.${symbol}`);
}

expect(postRunReview.status, "phase_1_daily_prices_bounded_insert_missing_passed_readback", "postRunReview.status");
expect(postRunReview.candidateRowCount, 178, "postRunReview.candidateRowCount");
expect(postRunReview.existingRowsBeforeWrite, 178, "postRunReview.existingRowsBeforeWrite");
expect(postRunReview.plannedInsertRows, 0, "postRunReview.plannedInsertRows");
expect(postRunReview.insertedRows, 0, "postRunReview.insertedRows");
expect(postRunReview.skippedExistingRows, 178, "postRunReview.skippedExistingRows");
expect(postRunReview.finalRowsAfterWrite, 178, "postRunReview.finalRowsAfterWrite");
expect(postRunReview.missingRowsAfterWrite, 0, "postRunReview.missingRowsAfterWrite");
expect(postRunReview.coverageCompleteAfterWrite, true, "postRunReview.coverageCompleteAfterWrite");
expect(postRunReview.rollbackRequiredNow, false, "postRunReview.rollbackRequiredNow");
expect(postRunReview.quarantineRequiredNow, false, "postRunReview.quarantineRequiredNow");
expect(postRunReview.publicDataSource, "mock", "postRunReview.publicDataSource");
expect(postRunReview.scoreSource, "mock", "postRunReview.scoreSource");
expect(postRunReview.promotionAllowedNow, false, "postRunReview.promotionAllowedNow");
expect(postRunReview.safety?.sqlExecuted, false, "postRunReview.safety.sqlExecuted");
expect(postRunReview.safety?.marketDataFetched, false, "postRunReview.safety.marketDataFetched");
expect(postRunReview.safety?.marketDataIngested, false, "postRunReview.safety.marketDataIngested");
expect(postRunReview.safety?.rawPayloadOutput, false, "postRunReview.safety.rawPayloadOutput");
expect(postRunReview.safety?.rowPayloadOutput, false, "postRunReview.safety.rowPayloadOutput");
expect(postRunReview.safety?.stockIdPayloadOutput, false, "postRunReview.safety.stockIdPayloadOutput");
expect(postRunReview.safety?.secretsOutput, false, "postRunReview.safety.secretsOutput");
if (!Array.isArray(postRunReview.problems) || postRunReview.problems.length !== 0) {
  problems.push(`${postRunReviewPath} problems must be an empty array`);
}

for (const pattern of [
  /\bsb_secret_/iu,
  /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
  /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
  /https:\/\/[a-z0-9.-]+supabase/iu,
  /"stock_id"\s*:/u,
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
  acceptedCoverageRows: ok ? 178 : null,
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

function runValidator() {
  const run = spawnSync(process.execPath, [validatorPath, "--candidate-artifact", candidatePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`validator output unreadable: ${error.message}`);
    return {};
  }
}

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
