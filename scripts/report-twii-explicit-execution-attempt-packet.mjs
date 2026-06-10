import fs from "node:fs";
import { spawnSync } from "node:child_process";

const packetPath = "data/source-gates/twii-explicit-execution-attempt-packet.json";
const runnerGatePath = "data/source-gates/twii-one-attempt-runner-execution-gate.json";
const runnerStubReportPath = "scripts/report-twii-fail-closed-runner-stub-post-run-review.mjs";
const problems = [];

const packet = readJson(packetPath);
const runnerGate = readJson(runnerGatePath);
const runnerStubReview = runJsonReport(runnerStubReportPath, "TWII fail-closed runner stub post-run review");

validatePacket();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_explicit_execution_attempt_packet_ready_no_execution" : "blocked",
  outcome: ok ? "explicit_execution_attempt_packet_ready_execution_still_blocked" : "explicit_execution_attempt_packet_blocked",
  mode: "twii_explicit_execution_attempt_packet_no_execution",
  owner: "PM/CEO",
  packetPath,
  runnerGatePath,
  runnerStubReportPath,
  packetReadyForPmReview: packet.packetReadyForPmReview === true,
  attemptId: packet.attemptId ?? null,
  runnerMode: packet.runnerMode ?? null,
  requiredConfirmationPhrase: packet.requiredConfirmationPhrase ?? null,
  serverOnlyCredentialPolicy: packet.serverOnlyCredentialPolicy ?? null,
  target: {
    targetTable: packet.targetTable ?? null,
    targetLane: packet.targetLane ?? null,
    targetScope: packet.targetScope ?? null,
    maxRows: packet.maxRows ?? null
  },
  controls: {
    executeSwitchRequired: packet.executeSwitchRequired === true,
    executeDefault: packet.executeDefault === true,
    confirmationPhraseRequired: packet.confirmationPhraseRequired === true,
    rollbackDryRunRequired: packet.rollbackDryRunRequired === true,
    aggregateReadbackRequired: packet.aggregateReadbackRequired === true,
    postWriteReviewRequired: packet.postWriteReviewRequired === true,
    postRunReviewRequired: packet.postRunReviewRequired === true
  },
  noExecutionState: {
    executeRequested: false,
    confirmationPhraseProvided: false,
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
  currentRoute: "explicit_execution_attempt_packet_ready_but_no_execution",
  nextIfPmAcceptsPacket: packet.nextIfPmAcceptsPacket ?? null,
  nextIfPmRejectsPacket: packet.nextIfPmRejectsPacket ?? null,
  blockedExecutionReasons: packet.blockedExecutionReasons ?? [],
  requiredBeforeAnyFutureExecution: packet.requiredBeforeAnyFutureExecution ?? [],
  upstream: {
    runnerGateStatus: runnerGate.gateKind ?? null,
    runnerStubReviewStatus: runnerStubReview.status ?? null,
    runnerStubReviewOutcome: runnerStubReview.outcome ?? null
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

function validatePacket() {
  const expected = {
    packetKind: "twii_explicit_execution_attempt_packet_no_execution",
    runnerGatePath,
    runnerStubPath: "scripts/run-twii-fail-closed-runner-stub.mjs",
    runnerStubPostRunReviewPath: runnerStubReportPath,
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runnerMode: "fail_closed_no_execution",
    executeSwitchRequired: true,
    executeDefault: false,
    confirmationPhraseRequired: true,
    rollbackDryRunRequired: true,
    aggregateReadbackRequired: true,
    postWriteReviewRequired: true,
    postRunReviewRequired: true,
    packetReadyForPmReview: true,
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
    promotionAllowed: false,
    scoreSourceRealAllowed: false,
    nextIfPmAcceptsPacket: "prepare_future_explicit_execute_switch_and_confirmation_gate_after_chairman_review",
    nextIfPmRejectsPacket: "repair_explicit_execution_attempt_packet_or_runner_stub"
  };

  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`packet.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(packet.packetId)) problems.push("packet.packetId is required");
  if (!safeText(packet.attemptId)) problems.push("packet.attemptId is required");
  if (!safeText(packet.requiredConfirmationPhrase)) problems.push("packet.requiredConfirmationPhrase is required");
  if (!safeText(packet.serverOnlyCredentialPolicy)) problems.push("packet.serverOnlyCredentialPolicy is required");
  if (!Array.isArray(packet.blockedExecutionReasons) || packet.blockedExecutionReasons.length < 8) {
    problems.push("packet.blockedExecutionReasons must describe no-execution blockers");
  }
  if (!Array.isArray(packet.requiredBeforeAnyFutureExecution) || packet.requiredBeforeAnyFutureExecution.length < 8) {
    problems.push("packet.requiredBeforeAnyFutureExecution must list future requirements");
  }
  validateSafety(packet.safety ?? {});
}

function validateUpstream() {
  if (runnerGate.gateKind !== "twii_one_attempt_runner_execution_gate_no_execution") {
    problems.push("runner gate kind mismatch");
  }
  if (runnerGate.nextIfPmAcceptsGate !== "prepare_fail_closed_runner_stub_or_explicit_execution_attempt_packet") {
    problems.push("runner gate must route to attempt packet or stub");
  }
  if (runnerGate.attemptId !== packet.attemptId) problems.push("attemptId must match runner gate");
  for (const key of ["targetTable", "targetLane", "targetScope", "maxRows", "runnerMode"]) {
    if (runnerGate[key] !== packet[key]) problems.push(`packet.${key} must match runner gate`);
  }
  if (runnerStubReview.status !== "twii_fail_closed_runner_stub_post_run_review_ready_no_execution") {
    problems.push("runner stub post-run review status mismatch");
  }
  if (runnerStubReview.outcome !== "runner_stub_review_confirms_no_execution") {
    problems.push("runner stub post-run review outcome mismatch");
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("packet safety must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`packet safety.${key} must be false`);
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
