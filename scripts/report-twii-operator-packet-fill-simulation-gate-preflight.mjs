import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-operator-packet-fill-simulation-gate-preflight.json";
const simulationFixturesPath = "data/source-gates/twii-operator-packet-fill-simulation-fixtures.json";
const sourcePacketGatePath = "data/source-gates/twii-operator-visible-decision-packet-readiness-gate-preflight.json";
const sourcePacketReportPath = "scripts/report-twii-operator-visible-decision-packet-readiness-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const simulationFixtures = readJson(simulationFixturesPath);
const sourcePacketGate = readJson(sourcePacketGatePath);
const sourcePacketReport = runJsonReport(sourcePacketReportPath, "TWII operator visible decision packet readiness gate");

validateGate();
validateSimulations();
validateUpstream();

const validSimulations = (simulationFixtures.simulations ?? []).filter((entry) => validateSimulation(entry).length === 0);
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_operator_packet_fill_simulation_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "operator_packet_fill_simulation_ready_execution_still_blocked" : "operator_packet_fill_simulation_gate_preflight_blocked",
  mode: "twii_operator_packet_fill_simulation_gate_preflight_no_execution",
  gatePath,
  simulationFixturesPath,
  sourcePacketGatePath,
  sourcePacketReportPath,
  fillSimulationGateMode: gate.fillSimulationGateMode ?? null,
  fillSimulationGateDecision: gate.fillSimulationGateDecision ?? null,
  simulationValidation: {
    simulationCount: (simulationFixtures.simulations ?? []).length,
    validSimulationCount: validSimulations.length,
    expectedStatuses: gate.allowedDecisionStatuses ?? [],
    observedStatuses: [...new Set((simulationFixtures.simulations ?? []).map((entry) => entry.decisionStatus))],
    observedSimulatedReviewStatuses: [...new Set((simulationFixtures.simulations ?? []).map((entry) => entry.simulatedReviewStatus))]
  },
  simulationState: {
    fillSimulationGatePrepared: gate.fillSimulationGatePrepared === true,
    sourcePacketGateReferenced: gate.sourcePacketGateReferenced === true,
    sourcePacketFixturesReferenced: gate.sourcePacketFixturesReferenced === true,
    fillSimulationFixturesReferenced: gate.fillSimulationFixturesReferenced === true,
    dryRunOnly: gate.dryRunOnly === true,
    placeholderOnly: gate.placeholderOnly === true,
    acceptedFillSimulationPrepared: gate.acceptedFillSimulationPrepared === true,
    rejectedFillSimulationPrepared: gate.rejectedFillSimulationPrepared === true,
    repairRequiredFillSimulationPrepared: gate.repairRequiredFillSimulationPrepared === true,
    simulationsDerivedFromOperatorPackets: gate.simulationsDerivedFromOperatorPackets === true,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    simulatedFillAcceptedAsReal: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false
  },
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  upstream: {
    sourcePacketGateStatus: sourcePacketReport.status ?? null,
    sourcePacketGateOutcome: sourcePacketReport.outcome ?? null,
    sourcePacketGateKind: sourcePacketGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_operator_packet_fill_simulation_gate_preflight",
    sourcePacketGatePath,
    fillSimulationFixturesPath: simulationFixturesPath,
    fillSimulationGateMode: "operator_packet_fill_simulation_fail_closed_no_execution",
    fillSimulationGatePrepared: true,
    sourcePacketGateReferenced: true,
    sourcePacketFixturesReferenced: true,
    fillSimulationFixturesReferenced: true,
    dryRunOnly: true,
    placeholderOnly: true,
    acceptedFillSimulationPrepared: true,
    rejectedFillSimulationPrepared: true,
    repairRequiredFillSimulationPrepared: true,
    simulationsDerivedFromOperatorPackets: true,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    simulatedFillAcceptedAsReal: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false,
    fillSimulationGateDecision: "operator_packet_fill_simulation_validates_placeholder_flow_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  validateSafety(gate.safety ?? {});
}

function validateSimulations() {
  if (simulationFixtures.simulationSetKind !== "twii_operator_packet_fill_simulation_fixtures") problems.push("simulationFixtures.simulationSetKind mismatch");
  if (simulationFixtures.simulationSetMode !== "placeholder_only_operator_fill_simulation_no_execution") problems.push("simulationFixtures.simulationSetMode mismatch");
  if (simulationFixtures.dryRunOnly !== true) problems.push("simulationFixtures.dryRunOnly must be true");
  if (simulationFixtures.placeholderOnly !== true) problems.push("simulationFixtures.placeholderOnly must be true");
  if (simulationFixtures.recordedAsReal !== false) problems.push("simulationFixtures.recordedAsReal must be false");
  if (simulationFixtures.publicDataSource !== "mock") problems.push("simulationFixtures.publicDataSource must be mock");
  if (simulationFixtures.scoreSource !== "mock") problems.push("simulationFixtures.scoreSource must be mock");
  const simulations = simulationFixtures.simulations ?? [];
  if (simulations.length !== 3) problems.push("simulationFixtures must contain exactly 3 simulations");
  for (const status of gate.allowedDecisionStatuses ?? []) if (!simulations.some((entry) => entry.decisionStatus === status)) problems.push(`simulationFixtures missing status ${status}`);
  for (const entry of simulations) for (const problem of validateSimulation(entry)) problems.push(problem);
}

function validateSimulation(entry) {
  const simulationProblems = [];
  for (const field of gate.requiredSimulationFields ?? []) if (!(field in entry)) simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} missing ${field}`);
  for (const field of gate.disallowedSimulationFields ?? []) if (field in entry) simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} contains disallowed ${field}`);
  if (!(gate.allowedDecisionStatuses ?? []).includes(entry.decisionStatus)) simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} has invalid decisionStatus`);
  if (!(gate.allowedSimulatedReviewStatuses ?? []).includes(entry.simulatedReviewStatus)) simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} invalid simulatedReviewStatus`);
  if (entry.placeholdersStillSynthetic !== true) simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} placeholdersStillSynthetic must be true`);
  if (entry.executionAllowedNow !== false) simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} executionAllowedNow must be false`);
  if (entry.recordedAsReal !== false) simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} recordedAsReal must be false`);
  if (entry.publicDataSource !== "mock") simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} publicDataSource must be mock`);
  if (entry.scoreSource !== "mock") simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} scoreSource must be mock`);
  for (const placeholder of gate.requiredSyntheticPlaceholders ?? []) if (!Object.values(entry).includes(placeholder)) simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} missing placeholder ${placeholder}`);
  if (entry.decisionStatus === "repair_required" && entry.simulatedRepairSummary !== "__SIMULATED_REAL_REPAIR_REQUIRED_SUMMARY__") simulationProblems.push("repair_required simulation must include synthetic repair placeholder");
  if (entry.decisionStatus !== "repair_required" && entry.simulatedRepairSummary !== "") simulationProblems.push(`simulation ${entry.simulationId ?? "unknown"} simulatedRepairSummary must be empty`);
  return simulationProblems;
}

function validateUpstream() {
  if (sourcePacketReport.status !== "twii_operator_visible_decision_packet_readiness_gate_preflight_ready_no_execution") problems.push("source packet gate status mismatch");
  if (sourcePacketReport.outcome !== "operator_visible_decision_packet_readiness_ready_execution_still_blocked") problems.push("source packet gate outcome mismatch");
  if (sourcePacketGate.gateKind !== "twii_operator_visible_decision_packet_readiness_gate_preflight") problems.push("source packet gate kind mismatch");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "simulatedFillAcceptedAsReal", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
