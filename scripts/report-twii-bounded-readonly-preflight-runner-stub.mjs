import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_RUNNER_STUB.md";
const attemptId = "twii-readonly-preflight-stub-20260609";
const candidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";
const summaryPath = `tmp/twii-bounded-readonly-preflight-stub-${attemptId}.json`;
const problems = [];

const doc = read(docPath);

for (const phrase of [
  "Status: `twii_bounded_readonly_preflight_runner_stub_ready_fail_closed`",
  "twii_bounded_readonly_preflight_candidate_design_ready",
  "run:twii-bounded-readonly-preflight-once",
  "report:twii-bounded-readonly-preflight-post-run-review",
  "twii_bounded_readonly_preflight_stub_blocked_confirmation_required",
  "blocked_fail_closed_no_remote_attempt",
  "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE",
  "No SQL",
  "No Supabase connection",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const run = runJson([
  "scripts/run-twii-bounded-readonly-preflight-once.mjs",
  "--attempt-id",
  attemptId,
  "--candidate-artifact-path",
  candidateArtifactPath,
  "--mode",
  "aggregate-only-readonly"
]);
if (run.status !== "twii_bounded_readonly_preflight_stub_blocked_confirmation_required") {
  problems.push("runner stub must default to confirmation-required blocked status");
}
if (run.outcome !== "blocked_fail_closed_no_remote_attempt") {
  problems.push("runner stub default outcome must be blocked fail-closed no remote attempt");
}
assertRunnerSafety(run.safety, "runner safety");

const review = runJson([
  "scripts/report-twii-bounded-readonly-preflight-post-run-review.mjs",
  "--summary-path",
  summaryPath
]);
if (review.status !== "twii_bounded_readonly_preflight_post_run_review_accepted_fail_closed_stub") {
  problems.push("post-run review must accept fail-closed stub summary");
}
if (review.outcome !== "accepted_fail_closed_stub_no_remote_attempt") {
  problems.push("post-run review outcome must be accepted fail-closed stub");
}
assertReviewSafety(review.safety, "review safety");

const ready = problems.length === 0;
const report = {
  status: ready ? "twii_bounded_readonly_preflight_runner_stub_ready_fail_closed" : "blocked",
  outcome: ready ? "accepted_fail_closed_runner_stub_no_remote_attempt" : "blocked",
  docPath,
  attemptId,
  candidateArtifactPath,
  summaryPath,
  runnerStatus: run.status ?? null,
  postRunReviewStatus: review.status ?? null,
  nextRecommendedSlice: "twii_bounded_readonly_preflight_authorization_packet",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseConnectionAllowed: false,
    supabaseReadAllowedByThisStub: false,
    supabaseWriteAllowed: false,
    marketDataFetchAllowed: false,
    marketDataIngestAllowed: false,
    dailyPricesMutationAllowed: false,
    stagingRowsAllowed: false,
    candidateRowsAcceptanceAllowed: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutputAllowed: false,
    rowPayloadOutputAllowed: false,
    stockIdPayloadOutputAllowed: false,
    secretOutputAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ready) process.exit(1);

function runJson(args) {
  const child = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let parsed = {};
  try {
    parsed = JSON.parse(child.stdout ?? "{}");
  } catch {
    problems.push(`${args[0]} stdout is not valid JSON`);
  }
  if (child.status !== 0) problems.push(`${args[0]} failed`);
  return parsed;
}

function assertRunnerSafety(safety, label) {
  const requiredFalse = [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ];
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of requiredFalse) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function assertReviewSafety(safety, label) {
  if (safety?.publicDataSource !== "mock" || safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseConnectionAllowed",
    "supabaseReadAllowedByThisReview",
    "supabaseWriteAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety?.[key] !== false) problems.push(`${label}.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
