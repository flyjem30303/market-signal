import {
  defaultTwiiCandidateArtifactPath,
  validateTwiiCandidateArtifact
} from "./lib/twii-candidate-artifact-validator.mjs";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH ?? defaultTwiiCandidateArtifactPath;
const validation = validateTwiiCandidateArtifact(candidatePath);
const ready = validation.accepted === true;

const report = {
  status: ready
    ? "a1_twii_candidate_artifact_self_check_ready_for_pm_intake_review"
    : "a1_twii_candidate_artifact_self_check_blocked_candidate_artifact_not_provided_or_invalid",
  ok: true,
  mode: "a1_twii_candidate_artifact_self_check",
  owner: "A1 self-check before PM integration intake",
  candidateArtifactPath: candidatePath,
  candidateArtifactProvided: validation.artifactProvided,
  readyForPmIntakeReview: ready,
  validation: {
    candidateArtifactAccepted: validation.accepted,
    problems: validation.problems,
    summary: validation.summary
  },
  pmIntakeCommand: "cmd.exe /c npm run report:pm-twii-candidate-intake-review",
  checkerCommand: "cmd.exe /c npm run check:a1-twii-candidate-artifact-self-check",
  nextAction: ready
    ? "A1 may hand the artifact path to PM for intake review; this does not authorize report-only execution."
    : "A1 must provide one sanitized aggregate-only TWII candidate artifact at the default path or set A1_TWII_CANDIDATE_ARTIFACT_PATH before PM intake.",
  authorizationBoundary: {
    pmIntakeReviewAllowed: ready,
    reportOnlyExecutionAllowed: false,
    stagingWriteExecutionAllowed: false,
    passingSelfCheckMeans: "ready_for_pm_intake_review_only",
    stillRequires: [
      "PM intake review",
      "CEO named bounded report-only attempt",
      "exact command confirmation",
      "credentials posture check",
      "same-slice post-run review",
      "bounded aggregate readback"
    ]
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
