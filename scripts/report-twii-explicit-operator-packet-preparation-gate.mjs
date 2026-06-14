import fs from "node:fs";

const gatePath = "data/source-gates/twii-explicit-operator-packet-preparation-gate.json";
const boundedReadinessPath = "data/source-gates/twii-bounded-execution-packet-readiness-gate.json";
const authorizationPreparationPath = "data/source-gates/twii-bounded-operator-authorization-packet-preparation-gate.json";
const explicitExecutionPreparationPath = "data/source-gates/twii-explicit-execution-packet-preparation-gate.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const boundedReadiness = readJson(boundedReadinessPath);
const authorizationPreparation = readJson(authorizationPreparationPath);
const explicitExecutionPreparation = readJson(explicitExecutionPreparationPath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);

validateGate();
validateSources();

const placeholders = gate.operatorPacketFieldPlaceholders ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_explicit_operator_packet_preparation_gate_ready_no_execution" : "blocked",
  outcome: ok ? "explicit_operator_packet_prepared_execution_still_blocked" : "explicit_operator_packet_preparation_gate_blocked",
  mode: "twii_explicit_operator_packet_preparation_gate_no_execution",
  gatePath,
  gateMode: gate.gateMode ?? null,
  currentOperatorPacketStatus: gate.currentOperatorPacketStatus ?? null,
  nextPMRoute: gate.nextPMRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  operatorPacketDecision: gate.operatorPacketDecision ?? null,
  packetReadiness: {
    requiredFieldCount: (gate.requiredOperatorPacketFields ?? []).length,
    placeholderCount: placeholders.length,
    fieldNameOnlyCount: placeholders.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyCount: placeholders.filter((item) => item.presenceOnly === true).length,
    providedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  packetState: {
    boundedExecutionPacketReadinessReferenced: gate.boundedExecutionPacketReadinessReferenced === true,
    boundedOperatorAuthorizationPacketPreparationReferenced: gate.boundedOperatorAuthorizationPacketPreparationReferenced === true,
    explicitExecutionPacketPreparationReferenced: gate.explicitExecutionPacketPreparationReferenced === true,
    serverOnlyIntegrationReferenced: gate.serverOnlyIntegrationReferenced === true,
    rollbackReadinessReferenced: gate.rollbackReadinessReferenced === true,
    aggregateReadbackReferenced: gate.aggregateReadbackReferenced === true,
    postRunReviewReferenced: gate.postRunReviewReferenced === true,
    duplicateRejectionReferenced: gate.duplicateRejectionReferenced === true,
    publicCopyTruthfulnessReferenced: gate.publicCopyTruthfulnessReferenced === true,
    mockBoundaryPreserved: gate.mockBoundaryPreserved === true,
    executionStopLinesPrepared: gate.executionStopLinesPrepared === true,
    reviewOnly: gate.reviewOnly === true,
    localOnly: gate.localOnly === true,
    fieldNameOnly: gate.fieldNameOnly === true,
    presenceOnly: gate.presenceOnly === true,
    noSecretValues: gate.noSecretValues === true,
    operatorDecisionProvidedNow: gate.operatorDecisionProvidedNow === true,
    operatorAuthorizationAcceptedNow: gate.operatorAuthorizationAcceptedNow === true,
    executeSwitchProvided: gate.executeSwitchProvided === true,
    confirmationPhraseProvided: gate.confirmationPhraseProvided === true,
    serverOnlyCredentialCheckPassed: gate.serverOnlyCredentialCheckPassed === true,
    rollbackDryRunPassed: gate.rollbackDryRunPassed === true,
    aggregateReadbackPassed: gate.aggregateReadbackPassed === true,
    postRunReviewPassed: gate.postRunReviewPassed === true,
    candidateDuplicateRejectionProofPassed: gate.candidateDuplicateRejectionProofPassed === true,
    executionAllowedNow: gate.executionAllowedNow === true,
    writeGateExecutableNow: gate.writeGateExecutableNow === true,
    publicPromotionAllowed: gate.promotionLocks?.publicPromotionAllowed === true,
    scoreSourceRealAllowed: gate.promotionLocks?.scoreSourceRealAllowed === true
  },
  upstream: {
    boundedReadinessStatus: boundedReadiness.status ?? null,
    authorizationPreparationStatus: authorizationPreparation.currentAuthorizationPacketPreparationStatus ?? null,
    explicitExecutionPreparationStatus: explicitExecutionPreparation.currentExecutionPacketStatus ?? null,
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
    gateKind: "twii_explicit_operator_packet_preparation_gate",
    gateMode: "explicit_operator_packet_preparation_fail_closed_no_execution",
    sourceBoundedExecutionPacketReadinessGatePath: boundedReadinessPath,
    sourceBoundedOperatorAuthorizationPacketPreparationGatePath: authorizationPreparationPath,
    sourceExplicitExecutionPacketPreparationGatePath: explicitExecutionPreparationPath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    explicitOperatorPacketPreparationGatePrepared: true,
    boundedExecutionPacketReadinessReferenced: true,
    boundedOperatorAuthorizationPacketPreparationReferenced: true,
    explicitExecutionPacketPreparationReferenced: true,
    serverOnlyIntegrationReferenced: true,
    rollbackReadinessReferenced: true,
    aggregateReadbackReferenced: true,
    postRunReviewReferenced: true,
    duplicateRejectionReferenced: true,
    publicCopyTruthfulnessReferenced: true,
    operatorPacketShapePrepared: true,
    operatorPacketRequiredFieldsPrepared: true,
    mockBoundaryPreserved: true,
    executionStopLinesPrepared: true,
    localOnly: true,
    reviewOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    serverOnly: true,
    noSecretValues: true,
    currentOperatorPacketStatus: "explicit_operator_packet_preparation_ready_waiting_external_values",
    nextPMRoute: "twii_separate_authorized_execution_attempt_preparation_gate",
    allowedNextCommandCategory: "review_only_separate_authorized_execution_attempt_preparation",
    operatorPacketDecision: "explicit_operator_packet_prepared_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  if ((gate.requiredOperatorPacketFields ?? []).length !== 12) problems.push("requiredOperatorPacketFields must list 12 fields");
  if ((gate.operatorPacketFieldPlaceholders ?? []).length !== (gate.requiredOperatorPacketFields ?? []).length) problems.push("operatorPacketFieldPlaceholders must match requiredOperatorPacketFields");
  for (const id of gate.requiredOperatorPacketFields ?? []) if (!(gate.operatorPacketFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing operator packet placeholder ${id}`);
  for (const item of gate.operatorPacketFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "fieldNameOnly", "presenceOnly", "providedNow", "valueReadNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.fieldNameOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} fieldNameOnly must be true`);
    if (item.presenceOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} presenceOnly must be true`);
    for (const key of ["providedNow", "valueReadNow", "executionAllowedByField", "storageAllowedInRepo"]) if (item[key] !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} ${key} must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (boundedReadiness.status !== "twii_bounded_execution_packet_readiness_gate_ready_no_execution") problems.push("bounded readiness status mismatch");
  if (authorizationPreparation.gateKind !== "twii_bounded_operator_authorization_packet_preparation_gate") problems.push("authorization preparation gate kind mismatch");
  if (authorizationPreparation.currentAuthorizationPacketPreparationStatus !== "bounded_operator_authorization_packet_preparation_ready_waiting_external_values") problems.push("authorization preparation status mismatch");
  if (explicitExecutionPreparation.gateKind !== "twii_explicit_execution_packet_preparation_gate") problems.push("explicit execution preparation gate kind mismatch");
  if (explicitExecutionPreparation.currentExecutionPacketStatus !== "explicit_execution_packet_preparation_ready_waiting_external_values") problems.push("explicit execution preparation status mismatch");
  if (serverChecks.credentialPresenceOnlyCheckAllowed !== true) problems.push("server checks must allow credential presence-only check");
  if (serverChecks.credentialValuesRead !== false) problems.push("server checks must not read credential values");
  if (serverChecks.executionAllowedNow !== false) problems.push("server checks executionAllowedNow must be false");
  if (rollback.contractDecision !== "rollback_readiness_contract_ready_but_runtime_execution_still_blocked") problems.push("rollback contract decision mismatch");
  if (readback.contractDecision !== "aggregate_readback_contract_ready_but_runtime_execution_still_blocked") problems.push("aggregate readback contract decision mismatch");
  if (postRun.contractDecision !== "post_run_review_contract_ready_but_runtime_execution_still_blocked") problems.push("post-run review contract decision mismatch");
  if (boundedInsert.contractDecision !== "bounded_insert_missing_only_contract_ready_but_runtime_execution_still_blocked") problems.push("bounded insert contract decision mismatch");
}

function falseKeys() {
  return ["operatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "publicCopyTruthfulnessAcceptedNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput"];
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "credentialValuesRead", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "operatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}
