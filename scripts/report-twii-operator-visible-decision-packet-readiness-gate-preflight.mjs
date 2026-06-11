import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-operator-visible-decision-packet-readiness-gate-preflight.json";
const packetFixturesPath = "data/source-gates/twii-operator-visible-decision-packet-readiness-fixtures.json";
const sourceRecorderGatePath = "data/source-gates/twii-decision-intake-recorder-mock-gate-preflight.json";
const sourceRecorderReportPath = "scripts/report-twii-decision-intake-recorder-mock-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const packetFixtures = readJson(packetFixturesPath);
const sourceRecorderGate = readJson(sourceRecorderGatePath);
const sourceRecorderReport = runJsonReport(sourceRecorderReportPath, "TWII decision intake recorder mock gate");

validateGate();
validatePackets();
validateUpstream();

const validPackets = (packetFixtures.packets ?? []).filter((entry) => validatePacket(entry).length === 0);
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_operator_visible_decision_packet_readiness_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "operator_visible_decision_packet_readiness_ready_execution_still_blocked" : "operator_visible_decision_packet_readiness_gate_preflight_blocked",
  mode: "twii_operator_visible_decision_packet_readiness_gate_preflight_no_execution",
  gatePath,
  packetFixturesPath,
  sourceRecorderGatePath,
  sourceRecorderReportPath,
  packetGateMode: gate.packetGateMode ?? null,
  packetGateDecision: gate.packetGateDecision ?? null,
  packetValidation: {
    packetCount: (packetFixtures.packets ?? []).length,
    validPacketCount: validPackets.length,
    expectedStatuses: gate.allowedDecisionStatuses ?? [],
    observedStatuses: [...new Set((packetFixtures.packets ?? []).map((entry) => entry.decisionStatus))],
    observedReviewStatuses: [...new Set((packetFixtures.packets ?? []).map((entry) => entry.operatorReviewStatus))]
  },
  packetState: {
    packetGatePrepared: gate.packetGatePrepared === true,
    sourceRecorderGateReferenced: gate.sourceRecorderGateReferenced === true,
    sourceMockRecordsReferenced: gate.sourceMockRecordsReferenced === true,
    operatorPacketFixturesReferenced: gate.operatorPacketFixturesReferenced === true,
    dryRunOnly: gate.dryRunOnly === true,
    operatorPacketOnly: gate.operatorPacketOnly === true,
    acceptedPacketPrepared: gate.acceptedPacketPrepared === true,
    rejectedPacketPrepared: gate.rejectedPacketPrepared === true,
    repairRequiredPacketPrepared: gate.repairRequiredPacketPrepared === true,
    packetsDerivedFromMockRecords: gate.packetsDerivedFromMockRecords === true,
    operatorReviewStatusDefault: gate.operatorReviewStatusDefault ?? null,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    operatorPacketAcceptedAsReal: false,
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
    sourceRecorderGateStatus: sourceRecorderReport.status ?? null,
    sourceRecorderGateOutcome: sourceRecorderReport.outcome ?? null,
    sourceRecorderGateKind: sourceRecorderGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_operator_visible_decision_packet_readiness_gate_preflight",
    sourceRecorderGatePath,
    operatorPacketFixturesPath: packetFixturesPath,
    packetGateMode: "operator_visible_decision_packet_readiness_fail_closed_no_execution",
    packetGatePrepared: true,
    sourceRecorderGateReferenced: true,
    sourceMockRecordsReferenced: true,
    operatorPacketFixturesReferenced: true,
    dryRunOnly: true,
    operatorPacketOnly: true,
    acceptedPacketPrepared: true,
    rejectedPacketPrepared: true,
    repairRequiredPacketPrepared: true,
    packetsDerivedFromMockRecords: true,
    operatorReviewStatusDefault: "pending_operator_review",
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    operatorPacketAcceptedAsReal: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false,
    packetGateDecision: "operator_visible_decision_packet_readiness_validates_packets_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  validateSafety(gate.safety ?? {});
}

function validatePackets() {
  if (packetFixtures.packetSetKind !== "twii_operator_visible_decision_packet_readiness_fixtures") problems.push("packetFixtures.packetSetKind mismatch");
  if (packetFixtures.packetSetMode !== "mock_record_derived_operator_visible_packet_readiness_only_no_execution") problems.push("packetFixtures.packetSetMode mismatch");
  if (packetFixtures.dryRunOnly !== true) problems.push("packetFixtures.dryRunOnly must be true");
  if (packetFixtures.operatorPacketOnly !== true) problems.push("packetFixtures.operatorPacketOnly must be true");
  if (packetFixtures.recordedAsReal !== false) problems.push("packetFixtures.recordedAsReal must be false");
  if (packetFixtures.publicDataSource !== "mock") problems.push("packetFixtures.publicDataSource must be mock");
  if (packetFixtures.scoreSource !== "mock") problems.push("packetFixtures.scoreSource must be mock");
  const packets = packetFixtures.packets ?? [];
  if (packets.length !== 3) problems.push("packetFixtures must contain exactly 3 packets");
  for (const status of gate.allowedDecisionStatuses ?? []) if (!packets.some((entry) => entry.decisionStatus === status)) problems.push(`packetFixtures missing status ${status}`);
  for (const entry of packets) for (const problem of validatePacket(entry)) problems.push(problem);
}

function validatePacket(entry) {
  const packetProblems = [];
  for (const field of gate.requiredPacketFields ?? []) if (!(field in entry)) packetProblems.push(`packet ${entry.packetId ?? "unknown"} missing ${field}`);
  for (const field of gate.disallowedPacketFields ?? []) if (field in entry) packetProblems.push(`packet ${entry.packetId ?? "unknown"} contains disallowed ${field}`);
  if (!(gate.allowedDecisionStatuses ?? []).includes(entry.decisionStatus)) packetProblems.push(`packet ${entry.packetId ?? "unknown"} has invalid decisionStatus`);
  if (!(gate.allowedOperatorReviewStatuses ?? []).includes(entry.operatorReviewStatus)) packetProblems.push(`packet ${entry.packetId ?? "unknown"} invalid operatorReviewStatus`);
  if (entry.operatorReviewStatus !== "pending_operator_review") packetProblems.push(`packet ${entry.packetId ?? "unknown"} operatorReviewStatus must default pending`);
  if (entry.auditRole !== "CEO_DRY_RUN_FIXTURE") packetProblems.push(`packet ${entry.packetId ?? "unknown"} auditRole must be CEO_DRY_RUN_FIXTURE`);
  if (entry.auditTimestampLabel !== "DRY_RUN_TIMESTAMP_PLACEHOLDER") packetProblems.push(`packet ${entry.packetId ?? "unknown"} timestamp label must stay placeholder`);
  if (entry.executionAllowedNow !== false) packetProblems.push(`packet ${entry.packetId ?? "unknown"} executionAllowedNow must be false`);
  if (entry.recordedAsReal !== false) packetProblems.push(`packet ${entry.packetId ?? "unknown"} recordedAsReal must be false`);
  if (entry.publicDataSource !== "mock") packetProblems.push(`packet ${entry.packetId ?? "unknown"} publicDataSource must be mock`);
  if (entry.scoreSource !== "mock") packetProblems.push(`packet ${entry.packetId ?? "unknown"} scoreSource must be mock`);
  for (const placeholder of gate.requiredMissingValuePlaceholders ?? []) if (!(entry.missingValuePlaceholders ?? []).includes(placeholder)) packetProblems.push(`packet ${entry.packetId ?? "unknown"} missing placeholder ${placeholder}`);
  if (entry.decisionStatus === "repair_required" && !(entry.missingValuePlaceholders ?? []).includes("__REAL_REPAIR_REQUIRED_SUMMARY__")) packetProblems.push("repair_required packet must include repair summary placeholder");
  return packetProblems;
}

function validateUpstream() {
  if (sourceRecorderReport.status !== "twii_decision_intake_recorder_mock_gate_preflight_ready_no_execution") problems.push("source recorder gate status mismatch");
  if (sourceRecorderReport.outcome !== "decision_intake_recorder_mock_ready_execution_still_blocked") problems.push("source recorder gate outcome mismatch");
  if (sourceRecorderGate.gateKind !== "twii_decision_intake_recorder_mock_gate_preflight") problems.push("source recorder gate kind mismatch");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "operatorPacketAcceptedAsReal", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
