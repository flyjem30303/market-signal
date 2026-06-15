import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-runner-rollback-or-quarantine-contract-no-execution.json";
const sourceReadbackPath = "data/evidence-intake/phase-1-write-runner-aggregate-readback-contract-no-execution.json";
const problems = [];

const artifact = readJson(artifactPath);
const sourceReadback = readJson(sourceReadbackPath);

validateSourceReadback();
validateArtifact();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready" : "blocked",
      recoveryDecision: artifact.recoveryDecision ?? null,
      recoveryMode: artifact.recoveryMode ?? null,
      sourceReadbackStatus: artifact.sourceReadbackStatus ?? null,
      rollbackOrQuarantinePrepared: artifact.rollbackOrQuarantinePrepared ?? null,
      automaticRepairAllowedNow: artifact.automaticRepairAllowedNow ?? null,
      automaticRetryAllowedNow: artifact.automaticRetryAllowedNow ?? null,
      overwriteRepairAllowedNow: artifact.overwriteRepairAllowedNow ?? null,
      executionAllowedNow: artifact.executionAllowedNow ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      implementationAllowedNow: artifact.implementationAllowedNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      safety: artifact.safety ?? {},
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateSourceReadback() {
  if (sourceReadback.status !== "phase_1_write_runner_aggregate_readback_contract_no_execution_ready") {
    problems.push("source readback status mismatch");
  }
  if (sourceReadback.nextRoute !== "phase_1_write_runner_rollback_or_quarantine_contract_no_execution") {
    problems.push("source readback nextRoute mismatch");
  }
}

function validateArtifact() {
  if (artifact.status !== "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready") {
    problems.push("artifact status mismatch");
  }
  if (artifact.rollbackOrQuarantinePrepared !== true) problems.push("rollbackOrQuarantinePrepared must be true");
  if (artifact.automaticRepairAllowedNow !== false) problems.push("automaticRepairAllowedNow must be false");
  if (artifact.automaticRetryAllowedNow !== false) problems.push("automaticRetryAllowedNow must be false");
  if (artifact.overwriteRepairAllowedNow !== false) problems.push("overwriteRepairAllowedNow must be false");
  if (artifact.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
  if (artifact.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
  if (artifact.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
  if (artifact.safety?.publicDataSource !== "mock") problems.push("publicDataSource must stay mock");
  if (artifact.safety?.scoreSource !== "mock") problems.push("scoreSource must stay mock");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
