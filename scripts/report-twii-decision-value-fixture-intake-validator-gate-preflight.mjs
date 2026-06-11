import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-decision-value-fixture-intake-validator-gate-preflight.json";
const fixturePath = "data/source-gates/twii-decision-value-fixture-intake-validator-safe-fixtures.json";
const sourceDecisionIntakeGatePath = "data/source-gates/twii-accepted-decision-record-intake-gate-preflight.json";
const sourceDecisionIntakeReportPath = "scripts/report-twii-accepted-decision-record-intake-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const fixtures = readJson(fixturePath);
const sourceGate = readJson(sourceDecisionIntakeGatePath);
const sourceReport = runJsonReport(sourceDecisionIntakeReportPath, "TWII accepted decision record intake gate");
const validation = validateFixtures();

validateGate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_decision_value_fixture_intake_validator_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "decision_value_fixture_intake_validator_ready_execution_still_blocked" : "decision_value_fixture_intake_validator_gate_preflight_blocked",
  mode: "twii_decision_value_fixture_intake_validator_gate_preflight_no_execution",
  gatePath,
  fixturePath,
  sourceDecisionIntakeGatePath,
  sourceDecisionIntakeReportPath,
  fixtureValidatorMode: gate.fixtureValidatorMode ?? null,
  validatorDecision: gate.validatorDecision ?? null,
  validation,
  validatorState: {
    fixtureValidatorPrepared: gate.fixtureValidatorPrepared === true,
    sourceDecisionIntakeGateReferenced: gate.sourceDecisionIntakeGateReferenced === true,
    safeFixturesReferenced: gate.safeFixturesReferenced === true,
    safeFixturesAreSynthetic: gate.safeFixturesAreSynthetic === true,
    realDecisionValueReadNow: false,
    fixtureDecisionValueAcceptedAsReal: false,
    decisionValueRecordedNow: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false
  },
  candidateState: {
    candidateArtifactReferenceOnly: gate.candidateArtifactReferenceOnly === true,
    candidateArtifactRowsRead: false,
    sourcePayloadRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false
  },
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  upstream: {
    sourceDecisionIntakeGateStatus: sourceReport.status ?? null,
    sourceDecisionIntakeGateOutcome: sourceReport.outcome ?? null,
    sourceDecisionIntakeGateKind: sourceGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_decision_value_fixture_intake_validator_gate_preflight",
    sourceDecisionIntakeGatePath,
    safeFixturePath: fixturePath,
    fixtureValidatorMode: "decision_value_fixture_intake_validator_fail_closed_no_execution",
    fixtureValidatorPrepared: true,
    sourceDecisionIntakeGateReferenced: true,
    safeFixturesReferenced: true,
    safeFixturesAreSynthetic: true,
    realDecisionValueReadNow: false,
    fixtureDecisionValueAcceptedAsReal: false,
    decisionValueRecordedNow: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    validatorDecision: "decision_value_fixture_validator_ready_but_no_real_decision_value_read"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  if (JSON.stringify(gate.allowedStatuses) !== JSON.stringify(["accepted", "rejected", "repair_required"])) problems.push("allowedStatuses mismatch");
  validateSafety(gate.safety ?? {});
}

function validateUpstream() {
  if (sourceReport.status !== "twii_accepted_decision_record_intake_gate_preflight_ready_no_execution") problems.push("source decision intake gate status mismatch");
  if (sourceReport.outcome !== "accepted_decision_record_intake_gate_ready_execution_still_blocked") problems.push("source decision intake gate outcome mismatch");
  if (sourceGate.gateKind !== "twii_accepted_decision_record_intake_gate_preflight") problems.push("source decision intake gate kind mismatch");
}

function validateFixtures() {
  const allowedFields = new Set(gate.allowedFields ?? []);
  const disallowedFields = new Set(gate.disallowedFields ?? []);
  const allowedStatuses = new Set(gate.allowedStatuses ?? []);
  const requiredIds = new Set(gate.requiredFixtureCaseIds ?? []);
  const rows = Array.isArray(fixtures.fixtures) ? fixtures.fixtures : [];
  const caseResults = rows.map((row) => {
    const keys = Object.keys(row);
    const hasDisallowed = keys.some((key) => disallowedFields.has(key));
    const hasUnknown = keys.some((key) => !allowedFields.has(key) && !disallowedFields.has(key));
    const statusAllowed = allowedStatuses.has(row.decisionStatus);
    const valid = !hasDisallowed && !hasUnknown && statusAllowed && row.publicDataSource === "mock" && row.scoreSource === "mock";
    return { caseId: row.caseId, expectedValid: row.expectedValid === true, observedValid: valid };
  });
  for (const id of requiredIds) if (!caseResults.some((row) => row.caseId === id)) problems.push(`missing fixture ${id}`);
  for (const row of caseResults) if (row.expectedValid !== row.observedValid) problems.push(`fixture ${row.caseId} expected ${row.expectedValid} observed ${row.observedValid}`);
  if (fixtures.syntheticOnly !== true) problems.push("fixtures.syntheticOnly must be true");
  if (fixtures.realDecisionValuesIncluded !== false) problems.push("fixtures.realDecisionValuesIncluded must be false");
  return { caseCount: caseResults.length, validCount: caseResults.filter((row) => row.observedValid).length, invalidCount: caseResults.filter((row) => !row.observedValid).length, caseResults };
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "realDecisionValueReadNow", "fixtureDecisionValueAcceptedAsReal", "decisionValueRecordedNow", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
