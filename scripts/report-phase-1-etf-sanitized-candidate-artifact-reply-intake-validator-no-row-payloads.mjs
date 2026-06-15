import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-intake-validator-no-row-payloads.json";
const templatePath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads.json";
const candidateGatePath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const problems = [];

const artifact = readJson(artifactPath);
const template = readJson(templatePath);
const candidateGate = readJson(candidateGatePath);

if (template.status !== artifact.sourceTemplateStatus) problems.push("template status mismatch");
if (candidateGate.status !== artifact.sourceCandidateGateStatus) problems.push("candidate gate status mismatch");
if (candidateGate.etfArtifactAccepted !== false) problems.push("ETF artifact must still be waiting");
if (artifact.futureReplyPresentNow !== false) problems.push("future reply must not be present now");
if (artifact.replyAcceptedNow !== false) problems.push("reply must not be accepted now");
if (artifact.candidateArtifactReadNow !== false) problems.push("candidate artifact must not be read now");
if (artifact.expectedMissingRows !== 118) problems.push("expectedMissingRows must be 118");

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? artifact.status : "blocked",
      validatorDecision: artifact.validatorDecision ?? null,
      futureReplyRequired: artifact.futureReplyRequired ?? null,
      futureReplyPresentNow: artifact.futureReplyPresentNow ?? null,
      replyAcceptedNow: artifact.replyAcceptedNow ?? null,
      candidateArtifactPathAcceptedNow: artifact.candidateArtifactPathAcceptedNow ?? null,
      candidateArtifactReadNow: artifact.candidateArtifactReadNow ?? null,
      candidateRowsAcceptedNow: artifact.candidateRowsAcceptedNow ?? null,
      targetLane: artifact.targetLane ?? null,
      targetScope: artifact.targetScope ?? null,
      expectedMissingRows: artifact.expectedMissingRows ?? null,
      requiredBooleans: artifact.requiredBooleans ?? {},
      requiredNumericMatches: artifact.requiredNumericMatches ?? {},
      nextRoute: artifact.nextRoute ?? null,
      nextRouteIfFutureReplyPasses: artifact.nextRouteIfFutureReplyPasses ?? null,
      safety: artifact.safety ?? {},
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}
