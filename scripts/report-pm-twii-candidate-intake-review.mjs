import { spawnSync } from "node:child_process";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH;
const selfCheck = runSelfCheck(candidatePath);
const selfCheckReady =
  selfCheck.statusCode === 0 &&
  selfCheck.output?.readyForPmIntakeReview === true &&
  selfCheck.output?.validation?.candidateArtifactAccepted === true;

const report = {
  status: selfCheckReady
    ? "pm_twii_candidate_intake_review_ready_for_report_only_dry_run_decision"
    : "pm_twii_candidate_intake_review_blocked_candidate_artifact_not_provided_or_invalid",
  ok: true,
  mode: "pm_twii_candidate_intake_review",
  owner: "PM",
  candidateArtifactPath: selfCheck.output?.candidateArtifactPath ?? candidatePath ?? "data/candidates/twii-sanitized-candidate.json",
  selfCheckReady,
  selfCheckSummary: {
    statusCode: selfCheck.statusCode,
    status: selfCheck.output?.status ?? "blocked",
    candidateArtifactProvided: selfCheck.output?.candidateArtifactProvided === true,
    candidateArtifactAccepted: selfCheck.output?.validation?.candidateArtifactAccepted === true,
    problems: selfCheck.output?.validation?.problems ?? selfCheck.problems,
    aggregateSummary: selfCheck.output?.validation?.summary ?? {}
  },
  decisionMeaning: selfCheckReady
    ? "ready_for_next_report_only_dry_run_decision_only"
    : "blocked_until_a1_candidate_artifact_self_check_passes",
  nextAction: selfCheckReady
    ? "CEO may decide whether to prepare one bounded TWII report-only dry-run gate; this PM review does not execute it."
    : "A1 must provide a valid sanitized aggregate-only TWII candidate artifact, then rerun self-check and PM intake.",
  authorizationBoundary: {
    reportOnlyExecutionAllowed: false,
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

function runSelfCheck(inputPath) {
  const env = { ...process.env };
  if (inputPath) env.A1_TWII_CANDIDATE_ARTIFACT_PATH = inputPath;
  const result = spawnSync(process.execPath, ["scripts/report-a1-twii-candidate-artifact-self-check.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  return {
    statusCode: result.status ?? 1,
    output: parseJson(result.stdout ?? ""),
    problems: result.status === 0 ? [] : ["a1_self_check_report_blocked"]
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
