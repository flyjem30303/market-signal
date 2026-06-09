import { spawnSync } from "node:child_process";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH;
const pmReview = runPmReview(candidatePath);
const pmReviewReady =
  pmReview.statusCode === 0 &&
  pmReview.output?.status === "pm_twii_candidate_acceptance_review_ready_for_later_bounded_data_acceptance_route";

const report = {
  status: pmReviewReady
    ? "twii_bounded_data_acceptance_route_preflight_ready_for_authorization_packet"
    : "twii_bounded_data_acceptance_route_preflight_blocked_candidate_acceptance_review_not_ready",
  ok: true,
  mode: "twii_bounded_data_acceptance_route_preflight",
  owner: "PM/CEO",
  pmReviewReady,
  pmReviewSummary: {
    statusCode: pmReview.statusCode,
    status: pmReview.output?.status ?? "blocked",
    decisionReady: pmReview.output?.decisionReady === true,
    pmAction: pmReview.output?.pmAction ?? "blocked_until_pm_candidate_acceptance_review_ready"
  },
  routeReadiness: {
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxCandidateRows: 60,
    candidateRowsAcceptedNow: false,
    readyForAuthorizationPacket: pmReviewReady
  },
  decisionMeaning: pmReviewReady
    ? "ready_for_authorization_packet_only"
    : "blocked_until_candidate_acceptance_review_ready",
  nextAction: pmReviewReady
    ? "PM may prepare a TWII bounded data acceptance authorization packet; this preflight does not run the attempt."
    : "Return to PM TWII candidate acceptance review.",
  authorizationBoundary: boundary(),
  safety: safety()
};

console.log(JSON.stringify(report, null, 2));

function runPmReview(inputPath) {
  const env = { ...process.env };
  if (inputPath) env.A1_TWII_CANDIDATE_ARTIFACT_PATH = inputPath;
  const result = spawnSync(process.execPath, ["scripts/report-pm-twii-candidate-acceptance-review.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  return { statusCode: result.status ?? 1, output: parseJson(result.stdout ?? "") };
}

function boundary() {
  return {
    dataAcceptanceAttemptAllowedNow: false,
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
    candidateRowsAccepted: false,
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
