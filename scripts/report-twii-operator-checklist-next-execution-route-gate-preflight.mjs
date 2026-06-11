import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-operator-checklist-next-execution-route-gate-preflight.json";
const routePath = "data/source-gates/twii-operator-checklist-next-execution-route.json";
const completionReportPath = "scripts/report-twii-operator-checklist-completion-simulator-gate-preflight.mjs";
const sourcePaths = {
  completionGate: "data/source-gates/twii-operator-checklist-completion-simulator-gate-preflight.json",
  finalExecutionPacket: "data/source-gates/twii-final-execution-packet-preflight.json",
  executeSwitchIntakeGate: "data/source-gates/twii-explicit-execute-switch-confirmation-intake-gate.json",
  serverOnlyPreExecutionChecksGate: "data/source-gates/twii-server-only-pre-execution-checks-gate.json",
  postRunReviewContract: "data/source-gates/twii-post-run-review-contract-preflight.json"
};
const problems = [];

const gate = readJson(gatePath);
const route = readJson(routePath);
const completionGate = readJson(sourcePaths.completionGate);
const finalExecutionPacket = readJson(sourcePaths.finalExecutionPacket);
const executeSwitchIntakeGate = readJson(sourcePaths.executeSwitchIntakeGate);
const serverOnlyPreExecutionChecksGate = readJson(sourcePaths.serverOnlyPreExecutionChecksGate);
const postRunReviewContract = readJson(sourcePaths.postRunReviewContract);
const completionReport = runJsonReport(completionReportPath, "TWII operator checklist completion simulator gate");

validateGate();
validateRoute();
validateSources();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "operator_checklist_next_execution_route_ready_execution_still_blocked" : "operator_checklist_next_execution_route_gate_preflight_blocked",
  mode: "twii_operator_checklist_next_execution_route_gate_preflight_no_execution",
  gatePath,
  routePath,
  sourcePaths,
  nextRouteGateMode: gate.nextRouteGateMode ?? null,
  selectedNextRoute: route.selectedNextRoute ?? null,
  allowedNextCommandCategory: route.allowedNextCommandCategory ?? null,
  currentRouteStatus: route.currentRouteStatus ?? null,
  routeDecision: route.routeDecision ?? null,
  routeValidation: {
    prerequisiteReferenceCount: (route.requiredPrerequisiteReferences ?? []).length,
    blockedReasonCount: (route.blockedReasons ?? []).length,
    forbiddenExecutionConditionCount: (route.forbiddenExecutionConditions ?? []).length,
    routeCanAdvanceWithoutRealValues: route.routeCanAdvanceWithoutRealValues ?? null
  },
  routeState: {
    nextRouteGatePrepared: gate.nextRouteGatePrepared === true,
    routeReferenced: gate.routeReferenced === true,
    completionSimulatorGateReferenced: gate.completionSimulatorGateReferenced === true,
    finalExecutionPacketReferenced: gate.finalExecutionPacketReferenced === true,
    executeSwitchIntakeGateReferenced: gate.executeSwitchIntakeGateReferenced === true,
    serverOnlyPreExecutionChecksReferenced: gate.serverOnlyPreExecutionChecksReferenced === true,
    postRunReviewContractReferenced: gate.postRunReviewContractReferenced === true,
    routeReviewOnly: true,
    localOnly: true,
    blockedReasonsPrepared: gate.blockedReasonsPrepared === true,
    allowedNextCommandCategoryPrepared: gate.allowedNextCommandCategoryPrepared === true,
    forbiddenExecutionConditionsPrepared: gate.forbiddenExecutionConditionsPrepared === true,
    realValuesProvidedNow: false,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false
  },
  upstream: {
    completionGateStatus: completionReport.status ?? null,
    completionGateOutcome: completionReport.outcome ?? null,
    completionGateKind: completionGate.gateKind ?? null,
    finalExecutionPacketKind: finalExecutionPacket.gateKind ?? null,
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
    gateKind: "twii_operator_checklist_next_execution_route_gate_preflight",
    routePath,
    nextRouteGateMode: "operator_checklist_next_execution_route_fail_closed_no_execution",
    nextRouteGatePrepared: true,
    routeReferenced: true,
    completionSimulatorGateReferenced: true,
    finalExecutionPacketReferenced: true,
    executeSwitchIntakeGateReferenced: true,
    serverOnlyPreExecutionChecksReferenced: true,
    postRunReviewContractReferenced: true,
    routeReviewOnly: true,
    localOnly: true,
    blockedReasonsPrepared: true,
    allowedNextCommandCategoryPrepared: true,
    forbiddenExecutionConditionsPrepared: true,
    selectedNextRoute: "wait_for_real_operator_values_execute_switch_confirmation_credentials_and_pre_execution_checks",
    allowedNextCommandCategory: "review_only_pre_execution_route_preparation",
    currentRouteStatus: "blocked_waiting_real_operator_and_pre_execution_values",
    routeDecision: "next_execution_route_ready_for_pm_review_but_execution_still_blocked",
    routeCanAdvanceWithoutRealValues: false
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  for (const key of falseKeys()) if (gate[key] !== false) problems.push(`gate.${key} must be false`);
  validateSafety(gate.safety ?? {});
}

function validateRoute() {
  const expected = {
    routeKind: "twii_operator_checklist_next_execution_route",
    routeMode: "next_execution_route_review_only_no_execution",
    selectedNextRoute: "wait_for_real_operator_values_execute_switch_confirmation_credentials_and_pre_execution_checks",
    allowedNextCommandCategory: "review_only_pre_execution_route_preparation",
    currentRouteStatus: "blocked_waiting_real_operator_and_pre_execution_values",
    routeDecision: "next_execution_route_ready_for_pm_review_but_execution_still_blocked",
    routeCanAdvanceWithoutRealValues: false,
    routeReviewOnly: true,
    localOnly: true
  };
  for (const [key, value] of Object.entries(expected)) if (route[key] !== value) problems.push(`route.${key} must be ${JSON.stringify(value)}`);
  for (const field of gate.requiredRouteFields ?? []) if (!(field in route || field === "publicDataSource" || field === "scoreSource")) problems.push(`route missing required field ${field}`);
  for (const ref of gate.requiredPrerequisiteReferences ?? []) if (!(route.requiredPrerequisiteReferences ?? []).includes(ref)) problems.push(`route missing prerequisite ${ref}`);
  for (const blocked of ["realValuesProvidedNow=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "serverOnlyCredentialCheckPassed=false", "credentialValuesRead=false", "runnerExecutableNow=false", "executionAllowedNow=false"]) if (!(route.blockedReasons ?? []).includes(blocked)) problems.push(`route missing blocked reason ${blocked}`);
  for (const forbidden of ["sqlExecuted=true", "supabaseConnectionAttempted=true", "dailyPricesMutated=true", "candidateRowsAccepted=true", "publicDataSource=supabase", "scoreSource=real"]) if (!(route.forbiddenExecutionConditions ?? []).includes(forbidden)) problems.push(`route missing forbidden condition ${forbidden}`);
  for (const key of falseKeys()) if (route[key] !== false) problems.push(`route.${key} must be false`);
}

function validateSources() {
  if (completionReport.status !== "twii_operator_checklist_completion_simulator_gate_preflight_ready_no_execution") problems.push("completion report status mismatch");
  if (completionReport.outcome !== "operator_checklist_completion_simulator_ready_execution_still_blocked") problems.push("completion report outcome mismatch");
  if (completionGate.gateKind !== "twii_operator_checklist_completion_simulator_gate_preflight") problems.push("completion gate kind mismatch");
  if (finalExecutionPacket.gateKind !== "twii_final_execution_packet_preflight") problems.push("final execution packet kind mismatch");
  if (executeSwitchIntakeGate.gateKind !== "twii_explicit_execute_switch_confirmation_intake_gate") problems.push("execute switch intake gate kind mismatch");
  if (serverOnlyPreExecutionChecksGate.gateKind !== "twii_server_only_pre_execution_checks_gate") problems.push("server-only pre-execution checks gate kind mismatch");
  if (postRunReviewContract.gateKind !== "twii_post_run_review_contract_preflight") problems.push("post-run review contract kind mismatch");
}

function falseKeys() {
  return ["realValuesProvidedNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "rollbackDryRunPassed", "aggregateReadbackPassed", "postWriteReviewPassed", "candidateDuplicateRejectionProofPassed", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow", "sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseWritesEnabled", "supabaseReadsEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "rawPayloadOutput", "rowPayloadOutput", "stockIdPayloadOutput", "secretsOutput", "envValueOutput", "promotionAllowed", "scoreSourceRealAllowed"];
}
function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "realValuesProvidedNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
