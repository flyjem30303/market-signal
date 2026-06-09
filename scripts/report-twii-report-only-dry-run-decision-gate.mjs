import { spawnSync } from "node:child_process";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH;
const pmIntake = runPmIntake(candidatePath);
const pmIntakeReady =
  pmIntake.statusCode === 0 &&
  pmIntake.output?.selfCheckReady === true &&
  pmIntake.output?.status === "pm_twii_candidate_intake_review_ready_for_report_only_dry_run_decision";

const report = {
  status: pmIntakeReady
    ? "twii_report_only_dry_run_decision_gate_ready_for_named_attempt_decision"
    : "twii_report_only_dry_run_decision_gate_blocked_candidate_artifact_not_ready",
  ok: true,
  mode: "twii_report_only_dry_run_decision_gate",
  owner: "CEO/PM",
  candidateArtifactPath: pmIntake.output?.candidateArtifactPath ?? candidatePath ?? "data/candidates/twii-sanitized-candidate.json",
  pmIntakeReady,
  pmIntakeSummary: {
    statusCode: pmIntake.statusCode,
    status: pmIntake.output?.status ?? "blocked",
    selfCheckReady: pmIntake.output?.selfCheckReady === true,
    decisionMeaning: pmIntake.output?.decisionMeaning ?? "blocked_until_pm_intake_ready",
    aggregateSummary: pmIntake.output?.selfCheckSummary?.aggregateSummary ?? {}
  },
  decisionMeaning: pmIntakeReady
    ? "ready_to_name_one_future_bounded_report_only_dry_run_attempt_only"
    : "blocked_until_candidate_artifact_self_check_and_pm_intake_pass",
  nextAction: pmIntakeReady
    ? "CEO may name exactly one future bounded TWII report-only dry-run attempt; this gate does not execute it."
    : "A1 must provide a valid sanitized aggregate-only TWII candidate artifact, then PM reruns self-check and intake.",
  futureNamedAttemptRequirements: {
    attemptIdRequired: true,
    artifactPathRequired: true,
    runnerCommandRequired: true,
    maximumExecutions: 1,
    aggregateOnlyOutputRequired: true,
    sameSlicePostRunReviewRequired: true,
    boundedAggregateReadbackRequired: true,
    retryWithoutNewDecisionAllowed: false
  },
  authorizationBoundary: {
    reportOnlyRunnerExecutionAllowedNow: false,
    reportOnlyRunnerImplementationAllowedNow: false,
    stagingWriteExecutionAllowed: false,
    supabaseOperationAllowed: false,
    dailyPricesMutationAllowed: false,
    rowCoverageScoringAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    candidateArtifactCreated: false,
    sourceDerivedCandidateRowsCreated: false,
    reportOnlyRunnerExecuted: false,
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

function runPmIntake(inputPath) {
  const env = { ...process.env };
  if (inputPath) env.A1_TWII_CANDIDATE_ARTIFACT_PATH = inputPath;
  const result = spawnSync(process.execPath, ["scripts/report-pm-twii-candidate-intake-review.mjs"], {
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
