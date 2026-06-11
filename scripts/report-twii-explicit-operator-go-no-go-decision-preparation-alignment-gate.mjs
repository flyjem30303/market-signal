import fs from "node:fs";

const gatePath = "data/source-gates/twii-explicit-operator-go-no-go-decision-preparation-alignment-gate.json";
const stoplineAlignmentPath = "data/source-gates/twii-final-authorization-stopline-preparation-alignment-gate.json";
const separateAttemptPreparationPath = "data/source-gates/twii-separate-authorized-execution-attempt-preparation-gate.json";
const explicitExecutionPacketPath = "data/source-gates/twii-explicit-execution-packet-preparation-gate.json";
const problems = [];

const gate = readJson(gatePath);
const stoplineAlignment = readJson(stoplineAlignmentPath);
const separateAttemptPreparation = readJson(separateAttemptPreparationPath);
const explicitExecutionPacket = readJson(explicitExecutionPacketPath);

validateGate();
validateSources();

const placeholders = gate.decisionFieldPlaceholders ?? [];
const decisions = gate.decisionOptions ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate_ready_no_execution" : "blocked",
  outcome: ok ? "explicit_operator_go_no_go_decision_preparation_aligned_execution_still_blocked" : "explicit_operator_go_no_go_decision_preparation_alignment_gate_blocked",
  mode: "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate_no_execution",
  gatePath,
  stoplineAlignmentPath,
  separateAttemptPreparationPath,
  explicitExecutionPacketPath,
  gateMode: gate.gateMode ?? null,
  currentDecisionPreparationAlignmentStatus: gate.currentDecisionPreparationAlignmentStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  decisionPreparationAlignmentOutcome: gate.decisionPreparationAlignmentOutcome ?? null,
  decisionValidation: {
    decisionOptionCount: decisions.length,
    selectedNowCount: decisions.filter((item) => item.selectedNow === true).length,
    decisionValueReadNowCount: decisions.filter((item) => item.valueReadNow === true).length,
    executionAllowedByDecisionCount: decisions.filter((item) => item.executionAllowedByDecision === true).length,
    requiredDecisionFieldCount: (gate.requiredDecisionFields ?? []).length,
    placeholderCount: placeholders.length,
    fieldNameOnlyPlaceholderCount: placeholders.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyPlaceholderCount: placeholders.filter((item) => item.presenceOnly === true).length,
    providedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    decisionAcceptedNowCount: placeholders.filter((item) => item.decisionAcceptedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  decisionState: {
    explicitOperatorGoNoGoDecisionPreparationAlignmentGatePrepared: gate.explicitOperatorGoNoGoDecisionPreparationAlignmentGatePrepared === true,
    finalAuthorizationStoplinePreparationAlignmentReferenced: gate.finalAuthorizationStoplinePreparationAlignmentReferenced === true,
    separateAuthorizedExecutionAttemptPreparationReferenced: gate.separateAuthorizedExecutionAttemptPreparationReferenced === true,
    explicitExecutionPacketPreparationReferenced: gate.explicitExecutionPacketPreparationReferenced === true,
    decisionPreparationShapePrepared: gate.decisionPreparationShapePrepared === true,
    decisionOptionsPrepared: gate.decisionOptionsPrepared === true,
    decisionOptionsPlaceholderOnly: gate.decisionOptionsPlaceholderOnly === true,
    requiredDecisionFieldsPrepared: gate.requiredDecisionFieldsPrepared === true,
    finalAuthorizationStoplineAlignmentHandoffPrepared: gate.finalAuthorizationStoplineAlignmentHandoffPrepared === true,
    separateAttemptPreparationReferencePrepared: gate.separateAttemptPreparationReferencePrepared === true,
    explicitExecutionPacketReferencePrepared: gate.explicitExecutionPacketReferencePrepared === true,
    goDecisionPresencePrepared: gate.goDecisionPresencePrepared === true,
    noGoDecisionPresencePrepared: gate.noGoDecisionPresencePrepared === true,
    repairRequiredDecisionPresencePrepared: gate.repairRequiredDecisionPresencePrepared === true,
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
    explicitDecisionValueReadNow: false,
    operatorGoDecisionAcceptedNow: false,
    operatorNoGoDecisionAcceptedNow: false,
    operatorRepairRequiredDecisionAcceptedNow: false,
    operatorAuthorizationAcceptedNow: false,
    authorizationValueReadNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    stoplineAlignmentStatus: stoplineAlignment.currentStoplinePreparationStatus ?? null,
    stoplineAlignmentOutcome: stoplineAlignment.stoplinePreparationOutcome ?? null,
    separateAttemptPreparationStatus: separateAttemptPreparation.currentAttemptPreparationStatus ?? null,
    explicitExecutionPacketStatus: explicitExecutionPacket.currentExecutionPacketStatus ?? null
  },
  promotionLocks: gate.promotionLocks ?? null,
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate",
    gateMode: "explicit_operator_go_no_go_decision_preparation_alignment_fail_closed_no_execution",
    sourceFinalAuthorizationStoplinePreparationAlignmentGatePath: stoplineAlignmentPath,
    sourceSeparateAuthorizedExecutionAttemptPreparationGatePath: separateAttemptPreparationPath,
    sourceExplicitExecutionPacketPreparationGatePath: explicitExecutionPacketPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    explicitOperatorGoNoGoDecisionPreparationAlignmentGatePrepared: true,
    finalAuthorizationStoplinePreparationAlignmentReferenced: true,
    separateAuthorizedExecutionAttemptPreparationReferenced: true,
    explicitExecutionPacketPreparationReferenced: true,
    decisionPreparationShapePrepared: true,
    decisionOptionsPrepared: true,
    decisionOptionsPlaceholderOnly: true,
    requiredDecisionFieldsPrepared: true,
    currentDecisionPreparationAlignmentStatus: "explicit_operator_go_no_go_decision_preparation_alignment_ready_waiting_external_values",
    nextReviewOnlyRoute: "explicit_operator_go_no_go_decision_preparation_alignment_review_then_operator_value_intake_stopline_preparation",
    allowedNextCommandCategory: "review_only_operator_value_intake_stopline_preparation",
    decisionPreparationAlignmentOutcome: "explicit_operator_go_no_go_decision_preparation_aligned_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  for (const key of ["finalAuthorizationStoplineAlignmentHandoffPrepared", "separateAttemptPreparationReferencePrepared", "explicitExecutionPacketReferencePrepared", "goDecisionPresencePrepared", "noGoDecisionPresencePrepared", "repairRequiredDecisionPresencePrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "localOnly", "reviewOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (gate[key] !== true) problems.push(`gate.${key} must be true`);
  if ((gate.decisionOptions ?? []).length !== 3) problems.push("decisionOptions must contain go/no_go/repair_required");
  for (const decision of gate.decisionOptions ?? []) {
    if (decision.placeholderOnly !== true) problems.push(`decision ${decision.decision} placeholderOnly must be true`);
    for (const key of ["selectedNow", "valueReadNow", "executionAllowedByDecision"]) if (decision[key] !== false) problems.push(`decision ${decision.decision} ${key} must be false`);
  }
  if ((gate.decisionFieldPlaceholders ?? []).length !== (gate.requiredDecisionFields ?? []).length) problems.push("decisionFieldPlaceholders must match requiredDecisionFields");
  for (const id of gate.requiredDecisionFields ?? []) if (!(gate.decisionFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing decision placeholder ${id}`);
  for (const item of gate.decisionFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "fieldNameOnly", "presenceOnly", "providedNow", "valueReadNow", "decisionAcceptedNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.fieldNameOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} fieldNameOnly must be true`);
    if (item.presenceOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} presenceOnly must be true`);
    for (const key of ["providedNow", "valueReadNow", "decisionAcceptedNow", "executionAllowedByField", "storageAllowedInRepo"]) if (item[key] !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} ${key} must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (stoplineAlignment.gateKind !== "twii_final_authorization_stopline_preparation_alignment_gate") problems.push("stopline alignment gate kind mismatch");
  if (stoplineAlignment.currentStoplinePreparationStatus !== "final_authorization_stopline_preparation_alignment_ready_waiting_external_values") problems.push("stopline alignment status mismatch");
  if (separateAttemptPreparation.gateKind !== "twii_separate_authorized_execution_attempt_preparation_gate") problems.push("separate attempt preparation gate kind mismatch");
  if (explicitExecutionPacket.gateKind !== "twii_explicit_execution_packet_preparation_gate") problems.push("explicit execution packet gate kind mismatch");
}

function falseKeys() {
  return ["realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "explicitDecisionValueReadNow", "operatorGoDecisionAcceptedNow", "operatorNoGoDecisionAcceptedNow", "operatorRepairRequiredDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "credentialValuesRead", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "explicitDecisionValueReadNow", "operatorGoDecisionAcceptedNow", "operatorNoGoDecisionAcceptedNow", "operatorRepairRequiredDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}
