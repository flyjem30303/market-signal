import { spawnSync } from "node:child_process";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH;
const runner = runLocalRunner(candidatePath);
const completed =
  runner.statusCode === 0 &&
  runner.output?.status === "twii_report_only_local_runner_completed_aggregate_only";

const report = {
  status: completed
    ? "twii_report_only_local_runner_post_run_review_completed_aggregate_only"
    : "twii_report_only_local_runner_post_run_review_blocked_candidate_artifact_not_ready",
  ok: true,
  mode: "twii_report_only_local_runner_post_run_review",
  owner: "PM",
  runnerCompleted: completed,
  runnerSummary: {
    statusCode: runner.statusCode,
    status: runner.output?.status ?? "blocked",
    executionMode: runner.output?.executionMode ?? "unknown",
    candidateArtifactAccepted: runner.output?.validation?.candidateArtifactAccepted === true,
    aggregateSummary: runner.output?.validation?.aggregateSummary ?? {},
    problems: runner.output?.validation?.problems ?? []
  },
  pmDecisionMeaning: completed
    ? "local_artifact_shape_runner_completed_ready_for_later_aggregate_readback_or_candidate_acceptance_gate"
    : "blocked_until_local_artifact_shape_runner_completes",
  nextAction: completed
    ? "PM may prepare a separate aggregate readback or candidate acceptance decision gate; no data write is authorized by this review."
    : "Return to A1 candidate artifact self-check and PM intake.",
  authorizationBoundary: {
    remoteTwiiProbeAllowed: false,
    marketDataRetrievalAllowed: false,
    sourceDerivedCandidateGenerationAllowed: false,
    supabaseOperationAllowed: false,
    stagingWriteExecutionAllowed: false,
    dailyPricesMutationAllowed: false,
    rowCoverageScoringAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    localArtifactShapeRunnerExecuted: true,
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

function runLocalRunner(inputPath) {
  const env = { ...process.env };
  if (inputPath) env.A1_TWII_CANDIDATE_ARTIFACT_PATH = inputPath;
  const result = spawnSync(process.execPath, ["scripts/report-twii-report-only-local-runner.mjs"], {
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
