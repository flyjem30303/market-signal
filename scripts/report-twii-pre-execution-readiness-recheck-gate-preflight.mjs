import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-pre-execution-readiness-recheck-gate-preflight.json";
const recheckPath = "data/source-gates/twii-pre-execution-readiness-recheck.json";
const shapeReportPath = "scripts/report-twii-operator-values-shape-recheck-gate-preflight.mjs";
const shapeGatePath = "data/source-gates/twii-operator-values-shape-recheck-gate-preflight.json";
const shapeRecheckPath = "data/source-gates/twii-operator-values-shape-recheck.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const recheck = readJson(recheckPath);
const shapeGate = readJson(shapeGatePath);
const shapeRecheck = readJson(shapeRecheckPath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);
const shapeReport = runJsonReport(shapeReportPath, "TWII operator values shape recheck gate");

validateGate();
validateRecheck();
validateSources();

const placeholders = recheck.readinessCheckPlaceholders ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_pre_execution_readiness_recheck_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "pre_execution_readiness_recheck_ready_execution_still_blocked" : "pre_execution_readiness_recheck_gate_preflight_blocked",
  mode: "twii_pre_execution_readiness_recheck_gate_preflight_no_execution",
  gatePath,
  recheckPath,
  shapeGatePath,
  shapeRecheckPath,
  serverChecksPath,
  rollbackPath,
  readbackPath,
  postRunPath,
  boundedInsertPath,
  preExecutionReadinessRecheckMode: gate.preExecutionReadinessRecheckMode ?? null,
  currentReadinessStatus: recheck.currentReadinessStatus ?? null,
  nextReviewOnlyRoute: recheck.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: recheck.allowedNextCommandCategory ?? null,
  readinessDecision: gate.readinessDecision ?? null,
  readinessValidation: {
    requiredReadinessCheckCount: (gate.requiredReadinessChecks ?? []).length,
    placeholderCount: placeholders.length,
    passedNowCount: placeholders.filter((item) => item.passedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    blockedReasonCount: (recheck.blockedReasons ?? []).length
  },
  readinessState: {
    preExecutionReadinessRecheckGatePrepared: gate.preExecutionReadinessRecheckGatePrepared === true,
    recheckReferenced: gate.recheckReferenced === true,
    shapeRecheckGateReferenced: gate.shapeRecheckGateReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    rollbackContractReferenced: gate.rollbackContractReferenced === true,
    aggregateReadbackContractReferenced: gate.aggregateReadbackContractReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    boundedInsertContractReferenced: gate.boundedInsertContractReferenced === true,
    readinessChecklistPrepared: gate.readinessChecklistPrepared === true,
    credentialPresenceSemanticsPrepared: gate.credentialPresenceSemanticsPrepared === true,
    rollbackDryRunPlaceholderPrepared: gate.rollbackDryRunPlaceholderPrepared === true,
    aggregateReadbackPlaceholderPrepared: gate.aggregateReadbackPlaceholderPrepared === true,
    postRunReviewPlaceholderPrepared: gate.postRunReviewPlaceholderPrepared === true,
    candidateDuplicateRejectionPlaceholderPrepared: gate.candidateDuplicateRejectionPlaceholderPrepared === true,
    mockBoundaryRechecked: gate.mockBoundaryRechecked === true,
    executionStopLinesPrepared: gate.executionStopLinesPrepared === true,
    reviewOnly: true,
    localOnly: true,
    presenceOnly: true,
    externalOnlyValuesProvidedNow: false,
    credentialPresenceRecheckPassed: false,
    rollbackDryRunPassed: false,
    aggregateReadbackPassed: false,
    postRunReviewPassed: false,
    candidateDuplicateRejectionProofPassed: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    shapeGateStatus: shapeReport.status ?? null,
    shapeGateOutcome: shapeReport.outcome ?? null,
    shapeGateKind: shapeGate.gateKind ?? null,
    shapeRecheckKind: shapeRecheck.recheckKind ?? null,
    serverChecksAttemptId: serverChecks.attemptId ?? null,
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
    gateKind: "twii_pre_execution_readiness_recheck_gate_preflight",
    recheckPath,
    sourceShapeRecheckGatePath: shapeGatePath,
    sourceShapeRecheckPath: shapeRecheckPath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    preExecutionReadinessRecheckMode: "pre_execution_readiness_recheck_fail_closed_no_execution",
    preExecutionReadinessRecheckGatePrepared: true,
    recheckReferenced: true,
    shapeRecheckGateReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    rollbackContractReferenced: true,
    aggregateReadbackContractReferenced: true,
    postRunReviewContractReferenced: true,
    boundedInsertContractReferenced: true,
    readinessChecklistPrepared: true,
    credentialPresenceSemanticsPrepared: true,
    rollbackDryRunPlaceholderPrepared: true,
    aggregateReadbackPlaceholderPrepared: true,
    postRunReviewPlaceholderPrepared: true,
    candidateDuplicateRejectionPlaceholderPrepared: true,
    mockBoundaryRechecked: true,
    executionStopLinesPrepared: true,
    localOnly: true,
    reviewOnly: true,
    presenceOnly: true,
    currentReadinessStatus: "pre_execution_readiness_recheck_ready_waiting_external_values",
    nextReviewOnlyRoute: "operator_values_shape_pass_then_server_only_pre_execution_recheck",
    allowedNextCommandCategory: "review_only_pre_execution_readiness_recheck",
    readinessDecision: "pre_execution_readiness_recheck_ready_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateRecheck() {
  const expected = {
    recheckKind: "twii_pre_execution_readiness_recheck",
    recheckMode: "pre_execution_readiness_recheck_no_execution",
    currentReadinessStatus: "pre_execution_readiness_recheck_ready_waiting_external_values",
    nextReviewOnlyRoute: "operator_values_shape_pass_then_server_only_pre_execution_recheck",
    allowedNextCommandCategory: "review_only_pre_execution_readiness_recheck",
    preExecutionReadinessRecheckPrepared: true,
    readinessChecklistPrepared: true,
    credentialPresenceSemanticsPrepared: true,
    rollbackDryRunPlaceholderPrepared: true,
    aggregateReadbackPlaceholderPrepared: true,
    postRunReviewPlaceholderPrepared: true,
    candidateDuplicateRejectionPlaceholderPrepared: true,
    mockBoundaryRechecked: true,
    executionStopLinesPrepared: true,
    localOnly: true,
    reviewOnly: true,
    presenceOnly: true
  };
  for (const [key, value] of Object.entries(expected)) if (recheck[key] !== value) problems.push(`recheck.${key} must be ${JSON.stringify(value)}`);
  if ((recheck.readinessCheckPlaceholders ?? []).length !== (gate.requiredReadinessChecks ?? []).length) problems.push("recheck.readinessCheckPlaceholders must match requiredReadinessChecks");
  for (const id of gate.requiredReadinessChecks ?? []) if (!(recheck.readinessCheckPlaceholders ?? []).some((item) => item.checkId === id)) problems.push(`recheck missing readiness placeholder ${id}`);
  for (const item of recheck.readinessCheckPlaceholders ?? []) {
    for (const field of gate.requiredPlaceholderFields ?? []) if (!(field in item)) problems.push(`placeholder ${item.checkId ?? "unknown"} missing ${field}`);
    if (item.passedNow !== false) problems.push(`placeholder ${item.checkId ?? "unknown"} passedNow must be false`);
    if (item.valueReadNow !== false) problems.push(`placeholder ${item.checkId ?? "unknown"} valueReadNow must be false`);
    if (item.executionAllowedByCheck !== false) problems.push(`placeholder ${item.checkId ?? "unknown"} executionAllowedByCheck must be false`);
    if (item.storageAllowedInRepo !== false) problems.push(`placeholder ${item.checkId ?? "unknown"} storageAllowedInRepo must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.checkId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const blocked of ["externalOnlyValuesProvidedNow=false", "credentialPresenceRecheckPassed=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "writeGateExecutableNow=false", "finalExecutionAllowedNow=false", "implementationAllowedNow=false"]) if (!(recheck.blockedReasons ?? []).includes(blocked)) problems.push(`recheck missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (recheck[key] !== false) problems.push(`recheck.${key} must be false`);
}

function validateSources() {
  if (shapeReport.status !== "twii_operator_values_shape_recheck_gate_preflight_ready_no_execution") problems.push("shape report status mismatch");
  if (shapeReport.outcome !== "operator_values_shape_recheck_ready_execution_still_blocked") problems.push("shape report outcome mismatch");
  if (shapeGate.gateKind !== "twii_operator_values_shape_recheck_gate_preflight") problems.push("shape gate kind mismatch");
  if (shapeRecheck.recheckKind !== "twii_operator_values_shape_recheck") problems.push("shape recheck kind mismatch");
  if (serverChecks.credentialPresenceOnlyCheckAllowed !== true) problems.push("server checks must allow credential presence-only check");
  if (rollback.contractDecision !== "rollback_readiness_contract_ready_but_runtime_execution_still_blocked") problems.push("rollback contract decision mismatch");
  if (readback.contractDecision !== "aggregate_readback_contract_ready_but_runtime_execution_still_blocked") problems.push("aggregate readback contract decision mismatch");
  if (postRun.contractDecision !== "post_run_review_contract_ready_but_runtime_execution_still_blocked") problems.push("post-run review contract decision mismatch");
  if (boundedInsert.contractDecision !== "bounded_insert_missing_only_contract_ready_but_runtime_execution_still_blocked") problems.push("bounded insert contract decision mismatch");
}

function falseKeys() {
  return ["realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialPresenceRecheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "mockBoundaryPromotionAllowed", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}
function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialPresenceRecheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
