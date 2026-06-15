import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads.json";
const candidateGatePath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const problems = [];

const artifact = readJson(artifactPath);
const candidateGate = readJson(candidateGatePath);

validateCandidateGate();
validateArtifact();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready" : "blocked",
      templateDecision: artifact.templateDecision ?? null,
      targetLane: artifact.targetLane ?? null,
      targetScope: artifact.targetScope ?? null,
      expectedMissingRows: artifact.expectedMissingRows ?? null,
      requiredSanitizedAggregateOnly: artifact.requiredSanitizedAggregateOnly ?? null,
      outputContainsRowPayload: artifact.outputContainsRowPayload ?? null,
      outputContainsRawPayload: artifact.outputContainsRawPayload ?? null,
      outputContainsSecrets: artifact.outputContainsSecrets ?? null,
      nextRoute: artifact.nextRoute ?? null,
      safety: artifact.safety ?? {},
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateCandidateGate() {
  if (candidateGate.status !== "phase_1_write_runner_candidate_artifact_set_acceptance_gate_waiting_etf_artifact") {
    problems.push("candidate gate status mismatch");
  }
  if (candidateGate.etfArtifactAccepted !== false) problems.push("ETF artifact must not be accepted yet");
  if (candidateGate.artifactSetComplete !== false) problems.push("artifact set must still be incomplete");
}

function validateArtifact() {
  if (artifact.status !== "phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready") {
    problems.push("artifact status mismatch");
  }
  if (artifact.targetLane !== "ETF") problems.push("targetLane must be ETF");
  if (artifact.expectedMissingRows !== 118) problems.push("expectedMissingRows must be 118");
  if (artifact.requiredSanitizedAggregateOnly !== true) problems.push("requiredSanitizedAggregateOnly must be true");
  if (artifact.outputContainsRowPayload !== false) problems.push("outputContainsRowPayload must be false");
  if (artifact.outputContainsRawPayload !== false) problems.push("outputContainsRawPayload must be false");
  if (artifact.outputContainsSecrets !== false) problems.push("outputContainsSecrets must be false");
  if (artifact.safety?.publicDataSource !== "mock") problems.push("publicDataSource must stay mock");
  if (artifact.safety?.scoreSource !== "mock") problems.push("scoreSource must stay mock");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
