import fs from "node:fs";

const gatePath = "data/source-gates/twii-separate-authorized-execution-attempt-preparation-gate.json";
const explicitGatePath = "data/source-gates/twii-explicit-execution-packet-preparation-gate.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const explicitGate = readJson(explicitGatePath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);

validateGate();
validateSources();

const placeholders = gate.attemptFieldPlaceholders ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_separate_authorized_execution_attempt_preparation_gate_ready_no_execution" : "blocked",
  outcome: ok ? "separate_authorized_execution_attempt_prepared_execution_still_blocked" : "separate_authorized_execution_attempt_preparation_gate_blocked",
  mode: "twii_separate_authorized_execution_attempt_preparation_gate_no_execution",
  gatePath,
  explicitGatePath,
  serverChecksPath,
  rollbackPath,
  readbackPath,
  postRunPath,
  boundedInsertPath,
  gateMode: gate.gateMode ?? null,
  currentAttemptPreparationStatus: gate.currentAttemptPreparationStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  attemptPreparationOutcome: gate.attemptPreparationOutcome ?? null,
  attemptValidation: {
    requiredAttemptFieldCount: (gate.requiredAttemptFields ?? []).length,
    placeholderCount: placeholders.length,
    fieldNameOnlyPlaceholderCount: placeholders.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyPlaceholderCount: placeholders.filter((item) => item.presenceOnly === true).length,
    providedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    attemptAuthorizedNowCount: placeholders.filter((item) => item.attemptAuthorizedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  attemptState: {
    separateAuthorizedExecutionAttemptPreparationGatePrepared: gate.separateAuthorizedExecutionAttemptPreparationGatePrepared === true,
    explicitExecutionPacketPreparationReferenced: gate.explicitExecutionPacketPreparationReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    rollbackContractReferenced: gate.rollbackContractReferenced === true,
    aggregateReadbackContractReferenced: gate.aggregateReadbackContractReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    boundedInsertContractReferenced: gate.boundedInsertContractReferenced === true,
    separateAuthorizedAttemptShapePrepared: gate.separateAuthorizedAttemptShapePrepared === true,
    requiredAttemptFieldsPrepared: gate.requiredAttemptFieldsPrepared === true,
    explicitExecutionPacketHandoffPrepared: gate.explicitExecutionPacketHandoffPrepared === true,
    operatorDecisionPresencePrepared: gate.operatorDecisionPresencePrepared === true,
    authorizationPresencePrepared: gate.authorizationPresencePrepared === true,
    executeSwitchPresencePrepared: gate.executeSwitchPresencePrepared === true,
    confirmationPhrasePresencePrepared: gate.confirmationPhrasePresencePrepared === true,
    serverOnlyCredentialPresencePrepared: gate.serverOnlyCredentialPresencePrepared === true,
    rollbackDryRunPlaceholderPrepared: gate.rollbackDryRunPlaceholderPrepared === true,
    aggregateReadbackPlaceholderPrepared: gate.aggregateReadbackPlaceholderPrepared === true,
    postRunReviewPlaceholderPrepared: gate.postRunReviewPlaceholderPrepared === true,
    candidateDuplicateRejectionPlaceholderPrepared: gate.candidateDuplicateRejectionPlaceholderPrepared === true,
    mockBoundaryRechecked: gate.mockBoundaryRechecked === true,
    executionStopLinesPrepared: gate.executionStopLinesPrepared === true,
    reviewOnly: true,
    localOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    serverOnly: true,
    externalOnlyValuesProvidedNow: false,
    externalOperatorDecisionProvidedNow: false,
    operatorAuthorizationAcceptedNow: false,
    authorizationValueReadNow: false,
    serverOnlyCredentialCheckPassed: false,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    explicitExecutionPacketStatus: explicitGate.currentExecutionPacketStatus ?? null,
    explicitExecutionPacketDecision: explicitGate.executionPacketDecision ?? null,
    explicitExecutionPacketGateKind: explicitGate.gateKind ?? null,
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
    gateKind: "twii_separate_authorized_execution_attempt_preparation_gate",
    gateMode: "separate_authorized_execution_attempt_preparation_fail_closed_no_execution",
    sourceExplicitExecutionPacketPreparationGatePath: explicitGatePath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    separateAuthorizedExecutionAttemptPreparationGatePrepared: true,
    explicitExecutionPacketPreparationReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    rollbackContractReferenced: true,
    aggregateReadbackContractReferenced: true,
    postRunReviewContractReferenced: true,
    boundedInsertContractReferenced: true,
    separateAuthorizedAttemptShapePrepared: true,
    requiredAttemptFieldsPrepared: true,
    explicitExecutionPacketHandoffPrepared: true,
    operatorDecisionPresencePrepared: true,
    authorizationPresencePrepared: true,
    executeSwitchPresencePrepared: true,
    confirmationPhrasePresencePrepared: true,
    serverOnlyCredentialPresencePrepared: true,
    rollbackDryRunPlaceholderPrepared: true,
    aggregateReadbackPlaceholderPrepared: true,
    postRunReviewPlaceholderPrepared: true,
    candidateDuplicateRejectionPlaceholderPrepared: true,
    mockBoundaryRechecked: true,
    executionStopLinesPrepared: true,
    localOnly: true,
    reviewOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    serverOnly: true,
    currentAttemptPreparationStatus: "separate_authorized_execution_attempt_preparation_ready_waiting_external_values",
    nextReviewOnlyRoute: "separate_authorized_execution_attempt_preparation_review_then_final_authorization_stopline_preparation",
    allowedNextCommandCategory: "review_only_final_authorization_stopline_preparation",
    attemptPreparationOutcome: "separate_authorized_execution_attempt_prepared_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  if ((gate.attemptFieldPlaceholders ?? []).length !== (gate.requiredAttemptFields ?? []).length) problems.push("attemptFieldPlaceholders must match requiredAttemptFields");
  for (const id of gate.requiredAttemptFields ?? []) if (!(gate.attemptFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing attempt placeholder ${id}`);
  for (const item of gate.attemptFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "fieldNameOnly", "presenceOnly", "providedNow", "valueReadNow", "attemptAuthorizedNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.fieldNameOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} fieldNameOnly must be true`);
    if (item.presenceOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} presenceOnly must be true`);
    for (const key of ["providedNow", "valueReadNow", "attemptAuthorizedNow", "executionAllowedByField", "storageAllowedInRepo"]) if (item[key] !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} ${key} must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const blocked of ["externalOnlyValuesProvidedNow=false", "externalOperatorDecisionProvidedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "writeGateExecutableNow=false", "finalExecutionAllowedNow=false", "implementationAllowedNow=false"]) if (!(gate.blockedReasons ?? []).includes(blocked)) problems.push(`gate missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (explicitGate.gateKind !== "twii_explicit_execution_packet_preparation_gate") problems.push("explicit execution packet preparation gate kind mismatch");
  if (explicitGate.currentExecutionPacketStatus !== "explicit_execution_packet_preparation_ready_waiting_external_values") problems.push("explicit execution packet preparation status mismatch");
  if (explicitGate.executionPacketDecision !== "explicit_execution_packet_preparation_ready_but_execution_still_blocked") problems.push("explicit execution packet preparation decision mismatch");
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
  return ["realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "credentialValuesRead", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}
