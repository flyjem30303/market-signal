import fs from "node:fs";
import { spawnSync } from "node:child_process";

const preflightPath = "data/source-gates/twii-server-only-runner-preflight.json";
const candidatePath = "data/source-gates/twii-server-only-execute-runner-candidate.json";
const candidateReportPath = "scripts/report-twii-server-only-execute-runner-candidate.mjs";
const preflightRunPath = "scripts/run-twii-server-only-runner-preflight.mjs";
const problems = [];

const preflight = readJson(preflightPath);
const candidate = readJson(candidatePath);
const candidateReport = runJsonReport(candidateReportPath, "TWII server-only execute runner candidate");
const preflightSummary = runJsonReport(preflightRunPath, "TWII server-only runner preflight");

validatePreflight();
validateUpstream();
validatePreflightSummary();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_server_only_runner_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "server_only_runner_preflight_ready_execution_still_blocked" : "server_only_runner_preflight_blocked",
  mode: "twii_server_only_runner_preflight_no_execution",
  owner: "PM/CEO",
  preflightPath,
  candidatePath,
  candidateReportPath,
  preflightRunPath,
  preflightReadyForPmReview: preflight.preflightReadyForPmReview === true,
  preflightStatus: preflightSummary.preflightStatus ?? null,
  attemptId: preflight.attemptId ?? null,
  runnerMode: preflight.runnerMode ?? null,
  requiredConfirmationPhrase: preflight.requiredConfirmationPhrase ?? null,
  serverOnlyCredentialPolicy: preflight.serverOnlyCredentialPolicy ?? null,
  target: {
    targetTable: preflight.targetTable ?? null,
    targetLane: preflight.targetLane ?? null,
    targetScope: preflight.targetScope ?? null,
    maxRows: preflight.maxRows ?? null
  },
  controls: {
    executeSwitchRequired: preflight.executeSwitchRequired === true,
    executeSwitchProvided: preflight.executeSwitchProvided === true,
    confirmationPhraseRequired: preflight.confirmationPhraseRequired === true,
    confirmationPhraseProvided: preflight.confirmationPhraseProvided === true,
    serverOnlyCredentialCheckRequired: preflight.serverOnlyCredentialCheckRequired === true,
    serverOnlyCredentialCheckPassed: preflight.serverOnlyCredentialCheckPassed === true,
    rollbackDryRunRequired: preflight.rollbackDryRunRequired === true,
    rollbackDryRunPassed: preflight.rollbackDryRunPassed === true,
    aggregateReadbackRequired: preflight.aggregateReadbackRequired === true,
    aggregateReadbackPassed: preflight.aggregateReadbackPassed === true,
    postWriteReviewRequired: preflight.postWriteReviewRequired === true,
    postWriteReviewPassed: preflight.postWriteReviewPassed === true,
    candidateDuplicateRejectionProofRequired: preflight.candidateDuplicateRejectionProofRequired === true,
    candidateDuplicateRejectionProofPassed: preflight.candidateDuplicateRejectionProofPassed === true
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
  currentRoute: "server_only_runner_preflight_ready_but_no_execution",
  nextIfPmAcceptsPreflight: preflight.nextIfPmAcceptsPreflight ?? null,
  nextIfPmRejectsPreflight: preflight.nextIfPmRejectsPreflight ?? null,
  blockedExecutionReasons: preflight.blockedExecutionReasons ?? [],
  upstream: {
    candidateStatus: candidateReport.status ?? null,
    candidateOutcome: candidateReport.outcome ?? null,
    candidateKind: candidate.candidateKind ?? null
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

function validatePreflight() {
  const expected = {
    preflightKind: "twii_server_only_runner_preflight_no_execution",
    runnerCandidatePath: candidatePath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runnerMode: "server_only_preflight_fail_closed_no_execution",
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
    candidateDuplicateRejectionProofRequired: true,
    candidateDuplicateRejectionProofPassed: false,
    preflightReadyForPmReview: true,
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
    nextIfPmAcceptsPreflight: "prepare_no_secret_execution_readiness_review_before_any_real_attempt",
    nextIfPmRejectsPreflight: "repair_server_only_runner_preflight_or_candidate"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (preflight[key] !== value) problems.push(`preflight.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(preflight.preflightId)) problems.push("preflight.preflightId is required");
  if (!safeText(preflight.serverOnlyCredentialPolicy)) problems.push("preflight.serverOnlyCredentialPolicy is required");
  if (!Array.isArray(preflight.blockedExecutionReasons) || preflight.blockedExecutionReasons.length < 12) {
    problems.push("preflight.blockedExecutionReasons must describe blocked execution state");
  }
  if (!Array.isArray(preflight.preflightOutputContract) || preflight.preflightOutputContract.length < 20) {
    problems.push("preflight.preflightOutputContract must list sanitized preflight output fields");
  }
  validateSafety(preflight.safety ?? {});
}

function validateUpstream() {
  if (candidateReport.status !== "twii_server_only_execute_runner_candidate_ready_no_execution") {
    problems.push("candidate report status mismatch");
  }
  if (candidateReport.outcome !== "server_only_execute_runner_candidate_ready_execution_still_blocked") {
    problems.push("candidate report outcome mismatch");
  }
  if (candidate.candidateKind !== "twii_server_only_execute_runner_candidate_no_execution") {
    problems.push("candidate kind mismatch");
  }
  if (candidate.nextIfPmAcceptsCandidate !== "prepare_server_only_runner_preflight_without_execution") {
    problems.push("candidate must route to server-only runner preflight");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows", "requiredConfirmationPhrase"]) {
    if (candidate[key] !== preflight[key]) problems.push(`preflight.${key} must match candidate`);
  }
}

function validatePreflightSummary() {
  if (preflightSummary.status !== "ok") problems.push("preflight summary status must be ok");
  if (preflightSummary.preflightStatus !== "twii_server_only_runner_preflight_blocked_no_execution") {
    problems.push("preflightStatus mismatch");
  }
  for (const key of [
    "executeSwitchProvided",
    "confirmationPhraseProvided",
    "serverOnlyCredentialCheckPassed",
    "credentialValuesRead",
    "rollbackDryRunPassed",
    "aggregateReadbackPassed",
    "postWriteReviewPassed",
    "candidateDuplicateRejectionProofPassed",
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
    if (preflightSummary[key] !== false) problems.push(`preflightSummary.${key} must be false`);
  }
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("preflight safety must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`preflight safety.${key} must be false`);
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
