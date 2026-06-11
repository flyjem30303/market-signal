import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-server-only-pre-execution-integration-preparation-gate.json";
const readinessReportPath = "scripts/report-twii-pre-execution-readiness-recheck-preparation-gate.mjs";
const readinessGatePath = "data/source-gates/twii-pre-execution-readiness-recheck-preparation-gate.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const readinessGate = readJson(readinessGatePath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);
const readinessReport = runJsonReport(readinessReportPath, "TWII pre-execution readiness recheck preparation gate");

validateGate();
validateSources();

const checklist = gate.integrationChecklistShape ?? [];
const fields = gate.integrationFieldPlaceholders ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_server_only_pre_execution_integration_preparation_gate_ready_no_execution" : "blocked",
  outcome: ok ? "server_only_pre_execution_integration_ready_execution_still_blocked" : "server_only_pre_execution_integration_preparation_gate_blocked",
  mode: "twii_server_only_pre_execution_integration_preparation_gate_no_execution",
  gatePath,
  readinessGatePath,
  serverChecksPath,
  rollbackPath,
  readbackPath,
  postRunPath,
  boundedInsertPath,
  gateMode: gate.gateMode ?? null,
  currentIntegrationStatus: gate.currentIntegrationStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  integrationOutcome: gate.integrationOutcome ?? null,
  integrationValidation: {
    checklistCount: checklist.length,
    integratedNowCount: checklist.filter((item) => item.integratedNow === true).length,
    checklistValueReadNowCount: checklist.filter((item) => item.valueReadNow === true).length,
    fieldNameOnlyChecklistCount: checklist.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyChecklistCount: checklist.filter((item) => item.presenceOnly === true).length,
    requiredIntegrationFieldCount: (gate.requiredIntegrationFields ?? []).length,
    placeholderCount: fields.length,
    fieldNameOnlyPlaceholderCount: fields.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyPlaceholderCount: fields.filter((item) => item.presenceOnly === true).length,
    providedNowCount: fields.filter((item) => item.providedNow === true).length,
    valueReadNowCount: fields.filter((item) => item.valueReadNow === true).length,
    integrationAcceptedNowCount: fields.filter((item) => item.integrationAcceptedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  integrationState: {
    serverOnlyPreExecutionIntegrationPreparationGatePrepared: gate.serverOnlyPreExecutionIntegrationPreparationGatePrepared === true,
    preExecutionReadinessRecheckPreparationReferenced: gate.preExecutionReadinessRecheckPreparationReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    rollbackContractReferenced: gate.rollbackContractReferenced === true,
    aggregateReadbackContractReferenced: gate.aggregateReadbackContractReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    boundedInsertContractReferenced: gate.boundedInsertContractReferenced === true,
    serverOnlyIntegrationShapePrepared: gate.serverOnlyIntegrationShapePrepared === true,
    readinessChecklistHandoffPrepared: gate.readinessChecklistHandoffPrepared === true,
    presenceOnlyIntegrationPlaceholdersPrepared: gate.presenceOnlyIntegrationPlaceholdersPrepared === true,
    serverOnlyBoundaryAssertionsPrepared: gate.serverOnlyBoundaryAssertionsPrepared === true,
    serverOnlyCredentialPresenceIntegrationPlaceholderPrepared: gate.serverOnlyCredentialPresenceIntegrationPlaceholderPrepared === true,
    executeSwitchPresenceIntegrationPlaceholderPrepared: gate.executeSwitchPresenceIntegrationPlaceholderPrepared === true,
    confirmationPhrasePresenceIntegrationPlaceholderPrepared: gate.confirmationPhrasePresenceIntegrationPlaceholderPrepared === true,
    rollbackDryRunProofPlaceholderPrepared: gate.rollbackDryRunProofPlaceholderPrepared === true,
    aggregateReadbackProofPlaceholderPrepared: gate.aggregateReadbackProofPlaceholderPrepared === true,
    postRunReviewProofPlaceholderPrepared: gate.postRunReviewProofPlaceholderPrepared === true,
    duplicateRejectionProofPlaceholderPrepared: gate.duplicateRejectionProofPlaceholderPrepared === true,
    mockBoundaryRechecked: gate.mockBoundaryRechecked === true,
    executionStopLinesPrepared: gate.executionStopLinesPrepared === true,
    reviewOnly: true,
    localOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    serverOnly: true,
    externalValuesProvidedNow: false,
    serverOnlyIntegrationAcceptedNow: false,
    serverOnlyCredentialCheckPassed: false,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    rollbackDryRunPassed: false,
    aggregateReadbackPassed: false,
    postRunReviewPassed: false,
    candidateDuplicateRejectionProofPassed: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    readinessStatus: readinessReport.status ?? null,
    readinessOutcome: readinessReport.outcome ?? null,
    readinessGateKind: readinessGate.gateKind ?? null,
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
    gateKind: "twii_server_only_pre_execution_integration_preparation_gate",
    gateMode: "server_only_pre_execution_integration_preparation_fail_closed_no_execution",
    sourcePreExecutionReadinessRecheckPreparationGatePath: readinessGatePath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    serverOnlyPreExecutionIntegrationPreparationGatePrepared: true,
    preExecutionReadinessRecheckPreparationReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    rollbackContractReferenced: true,
    aggregateReadbackContractReferenced: true,
    postRunReviewContractReferenced: true,
    boundedInsertContractReferenced: true,
    serverOnlyIntegrationShapePrepared: true,
    readinessChecklistHandoffPrepared: true,
    presenceOnlyIntegrationPlaceholdersPrepared: true,
    serverOnlyBoundaryAssertionsPrepared: true,
    serverOnlyCredentialPresenceIntegrationPlaceholderPrepared: true,
    executeSwitchPresenceIntegrationPlaceholderPrepared: true,
    confirmationPhrasePresenceIntegrationPlaceholderPrepared: true,
    rollbackDryRunProofPlaceholderPrepared: true,
    aggregateReadbackProofPlaceholderPrepared: true,
    postRunReviewProofPlaceholderPrepared: true,
    duplicateRejectionProofPlaceholderPrepared: true,
    mockBoundaryRechecked: true,
    executionStopLinesPrepared: true,
    localOnly: true,
    reviewOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    serverOnly: true,
    currentIntegrationStatus: "server_only_pre_execution_integration_preparation_ready_waiting_external_values",
    nextReviewOnlyRoute: "server_only_pre_execution_integration_review_then_bounded_operator_authorization_packet",
    allowedNextCommandCategory: "review_only_bounded_operator_authorization_packet_preparation",
    integrationOutcome: "server_only_pre_execution_integration_ready_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  if ((gate.integrationChecklistShape ?? []).length !== 8) problems.push("integrationChecklistShape must list 8 checks");
  for (const item of gate.integrationChecklistShape ?? []) {
    for (const key of ["fieldNameOnly", "presenceOnly"]) if (item[key] !== true) problems.push(`check ${item.checkId ?? "unknown"} ${key} must be true`);
    for (const key of ["integratedNow", "valueReadNow", "executionAllowedByCheck"]) if (item[key] !== false) problems.push(`check ${item.checkId ?? "unknown"} ${key} must be false`);
  }
  if ((gate.integrationFieldPlaceholders ?? []).length !== (gate.requiredIntegrationFields ?? []).length) problems.push("integrationFieldPlaceholders must match requiredIntegrationFields");
  for (const id of gate.requiredIntegrationFields ?? []) if (!(gate.integrationFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing integration placeholder ${id}`);
  for (const item of gate.integrationFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "fieldNameOnly", "presenceOnly", "providedNow", "valueReadNow", "integrationAcceptedNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.fieldNameOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} fieldNameOnly must be true`);
    if (item.presenceOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} presenceOnly must be true`);
    for (const key of ["providedNow", "valueReadNow", "integrationAcceptedNow", "executionAllowedByField", "storageAllowedInRepo"]) if (item[key] !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} ${key} must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const blocked of ["externalValuesProvidedNow=false", "serverOnlyIntegrationAcceptedNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "writeGateExecutableNow=false", "finalExecutionAllowedNow=false", "implementationAllowedNow=false"]) if (!(gate.blockedReasons ?? []).includes(blocked)) problems.push(`gate missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (readinessReport.status !== "twii_pre_execution_readiness_recheck_preparation_gate_ready_no_execution") problems.push("readiness report status mismatch");
  if (readinessReport.outcome !== "pre_execution_readiness_recheck_ready_execution_still_blocked") problems.push("readiness report outcome mismatch");
  if (readinessGate.gateKind !== "twii_pre_execution_readiness_recheck_preparation_gate") problems.push("readiness gate kind mismatch");
  if (serverChecks.credentialPresenceOnlyCheckAllowed !== true) problems.push("server checks must allow credential presence-only check");
  if (serverChecks.credentialValuesRead !== false) problems.push("server checks must not read credential values");
  if (serverChecks.executeSwitchProvided !== false) problems.push("server checks executeSwitchProvided must be false");
  if (serverChecks.confirmationPhraseProvided !== false) problems.push("server checks confirmationPhraseProvided must be false");
  if (serverChecks.executionAllowedNow !== false) problems.push("server checks executionAllowedNow must be false");
  if (serverChecks.writeGateExecutableNow !== false) problems.push("server checks writeGateExecutableNow must be false");
  if (rollback.contractDecision !== "rollback_readiness_contract_ready_but_runtime_execution_still_blocked") problems.push("rollback contract decision mismatch");
  if (readback.contractDecision !== "aggregate_readback_contract_ready_but_runtime_execution_still_blocked") problems.push("aggregate readback contract decision mismatch");
  if (postRun.contractDecision !== "post_run_review_contract_ready_but_runtime_execution_still_blocked") problems.push("post-run review contract decision mismatch");
  if (boundedInsert.contractDecision !== "bounded_insert_missing_only_contract_ready_but_runtime_execution_still_blocked") problems.push("bounded insert contract decision mismatch");
}

function falseKeys() {
  return ["externalValuesProvidedNow", "serverOnlyIntegrationAcceptedNow", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "credentialValuesRead", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "externalValuesProvidedNow", "serverOnlyIntegrationAcceptedNow", "serverOnlyCredentialCheckPassed", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
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
