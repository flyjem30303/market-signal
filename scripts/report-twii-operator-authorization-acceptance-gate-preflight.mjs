import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-operator-authorization-acceptance-gate-preflight.json";
const sourceAuthRequestPacketPath = "data/source-gates/twii-real-final-execution-auth-request-packet-preflight.json";
const sourceAuthRequestPacketReportPath = "scripts/report-twii-real-final-execution-auth-request-packet-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceGate = readJson(sourceAuthRequestPacketPath);
const sourceReport = runJsonReport(sourceAuthRequestPacketReportPath, "TWII real final execution auth request packet");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const falseState = {
  acceptedDecisionRecordedNow: false,
  rejectedDecisionRecordedNow: false,
  repairRequiredDecisionRecordedNow: false,
  realExecutionAuthorizationRequestedNow: false,
  realExecutionAuthorizationAcceptedNow: false,
  authorizationDecisionAcceptedNow: false,
  goDecisionAcceptedNow: false,
  noGoDecisionRecordedNow: false,
  exactRuntimeExecutionCommandPrepared: false,
  exactCommandAcceptedNow: false,
  finalExecutionRunPrepared: false,
  runnerExecutableNow: false,
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  finalExecutionAllowedNow: false,
  implementationAllowedNow: false
};

const report = {
  status: ok ? "twii_operator_authorization_acceptance_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "operator_authorization_acceptance_gate_ready_execution_still_blocked" : "operator_authorization_acceptance_gate_preflight_blocked",
  mode: "twii_operator_authorization_acceptance_gate_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceAuthRequestPacketPath,
  sourceAuthRequestPacketReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  acceptanceGateDecision: gate.acceptanceGateDecision ?? null,
  acceptanceGateMode: gate.acceptanceGateMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  acceptanceState: {
    acceptanceGatePrepared: gate.acceptanceGatePrepared === true,
    sourceAuthRequestPacketReferenced: gate.sourceAuthRequestPacketReferenced === true,
    decisionRecordPrepared: gate.decisionRecordPrepared === true,
    serverOnlyBoundaryReferenced: gate.serverOnlyBoundaryReferenced === true,
    failClosedDefaultReferenced: gate.failClosedDefaultReferenced === true,
    operatorStopConditionsPrepared: gate.operatorStopConditionsPrepared === true,
    postRunReviewRequirementReferenced: gate.postRunReviewRequirementReferenced === true,
    aggregateReadbackRequirementReferenced: gate.aggregateReadbackRequirementReferenced === true,
    rollbackRequirementReferenced: gate.rollbackRequirementReferenced === true,
    executeSwitchRequirementReferenced: gate.executeSwitchRequirementReferenced === true,
    confirmationPhraseRequirementReferenced: gate.confirmationPhraseRequirementReferenced === true,
    ...falseState
  },
  requirementNames: {
    requiredExecuteSwitchName: gate.requiredExecuteSwitchName ?? null,
    requiredConfirmationPhraseName: gate.requiredConfirmationPhraseName ?? null,
    requiredConfirmationPhraseReference: gate.requiredConfirmationPhraseReference ?? null,
    valuesOutput: false
  },
  acceptanceDecisionVocabulary: gate.acceptanceDecisionVocabulary ?? [],
  acceptanceGateArtifacts: gate.acceptanceGateArtifacts ?? [],
  acceptanceDecisionRecord: gate.acceptanceDecisionRecord ?? null,
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  authorizationValuesState: {
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
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
  currentRoute: "operator_authorization_acceptance_gate_ready_but_no_decision_recorded",
  nextIfAcceptedRecorded: gate.nextIfAcceptedRecorded ?? null,
  nextIfRejectedRecorded: gate.nextIfRejectedRecorded ?? null,
  nextIfRepairRequiredRecorded: gate.nextIfRepairRequiredRecorded ?? null,
  upstream: {
    sourceAuthRequestPacketStatus: sourceReport.status ?? null,
    sourceAuthRequestPacketOutcome: sourceReport.outcome ?? null,
    sourceAuthRequestPacketKind: sourceGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_operator_authorization_acceptance_gate_preflight",
    sourceAuthRequestPacketPath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    acceptanceGateMode: "operator_authorization_acceptance_gate_fail_closed_no_execution",
    acceptanceGatePrepared: true,
    sourceAuthRequestPacketReferenced: true,
    decisionRecordPrepared: true,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
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
    acceptanceGateDecision: "operator_authorization_acceptance_gate_ready_but_no_decision_recorded",
    nextIfAcceptedRecorded: "operator_may_prepare_real_execution_run_in_separate_step",
    nextIfRejectedRecorded: "keep_real_execution_blocked_and_record_rejection_reason",
    nextIfRepairRequiredRecorded: "repair_authorization_or_rehearsal_contracts_before_any_real_execution_attempt",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (JSON.stringify(gate.acceptanceDecisionVocabulary) !== JSON.stringify(["accepted", "rejected", "repair_required", "deferred_or_expired"])) {
    problems.push("acceptanceDecisionVocabulary mismatch");
  }
  if (JSON.stringify(gate.acceptanceGateArtifacts) !== JSON.stringify(["source_auth_request_packet", "decision_record", "server_only_boundary", "fail_closed_default", "operator_stop_conditions", "post_run_review", "aggregate_readback", "rollback_readiness", "promotion_lock", "public_copy_guard"])) {
    problems.push("acceptanceGateArtifacts mismatch");
  }
  validateDecisionRecord(gate.acceptanceDecisionRecord ?? {});
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceReport.status !== "twii_real_final_execution_auth_request_packet_preflight_ready_no_execution") problems.push("source auth request packet status mismatch");
  if (sourceReport.outcome !== "real_final_execution_authorization_request_packet_ready_execution_still_blocked") problems.push("source auth request packet outcome mismatch");
  if (sourceGate.gateKind !== "twii_real_final_execution_auth_request_packet_preflight") problems.push("source auth request packet kind mismatch");
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceGate[key] !== gate[key]) problems.push(`gate.${key} must match source auth request packet`);
  }
}

function validateDecisionRecord(record) {
  const expected = {
    operationKind: "future_operator_authorization_acceptance_decision_fail_closed_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresSourceAuthRequestPacket: true,
    requiresSeparateDecisionValueEntry: true,
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
    allowsDecisionValueRead: false,
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
    if (record[key] !== value) problems.push(`acceptanceDecisionRecord.${key} must be ${JSON.stringify(value)}`);
  }
}

function validatePromotionLocks(locks) {
  if (locks.promotionAllowed !== false) problems.push("promotionLocks.promotionAllowed must be false");
  if (locks.rowCoverageScoringAllowed !== false) problems.push("promotionLocks.rowCoverageScoringAllowed must be false");
  if (locks.publicDataSource !== "mock") problems.push("promotionLocks.publicDataSource must be mock");
  if (locks.scoreSource !== "mock") problems.push("promotionLocks.scoreSource must be mock");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  if (safety.candidateArtifactReferenceOnly !== true) problems.push("safety.candidateArtifactReferenceOnly must be true");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "realExecutionAuthorizationRequestedNow", "realExecutionAuthorizationAcceptedNow", "authorizationDecisionAcceptedNow", "goDecisionAcceptedNow", "noGoDecisionRecordedNow", "exactCommandAcceptedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) {
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

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}

function runJsonReport(filePath, label) {
  const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
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
