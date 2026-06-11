import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-final-authorization-stopline-go-no-go-gate.json";
const readinessReportPath = "scripts/report-twii-separate-authorized-execution-attempt-readiness-gate.mjs";
const readinessGatePath = "data/source-gates/twii-separate-authorized-execution-attempt-readiness-gate.json";
const explicitPrepGatePath = "data/source-gates/twii-explicit-execution-packet-preparation-gate.json";
const serverChecksPath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const rollbackPath = "data/source-gates/twii-rollback-readiness-contract-preflight.json";
const readbackPath = "data/source-gates/twii-aggregate-readback-contract-preflight.json";
const postRunPath = "data/source-gates/twii-post-run-review-contract-preflight.json";
const boundedInsertPath = "data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json";
const problems = [];

const gate = readJson(gatePath);
const readinessGate = readJson(readinessGatePath);
const explicitPrepGate = readJson(explicitPrepGatePath);
const serverChecks = readJson(serverChecksPath);
const rollback = readJson(rollbackPath);
const readback = readJson(readbackPath);
const postRun = readJson(postRunPath);
const boundedInsert = readJson(boundedInsertPath);
const readinessReport = runJsonReport(readinessReportPath, "TWII separate authorized execution attempt readiness gate");

validateGate();
validateSources();

const placeholders = gate.goNoGoFieldPlaceholders ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_final_authorization_stopline_go_no_go_gate_ready_no_execution" : "blocked",
  outcome: ok ? "final_authorization_stopline_go_no_go_ready_execution_still_blocked" : "final_authorization_stopline_go_no_go_gate_blocked",
  mode: "twii_final_authorization_stopline_go_no_go_gate_no_execution",
  gatePath,
  readinessGatePath,
  explicitPrepGatePath,
  serverChecksPath,
  rollbackPath,
  readbackPath,
  postRunPath,
  boundedInsertPath,
  gateMode: gate.gateMode ?? null,
  currentGoNoGoStatus: gate.currentGoNoGoStatus ?? null,
  nextReviewOnlyRoute: gate.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: gate.allowedNextCommandCategory ?? null,
  goNoGoDecision: gate.goNoGoDecision ?? null,
  goNoGoValidation: {
    requiredGoNoGoFieldCount: (gate.requiredGoNoGoFields ?? []).length,
    placeholderCount: placeholders.length,
    providedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    valueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length,
    goAcceptedNowCount: placeholders.filter((item) => item.goAcceptedNow === true).length,
    blockedReasonCount: (gate.blockedReasons ?? []).length
  },
  goNoGoState: {
    finalAuthorizationStoplineGoNoGoGatePrepared: gate.finalAuthorizationStoplineGoNoGoGatePrepared === true,
    separateAuthorizedExecutionAttemptReadinessReferenced: gate.separateAuthorizedExecutionAttemptReadinessReferenced === true,
    explicitExecutionPacketPreparationReferenced: gate.explicitExecutionPacketPreparationReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    rollbackContractReferenced: gate.rollbackContractReferenced === true,
    aggregateReadbackContractReferenced: gate.aggregateReadbackContractReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    boundedInsertContractReferenced: gate.boundedInsertContractReferenced === true,
    requiredGoNoGoFieldsPrepared: gate.requiredGoNoGoFieldsPrepared === true,
    goNoGoPrerequisitesPrepared: gate.goNoGoPrerequisitesPrepared === true,
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
    finalAuthorizationStoplineShapePrepared: gate.finalAuthorizationStoplineShapePrepared === true,
    reviewOnly: true,
    localOnly: true,
    presenceOnly: true,
    externalOnlyValuesProvidedNow: false,
    externalOperatorDecisionProvidedNow: false,
    operatorGoNoGoAcceptedNow: false,
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
    readinessStatus: readinessReport.status ?? null,
    readinessOutcome: readinessReport.outcome ?? null,
    readinessGateKind: readinessGate.gateKind ?? null,
    explicitExecutionPacketPreparationKind: explicitPrepGate.gateKind ?? null,
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
    gateKind: "twii_final_authorization_stopline_go_no_go_gate",
    gateMode: "final_authorization_stopline_go_no_go_fail_closed_no_execution",
    sourceSeparateAuthorizedExecutionAttemptReadinessGatePath: readinessGatePath,
    sourceExplicitExecutionPacketPreparationGatePath: explicitPrepGatePath,
    sourceServerOnlyPreExecutionChecksPath: serverChecksPath,
    sourceRollbackContractPath: rollbackPath,
    sourceAggregateReadbackContractPath: readbackPath,
    sourcePostRunReviewContractPath: postRunPath,
    sourceBoundedInsertContractPath: boundedInsertPath,
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    targetTable: "daily_prices",
    maxRows: 60,
    finalAuthorizationStoplineGoNoGoGatePrepared: true,
    separateAuthorizedExecutionAttemptReadinessReferenced: true,
    explicitExecutionPacketPreparationReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    rollbackContractReferenced: true,
    aggregateReadbackContractReferenced: true,
    postRunReviewContractReferenced: true,
    boundedInsertContractReferenced: true,
    requiredGoNoGoFieldsPrepared: true,
    goNoGoPrerequisitesPrepared: true,
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
    finalAuthorizationStoplineShapePrepared: true,
    localOnly: true,
    reviewOnly: true,
    presenceOnly: true,
    currentGoNoGoStatus: "final_authorization_stopline_go_no_go_ready_waiting_external_values",
    nextReviewOnlyRoute: "final_authorization_stopline_review_then_explicit_operator_go_no_go_decision",
    allowedNextCommandCategory: "review_only_explicit_operator_go_no_go_decision_preparation",
    goNoGoDecision: "final_authorization_stopline_ready_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  if ((gate.goNoGoFieldPlaceholders ?? []).length !== (gate.requiredGoNoGoFields ?? []).length) problems.push("gate.goNoGoFieldPlaceholders must match requiredGoNoGoFields");
  for (const id of gate.requiredGoNoGoFields ?? []) if (!(gate.goNoGoFieldPlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`gate missing go/no-go placeholder ${id}`);
  for (const item of gate.goNoGoFieldPlaceholders ?? []) {
    for (const field of ["fieldId", "label", "required", "providedNow", "valueReadNow", "goAcceptedNow", "executionAllowedByField", "storageAllowedInRepo", "placeholderOnly"]) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.providedNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} providedNow must be false`);
    if (item.valueReadNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} valueReadNow must be false`);
    if (item.goAcceptedNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} goAcceptedNow must be false`);
    if (item.executionAllowedByField !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} executionAllowedByField must be false`);
    if (item.storageAllowedInRepo !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} storageAllowedInRepo must be false`);
    if (item.placeholderOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} placeholderOnly must be true`);
  }
  for (const blocked of ["externalOnlyValuesProvidedNow=false", "externalOperatorDecisionProvidedNow=false", "operatorGoNoGoAcceptedNow=false", "operatorAuthorizationAcceptedNow=false", "authorizationValueReadNow=false", "serverOnlyCredentialCheckPassed=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "rollbackDryRunPassed=false", "aggregateReadbackPassed=false", "postRunReviewPassed=false", "candidateDuplicateRejectionProofPassed=false", "runnerExecutableNow=false", "executionAllowedNow=false", "writeGateExecutableNow=false", "finalExecutionAllowedNow=false", "implementationAllowedNow=false"]) if (!(gate.blockedReasons ?? []).includes(blocked)) problems.push(`gate missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSources() {
  if (readinessReport.status !== "twii_separate_authorized_execution_attempt_readiness_gate_ready_no_execution") problems.push("readiness report status mismatch");
  if (readinessReport.outcome !== "separate_authorized_execution_attempt_readiness_ready_execution_still_blocked") problems.push("readiness report outcome mismatch");
  if (readinessGate.gateKind !== "twii_separate_authorized_execution_attempt_readiness_gate") problems.push("readiness gate kind mismatch");
  if (explicitPrepGate.gateKind !== "twii_explicit_execution_packet_preparation_gate") problems.push("explicit execution packet preparation gate kind mismatch");
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
  return ["realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorGoNoGoAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}
function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "externalOperatorDecisionProvidedNow", "operatorGoNoGoAcceptedNow", "operatorAuthorizationAcceptedNow", "authorizationValueReadNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postRunReviewPassed", "candidateDuplicateRejectionProofPassed", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
