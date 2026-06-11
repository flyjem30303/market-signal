import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-bounded-operator-authorization-packet-preparation-gate.json";
const integrationReportPath = "scripts/report-twii-server-only-pre-execution-integration-preparation-gate.mjs";
const integrationGatePath = "data/source-gates/twii-server-only-pre-execution-integration-preparation-gate.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const integrationGate = readJson(integrationGatePath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);
const integrationReport = runJsonReport(integrationReportPath, "TWII server-only pre-execution integration preparation gate");

validateGate();
validateSources();

const placeholders = gate.authorizationPacketFieldPlaceholders ?? [];
const valueClasses = gate.valueClasses ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_bounded_operator_authorization_packet_preparation_gate_ready_no_execution" : "blocked",
  outcome: ok ? "bounded_operator_authorization_packet_prepared_execution_still_blocked" : "bounded_operator_authorization_packet_preparation_gate_blocked",
  mode: "twii_bounded_operator_authorization_packet_preparation_gate_no_execution",
  gatePath,
  integrationGatePath,
  serverChecksPath,
  rollbackPath,
  readbackPath,
  postRunPath,
  boundedInsertPath,
  gateMode: gate.gateMode ?? null,
  currentAuthorizationPacketPreparationStatus: gate.currentAuthorizationPacketPreparationStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  authorizationPacketPreparationOutcome: gate.authorizationPacketPreparationOutcome ?? null,
  authorizationPacketValidation: {
    valueClassCount: valueClasses.length,
    valueClassPreparedCount: valueClasses.filter((item) => item.prepared === true).length,
    valueClassProvidedNowCount: valueClasses.filter((item) => item.providedNow === true).length,
    valueClassValueReadNowCount: valueClasses.filter((item) => item.valueReadNow === true).length,
    requiredAuthorizationPacketFieldCount: (gate.requiredAuthorizationPacketFields ?? []).length,
    placeholderCount: placeholders.length,
    fieldNameOnlyPlaceholderCount: placeholders.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyPlaceholderCount: placeholders.filter((item) => item.presenceOnly === true).length,
    providedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    authorizationAcceptedNowCount: placeholders.filter((item) => item.authorizationAcceptedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  authorizationPacketState: {
    boundedOperatorAuthorizationPacketPreparationGatePrepared: gate.boundedOperatorAuthorizationPacketPreparationGatePrepared === true,
    serverOnlyPreExecutionIntegrationPreparationReferenced: gate.serverOnlyPreExecutionIntegrationPreparationReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    rollbackContractReferenced: gate.rollbackContractReferenced === true,
    aggregateReadbackContractReferenced: gate.aggregateReadbackContractReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    boundedInsertContractReferenced: gate.boundedInsertContractReferenced === true,
    boundedAuthorizationPacketShapePrepared: gate.boundedAuthorizationPacketShapePrepared === true,
    packetRequiredFieldsPrepared: gate.packetRequiredFieldsPrepared === true,
    externalOnlyValuesPrepared: gate.externalOnlyValuesPrepared === true,
    pmRefreshableValuesPrepared: gate.pmRefreshableValuesPrepared === true,
    neverStoreValuesPrepared: gate.neverStoreValuesPrepared === true,
    serverOnlyCredentialPresencePlaceholderPrepared: gate.serverOnlyCredentialPresencePlaceholderPrepared === true,
    executeSwitchPlaceholderPrepared: gate.executeSwitchPlaceholderPrepared === true,
    confirmationPhrasePlaceholderPrepared: gate.confirmationPhrasePlaceholderPrepared === true,
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
    externalOnlyValuesProvidedNow: false,
    pmRefreshableValuesAcceptedNow: false,
    neverStoreValuesDetectedNow: false,
    externalOperatorDecisionProvidedNow: false,
    operatorAuthorizationAcceptedNow: false,
    authorizationValueReadNow: false,
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
    integrationPreparationStatus: integrationReport.status ?? null,
    integrationPreparationOutcome: integrationReport.outcome ?? null,
    integrationPreparationGateKind: integrationGate.gateKind ?? null,
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
    gateKind: "twii_bounded_operator_authorization_packet_preparation_gate",
    gateMode: "bounded_operator_authorization_packet_preparation_fail_closed_no_execution",
    sourceServerOnlyPreExecutionIntegrationPreparationGatePath: integrationGatePath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    boundedOperatorAuthorizationPacketPreparationGatePrepared: true,
    serverOnlyPreExecutionIntegrationPreparationReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    rollbackContractReferenced: true,
    aggregateReadbackContractReferenced: true,
    postRunReviewContractReferenced: true,
    boundedInsertContractReferenced: true,
    boundedAuthorizationPacketShapePrepared: true,
    packetRequiredFieldsPrepared: true,
    externalOnlyValuesPrepared: true,
    pmRefreshableValuesPrepared: true,
    neverStoreValuesPrepared: true,
    serverOnlyCredentialPresencePlaceholderPrepared: true,
    executeSwitchPlaceholderPrepared: true,
    confirmationPhrasePlaceholderPrepared: true,
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
    currentAuthorizationPacketPreparationStatus: "bounded_operator_authorization_packet_preparation_ready_waiting_external_values",
    nextReviewOnlyRoute: "bounded_operator_authorization_packet_preparation_review_then_explicit_execution_packet_preparation",
    allowedNextCommandCategory: "review_only_explicit_execution_packet_preparation",
    authorizationPacketPreparationOutcome: "bounded_operator_authorization_packet_prepared_but_authorization_and_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  if ((gate.valueClasses ?? []).length !== 3) problems.push("valueClasses must list 3 classes");
  for (const item of gate.valueClasses ?? []) {
    if (item.prepared !== true) problems.push(`value class ${item.classId ?? "unknown"} prepared must be true`);
    for (const key of ["providedNow", "valueReadNow", "storageAllowedInRepo", "executionAllowedByClass"]) if (item[key] !== false) problems.push(`value class ${item.classId ?? "unknown"} ${key} must be false`);
  }
  if ((gate.authorizationPacketFieldPlaceholders ?? []).length !== (gate.requiredAuthorizationPacketFields ?? []).length) problems.push("authorizationPacketFieldPlaceholders must match requiredAuthorizationPacketFields");
  for (const id of gate.requiredAuthorizationPacketFields ?? []) if (!(gate.authorizationPacketFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing authorization packet placeholder ${id}`);
  for (const item of gate.authorizationPacketFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "fieldNameOnly", "presenceOnly", "providedNow", "valueReadNow", "authorizationAcceptedNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.fieldNameOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} fieldNameOnly must be true`);
    if (item.presenceOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} presenceOnly must be true`);
    for (const key of ["providedNow", "valueReadNow", "authorizationAcceptedNow", "executionAllowedByField", "storageAllowedInRepo"]) if (item[key] !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} ${key} must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const blocked of ["externalOnlyValuesProvidedNow=false", "pmRefreshableValuesAcceptedNow=false", "neverStoreValuesDetectedNow=false", "externalOperatorDecisionProvidedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "writeGateExecutableNow=false", "finalExecutionAllowedNow=false", "implementationAllowedNow=false"]) if (!(gate.blockedReasons ?? []).includes(blocked)) problems.push(`gate missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (integrationReport.status !== "twii_server_only_pre_execution_integration_preparation_gate_ready_no_execution") problems.push("integration preparation report status mismatch");
  if (integrationReport.outcome !== "server_only_pre_execution_integration_ready_execution_still_blocked") problems.push("integration preparation report outcome mismatch");
  if (integrationGate.gateKind !== "twii_server_only_pre_execution_integration_preparation_gate") problems.push("integration preparation gate kind mismatch");
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
  return ["realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "externalOperatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "credentialValuesRead", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "externalOperatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
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
