import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-runner-bounded-insert-missing-only-contract-no-execution.json";
const inputGatePath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-intake-no-row-payloads.json";
const problems = [];

const artifact = readJson(artifactPath);
const inputGate = readJson(inputGatePath);

validateInputGate();
validateArtifact();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready" : "blocked",
      contractDecision: artifact.contractDecision ?? null,
      contractMode: artifact.contractMode ?? null,
      sourceIntakeStatus: artifact.sourceIntakeStatus ?? null,
      candidateArtifactSetComplete: artifact.candidateArtifactSetComplete ?? null,
      contractReadyForImplementation: artifact.contractReadyForImplementation ?? null,
      targetTable: artifact.targetTable ?? null,
      targetScope: artifact.targetScope ?? null,
      insertMode: artifact.insertMode ?? null,
      maxRowsPerAttempt: artifact.maxRowsPerAttempt ?? null,
      executionAllowedNow: artifact.writeBoundary?.executionAllowedNow ?? false,
      writeGateExecutableNow: artifact.writeBoundary?.writeGateExecutableNow ?? false,
      implementationAllowedNow: artifact.writeBoundary?.implementationAllowedNow ?? false,
      nextRoute: artifact.nextRoute ?? null,
      safety: artifact.safety ?? {},
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateInputGate() {
  if (inputGate.status !== "phase_1_etf_sanitized_candidate_artifact_path_intake_accepted_no_row_payloads") {
    problems.push("input gate status mismatch");
  }
  if (inputGate.blockedUntilA1Reply !== false) problems.push("input gate must no longer be blocked waiting A1 reply");
  if (inputGate.candidateArtifactPathAccepted !== true) problems.push("input candidate path must be accepted");
  if (inputGate.expectedMissingRows !== 118) problems.push("input expectedMissingRows must be 118");
}

function validateArtifact() {
  if (artifact.status !== "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready") {
    problems.push("artifact status mismatch");
  }
  if (artifact.contractMode !== "bounded_insert_missing_only_contract_no_execution") {
    problems.push("artifact contractMode mismatch");
  }
  if (artifact.contractPrepared !== true) problems.push("contractPrepared must be true");
  if (artifact.candidateArtifactSetComplete !== true) problems.push("candidateArtifactSetComplete must be true");
  if (artifact.contractReadyForImplementation !== true) problems.push("contractReadyForImplementation must be true");
  if (artifact.targetRows?.fullLevel1MissingRows !== 178) problems.push("fullLevel1MissingRows must be 178");
  if (artifact.targetRows?.twiiMissingRows !== 60) problems.push("twiiMissingRows must be 60");
  if (artifact.targetRows?.etfMissingRows !== 118) problems.push("etfMissingRows must be 118");
  if (artifact.writeBoundary?.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
  if (artifact.writeBoundary?.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
  if (artifact.writeBoundary?.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
  if (artifact.safety?.publicDataSource !== "mock") problems.push("publicDataSource must stay mock");
  if (artifact.safety?.scoreSource !== "mock") problems.push("scoreSource must stay mock");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
