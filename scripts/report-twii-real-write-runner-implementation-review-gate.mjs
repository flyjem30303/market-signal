import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-real-write-runner-implementation-review-gate.json";
const runnerScaffoldPath = "data/source-gates/twii-bounded-write-attempt-runner-fail-closed-scaffold.json";
const runnerScaffoldReportPath = "scripts/report-twii-bounded-write-attempt-runner-fail-closed-scaffold.mjs";
const problems = [];

const gate = readJson(gatePath);
const runnerScaffold = readJson(runnerScaffoldPath);
const runnerScaffoldReport = runJsonReport(
  runnerScaffoldReportPath,
  "TWII bounded write-attempt runner fail-closed scaffold"
);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_real_write_runner_implementation_review_gate_ready_no_execution" : "blocked",
  outcome: ok
    ? "real_write_runner_implementation_review_ready_implementation_still_blocked"
    : "real_write_runner_implementation_review_blocked",
  mode: "twii_real_write_runner_implementation_review_gate_no_execution",
  owner: "CEO/PM",
  gatePath,
  runnerScaffoldPath,
  runnerScaffoldReportPath,
  gateReadyForCeoDecision: gate.gateReadyForCeoDecision === true,
  implementationReviewDecision: gate.implementationReviewDecision ?? null,
  attemptId: gate.attemptId ?? null,
  reviewMode: gate.reviewMode ?? null,
  requiredConfirmationPhrase: gate.requiredConfirmationPhrase ?? null,
  executeSwitchName: gate.executeSwitchName ?? null,
  confirmationPhraseName: gate.confirmationPhraseName ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  implementationControls: {
    runnerScaffoldAccepted: gate.runnerScaffoldAccepted === true,
    supabaseClientImplementationAllowed: gate.supabaseClientImplementationAllowed === true,
    credentialPresenceCheckImplementationAllowed: gate.credentialPresenceCheckImplementationAllowed === true,
    boundedInsertImplementationAllowed: gate.boundedInsertImplementationAllowed === true
  },
  executionControls: {
    executeSwitchProvided: gate.executeSwitchProvided === true,
    confirmationPhraseProvided: gate.confirmationPhraseProvided === true,
    confirmationPhraseMatched: gate.confirmationPhraseMatched === true,
    serverOnlyCredentialCheckPassed: gate.serverOnlyCredentialCheckPassed === true,
    credentialValuesRead: gate.credentialValuesRead === true,
    rollbackDryRunPassed: gate.rollbackDryRunPassed === true,
    aggregateReadbackPassed: gate.aggregateReadbackPassed === true,
    postWriteReviewPassed: gate.postWriteReviewPassed === true,
    candidateDuplicateRejectionProofPassed: gate.candidateDuplicateRejectionProofPassed === true
  },
  noExecutionState: {
    executeRequested: false,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  openImplementationBlockers: gate.openImplementationBlockers ?? [],
  currentRoute: "real_write_runner_implementation_review_ready_but_implementation_blocked",
  nextIfCeoAcceptsGate: gate.nextIfCeoAcceptsGate ?? null,
  nextIfCeoRejectsGate: gate.nextIfCeoRejectsGate ?? null,
  blockedImplementationReasons: gate.blockedImplementationReasons ?? [],
  upstream: {
    runnerScaffoldStatus: runnerScaffoldReport.status ?? null,
    runnerScaffoldOutcome: runnerScaffoldReport.outcome ?? null,
    runnerScaffoldKind: runnerScaffold.scaffoldKind ?? null
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
    gateKind: "twii_real_write_runner_implementation_review_gate",
    runnerScaffoldPath,
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    reviewMode: "real_write_runner_implementation_review_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    runnerScaffoldAccepted: true,
    supabaseClientImplementationAllowed: false,
    credentialPresenceCheckImplementationAllowed: false,
    boundedInsertImplementationAllowed: false,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    rollbackDryRunPassed: false,
    aggregateReadbackPassed: false,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofPassed: false,
    gateReadyForCeoDecision: true,
    implementationReviewDecision:
      "blocked_until_implementation_scope_is_explicitly_authorized_after_all_pre_execution_controls_pass",
    executeRequested: false,
    sqlExecuted: false,
    supabaseClientImported: false,
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
    nextIfCeoAcceptsGate: "prepare_implementation_scope_packet_before_adding_supabase_client_or_bounded_insert_path",
    nextIfCeoRejectsGate: "repair_real_write_runner_implementation_review_gate_or_runner_scaffold"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (!Array.isArray(gate.openImplementationBlockers) || gate.openImplementationBlockers.length < 15) {
    problems.push("gate.openImplementationBlockers must list remaining blockers");
  }
  if (!Array.isArray(gate.blockedImplementationReasons) || gate.blockedImplementationReasons.length < 17) {
    problems.push("gate.blockedImplementationReasons must describe blocked implementation state");
  }
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (runnerScaffoldReport.status !== "twii_bounded_write_attempt_runner_fail_closed_scaffold_ready_no_execution") {
    problems.push("runner scaffold report status mismatch");
  }
  if (runnerScaffoldReport.outcome !== "bounded_write_attempt_runner_scaffold_ready_and_fail_closed") {
    problems.push("runner scaffold report outcome mismatch");
  }
  if (runnerScaffold.scaffoldKind !== "twii_bounded_write_attempt_runner_fail_closed_scaffold") {
    problems.push("runner scaffold kind mismatch");
  }
  if (
    runnerScaffold.nextIfCeoAcceptsScaffold !==
    "prepare_real_write_runner_implementation_review_gate_without_enabling_execution"
  ) {
    problems.push("runner scaffold must route to real write-runner implementation review gate");
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
    if (runnerScaffold[key] !== gate[key]) problems.push(`gate.${key} must match runner scaffold`);
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
