import fs from "node:fs";
import { spawnSync } from "node:child_process";

const candidatePath = "tmp/phase-1-sanitized-row-payload-candidate.json";
const postRunReviewPath = "docs/reviews/PHASE_1_DAILY_PRICES_BOUNDED_WRITE_POST_RUN_REVIEW_2026-06-16_A.md";
const validatorPath = "scripts/validate-phase-1-sanitized-row-payload-candidate-artifact.mjs";
const problems = [];

const validator = runValidator();
const postRunReview = readText(postRunReviewPath);

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

for (const phrase of [
  "Status: `phase_1_daily_prices_bounded_insert_missing_passed_readback`.",
  "- Candidate rows: `178`.",
  "- Existing rows before write: `2`.",
  "- Planned insert rows: `176`.",
  "- Inserted rows: `176`.",
  "- Skipped existing rows: `2`.",
  "- Final candidate-key rows after write: `178`.",
  "- Missing rows after write: `0`.",
  "- Coverage complete after write: `true`.",
  "- SQL executed: `false`.",
  "- Market-data fetch: `false`.",
  "- Market-data ingestion: `false`.",
  "- Raw payload output: `false`.",
  "- Row payload output: `false`.",
  "- Stock id output: `false`.",
  "- Secret output: `false`.",
  "- Public data source: `mock`.",
  "- Score source: `mock`.",
  "- `none`."
]) {
  if (!postRunReview.includes(phrase)) problems.push(`${postRunReviewPath} missing phrase: ${phrase}`);
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
  if (pattern.test(postRunReview)) problems.push(`${postRunReviewPath} contains forbidden pattern ${pattern}`);
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

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}
