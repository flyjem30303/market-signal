import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-exact-runtime-execution-command-preparation-gate-preflight.json";
const sourceDecisionGatePath = "data/source-gates/twii-explicit-bounded-runtime-attempt-decision-gate-preflight.json";
const sourceDecisionGateReportPath = "scripts/report-twii-explicit-bounded-runtime-attempt-decision-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceDecisionGate = readJson(sourceDecisionGatePath);
const sourceDecisionGateReport = runJsonReport(sourceDecisionGateReportPath, "TWII explicit bounded runtime attempt decision gate preflight");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_exact_runtime_execution_command_preparation_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "exact_runtime_execution_command_preparation_gate_ready_execution_still_blocked" : "exact_runtime_execution_command_preparation_gate_preflight_blocked",
  mode: "twii_exact_runtime_execution_command_preparation_gate_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceDecisionGatePath,
  sourceDecisionGateReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  commandPreparationGateDecision: gate.commandPreparationGateDecision ?? null,
  commandPreparationMode: gate.commandPreparationMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  commandPreparationGateState: {
    commandPreparationGatePrepared: gate.commandPreparationGatePrepared === true,
    decisionGateReferenced: gate.decisionGateReferenced === true,
    exactRuntimeExecutionCommandPrepared: false,
    exactRuntimeExecutionCommandReferenceOnly: gate.exactRuntimeExecutionCommandReferenceOnly === true,
    separateFinalExecutionRunRequired: gate.separateFinalExecutionRunRequired === true,
    serverOnlyBoundaryReferenced: gate.serverOnlyBoundaryReferenced === true,
    failClosedDefaultReferenced: gate.failClosedDefaultReferenced === true,
    postRunReviewRequirementReferenced: gate.postRunReviewRequirementReferenced === true,
    aggregateReadbackRequirementReferenced: gate.aggregateReadbackRequirementReferenced === true,
    rollbackRequirementReferenced: gate.rollbackRequirementReferenced === true,
    executeSwitchRequirementReferenced: gate.executeSwitchRequirementReferenced === true,
    confirmationPhraseRequirementReferenced: gate.confirmationPhraseRequirementReferenced === true,
    authorizationDecisionAcceptedNow: false,
    explicitAttemptDecisionAcceptedNow: false,
    exactCommandAcceptedNow: false,
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
  commandPreparationDecisionVocabulary: gate.commandPreparationDecisionVocabulary ?? [],
  requiredCommandPreparationArtifacts: gate.requiredCommandPreparationArtifacts ?? [],
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
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    envValueOutput: false
  },
  exactCommandPreparationPacket: gate.exactCommandPreparationPacket ?? null,
  allowedCommandPreparationFields: gate.allowedCommandPreparationFields ?? [],
  disallowedCommandPreparationFields: gate.disallowedCommandPreparationFields ?? [],
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  currentRoute: "exact_runtime_execution_command_preparation_gate_ready_but_command_and_execution_blocked",
  nextIfCommandPreparationAccepted: gate.nextIfCommandPreparationAccepted ?? null,
  nextIfCommandPreparationRejected: gate.nextIfCommandPreparationRejected ?? null,
  nextIfCommandPreparationDeferred: gate.nextIfCommandPreparationDeferred ?? null,
  upstream: {
    sourceDecisionGateStatus: sourceDecisionGateReport.status ?? null,
    sourceDecisionGateOutcome: sourceDecisionGateReport.outcome ?? null,
    sourceDecisionGateKind: sourceDecisionGate.gateKind ?? null
  },
  safety: safetyState(),
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_exact_runtime_execution_command_preparation_gate_preflight",
    sourceDecisionGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    commandPreparationMode: "exact_runtime_execution_command_preparation_gate_fail_closed_no_execution",
    commandPreparationGatePrepared: true,
    decisionGateReferenced: true,
    exactRuntimeExecutionCommandPrepared: false,
    exactRuntimeExecutionCommandReferenceOnly: true,
    separateFinalExecutionRunRequired: true,
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
    exactCommandAcceptedNow: false,
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
    commandPreparationGateDecision: "exact_runtime_execution_command_preparation_gate_ready_but_command_not_prepared_and_execution_blocked",
    nextIfCommandPreparationAccepted: "operator_may_prepare_exact_command_text_in_separate_step",
    nextIfCommandPreparationRejected: "keep_runtime_write_attempt_blocked_and_repair_command_preparation_gate",
    nextIfCommandPreparationDeferred: "refresh_attempt_decision_gate_before_any_command_preparation",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (JSON.stringify(gate.commandPreparationDecisionVocabulary) !== JSON.stringify(commandVocabulary())) {
    problems.push("commandPreparationDecisionVocabulary mismatch");
  }
  if (JSON.stringify(gate.requiredCommandPreparationArtifacts) !== JSON.stringify(commandArtifacts())) {
    problems.push("requiredCommandPreparationArtifacts mismatch");
  }
  validateCommandPacket(gate.exactCommandPreparationPacket ?? {});
  validateAllowedFields(gate.allowedCommandPreparationFields ?? []);
  validateDisallowedFields(gate.disallowedCommandPreparationFields ?? []);
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceDecisionGateReport.status !== "twii_explicit_bounded_runtime_attempt_decision_gate_preflight_ready_no_execution") {
    problems.push("source decision gate report status mismatch");
  }
  if (sourceDecisionGateReport.outcome !== "explicit_bounded_runtime_attempt_decision_gate_ready_execution_still_blocked") {
    problems.push("source decision gate report outcome mismatch");
  }
  if (sourceDecisionGate.gateKind !== "twii_explicit_bounded_runtime_attempt_decision_gate_preflight") {
    problems.push("source decision gate kind mismatch");
  }
  if (sourceDecisionGate.nextIfDecisionAccepted !== "operator_may_prepare_exact_runtime_execution_command_in_separate_step") {
    problems.push("source decision gate must route to exact runtime execution command preparation");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceDecisionGate[key] !== gate[key]) problems.push(`gate.${key} must match source decision gate`);
  }
}

function validateCommandPacket(packet) {
  const expected = {
    operationKind: "future_exact_runtime_execution_command_preparation_fail_closed_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresExplicitBoundedAttemptDecisionGate: true,
    requiresSeparateFinalExecutionRun: true,
    requiresServerOnlyBoundary: true,
    requiresFailClosedDefault: true,
    requiresExecuteSwitchRequirement: true,
    requiresConfirmationPhraseRequirement: true,
    requiresPostRunReview: true,
    requiresAggregateReadback: true,
    requiresRollbackReadiness: true,
    allowsExactCommandTextOutput: false,
    allowsRunnerExecution: false,
    allowsSupabaseConnection: false,
    allowsExactCommandAcceptance: false,
    allowsAuthorizationValueRead: false,
    allowsEnvValueOutput: false,
    allowsRowBodies: false,
    allowsTradeDateLists: false,
    allowsSourceValues: false,
    allowsStockIdPayload: false,
    allowsSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`exactCommandPreparationPacket.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "sourceDecisionGatePath",
    "candidateArtifactPath",
    "requiredExecuteSwitchName",
    "requiredConfirmationPhraseName",
    "requiredConfirmationPhraseReference",
    "commandPreparationDecisionVocabulary",
    "requiredCommandPreparationArtifacts",
    "exactRuntimeExecutionCommandPrepared",
    "exactRuntimeExecutionCommandReferenceOnly",
    "exactCommandAcceptedNow",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedCommandPreparationFields mismatch");
}

function validateDisallowedFields(fields) {
  const expected = [
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
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedCommandPreparationFields mismatch");
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

function commandVocabulary() {
  return [
    "accepted_for_exact_command_text_preparation",
    "rejected",
    "repair_required",
    "deferred_or_expired"
  ];
}

function commandArtifacts() {
  return [
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
