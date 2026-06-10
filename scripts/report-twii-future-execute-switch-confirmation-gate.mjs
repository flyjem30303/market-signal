import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-future-execute-switch-confirmation-gate.json";
const attemptPacketPath = "data/source-gates/twii-explicit-execution-attempt-packet.json";
const attemptPacketReportPath = "scripts/report-twii-explicit-execution-attempt-packet.mjs";
const problems = [];

const gate = readJson(gatePath);
const attemptPacket = readJson(attemptPacketPath);
const attemptPacketReport = runJsonReport(attemptPacketReportPath, "TWII explicit execution attempt packet");

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_future_execute_switch_confirmation_gate_ready_no_execution" : "blocked",
  outcome: ok ? "execute_switch_confirmation_gate_ready_execution_still_blocked" : "execute_switch_confirmation_gate_blocked",
  mode: "twii_future_execute_switch_confirmation_gate_no_execution",
  owner: "PM/CEO",
  gatePath,
  attemptPacketPath,
  attemptPacketReportPath,
  gateReadyForPmReview: gate.gateReadyForPmReview === true,
  attemptId: gate.attemptId ?? null,
  runnerMode: gate.runnerMode ?? null,
  requiredConfirmationPhrase: gate.requiredConfirmationPhrase ?? null,
  serverOnlyCredentialPolicy: gate.serverOnlyCredentialPolicy ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  controls: {
    executeSwitchRequired: gate.executeSwitchRequired === true,
    executeDefault: gate.executeDefault === true,
    executeSwitchProvided: gate.executeSwitchProvided === true,
    confirmationPhraseRequired: gate.confirmationPhraseRequired === true,
    confirmationPhraseProvided: gate.confirmationPhraseProvided === true,
    serverOnlyCredentialCheckRequired: gate.serverOnlyCredentialCheckRequired === true,
    serverOnlyCredentialCheckPassed: gate.serverOnlyCredentialCheckPassed === true,
    rollbackDryRunRequired: gate.rollbackDryRunRequired === true,
    rollbackDryRunPassed: gate.rollbackDryRunPassed === true,
    aggregateReadbackRequired: gate.aggregateReadbackRequired === true,
    aggregateReadbackPassed: gate.aggregateReadbackPassed === true,
    postWriteReviewRequired: gate.postWriteReviewRequired === true,
    postWriteReviewPassed: gate.postWriteReviewPassed === true
  },
  noExecutionState: {
    executeRequested: false,
    credentialValuesRead: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  currentRoute: "future_execute_switch_confirmation_gate_ready_but_no_execution",
  nextIfPmAcceptsGate: gate.nextIfPmAcceptsGate ?? null,
  nextIfPmRejectsGate: gate.nextIfPmRejectsGate ?? null,
  blockedExecutionReasons: gate.blockedExecutionReasons ?? [],
  requiredBeforeAnyFutureExecution: gate.requiredBeforeAnyFutureExecution ?? [],
  upstream: {
    attemptPacketStatus: attemptPacketReport.status ?? null,
    attemptPacketOutcome: attemptPacketReport.outcome ?? null,
    attemptPacketKind: attemptPacket.packetKind ?? null
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_future_execute_switch_confirmation_gate_no_execution",
    attemptPacketPath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runnerMode: "fail_closed_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchRequired: true,
    executeDefault: false,
    executeSwitchProvided: false,
    confirmationPhraseRequired: true,
    confirmationPhraseProvided: false,
    serverOnlyCredentialCheckRequired: true,
    serverOnlyCredentialCheckPassed: false,
    rollbackDryRunRequired: true,
    rollbackDryRunPassed: false,
    aggregateReadbackRequired: true,
    aggregateReadbackPassed: false,
    postWriteReviewRequired: true,
    postWriteReviewPassed: false,
    gateReadyForPmReview: true,
    executeRequested: false,
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
    promotionAllowed: false,
    scoreSourceRealAllowed: false,
    nextIfPmAcceptsGate: "prepare_server_only_execute_runner_candidate_after_explicit_switch_gate",
    nextIfPmRejectsGate: "repair_execute_switch_confirmation_gate_or_attempt_packet"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (!safeText(gate.serverOnlyCredentialPolicy)) problems.push("gate.serverOnlyCredentialPolicy is required");
  if (!Array.isArray(gate.blockedExecutionReasons) || gate.blockedExecutionReasons.length < 10) {
    problems.push("gate.blockedExecutionReasons must describe blocked execution state");
  }
  if (!Array.isArray(gate.requiredBeforeAnyFutureExecution) || gate.requiredBeforeAnyFutureExecution.length < 9) {
    problems.push("gate.requiredBeforeAnyFutureExecution must list future requirements");
  }
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (attemptPacketReport.status !== "twii_explicit_execution_attempt_packet_ready_no_execution") {
    problems.push("attempt packet report status mismatch");
  }
  if (attemptPacketReport.outcome !== "explicit_execution_attempt_packet_ready_execution_still_blocked") {
    problems.push("attempt packet report outcome mismatch");
  }
  if (attemptPacket.packetKind !== "twii_explicit_execution_attempt_packet_no_execution") {
    problems.push("attempt packet kind mismatch");
  }
  if (attemptPacket.nextIfPmAcceptsPacket !== "prepare_future_explicit_execute_switch_and_confirmation_gate_after_chairman_review") {
    problems.push("attempt packet must route to future switch gate");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows", "runnerMode", "requiredConfirmationPhrase"]) {
    if (attemptPacket[key] !== gate[key]) problems.push(`gate.${key} must match attempt packet`);
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("gate safety must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "credentialValuesRead",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`gate safety.${key} must be false`);
  }
}

function runJsonReport(scriptPath, label) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${label} must exit 0`);
  try {
    return JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${label} stdout must be JSON`);
    return {};
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

function safeText(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 500;
}
