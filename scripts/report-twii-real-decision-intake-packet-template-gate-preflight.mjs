import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-real-decision-intake-packet-template-gate-preflight.json";
const blankTemplatePath = "data/source-gates/twii-real-decision-intake-packet-template.blank.json";
const sourceFixtureValidatorGatePath = "data/source-gates/twii-decision-value-fixture-intake-validator-gate-preflight.json";
const sourceFixtureValidatorReportPath = "scripts/report-twii-decision-value-fixture-intake-validator-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const template = readJson(blankTemplatePath);
const sourceGate = readJson(sourceFixtureValidatorGatePath);
const sourceReport = runJsonReport(sourceFixtureValidatorReportPath, "TWII decision fixture validator gate");

validateGate();
validateTemplate();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_real_decision_intake_packet_template_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "real_decision_intake_packet_template_ready_execution_still_blocked" : "real_decision_intake_packet_template_gate_preflight_blocked",
  mode: "twii_real_decision_intake_packet_template_gate_preflight_no_execution",
  gatePath,
  blankTemplatePath,
  sourceFixtureValidatorGatePath,
  sourceFixtureValidatorReportPath,
  templateGateMode: gate.templateGateMode ?? null,
  templateGateDecision: gate.templateGateDecision ?? null,
  templateValidation: validateTemplateResult(),
  templateState: {
    templateGatePrepared: gate.templateGatePrepared === true,
    sourceFixtureValidatorGateReferenced: gate.sourceFixtureValidatorGateReferenced === true,
    blankTemplateReferenced: gate.blankTemplateReferenced === true,
    blankTemplateValuesFilledNow: false,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    templateDecisionAcceptedAsReal: false,
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
    sourceFixtureValidatorGateStatus: sourceReport.status ?? null,
    sourceFixtureValidatorGateOutcome: sourceReport.outcome ?? null,
    sourceFixtureValidatorGateKind: sourceGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_real_decision_intake_packet_template_gate_preflight",
    sourceFixtureValidatorGatePath,
    blankTemplatePath,
    templateGateMode: "real_decision_intake_packet_template_fail_closed_no_execution",
    templateGatePrepared: true,
    sourceFixtureValidatorGateReferenced: true,
    blankTemplateReferenced: true,
    blankTemplateValuesFilledNow: false,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    templateDecisionAcceptedAsReal: false,
    acceptedDecisionRecordedNow: false,
    rejectedDecisionRecordedNow: false,
    repairRequiredDecisionRecordedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false,
    templateGateDecision: "real_decision_intake_template_ready_but_blank_and_not_recorded"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  validateSafety(gate.safety ?? {});
}

function validateTemplate() {
  for (const field of gate.allowedTemplateFields ?? []) if (!(field in template)) problems.push(`template missing ${field}`);
  for (const field of gate.disallowedTemplateFields ?? []) if (field in template) problems.push(`template contains disallowed ${field}`);
  for (const placeholder of gate.requiredBlankPlaceholders ?? []) if (!Object.values(template).includes(placeholder)) problems.push(`template missing placeholder ${placeholder}`);
  if (template.publicDataSource !== "mock") problems.push("template.publicDataSource must be mock");
  if (template.scoreSource !== "mock") problems.push("template.scoreSource must be mock");
  if (template.valuesFilledNow !== false) problems.push("template.valuesFilledNow must be false");
}

function validateTemplateResult() {
  return {
    placeholderCount: (gate.requiredBlankPlaceholders ?? []).filter((p) => Object.values(template).includes(p)).length,
    valuesFilledNow: template.valuesFilledNow === true,
    publicDataSource: template.publicDataSource,
    scoreSource: template.scoreSource
  };
}

function validateUpstream() {
  if (sourceReport.status !== "twii_decision_value_fixture_intake_validator_gate_preflight_ready_no_execution") problems.push("source fixture validator status mismatch");
  if (sourceReport.outcome !== "decision_value_fixture_intake_validator_ready_execution_still_blocked") problems.push("source fixture validator outcome mismatch");
  if (sourceGate.gateKind !== "twii_decision_value_fixture_intake_validator_gate_preflight") problems.push("source fixture validator kind mismatch");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "blankTemplateValuesFilledNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "templateDecisionAcceptedAsReal", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
