import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-explicit-execute-switch-confirmation-intake-gate.json";
const finalPacketPath = "data/source-gates/twii-final-no-write-authorization-packet.json";
const finalPacketReportPath = "scripts/report-twii-final-no-write-authorization-packet.mjs";
const problems = [];

const gate = readJson(gatePath);
const finalPacket = readJson(finalPacketPath);
const finalPacketReport = runJsonReport(finalPacketReportPath, "TWII final no-write authorization packet");

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_explicit_execute_switch_confirmation_intake_gate_ready_no_execution" : "blocked",
  outcome: ok
    ? "explicit_execute_switch_confirmation_intake_ready_execution_still_blocked"
    : "explicit_execute_switch_confirmation_intake_blocked",
  mode: "twii_explicit_execute_switch_confirmation_intake_gate_no_execution",
  owner: "CEO/PM",
  gatePath,
  finalPacketPath,
  finalPacketReportPath,
  gateReadyForCeoDecision: gate.gateReadyForCeoDecision === true,
  intakeDecision: gate.intakeDecision ?? null,
  attemptId: gate.attemptId ?? null,
  intakeMode: gate.intakeMode ?? null,
  requiredConfirmationPhrase: gate.requiredConfirmationPhrase ?? null,
  executeSwitchName: gate.executeSwitchName ?? null,
  confirmationPhraseName: gate.confirmationPhraseName ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  controls: {
    executeSwitchRequired: gate.executeSwitchRequired === true,
    executeSwitchProvided: gate.executeSwitchProvided === true,
    confirmationPhraseRequired: gate.confirmationPhraseRequired === true,
    confirmationPhraseProvided: gate.confirmationPhraseProvided === true,
    confirmationPhraseMatched: gate.confirmationPhraseMatched === true,
    serverOnlyCredentialCheckRequired: gate.serverOnlyCredentialCheckRequired === true,
    serverOnlyCredentialCheckPassed: gate.serverOnlyCredentialCheckPassed === true,
    finalNoWritePacketAccepted: gate.finalNoWritePacketAccepted === true,
    rollbackDryRunRequired: gate.rollbackDryRunRequired === true,
    rollbackDryRunPassed: gate.rollbackDryRunPassed === true,
    aggregateReadbackRequired: gate.aggregateReadbackRequired === true,
    aggregateReadbackPassed: gate.aggregateReadbackPassed === true,
    postWriteReviewRequired: gate.postWriteReviewRequired === true,
    postWriteReviewPassed: gate.postWriteReviewPassed === true,
    candidateDuplicateRejectionProofRequired: gate.candidateDuplicateRejectionProofRequired === true,
    candidateDuplicateRejectionProofPassed: gate.candidateDuplicateRejectionProofPassed === true
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
  openIntakeBlockers: gate.openIntakeBlockers ?? [],
  currentRoute: "explicit_execute_switch_confirmation_intake_ready_but_execution_blocked",
  nextIfCeoAcceptsGate: gate.nextIfCeoAcceptsGate ?? null,
  nextIfCeoRejectsGate: gate.nextIfCeoRejectsGate ?? null,
  blockedExecutionReasons: gate.blockedExecutionReasons ?? [],
  upstream: {
    finalPacketStatus: finalPacketReport.status ?? null,
    finalPacketOutcome: finalPacketReport.outcome ?? null,
    finalPacketKind: finalPacket.packetKind ?? null
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
    gateKind: "twii_explicit_execute_switch_confirmation_intake_gate",
    finalNoWriteAuthorizationPacketPath: finalPacketPath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    intakeMode: "explicit_execute_switch_confirmation_intake_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    executeSwitchRequired: true,
    executeSwitchProvided: false,
    confirmationPhraseRequired: true,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckRequired: true,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    finalNoWritePacketAccepted: true,
    rollbackDryRunRequired: true,
    rollbackDryRunPassed: false,
    aggregateReadbackRequired: true,
    aggregateReadbackPassed: false,
    postWriteReviewRequired: true,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofRequired: true,
    candidateDuplicateRejectionProofPassed: false,
    gateReadyForCeoDecision: true,
    intakeDecision: "blocked_until_execute_switch_and_confirmation_phrase_are_explicitly_supplied_and_matched",
    executeRequested: false,
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
    nextIfCeoAcceptsGate:
      "wait_for_explicit_execute_switch_and_confirmation_phrase_then_run_server_only_pre_execution_checks",
    nextIfCeoRejectsGate: "repair_execute_switch_confirmation_intake_gate_or_final_no_write_packet"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (!Array.isArray(gate.openIntakeBlockers) || gate.openIntakeBlockers.length < 11) {
    problems.push("gate.openIntakeBlockers must list remaining blockers");
  }
  if (!Array.isArray(gate.blockedExecutionReasons) || gate.blockedExecutionReasons.length < 13) {
    problems.push("gate.blockedExecutionReasons must describe blocked execution state");
  }
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (finalPacketReport.status !== "twii_final_no_write_authorization_packet_ready_no_execution") {
    problems.push("final no-write authorization packet report status mismatch");
  }
  if (finalPacketReport.outcome !== "final_no_write_authorization_packet_ready_execution_still_blocked") {
    problems.push("final no-write authorization packet report outcome mismatch");
  }
  if (finalPacket.packetKind !== "twii_final_no_write_authorization_packet") {
    problems.push("final no-write authorization packet kind mismatch");
  }
  if (
    finalPacket.nextIfCeoAcceptsPacket !==
    "pause_for_explicit_execute_switch_and_confirmation_phrase_before_any_bounded_write_attempt"
  ) {
    problems.push("final no-write packet must route to explicit switch and confirmation");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows", "requiredConfirmationPhrase"]) {
    if (finalPacket[key] !== gate[key]) problems.push(`gate.${key} must match final no-write packet`);
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
