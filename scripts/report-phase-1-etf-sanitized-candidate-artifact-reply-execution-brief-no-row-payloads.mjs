import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads.json";
const templatePath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-template-no-row-payloads.json";
const validatorPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-intake-validator-no-row-payloads.json";
const candidateGatePath = "data/evidence-intake/phase-1-write-runner-candidate-artifact-set-acceptance-gate.json";
const problems = [];

const artifact = readJson(artifactPath);
const template = readJson(templatePath);
const validator = readJson(validatorPath);
const candidateGate = readJson(candidateGatePath);

if (template.status !== artifact.sourceTemplateStatus) problems.push("template status mismatch");
if (validator.status !== artifact.sourceValidatorStatus) problems.push("validator status mismatch");
if (candidateGate.status !== artifact.sourceCandidateGateStatus) problems.push("candidate gate status mismatch");
if (candidateGate.etfArtifactAccepted !== false) problems.push("ETF artifact must remain unaccepted until A1 reply is reviewed");
if (artifact.a1CanExecuteNow !== true) problems.push("A1 execution brief must be ready");
if (artifact.pmCanAcceptNow !== false) problems.push("PM must not accept without a future reply");
if (artifact.expectedMissingRows !== 118) problems.push("expectedMissingRows must be 118");

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? artifact.status : "blocked",
      briefDecision: artifact.briefDecision ?? null,
      a1CanExecuteNow: artifact.a1CanExecuteNow ?? null,
      pmCanAcceptNow: artifact.pmCanAcceptNow ?? null,
      pmAcceptanceRequiresFutureReply: artifact.pmAcceptanceRequiresFutureReply ?? null,
      targetLane: artifact.targetLane ?? null,
      symbolGroup: artifact.symbolGroup ?? null,
      targetScope: artifact.targetScope ?? null,
      expectedMissingRows: artifact.expectedMissingRows ?? null,
      requiredReplyValues: artifact.requiredReplyValues ?? {},
      a1Stoplines: artifact.a1Stoplines ?? [],
      nextRoute: artifact.nextRoute ?? null,
      nextPmRouteIfReplyArrives: artifact.nextPmRouteIfReplyArrives ?? null,
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
