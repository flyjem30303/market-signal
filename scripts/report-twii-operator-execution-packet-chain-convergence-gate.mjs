import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-operator-execution-packet-chain-convergence-gate.json";
const reportPaths = {
  externalToServer: "scripts/report-twii-external-to-server-preexecution-chain-convergence-gate.mjs",
  boundedAuthorization: "scripts/report-twii-bounded-operator-authorization-packet-preparation-gate.mjs",
  explicitExecution: "scripts/report-twii-explicit-execution-packet-preparation-gate.mjs",
  separateAttempt: "scripts/report-twii-separate-authorized-execution-attempt-preparation-gate.mjs",
  finalStopline: "scripts/report-twii-final-authorization-stopline-preparation-alignment-gate.mjs",
  goNoGoAlignment: "scripts/report-twii-explicit-operator-go-no-go-decision-preparation-alignment-gate.mjs"
};
const problems = [];

const gate = readJson(gatePath);
const reports = Object.fromEntries(Object.entries(reportPaths).map(([key, filePath]) => [key, runJsonReport(filePath, key)]));

validateGate();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_operator_execution_packet_chain_convergence_gate_ready_no_execution" : "blocked",
  outcome: ok ? "operator_execution_packet_chain_converged_execution_still_blocked" : "operator_execution_packet_chain_convergence_gate_blocked",
  mode: "twii_operator_execution_packet_chain_convergence_gate_no_execution",
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
    externalToServerPreexecutionChainConverged: gate.externalToServerPreexecutionChainConverged === true,
    boundedOperatorAuthorizationPacketPreparationReady: gate.boundedOperatorAuthorizationPacketPreparationReady === true,
    explicitExecutionPacketPreparationReady: gate.explicitExecutionPacketPreparationReady === true,
    separateAuthorizedExecutionAttemptPreparationReady: gate.separateAuthorizedExecutionAttemptPreparationReady === true,
    finalAuthorizationStoplinePreparationAlignmentReady: gate.finalAuthorizationStoplinePreparationAlignmentReady === true,
    explicitOperatorGoNoGoDecisionPreparationAlignmentPreparedAsNextRoute: gate.explicitOperatorGoNoGoDecisionPreparationAlignmentPreparedAsNextRoute === true,
    mockBoundaryPreserved: gate.mockBoundaryPreserved === true,
    noExecution: gate.noExecution === true,
    noSecretValues: gate.noSecretValues === true,
    noRawPayload: gate.noRawPayload === true
  },
  upstream: {
    externalToServerStatus: reports.externalToServer.status ?? null,
    boundedAuthorizationStatus: reports.boundedAuthorization.status ?? null,
    explicitExecutionStatus: reports.explicitExecution.status ?? null,
    separateAttemptStatus: reports.separateAttempt.status ?? null,
    finalStoplineStatus: reports.finalStopline.status ?? null,
    goNoGoAlignmentStatus: reports.goNoGoAlignment.status ?? null
  },
  promotionLocks: gate.promotionLocks ?? null,
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_operator_execution_packet_chain_convergence_gate",
    gateMode: "operator_execution_packet_chain_convergence_fail_closed_no_execution",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    readyGateCount: 5,
    externalToServerPreexecutionChainConverged: true,
    boundedOperatorAuthorizationPacketPreparationReady: true,
    explicitExecutionPacketPreparationReady: true,
    separateAuthorizedExecutionAttemptPreparationReady: true,
    finalAuthorizationStoplinePreparationAlignmentReady: true,
    explicitOperatorGoNoGoDecisionPreparationAlignmentPreparedAsNextRoute: true,
    currentChainStatus: "operator_execution_packet_chain_converged_waiting_explicit_operator_go_no_go_decision_preparation_alignment",
    nextPMRoute: "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate",
    allowedNextCommandCategory: "review_only_explicit_operator_go_no_go_decision_preparation_alignment",
    chainOutcome: "operator_execution_packet_chain_converged_but_execution_still_blocked",
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
    externalToServer: "twii_external_to_server_preexecution_chain_convergence_gate_ready_no_execution",
    boundedAuthorization: "twii_bounded_operator_authorization_packet_preparation_gate_ready_no_execution",
    explicitExecution: "twii_explicit_execution_packet_preparation_gate_ready_no_execution",
    separateAttempt: "twii_separate_authorized_execution_attempt_preparation_gate_ready_no_execution",
    finalStopline: "twii_final_authorization_stopline_preparation_alignment_gate_ready_no_execution",
    goNoGoAlignment: "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate_ready_no_execution"
  };
  for (const [key, status] of Object.entries(expectedStatuses)) if (reports[key]?.status !== status) problems.push(`${key} status mismatch`);
}

function falseKeys() {
  return [
    "externalValuesProvidedNow", "boundedOperatorAuthorizationAcceptedNow", "explicitExecutionAuthorizedNow",
    "separateAttemptAuthorizedNow", "finalAuthorizationStoplineAcceptedNow", "realValuesProvidedNow",
    "realValuesReadNow", "realDecisionValueReadNow", "externalOperatorDecisionProvidedNow",
    "explicitDecisionValueReadNow", "operatorGoDecisionAcceptedNow", "operatorAuthorizationAcceptedNow",
    "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed",
    "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed",
    "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow",
    "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted",
    "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested",
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
    "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted",
    "externalValuesProvidedNow", "boundedOperatorAuthorizationAcceptedNow", "explicitExecutionAuthorizedNow",
    "separateAttemptAuthorizedNow", "finalAuthorizationStoplineAcceptedNow", "realValuesProvidedNow",
    "realValuesReadNow", "realDecisionValueReadNow", "externalOperatorDecisionProvidedNow",
    "explicitDecisionValueReadNow", "operatorGoDecisionAcceptedNow", "operatorAuthorizationAcceptedNow",
    "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed",
    "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed",
    "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput",
    "publicPromotionAllowed", "scoreSourceRealAllowed"
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
