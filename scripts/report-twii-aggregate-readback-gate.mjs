import { spawnSync } from "node:child_process";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH;
const postRun = runPostRunReview(candidatePath);
const postRunCompleted =
  postRun.statusCode === 0 &&
  postRun.output?.status === "twii_report_only_local_runner_post_run_review_completed_aggregate_only";
const aggregateSummary = postRun.output?.runnerSummary?.aggregateSummary ?? {};

const report = {
  status: postRunCompleted
    ? "twii_aggregate_readback_gate_ready_for_candidate_acceptance_review"
    : "twii_aggregate_readback_gate_blocked_local_runner_not_complete",
  ok: true,
  mode: "twii_aggregate_readback_gate",
  owner: "PM/CEO",
  postRunCompleted,
  aggregateReadback: {
    lane: aggregateSummary.lane ?? "unknown",
    symbol: aggregateSummary.symbol ?? "unknown",
    expectedRows: Number(aggregateSummary.expectedRows ?? 0),
    candidateRows: Number(aggregateSummary.candidateRows ?? 0),
    duplicateRows: Number(aggregateSummary.duplicateRows ?? 0),
    rejectedRows: Number(aggregateSummary.rejectedRows ?? 0),
    missingRows: Number(aggregateSummary.missingRows ?? 0),
    rawPayloadIncluded: aggregateSummary.rawPayloadIncluded === true,
    rowPayloadIncluded: aggregateSummary.rowPayloadIncluded === true,
    stockIdPayloadIncluded: aggregateSummary.stockIdPayloadIncluded === true,
    secretsIncluded: aggregateSummary.secretsIncluded === true
  },
  decisionMeaning: postRunCompleted
    ? "aggregate_readback_ready_for_candidate_acceptance_review_only"
    : "blocked_until_local_runner_post_run_review_completes",
  nextAction: postRunCompleted
    ? "PM may open a separate TWII candidate acceptance decision gate; this report does not accept rows or score coverage."
    : "Complete TWII local runner post-run review before candidate acceptance review.",
  authorizationBoundary: boundary(),
  safety: safety()
};

console.log(JSON.stringify(report, null, 2));

function runPostRunReview(inputPath) {
  const env = { ...process.env };
  if (inputPath) env.A1_TWII_CANDIDATE_ARTIFACT_PATH = inputPath;
  const result = spawnSync(process.execPath, ["scripts/report-twii-report-only-local-runner-post-run-review.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  return {
    statusCode: result.status ?? 1,
    output: parseJson(result.stdout ?? "")
  };
}

function boundary() {
  return {
    candidateRowsAcceptedNow: false,
    rowCoverageScoringAllowed: false,
    remoteTwiiProbeAllowed: false,
    marketDataRetrievalAllowed: false,
    sourceDerivedCandidateGenerationAllowed: false,
    supabaseOperationAllowed: false,
    stagingWriteExecutionAllowed: false,
    dailyPricesMutationAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  };
}

function safety() {
  return {
    publicDataSource: "mock",
    scoreSource: "mock",
    remoteTwiiProbeExecuted: false,
    candidateArtifactCreated: false,
    sourceDerivedCandidateRowsCreated: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
