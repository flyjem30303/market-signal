import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const sourceReviewPath = "data/evidence-intake/phase-1-write-runner-post-write-review-contract-no-execution.json";
const etfIntakePath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads.json";
const problems = [];

const artifact = readJson(artifactPath);
const sourceReview = readJson(sourceReviewPath);
const etfIntake = readJson(etfIntakePath);

validateSourceReview();
validateEtfIntake();
validateArtifact();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact" : "blocked",
      acceptanceDecision: artifact.acceptanceDecision ?? null,
      twiiArtifactAccepted: artifact.twiiArtifactAccepted ?? null,
      etfArtifactAccepted: artifact.etfArtifactAccepted ?? null,
      artifactSetComplete: artifact.artifactSetComplete ?? null,
      expectedMissingRows: artifact.expectedMissingRows ?? null,
      executionAllowedNow: artifact.executionAllowedNow ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      promotionAllowedNow: artifact.promotionAllowedNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
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
  if (etfIntake.status !== "phase_1_etf_sanitized_candidate_artifact_path_intake_waiting_a1_reply_no_row_payloads") {
    problems.push("ETF intake status mismatch");
  }
  if (etfIntake.candidateArtifactPathAccepted !== false) problems.push("ETF artifact must not be accepted yet");
  if (etfIntake.expectedMissingRows !== 118) problems.push("ETF expectedMissingRows must be 118");
}

function validateArtifact() {
  if (artifact.status !== "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact") {
    problems.push("artifact status mismatch");
  }
  if (artifact.twiiArtifactAccepted !== true) problems.push("twiiArtifactAccepted must be true");
  if (artifact.etfArtifactAccepted !== false) problems.push("etfArtifactAccepted must be false");
  if (artifact.artifactSetComplete !== false) problems.push("artifactSetComplete must be false");
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
