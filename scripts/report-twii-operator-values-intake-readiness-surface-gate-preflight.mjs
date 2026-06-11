import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-operator-values-intake-readiness-surface-gate-preflight.json";
const surfacePath = "data/source-gates/twii-operator-values-intake-readiness-surface.json";
const nextRouteReportPath = "scripts/report-twii-operator-checklist-next-execution-route-gate-preflight.mjs";
const sourcePaths = {
  nextRouteGate: "data/source-gates/twii-operator-checklist-next-execution-route-gate-preflight.json",
  nextRoute: "data/source-gates/twii-operator-checklist-next-execution-route.json",
  executeSwitchIntakeGate: "data/source-gates/twii-explicit-execute-switch-confirmation-intake-gate.json",
  serverOnlyPreExecutionChecksGate: "data/source-gates/twii-server-only-pre-execution-checks-gate.json",
  postRunReviewContract: "data/source-gates/twii-post-run-review-contract-preflight.json"
};
const problems = [];

const gate = readJson(gatePath);
const surface = readJson(surfacePath);
const nextRouteGate = readJson(sourcePaths.nextRouteGate);
const nextRoute = readJson(sourcePaths.nextRoute);
const executeSwitchIntakeGate = readJson(sourcePaths.executeSwitchIntakeGate);
const serverOnlyPreExecutionChecksGate = readJson(sourcePaths.serverOnlyPreExecutionChecksGate);
const postRunReviewContract = readJson(sourcePaths.postRunReviewContract);
const nextRouteReport = runJsonReport(nextRouteReportPath, "TWII operator checklist next execution route gate");

validateGate();
validateSurface();
validateSources();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "operator_values_intake_surface_ready_execution_still_blocked" : "operator_values_intake_readiness_surface_gate_preflight_blocked",
  mode: "twii_operator_values_intake_readiness_surface_gate_preflight_no_execution",
  gatePath,
  surfacePath,
  sourcePaths,
  operatorValuesIntakeSurfaceMode: gate.operatorValuesIntakeSurfaceMode ?? null,
  currentIntakeStatus: surface.currentIntakeStatus ?? null,
  nextReviewOnlyRoute: surface.nextReviewOnlyRoute ?? null,
  allowedNextCommandCategory: surface.allowedNextCommandCategory ?? null,
  surfaceDecision: surface.surfaceDecision ?? null,
  intakeValidation: {
    requiredInputClassCount: (gate.requiredInputClasses ?? []).length,
    externalOnlyValueCount: (surface.externalOnlyValues ?? []).length,
    pmRefreshableValueCount: (surface.pmRefreshableValues ?? []).length,
    neverStoreValueCount: (surface.neverStoreValues ?? []).length,
    blockedReasonCount: (surface.blockedReasons ?? []).length
  },
  intakeState: {
    operatorValuesIntakeSurfaceGatePrepared: gate.operatorValuesIntakeSurfaceGatePrepared === true,
    surfaceReferenced: gate.surfaceReferenced === true,
    nextExecutionRouteGateReferenced: gate.nextExecutionRouteGateReferenced === true,
    executeSwitchIntakeGateReferenced: gate.executeSwitchIntakeGateReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    surfaceReviewOnly: true,
    localOnly: true,
    inputClassesPrepared: gate.inputClassesPrepared === true,
    externalOnlyValuesPrepared: gate.externalOnlyValuesPrepared === true,
    pmRefreshableValuesPrepared: gate.pmRefreshableValuesPrepared === true,
    neverStoreValuesPrepared: gate.neverStoreValuesPrepared === true,
    blockedReasonsPrepared: gate.blockedReasonsPrepared === true,
    nextRoutePrepared: gate.nextRoutePrepared === true,
    externalOnlyValuesProvidedNow: false,
    realValuesProvidedNow: false,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    nextRouteGateStatus: nextRouteReport.status ?? null,
    nextRouteGateOutcome: nextRouteReport.outcome ?? null,
    nextRouteGateKind: nextRouteGate.gateKind ?? null,
    nextRouteKind: nextRoute.routeKind ?? null,
    executeSwitchIntakeGateKind: executeSwitchIntakeGate.gateKind ?? null,
    serverOnlyPreExecutionChecksGateKind: serverOnlyPreExecutionChecksGate.gateKind ?? null,
    postRunReviewContractKind: postRunReviewContract.gateKind ?? null
  },
  promotionLocks: gate.promotionLocks ?? null,
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_operator_values_intake_readiness_surface_gate_preflight",
    surfacePath,
    operatorValuesIntakeSurfaceMode: "operator_values_intake_readiness_surface_fail_closed_no_execution",
    operatorValuesIntakeSurfaceGatePrepared: true,
    surfaceReferenced: true,
    nextExecutionRouteGateReferenced: true,
    executeSwitchIntakeGateReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    postRunReviewContractReferenced: true,
    surfaceReviewOnly: true,
    localOnly: true,
    inputClassesPrepared: true,
    externalOnlyValuesPrepared: true,
    pmRefreshableValuesPrepared: true,
    neverStoreValuesPrepared: true,
    blockedReasonsPrepared: true,
    nextRoutePrepared: true,
    currentIntakeStatus: "blocked_waiting_external_operator_values",
    nextReviewOnlyRoute: "operator_supplies_external_values_then_pm_runs_pre_execution_readiness_recheck",
    allowedNextCommandCategory: "review_only_operator_values_shape_recheck",
    surfaceDecision: "operator_values_intake_surface_ready_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateSurface() {
  const expected = {
    surfaceKind: "twii_operator_values_intake_readiness_surface",
    surfaceMode: "operator_values_intake_readiness_surface_no_execution",
    currentIntakeStatus: "blocked_waiting_external_operator_values",
    nextReviewOnlyRoute: "operator_supplies_external_values_then_pm_runs_pre_execution_readiness_recheck",
    allowedNextCommandCategory: "review_only_operator_values_shape_recheck",
    surfaceDecision: "operator_values_intake_surface_ready_but_execution_still_blocked",
    surfacePrepared: true,
    surfaceReviewOnly: true,
    localOnly: true
  };
  for (const [key, value] of Object.entries(expected)) if (surface[key] !== value) problems.push(`surface.${key} must be ${JSON.stringify(value)}`);
  for (const value of gate.requiredExternalOnlyValues ?? []) if (!(surface.externalOnlyValues ?? []).some((item) => item.id === value && item.providedNow === false && item.storageAllowedInRepo === false)) problems.push(`surface missing external-only value ${value}`);
  for (const value of gate.requiredPmRefreshableValues ?? []) if (!(surface.pmRefreshableValues ?? []).includes(value)) problems.push(`surface missing pm-refreshable value ${value}`);
  for (const value of gate.requiredNeverStoreValues ?? []) if (!(surface.neverStoreValues ?? []).includes(value)) problems.push(`surface missing never-store value ${value}`);
  for (const blocked of ["externalOnlyValuesProvidedNow=false", "realValuesProvidedNow=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "credentialValuesRead=false", "runnerExecutableNow=false", "executionAllowedNow=false"]) if (!(surface.blockedReasons ?? []).includes(blocked)) problems.push(`surface missing blocked reason ${blocked}`);
  for (const key of falseKeys()) if (surface[key] !== false) problems.push(`surface.${key} must be false`);
}

function validateSources() {
  if (nextRouteReport.status !== "twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution") problems.push("next route report status mismatch");
  if (nextRouteReport.outcome !== "operator_checklist_next_execution_route_ready_execution_still_blocked") problems.push("next route report outcome mismatch");
  if (nextRouteGate.gateKind !== "twii_operator_checklist_next_execution_route_gate_preflight") problems.push("next route gate kind mismatch");
  if (nextRoute.routeKind !== "twii_operator_checklist_next_execution_route") problems.push("next route kind mismatch");
  if (executeSwitchIntakeGate.gateKind !== "twii_explicit_execute_switch_confirmation_intake_gate") problems.push("execute switch intake gate kind mismatch");
  if (serverOnlyPreExecutionChecksGate.gateKind !== "twii_server_only_pre_execution_checks_gate") problems.push("server-only pre-execution checks gate kind mismatch");
  if (postRunReviewContract.gateKind !== "twii_post_run_review_contract_preflight") problems.push("post-run review contract kind mismatch");
}

function falseKeys() {
  return ["externalOnlyValuesProvidedNow", "realValuesProvidedNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postWriteReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}
function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "externalOnlyValuesProvidedNow", "realValuesProvidedNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
