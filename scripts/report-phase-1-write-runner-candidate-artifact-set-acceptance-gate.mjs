import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const sourceReviewPath = "data/evidence-intake/phase-1-write-runner-post-write-review-contract-no-execution.json";
const etfIntakePath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads.json";
const problems = [];

const artifact = readJson(artifactPath);
const sourceReview = readJson(sourceReviewPath);
const etfIntake = readJson(etfIntakePath);
const etfAccepted = etfIntake.status === "phase_1_etf_sanitized_candidate_artifact_path_intake_accepted_no_row_payloads";

validateSourceReview();
validateEtfIntake();
validateArtifact();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok
        ? etfAccepted
          ? "phase_1_write_runner_candidate_artifact_set_acceptance_gate_artifact_set_complete_no_execution"
          : "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact"
        : "blocked",
      acceptanceDecision: etfAccepted
        ? "artifact_set_complete_twii_and_etf_aggregate_artifacts_accepted_no_execution"
        : artifact.acceptanceDecision ?? null,
      twiiArtifactAccepted: artifact.twiiArtifactAccepted ?? null,
      etfArtifactAccepted: etfAccepted,
      artifactSetComplete: etfAccepted,
      expectedMissingRows: artifact.expectedMissingRows ?? null,
      executionAllowedNow: artifact.executionAllowedNow ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      promotionAllowedNow: artifact.promotionAllowedNow ?? null,
      nextRoute: etfAccepted
        ? "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution"
        : artifact.nextRoute ?? null,
      safety: artifact.safety ?? {},
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateSourceReview() {
  if (sourceReview.status !== "phase_1_write_runner_post_write_review_contract_no_execution_ready") {
    problems.push("source review status mismatch");
  }
  if (sourceReview.nextRoute !== "phase_1_write_runner_candidate_artifact_set_acceptance_gate") {
    problems.push("source review nextRoute mismatch");
  }
}

function validateEtfIntake() {
  if (![
    "phase_1_etf_sanitized_candidate_artifact_path_intake_waiting_a1_reply_no_row_payloads",
    "phase_1_etf_sanitized_candidate_artifact_path_intake_accepted_no_row_payloads"
  ].includes(etfIntake.status)) {
    problems.push("ETF intake status mismatch");
  }
  if (etfIntake.candidateArtifactPathAccepted !== etfAccepted) problems.push("ETF artifact acceptance mismatch");
  if (etfIntake.expectedMissingRows !== 118) problems.push("ETF expectedMissingRows must be 118");
}

function validateArtifact() {
  if (artifact.status !== (etfAccepted
    ? "phase_1_write_runner_candidate_artifact_set_acceptance_gate_artifact_set_complete_no_execution"
    : "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact")) {
    problems.push("artifact status mismatch");
  }
  if (artifact.twiiArtifactAccepted !== true) problems.push("twiiArtifactAccepted must be true");
  if (artifact.etfArtifactAccepted !== etfAccepted) problems.push("etfArtifactAccepted mismatch");
  if (artifact.artifactSetComplete !== etfAccepted) problems.push("artifactSetComplete mismatch");
  if (artifact.expectedMissingRows !== 178) problems.push("expectedMissingRows must be 178");
  if (artifact.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
  if (artifact.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
  if (artifact.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
  if (artifact.promotionAllowedNow !== false) problems.push("promotionAllowedNow must be false");
  if (artifact.safety?.publicDataSource !== "mock") problems.push("publicDataSource must stay mock");
  if (artifact.safety?.scoreSource !== "mock") problems.push("scoreSource must stay mock");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
