import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-runner-aggregate-readback-contract-no-execution.json";
const sourceContractPath = "data/evidence-intake/phase-1-write-runner-bounded-insert-missing-only-contract-no-execution.json";
const problems = [];

const artifact = readJson(artifactPath);
const sourceContract = readJson(sourceContractPath);

validateSourceContract();
validateArtifact();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "phase_1_write_runner_aggregate_readback_contract_no_execution_ready" : "blocked",
      readbackDecision: artifact.readbackDecision ?? null,
      readbackMode: artifact.readbackMode ?? null,
      sourceContractStatus: artifact.sourceContractStatus ?? null,
      readbackContractPrepared: artifact.readbackContractPrepared ?? null,
      sourceContractReadyForImplementation: artifact.sourceContractReadyForImplementation ?? null,
      aggregateOnlyOutput: artifact.aggregateOnlyOutput ?? null,
      immediateReadbackAllowedNow: artifact.immediateReadbackAllowedNow ?? null,
      supabaseReadAllowedNow: artifact.supabaseReadAllowedNow ?? null,
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

function validateSourceContract() {
  if (sourceContract.status !== "phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready") {
    problems.push("source contract status mismatch");
  }
  if (sourceContract.contractReadyForImplementation !== true) {
    problems.push("source contract must be implementation-ready for no-execution planning");
  }
  if (sourceContract.nextRoute !== "phase_1_write_runner_aggregate_readback_contract_no_execution") {
    problems.push("source contract nextRoute mismatch");
  }
}

function validateArtifact() {
  if (artifact.status !== "phase_1_write_runner_aggregate_readback_contract_no_execution_ready") {
    problems.push("artifact status mismatch");
  }
  if (artifact.readbackContractPrepared !== true) problems.push("readbackContractPrepared must be true");
  if (artifact.aggregateOnlyOutput !== true) problems.push("aggregateOnlyOutput must be true");
  if (artifact.immediateReadbackAllowedNow !== false) problems.push("immediateReadbackAllowedNow must be false");
  if (artifact.supabaseReadAllowedNow !== false) problems.push("supabaseReadAllowedNow must be false");
  if (artifact.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
  if (artifact.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
  if (artifact.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
  if (artifact.targetRows?.fullLevel1MissingRows !== 178) problems.push("fullLevel1MissingRows must be 178");
  if (artifact.safety?.publicDataSource !== "mock") problems.push("publicDataSource must stay mock");
  if (artifact.safety?.scoreSource !== "mock") problems.push("scoreSource must stay mock");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
