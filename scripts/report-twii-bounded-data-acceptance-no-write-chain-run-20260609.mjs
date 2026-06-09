import fs from "node:fs";

const packetDrivenSummaryPath =
  "tmp\\twii-bounded-data-acceptance-20260609-a\\twii-bounded-packet-driven-chain-twii-bounded-data-acceptance-20260609-a.json";
const attemptSummaryPath =
  "tmp\\twii-bounded-data-acceptance-20260609-a\\twii-bounded-data-acceptance-attempt-twii-bounded-data-acceptance-20260609-a.json";
const postRunReviewPath =
  "tmp\\twii-bounded-data-acceptance-20260609-a\\twii-bounded-data-acceptance-post-run-review-twii-bounded-data-acceptance-20260609-a.json";

const problems = [];
const packetDriven = readJson(packetDrivenSummaryPath);
const attempt = readJson(attemptSummaryPath);
const review = readJson(postRunReviewPath);

if (packetDriven.status !== "twii_bounded_data_acceptance_packet_driven_chain_completed_no_write") {
  problems.push("packet_driven_chain_not_completed_no_write");
}
if (packetDriven.outcome !== "accepted_no_write_packet_driven_chain") {
  problems.push("packet_driven_chain_outcome_not_accepted");
}
if (attempt.status !== "twii_bounded_data_acceptance_attempt_dry_run_ready_no_write") {
  problems.push("attempt_summary_not_no_write_ready");
}
if (review.status !== "twii_bounded_data_acceptance_post_run_review_accepted_no_write") {
  problems.push("post_run_review_not_accepted_no_write");
}
assertPacketDrivenSafety(packetDriven);
assertAttemptSafety(attempt);
assertReviewSafety(review);

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_bounded_data_acceptance_no_write_chain_run_20260609_accepted" : "blocked",
  outcome: ok ? "accepted_no_write_chain_with_post_run_review" : "blocked",
  mode: "twii_bounded_data_acceptance_no_write_chain_run_record",
  owner: "CEO/PM",
  attemptId: "twii-bounded-data-acceptance-20260609-a",
  evidencePaths: {
    packetDrivenSummaryPath,
    attemptSummaryPath,
    postRunReviewPath
  },
  reviewedStatuses: {
    packetDrivenStatus: packetDriven.status ?? null,
    packetDrivenOutcome: packetDriven.outcome ?? null,
    attemptStatus: attempt.status ?? null,
    postRunReviewStatus: review.status ?? null,
    postRunReviewOutcome: review.outcome ?? null
  },
  nextAction: ok
    ? "CEO/PM may decide the next separate bounded gate; real write, scoring, promotion, and scoreSource=real remain blocked."
    : "Repair the no-write chain evidence before opening any later bounded gate.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push(`${filePath} must exist and contain valid JSON`);
    return {};
  }
}

function assertPacketDrivenSafety(output) {
  assertMock(output, "packet driven summary");
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`packetDriven.safety.${key}_must_be_false`);
  }
}

function assertAttemptSafety(output) {
  assertMock(output, "attempt summary");
  if (output.dryRunResult?.candidateRowsAcceptedNow !== false) problems.push("attempt_candidate_rows_must_not_be_accepted");
  if (output.dryRunResult?.dailyPricesMutated !== false) problems.push("attempt_daily_prices_must_not_mutate");
  if (output.dryRunResult?.rowCoverageScoringAllowed !== false) problems.push("attempt_row_coverage_must_not_score");
}

function assertReviewSafety(output) {
  assertMock(output, "post-run review");
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`review.safety.${key}_must_be_false`);
  }
}

function assertMock(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label}_must_stay_mock`);
  }
}

