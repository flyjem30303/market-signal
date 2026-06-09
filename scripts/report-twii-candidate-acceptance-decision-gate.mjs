import { spawnSync } from "node:child_process";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH;
const readback = runReadback(candidatePath);
const readbackReady =
  readback.statusCode === 0 &&
  readback.output?.status === "twii_aggregate_readback_gate_ready_for_candidate_acceptance_review";
const aggregate = readback.output?.aggregateReadback ?? {};
const aggregateLooksAcceptable =
  readbackReady &&
  aggregate.lane === "TWII" &&
  aggregate.symbol === "TWII" &&
  aggregate.expectedRows === 60 &&
  aggregate.candidateRows === 60 &&
  aggregate.duplicateRows === 0 &&
  aggregate.rejectedRows === 0 &&
  aggregate.missingRows === 0 &&
  aggregate.rawPayloadIncluded === false &&
  aggregate.rowPayloadIncluded === false &&
  aggregate.stockIdPayloadIncluded === false &&
  aggregate.secretsIncluded === false;

const report = {
  status: aggregateLooksAcceptable
    ? "twii_candidate_acceptance_decision_gate_ready_for_later_bounded_data_acceptance_route"
    : "twii_candidate_acceptance_decision_gate_blocked_aggregate_readback_not_ready",
  ok: true,
  mode: "twii_candidate_acceptance_decision_gate",
  owner: "CEO/PM",
  readbackReady,
  aggregateLooksAcceptable,
  aggregateReadback: aggregate,
  decisionMeaning: aggregateLooksAcceptable
    ? "ready_for_later_bounded_data_acceptance_route_only"
    : "blocked_until_aggregate_readback_is_ready_and_clean",
  nextAction: aggregateLooksAcceptable
    ? "PM may prepare a separate bounded data acceptance route; this gate does not accept rows, score coverage, or promote runtime."
    : "Return to aggregate readback gate and local runner post-run review.",
  authorizationBoundary: boundary(),
  safety: safety()
};

console.log(JSON.stringify(report, null, 2));

function runReadback(inputPath) {
  const env = { ...process.env };
  if (inputPath) env.A1_TWII_CANDIDATE_ARTIFACT_PATH = inputPath;
  const result = spawnSync(process.execPath, ["scripts/report-twii-aggregate-readback-gate.mjs"], {
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
