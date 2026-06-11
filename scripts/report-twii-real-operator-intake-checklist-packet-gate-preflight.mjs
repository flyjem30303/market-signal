import fs from "node:fs";
import { spawnSync } from "node:child_process";

const gatePath = "data/source-gates/twii-real-operator-intake-checklist-packet-gate-preflight.json";
const checklistPath = "data/source-gates/twii-real-operator-intake-checklist-packet.json";
const sourceBlockerGatePath = "data/source-gates/twii-real-operator-packet-intake-blocker-gate-preflight.json";
const sourceBlockerReportPath = "scripts/report-twii-real-operator-packet-intake-blocker-gate-preflight.mjs";
const problems = [];

const gate = readJson(gatePath);
const checklist = readJson(checklistPath);
const sourceGate = readJson(sourceBlockerGatePath);
const sourceReport = runJsonReport(sourceBlockerReportPath, "TWII real operator packet intake blocker gate");

validateGate();
validateChecklist();
validateUpstream();

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_real_operator_intake_checklist_packet_gate_preflight_ready_no_execution" : "blocked",
  outcome: ok ? "real_operator_intake_checklist_packet_ready_execution_still_blocked" : "real_operator_intake_checklist_packet_gate_preflight_blocked",
  mode: "twii_real_operator_intake_checklist_packet_gate_preflight_no_execution",
  gatePath,
  checklistPath,
  sourceBlockerGatePath,
  sourceBlockerReportPath,
  checklistGateMode: gate.checklistGateMode ?? null,
  checklistGateDecision: gate.checklistGateDecision ?? null,
  checklistValidation: {
    itemCount: (checklist.items ?? []).length,
    missingItemCount: (checklist.items ?? []).filter((item) => item.providedNow === false).length,
    completionCriteriaCount: (checklist.completionCriteria ?? []).length,
    currentChecklistStatus: checklist.currentChecklistStatus ?? null
  },
  checklistState: {
    checklistGatePrepared: gate.checklistGatePrepared === true,
    sourceBlockerGateReferenced: gate.sourceBlockerGateReferenced === true,
    sourceBlockerRequirementsReferenced: gate.sourceBlockerRequirementsReferenced === true,
    checklistPacketReferenced: gate.checklistPacketReferenced === true,
    checklistPacketOnly: gate.checklistPacketOnly === true,
    realValuesProvidedNow: false,
    allChecklistItemsProvidedNow: false,
    completionCriteriaPrepared: gate.completionCriteriaPrepared === true,
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    realChecklistAcceptedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false
  },
  promotionLocks: gate.promotionLocks ?? null,
  noExecutionState: noExecutionState(),
  upstream: {
    sourceBlockerGateStatus: sourceReport.status ?? null,
    sourceBlockerGateOutcome: sourceReport.outcome ?? null,
    sourceBlockerGateKind: sourceGate.gateKind ?? null
  },
  safety: gate.safety ?? {},
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateGate() {
  const expected = {
    gateKind: "twii_real_operator_intake_checklist_packet_gate_preflight",
    sourceBlockerGatePath,
    checklistPacketPath: checklistPath,
    checklistGateMode: "real_operator_intake_checklist_packet_fail_closed_no_execution",
    checklistGatePrepared: true,
    sourceBlockerGateReferenced: true,
    sourceBlockerRequirementsReferenced: true,
    checklistPacketReferenced: true,
    checklistPacketOnly: true,
    realValuesProvidedNow: false,
    allChecklistItemsProvidedNow: false,
    completionCriteriaPrepared: true,
    currentChecklistStatus: "blocked_missing_real_values",
    realDecisionValueReadNow: false,
    realDecisionValueRecordedNow: false,
    realChecklistAcceptedNow: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    implementationAllowedNow: false,
    checklistGateDecision: "real_operator_intake_checklist_packet_defines_fillable_items_but_execution_still_blocked"
  };
  for (const [key, value] of Object.entries(expected)) if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  validateSafety(gate.safety ?? {});
}

function validateChecklist() {
  if (checklist.checklistKind !== "twii_real_operator_intake_checklist_packet") problems.push("checklist.checklistKind mismatch");
  if (checklist.checklistMode !== "real_intake_checklist_packet_only_no_execution") problems.push("checklist.checklistMode mismatch");
  if (checklist.checklistPacketOnly !== true) problems.push("checklist.checklistPacketOnly must be true");
  if (checklist.realValuesProvidedNow !== false) problems.push("checklist.realValuesProvidedNow must be false");
  if (checklist.publicDataSource !== "mock") problems.push("checklist.publicDataSource must be mock");
  if (checklist.scoreSource !== "mock") problems.push("checklist.scoreSource must be mock");
  if ((checklist.items ?? []).length < 6) problems.push("checklist must include at least 6 items");
  for (const criterion of gate.requiredCompletionCriteria ?? []) if (!(checklist.completionCriteria ?? []).includes(criterion)) problems.push(`checklist missing completion criterion ${criterion}`);
  for (const item of checklist.items ?? []) {
    for (const field of gate.requiredChecklistItemFields ?? []) if (!(field in item)) problems.push(`checklist item ${item.itemId ?? "unknown"} missing ${field}`);
    if (item.required !== true) problems.push(`checklist item ${item.itemId ?? "unknown"} required must be true`);
    if (item.providedNow !== false) problems.push(`checklist item ${item.itemId ?? "unknown"} providedNow must be false`);
  }
}

function validateUpstream() {
  if (sourceReport.status !== "twii_real_operator_packet_intake_blocker_gate_preflight_ready_no_execution") problems.push("source blocker gate status mismatch");
  if (sourceReport.outcome !== "real_operator_packet_intake_blocker_ready_execution_still_blocked") problems.push("source blocker gate outcome mismatch");
  if (sourceGate.gateKind !== "twii_real_operator_packet_intake_blocker_gate_preflight") problems.push("source blocker gate kind mismatch");
}

function validateSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "candidateRowsAccepted", "candidateArtifactRowsRead", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "realChecklistAcceptedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead", "dailyPricesMutated", "stagingRowsCreated", "rowCoverageScoringAllowed", "secretsOutput", "envValueOutput", "publicPromotionAllowed", "scoreSourceRealAllowed"]) if (safety[key] !== false) problems.push(`safety.${key} must be false`);
}

function noExecutionState() {
  return { sqlExecuted: false, supabaseClientImported: false, supabaseConnectionAttempted: false, supabaseReadsEnabled: false, supabaseWritesEnabled: false, marketDataFetched: false, marketDataIngested: false, dailyPricesMutated: false, stagingRowsCreated: false, candidateRowsAccepted: false, rowCoverageScoringAllowed: false, envValueOutput: false, runnerExecutableNow: false, executionAllowedNow: false, writeGateExecutableNow: false, finalExecutionAllowedNow: false, implementationAllowedNow: false };
}
function readJson(filePath) { try { return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (error) { problems.push(`failed to read ${filePath}: ${error.message}`); return {}; } }
function runJsonReport(filePath, label) { const run = spawnSync(process.execPath, [filePath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }); if (run.status !== 0) { problems.push(`${label} exited ${run.status}`); return {}; } try { return JSON.parse(run.stdout); } catch (error) { problems.push(`${label} did not emit JSON: ${error.message}`); return {}; } }
