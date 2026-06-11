import fs from "node:fs";

const gatePath = "data/source-gates/twii-operator-value-intake-stopline-preparation-alignment-gate.json";
const decisionAlignmentPath = "data/source-gates/twii-explicit-operator-go-no-go-decision-preparation-alignment-gate.json";
const stoplineAlignmentPath = "data/source-gates/twii-final-authorization-stopline-preparation-alignment-gate.json";
const problems = [];

const gate = readJson(gatePath);
const decisionAlignment = readJson(decisionAlignmentPath);
const stoplineAlignment = readJson(stoplineAlignmentPath);

validateGate();
validateSources();

const placeholders = gate.intakeFieldPlaceholders ?? [];
const valueClasses = gate.valueClasses ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_operator_value_intake_stopline_preparation_alignment_gate_ready_no_execution" : "blocked",
  outcome: ok ? "operator_value_intake_stopline_preparation_aligned_execution_still_blocked" : "operator_value_intake_stopline_preparation_alignment_gate_blocked",
  mode: "twii_operator_value_intake_stopline_preparation_alignment_gate_no_execution",
  gatePath,
  decisionAlignmentPath,
  stoplineAlignmentPath,
  gateMode: gate.gateMode ?? null,
  currentIntakeStoplineAlignmentStatus: gate.currentIntakeStoplineAlignmentStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  intakeStoplineAlignmentOutcome: gate.intakeStoplineAlignmentOutcome ?? null,
  intakeValidation: {
    valueClassCount: valueClasses.length,
    valueClassProvidedNowCount: valueClasses.filter((item) => item.providedNow === true).length,
    valueClassReadNowCount: valueClasses.filter((item) => item.valueReadNow === true).length,
    requiredIntakeFieldCount: (gate.requiredIntakeFields ?? []).length,
    placeholderCount: placeholders.length,
    fieldNameOnlyPlaceholderCount: placeholders.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyPlaceholderCount: placeholders.filter((item) => item.presenceOnly === true).length,
    providedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    intakeAcceptedNowCount: placeholders.filter((item) => item.intakeAcceptedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  intakeState: {
    operatorValueIntakeStoplinePreparationAlignmentGatePrepared: gate.operatorValueIntakeStoplinePreparationAlignmentGatePrepared === true,
    explicitOperatorGoNoGoDecisionPreparationAlignmentReferenced: gate.explicitOperatorGoNoGoDecisionPreparationAlignmentReferenced === true,
    finalAuthorizationStoplinePreparationAlignmentReferenced: gate.finalAuthorizationStoplinePreparationAlignmentReferenced === true,
    operatorValueIntakeStoplineShapePrepared: gate.operatorValueIntakeStoplineShapePrepared === true,
    valueClassesPrepared: gate.valueClassesPrepared === true,
    valueClassPlaceholdersPrepared: gate.valueClassPlaceholdersPrepared === true,
    externalOnlyValuesPrepared: gate.externalOnlyValuesPrepared === true,
    pmRefreshableValuesPrepared: gate.pmRefreshableValuesPrepared === true,
    neverStoreValuesPrepared: gate.neverStoreValuesPrepared === true,
    requiredIntakeFieldsPrepared: gate.requiredIntakeFieldsPrepared === true,
    operatorValueIntakePrerequisitesPrepared: gate.operatorValueIntakePrerequisitesPrepared === true,
    authorizationPresencePrepared: gate.authorizationPresencePrepared === true,
    executeSwitchPresencePrepared: gate.executeSwitchPresencePrepared === true,
    confirmationPhrasePresencePrepared: gate.confirmationPhrasePresencePrepared === true,
    serverOnlyCredentialPresencePrepared: gate.serverOnlyCredentialPresencePrepared === true,
    rollbackDryRunPlaceholderPrepared: gate.rollbackDryRunPlaceholderPrepared === true,
    aggregateReadbackPlaceholderPrepared: gate.aggregateReadbackPlaceholderPrepared === true,
    postRunReviewPlaceholderPrepared: gate.postRunReviewPlaceholderPrepared === true,
    candidateDuplicateRejectionPlaceholderPrepared: gate.candidateDuplicateRejectionPlaceholderPrepared === true,
    reviewOnly: true,
    localOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    serverOnly: true,
    externalOnlyValuesProvidedNow: false,
    pmRefreshableValuesAcceptedNow: false,
    neverStoreValuesDetectedNow: false,
    operatorValueIntakeAcceptedNow: false,
    authorizationValueReadNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    decisionAlignmentStatus: decisionAlignment.currentDecisionPreparationAlignmentStatus ?? null,
    decisionAlignmentOutcome: decisionAlignment.decisionPreparationAlignmentOutcome ?? null,
    stoplineAlignmentStatus: stoplineAlignment.currentStoplinePreparationStatus ?? null
  },
  promotionLocks: gate.promotionLocks ?? null,
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_operator_value_intake_stopline_preparation_alignment_gate",
    gateMode: "operator_value_intake_stopline_preparation_alignment_fail_closed_no_execution",
    sourceExplicitOperatorGoNoGoDecisionPreparationAlignmentGatePath: decisionAlignmentPath,
    sourceFinalAuthorizationStoplinePreparationAlignmentGatePath: stoplineAlignmentPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    currentIntakeStoplineAlignmentStatus: "operator_value_intake_stopline_preparation_alignment_ready_waiting_external_values",
    nextReviewOnlyRoute: "operator_value_intake_stopline_preparation_alignment_review_then_external_values_shape_recheck_preparation",
    allowedNextCommandCategory: "review_only_external_values_shape_recheck_preparation",
    intakeStoplineAlignmentOutcome: "operator_value_intake_stopline_preparation_aligned_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  for (const key of ["operatorValueIntakeStoplinePreparationAlignmentGatePrepared", "explicitOperatorGoNoGoDecisionPreparationAlignmentReferenced", "finalAuthorizationStoplinePreparationAlignmentReferenced", "operatorValueIntakeStoplineShapePrepared", "valueClassesPrepared", "valueClassPlaceholdersPrepared", "externalOnlyValuesPrepared", "pmRefreshableValuesPrepared", "neverStoreValuesPrepared", "requiredIntakeFieldsPrepared", "operatorValueIntakePrerequisitesPrepared", "authorizationPresencePrepared", "executeSwitchPresencePrepared", "confirmationPhrasePresencePrepared", "serverOnlyCredentialPresencePrepared", "rollbackDryRunPlaceholderPrepared", "aggregateReadbackPlaceholderPrepared", "postRunReviewPlaceholderPrepared", "candidateDuplicateRejectionPlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "localOnly", "reviewOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (gate[key] !== true) problems.push(`gate.${key} must be true`);
  if ((gate.valueClasses ?? []).length !== 3) problems.push("valueClasses must contain three classes");
  for (const valueClass of gate.valueClasses ?? []) {
    if (valueClass.placeholderOnly !== true) problems.push(`valueClass ${valueClass.classId} placeholderOnly must be true`);
    for (const key of ["providedNow", "valueReadNow"]) if (valueClass[key] !== false) problems.push(`valueClass ${valueClass.classId} ${key} must be false`);
  }
  if ((gate.intakeFieldPlaceholders ?? []).length !== (gate.requiredIntakeFields ?? []).length) problems.push("intakeFieldPlaceholders must match requiredIntakeFields");
  for (const id of gate.requiredIntakeFields ?? []) if (!(gate.intakeFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing intake placeholder ${id}`);
  for (const item of gate.intakeFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "fieldNameOnly", "presenceOnly", "providedNow", "valueReadNow", "intakeAcceptedNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.fieldNameOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} fieldNameOnly must be true`);
    if (item.presenceOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} presenceOnly must be true`);
    for (const key of ["providedNow", "valueReadNow", "intakeAcceptedNow", "executionAllowedByField", "storageAllowedInRepo"]) if (item[key] !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} ${key} must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (decisionAlignment.gateKind !== "twii_explicit_operator_go_no_go_decision_preparation_alignment_gate") problems.push("decision alignment gate kind mismatch");
  if (decisionAlignment.currentDecisionPreparationAlignmentStatus !== "explicit_operator_go_no_go_decision_preparation_alignment_ready_waiting_external_values") problems.push("decision alignment status mismatch");
  if (stoplineAlignment.gateKind !== "twii_final_authorization_stopline_preparation_alignment_gate") problems.push("stopline alignment gate kind mismatch");
}

function falseKeys() {
  return ["externalOnlyValuesProvidedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "operatorValueIntakeAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "credentialValuesRead", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "externalOnlyValuesProvidedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "operatorValueIntakeAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}
