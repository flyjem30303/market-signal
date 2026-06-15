import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-write-gate-fail-closed-runner-stub.json";
const packetPath = "data/evidence-intake/phase-1-write-gate-execution-packet-draft-no-execution.json";
const problems = [];

const artifact = readJson(artifactPath);
const packet = readJson(packetPath);

validateInputs();

const ok = problems.length === 0;
const output = {
  status: ok ? "ok" : "blocked",
  runnerStatus: ok
    ? "phase_1_write_gate_fail_closed_runner_stub_blocked_no_execution"
    : "phase_1_write_gate_fail_closed_runner_stub_invalid",
  outcome: ok ? "runner_stub_is_fail_closed_and_does_not_execute" : "runner_stub_contract_invalid",
  runnerMode: "fail_closed_no_execution",
  inputExecutionPacket: artifact.inputExecutionPacket ?? null,
  boundedAttemptScope: artifact.boundedAttemptScope ?? null,
  targetTable: artifact.targetTable ?? null,
  targetRows: artifact.targetRows ?? null,
  blockedUntil: artifact.blockedUntil ?? [],
  runnerStubReady: artifact.runnerStubReady === true,
  runnerExecutableNow: false,
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  sqlExecuted: false,
  supabaseClientImported: false,
  supabaseConnectionAttempted: false,
  supabaseReadAttempted: false,
  supabaseWriteAttempted: false,
  credentialValueRead: false,
  marketDataFetched: false,
  marketDataIngested: false,
  candidateRowsAccepted: false,
  dailyPricesMutated: false,
  stagingRowsCreated: false,
  rawPayloadsPrinted: false,
  rowPayloadsPrinted: false,
  secretsPrinted: false,
  publicPromotionAllowed: false,
  scoreSourceRealAllowed: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  problems
};

console.log(JSON.stringify(output, null, 2));
if (!ok) process.exit(1);

function validateInputs() {
  if (packet.status !== "phase_1_write_gate_execution_packet_draft_no_execution_ready") {
    problems.push("execution packet draft must be ready");
  }
  if (packet.executionAllowedNow !== false || packet.writeGateExecutableNow !== false) {
    problems.push("execution packet must remain non-executable");
  }
  if (artifact.status !== "phase_1_write_gate_fail_closed_runner_stub_ready_no_execution") {
    problems.push("runner stub artifact status mismatch");
  }
  if (artifact.runnerMode !== "fail_closed_no_execution") problems.push("runnerMode must fail closed");
  if (artifact.inputExecutionPacket !== packet.status) problems.push("runner inputExecutionPacket must match packet status");
  if (artifact.runnerExecutableNow !== false) problems.push("runnerExecutableNow must be false");
  if (artifact.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
  if (artifact.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
  if (artifact.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
  if (artifact.boundedAttemptScope !== "twii_and_etf_phase_1_missing_row_closure_only") {
    problems.push("boundedAttemptScope mismatch");
  }
  for (const [key, expected] of Object.entries({
    fullLevel1ExpectedRows: 360,
    fullLevel1ObservedRows: 182,
    fullLevel1MissingRows: 178,
    twiiMissingRows: 60,
    etfMissingRows: 118
  })) {
    if (artifact.targetRows?.[key] !== expected) problems.push(`targetRows.${key} mismatch`);
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`cannot read JSON ${filePath}: ${error.message}`);
    return {};
  }
}
