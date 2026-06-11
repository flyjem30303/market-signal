import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-explicit-bounded-runtime-attempt-decision-gate-preflight.json";
const sourceOperatorPacketPath = "data/source-gates/twii-final-operator-authorization-packet-preflight.json";
const sourceOperatorPacketReportPath = "scripts/report-twii-final-operator-authorization-packet-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceOperatorPacket = readJson(sourceOperatorPacketPath);
const sourceOperatorPacketReport = runJsonReport(sourceOperatorPacketReportPath, "TWII final operator authorization packet preflight");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_explicit_bounded_runtime_attempt_decision_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "explicit_bounded_runtime_attempt_decision_gate_ready_execution_still_blocked" : "explicit_bounded_runtime_attempt_decision_gate_preflight_blocked",
  mode: "twii_explicit_bounded_runtime_attempt_decision_gate_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceOperatorPacketPath,
  sourceOperatorPacketReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  attemptDecisionGateDecision: gate.attemptDecisionGateDecision ?? null,
  decisionGateMode: gate.decisionGateMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  attemptDecisionGateState: {
    decisionGatePrepared: gate.decisionGatePrepared === true,
    operatorPacketReferenced: gate.operatorPacketReferenced === true,
    separateExplicitAttemptDecisionRequired: gate.separateExplicitAttemptDecisionRequired === true,
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
  attemptDecisionVocabulary: gate.attemptDecisionVocabulary ?? [],
  requiredDecisionReviewArtifacts: gate.requiredDecisionReviewArtifacts ?? [],
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
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    envValueOutput: false
  },
  explicitAttemptDecisionPacket: gate.explicitAttemptDecisionPacket ?? null,
  allowedDecisionGateFields: gate.allowedDecisionGateFields ?? [],
  disallowedDecisionGateFields: gate.disallowedDecisionGateFields ?? [],
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  currentRoute: "explicit_bounded_runtime_attempt_decision_gate_ready_but_runtime_execution_blocked",
  nextIfDecisionAccepted: gate.nextIfDecisionAccepted ?? null,
  nextIfDecisionRejected: gate.nextIfDecisionRejected ?? null,
  nextIfDecisionDeferred: gate.nextIfDecisionDeferred ?? null,
  upstream: {
    sourceOperatorPacketStatus: sourceOperatorPacketReport.status ?? null,
    sourceOperatorPacketOutcome: sourceOperatorPacketReport.outcome ?? null,
    sourceOperatorPacketKind: sourceOperatorPacket.packetKind ?? null
  },
  safety: safetyState(),
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_explicit_bounded_runtime_attempt_decision_gate_preflight",
    sourceOperatorPacketPath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    decisionGateMode: "explicit_bounded_runtime_attempt_decision_gate_preflight_fail_closed_no_execution",
    decisionGatePrepared: true,
    operatorPacketReferenced: true,
    separateExplicitAttemptDecisionRequired: true,
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
    attemptDecisionGateDecision: "explicit_bounded_attempt_decision_gate_ready_but_execution_still_blocked",
    nextIfDecisionAccepted: "operator_may_prepare_exact_runtime_execution_command_in_separate_step",
    nextIfDecisionRejected: "keep_runtime_write_attempt_blocked_and_repair_decision_gate",
    nextIfDecisionDeferred: "refresh_final_operator_packet_and_decision_gate_before_any_execution",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (JSON.stringify(gate.attemptDecisionVocabulary) !== JSON.stringify(attemptVocabulary())) {
    problems.push("attemptDecisionVocabulary mismatch");
  }
  if (JSON.stringify(gate.requiredDecisionReviewArtifacts) !== JSON.stringify(decisionArtifacts())) {
    problems.push("requiredDecisionReviewArtifacts mismatch");
  }
  validateDecisionPacket(gate.explicitAttemptDecisionPacket ?? {});
  validateAllowedFields(gate.allowedDecisionGateFields ?? []);
  validateDisallowedFields(gate.disallowedDecisionGateFields ?? []);
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceOperatorPacketReport.status !== "twii_final_operator_authorization_packet_preflight_ready_no_execution") {
    problems.push("source operator packet report status mismatch");
  }
  if (sourceOperatorPacketReport.outcome !== "final_operator_authorization_packet_ready_execution_still_blocked") {
    problems.push("source operator packet report outcome mismatch");
  }
  if (sourceOperatorPacket.packetKind !== "twii_final_operator_authorization_packet_preflight") {
    problems.push("source operator packet kind mismatch");
  }
  if (sourceOperatorPacket.nextIfOperatorAcceptsPacket !== "operator_may_make_explicit_bounded_runtime_attempt_decision_in_separate_step") {
    problems.push("source operator packet must route to separate explicit attempt decision");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceOperatorPacket[key] !== gate[key]) problems.push(`gate.${key} must match source operator packet`);
  }
}

function validateDecisionPacket(packet) {
  const expected = {
    operationKind: "future_explicit_bounded_attempt_decision_fail_closed_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresFinalOperatorAuthorizationPacket: true,
    requiresSeparateExactRuntimeExecutionCommand: true,
    requiresServerOnlyBoundary: true,
    requiresFailClosedDefault: true,
    requiresExecuteSwitchRequirement: true,
    requiresConfirmationPhraseRequirement: true,
    requiresPostRunReview: true,
    requiresAggregateReadback: true,
    requiresRollbackReadiness: true,
    allowsRunnerExecution: false,
    allowsSupabaseConnection: false,
    allowsExplicitAttemptDecisionAcceptance: false,
    allowsAuthorizationValueRead: false,
    allowsEnvValueOutput: false,
    allowsRowBodies: false,
    allowsTradeDateLists: false,
    allowsSourceValues: false,
    allowsStockIdPayload: false,
    allowsSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`explicitAttemptDecisionPacket.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "sourceOperatorPacketPath",
    "candidateArtifactPath",
    "requiredExecuteSwitchName",
    "requiredConfirmationPhraseName",
    "requiredConfirmationPhraseReference",
    "attemptDecisionVocabulary",
    "requiredDecisionReviewArtifacts",
    "explicitAttemptDecisionAcceptedNow",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedDecisionGateFields mismatch");
}

function validateDisallowedFields(fields) {
  const expected = [
    "executeSwitchValue",
    "confirmationPhraseValue",
    "credentialValue",
    "secretValue",
    "authorizationValue",
    "operatorDecisionValue",
    "explicitAttemptDecisionValue",
    "rowBody",
    "tradeDateList",
    "marketValue",
    "sourcePayload",
    "rawPayload",
    "stockIdPayload",
    "personalizedAdvice",
    "buySellHoldSignal"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedDecisionGateFields mismatch");
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

function attemptVocabulary() {
  return [
    "accepted_for_exact_runtime_execution_command_preparation",
    "rejected",
    "repair_required",
    "deferred_or_expired"
  ];
}

function decisionArtifacts() {
  return [
    "source_operator_packet",
    "source_runtime_gate",
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
