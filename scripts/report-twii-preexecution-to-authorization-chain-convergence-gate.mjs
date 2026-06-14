import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-preexecution-to-authorization-chain-convergence-gate.json";
const reportPaths = {
  operatorDecisionIntake: "scripts/report-twii-operator-decision-intake-chain-convergence-gate.mjs",
  readiness: "scripts/report-twii-pre-execution-readiness-recheck-preparation-gate.mjs",
  serverOnly: "scripts/report-twii-server-only-pre-execution-integration-preparation-gate.mjs",
  authorizationPacket: "scripts/report-twii-bounded-operator-authorization-packet-preparation-gate.mjs",
  explicitExecutionPacket: "scripts/report-twii-explicit-execution-packet-preparation-gate.mjs"
};
const problems = [];

const gate = readJson(gatePath);
const reports = Object.fromEntries(Object.entries(reportPaths).map(([key, filePath]) => [key, runJsonReport(filePath, key)]));

validateGate();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_preexecution_to_authorization_chain_convergence_gate_ready_no_execution" : "blocked",
  outcome: ok ? "preexecution_to_authorization_chain_converged_execution_still_blocked" : "preexecution_to_authorization_chain_convergence_gate_blocked",
  mode: "twii_preexecution_to_authorization_chain_convergence_gate_no_execution",
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
    operatorDecisionIntakeChainConverged: gate.operatorDecisionIntakeChainConverged === true,
    preExecutionReadinessRecheckPreparationReady: gate.preExecutionReadinessRecheckPreparationReady === true,
    serverOnlyPreExecutionIntegrationPreparationReady: gate.serverOnlyPreExecutionIntegrationPreparationReady === true,
    boundedOperatorAuthorizationPacketPreparationReady: gate.boundedOperatorAuthorizationPacketPreparationReady === true,
    explicitExecutionPacketPreparationPreparedAsNextRoute: gate.explicitExecutionPacketPreparationPreparedAsNextRoute === true,
    mockBoundaryPreserved: gate.mockBoundaryPreserved === true,
    noExecution: gate.noExecution === true,
    noSecretValues: gate.noSecretValues === true,
    noRawPayload: gate.noRawPayload === true
  },
  upstream: {
    operatorDecisionIntakeStatus: reports.operatorDecisionIntake.status ?? null,
    readinessStatus: reports.readiness.status ?? null,
    serverOnlyStatus: reports.serverOnly.status ?? null,
    authorizationPacketStatus: reports.authorizationPacket.status ?? null,
    explicitExecutionPacketStatus: reports.explicitExecutionPacket.status ?? null
  },
  promotionLocks: gate.promotionLocks ?? null,
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_preexecution_to_authorization_chain_convergence_gate",
    gateMode: "preexecution_to_authorization_chain_convergence_fail_closed_no_execution",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    readyGateCount: 4,
    operatorDecisionIntakeChainConverged: true,
    preExecutionReadinessRecheckPreparationReady: true,
    serverOnlyPreExecutionIntegrationPreparationReady: true,
    boundedOperatorAuthorizationPacketPreparationReady: true,
    explicitExecutionPacketPreparationPreparedAsNextRoute: true,
    currentChainStatus: "preexecution_to_authorization_chain_converged_waiting_explicit_execution_packet_preparation",
    nextPMRoute: "twii_explicit_execution_packet_preparation_gate",
    allowedNextCommandCategory: "review_only_explicit_execution_packet_preparation",
    chainOutcome: "preexecution_to_authorization_chain_converged_but_execution_still_blocked",
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
    operatorDecisionIntake: "twii_operator_decision_intake_chain_convergence_gate_ready_no_execution",
    readiness: "twii_pre_execution_readiness_recheck_preparation_gate_ready_no_execution",
    serverOnly: "twii_server_only_pre_execution_integration_preparation_gate_ready_no_execution",
    authorizationPacket: "twii_bounded_operator_authorization_packet_preparation_gate_ready_no_execution",
    explicitExecutionPacket: "twii_explicit_execution_packet_preparation_gate_ready_no_execution"
  };
  for (const [key, status] of Object.entries(expectedStatuses)) if (reports[key]?.status !== status) problems.push(`${key} status mismatch`);
}

function falseKeys() {
  return [
    "externalValuesProvidedNow", "operatorDecisionAcceptedNow", "operatorAuthorizationAcceptedNow",
    "authorizationValueReadNow", "serverOnlyCredentialCheckPassed", "credentialValuesRead",
    "executeSwitchProvided", "confirmationPhraseProvided", "rollbackDryRunPassed",
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
    "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided",
    "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed", "rollbackDryRunPassed",
    "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed",
    "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput",
    "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"
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
