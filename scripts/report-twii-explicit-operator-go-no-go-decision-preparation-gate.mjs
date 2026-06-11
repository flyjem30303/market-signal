import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-explicit-operator-go-no-go-decision-preparation-gate.json";
const stoplineReportPath = "scripts/report-twii-final-authorization-stopline-go-no-go-gate.mjs";
const stoplineGatePath = "data/source-gates/twii-final-authorization-stopline-go-no-go-gate.json";
const readinessGatePath = "data/source-gates/twii-separate-authorized-execution-attempt-readiness-gate.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const stoplineGate = readJson(stoplineGatePath);
const readinessGate = readJson(readinessGatePath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);
const stoplineReport = runJsonReport(stoplineReportPath, "TWII final authorization stopline go/no-go gate");

validateGate();
validateSources();

const placeholders = gate.decisionFieldPlaceholders ?? [];
const decisionOptions = gate.decisionOptions ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_explicit_operator_go_no_go_decision_preparation_gate_ready_no_execution" : "blocked",
  outcome: ok ? "explicit_operator_go_no_go_decision_packet_ready_execution_still_blocked" : "explicit_operator_go_no_go_decision_preparation_gate_blocked",
  mode: "twii_explicit_operator_go_no_go_decision_preparation_gate_no_execution",
  gatePath,
  stoplineGatePath,
  readinessGatePath,
  serverChecksPath,
  rollbackPath,
  readbackPath,
  postRunPath,
  boundedInsertPath,
  gateMode: gate.gateMode ?? null,
  currentDecisionPreparationStatus: gate.currentDecisionPreparationStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  decisionPreparationOutcome: gate.decisionPreparationOutcome ?? null,
  decisionValidation: {
    decisionOptionCount: decisionOptions.length,
    selectedDecisionCount: decisionOptions.filter((item) => item.selectedNow === true).length,
    valueReadDecisionCount: decisionOptions.filter((item) => item.valueReadNow === true).length,
    requiredDecisionFieldCount: (gate.requiredDecisionFields ?? []).length,
    placeholderCount: placeholders.length,
    providedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    decisionAcceptedNowCount: placeholders.filter((item) => item.decisionAcceptedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  decisionState: {
    explicitOperatorGoNoGoDecisionPreparationGatePrepared: gate.explicitOperatorGoNoGoDecisionPreparationGatePrepared === true,
    finalAuthorizationStoplineGoNoGoReferenced: gate.finalAuthorizationStoplineGoNoGoReferenced === true,
    separateAuthorizedExecutionAttemptReadinessReferenced: gate.separateAuthorizedExecutionAttemptReadinessReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    rollbackContractReferenced: gate.rollbackContractReferenced === true,
    aggregateReadbackContractReferenced: gate.aggregateReadbackContractReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    boundedInsertContractReferenced: gate.boundedInsertContractReferenced === true,
    decisionOptionsPrepared: gate.decisionOptionsPrepared === true,
    decisionOptionsPlaceholderOnly: gate.decisionOptionsPlaceholderOnly === true,
    requiredDecisionFieldsPrepared: gate.requiredDecisionFieldsPrepared === true,
    goNoGoDecisionPrerequisitesPrepared: gate.goNoGoDecisionPrerequisitesPrepared === true,
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
    explicitDecisionPacketShapePrepared: gate.explicitDecisionPacketShapePrepared === true,
    reviewOnly: true,
    localOnly: true,
    presenceOnly: true,
    externalOnlyValuesProvidedNow: false,
    externalOperatorDecisionProvidedNow: false,
    explicitDecisionValueReadNow: false,
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
    stoplineStatus: stoplineReport.status ?? null,
    stoplineOutcome: stoplineReport.outcome ?? null,
    stoplineGateKind: stoplineGate.gateKind ?? null,
    readinessGateKind: readinessGate.gateKind ?? null,
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
    gateKind: "twii_explicit_operator_go_no_go_decision_preparation_gate",
    gateMode: "explicit_operator_go_no_go_decision_preparation_fail_closed_no_execution",
    sourceFinalAuthorizationStoplineGoNoGoGatePath: stoplineGatePath,
    sourceSeparateAuthorizedExecutionAttemptReadinessGatePath: readinessGatePath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    explicitOperatorGoNoGoDecisionPreparationGatePrepared: true,
    finalAuthorizationStoplineGoNoGoReferenced: true,
    separateAuthorizedExecutionAttemptReadinessReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    rollbackContractReferenced: true,
    aggregateReadbackContractReferenced: true,
    postRunReviewContractReferenced: true,
    boundedInsertContractReferenced: true,
    decisionOptionsPrepared: true,
    decisionOptionsPlaceholderOnly: true,
    requiredDecisionFieldsPrepared: true,
    goNoGoDecisionPrerequisitesPrepared: true,
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
    explicitDecisionPacketShapePrepared: true,
    localOnly: true,
    reviewOnly: true,
    presenceOnly: true,
    currentDecisionPreparationStatus: "explicit_operator_go_no_go_decision_preparation_ready_waiting_external_values",
    nextReviewOnlyRoute: "explicit_operator_go_no_go_decision_review_then_operator_value_intake_stopline",
    allowedNextCommandCategory: "review_only_operator_value_intake_stopline_preparation",
    decisionPreparationOutcome: "explicit_operator_go_no_go_decision_packet_ready_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  const optionNames = (gate.decisionOptions ?? []).map((item) => item.decision).sort().join(",");
  if (optionNames !== "go,no_go,repair_required") problems.push("decisionOptions must be go,no_go,repair_required");
  for (const option of gate.decisionOptions ?? []) {
    if (option.placeholderOnly !== true) problems.push(`decision option ${option.decision ?? "unknown"} placeholderOnly must be true`);
    if (option.selectedNow !== false) problems.push(`decision option ${option.decision ?? "unknown"} selectedNow must be false`);
    if (option.valueReadNow !== false) problems.push(`decision option ${option.decision ?? "unknown"} valueReadNow must be false`);
    if (option.executionAllowedByDecision !== false) problems.push(`decision option ${option.decision ?? "unknown"} executionAllowedByDecision must be false`);
  }
  if ((gate.decisionFieldPlaceholders ?? []).length !== (gate.requiredDecisionFields ?? []).length) problems.push("gate.decisionFieldPlaceholders must match requiredDecisionFields");
  for (const id of gate.requiredDecisionFields ?? []) if (!(gate.decisionFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing decision placeholder ${id}`);
  for (const item of gate.decisionFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "label", "required", "providedNow", "valueReadNow", "decisionAcceptedNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.providedNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} providedNow must be false`);
    if (item.valueReadNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} valueReadNow must be false`);
    if (item.decisionAcceptedNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} decisionAcceptedNow must be false`);
    if (item.executionAllowedByField !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} executionAllowedByField must be false`);
    if (item.storageAllowedInRepo !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} storageAllowedInRepo must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const blocked of ["externalOnlyValuesProvidedNow=false", "externalOperatorDecisionProvidedNow=false", "explicitDecisionValueReadNow=false", "operatorGoDecisionAcceptedNow=false", "operatorNoGoDecisionAcceptedNow=false", "operatorRepairRequiredDecisionAcceptedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "writeGateExecutableNow=false", "finalExecutionAllowedNow=false", "implementationAllowedNow=false"]) if (!(gate.blockedReasons ?? []).includes(blocked)) problems.push(`gate missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (stoplineReport.status !== "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution") problems.push("stopline report status mismatch");
  if (stoplineReport.outcome !== "final_authorization_stopline_go_no_go_ready_execution_still_blocked") problems.push("stopline report outcome mismatch");
  if (stoplineGate.gateKind !== "twii_final_authorization_stopline_go_no_go_gate") problems.push("stopline gate kind mismatch");
  if (readinessGate.gateKind !== "twii_separate_authorized_execution_attempt_readiness_gate") problems.push("readiness gate kind mismatch");
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
  return ["realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "explicitDecisionValueReadNow", "operatorGoDecisionAcceptedNow", "operatorNoGoDecisionAcceptedNow", "operatorRepairRequiredDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}
function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "explicitDecisionValueReadNow", "operatorGoDecisionAcceptedNow", "operatorNoGoDecisionAcceptedNow", "operatorRepairRequiredDecisionAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
