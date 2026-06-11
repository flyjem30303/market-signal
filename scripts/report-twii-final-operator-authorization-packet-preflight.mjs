import fs from "node:fs";
import { spawnSync } from "node:child_process";

const packetPath = "data/source-gates/twii-final-operator-authorization-packet-preflight.json";
const sourceRuntimeGatePath = "data/source-gates/twii-final-runtime-execution-gate-preflight.json";
const sourceRuntimeGateReportPath = "scripts/report-twii-final-runtime-execution-gate-preflight.mjs";
const problems = [];

const packet = readJson(packetPath);
const sourceRuntimeGate = readJson(sourceRuntimeGatePath);
const sourceRuntimeGateReport = runJsonReport(sourceRuntimeGateReportPath, "TWII final runtime execution gate preflight");
const candidateArtifactExists = fs.existsSync(packet.candidateArtifactPath);

validatePacket();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_final_operator_authorization_packet_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "final_operator_authorization_packet_ready_execution_still_blocked" : "final_operator_authorization_packet_preflight_blocked",
  mode: "twii_final_operator_authorization_packet_preflight_no_execution",
  owner: "CEO/PM",
  packetPath,
  sourceRuntimeGatePath,
  sourceRuntimeGateReportPath,
  candidateArtifactPath: packet.candidateArtifactPath ?? null,
  candidateArtifactExists,
  operatorPacketDecision: packet.operatorPacketDecision ?? null,
  packetMode: packet.packetMode ?? null,
  attemptId: packet.attemptId ?? null,
  target: {
    targetTable: packet.targetTable ?? null,
    targetLane: packet.targetLane ?? null,
    targetScope: packet.targetScope ?? null,
    maxRows: packet.maxRows ?? null
  },
  operatorAuthorizationPacketState: {
    packetPrepared: packet.packetPrepared === true,
    runtimeGateReferenced: packet.runtimeGateReferenced === true,
    operatorDecisionRequired: packet.operatorDecisionRequired === true,
    serverOnlyBoundaryReferenced: packet.serverOnlyBoundaryReferenced === true,
    failClosedDefaultReferenced: packet.failClosedDefaultReferenced === true,
    postRunReviewRequirementReferenced: packet.postRunReviewRequirementReferenced === true,
    aggregateReadbackRequirementReferenced: packet.aggregateReadbackRequirementReferenced === true,
    rollbackRequirementReferenced: packet.rollbackRequirementReferenced === true,
    executeSwitchRequirementReferenced: packet.executeSwitchRequirementReferenced === true,
    confirmationPhraseRequirementReferenced: packet.confirmationPhraseRequirementReferenced === true,
    authorizationDecisionAcceptedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  },
  requirementNames: {
    requiredExecuteSwitchName: packet.requiredExecuteSwitchName ?? null,
    requiredConfirmationPhraseName: packet.requiredConfirmationPhraseName ?? null,
    requiredConfirmationPhraseReference: packet.requiredConfirmationPhraseReference ?? null,
    valuesOutput: false
  },
  operatorDecisionVocabulary: packet.operatorDecisionVocabulary ?? [],
  requiredOperatorReviewArtifacts: packet.requiredOperatorReviewArtifacts ?? [],
  candidateState: {
    candidateArtifactReferenceOnly: packet.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  authorizationValuesState: {
    authorizationDecisionAcceptedNow: false,
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    envValueOutput: false
  },
  operatorAuthorizationPacket: packet.operatorAuthorizationPacket ?? null,
  allowedOperatorPacketFields: packet.allowedOperatorPacketFields ?? [],
  disallowedOperatorPacketFields: packet.disallowedOperatorPacketFields ?? [],
  promotionLocks: packet.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  currentRoute: "final_operator_authorization_packet_ready_but_runtime_execution_blocked",
  nextIfOperatorAcceptsPacket: packet.nextIfOperatorAcceptsPacket ?? null,
  nextIfOperatorRejectsPacket: packet.nextIfOperatorRejectsPacket ?? null,
  nextIfOperatorDefersPacket: packet.nextIfOperatorDefersPacket ?? null,
  upstream: {
    sourceRuntimeGateStatus: sourceRuntimeGateReport.status ?? null,
    sourceRuntimeGateOutcome: sourceRuntimeGateReport.outcome ?? null,
    sourceRuntimeGateKind: sourceRuntimeGate.gateKind ?? null
  },
  safety: safetyState(),
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePacket() {
  const expected = {
    packetKind: "twii_final_operator_authorization_packet_preflight",
    sourceRuntimeGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    packetMode: "final_operator_authorization_packet_preflight_fail_closed_no_execution",
    packetPrepared: true,
    runtimeGateReferenced: true,
    operatorDecisionRequired: true,
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
    operatorPacketDecision: "final_operator_authorization_packet_ready_but_execution_still_blocked",
    nextIfOperatorAcceptsPacket: "operator_may_make_explicit_bounded_runtime_attempt_decision_in_separate_step",
    nextIfOperatorRejectsPacket: "repair_final_operator_authorization_packet_or_runtime_gate",
    nextIfOperatorDefersPacket: "keep_runtime_write_attempt_blocked_and_refresh_packet_before_any_execution",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`packet.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(packet.packetId)) problems.push("packet.packetId is required");
  if (JSON.stringify(packet.operatorDecisionVocabulary) !== JSON.stringify(operatorVocabulary())) {
    problems.push("operatorDecisionVocabulary mismatch");
  }
  if (JSON.stringify(packet.requiredOperatorReviewArtifacts) !== JSON.stringify(operatorArtifacts())) {
    problems.push("requiredOperatorReviewArtifacts mismatch");
  }
  validateOperatorPacket(packet.operatorAuthorizationPacket ?? {});
  validateAllowedFields(packet.allowedOperatorPacketFields ?? []);
  validateDisallowedFields(packet.disallowedOperatorPacketFields ?? []);
  validatePromotionLocks(packet.promotionLocks ?? {});
  validateSafety(packet.safety ?? {});
}

function validateUpstream() {
  if (sourceRuntimeGateReport.status !== "twii_final_runtime_execution_gate_preflight_ready_no_execution") {
    problems.push("source runtime gate report status mismatch");
  }
  if (sourceRuntimeGateReport.outcome !== "final_runtime_execution_gate_ready_execution_still_blocked") {
    problems.push("source runtime gate report outcome mismatch");
  }
  if (sourceRuntimeGate.gateKind !== "twii_final_runtime_execution_gate_preflight") {
    problems.push("source runtime gate kind mismatch");
  }
  if (sourceRuntimeGate.nextIfRuntimeGateAccepted !== "operator_may_authorize_exact_bounded_runtime_attempt_in_separate_explicit_step") {
    problems.push("source runtime gate must route to separate operator authorization");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceRuntimeGate[key] !== packet[key]) problems.push(`packet.${key} must match source runtime gate`);
  }
}

function validateOperatorPacket(operatorPacket) {
  const expected = {
    operationKind: "future_operator_authorization_packet_fail_closed_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresFinalRuntimeGatePreflight: true,
    requiresSeparateExplicitAttemptDecision: true,
    requiresServerOnlyBoundary: true,
    requiresFailClosedDefault: true,
    requiresExecuteSwitchRequirement: true,
    requiresConfirmationPhraseRequirement: true,
    requiresPostRunReview: true,
    requiresAggregateReadback: true,
    requiresRollbackReadiness: true,
    allowsRunnerExecution: false,
    allowsSupabaseConnection: false,
    allowsAuthorizationDecisionAcceptance: false,
    allowsAuthorizationValueRead: false,
    allowsEnvValueOutput: false,
    allowsRowBodies: false,
    allowsTradeDateLists: false,
    allowsSourceValues: false,
    allowsStockIdPayload: false,
    allowsSecrets: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (operatorPacket[key] !== value) problems.push(`operatorAuthorizationPacket.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateAllowedFields(fields) {
  const expected = [
    "attemptId",
    "targetScope",
    "targetTable",
    "targetLane",
    "maxRows",
    "sourceRuntimeGatePath",
    "candidateArtifactPath",
    "requiredExecuteSwitchName",
    "requiredConfirmationPhraseName",
    "requiredConfirmationPhraseReference",
    "operatorDecisionVocabulary",
    "requiredOperatorReviewArtifacts",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "publicDataSource",
    "scoreSource"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("allowedOperatorPacketFields mismatch");
}

function validateDisallowedFields(fields) {
  const expected = [
    "executeSwitchValue",
    "confirmationPhraseValue",
    "credentialValue",
    "secretValue",
    "authorizationValue",
    "operatorDecisionValue",
    "rowBody",
    "tradeDateList",
    "marketValue",
    "sourcePayload",
    "rawPayload",
    "stockIdPayload",
    "personalizedAdvice",
    "buySellHoldSignal"
  ];
  if (JSON.stringify(fields) !== JSON.stringify(expected)) problems.push("disallowedOperatorPacketFields mismatch");
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

function operatorVocabulary() {
  return [
    "accepted_for_explicit_attempt_decision_review",
    "rejected",
    "repair_required",
    "deferred_or_expired"
  ];
}

function operatorArtifacts() {
  return [
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
