import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-pre-execution-readiness-recheck-preparation-gate.json";
const upstreamReportPath = "scripts/report-twii-external-values-shape-recheck-preparation-gate.mjs";
const shapeGatePath = "data/source-gates/twii-external-values-shape-recheck-preparation-gate.json";
const intakeGatePath = "data/source-gates/twii-operator-value-intake-stopline-preparation-gate.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const shapeGate = readJson(shapeGatePath);
const intakeGate = readJson(intakeGatePath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);
const upstreamReport = runJsonReport(upstreamReportPath, "TWII external values shape recheck preparation gate");

validateGate();
validateSources();

const checklist = gate.readinessChecklistShape ?? [];
const fields = gate.readinessFieldPlaceholders ?? [];
const states = gate.passFailPlaceholders ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_pre_execution_readiness_recheck_preparation_gate_ready_no_execution" : "blocked",
  outcome: ok ? "pre_execution_readiness_recheck_ready_execution_still_blocked" : "pre_execution_readiness_recheck_preparation_gate_blocked",
  mode: "twii_pre_execution_readiness_recheck_preparation_gate_no_execution",
  gatePath,
  shapeGatePath,
  intakeGatePath,
  serverChecksPath,
  rollbackPath,
  readbackPath,
  postRunPath,
  boundedInsertPath,
  gateMode: gate.gateMode ?? null,
  currentReadinessRecheckStatus: gate.currentReadinessRecheckStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  readinessRecheckOutcome: gate.readinessRecheckOutcome ?? null,
  readinessValidation: {
    checklistCount: checklist.length,
    checklistPassNowCount: checklist.filter((item) => item.passNow === true).length,
    checklistFailNowCount: checklist.filter((item) => item.failNow === true).length,
    checklistValueReadNowCount: checklist.filter((item) => item.valueReadNow === true).length,
    fieldNameOnlyChecklistCount: checklist.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyChecklistCount: checklist.filter((item) => item.presenceOnly === true).length,
    passFailPlaceholderCount: states.length,
    passFailSelectedNowCount: states.filter((item) => item.selectedNow === true).length,
    passFailValueReadNowCount: states.filter((item) => item.valueReadNow === true).length,
    requiredReadinessFieldCount: (gate.requiredReadinessFields ?? []).length,
    placeholderCount: fields.length,
    fieldNameOnlyPlaceholderCount: fields.filter((item) => item.fieldNameOnly === true).length,
    presenceOnlyPlaceholderCount: fields.filter((item) => item.presenceOnly === true).length,
    providedNowCount: fields.filter((item) => item.providedNow === true).length,
    valueReadNowCount: fields.filter((item) => item.valueReadNow === true).length,
    readinessAcceptedNowCount: fields.filter((item) => item.readinessAcceptedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  readinessState: {
    preExecutionReadinessRecheckPreparationGatePrepared: gate.preExecutionReadinessRecheckPreparationGatePrepared === true,
    externalValuesShapeRecheckPreparationReferenced: gate.externalValuesShapeRecheckPreparationReferenced === true,
    operatorValueIntakeStoplinePreparationReferenced: gate.operatorValueIntakeStoplinePreparationReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    rollbackContractReferenced: gate.rollbackContractReferenced === true,
    aggregateReadbackContractReferenced: gate.aggregateReadbackContractReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    boundedInsertContractReferenced: gate.boundedInsertContractReferenced === true,
    readinessChecklistShapePrepared: gate.readinessChecklistShapePrepared === true,
    presenceOnlyPassFailPlaceholdersPrepared: gate.presenceOnlyPassFailPlaceholdersPrepared === true,
    fieldNameOnlyContractPrepared: gate.fieldNameOnlyContractPrepared === true,
    serverOnlyCredentialPresenceRecheckPlaceholderPrepared: gate.serverOnlyCredentialPresenceRecheckPlaceholderPrepared === true,
    executeSwitchPresenceRecheckPlaceholderPrepared: gate.executeSwitchPresenceRecheckPlaceholderPrepared === true,
    confirmationPhrasePresenceRecheckPlaceholderPrepared: gate.confirmationPhrasePresenceRecheckPlaceholderPrepared === true,
    rollbackDryRunProofPlaceholderPrepared: gate.rollbackDryRunProofPlaceholderPrepared === true,
    aggregateReadbackProofPlaceholderPrepared: gate.aggregateReadbackProofPlaceholderPrepared === true,
    postRunReviewProofPlaceholderPrepared: gate.postRunReviewProofPlaceholderPrepared === true,
    duplicateRejectionProofPlaceholderPrepared: gate.duplicateRejectionProofPlaceholderPrepared === true,
    mockBoundaryRechecked: gate.mockBoundaryRechecked === true,
    executionStopLinesPrepared: gate.executionStopLinesPrepared === true,
    preExecutionReadinessRecheckShapePrepared: gate.preExecutionReadinessRecheckShapePrepared === true,
    reviewOnly: true,
    localOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    externalValuesProvidedNow: false,
    readinessRecheckAcceptedNow: false,
    readinessPassAcceptedNow: false,
    readinessFailAcceptedNow: false,
    fieldValueReadNow: false,
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
    shapeStatus: upstreamReport.status ?? null,
    shapeOutcome: upstreamReport.outcome ?? null,
    shapeGateKind: shapeGate.gateKind ?? null,
    intakeGateKind: intakeGate.gateKind ?? null,
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
    gateKind: "twii_pre_execution_readiness_recheck_preparation_gate",
    gateMode: "pre_execution_readiness_recheck_preparation_fail_closed_no_execution",
    sourceExternalValuesShapeRecheckPreparationGatePath: shapeGatePath,
    sourceOperatorValueIntakeStoplinePreparationGatePath: intakeGatePath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    preExecutionReadinessRecheckPreparationGatePrepared: true,
    externalValuesShapeRecheckPreparationReferenced: true,
    operatorValueIntakeStoplinePreparationReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    rollbackContractReferenced: true,
    aggregateReadbackContractReferenced: true,
    postRunReviewContractReferenced: true,
    boundedInsertContractReferenced: true,
    readinessChecklistShapePrepared: true,
    presenceOnlyPassFailPlaceholdersPrepared: true,
    fieldNameOnlyContractPrepared: true,
    serverOnlyCredentialPresenceRecheckPlaceholderPrepared: true,
    executeSwitchPresenceRecheckPlaceholderPrepared: true,
    confirmationPhrasePresenceRecheckPlaceholderPrepared: true,
    rollbackDryRunProofPlaceholderPrepared: true,
    aggregateReadbackProofPlaceholderPrepared: true,
    postRunReviewProofPlaceholderPrepared: true,
    duplicateRejectionProofPlaceholderPrepared: true,
    mockBoundaryRechecked: true,
    executionStopLinesPrepared: true,
    preExecutionReadinessRecheckShapePrepared: true,
    localOnly: true,
    reviewOnly: true,
    shapeOnly: true,
    presenceOnly: true,
    fieldNameOnly: true,
    currentReadinessRecheckStatus: "pre_execution_readiness_recheck_preparation_ready_waiting_external_values",
    nextReviewOnlyRoute: "pre_execution_readiness_recheck_review_then_server_only_pre_execution_integration",
    allowedNextCommandCategory: "review_only_server_only_pre_execution_integration_preparation",
    readinessRecheckOutcome: "pre_execution_readiness_recheck_ready_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  if ((gate.readinessChecklistShape ?? []).length !== 7) problems.push("readinessChecklistShape must list 7 checks");
  for (const item of gate.readinessChecklistShape ?? []) {
    for (const key of ["fieldNameOnly", "presenceOnly"]) if (item[key] !== true) problems.push(`check ${item.checkId ?? "unknown"} ${key} must be true`);
    for (const key of ["passNow", "failNow", "valueReadNow", "executionAllowedByCheck"]) if (item[key] !== false) problems.push(`check ${item.checkId ?? "unknown"} ${key} must be false`);
  }
  const stateNames = (gate.passFailPlaceholders ?? []).map((item) => item.state).sort().join(",");
  if (stateNames !== "fail,pass,repair_required") problems.push("passFailPlaceholders must be pass, fail, repair_required");
  for (const item of gate.passFailPlaceholders ?? []) {
    if (item.placeholderOnly !== true) problems.push(`state ${item.state ?? "unknown"} placeholderOnly must be true`);
    for (const key of ["selectedNow", "valueReadNow", "executionAllowedByState"]) if (item[key] !== false) problems.push(`state ${item.state ?? "unknown"} ${key} must be false`);
  }
  if ((gate.readinessFieldPlaceholders ?? []).length !== (gate.requiredReadinessFields ?? []).length) problems.push("readinessFieldPlaceholders must match requiredReadinessFields");
  for (const id of gate.requiredReadinessFields ?? []) if (!(gate.readinessFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing readiness placeholder ${id}`);
  for (const item of gate.readinessFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "label", "required", "fieldNameOnly", "presenceOnly", "providedNow", "valueReadNow", "readinessAcceptedNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.fieldNameOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} fieldNameOnly must be true`);
    if (item.presenceOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} presenceOnly must be true`);
    for (const key of ["providedNow", "valueReadNow", "readinessAcceptedNow", "executionAllowedByField", "storageAllowedInRepo"]) if (item[key] !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} ${key} must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const blocked of ["externalValuesProvidedNow=false", "readinessRecheckAcceptedNow=false", "readinessPassAcceptedNow=false", "readinessFailAcceptedNow=false", "fieldValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "writeGateExecutableNow=false", "finalExecutionAllowedNow=false", "implementationAllowedNow=false"]) if (!(gate.blockedReasons ?? []).includes(blocked)) problems.push(`gate missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (upstreamReport.status !== "twii_external_values_shape_recheck_preparation_gate_ready_no_execution") problems.push("upstream report status mismatch");
  if (upstreamReport.outcome !== "external_values_shape_recheck_ready_execution_still_blocked") problems.push("upstream report outcome mismatch");
  if (shapeGate.gateKind !== "twii_external_values_shape_recheck_preparation_gate") problems.push("shape gate kind mismatch");
  if (intakeGate.gateKind !== "twii_operator_value_intake_stopline_preparation_gate") problems.push("intake gate kind mismatch");
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
  return ["externalValuesProvidedNow", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "readinessRecheckAcceptedNow", "readinessPassAcceptedNow", "readinessFailAcceptedNow", "fieldValueReadNow", "operatorGoDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}
function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "externalValuesProvidedNow", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "readinessRecheckAcceptedNow", "readinessPassAcceptedNow", "readinessFailAcceptedNow", "fieldValueReadNow", "operatorGoDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
