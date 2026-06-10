import fs from "node:fs";
import { spawnSync } from "node:child_process";

const scaffoldPath = "data/source-gates/twii-bounded-write-attempt-runner-fail-closed-scaffold.json";
const preExecutionGatePath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const preExecutionGateReportPath = "scripts/report-twii-server-only-pre-execution-checks-gate.mjs";
const problems = [];

const scaffold = readJson(scaffoldPath);
const preExecutionGate = readJson(preExecutionGatePath);
const preExecutionGateReport = runJsonReport(
  preExecutionGateReportPath,
  "TWII server-only pre-execution checks gate"
);

validateScaffold();
validateUpstream();

const ok = problems.length === 0;
const output = {
  status: ok ? "twii_bounded_write_attempt_runner_fail_closed_scaffold_blocked_no_execution" : "blocked",
  outcome: ok
    ? "bounded_write_attempt_runner_scaffold_invoked_and_fail_closed"
    : "bounded_write_attempt_runner_scaffold_invalid",
  mode: "twii_bounded_write_attempt_runner_fail_closed_scaffold",
  owner: "CEO/PM",
  scaffoldPath,
  preExecutionGatePath,
  attemptId: scaffold.attemptId ?? null,
  runnerMode: scaffold.runnerMode ?? null,
  target: {
    targetTable: scaffold.targetTable ?? null,
    targetLane: scaffold.targetLane ?? null,
    targetScope: scaffold.targetScope ?? null,
    maxRows: scaffold.maxRows ?? null
  },
  controls: {
    preExecutionGateAccepted: scaffold.preExecutionGateAccepted === true,
    executeSwitchProvided: scaffold.executeSwitchProvided === true,
    confirmationPhraseProvided: scaffold.confirmationPhraseProvided === true,
    confirmationPhraseMatched: scaffold.confirmationPhraseMatched === true,
    serverOnlyCredentialCheckPassed: scaffold.serverOnlyCredentialCheckPassed === true,
    credentialPresenceOnlyCheckAllowed: scaffold.credentialPresenceOnlyCheckAllowed === true,
    credentialValuesRead: scaffold.credentialValuesRead === true,
    rollbackDryRunPassed: scaffold.rollbackDryRunPassed === true,
    aggregateReadbackPassed: scaffold.aggregateReadbackPassed === true,
    postWriteReviewPassed: scaffold.postWriteReviewPassed === true,
    candidateDuplicateRejectionProofPassed: scaffold.candidateDuplicateRejectionProofPassed === true
  },
  runnerState: {
    executeRequested: false,
    runnerInvoked: true,
    runnerFailClosed: true,
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
  blockedExecutionReasons: scaffold.blockedExecutionReasons ?? [],
  upstream: {
    preExecutionGateStatus: preExecutionGateReport.status ?? null,
    preExecutionGateOutcome: preExecutionGateReport.outcome ?? null,
    preExecutionGateKind: preExecutionGate.gateKind ?? null
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

console.log(JSON.stringify(output, null, 2));
if (!ok) process.exit(1);

function validateScaffold() {
  const expected = {
    scaffoldKind: "twii_bounded_write_attempt_runner_fail_closed_scaffold",
    preExecutionGatePath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runnerMode: "bounded_write_attempt_runner_fail_closed_scaffold_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    preExecutionGateAccepted: true,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckPassed: false,
    credentialPresenceOnlyCheckAllowed: true,
    credentialValuesRead: false,
    rollbackDryRunPassed: false,
    aggregateReadbackPassed: false,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofPassed: false,
    runnerScaffoldReadyForCeoDecision: true,
    runnerDecision: "blocked_runner_scaffold_fail_closed_until_all_pre_execution_controls_pass",
    executeRequested: false,
    runnerInvoked: true,
    runnerFailClosed: true,
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
    scoreSourceRealAllowed: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (scaffold[key] !== value) problems.push(`scaffold.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(scaffold.scaffoldId)) problems.push("scaffold.scaffoldId is required");
  if (!Array.isArray(scaffold.openRunnerBlockers) || scaffold.openRunnerBlockers.length < 12) {
    problems.push("scaffold.openRunnerBlockers must list remaining blockers");
  }
  if (!Array.isArray(scaffold.blockedExecutionReasons) || scaffold.blockedExecutionReasons.length < 14) {
    problems.push("scaffold.blockedExecutionReasons must describe blocked execution state");
  }
  validateSafety(scaffold.safety ?? {});
}

function validateUpstream() {
  if (preExecutionGateReport.status !== "twii_server_only_pre_execution_checks_gate_ready_no_execution") {
    problems.push("pre-execution gate report status mismatch");
  }
  if (preExecutionGateReport.outcome !== "server_only_pre_execution_checks_ready_execution_still_blocked") {
    problems.push("pre-execution gate report outcome mismatch");
  }
  if (preExecutionGate.gateKind !== "twii_server_only_pre_execution_checks_gate") {
    problems.push("pre-execution gate kind mismatch");
  }
  if (
    preExecutionGate.nextIfCeoAcceptsGate !==
    "prepare_bounded_write_attempt_runner_with_all_pre_execution_checks_still_fail_closed"
  ) {
    problems.push("pre-execution gate must route to bounded write-attempt runner scaffold");
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
    if (preExecutionGate[key] !== scaffold[key]) problems.push(`scaffold.${key} must match pre-execution gate`);
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("scaffold safety must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`scaffold safety.${key} must be false`);
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
