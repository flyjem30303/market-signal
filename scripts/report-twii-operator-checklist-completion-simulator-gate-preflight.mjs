import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-operator-checklist-completion-simulator-gate-preflight.json";
const simulationPath = "data/source-gates/twii-operator-checklist-completion-simulation.json";
const sourceChecklistGatePath = "data/source-gates/twii-real-operator-intake-checklist-packet-gate-preflight.json";
const sourceChecklistPacketPath = "data/source-gates/twii-real-operator-intake-checklist-packet.json";
const sourceChecklistReportPath = "scripts/report-twii-real-operator-intake-checklist-packet-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const simulation = readJson(simulationPath);
const sourceChecklistGate = readJson(sourceChecklistGatePath);
const sourceChecklist = readJson(sourceChecklistPacketPath);
const sourceReport = runJsonReport(sourceChecklistReportPath, "TWII real operator intake checklist packet gate");

validateGate();
validateSimulation();
validateUpstream();

const simulatedItems = simulation.items ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_operator_checklist_completion_simulator_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "operator_checklist_completion_simulator_ready_execution_still_blocked" : "operator_checklist_completion_simulator_gate_preflight_blocked",
  mode: "twii_operator_checklist_completion_simulator_gate_preflight_no_execution",
  gatePath,
  simulationPath,
  sourceChecklistGatePath,
  sourceChecklistPacketPath,
  sourceChecklistReportPath,
  checklistCompletionSimulatorMode: gate.checklistCompletionSimulatorMode ?? null,
  checklistCompletionSimulatorDecision: gate.checklistCompletionSimulatorDecision ?? null,
  completionValidation: {
    itemCount: simulatedItems.length,
    simulatedCompleteCount: simulatedItems.filter((item) => item.simulatedProvidedNow === true).length,
    realValueProvidedCount: simulatedItems.filter((item) => item.realValueProvidedNow === true).length,
    completionCriteriaCount: (simulation.completionCriteriaSimulated ?? []).length,
    simulatedChecklistStatusFrom: simulation.simulatedChecklistStatusFrom ?? null,
    simulatedChecklistStatusTo: simulation.simulatedChecklistStatusTo ?? null
  },
  completionState: {
    completionSimulatorGatePrepared: gate.completionSimulatorGatePrepared === true,
    sourceChecklistGateReferenced: gate.sourceChecklistGateReferenced === true,
    sourceChecklistPacketReferenced: gate.sourceChecklistPacketReferenced === true,
    completionSimulationReferenced: gate.completionSimulationReferenced === true,
    completionSimulatorOnly: gate.completionSimulatorOnly === true,
    mockCompletionOnly: gate.mockCompletionOnly === true,
    completionCriteriaSimulationPrepared: gate.completionCriteriaSimulationPrepared === true,
    statusTransitionSimulationPrepared: gate.statusTransitionSimulationPrepared === true,
    simulatedAllItemsComplete: gate.simulatedAllItemsComplete === true,
    realValuesProvidedNow: false,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    simulatedCompletionAcceptedAsReal: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false
  },
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  upstream: {
    sourceChecklistGateStatus: sourceReport.status ?? null,
    sourceChecklistGateOutcome: sourceReport.outcome ?? null,
    sourceChecklistGateKind: sourceChecklistGate.gateKind ?? null,
    sourceChecklistKind: sourceChecklist.checklistKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_operator_checklist_completion_simulator_gate_preflight",
    sourceChecklistGatePath,
    sourceChecklistPacketPath,
    completionSimulationPath: simulationPath,
    checklistCompletionSimulatorMode: "operator_checklist_completion_simulator_fail_closed_no_execution",
    completionSimulatorGatePrepared: true,
    sourceChecklistGateReferenced: true,
    sourceChecklistPacketReferenced: true,
    completionSimulationReferenced: true,
    completionSimulatorOnly: true,
    mockCompletionOnly: true,
    completionCriteriaSimulationPrepared: true,
    statusTransitionSimulationPrepared: true,
    simulatedAllItemsComplete: true,
    realValuesProvidedNow: false,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    simulatedCompletionAcceptedAsReal: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false,
    simulatedChecklistStatusFrom: "blocked_missing_real_values",
    simulatedChecklistStatusTo: "simulated_complete_for_future_review_only",
    checklistCompletionSimulatorDecision: "operator_checklist_completion_simulator_validates_mock_completion_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  validateSafety(gate.safety ?? {});
}

function validateSimulation() {
  const expected = {
    simulationKind: "twii_operator_checklist_completion_simulation",
    simulationMode: "mock_checklist_completion_simulation_only_no_execution",
    sourceChecklistGatePath,
    sourceChecklistPacketPath,
    completionSimulatorOnly: true,
    mockCompletionOnly: true,
    realValuesProvidedNow: false,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    executionAllowedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    simulatedChecklistStatusFrom: "blocked_missing_real_values",
    simulatedChecklistStatusTo: "simulated_complete_for_future_review_only"
  };
  for (const [key, value] of Object.entries(expected)) if (simulation[key] !== value) problems.push(`simulation.${key} must be ${JSON.stringify(value)}`);
  if ((simulation.items ?? []).length < 6) problems.push("simulation must include at least 6 items");
  for (const criterion of gate.requiredCompletionCriteria ?? []) if (!(simulation.completionCriteriaSimulated ?? []).includes(criterion)) problems.push(`simulation missing completion criterion ${criterion}`);
  for (const item of simulation.items ?? []) {
    for (const field of gate.requiredSimulationItemFields ?? []) if (!(field in item)) problems.push(`simulation item ${item.itemId ?? "unknown"} missing ${field}`);
    if (item.simulatedProvidedNow !== true) problems.push(`simulation item ${item.itemId ?? "unknown"} simulatedProvidedNow must be true`);
    if (item.realValueProvidedNow !== false) problems.push(`simulation item ${item.itemId ?? "unknown"} realValueProvidedNow must be false`);
    if (item.simulatedValueKind !== "synthetic_placeholder_only") problems.push(`simulation item ${item.itemId ?? "unknown"} simulatedValueKind mismatch`);
  }
}

function validateUpstream() {
  if (sourceReport.status !== "twii_real_operator_intake_checklist_packet_gate_preflight_ready_no_execution") problems.push("source checklist gate status mismatch");
  if (sourceReport.outcome !== "real_operator_intake_checklist_packet_ready_execution_still_blocked") problems.push("source checklist gate outcome mismatch");
  if (sourceChecklistGate.gateKind !== "twii_real_operator_intake_checklist_packet_gate_preflight") problems.push("source checklist gate kind mismatch");
  if (sourceChecklist.checklistKind !== "twii_real_operator_intake_checklist_packet") problems.push("source checklist kind mismatch");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "simulatedCompletionAcceptedAsReal", "realValuesProvidedNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
