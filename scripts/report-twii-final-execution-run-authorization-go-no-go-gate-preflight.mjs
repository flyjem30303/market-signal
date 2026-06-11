import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-final-execution-run-authorization-go-no-go-gate-preflight.json";
const sourceCommandPreparationGatePath = "data/source-gates/twii-exact-runtime-execution-command-preparation-gate-preflight.json";
const sourceCommandPreparationGateReportPath = "scripts/report-twii-exact-runtime-execution-command-preparation-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceCommandGate = readJson(sourceCommandPreparationGatePath);
const sourceCommandGateReport = runJsonReport(sourceCommandPreparationGateReportPath, "TWII exact runtime execution command preparation gate preflight");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_final_execution_run_authorization_go_no_go_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "final_execution_run_go_no_go_gate_ready_execution_still_blocked" : "final_execution_run_go_no_go_gate_preflight_blocked",
  mode: "twii_final_execution_run_authorization_go_no_go_gate_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceCommandPreparationGatePath,
  sourceCommandPreparationGateReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  goNoGoGateDecision: gate.goNoGoGateDecision ?? null,
  goNoGoGateMode: gate.goNoGoGateMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  goNoGoGateState: {
    goNoGoGatePrepared: gate.goNoGoGatePrepared === true,
    commandPreparationGateReferenced: gate.commandPreparationGateReferenced === true,
    finalExecutionRunAuthorizationRequired: gate.finalExecutionRunAuthorizationRequired === true,
    goDecisionAcceptedNow: false,
    noGoDecisionRecordedNow: false,
    exactRuntimeExecutionCommandPrepared: false,
    exactCommandAcceptedNow: false,
    serverOnlyBoundaryReferenced: gate.serverOnlyBoundaryReferenced === true,
    failClosedDefaultReferenced: gate.failClosedDefaultReferenced === true,
    postRunReviewRequirementReferenced: gate.postRunReviewRequirementReferenced === true,
    aggregateReadbackRequirementReferenced: gate.aggregateReadbackRequirementReferenced === true,
    rollbackRequirementReferenced: gate.rollbackRequirementReferenced === true,
    executeSwitchRequirementReferenced: gate.executeSwitchRequirementReferenced === true,
    confirmationPhraseRequirementReferenced: gate.confirmationPhraseRequirementReferenced === true,
    authorizationDecisionAcceptedNow: false,
    explicitAttemptDecisionAcceptedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  requirementNames: {
    requiredExecuteSwitchName: gate.requiredExecuteSwitchName ?? null,
    requiredConfirmationPhraseName: gate.requiredConfirmationPhraseName ?? null,
    requiredConfirmationPhraseReference: gate.requiredConfirmationPhraseReference ?? null,
    valuesOutput: false
  },
  goNoGoDecisionVocabulary: gate.goNoGoDecisionVocabulary ?? [],
  requiredGoNoGoArtifacts: gate.requiredGoNoGoArtifacts ?? [],
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  authorizationValuesState: {
    authorizationDecisionAcceptedNow: false,
    explicitAttemptDecisionAcceptedNow: false,
    exactCommandAcceptedNow: false,
    goDecisionAcceptedNow: false,
    noGoDecisionRecordedNow: false,
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    envValueOutput: false
  },
  goNoGoDecisionPacket: gate.goNoGoDecisionPacket ?? null,
  allowedGoNoGoFields: gate.allowedGoNoGoFields ?? [],
  disallowedGoNoGoFields: gate.disallowedGoNoGoFields ?? [],
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  currentRoute: "final_execution_run_go_no_go_gate_ready_but_go_not_accepted_and_execution_blocked",
  nextIfGoAccepted: gate.nextIfGoAccepted ?? null,
  nextIfNoGoRecorded: gate.nextIfNoGoRecorded ?? null,
  nextIfDecisionDeferred: gate.nextIfDecisionDeferred ?? null,
  upstream: {
    sourceCommandPreparationGateStatus: sourceCommandGateReport.status ?? null,
    sourceCommandPreparationGateOutcome: sourceCommandGateReport.outcome ?? null,
    sourceCommandPreparationGateKind: sourceCommandGate.gateKind ?? null
  },
  safety: safetyState(),
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_final_execution_run_authorization_go_no_go_gate_preflight",
    sourceCommandPreparationGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    goNoGoGateMode: "final_execution_run_authorization_blocker_go_no_go_gate_fail_closed_no_execution",
    goNoGoGatePrepared: true,
    commandPreparationGateReferenced: true,
    finalExecutionRunAuthorizationRequired: true,
    goDecisionAcceptedNow: false,
    noGoDecisionRecordedNow: false,
    exactRuntimeExecutionCommandPrepared: false,
    exactCommandAcceptedNow: false,
    serverOnlyBoundaryReferenced: true,
    failClosedDefaultReferenced: true,
    postRunReviewRequirementReferenced: true,
    aggregateReadbackRequirementReferenced: true,
    rollbackRequirementReferenced: true,
    executeSwitchRequirementReferenced: true,
    confirmationPhraseRequirementReferenced: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    authorizationDecisionAcceptedNow: false,
    explicitAttemptDecisionAcceptedNow: false,
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    goNoGoGateDecision: "final_execution_run_go_no_go_gate_ready_but_go_not_accepted_and_execution_blocked",
    nextIfGoAccepted: "operator_may_prepare_final_execution_run_in_separate_step",
    nextIfNoGoRecorded: "keep_runtime_write_attempt_blocked_and_record_no_go_reason",
    nextIfDecisionDeferred: "refresh_exact_command_preparation_gate_before_any_go_decision",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (JSON.stringify(gate.goNoGoDecisionVocabulary) !== JSON.stringify(goNoGoVocabulary())) {
    problems.push("goNoGoDecisionVocabulary mismatch");
  }
  if (JSON.stringify(gate.requiredGoNoGoArtifacts) !== JSON.stringify(goNoGoArtifacts())) {
    problems.push("requiredGoNoGoArtifacts mismatch");
  }
  validateGoNoGoPacket(gate.goNoGoDecisionPacket ?? {});
  validateAllowedFields(gate.allowedGoNoGoFields ?? []);
  validateDisallowedFields(gate.disallowedGoNoGoFields ?? []);
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceCommandGateReport.status !== "twii_exact_runtime_execution_command_preparation_gate_preflight_ready_no_execution") {
    problems.push("source command preparation gate report status mismatch");
  }
  if (sourceCommandGateReport.outcome !== "exact_runtime_execution_command_preparation_gate_ready_execution_still_blocked") {
    problems.push("source command preparation gate report outcome mismatch");
  }
  if (sourceCommandGate.gateKind !== "twii_exact_runtime_execution_command_preparation_gate_preflight") {
    problems.push("source command preparation gate kind mismatch");
  }
  if (sourceCommandGate.nextIfCommandPreparationAccepted !== "operator_may_prepare_exact_command_text_in_separate_step") {
    problems.push("source command preparation gate must route to exact command text preparation");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceCommandGate[key] !== gate[key]) problems.push(`gate.${key} must match source command preparation gate`);
  }
}

function validateGoNoGoPacket(packet) {
  const expected = {
    operationKind: "future_final_execution_run_go_no_go_decision_fail_closed_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresExactCommandPreparationGate: true,
    requiresSeparateFinalExecutionRun: true,
    requiresServerOnlyBoundary: true,
    requiresFailClosedDefault: true,
    requiresExecuteSwitchRequirement: true,
    requiresConfirmationPhraseRequirement: true,
    requiresPostRunReview: true,
    requiresAggregateReadback: true,
    requiresRollbackReadiness: true,
    allowsGoAcceptance: false,
    allowsNoGoRecording: false,
    allowsRunnerExecution: false,
    allowsSupabaseConnection: false,
    allowsAuthorizationValueRead: false,
    allowsEnvValueOutput: false,
    allowsRowBodies: false,
    allowsTradeDateLists: false,
    allowsSourceValues: false,
    allowsStockIdPayload: false,
    allowsSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`goNoGoDecisionPacket.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "sourceCommandPreparationGatePath",
    "candidateArtifactPath",
    "requiredExecuteSwitchName",
    "requiredConfirmationPhraseName",
    "requiredConfirmationPhraseReference",
    "goNoGoDecisionVocabulary",
    "requiredGoNoGoArtifacts",
    "goDecisionAcceptedNow",
    "noGoDecisionRecordedNow",
    "exactRuntimeExecutionCommandPrepared",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedGoNoGoFields mismatch");
}

function validateDisallowedFields(fields) {
  const expected = [
    "goDecisionValue",
    "noGoReasonValue",
    "exactRuntimeExecutionCommandText",
    "executeSwitchValue",
    "confirmationPhraseValue",
    "credentialValue",
    "secretValue",
    "authorizationValue",
    "operatorDecisionValue",
    "explicitAttemptDecisionValue",
    "exactCommandDecisionValue",
    "rowBody",
    "tradeDateList",
    "marketValue",
    "sourcePayload",
    "rawPayload",
    "stockIdPayload",
    "personalizedAdvice",
    "buySellHoldSignal"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedGoNoGoFields mismatch");
}

function validatePromotionLocks(locks) {
  if (locks.promotionAllowed !== false) problems.push("promotionLocks.promotionAllowed must be false");
  if (locks.rowCoverageScoringAllowed !== false) problems.push("promotionLocks.rowCoverageScoringAllowed must be false");
  if (locks.publicDataSource !== "mock") problems.push("promotionLocks.publicDataSource must be mock");
  if (locks.scoreSource !== "mock") problems.push("promotionLocks.scoreSource must be mock");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("safety must stay publicDataSource=mock and scoreSource=mock");
  }
  if (safety.candidateArtifactReferenceOnly !== true) problems.push("safety.candidateArtifactReferenceOnly must be true");
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "authorizationDecisionAcceptedNow",
    "explicitAttemptDecisionAcceptedNow",
    "exactCommandAcceptedNow",
    "goDecisionAcceptedNow",
    "noGoDecisionRecordedNow",
    "authorizationValuesRead",
    "executeSwitchValueRead",
    "confirmationPhraseValueRead",
    "credentialValuesRead",
    "sourcePayloadRead",
    "rowPayloadRead",
    "rawPayloadRead",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "envValueOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

function goNoGoVocabulary() {
  return [
    "go_for_final_execution_run_preparation",
    "no_go",
    "repair_required",
    "deferred_or_expired"
  ];
}

function goNoGoArtifacts() {
  return [
    "source_command_preparation_gate",
    "source_decision_gate",
    "source_operator_packet",
    "server_only_boundary",
    "fail_closed_default",
    "post_run_review",
    "aggregate_readback",
    "rollback_readiness",
    "promotion_lock"
  ];
}

function noExecutionState() {
  return {
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    rowCoverageScoringAllowed: false,
    envValueOutput: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  };
}

function safetyState() {
  return {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    authorizationDecisionAcceptedNow: false,
    explicitAttemptDecisionAcceptedNow: false,
    exactCommandAcceptedNow: false,
    goDecisionAcceptedNow: false,
    noGoDecisionRecordedNow: false,
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    envValueOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  };
}

function safeText(value) {
  return typeof value === "string" && /^[a-z0-9_-]+$/u.test(value);
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function runJsonReport(path, label) {
  const run = spawnSync(process.execPath, [path], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${label} report must exit 0`);
  try {
    return JSON.parse(run.stdout ?? "");
  } catch (error) {
    problems.push(`${label} report must output JSON: ${error.message}`);
    return {};
  }
}
