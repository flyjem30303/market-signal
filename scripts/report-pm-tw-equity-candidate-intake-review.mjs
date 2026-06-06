import { spawnSync } from "node:child_process";

const selfCheckPath = "scripts/report-a1-tw-equity-candidate-artifact-self-check.mjs";
const intakePath = "scripts/report-a1-tw-equity-candidate-artifact-intake.mjs";
const candidatePath = process.env.A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH ?? "data/candidates/tw-equity-staging-candidate.json";

const selfCheck = runReport(selfCheckPath);
const intake = runReport(intakePath);
const candidateArtifactProvided = selfCheck.output?.candidateArtifactProvided === true || intake.output?.candidateArtifactProvided === true;
const selfCheckReady = selfCheck.output?.readyForPmIntakeReview === true;
const intakeAccepted = intake.output?.candidateArtifactAccepted === true;
const readyForCeoBoundedWriteDecision = candidateArtifactProvided && selfCheckReady && intakeAccepted;

const report = {
  status: readyForCeoBoundedWriteDecision
    ? "pm_tw_equity_candidate_intake_review_ready_for_ceo_bounded_staging_write_decision"
    : "pm_tw_equity_candidate_intake_review_blocked_candidate_artifact_not_provided",
  owner: "PM integration review",
  candidateArtifactPath: candidatePath,
  candidateArtifactProvided,
  selfCheckReady,
  intakeAccepted,
  readyForCeoBoundedWriteDecision,
  upstreamReports: {
    selfCheck: {
      path: selfCheckPath,
      statusCode: selfCheck.statusCode,
      status: selfCheck.output?.status ?? "blocked",
      readyForPmIntakeReview: selfCheck.output?.readyForPmIntakeReview === true
    },
    intake: {
      path: intakePath,
      statusCode: intake.statusCode,
      status: intake.output?.status ?? "blocked",
      candidateArtifactAccepted: intake.output?.candidateArtifactAccepted === true,
      candidateInputAccepted: intake.output?.validation?.candidateInputAccepted === true,
      candidateInputRunRows: intake.output?.validation?.candidateInputRunRows ?? 0,
      candidateInputPriceRows: intake.output?.validation?.candidateInputPriceRows ?? 0,
      problems: intake.output?.validation?.problems ?? intake.problems
    }
  },
  pmDecision: readyForCeoBoundedWriteDecision
    ? "ready_to_ask_ceo_to_name_exactly_one_bounded_staging_write_attempt"
    : "blocked_waiting_for_a1_sanitized_candidate_artifact",
  nextAction: readyForCeoBoundedWriteDecision
    ? "CEO may decide whether to name exactly one bounded staging write attempt using the accepted artifact; this report does not execute the attempt."
    : "A1 must provide one sanitized candidate artifact, then run self-check before PM repeats intake review.",
  authorizationBoundary: {
    ceoDecisionAllowed: readyForCeoBoundedWriteDecision,
    stagingWriteExecutionAllowed: false,
    passingPmReviewMeans: "ready_for_ceo_bounded_staging_write_decision_only",
    stillRequires: [
      "CEO named bounded staging write attempt",
      "exact command confirmation",
      "credentials posture check",
      "same-slice post-run review",
      "no retry without a separate new decision"
    ]
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    realSupabaseConnectionAttempted: false,
    realSupabaseWrites: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));

function runReport(reportPath) {
  const result = spawnSync(process.execPath, [reportPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH: candidatePath
    },
    shell: false
  });

  return {
    statusCode: result.status,
    output: parseJson(result.stdout),
    problems: result.status === 0 ? [] : [`${reportPath}_blocked`]
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
