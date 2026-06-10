import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const intakeGatePath = "data/source-gates/twii-explicit-execute-switch-confirmation-intake-gate.json";
const intakeGateReportPath = "scripts/report-twii-explicit-execute-switch-confirmation-intake-gate.mjs";
const problems = [];

const gate = readJson(gatePath);
const intakeGate = readJson(intakeGatePath);
const intakeGateReport = runJsonReport(intakeGateReportPath, "TWII explicit execute switch confirmation intake gate");

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_server_only_pre_execution_checks_gate_ready_no_execution" : "blocked",
  outcome: ok
    ? "server_only_pre_execution_checks_ready_execution_still_blocked"
    : "server_only_pre_execution_checks_blocked",
  mode: "twii_server_only_pre_execution_checks_gate_no_execution",
  owner: "CEO/PM",
  gatePath,
  intakeGatePath,
  intakeGateReportPath,
  gateReadyForCeoDecision: gate.gateReadyForCeoDecision === true,
  preExecutionDecision: gate.preExecutionDecision ?? null,
  attemptId: gate.attemptId ?? null,
  preExecutionMode: gate.preExecutionMode ?? null,
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
    intakeGateAccepted: gate.intakeGateAccepted === true,
    executeSwitchRequired: gate.executeSwitchRequired === true,
    executeSwitchProvided: gate.executeSwitchProvided === true,
    confirmationPhraseRequired: gate.confirmationPhraseRequired === true,
    confirmationPhraseProvided: gate.confirmationPhraseProvided === true,
    confirmationPhraseMatched: gate.confirmationPhraseMatched === true,
    serverOnlyCredentialCheckRequired: gate.serverOnlyCredentialCheckRequired === true,
    serverOnlyCredentialCheckPassed: gate.serverOnlyCredentialCheckPassed === true,
    credentialPresenceOnlyCheckAllowed: gate.credentialPresenceOnlyCheckAllowed === true,
    credentialValuesRead: gate.credentialValuesRead === true,
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
  openPreExecutionBlockers: gate.openPreExecutionBlockers ?? [],
  currentRoute: "server_only_pre_execution_checks_ready_but_execution_blocked",
  nextIfCeoAcceptsGate: gate.nextIfCeoAcceptsGate ?? null,
  nextIfCeoRejectsGate: gate.nextIfCeoRejectsGate ?? null,
  blockedExecutionReasons: gate.blockedExecutionReasons ?? [],
  upstream: {
    intakeGateStatus: intakeGateReport.status ?? null,
    intakeGateOutcome: intakeGateReport.outcome ?? null,
    intakeGateKind: intakeGate.gateKind ?? null
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
    gateKind: "twii_server_only_pre_execution_checks_gate",
    intakeGatePath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    preExecutionMode: "server_only_pre_execution_checks_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    intakeGateAccepted: true,
    executeSwitchRequired: true,
    executeSwitchProvided: false,
    confirmationPhraseRequired: true,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckRequired: true,
    serverOnlyCredentialCheckPassed: false,
    credentialPresenceOnlyCheckAllowed: true,
    credentialValuesRead: false,
    rollbackDryRunRequired: true,
    rollbackDryRunPassed: false,
    aggregateReadbackRequired: true,
    aggregateReadbackPassed: false,
    postWriteReviewRequired: true,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofRequired: true,
    candidateDuplicateRejectionProofPassed: false,
    gateReadyForCeoDecision: true,
    preExecutionDecision: "blocked_until_switch_confirmation_credentials_rollback_readback_and_review_pass",
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
    nextIfCeoAcceptsGate: "prepare_bounded_write_attempt_runner_with_all_pre_execution_checks_still_fail_closed",
    nextIfCeoRejectsGate: "repair_server_only_pre_execution_checks_gate_or_intake_gate"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (!Array.isArray(gate.openPreExecutionBlockers) || gate.openPreExecutionBlockers.length < 12) {
    problems.push("gate.openPreExecutionBlockers must list remaining blockers");
  }
  if (!Array.isArray(gate.blockedExecutionReasons) || gate.blockedExecutionReasons.length < 14) {
    problems.push("gate.blockedExecutionReasons must describe blocked execution state");
  }
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (intakeGateReport.status !== "twii_explicit_execute_switch_confirmation_intake_gate_ready_no_execution") {
    problems.push("intake gate report status mismatch");
  }
  if (intakeGateReport.outcome !== "explicit_execute_switch_confirmation_intake_ready_execution_still_blocked") {
    problems.push("intake gate report outcome mismatch");
  }
  if (intakeGate.gateKind !== "twii_explicit_execute_switch_confirmation_intake_gate") {
    problems.push("intake gate kind mismatch");
  }
  if (
    intakeGate.nextIfCeoAcceptsGate !==
    "wait_for_explicit_execute_switch_and_confirmation_phrase_then_run_server_only_pre_execution_checks"
  ) {
    problems.push("intake gate must route to server-only pre-execution checks");
  }
  for (const key of [
    "attemptId",
    "targetTable",
    "targetLane",
    "targetScope",
    "maxRows",
    "requiredConfirmationPhrase",
    "executeSwitchName",
    "confirmationPhraseName"
  ]) {
    if (intakeGate[key] !== gate[key]) problems.push(`gate.${key} must match intake gate`);
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
