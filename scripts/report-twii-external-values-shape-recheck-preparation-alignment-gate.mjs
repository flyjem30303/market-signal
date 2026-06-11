import fs from "node:fs";

const gatePath = "data/source-gates/twii-external-values-shape-recheck-preparation-alignment-gate.json";
const intakeAlignmentPath = "data/source-gates/twii-operator-value-intake-stopline-preparation-alignment-gate.json";
const intakeGatePath = "data/source-gates/twii-operator-value-intake-stopline-preparation-gate.json";
const readinessGatePath = "data/source-gates/twii-pre-execution-readiness-recheck-preparation-gate.json";
const problems = [];

const gate = readJson(gatePath);
const intakeAlignment = readJson(intakeAlignmentPath);
const intakeGate = readJson(intakeGatePath);
const readinessGate = readJson(readinessGatePath);

validateGate();
validateSources();

const placeholders = gate.shapeFieldPlaceholders ?? [];
const allowedClasses = gate.allowedPlaceholderClasses ?? [];
const forbiddenSurfaces = gate.forbiddenValueSurfaces ?? [];
const decisionOptions = gate.decisionShapeOptions ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_external_values_shape_recheck_preparation_alignment_gate_ready_no_execution" : "blocked",
  outcome: ok ? "external_values_shape_recheck_preparation_aligned_execution_still_blocked" : "external_values_shape_recheck_preparation_alignment_gate_blocked",
  mode: "twii_external_values_shape_recheck_preparation_alignment_gate_no_execution",
  gatePath,
  intakeAlignmentPath,
  intakeGatePath,
  readinessGatePath,
  gateMode: gate.gateMode ?? null,
  currentShapeRecheckAlignmentStatus: gate.currentShapeRecheckAlignmentStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  shapeRecheckAlignmentOutcome: gate.shapeRecheckAlignmentOutcome ?? null,
  shapeValidation: {
    allowedPlaceholderClassCount: allowedClasses.length,
    allowedPlaceholderProvidedNowCount: allowedClasses.filter((item) => item.providedNow === true).length,
    allowedPlaceholderValueReadNowCount: allowedClasses.filter((item) => item.valueReadNow === true).length,
    fieldNameOnlyClassCount: allowedClasses.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyClassCount: allowedClasses.filter((item) => item.presenceOnly === true).length,
    forbiddenSurfaceCount: forbiddenSurfaces.length,
    decisionOptionCount: decisionOptions.length,
    selectedDecisionCount: decisionOptions.filter((item) => item.selectedNow === true).length,
    valueReadDecisionCount: decisionOptions.filter((item) => item.valueReadNow === true).length,
    shapeAcceptedDecisionCount: decisionOptions.filter((item) => item.shapeAcceptedNow === true).length,
    requiredShapeFieldCount: (gate.requiredShapeFields ?? []).length,
    placeholderCount: placeholders.length,
    fieldNameOnlyPlaceholderCount: placeholders.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyPlaceholderCount: placeholders.filter((item) => item.presenceOnly === true).length,
    providedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    shapeAcceptedNowCount: placeholders.filter((item) => item.shapeAcceptedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  shapeState: {
    externalValuesShapeRecheckPreparationAlignmentGatePrepared: gate.externalValuesShapeRecheckPreparationAlignmentGatePrepared === true,
    operatorValueIntakeStoplinePreparationAlignmentReferenced: gate.operatorValueIntakeStoplinePreparationAlignmentReferenced === true,
    operatorValueIntakeStoplinePreparationReferenced: gate.operatorValueIntakeStoplinePreparationReferenced === true,
    preExecutionReadinessRecheckPreparationReferenced: gate.preExecutionReadinessRecheckPreparationReferenced === true,
    valueClassShapeRulesPrepared: gate.valueClassShapeRulesPrepared === true,
    fieldNameOnlyContractPrepared: gate.fieldNameOnlyContractPrepared === true,
    presenceOnlyChecksPrepared: gate.presenceOnlyChecksPrepared === true,
    allowedPlaceholderClassesPrepared: gate.allowedPlaceholderClassesPrepared === true,
    forbiddenValueSurfacesPrepared: gate.forbiddenValueSurfacesPrepared === true,
    decisionShapePlaceholdersPrepared: gate.decisionShapePlaceholdersPrepared === true,
    authorizationPresenceShapePlaceholderPrepared: gate.authorizationPresenceShapePlaceholderPrepared === true,
    executeSwitchPresenceShapePlaceholderPrepared: gate.executeSwitchPresenceShapePlaceholderPrepared === true,
    confirmationPhrasePresenceShapePlaceholderPrepared: gate.confirmationPhrasePresenceShapePlaceholderPrepared === true,
    serverOnlyCredentialPresenceShapePlaceholderPrepared: gate.serverOnlyCredentialPresenceShapePlaceholderPrepared === true,
    rollbackShapePlaceholderPrepared: gate.rollbackShapePlaceholderPrepared === true,
    aggregateReadbackShapePlaceholderPrepared: gate.aggregateReadbackShapePlaceholderPrepared === true,
    postRunReviewShapePlaceholderPrepared: gate.postRunReviewShapePlaceholderPrepared === true,
    candidateDuplicateRejectionShapePlaceholderPrepared: gate.candidateDuplicateRejectionShapePlaceholderPrepared === true,
    externalValuesShapeRecheckAlignmentShapePrepared: gate.externalValuesShapeRecheckAlignmentShapePrepared === true,
    reviewOnly: true,
    localOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    serverOnly: true,
    externalValuesProvidedNow: false,
    externalOnlyValuesProvidedNow: false,
    pmRefreshableValuesAcceptedNow: false,
    neverStoreValuesDetectedNow: false,
    shapeRecheckAcceptedNow: false,
    fieldValueReadNow: false,
    forbiddenValueSurfaceDetectedNow: false,
    operatorValueIntakeAcceptedNow: false,
    authorizationValueReadNow: false,
    serverOnlyCredentialCheckPassed: false,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    intakeAlignmentStatus: intakeAlignment.currentIntakeStoplineAlignmentStatus ?? null,
    intakeGateKind: intakeGate.gateKind ?? null,
    readinessGateKind: readinessGate.gateKind ?? null
  },
  promotionLocks: gate.promotionLocks ?? null,
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_external_values_shape_recheck_preparation_alignment_gate",
    gateMode: "external_values_shape_recheck_preparation_alignment_fail_closed_no_execution",
    sourceOperatorValueIntakeStoplinePreparationAlignmentGatePath: intakeAlignmentPath,
    sourceOperatorValueIntakeStoplinePreparationGatePath: intakeGatePath,
    sourcePreExecutionReadinessRecheckPreparationGatePath: readinessGatePath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    currentShapeRecheckAlignmentStatus: "external_values_shape_recheck_preparation_alignment_ready_waiting_external_values",
    nextReviewOnlyRoute: "external_values_shape_recheck_preparation_alignment_review_then_pre_execution_readiness_recheck_preparation",
    allowedNextCommandCategory: "review_only_pre_execution_readiness_recheck_preparation",
    shapeRecheckAlignmentOutcome: "external_values_shape_recheck_preparation_aligned_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  for (const key of ["externalValuesShapeRecheckPreparationAlignmentGatePrepared", "operatorValueIntakeStoplinePreparationAlignmentReferenced", "operatorValueIntakeStoplinePreparationReferenced", "preExecutionReadinessRecheckPreparationReferenced", "valueClassShapeRulesPrepared", "fieldNameOnlyContractPrepared", "presenceOnlyChecksPrepared", "allowedPlaceholderClassesPrepared", "forbiddenValueSurfacesPrepared", "decisionShapePlaceholdersPrepared", "authorizationPresenceShapePlaceholderPrepared", "executeSwitchPresenceShapePlaceholderPrepared", "confirmationPhrasePresenceShapePlaceholderPrepared", "serverOnlyCredentialPresenceShapePlaceholderPrepared", "rollbackShapePlaceholderPrepared", "aggregateReadbackShapePlaceholderPrepared", "postRunReviewShapePlaceholderPrepared", "candidateDuplicateRejectionShapePlaceholderPrepared", "mockBoundaryRechecked", "executionStopLinesPrepared", "externalValuesShapeRecheckAlignmentShapePrepared", "localOnly", "reviewOnly", "shapeOnly", "presenceOnly", "fieldNameOnly", "serverOnly"]) if (gate[key] !== true) problems.push(`gate.${key} must be true`);
  if ((gate.allowedPlaceholderClasses ?? []).length !== 3) problems.push("allowedPlaceholderClasses must contain three classes");
  for (const item of gate.allowedPlaceholderClasses ?? []) {
    if (item.fieldNameOnly !== true) problems.push(`allowed class ${item.classId ?? "unknown"} fieldNameOnly must be true`);
    if (item.presenceOnly !== true) problems.push(`allowed class ${item.classId ?? "unknown"} presenceOnly must be true`);
    for (const key of ["providedNow", "valueReadNow"]) if (item[key] !== false) problems.push(`allowed class ${item.classId ?? "unknown"} ${key} must be false`);
  }
  if ((gate.forbiddenValueSurfaces ?? []).length !== 10) problems.push("forbiddenValueSurfaces must list 10 surfaces");
  if ((gate.decisionShapeOptions ?? []).length !== 3) problems.push("decisionShapeOptions must list three options");
  for (const option of gate.decisionShapeOptions ?? []) for (const key of ["selectedNow", "valueReadNow", "shapeAcceptedNow", "executionAllowedByDecision"]) if (option[key] !== false) problems.push(`decision option ${option.decision ?? "unknown"} ${key} must be false`);
  if ((gate.shapeFieldPlaceholders ?? []).length !== (gate.requiredShapeFields ?? []).length) problems.push("shapeFieldPlaceholders must match requiredShapeFields");
  for (const id of gate.requiredShapeFields ?? []) if (!(gate.shapeFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing shape placeholder ${id}`);
  for (const item of gate.shapeFieldPlaceholders ?? []) {
    if (item.fieldNameOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} fieldNameOnly must be true`);
    if (item.presenceOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} presenceOnly must be true`);
    for (const key of ["providedNow", "valueReadNow", "shapeAcceptedNow", "executionAllowedByField", "storageAllowedInRepo"]) if (item[key] !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} ${key} must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (intakeAlignment.gateKind !== "twii_operator_value_intake_stopline_preparation_alignment_gate") problems.push("intake alignment gate kind mismatch");
  if (intakeAlignment.currentIntakeStoplineAlignmentStatus !== "operator_value_intake_stopline_preparation_alignment_ready_waiting_external_values") problems.push("intake alignment status mismatch");
  if (intakeGate.gateKind !== "twii_operator_value_intake_stopline_preparation_gate") problems.push("intake gate kind mismatch");
  if (readinessGate.gateKind !== "twii_pre_execution_readiness_recheck_preparation_gate") problems.push("readiness preparation gate kind mismatch");
}

function falseKeys() {
  return ["externalValuesProvidedNow", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "externalOnlyValuesProvidedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "shapeRecheckAcceptedNow", "fieldValueReadNow", "forbiddenValueSurfaceDetectedNow", "operatorValueIntakeAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "credentialValuesRead", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "externalValuesProvidedNow", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "externalOnlyValuesProvidedNow", "pmRefreshableValuesAcceptedNow", "neverStoreValuesDetectedNow", "shapeRecheckAcceptedNow", "fieldValueReadNow", "forbiddenValueSurfaceDetectedNow", "operatorValueIntakeAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "serverOnlyCredentialCheckPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}
