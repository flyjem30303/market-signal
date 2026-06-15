import fs from "node:fs";

const sourceCredentialShapePath =
  "data/evidence-intake/phase-1-write-runner-credential-presence-shape-checker-no-secret-values.json";
const twiiCandidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";
const etfCandidateArtifactPath = null;

const twiiPathExists = fs.existsSync(twiiCandidateArtifactPath);
const etfPathExists = false;
const candidateArtifactPathSetComplete = twiiPathExists && etfPathExists;

const pathShape = {
  twiiCandidateArtifactPath,
  twiiCandidateArtifactPathExists: twiiPathExists,
  twiiExpectedMissingRows: 60,
  etfCandidateArtifactPath,
  etfCandidateArtifactPathExists: etfPathExists,
  etfExpectedMissingRows: 118,
  fullLevel1MissingRows: 178,
  candidateArtifactPathSetComplete,
  outputMode: "path_presence_and_aggregate_counts_only"
};

const safety = {
  publicDataSource: "mock",
  scoreSource: "mock",
  candidateArtifactRead: false,
  candidateRowPayloadRead: false,
  rawPayloadRead: false,
  stockIdPayloadRead: false,
  rowPayloadOutput: false,
  rawPayloadOutput: false,
  secretsOutput: false,
  sqlExecuted: false,
  supabaseClientImported: false,
  supabaseConnectionAttempted: false,
  supabaseReadsEnabled: false,
  supabaseWritesEnabled: false,
  marketDataFetched: false,
  marketDataIngested: false,
  dailyPricesMutated: false,
  stagingRowsCreated: false,
  candidateRowsAccepted: false,
  publicPromotionAllowed: false,
  scoreSourceRealAllowed: false,
  investmentAdviceClaimAllowed: false
};

console.log(
  JSON.stringify(
    {
      status: "phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads_ready",
      pathCheckMode: "path_presence_only_no_row_payloads",
      sourceCredentialShapePath,
      pathShape,
      executionAllowedNow: false,
      writeGateExecutableNow: false,
      implementationAllowedNow: false,
      nextRoute: candidateArtifactPathSetComplete
        ? "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution"
        : "phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch",
      safety
    },
    null,
    2
  )
);
