import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-execution-packet-to-final-stopline-chain-convergence-gate.json";
const reportPaths = {
  explicitExecutionPacket: "scripts/report-twii-explicit-execution-packet-preparation-gate.mjs",
  separateAttempt: "scripts/report-twii-separate-authorized-execution-attempt-preparation-gate.mjs",
  finalStoplineAlignment: "scripts/report-twii-final-authorization-stopline-preparation-alignment-gate.mjs",
  finalStoplineGoNoGo: "scripts/report-twii-final-authorization-stopline-go-no-go-gate.mjs"
};
const problems = [];

const gate = readJson(gatePath);
const reports = Object.fromEntries(Object.entries(reportPaths).map(([key, filePath]) => [key, runJsonReport(filePath, key)]));

validateGate();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_execution_packet_to_final_stopline_chain_convergence_gate_ready_no_execution" : "blocked",
  outcome: ok ? "execution_packet_to_final_stopline_chain_converged_execution_still_blocked" : "execution_packet_to_final_stopline_chain_convergence_gate_blocked",
  mode: "twii_execution_packet_to_final_stopline_chain_convergence_gate_no_execution",
  gatePath,
  currentChainStatus: gate.currentChainStatus ?? null,
  nextPMRoute: gate.nextPMRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  chain: {
    readyGateCount: gate.readyGateCount ?? 0,
    executionAllowedNow: false,
    publicDataSource: gate.safety?.publicDataSource ?? null,
    scoreSource: gate.safety?.scoreSource ?? null
  },
  chainState: {
    explicitExecutionPacketPreparationReady: gate.explicitExecutionPacketPreparationReady === true,
    separateAuthorizedExecutionAttemptPreparationReady: gate.separateAuthorizedExecutionAttemptPreparationReady === true,
    finalAuthorizationStoplinePreparationAlignmentReady: gate.finalAuthorizationStoplinePreparationAlignmentReady === true,
    finalAuthorizationStoplineGoNoGoPreparedAsNextRoute: gate.finalAuthorizationStoplineGoNoGoPreparedAsNextRoute === true,
    mockBoundaryPreserved: gate.mockBoundaryPreserved === true,
    noExecution: gate.noExecution === true,
    noSecretValues: gate.noSecretValues === true,
    noRawPayload: gate.noRawPayload === true
  },
  upstream: {
    explicitExecutionPacketStatus: reports.explicitExecutionPacket.status ?? null,
    separateAttemptStatus: reports.separateAttempt.status ?? null,
    finalStoplineAlignmentStatus: reports.finalStoplineAlignment.status ?? null,
    finalStoplineGoNoGoStatus: reports.finalStoplineGoNoGo.status ?? null
  },
  promotionLocks: gate.promotionLocks ?? null,
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_execution_packet_to_final_stopline_chain_convergence_gate",
    gateMode: "execution_packet_to_final_stopline_chain_convergence_fail_closed_no_execution",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    readyGateCount: 4,
    explicitExecutionPacketPreparationReady: true,
    separateAuthorizedExecutionAttemptPreparationReady: true,
    finalAuthorizationStoplinePreparationAlignmentReady: true,
    finalAuthorizationStoplineGoNoGoPreparedAsNextRoute: true,
    currentChainStatus: "execution_packet_to_final_stopline_chain_converged_waiting_final_authorization_stopline_go_no_go",
    nextPMRoute: "twii_final_authorization_stopline_go_no_go_gate",
    allowedNextCommandCategory: "review_only_final_authorization_stopline_go_no_go",
    chainOutcome: "execution_packet_to_final_stopline_chain_converged_but_execution_still_blocked",
    mockBoundaryPreserved: true,
    noExecution: true,
    noSecretValues: true,
    noRawPayload: true
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateReports() {
  const expectedStatuses = {
    explicitExecutionPacket: "twii_explicit_execution_packet_preparation_gate_ready_no_execution",
    separateAttempt: "twii_separate_authorized_execution_attempt_preparation_gate_ready_no_execution",
    finalStoplineAlignment: "twii_final_authorization_stopline_preparation_alignment_gate_ready_no_execution",
    finalStoplineGoNoGo: "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution"
  };
  for (const [key, status] of Object.entries(expectedStatuses)) if (reports[key]?.status !== status) problems.push(`${key} status mismatch`);
}

function falseKeys() {
  return [
    "externalValuesProvidedNow", "operatorDecisionAcceptedNow", "operatorAuthorizationAcceptedNow",
    "operatorGoNoGoAcceptedNow", "authorizationValueReadNow", "serverOnlyCredentialCheckPassed",
    "credentialValuesRead", "executeSwitchProvided", "confirmationPhraseProvided", "rollbackDryRunPassed",
    "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed",
    "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow",
    "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted",
    "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested",
    "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed",
    "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput",
    "promotionAllowed", "scoreSourceRealAllowed"
  ];
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of [
    "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled",
    "supabaseWritesEnabled", "credentialValuesRead", "marketDataFetched", "marketDataIngested",
    "candidateRowsAccepted", "externalValuesProvidedNow", "operatorDecisionAcceptedNow",
    "operatorAuthorizationAcceptedNow", "operatorGoNoGoAcceptedNow", "authorizationValueReadNow",
    "executeSwitchProvided", "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed",
    "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed",
    "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated",
    "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}

function runJsonReport(filePath, label) {
  const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
  if (run.status !== 0) {
    problems.push(`${label} exited ${run.status}`);
    return {};
  }
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${label} did not emit JSON: ${error.message}`);
    return {};
  }
}
