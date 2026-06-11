import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-accepted-decision-record-intake-gate-preflight.json";
const sourceAcceptanceGatePath = "data/source-gates/twii-operator-authorization-acceptance-gate-preflight.json";
const sourceAcceptanceGateReportPath = "scripts/report-twii-operator-authorization-acceptance-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const sourceGate = readJson(sourceAcceptanceGatePath);
const sourceReport = runJsonReport(sourceAcceptanceGateReportPath, "TWII operator authorization acceptance gate");
const candidateArtifactExists = fs.existsSync(gate.candidateArtifactPath);

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_accepted_decision_record_intake_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "accepted_decision_record_intake_gate_ready_execution_still_blocked" : "accepted_decision_record_intake_gate_preflight_blocked",
  mode: "twii_accepted_decision_record_intake_gate_preflight_no_execution",
  owner: "CEO/PM",
  gatePath,
  sourceAcceptanceGatePath,
  sourceAcceptanceGateReportPath,
  candidateArtifactPath: gate.candidateArtifactPath ?? null,
  candidateArtifactExists,
  intakeGateDecision: gate.intakeGateDecision ?? null,
  intakeGateMode: gate.intakeGateMode ?? null,
  attemptId: gate.attemptId ?? null,
  target: {
    targetTable: gate.targetTable ?? null,
    targetLane: gate.targetLane ?? null,
    targetScope: gate.targetScope ?? null,
    maxRows: gate.maxRows ?? null
  },
  intakeState: {
    intakeGatePrepared: gate.intakeGatePrepared === true,
    sourceAcceptanceGateReferenced: gate.sourceAcceptanceGateReferenced === true,
    decisionIntakeSchemaPrepared: gate.decisionIntakeSchemaPrepared === true,
    serverOnlyBoundaryReferenced: gate.serverOnlyBoundaryReferenced === true,
    failClosedDefaultReferenced: gate.failClosedDefaultReferenced === true,
    operatorStopConditionsPrepared: gate.operatorStopConditionsPrepared === true,
    postRunReviewRequirementReferenced: gate.postRunReviewRequirementReferenced === true,
    aggregateReadbackRequirementReferenced: gate.aggregateReadbackRequirementReferenced === true,
    rollbackRequirementReferenced: gate.rollbackRequirementReferenced === true,
    executeSwitchRequirementReferenced: gate.executeSwitchRequirementReferenced === true,
    confirmationPhraseRequirementReferenced: gate.confirmationPhraseRequirementReferenced === true,
    decisionValueReadNow: false,
    decisionValueRecordedNow: false,
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
  },
  decisionIntakeVocabulary: gate.decisionIntakeVocabulary ?? [],
  decisionIntakeAllowedFields: gate.decisionIntakeAllowedFields ?? [],
  decisionIntakeDisallowedFields: gate.decisionIntakeDisallowedFields ?? [],
  intakeGateArtifacts: gate.intakeGateArtifacts ?? [],
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  authorizationValuesState: {
    decisionValueReadNow: false,
    decisionValueRecordedNow: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    envValueOutput: false
  },
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  currentRoute: "accepted_decision_record_intake_ready_but_no_decision_value_read_or_recorded",
  nextIfAcceptedValueRecorded: gate.nextIfAcceptedValueRecorded ?? null,
  nextIfRejectedValueRecorded: gate.nextIfRejectedValueRecorded ?? null,
  nextIfRepairRequiredValueRecorded: gate.nextIfRepairRequiredValueRecorded ?? null,
  upstream: {
    sourceAcceptanceGateStatus: sourceReport.status ?? null,
    sourceAcceptanceGateOutcome: sourceReport.outcome ?? null,
    sourceAcceptanceGateKind: sourceGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_accepted_decision_record_intake_gate_preflight",
    sourceAcceptanceGatePath,
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    intakeGateMode: "accepted_decision_record_intake_gate_fail_closed_no_execution",
    intakeGatePrepared: true,
    sourceAcceptanceGateReferenced: true,
    decisionIntakeSchemaPrepared: true,
    decisionValueReadNow: false,
    decisionValueRecordedNow: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    realExecutionAuthorizationAcceptedNow: false,
    exactRuntimeExecutionCommandPrepared: false,
    exactCommandAcceptedNow: false,
    finalExecutionRunPrepared: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    intakeGateDecision: "accepted_decision_record_intake_ready_but_no_decision_value_read_or_recorded"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  if (!safeText(gate.gateId)) problems.push("gate.gateId is required");
  if (JSON.stringify(gate.decisionIntakeVocabulary) !== JSON.stringify(["accepted", "rejected", "repair_required", "deferred_or_expired"])) problems.push("decisionIntakeVocabulary mismatch");
  validatePromotionLocks(gate.promotionLocks ?? {});
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceReport.status !== "twii_operator_authorization_acceptance_gate_preflight_ready_no_execution") problems.push("source acceptance gate status mismatch");
  if (sourceReport.outcome !== "operator_authorization_acceptance_gate_ready_execution_still_blocked") problems.push("source acceptance gate outcome mismatch");
  if (sourceGate.gateKind !== "twii_operator_authorization_acceptance_gate_preflight") problems.push("source acceptance gate kind mismatch");
  for (const key of ["attemptId", "targetTable", "targetLane", "targetScope", "maxRows"]) if (sourceGate[key] !== gate[key]) problems.push(`gate.${key} must match source acceptance gate`);
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
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "decisionValueReadNow", "decisionValueRecordedNow", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "realExecutionAuthorizationAcceptedNow", "authorizationDecisionAcceptedNow", "goDecisionAcceptedNow", "noGoDecisionRecordedNow", "exactCommandAcceptedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; }
}
function runJsonReport(filePath, label) {
  const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
  if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; }
  try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; }
}
function safeText(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9-]*$/i.test(value);
}
