import { spawnSync } from "node:child_process";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH;
const preflight = runPreflight(candidatePath);
const preflightReady =
  preflight.statusCode === 0 &&
  preflight.output?.status === "twii_bounded_data_acceptance_route_preflight_ready_for_authorization_packet";

const report = {
  status: preflightReady
    ? "pm_twii_bounded_data_acceptance_decision_review_ready_for_ceo_named_attempt_only"
    : "pm_twii_bounded_data_acceptance_decision_review_blocked_preflight_not_ready",
  ok: true,
  mode: "pm_twii_bounded_data_acceptance_decision_review",
  owner: "PM",
  preflightReady,
  authorizationPacketReady: preflightReady,
  authorizationPacket: preflightReady
    ? {
        attemptIdRequired: true,
        candidateArtifactPathRequired: true,
        acceptanceMode: "bounded_data_acceptance_attempt",
        maxCandidateRows: 60,
        targetLane: "TWII",
        targetScope: "twii_index_daily_prices_missing_rows",
        rowCoverageScoringAllowed: false,
        publicPromotionAllowed: false,
        scoreSourceRealAllowed: false
      }
    : null,
  decisionMeaning: preflightReady
    ? "ready_for_ceo_to_name_one_future_bounded_data_acceptance_attempt_only"
    : "blocked_until_route_preflight_ready",
  nextAction: preflightReady
    ? "CEO may name exactly one future bounded data acceptance attempt; this review does not execute it."
    : "Return to TWII bounded data acceptance route preflight.",
  authorizationBoundary: boundary(),
  safety: safety()
};

console.log(JSON.stringify(report, null, 2));

function runPreflight(inputPath) {
  const env = { ...process.env };
  if (inputPath) env.A1_TWII_CANDIDATE_ARTIFACT_PATH = inputPath;
  const result = spawnSync(process.execPath, ["scripts/report-twii-bounded-data-acceptance-route-preflight.mjs"], {
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
