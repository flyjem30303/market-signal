import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads.json";
const validatorPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-intake-validator-no-row-payloads.json";
const executionBriefPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads.json";
const candidateGatePath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const problems = [];

const artifact = readJson(artifactPath);
const validator = readJson(validatorPath);
const executionBrief = readJson(executionBriefPath);
const candidateGate = readJson(candidateGatePath);

if (validator.status !== artifact.sourceValidatorStatus) problems.push("validator status mismatch");
if (executionBrief.status !== artifact.sourceExecutionBriefStatus) problems.push("execution brief status mismatch");
if (candidateGate.status !== artifact.sourceCandidateGateStatus) problems.push("candidate gate status mismatch");
if (candidateGate.etfArtifactAccepted !== false) problems.push("ETF artifact must still be unaccepted now");
if (artifact.applyAllowedNow !== false) problems.push("applyAllowedNow must be false until future reply passes");
if (artifact.futureReplyRequired !== true) problems.push("futureReplyRequired must be true");

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? artifact.status : "blocked",
      applyDecision: artifact.applyDecision ?? null,
      applyAllowedNow: artifact.applyAllowedNow ?? null,
      futureReplyRequired: artifact.futureReplyRequired ?? null,
      requiredFutureReplyStatus: artifact.requiredFutureReplyStatus ?? null,
      currentEtfArtifactAccepted: artifact.currentEtfArtifactAccepted ?? null,
      futureEtfArtifactAcceptedAfterPass: artifact.futureEtfArtifactAcceptedAfterPass ?? null,
      futureArtifactSetCompleteAfterPass: artifact.futureArtifactSetCompleteAfterPass ?? null,
      futureExpectedMissingRows: artifact.futureExpectedMissingRows ?? null,
      futureTwiiMissingRows: artifact.futureTwiiMissingRows ?? null,
      futureEtfMissingRows: artifact.futureEtfMissingRows ?? null,
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
