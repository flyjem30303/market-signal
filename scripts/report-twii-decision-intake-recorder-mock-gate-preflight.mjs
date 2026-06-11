import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-decision-intake-recorder-mock-gate-preflight.json";
const mockRecordsPath = "data/source-gates/twii-decision-intake-recorder-mock-records.json";
const sourceDryRunGatePath = "data/source-gates/twii-real-decision-acceptance-dry-run-gate-preflight.json";
const sourceDryRunReportPath = "scripts/report-twii-real-decision-acceptance-dry-run-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const mockRecords = readJson(mockRecordsPath);
const sourceDryRunGate = readJson(sourceDryRunGatePath);
const sourceDryRunReport = runJsonReport(sourceDryRunReportPath, "TWII real decision acceptance dry-run gate");

validateGate();
validateRecords();
validateUpstream();

const validRecords = (mockRecords.records ?? []).filter((entry) => validateRecord(entry).length === 0);
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_decision_intake_recorder_mock_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "decision_intake_recorder_mock_ready_execution_still_blocked" : "decision_intake_recorder_mock_gate_preflight_blocked",
  mode: "twii_decision_intake_recorder_mock_gate_preflight_no_execution",
  gatePath,
  mockRecordsPath,
  sourceDryRunGatePath,
  sourceDryRunReportPath,
  recorderGateMode: gate.recorderGateMode ?? null,
  recorderGateDecision: gate.recorderGateDecision ?? null,
  recorderValidation: {
    recordCount: (mockRecords.records ?? []).length,
    validRecordCount: validRecords.length,
    expectedStatuses: gate.allowedDecisionStatuses ?? [],
    observedStatuses: [...new Set((mockRecords.records ?? []).map((entry) => entry.decisionStatus))]
  },
  recorderState: {
    recorderGatePrepared: gate.recorderGatePrepared === true,
    sourceDryRunGateReferenced: gate.sourceDryRunGateReferenced === true,
    sourceDryRunFixturesReferenced: gate.sourceDryRunFixturesReferenced === true,
    mockRecordsReferenced: gate.mockRecordsReferenced === true,
    dryRunOnly: gate.dryRunOnly === true,
    mockRecorderOnly: gate.mockRecorderOnly === true,
    acceptedRecordMockPrepared: gate.acceptedRecordMockPrepared === true,
    rejectedRecordMockPrepared: gate.rejectedRecordMockPrepared === true,
    repairRequiredRecordMockPrepared: gate.repairRequiredRecordMockPrepared === true,
    recordsDerivedFromSyntheticFixtures: gate.recordsDerivedFromSyntheticFixtures === true,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    mockRecordAcceptedAsReal: false,
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
    sourceDryRunGateStatus: sourceDryRunReport.status ?? null,
    sourceDryRunGateOutcome: sourceDryRunReport.outcome ?? null,
    sourceDryRunGateKind: sourceDryRunGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_decision_intake_recorder_mock_gate_preflight",
    sourceDryRunGatePath,
    mockRecordsPath,
    recorderGateMode: "decision_intake_recorder_mock_fail_closed_no_execution",
    recorderGatePrepared: true,
    sourceDryRunGateReferenced: true,
    sourceDryRunFixturesReferenced: true,
    mockRecordsReferenced: true,
    dryRunOnly: true,
    mockRecorderOnly: true,
    acceptedRecordMockPrepared: true,
    rejectedRecordMockPrepared: true,
    repairRequiredRecordMockPrepared: true,
    recordsDerivedFromSyntheticFixtures: true,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    mockRecordAcceptedAsReal: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false,
    recorderGateDecision: "decision_intake_recorder_mock_validates_records_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  validateSafety(gate.safety ?? {});
}

function validateRecords() {
  if (mockRecords.recordSetKind !== "twii_decision_intake_recorder_mock_records") problems.push("mockRecords.recordSetKind mismatch");
  if (mockRecords.recordSetMode !== "fixture_derived_mock_recorder_only_no_execution") problems.push("mockRecords.recordSetMode mismatch");
  if (mockRecords.dryRunOnly !== true) problems.push("mockRecords.dryRunOnly must be true");
  if (mockRecords.mockRecorderOnly !== true) problems.push("mockRecords.mockRecorderOnly must be true");
  if (mockRecords.recordedAsReal !== false) problems.push("mockRecords.recordedAsReal must be false");
  if (mockRecords.publicDataSource !== "mock") problems.push("mockRecords.publicDataSource must be mock");
  if (mockRecords.scoreSource !== "mock") problems.push("mockRecords.scoreSource must be mock");
  const records = mockRecords.records ?? [];
  if (records.length !== 3) problems.push("mockRecords must contain exactly 3 records");
  for (const status of gate.allowedDecisionStatuses ?? []) if (!records.some((entry) => entry.decisionStatus === status)) problems.push(`mockRecords missing status ${status}`);
  for (const entry of records) for (const problem of validateRecord(entry)) problems.push(problem);
}

function validateRecord(entry) {
  const recordProblems = [];
  for (const field of gate.requiredRecordFields ?? []) if (!(field in entry)) recordProblems.push(`record ${entry.recordId ?? "unknown"} missing ${field}`);
  for (const field of gate.disallowedRecordFields ?? []) if (field in entry) recordProblems.push(`record ${entry.recordId ?? "unknown"} contains disallowed ${field}`);
  if (!(gate.allowedDecisionStatuses ?? []).includes(entry.decisionStatus)) recordProblems.push(`record ${entry.recordId ?? "unknown"} has invalid decisionStatus`);
  if (entry.recordMode !== "mock_recorder_dry_run_only") recordProblems.push(`record ${entry.recordId ?? "unknown"} recordMode mismatch`);
  if (entry.auditRole !== "CEO_DRY_RUN_FIXTURE") recordProblems.push(`record ${entry.recordId ?? "unknown"} auditRole must be CEO_DRY_RUN_FIXTURE`);
  if (entry.auditTimestampLabel !== "DRY_RUN_TIMESTAMP_PLACEHOLDER") recordProblems.push(`record ${entry.recordId ?? "unknown"} timestamp label must stay placeholder`);
  if (entry.dryRunOnly !== true) recordProblems.push(`record ${entry.recordId ?? "unknown"} dryRunOnly must be true`);
  if (entry.recordedAsReal !== false) recordProblems.push(`record ${entry.recordId ?? "unknown"} recordedAsReal must be false`);
  if (entry.publicDataSource !== "mock") recordProblems.push(`record ${entry.recordId ?? "unknown"} publicDataSource must be mock`);
  if (entry.scoreSource !== "mock") recordProblems.push(`record ${entry.recordId ?? "unknown"} scoreSource must be mock`);
  if (entry.decisionStatus === "repair_required" && !entry.repairRequiredSummary) recordProblems.push("repair_required record must include repairRequiredSummary");
  if (entry.decisionStatus !== "repair_required" && entry.repairRequiredSummary !== "") recordProblems.push(`record ${entry.recordId ?? "unknown"} repairRequiredSummary must be empty`);
  return recordProblems;
}

function validateUpstream() {
  if (sourceDryRunReport.status !== "twii_real_decision_acceptance_dry_run_gate_preflight_ready_no_execution") problems.push("source dry-run gate status mismatch");
  if (sourceDryRunReport.outcome !== "real_decision_acceptance_dry_run_ready_execution_still_blocked") problems.push("source dry-run gate outcome mismatch");
  if (sourceDryRunGate.gateKind !== "twii_real_decision_acceptance_dry_run_gate_preflight") problems.push("source dry-run gate kind mismatch");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "mockRecordAcceptedAsReal", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
