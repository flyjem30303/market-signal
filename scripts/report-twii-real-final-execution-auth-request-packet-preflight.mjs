import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-real-final-execution-auth-request-packet-preflight.json";
const sourceRehearsalGatePath = "data/source-gates/twii-final-execution-rehearsal-gate-preflight.json";
const sourceRehearsalGateReportPath = "scripts/report-twii-final-execution-rehearsal-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceGate = readJson(sourceRehearsalGatePath);
const sourceReport = runJsonReport(sourceRehearsalGateReportPath, "TWII final execution rehearsal gate");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_real_final_execution_auth_request_packet_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "real_final_execution_authorization_request_packet_ready_execution_still_blocked" : "real_final_execution_authorization_request_packet_preflight_blocked",
  mode: "twii_real_final_execution_auth_request_packet_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceRehearsalGatePath,
  sourceRehearsalGateReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  authRequestDecision: gate.authRequestDecision ?? null,
  authRequestPacketMode: gate.authRequestPacketMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  authRequestState: {
    authRequestPacketPrepared: gate.authRequestPacketPrepared === true,
    sourceRehearsalGateReferenced: gate.sourceRehearsalGateReferenced === true,
    realExecutionAuthorizationRequestedNow: false,
    realExecutionAuthorizationAcceptedNow: false,
    authorizationDecisionAcceptedNow: false,
    goDecisionAcceptedNow: false,
    noGoDecisionRecordedNow: false,
    exactRuntimeExecutionCommandPrepared: false,
    exactCommandAcceptedNow: false,
    finalExecutionRunPrepared: false,
    serverOnlyBoundaryReferenced: gate.serverOnlyBoundaryReferenced === true,
    failClosedDefaultReferenced: gate.failClosedDefaultReferenced === true,
    operatorStopConditionsPrepared: gate.operatorStopConditionsPrepared === true,
    postRunReviewRequirementReferenced: gate.postRunReviewRequirementReferenced === true,
    aggregateReadbackRequirementReferenced: gate.aggregateReadbackRequirementReferenced === true,
    rollbackRequirementReferenced: gate.rollbackRequirementReferenced === true,
    executeSwitchRequirementReferenced: gate.executeSwitchRequirementReferenced === true,
    confirmationPhraseRequirementReferenced: gate.confirmationPhraseRequirementReferenced === true,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false
  },
  requirementNames: {
    requiredExecuteSwitchName: gate.requiredExecuteSwitchName ?? null,
    requiredConfirmationPhraseName: gate.requiredConfirmationPhraseName ?? null,
    requiredConfirmationPhraseReference: gate.requiredConfirmationPhraseReference ?? null,
    valuesOutput: false
  },
  authRequestArtifacts: gate.authRequestArtifacts ?? [],
  authRequestVocabulary: gate.authRequestVocabulary ?? [],
  authorizationRequestPacket: gate.authorizationRequestPacket ?? null,
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  authorizationValuesState: {
    realExecutionAuthorizationRequestedNow: false,
    realExecutionAuthorizationAcceptedNow: false,
    authorizationDecisionAcceptedNow: false,
    goDecisionAcceptedNow: false,
    noGoDecisionRecordedNow: false,
    exactCommandAcceptedNow: false,
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    envValueOutput: false
  },
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  currentRoute: "real_final_execution_authorization_request_packet_ready_but_execution_still_blocked",
  nextIfAuthorizationRequested: gate.nextIfAuthorizationRequested ?? null,
  nextIfAuthorizationRejected: gate.nextIfAuthorizationRejected ?? null,
  nextIfRepairRequired: gate.nextIfRepairRequired ?? null,
  upstream: {
    sourceRehearsalGateStatus: sourceReport.status ?? null,
    sourceRehearsalGateOutcome: sourceReport.outcome ?? null,
    sourceRehearsalGateKind: sourceGate.gateKind ?? null
  },
  safety: safetyState(),
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_real_final_execution_auth_request_packet_preflight",
    sourceRehearsalGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    authRequestPacketMode: "real_final_execution_authorization_request_packet_fail_closed_no_execution",
    authRequestPacketPrepared: true,
    sourceRehearsalGateReferenced: true,
    realExecutionAuthorizationRequestedNow: false,
    realExecutionAuthorizationAcceptedNow: false,
    authorizationDecisionAcceptedNow: false,
    goDecisionAcceptedNow: false,
    noGoDecisionRecordedNow: false,
    exactRuntimeExecutionCommandPrepared: false,
    exactCommandAcceptedNow: false,
    finalExecutionRunPrepared: false,
    serverOnlyBoundaryReferenced: true,
    failClosedDefaultReferenced: true,
    operatorStopConditionsPrepared: true,
    postRunReviewRequirementReferenced: true,
    aggregateReadbackRequirementReferenced: true,
    rollbackRequirementReferenced: true,
    executeSwitchRequirementReferenced: true,
    confirmationPhraseRequirementReferenced: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
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
    authRequestDecision: "real_final_execution_authorization_request_packet_ready_but_not_requested_or_accepted",
    nextIfAuthorizationRequested: "operator_must_review_and_accept_real_execution_authorization_in_separate_step",
    nextIfAuthorizationRejected: "keep_real_execution_blocked_and_record_rejection_reason",
    nextIfRepairRequired: "repair_rehearsal_or_prerequisite_contracts_before_any_real_execution_attempt",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (JSON.stringify(gate.authRequestArtifacts) !== JSON.stringify(authRequestArtifacts())) {
    problems.push("authRequestArtifacts mismatch");
  }
  if (JSON.stringify(gate.authRequestVocabulary) !== JSON.stringify(authRequestVocabulary())) {
    problems.push("authRequestVocabulary mismatch");
  }
  validateAuthorizationRequestPacket(gate.authorizationRequestPacket ?? {});
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceReport.status !== "twii_final_execution_rehearsal_gate_preflight_ready_no_execution") {
    problems.push("source rehearsal gate report status mismatch");
  }
  if (sourceReport.outcome !== "final_execution_rehearsal_ready_execution_still_blocked") {
    problems.push("source rehearsal gate report outcome mismatch");
  }
  if (sourceGate.gateKind !== "twii_final_execution_rehearsal_gate_preflight") {
    problems.push("source rehearsal gate kind mismatch");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceGate[key] !== gate[key]) problems.push(`gate.${key} must match source rehearsal gate`);
  }
}

function validateAuthorizationRequestPacket(packet) {
  const expected = {
    operationKind: "future_real_final_execution_authorization_request_fail_closed_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresSourceRehearsalGate: true,
    requiresSeparateAuthorizationAcceptance: true,
    requiresSeparateRealExecutionRun: true,
    requiresServerOnlyBoundary: true,
    requiresFailClosedDefault: true,
    requiresOperatorStopConditions: true,
    requiresExecuteSwitchRequirement: true,
    requiresConfirmationPhraseRequirement: true,
    requiresPostRunReview: true,
    requiresAggregateReadback: true,
    requiresRollbackReadiness: true,
    requiresPublicCopyGuard: true,
    allowsAuthorizationAcceptance: false,
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
    if (packet[key] !== value) problems.push(`authorizationRequestPacket.${key} must be ${JSON.stringify(value)}`);
  }
}

function validatePromotionLocks(locks) {
  const expected = {
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (locks[key] !== value) problems.push(`promotionLocks.${key} must be ${JSON.stringify(value)}`);
  }
}

function validateSafety(safety) {
  const expectedFalse = [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "realExecutionAuthorizationRequestedNow",
    "realExecutionAuthorizationAcceptedNow",
    "authorizationDecisionAcceptedNow",
    "goDecisionAcceptedNow",
    "noGoDecisionRecordedNow",
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
  ];
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  if (safety.candidateArtifactReferenceOnly !== true) problems.push("safety.candidateArtifactReferenceOnly must be true");
  for (const key of expectedFalse) {
    if (safety[key] !== false) problems.push(`safety.${key} must be false`);
  }
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
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false
  };
}

function safetyState() {
  return gate.safety ?? {};
}

function authRequestArtifacts() {
  return [
    "source_rehearsal_gate",
    "authorization_request_packet",
    "server_only_boundary",
    "fail_closed_default",
    "operator_stop_conditions",
    "post_run_review",
    "aggregate_readback",
    "rollback_readiness",
    "promotion_lock",
    "public_copy_guard"
  ];
}

function authRequestVocabulary() {
  return [
    "request_real_final_execution_authorization",
    "reject_real_final_execution_authorization",
    "repair_required",
    "deferred_or_expired"
  ];
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}

function runJsonReport(filePath, label) {
  const run = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) {
    problems.push(`${label} exited ${run.status}`);
    return {};
  }
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${label} did not emit JSON: ${error.message}`);
    return {};
  }
}

function safeText(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9-]*$/i.test(value);
}
