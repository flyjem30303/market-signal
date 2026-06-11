import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-operator-values-shape-recheck-gate-preflight.json";
const recheckPath = "data/source-gates/twii-operator-values-shape-recheck.json";
const intakeReportPath = "scripts/report-twii-operator-values-intake-readiness-surface-gate-preflight.mjs";
const intakeGatePath = "data/source-gates/twii-operator-values-intake-readiness-surface-gate-preflight.json";
const intakeSurfacePath = "data/source-gates/twii-operator-values-intake-readiness-surface.json";
const problems = [];

const gate = readJson(gatePath);
const recheck = readJson(recheckPath);
const intakeGate = readJson(intakeGatePath);
const intakeSurface = readJson(intakeSurfacePath);
const intakeReport = runJsonReport(intakeReportPath, "TWII operator values intake readiness surface gate");

validateGate();
validateRecheck();
validateSources();

const placeholders = recheck.externalValueShapePlaceholders ?? [];
const ok = problems.length === 0;
const report = {
  status: ok ? "twii_operator_values_shape_recheck_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "operator_values_shape_recheck_ready_execution_still_blocked" : "operator_values_shape_recheck_gate_preflight_blocked",
  mode: "twii_operator_values_shape_recheck_gate_preflight_no_execution",
  gatePath,
  recheckPath,
  intakeGatePath,
  intakeSurfacePath,
  operatorValuesShapeRecheckMode: gate.operatorValuesShapeRecheckMode ?? null,
  currentRecheckStatus: recheck.currentRecheckStatus ?? null,
  nextReviewOnlyRoute: recheck.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: recheck.allowedNextCommandCategory ?? null,
  shapeRecheckDecision: gate.shapeRecheckDecision ?? null,
  shapeValidation: {
    requiredShapeFieldCount: (gate.requiredShapeFields ?? []).length,
    externalValuePlaceholderCount: placeholders.length,
    neverStoreValueCount: (recheck.neverStoreValues ?? []).length,
    blockedReasonCount: (recheck.blockedReasons ?? []).length,
    placeholdersProvidedNowCount: placeholders.filter((item) => item.providedNow === true).length,
    placeholdersValueReadNowCount: placeholders.filter((item) => item.valueReadNow === true).length
  },
  shapeState: {
    operatorValuesShapeRecheckGatePrepared: gate.operatorValuesShapeRecheckGatePrepared === true,
    shapeRecheckReferenced: gate.shapeRecheckReferenced === true,
    intakeSurfaceGateReferenced: gate.intakeSurfaceGateReferenced === true,
    intakeSurfaceReferenced: gate.intakeSurfaceReferenced === true,
    presenceOnly: true,
    shapeOnly: true,
    localOnly: true,
    externalValuePlaceholdersOnly: true,
    requiredShapeFieldsPrepared: gate.requiredShapeFieldsPrepared === true,
    externalValuePlaceholderRulesPrepared: gate.externalValuePlaceholderRulesPrepared === true,
    blockedReasonsPrepared: gate.blockedReasonsPrepared === true,
    nextRoutePrepared: gate.nextRoutePrepared === true,
    realValuesProvidedNow: false,
    realValuesReadNow: false,
    externalOnlyValuesProvidedNow: false,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    intakeSurfaceGateStatus: intakeReport.status ?? null,
    intakeSurfaceGateOutcome: intakeReport.outcome ?? null,
    intakeGateKind: intakeGate.gateKind ?? null,
    intakeSurfaceKind: intakeSurface.surfaceKind ?? null
  },
  promotionLocks: gate.promotionLocks ?? null,
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_operator_values_shape_recheck_gate_preflight",
    shapeRecheckPath: recheckPath,
    sourceIntakeSurfaceGatePath: intakeGatePath,
    sourceIntakeSurfacePath: intakeSurfacePath,
    operatorValuesShapeRecheckMode: "operator_values_shape_recheck_fail_closed_no_execution",
    operatorValuesShapeRecheckGatePrepared: true,
    shapeRecheckReferenced: true,
    intakeSurfaceGateReferenced: true,
    intakeSurfaceReferenced: true,
    presenceOnly: true,
    shapeOnly: true,
    localOnly: true,
    externalValuePlaceholdersOnly: true,
    requiredShapeFieldsPrepared: true,
    externalValuePlaceholderRulesPrepared: true,
    blockedReasonsPrepared: true,
    nextRoutePrepared: true,
    currentRecheckStatus: "shape_recheck_ready_waiting_external_values",
    nextReviewOnlyRoute: "external_values_shape_recheck_then_pre_execution_readiness_recheck",
    allowedNextCommandCategory: "review_only_shape_presence_recheck",
    shapeRecheckDecision: "operator_values_shape_recheck_ready_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateRecheck() {
  const expected = {
    recheckKind: "twii_operator_values_shape_recheck",
    recheckMode: "operator_values_shape_recheck_presence_only_no_execution",
    currentRecheckStatus: "shape_recheck_ready_waiting_external_values",
    nextReviewOnlyRoute: "external_values_shape_recheck_then_pre_execution_readiness_recheck",
    allowedNextCommandCategory: "review_only_shape_presence_recheck",
    shapeRecheckPrepared: true,
    presenceOnly: true,
    shapeOnly: true,
    localOnly: true,
    externalValuePlaceholdersOnly: true
  };
  for (const [key, value] of Object.entries(expected)) if (recheck[key] !== value) problems.push(`recheck.${key} must be ${JSON.stringify(value)}`);
  if ((recheck.externalValueShapePlaceholders ?? []).length < 5) problems.push("recheck.externalValueShapePlaceholders must include at least 5 placeholders");
  for (const id of gate.requiredExternalValuePlaceholderIds ?? []) if (!(recheck.externalValueShapePlaceholders ?? []).some((item) => item.fieldId === id)) problems.push(`recheck missing placeholder ${id}`);
  for (const item of recheck.externalValueShapePlaceholders ?? []) {
    for (const field of gate.requiredShapeFields ?? []) if (!(field in item)) problems.push(`placeholder ${item.fieldId ?? "unknown"} missing ${field}`);
    if (item.providedNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} providedNow must be false`);
    if (item.valueReadNow !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} valueReadNow must be false`);
    if (item.storageAllowedInRepo !== false) problems.push(`placeholder ${item.fieldId ?? "unknown"} storageAllowedInRepo must be false`);
    if (item.shapeCheckOnly !== true) problems.push(`placeholder ${item.fieldId ?? "unknown"} shapeCheckOnly must be true`);
  }
  for (const value of gate.requiredNeverStoreValues ?? []) if (!(recheck.neverStoreValues ?? []).includes(value)) problems.push(`recheck missing never-store value ${value}`);
  for (const blocked of ["externalOnlyValuesProvidedNow=false", "realValuesProvidedNow=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "credentialValuesRead=false", "runnerExecutableNow=false", "executionAllowedNow=false"]) if (!(recheck.blockedReasons ?? []).includes(blocked)) problems.push(`recheck missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (recheck[key] !== false) problems.push(`recheck.${key} must be false`);
}

function validateSources() {
  if (intakeReport.status !== "twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution") problems.push("intake report status mismatch");
  if (intakeReport.outcome !== "operator_values_intake_surface_ready_execution_still_blocked") problems.push("intake report outcome mismatch");
  if (intakeGate.gateKind !== "twii_operator_values_intake_readiness_surface_gate_preflight") problems.push("intake gate kind mismatch");
  if (intakeSurface.surfaceKind !== "twii_operator_values_intake_readiness_surface") problems.push("intake surface kind mismatch");
}

function falseKeys() {
  return ["realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}
function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "realValuesProvidedNow", "realValuesReadNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "externalOnlyValuesProvidedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
