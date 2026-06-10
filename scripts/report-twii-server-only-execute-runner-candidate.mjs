import fs from "node:fs";
import { spawnSync } from "node:child_process";

const candidatePath = "data/source-gates/twii-server-only-execute-runner-candidate.json";
const switchGatePath = "data/source-gates/twii-future-execute-switch-confirmation-gate.json";
const switchGateReportPath = "scripts/report-twii-future-execute-switch-confirmation-gate.mjs";
const runnerPath = "scripts/run-twii-server-only-execute-runner-candidate.mjs";
const problems = [];

const candidate = readJson(candidatePath);
const switchGate = readJson(switchGatePath);
const switchGateReport = runJsonReport(switchGateReportPath, "TWII future execute switch confirmation gate");
const runnerSummary = runJsonReport(runnerPath, "TWII server-only execute runner candidate");

validateCandidate();
validateUpstream();
validateRunnerSummary();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_server_only_execute_runner_candidate_ready_no_execution" : "blocked",
  outcome: ok ? "server_only_execute_runner_candidate_ready_execution_still_blocked" : "server_only_execute_runner_candidate_blocked",
  mode: "twii_server_only_execute_runner_candidate_no_execution",
  owner: "PM/CEO",
  candidatePath,
  switchGatePath,
  switchGateReportPath,
  runnerPath,
  candidateReadyForPmReview: candidate.candidateReadyForPmReview === true,
  runnerCandidateStatus: runnerSummary.runnerCandidateStatus ?? null,
  attemptId: candidate.attemptId ?? null,
  runnerMode: candidate.runnerMode ?? null,
  requiredConfirmationPhrase: candidate.requiredConfirmationPhrase ?? null,
  serverOnlyCredentialPolicy: candidate.serverOnlyCredentialPolicy ?? null,
  target: {
    targetTable: candidate.targetTable ?? null,
    targetLane: candidate.targetLane ?? null,
    targetScope: candidate.targetScope ?? null,
    maxRows: candidate.maxRows ?? null
  },
  controls: {
    executeSwitchRequired: candidate.executeSwitchRequired === true,
    executeSwitchProvided: candidate.executeSwitchProvided === true,
    confirmationPhraseRequired: candidate.confirmationPhraseRequired === true,
    confirmationPhraseProvided: candidate.confirmationPhraseProvided === true,
    serverOnlyCredentialCheckRequired: candidate.serverOnlyCredentialCheckRequired === true,
    serverOnlyCredentialCheckPassed: candidate.serverOnlyCredentialCheckPassed === true,
    rollbackDryRunRequired: candidate.rollbackDryRunRequired === true,
    rollbackDryRunPassed: candidate.rollbackDryRunPassed === true,
    aggregateReadbackRequired: candidate.aggregateReadbackRequired === true,
    aggregateReadbackPassed: candidate.aggregateReadbackPassed === true,
    postWriteReviewRequired: candidate.postWriteReviewRequired === true,
    postWriteReviewPassed: candidate.postWriteReviewPassed === true
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
  currentRoute: "server_only_execute_runner_candidate_ready_but_no_execution",
  nextIfPmAcceptsCandidate: candidate.nextIfPmAcceptsCandidate ?? null,
  nextIfPmRejectsCandidate: candidate.nextIfPmRejectsCandidate ?? null,
  blockedExecutionReasons: candidate.blockedExecutionReasons ?? [],
  upstream: {
    switchGateStatus: switchGateReport.status ?? null,
    switchGateOutcome: switchGateReport.outcome ?? null,
    switchGateKind: switchGate.gateKind ?? null
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

function validateCandidate() {
  const expected = {
    candidateKind: "twii_server_only_execute_runner_candidate_no_execution",
    switchGatePath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runnerMode: "server_only_candidate_fail_closed_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchRequired: true,
    executeSwitchProvided: false,
    confirmationPhraseRequired: true,
    confirmationPhraseProvided: false,
    serverOnlyCredentialCheckRequired: true,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    rollbackDryRunRequired: true,
    rollbackDryRunPassed: false,
    aggregateReadbackRequired: true,
    aggregateReadbackPassed: false,
    postWriteReviewRequired: true,
    postWriteReviewPassed: false,
    candidateReadyForPmReview: true,
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
    nextIfPmAcceptsCandidate: "prepare_server_only_runner_preflight_without_execution",
    nextIfPmRejectsCandidate: "repair_server_only_execute_runner_candidate_or_switch_gate"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (candidate[key] !== value) problems.push(`candidate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(candidate.candidateId)) problems.push("candidate.candidateId is required");
  if (!safeText(candidate.serverOnlyCredentialPolicy)) problems.push("candidate.serverOnlyCredentialPolicy is required");
  if (!Array.isArray(candidate.blockedExecutionReasons) || candidate.blockedExecutionReasons.length < 10) {
    problems.push("candidate.blockedExecutionReasons must describe blocked execution state");
  }
  if (!Array.isArray(candidate.runnerOutputContract) || candidate.runnerOutputContract.length < 18) {
    problems.push("candidate.runnerOutputContract must list sanitized runner output fields");
  }
  validateSafety(candidate.safety ?? {});
}

function validateUpstream() {
  if (switchGateReport.status !== "twii_future_execute_switch_confirmation_gate_ready_no_execution") {
    problems.push("switch gate report status mismatch");
  }
  if (switchGateReport.outcome !== "execute_switch_confirmation_gate_ready_execution_still_blocked") {
    problems.push("switch gate report outcome mismatch");
  }
  if (switchGate.gateKind !== "twii_future_execute_switch_confirmation_gate_no_execution") {
    problems.push("switch gate kind mismatch");
  }
  if (switchGate.nextIfPmAcceptsGate !== "prepare_server_only_execute_runner_candidate_after_explicit_switch_gate") {
    problems.push("switch gate must route to server-only runner candidate");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows", "requiredConfirmationPhrase"]) {
    if (switchGate[key] !== candidate[key]) problems.push(`candidate.${key} must match switch gate`);
  }
}

function validateRunnerSummary() {
  if (runnerSummary.status !== "ok") problems.push("runner candidate summary status must be ok");
  if (runnerSummary.runnerCandidateStatus !== "twii_server_only_execute_runner_candidate_blocked_no_execution") {
    problems.push("runnerCandidateStatus mismatch");
  }
  for (const key of [
    "executeRequested",
    "executeSwitchProvided",
    "confirmationPhraseProvided",
    "credentialValuesRead",
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
    "dailyPricesMutated",
    "candidateRowsAccepted",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow"
  ]) {
    if (runnerSummary[key] !== false) problems.push(`runnerSummary.${key} must be false`);
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("candidate safety must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`candidate safety.${key} must be false`);
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
