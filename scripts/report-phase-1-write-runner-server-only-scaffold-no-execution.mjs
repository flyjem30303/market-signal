import {
  describePhase1WriteRunnerServerOnlyScaffold,
  prepareAggregateReadbackContract,
  prepareBoundedInsertMissingOnlyContract,
  prepareCredentialPresenceShape,
  preparePostWriteReviewContract,
  prepareRollbackOrQuarantineContract,
  prepareRuntimePromotionContract,
  prepareSanitizedCandidateArtifactPathShape
} from "./lib/phase-1-write-runner-server-only-scaffold.mjs";

const scaffold = describePhase1WriteRunnerServerOnlyScaffold();

console.log(
  JSON.stringify(
    {
      ...scaffold,
      preparedContractShapes: {
        credentialPresence: prepareCredentialPresenceShape(),
        sanitizedCandidateArtifactPath: prepareSanitizedCandidateArtifactPathShape(),
        boundedInsertMissingOnly: prepareBoundedInsertMissingOnlyContract(),
        aggregateReadback: prepareAggregateReadbackContract(),
        rollbackOrQuarantine: prepareRollbackOrQuarantineContract(),
        postWriteReview: preparePostWriteReviewContract(),
        runtimePromotion: prepareRuntimePromotionContract()
      }
    },
    null,
    2
  )
);
