import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-real-operator-packet-intake-blocker-gate-preflight.json";
const requirementsPath = "data/source-gates/twii-real-operator-packet-intake-blocker-requirements.json";
const sourceFillSimulationGatePath = "data/source-gates/twii-operator-packet-fill-simulation-gate-preflight.json";
const sourceFillSimulationReportPath = "scripts/report-twii-operator-packet-fill-simulation-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const requirements = readJson(requirementsPath);
const sourceGate = readJson(sourceFillSimulationGatePath);
const sourceReport = runJsonReport(sourceFillSimulationReportPath, "TWII operator packet fill simulation gate");

validateGate();
validateRequirements();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_real_operator_packet_intake_blocker_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "real_operator_packet_intake_blocker_ready_execution_still_blocked" : "real_operator_packet_intake_blocker_gate_preflight_blocked",
  mode: "twii_real_operator_packet_intake_blocker_gate_preflight_no_execution",
  gatePath,
  requirementsPath,
  sourceFillSimulationGatePath,
  sourceFillSimulationReportPath,
  blockerGateMode: gate.blockerGateMode ?? null,
  blockerGateDecision: gate.blockerGateDecision ?? null,
  blockerValidation: {
    requiredRealIntakeFieldCount: (gate.requiredRealIntakeFields ?? []).length,
    blockerStatusCount: (gate.blockerStatuses ?? []).length,
    currentBlockerCount: (gate.currentBlockers ?? []).length,
    realValuesProvidedNow: gate.realValuesProvidedNow === true
  },
  blockerState: {
    blockerGatePrepared: gate.blockerGatePrepared === true,
    sourceFillSimulationGateReferenced: gate.sourceFillSimulationGateReferenced === true,
    sourceFillSimulationFixturesReferenced: gate.sourceFillSimulationFixturesReferenced === true,
    blockerRequirementsReferenced: gate.blockerRequirementsReferenced === true,
    blockerOnly: gate.blockerOnly === true,
    realValuesRequiredForFutureIntake: gate.realValuesRequiredForFutureIntake === true,
    realValuesProvidedNow: false,
    missingRealValuesBlockerPrepared: gate.missingRealValuesBlockerPrepared === true,
    pendingOperatorReviewBlockerPrepared: gate.pendingOperatorReviewBlockerPrepared === true,
    repairRequiredBlockerPrepared: gate.repairRequiredBlockerPrepared === true,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    realOperatorPacketAcceptedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false
  },
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  upstream: {
    sourceFillSimulationGateStatus: sourceReport.status ?? null,
    sourceFillSimulationGateOutcome: sourceReport.outcome ?? null,
    sourceFillSimulationGateKind: sourceGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_real_operator_packet_intake_blocker_gate_preflight",
    sourceFillSimulationGatePath,
    blockerRequirementsPath: requirementsPath,
    blockerGateMode: "real_operator_packet_intake_blocker_fail_closed_no_execution",
    blockerGatePrepared: true,
    sourceFillSimulationGateReferenced: true,
    sourceFillSimulationFixturesReferenced: true,
    blockerRequirementsReferenced: true,
    blockerOnly: true,
    realValuesRequiredForFutureIntake: true,
    realValuesProvidedNow: false,
    missingRealValuesBlockerPrepared: true,
    pendingOperatorReviewBlockerPrepared: true,
    repairRequiredBlockerPrepared: true,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    realOperatorPacketAcceptedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false,
    blockerGateDecision: "real_operator_packet_intake_blocker_defines_required_values_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  validateSafety(gate.safety ?? {});
}

function validateRequirements() {
  if (requirements.requirementSetKind !== "twii_real_operator_packet_intake_blocker_requirements") problems.push("requirements.requirementSetKind mismatch");
  if (requirements.requirementSetMode !== "real_intake_required_values_blocker_only_no_execution") problems.push("requirements.requirementSetMode mismatch");
  if (requirements.blockerOnly !== true) problems.push("requirements.blockerOnly must be true");
  if (requirements.realValuesProvidedNow !== false) problems.push("requirements.realValuesProvidedNow must be false");
  if (requirements.publicDataSource !== "mock") problems.push("requirements.publicDataSource must be mock");
  if (requirements.scoreSource !== "mock") problems.push("requirements.scoreSource must be mock");
  for (const field of gate.requiredRealIntakeFields ?? []) if (!(requirements.requiredRealIntakeFields ?? []).includes(field)) problems.push(`requirements missing real intake field ${field}`);
  for (const status of gate.blockerStatuses ?? []) if (!(requirements.blockerStatuses ?? []).includes(status)) problems.push(`requirements missing blocker status ${status}`);
  for (const status of ["blocked_missing_real_values", "blocked_pending_operator_review"]) if (!(requirements.currentBlockers ?? []).includes(status)) problems.push(`requirements currentBlockers missing ${status}`);
  for (const placeholder of ["__REAL_DECISION_STATUS__", "__REAL_DECISION_RECORDED_BY__", "__REAL_DECISION_RECORDED_AT__", "__REAL_DECISION_REASON_SUMMARY__"]) if (!(requirements.missingRealValuePlaceholders ?? []).includes(placeholder)) problems.push(`requirements missing placeholder ${placeholder}`);
}

function validateUpstream() {
  if (sourceReport.status !== "twii_operator_packet_fill_simulation_gate_preflight_ready_no_execution") problems.push("source fill simulation status mismatch");
  if (sourceReport.outcome !== "operator_packet_fill_simulation_ready_execution_still_blocked") problems.push("source fill simulation outcome mismatch");
  if (sourceGate.gateKind !== "twii_operator_packet_fill_simulation_gate_preflight") problems.push("source fill simulation kind mismatch");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "realOperatorPacketAcceptedNow", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
