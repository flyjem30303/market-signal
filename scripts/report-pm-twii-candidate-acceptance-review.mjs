import { spawnSync } from "node:child_process";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH;
const decision = runDecision(candidatePath);
const decisionReady =
  decision.statusCode === 0 &&
  decision.output?.status === "twii_candidate_acceptance_decision_gate_ready_for_later_bounded_data_acceptance_route";

const report = {
  status: decisionReady
    ? "pm_twii_candidate_acceptance_review_ready_for_later_bounded_data_acceptance_route"
    : "pm_twii_candidate_acceptance_review_blocked_candidate_acceptance_gate_not_ready",
  ok: true,
  mode: "pm_twii_candidate_acceptance_review",
  owner: "PM",
  decisionReady,
  decisionSummary: {
    statusCode: decision.statusCode,
    status: decision.output?.status ?? "blocked",
    aggregateLooksAcceptable: decision.output?.aggregateLooksAcceptable === true,
    decisionMeaning: decision.output?.decisionMeaning ?? "blocked_until_candidate_acceptance_gate_ready"
  },
  pmAction: decisionReady
    ? "Prepare a separate bounded data acceptance route; keep row coverage scoring and runtime promotion blocked until later gates."
    : "Route back to TWII aggregate readback gate and local runner post-run review.",
  authorizationBoundary: {
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
  },
  safety: {
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
  }
};

console.log(JSON.stringify(report, null, 2));

function runDecision(inputPath) {
  const env = { ...process.env };
  if (inputPath) env.A1_TWII_CANDIDATE_ARTIFACT_PATH = inputPath;
  const result = spawnSync(process.execPath, ["scripts/report-twii-candidate-acceptance-decision-gate.mjs"], {
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

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
