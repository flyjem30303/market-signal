import {
  defaultTwiiCandidateArtifactPath,
  validateTwiiCandidateArtifact
} from "./lib/twii-candidate-artifact-validator.mjs";

const candidatePath = process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH ?? defaultTwiiCandidateArtifactPath;
const validation = validateTwiiCandidateArtifact(candidatePath);
const completed = validation.accepted === true;

const report = {
  status: completed
    ? "twii_report_only_local_runner_completed_aggregate_only"
    : "twii_report_only_local_runner_blocked_candidate_artifact_not_ready",
  ok: true,
  mode: "twii_report_only_local_runner",
  executionMode: "local_artifact_shape_only",
  owner: "PM",
  candidateArtifactPath: candidatePath,
  localArtifactValidationCompleted: completed,
  validation: {
    candidateArtifactProvided: validation.artifactProvided,
    candidateArtifactAccepted: validation.accepted,
    problems: validation.problems,
    aggregateSummary: validation.summary
  },
  outputPolicy: {
    aggregateOnly: true,
    rawPayloadOutputAllowed: false,
    rowPayloadOutputAllowed: false,
    stockIdPayloadOutputAllowed: false,
    secretOutputAllowed: false
  },
  nextAction: completed
    ? "PM may prepare a separate bounded aggregate readback or candidate acceptance decision; this local runner does not write data."
    : "A1 must provide a valid sanitized aggregate-only TWII candidate artifact, then rerun PM intake and local runner.",
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
