import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-real-decision-acceptance-dry-run-gate-preflight.json";
const fixturesPath = "data/source-gates/twii-real-decision-acceptance-dry-run-fixtures.json";
const sourceTemplateGatePath = "data/source-gates/twii-real-decision-intake-packet-template-gate-preflight.json";
const sourceTemplateReportPath = "scripts/report-twii-real-decision-intake-packet-template-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const fixtures = readJson(fixturesPath);
const sourceTemplateGate = readJson(sourceTemplateGatePath);
const sourceTemplateReport = runJsonReport(sourceTemplateReportPath, "TWII real decision template gate");

validateGate();
validateFixtures();
validateUpstream();

const validCases = (fixtures.cases ?? []).filter((entry) => validateFixtureCase(entry).length === 0);
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_real_decision_acceptance_dry_run_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "real_decision_acceptance_dry_run_ready_execution_still_blocked" : "real_decision_acceptance_dry_run_gate_preflight_blocked",
  mode: "twii_real_decision_acceptance_dry_run_gate_preflight_no_execution",
  gatePath,
  fixturesPath,
  sourceTemplateGatePath,
  sourceTemplateReportPath,
  dryRunGateMode: gate.dryRunGateMode ?? null,
  dryRunGateDecision: gate.dryRunGateDecision ?? null,
  fixtureValidation: {
    caseCount: (fixtures.cases ?? []).length,
    validCaseCount: validCases.length,
    expectedStatuses: gate.allowedDecisionStatuses ?? [],
    observedStatuses: [...new Set((fixtures.cases ?? []).map((entry) => entry.decisionStatus))]
  },
  dryRunState: {
    dryRunGatePrepared: gate.dryRunGatePrepared === true,
    sourceTemplateGateReferenced: gate.sourceTemplateGateReferenced === true,
    sourceBlankTemplateReferenced: gate.sourceBlankTemplateReferenced === true,
    dryRunFixturesReferenced: gate.dryRunFixturesReferenced === true,
    dryRunOnly: gate.dryRunOnly === true,
    syntheticFixtureOnly: gate.syntheticFixtureOnly === true,
    acceptedPathDryRunPrepared: gate.acceptedPathDryRunPrepared === true,
    rejectedPathDryRunPrepared: gate.rejectedPathDryRunPrepared === true,
    repairRequiredPathDryRunPrepared: gate.repairRequiredPathDryRunPrepared === true,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    fixtureDecisionAcceptedAsReal: false,
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
    sourceTemplateGateStatus: sourceTemplateReport.status ?? null,
    sourceTemplateGateOutcome: sourceTemplateReport.outcome ?? null,
    sourceTemplateGateKind: sourceTemplateGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_real_decision_acceptance_dry_run_gate_preflight",
    sourceTemplateGatePath,
    dryRunFixturesPath: fixturesPath,
    dryRunGateMode: "real_decision_acceptance_dry_run_fail_closed_no_execution",
    dryRunGatePrepared: true,
    sourceTemplateGateReferenced: true,
    sourceBlankTemplateReferenced: true,
    dryRunFixturesReferenced: true,
    dryRunOnly: true,
    syntheticFixtureOnly: true,
    acceptedPathDryRunPrepared: true,
    rejectedPathDryRunPrepared: true,
    repairRequiredPathDryRunPrepared: true,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    fixtureDecisionAcceptedAsReal: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false,
    dryRunGateDecision: "real_decision_acceptance_dry_run_validates_fixture_paths_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  validateSafety(gate.safety ?? {});
}

function validateFixtures() {
  if (fixtures.fixtureKind !== "twii_real_decision_acceptance_dry_run_fixtures") problems.push("fixtures.fixtureKind mismatch");
  if (fixtures.fixtureMode !== "synthetic_decision_packet_dry_run_only_no_execution") problems.push("fixtures.fixtureMode mismatch");
  if (fixtures.dryRunOnly !== true) problems.push("fixtures.dryRunOnly must be true");
  if (fixtures.publicDataSource !== "mock") problems.push("fixtures.publicDataSource must be mock");
  if (fixtures.scoreSource !== "mock") problems.push("fixtures.scoreSource must be mock");
  const cases = fixtures.cases ?? [];
  if (cases.length !== 3) problems.push("fixtures must contain exactly 3 cases");
  for (const status of gate.allowedDecisionStatuses ?? []) if (!cases.some((entry) => entry.decisionStatus === status)) problems.push(`fixtures missing status ${status}`);
  for (const entry of cases) for (const problem of validateFixtureCase(entry)) problems.push(problem);
}

function validateFixtureCase(entry) {
  const caseProblems = [];
  for (const field of gate.requiredFixtureFields ?? []) if (!(field in entry)) caseProblems.push(`fixture ${entry.caseId ?? "unknown"} missing ${field}`);
  for (const field of gate.disallowedFixtureFields ?? []) if (field in entry) caseProblems.push(`fixture ${entry.caseId ?? "unknown"} contains disallowed ${field}`);
  if (!(gate.allowedDecisionStatuses ?? []).includes(entry.decisionStatus)) caseProblems.push(`fixture ${entry.caseId ?? "unknown"} has invalid decisionStatus`);
  if (entry.decisionRecordedByRole !== "CEO_DRY_RUN_FIXTURE") caseProblems.push(`fixture ${entry.caseId ?? "unknown"} role must be CEO_DRY_RUN_FIXTURE`);
  if (entry.decisionRecordedAtLabel !== "DRY_RUN_TIMESTAMP_PLACEHOLDER") caseProblems.push(`fixture ${entry.caseId ?? "unknown"} timestamp label must stay placeholder`);
  if (entry.decisionStatus === "repair_required" && !entry.repairRequiredSummary) caseProblems.push("repair_required fixture must include repairRequiredSummary");
  if (entry.decisionStatus !== "repair_required" && entry.repairRequiredSummary !== "") caseProblems.push(`fixture ${entry.caseId ?? "unknown"} repairRequiredSummary must be empty`);
  return caseProblems;
}

function validateUpstream() {
  if (sourceTemplateReport.status !== "twii_real_decision_intake_packet_template_gate_preflight_ready_no_execution") problems.push("source template gate status mismatch");
  if (sourceTemplateReport.outcome !== "real_decision_intake_packet_template_ready_execution_still_blocked") problems.push("source template gate outcome mismatch");
  if (sourceTemplateGate.gateKind !== "twii_real_decision_intake_packet_template_gate_preflight") problems.push("source template gate kind mismatch");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "fixtureDecisionAcceptedAsReal", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
