import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-external-values-shape-recheck-preparation-gate.json";
const upstreamReportPath = "scripts/report-twii-operator-value-intake-stopline-preparation-gate.mjs";
const intakeGatePath = "data/source-gates/twii-operator-value-intake-stopline-preparation-gate.json";
const explicitDecisionGatePath = "data/source-gates/twii-explicit-operator-go-no-go-decision-preparation-gate.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const intakeGate = readJson(intakeGatePath);
const explicitDecisionGate = readJson(explicitDecisionGatePath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);
const upstreamReport = runJsonReport(upstreamReportPath, "TWII operator value intake stopline preparation gate");

validateGate();
validateSources();

const placeholders = gate.shapeFieldPlaceholders ?? [];
const allowedClasses = gate.allowedPlaceholderClasses ?? [];
const forbiddenSurfaces = gate.forbiddenValueSurfaces ?? [];
const decisionOptions = gate.decisionShapeOptions ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_external_values_shape_recheck_preparation_gate_ready_no_execution" : "blocked",
  outcome: ok ? "external_values_shape_recheck_ready_execution_still_blocked" : "external_values_shape_recheck_preparation_gate_blocked",
  mode: "twii_external_values_shape_recheck_preparation_gate_no_execution",
  gatePath,
  intakeGatePath,
  explicitDecisionGatePath,
  serverChecksPath,
  rollbackPath,
  readbackPath,
  postRunPath,
  boundedInsertPath,
  gateMode: gate.gateMode ?? null,
  currentShapeRecheckStatus: gate.currentShapeRecheckStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  shapeRecheckOutcome: gate.shapeRecheckOutcome ?? null,
  shapeValidation: {
    allowedPlaceholderClassCount: allowedClasses.length,
    allowedPlaceholderProvidedNowCount: allowedClasses.filter((item) => item.providedNow === true).length,
    allowedPlaceholderValueReadNowCount: allowedClasses.filter((item) => item.valueReadNow === true).length,
    fieldNameOnlyClassCount: allowedClasses.filter((item) => item.fieldNameOnly === true).length,
    forbiddenSurfaceCount: forbiddenSurfaces.length,
    decisionOptionCount: decisionOptions.length,
    selectedDecisionCount: decisionOptions.filter((item) => item.selectedNow === true).length,
    valueReadDecisionCount: decisionOptions.filter((item) => item.valueReadNow === true).length,
    shapeAcceptedDecisionCount: decisionOptions.filter((item) => item.shapeAcceptedNow === true).length,
    requiredShapeFieldCount: (gate.requiredShapeFields ?? []).length,
    placeholderCount: placeholders.length,
    fieldNameOnlyPlaceholderCount: placeholders.filter((item) => item.fieldNameOnly === true).length,
    providedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    shapeAcceptedNowCount: placeholders.filter((item) => item.shapeAcceptedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  shapeState: {
    externalValuesShapeRecheckPreparationGatePrepared: gate.externalValuesShapeRecheckPreparationGatePrepared === true,
    operatorValueIntakeStoplinePreparationReferenced: gate.operatorValueIntakeStoplinePreparationReferenced === true,
    explicitOperatorGoNoGoDecisionPreparationReferenced: gate.explicitOperatorGoNoGoDecisionPreparationReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    rollbackContractReferenced: gate.rollbackContractReferenced === true,
    aggregateReadbackContractReferenced: gate.aggregateReadbackContractReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    boundedInsertContractReferenced: gate.boundedInsertContractReferenced === true,
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
    mockBoundaryRechecked: gate.mockBoundaryRechecked === true,
    executionStopLinesPrepared: gate.executionStopLinesPrepared === true,
    externalValuesShapeRecheckShapePrepared: gate.externalValuesShapeRecheckShapePrepared === true,
    reviewOnly: true,
    localOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    externalValuesProvidedNow: false,
    externalOnlyValuesProvidedNow: false,
    externalOperatorDecisionProvidedNow: false,
    explicitDecisionValueReadNow: false,
    shapeRecheckAcceptedNow: false,
    fieldValueReadNow: false,
    forbiddenValueSurfaceDetectedNow: false,
    operatorGoDecisionAcceptedNow: false,
    operatorNoGoDecisionAcceptedNow: false,
    operatorRepairRequiredDecisionAcceptedNow: false,
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
    intakeStatus: upstreamReport.status ?? null,
    intakeOutcome: upstreamReport.outcome ?? null,
    intakeGateKind: intakeGate.gateKind ?? null,
    explicitDecisionGateKind: explicitDecisionGate.gateKind ?? null,
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
    gateKind: "twii_external_values_shape_recheck_preparation_gate",
    gateMode: "external_values_shape_recheck_preparation_fail_closed_no_execution",
    sourceOperatorValueIntakeStoplinePreparationGatePath: intakeGatePath,
    sourceExplicitOperatorGoNoGoDecisionPreparationGatePath: explicitDecisionGatePath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    externalValuesShapeRecheckPreparationGatePrepared: true,
    operatorValueIntakeStoplinePreparationReferenced: true,
    explicitOperatorGoNoGoDecisionPreparationReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    rollbackContractReferenced: true,
    aggregateReadbackContractReferenced: true,
    postRunReviewContractReferenced: true,
    boundedInsertContractReferenced: true,
    valueClassShapeRulesPrepared: true,
    fieldNameOnlyContractPrepared: true,
    presenceOnlyChecksPrepared: true,
    allowedPlaceholderClassesPrepared: true,
    forbiddenValueSurfacesPrepared: true,
    decisionShapePlaceholdersPrepared: true,
    authorizationPresenceShapePlaceholderPrepared: true,
    executeSwitchPresenceShapePlaceholderPrepared: true,
    confirmationPhrasePresenceShapePlaceholderPrepared: true,
    serverOnlyCredentialPresenceShapePlaceholderPrepared: true,
    rollbackShapePlaceholderPrepared: true,
    aggregateReadbackShapePlaceholderPrepared: true,
    postRunReviewShapePlaceholderPrepared: true,
    candidateDuplicateRejectionShapePlaceholderPrepared: true,
    mockBoundaryRechecked: true,
    executionStopLinesPrepared: true,
    externalValuesShapeRecheckShapePrepared: true,
    localOnly: true,
    reviewOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    currentShapeRecheckStatus: "external_values_shape_recheck_preparation_ready_waiting_external_values",
    nextReviewOnlyRoute: "external_values_shape_recheck_review_then_pre_execution_readiness_recheck",
    allowedNextCommandCategory: "review_only_pre_execution_readiness_recheck_preparation",
    shapeRecheckOutcome: "external_values_shape_recheck_ready_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  const classIds = (gate.allowedPlaceholderClasses ?? []).map((item) => item.classId).sort().join(",");
  if (classIds !== "external_only_presence_placeholder,never_store_blocker_placeholder,pm_refreshable_aggregate_placeholder") problems.push("allowedPlaceholderClasses mismatch");
  for (const item of gate.allowedPlaceholderClasses ?? []) {
    if (item.fieldNameOnly !== true) problems.push(`allowed class ${item.classId ?? "unknown"} fieldNameOnly must be true`);
    if (item.providedNow !== false) problems.push(`allowed class ${item.classId ?? "unknown"} providedNow must be false`);
    if (item.valueReadNow !== false) problems.push(`allowed class ${item.classId ?? "unknown"} valueReadNow must be false`);
  }
  if ((gate.forbiddenValueSurfaces ?? []).length !== 10) problems.push("forbiddenValueSurfaces must list 10 surfaces");
  const optionNames = (gate.decisionShapeOptions ?? []).map((item) => item.decision).sort().join(",");
  if (optionNames !== "go,no_go,repair_required") problems.push("decisionShapeOptions must be go,no_go,repair_required");
  for (const option of gate.decisionShapeOptions ?? []) {
    if (option.shapePlaceholderOnly !== true) problems.push(`decision option ${option.decision ?? "unknown"} shapePlaceholderOnly must be true`);
    if (option.selectedNow !== false) problems.push(`decision option ${option.decision ?? "unknown"} selectedNow must be false`);
    if (option.valueReadNow !== false) problems.push(`decision option ${option.decision ?? "unknown"} valueReadNow must be false`);
    if (option.shapeAcceptedNow !== false) problems.push(`decision option ${option.decision ?? "unknown"} shapeAcceptedNow must be false`);
    if (option.executionAllowedByDecision !== false) problems.push(`decision option ${option.decision ?? "unknown"} executionAllowedByDecision must be false`);
  }
  if ((gate.shapeFieldPlaceholders ?? []).length !== (gate.requiredShapeFields ?? []).length) problems.push("gate.shapeFieldPlaceholders must match requiredShapeFields");
  for (const id of gate.requiredShapeFields ?? []) if (!(gate.shapeFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing shape placeholder ${id}`);
  for (const item of gate.shapeFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "label", "required", "fieldNameOnly", "providedNow", "valueReadNow", "shapeAcceptedNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.fieldNameOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} fieldNameOnly must be true`);
    if (item.providedNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} providedNow must be false`);
    if (item.valueReadNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} valueReadNow must be false`);
    if (item.shapeAcceptedNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} shapeAcceptedNow must be false`);
    if (item.executionAllowedByField !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} executionAllowedByField must be false`);
    if (item.storageAllowedInRepo !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} storageAllowedInRepo must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const blocked of ["externalValuesProvidedNow=false", "externalOnlyValuesProvidedNow=false", "externalOperatorDecisionProvidedNow=false", "explicitDecisionValueReadNow=false", "shapeRecheckAcceptedNow=false", "fieldValueReadNow=false", "forbiddenValueSurfaceDetectedNow=false", "operatorGoDecisionAcceptedNow=false", "operatorNoGoDecisionAcceptedNow=false", "operatorRepairRequiredDecisionAcceptedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "writeGateExecutableNow=false", "finalExecutionAllowedNow=false", "implementationAllowedNow=false"]) if (!(gate.blockedReasons ?? []).includes(blocked)) problems.push(`gate missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (upstreamReport.status !== "twii_operator_value_intake_stopline_preparation_gate_ready_no_execution") problems.push("upstream report status mismatch");
  if (upstreamReport.outcome !== "operator_value_intake_stopline_ready_execution_still_blocked") problems.push("upstream report outcome mismatch");
  if (intakeGate.gateKind !== "twii_operator_value_intake_stopline_preparation_gate") problems.push("intake gate kind mismatch");
  if (explicitDecisionGate.gateKind !== "twii_explicit_operator_go_no_go_decision_preparation_gate") problems.push("explicit decision gate kind mismatch");
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
  return ["externalValuesProvidedNow", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "explicitDecisionValueReadNow", "shapeRecheckAcceptedNow", "fieldValueReadNow", "forbiddenValueSurfaceDetectedNow", "operatorGoDecisionAcceptedNow", "operatorNoGoDecisionAcceptedNow", "operatorRepairRequiredDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}
function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "externalValuesProvidedNow", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "explicitDecisionValueReadNow", "shapeRecheckAcceptedNow", "fieldValueReadNow", "forbiddenValueSurfaceDetectedNow", "operatorGoDecisionAcceptedNow", "operatorNoGoDecisionAcceptedNow", "operatorRepairRequiredDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
