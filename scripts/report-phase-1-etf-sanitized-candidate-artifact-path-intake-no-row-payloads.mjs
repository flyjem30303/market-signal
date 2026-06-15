import fs from "node:fs";

const sourceRequestPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-request-no-fetch.json";
const candidateArtifactPath = "data/candidates/phase-1-etf-sanitized-candidate.json";
const candidate = fs.existsSync(candidateArtifactPath)
  ? JSON.parse(fs.readFileSync(candidateArtifactPath, "utf8"))
  : null;
const aggregate = candidate?.aggregateValidation ?? {};
const candidateAccepted =
  candidate?.lane === "ETF" &&
  candidate?.scope === "phase_1_core_etf_daily_prices_missing_rows" &&
  candidate?.candidateMissingRows === 118 &&
  candidate?.expectedRows === 118 &&
  candidate?.sanitizedAggregateOnly === true &&
  candidate?.rawPayloadIncluded === false &&
  candidate?.rowPayloadIncluded === false &&
  candidate?.stockIdPayloadIncluded === false &&
  candidate?.secretsIncluded === false &&
  aggregate.expectedRows === 118 &&
  aggregate.candidateRows === 118 &&
  aggregate.duplicateRows === 0 &&
  aggregate.rejectedRows === 0 &&
  aggregate.missingRows === 0;

const requiredA1ReplyContract = {
  candidateMissingRowsMustEqual: 118,
  expectedRowsMustEqual: 118,
  sanitizedAggregateOnlyMustBe: true,
  rawPayloadIncludedMustBe: false,
  rowPayloadIncludedMustBe: false,
  stockIdPayloadIncludedMustBe: false,
  secretsIncludedMustBe: false
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
  dailyPricesMutated: false,
  stagingRowsCreated: false,
  candidateRowsAccepted: false,
  marketDataFetched: false,
  marketDataIngested: false,
  publicPromotionAllowed: false,
  scoreSourceRealAllowed: false,
  investmentAdviceClaimAllowed: false
};

console.log(
  JSON.stringify(
    {
      status: candidateAccepted
        ? "phase_1_etf_sanitized_candidate_artifact_path_intake_accepted_no_row_payloads"
        : "phase_1_etf_sanitized_candidate_artifact_path_intake_waiting_a1_reply_no_row_payloads",
      intakeMode: candidateAccepted
        ? "pm_intake_accept_etf_aggregate_artifact_path_no_row_payloads"
        : "pm_intake_waiting_a1_reply_no_row_payloads",
      sourceRequestPath,
      intakeDecision: candidateAccepted
        ? "accepted_a1_etf_sanitized_candidate_artifact_path_aggregate_only"
        : "blocked_waiting_a1_etf_sanitized_candidate_artifact_reply",
      blockedUntilA1Reply: !candidateAccepted,
      candidateArtifactPath,
      candidateArtifactPathAccepted: candidateAccepted,
      candidateArtifactMetadataRead: Boolean(candidate),
      candidateArtifactRead: false,
      candidateRowPayloadRead: false,
      rawPayloadRead: false,
      candidateArtifactId: candidate?.artifactId ?? null,
      aggregateValidation: candidateAccepted
        ? {
            expectedRows: aggregate.expectedRows,
            candidateRows: aggregate.candidateRows,
            duplicateRows: aggregate.duplicateRows,
            rejectedRows: aggregate.rejectedRows,
            missingRows: aggregate.missingRows,
            validationStatus: aggregate.validationStatus ?? candidate.validationStatus ?? null
          }
        : null,
      expectedMissingRows: 118,
      executionAllowedNow: false,
      writeGateExecutableNow: false,
      implementationAllowedNow: false,
      requiredA1ReplyContract,
      nextRoute: candidateAccepted
        ? "phase_1_write_runner_candidate_artifact_set_acceptance_gate"
        : "wait_for_a1_etf_sanitized_candidate_artifact_reply",
      safety
    },
    null,
    2
  )
);
