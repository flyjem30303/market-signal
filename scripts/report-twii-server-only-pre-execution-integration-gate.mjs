import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-server-only-pre-execution-integration-gate.json";
const readinessReportPath = "scripts/report-twii-pre-execution-readiness-recheck-gate-preflight.mjs";
const readinessGatePath = "data/source-gates/twii-pre-execution-readiness-recheck-gate-preflight.json";
const readinessRecheckPath = "data/source-gates/twii-pre-execution-readiness-recheck.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const readinessGate = readJson(readinessGatePath);
const readinessRecheck = readJson(readinessRecheckPath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);
const readinessReport = runJsonReport(readinessReportPath, "TWII pre-execution readiness recheck gate");

validateGate();
validateSources();

const placeholders = gate.integrationCheckPlaceholders ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_server_only_pre_execution_integration_gate_ready_no_execution" : "blocked",
  outcome: ok ? "server_only_pre_execution_integration_ready_execution_still_blocked" : "server_only_pre_execution_integration_gate_blocked",
  mode: "twii_server_only_pre_execution_integration_gate_no_execution",
  gatePath,
  readinessGatePath,
  readinessRecheckPath,
  serverChecksPath,
  rollbackPath,
  readbackPath,
  postRunPath,
  boundedInsertPath,
  gateMode: gate.gateMode ?? null,
  currentIntegrationStatus: gate.currentIntegrationStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  integrationDecision: gate.integrationDecision ?? null,
  integrationValidation: {
    requiredServerOnlyCheckCount: (gate.requiredServerOnlyChecks ?? []).length,
    placeholderCount: placeholders.length,
    passedNowCount: placeholders.filter((item) => item.passedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  integrationState: {
    serverOnlyPreExecutionIntegrationPrepared: gate.serverOnlyPreExecutionIntegrationPrepared === true,
    preExecutionReadinessRecheckReferenced: gate.preExecutionReadinessRecheckReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    rollbackContractReferenced: gate.rollbackContractReferenced === true,
    aggregateReadbackContractReferenced: gate.aggregateReadbackContractReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    boundedInsertContractReferenced: gate.boundedInsertContractReferenced === true,
    requiredServerOnlyChecksPrepared: gate.requiredServerOnlyChecksPrepared === true,
    credentialPresenceSemanticsPrepared: gate.credentialPresenceSemanticsPrepared === true,
    executeSwitchPresenceSemanticsPrepared: gate.executeSwitchPresenceSemanticsPrepared === true,
    confirmationPhrasePresenceSemanticsPrepared: gate.confirmationPhrasePresenceSemanticsPrepared === true,
    rollbackDryRunPlaceholderPrepared: gate.rollbackDryRunPlaceholderPrepared === true,
    aggregateReadbackPlaceholderPrepared: gate.aggregateReadbackPlaceholderPrepared === true,
    postRunReviewPlaceholderPrepared: gate.postRunReviewPlaceholderPrepared === true,
    candidateDuplicateRejectionPlaceholderPrepared: gate.candidateDuplicateRejectionPlaceholderPrepared === true,
    mockBoundaryRechecked: gate.mockBoundaryRechecked === true,
    executionStopLinesPrepared: gate.executionStopLinesPrepared === true,
    boundedExecutionPacketPrecursorPrepared: gate.boundedExecutionPacketPrecursorPrepared === true,
    reviewOnly: true,
    localOnly: true,
    presenceOnly: true,
    externalOnlyValuesProvidedNow: false,
    serverOnlyCredentialCheckPassed: false,
    credentialPresenceRecheckPassed: false,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    rollbackDryRunPassed: false,
    aggregateReadbackPassed: false,
    postRunReviewPassed: false,
    candidateDuplicateRejectionProofPassed: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    readinessGateStatus: readinessReport.status ?? null,
    readinessGateOutcome: readinessReport.outcome ?? null,
    readinessGateKind: readinessGate.gateKind ?? null,
    readinessRecheckKind: readinessRecheck.recheckKind ?? null,
    serverChecksAttemptId: serverChecks.attemptId ?? null,
    credentialPresenceOnlyCheckAllowed: serverChecks.credentialPresenceOnlyCheckAllowed ?? null,
    rollbackContractDecision: rollback.contractDecision ?? null,
    aggregateReadbackContractDecision: readback.contractDecision ?? null,
    postRunReviewContractDecision: postRun.contractDecision ?? null,
    boundedInsertContractDecision: boundedInsert.contractDecision ?? null
  },
  promotionLocks: gate.promotionLocks ?? null,
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_server_only_pre_execution_integration_gate",
    gateMode: "server_only_pre_execution_integration_fail_closed_no_execution",
    sourcePreExecutionReadinessRecheckGatePath: readinessGatePath,
    sourcePreExecutionReadinessRecheckPath: readinessRecheckPath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    serverOnlyPreExecutionIntegrationPrepared: true,
    preExecutionReadinessRecheckReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    rollbackContractReferenced: true,
    aggregateReadbackContractReferenced: true,
    postRunReviewContractReferenced: true,
    boundedInsertContractReferenced: true,
    requiredServerOnlyChecksPrepared: true,
    credentialPresenceSemanticsPrepared: true,
    executeSwitchPresenceSemanticsPrepared: true,
    confirmationPhrasePresenceSemanticsPrepared: true,
    rollbackDryRunPlaceholderPrepared: true,
    aggregateReadbackPlaceholderPrepared: true,
    postRunReviewPlaceholderPrepared: true,
    candidateDuplicateRejectionPlaceholderPrepared: true,
    mockBoundaryRechecked: true,
    executionStopLinesPrepared: true,
    boundedExecutionPacketPrecursorPrepared: true,
    localOnly: true,
    reviewOnly: true,
    presenceOnly: true,
    currentIntegrationStatus: "server_only_pre_execution_integration_ready_waiting_external_values",
    nextReviewOnlyRoute: "server_only_pre_execution_integration_review_then_bounded_operator_authorization_packet",
    allowedNextCommandCategory: "review_only_bounded_operator_authorization_packet_preparation",
    integrationDecision: "server_only_pre_execution_integration_ready_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  if ((gate.integrationCheckPlaceholders ?? []).length !== (gate.requiredServerOnlyChecks ?? []).length) problems.push("gate.integrationCheckPlaceholders must match requiredServerOnlyChecks");
  for (const id of gate.requiredServerOnlyChecks ?? []) if (!(gate.integrationCheckPlaceholders ?? []).some((item) => item.checkId === id)) problems.push(`gate missing integration placeholder ${id}`);
  for (const item of gate.integrationCheckPlaceholders ?? []) {
    for (const field of ["checkId", "label", "required", "passedNow", "valueReadNow", "executionAllowedByCheck", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.checkId ?? "unknown"} missing ${field}`);
    if (item.passedNow !== false) problems.push(`placeholder ${item.checkId ?? "unknown"} passedNow must be false`);
    if (item.valueReadNow !== false) problems.push(`placeholder ${item.checkId ?? "unknown"} valueReadNow must be false`);
    if (item.executionAllowedByCheck !== false) problems.push(`placeholder ${item.checkId ?? "unknown"} executionAllowedByCheck must be false`);
    if (item.storageAllowedInRepo !== false) problems.push(`placeholder ${item.checkId ?? "unknown"} storageAllowedInRepo must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.checkId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const blocked of ["externalOnlyValuesProvidedNow=false", "serverOnlyCredentialCheckPassed=false", "credentialPresenceRecheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "writeGateExecutableNow=false", "finalExecutionAllowedNow=false", "implementationAllowedNow=false"]) if (!(gate.blockedReasons ?? []).includes(blocked)) problems.push(`gate missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (readinessReport.status !== "twii_pre_execution_readiness_recheck_gate_preflight_ready_no_execution") problems.push("readiness report status mismatch");
  if (readinessReport.outcome !== "pre_execution_readiness_recheck_ready_execution_still_blocked") problems.push("readiness report outcome mismatch");
  if (readinessGate.gateKind !== "twii_pre_execution_readiness_recheck_gate_preflight") problems.push("readiness gate kind mismatch");
  if (readinessRecheck.recheckKind !== "twii_pre_execution_readiness_recheck") problems.push("readiness recheck kind mismatch");
  if (serverChecks.credentialPresenceOnlyCheckAllowed !== true) problems.push("server checks must allow credential presence-only check");
  if (serverChecks.credentialValuesRead !== false) problems.push("server checks must not read credential values");
  if (serverChecks.executeSwitchProvided !== false) problems.push("server checks executeSwitchProvided must be false");
  if (serverChecks.confirmationPhraseProvided !== false) problems.push("server checks confirmationPhraseProvided must be false");
  if (serverChecks.executionAllowedNow !== false) problems.push("server checks executionAllowedNow must be false");
  if (serverChecks.writeGateExecutableNow !== false) problems.push("server checks writeGateExecutableNow must be false");
  if (serverChecks.dailyPricesMutated !== false) problems.push("server checks dailyPricesMutated must be false");
  if (serverChecks.candidateRowsAccepted !== false) problems.push("server checks candidateRowsAccepted must be false");
  if (rollback.contractDecision !== "rollback_readiness_contract_ready_but_runtime_execution_still_blocked") problems.push("rollback contract decision mismatch");
  if (readback.contractDecision !== "aggregate_readback_contract_ready_but_runtime_execution_still_blocked") problems.push("aggregate readback contract decision mismatch");
  if (postRun.contractDecision !== "post_run_review_contract_ready_but_runtime_execution_still_blocked") problems.push("post-run review contract decision mismatch");
  if (boundedInsert.contractDecision !== "bounded_insert_missing_only_contract_ready_but_runtime_execution_still_blocked") problems.push("bounded insert contract decision mismatch");
}

function falseKeys() {
  return ["realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialPresenceRecheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}
function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialPresenceRecheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
