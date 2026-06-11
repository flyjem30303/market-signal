import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-final-execution-rehearsal-gate-preflight.json";
const sourceGoNoGoGatePath = "data/source-gates/twii-final-execution-run-authorization-go-no-go-gate-preflight.json";
const sourceGoNoGoGateReportPath = "scripts/report-twii-final-execution-run-authorization-go-no-go-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceGate = readJson(sourceGoNoGoGatePath);
const sourceReport = runJsonReport(sourceGoNoGoGateReportPath, "TWII final go/no-go gate");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_final_execution_rehearsal_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "final_execution_rehearsal_ready_execution_still_blocked" : "final_execution_rehearsal_gate_preflight_blocked",
  mode: "twii_final_execution_rehearsal_gate_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceGoNoGoGatePath,
  sourceGoNoGoGateReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  rehearsalDecision: gate.rehearsalDecision ?? null,
  rehearsalMode: gate.rehearsalMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  rehearsalState: {
    rehearsalPrepared: gate.rehearsalPrepared === true,
    sourceGoNoGoGateReferenced: gate.sourceGoNoGoGateReferenced === true,
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
  rehearsalArtifacts: gate.rehearsalArtifacts ?? [],
  rehearsalPacket: gate.rehearsalPacket ?? null,
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  authorizationValuesState: {
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
  currentRoute: "final_execution_rehearsal_ready_but_execution_still_blocked",
  nextIfRehearsalAccepted: gate.nextIfRehearsalAccepted ?? null,
  nextIfRehearsalBlocked: gate.nextIfRehearsalBlocked ?? null,
  upstream: {
    sourceGoNoGoGateStatus: sourceReport.status ?? null,
    sourceGoNoGoGateOutcome: sourceReport.outcome ?? null,
    sourceGoNoGoGateKind: sourceGate.gateKind ?? null
  },
  safety: safetyState(),
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_final_execution_rehearsal_gate_preflight",
    sourceGoNoGoGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    rehearsalMode: "final_execution_rehearsal_fail_closed_no_execution",
    rehearsalPrepared: true,
    sourceGoNoGoGateReferenced: true,
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
    rehearsalDecision: "final_execution_rehearsal_ready_but_execution_still_blocked",
    nextIfRehearsalAccepted: "operator_may_request_real_final_execution_run_authorization_in_separate_step",
    nextIfRehearsalBlocked: "repair_pre_execution_contracts_before_any_real_execution_attempt",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (JSON.stringify(gate.rehearsalArtifacts) !== JSON.stringify(rehearsalArtifacts())) {
    problems.push("rehearsalArtifacts mismatch");
  }
  validateRehearsalPacket(gate.rehearsalPacket ?? {});
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceReport.status !== "twii_final_execution_run_authorization_go_no_go_gate_preflight_ready_no_execution") {
    problems.push("source go/no-go gate report status mismatch");
  }
  if (sourceReport.outcome !== "final_execution_run_go_no_go_gate_ready_execution_still_blocked") {
    problems.push("source go/no-go gate report outcome mismatch");
  }
  if (sourceGate.gateKind !== "twii_final_execution_run_authorization_go_no_go_gate_preflight") {
    problems.push("source go/no-go gate kind mismatch");
  }
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) {
    if (sourceGate[key] !== gate[key]) problems.push(`gate.${key} must match source go/no-go gate`);
  }
}

function validateRehearsalPacket(packet) {
  const expected = {
    operationKind: "future_final_execution_rehearsal_fail_closed_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    requiresSourceGoNoGoGate: true,
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
    if (packet[key] !== value) problems.push(`rehearsalPacket.${key} must be ${JSON.stringify(value)}`);
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

function rehearsalArtifacts() {
  return [
    "source_go_no_go_gate",
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
