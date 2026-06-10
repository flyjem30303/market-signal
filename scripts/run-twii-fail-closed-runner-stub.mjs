import fs from "node:fs";

const gatePath = "data/source-gates/twii-one-attempt-runner-execution-gate.json";
const problems = [];
const gate = readJson(gatePath);

validateGate();

const ok = problems.length === 0;
const summary = {
  status: ok ? "ok" : "blocked",
  runnerStatus: ok ? "twii_fail_closed_runner_stub_blocked_no_execution" : "twii_fail_closed_runner_stub_invalid_gate",
  attemptId: gate.attemptId ?? null,
  runnerMode: "fail_closed_no_execution",
  blockedReason: ok
    ? "runner_stub_is_fail_closed_and_does_not_execute"
    : "runner_gate_contract_invalid",
  targetTable: gate.targetTable ?? null,
  targetLane: gate.targetLane ?? null,
  targetScope: gate.targetScope ?? null,
  maxRows: gate.maxRows ?? null,
  executeRequested: false,
  confirmationPhraseProvided: false,
  credentialValuesRead: false,
  sqlExecuted: false,
  supabaseConnectionAttempted: false,
  supabaseWritesEnabled: false,
  marketDataFetched: false,
  marketDataIngested: false,
  dailyPricesMutated: false,
  stagingRowsCreated: false,
  candidateRowsAccepted: false,
  rowCoverageScoringAllowed: false,
  rawPayloadOutput: false,
  rowPayloadOutput: false,
  stockIdPayloadOutput: false,
  secretsOutput: false,
  runnerExecutableNow: false,
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  implementationAllowedNow: false,
  publicPromotionAllowed: false,
  scoreSourceRealAllowed: false,
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  problems
};

console.log(JSON.stringify(summary, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  if (gate.gateKind !== "twii_one_attempt_runner_execution_gate_no_execution") {
    problems.push("gateKind must be twii_one_attempt_runner_execution_gate_no_execution");
  }
  if (gate.runnerMode !== "fail_closed_no_execution") problems.push("gate runnerMode must be fail_closed_no_execution");
  if (gate.gateReadyForPmReview !== true) problems.push("gateReadyForPmReview must be true");
  for (const key of [
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "promotionAllowed",
    "rowCoverageScoringAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push(`cannot read JSON: ${filePath}`);
    return {};
  }
}
