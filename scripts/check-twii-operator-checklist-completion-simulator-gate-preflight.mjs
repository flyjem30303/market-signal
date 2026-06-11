import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-checklist-completion-simulator-gate-preflight.mjs";
const docPath = "docs/TWII_OPERATOR_CHECKLIST_COMPLETION_SIMULATOR_GATE_PREFLIGHT.md";
const a1Path = "docs/A1_OPERATOR_CHECKLIST_COMPLETION_SIMULATOR_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_OPERATOR_CHECKLIST_COMPLETION_SIMULATOR_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-operator-checklist-completion-simulator-gate-preflight.json";
const simulationPath = "data/source-gates/twii-operator-checklist-completion-simulation.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const a1 = read(a1Path);
const a2 = read(a2Path);
const gateText = read(gatePath);
const simulationText = read(simulationPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "operator checklist completion simulator stdout");

if (run.status !== 0) problems.push("operator checklist completion simulator report must exit 0");
if (output.status !== "twii_operator_checklist_completion_simulator_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "operator_checklist_completion_simulator_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.checklistCompletionSimulatorMode !== "operator_checklist_completion_simulator_fail_closed_no_execution") problems.push("checklistCompletionSimulatorMode mismatch");
if (output.completionValidation?.itemCount < 6) problems.push("itemCount must be >= 6");
if (output.completionValidation?.simulatedCompleteCount !== output.completionValidation?.itemCount) problems.push("all simulation items must be simulated complete");
if (output.completionValidation?.realValueProvidedCount !== 0) problems.push("realValueProvidedCount must be 0");
for (const key of ["completionSimulatorGatePrepared", "sourceChecklistGateReferenced", "sourceChecklistPacketReferenced", "completionSimulationReferenced", "completionSimulatorOnly", "mockCompletionOnly", "completionCriteriaSimulationPrepared", "statusTransitionSimulationPrepared", "simulatedAllItemsComplete"]) if (output.completionState?.[key] !== true) problems.push(`completionState.${key} must be true`);
for (const key of ["realValuesProvidedNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "simulatedCompletionAcceptedAsReal", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.completionState?.[key] !== false) problems.push(`completionState.${key} must be false`);
if (pkg.scripts?.["report:twii-operator-checklist-completion-simulator-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-checklist-completion-simulator-gate-preflight"] !== "node scripts/check-twii-operator-checklist-completion-simulator-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Operator Checklist Completion Simulator Gate Preflight", "twii_operator_checklist_completion_simulator_gate_preflight_ready_no_execution", "operator_checklist_completion_simulator_ready_execution_still_blocked", "checklistCompletionSimulatorMode=operator_checklist_completion_simulator_fail_closed_no_execution", "completionSimulatorOnly=true", "mockCompletionOnly=true", "completionCriteriaSimulationPrepared=true", "statusTransitionSimulationPrepared=true", "simulatedAllItemsComplete=true", "simulatedChecklistStatusFrom=blocked_missing_real_values", "simulatedChecklistStatusTo=simulated_complete_for_future_review_only", "realValuesProvidedNow=false", "realDecisionValueReadNow=false", "realDecisionValueRecordedNow=false", "simulatedCompletionAcceptedAsReal=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_operator_checklist_completion_simulator_contract_review_ready", "required fields", "completion criteria", "blocked_missing_real_values", "simulated_complete_for_future_review_only", "simulated completion", "real accepted", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_operator_checklist_completion_simulator_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "scoreSource=real"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII operator checklist completion simulator gate preflight slice", "docs/TWII_OPERATOR_CHECKLIST_COMPLETION_SIMULATOR_GATE_PREFLIGHT.md", "twii_operator_checklist_completion_simulator_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_OPERATOR_CHECKLIST_COMPLETION_SIMULATOR_GATE_PREFLIGHT.md` is `accepted` as TWII operator checklist completion simulator gate preflight", "twii_operator_checklist_completion_simulator_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-operator-checklist-completion-simulator-gate-preflight.mjs", "name: \"twii-operator-checklist-completion-simulator-gate-preflight\"", "\"twii-operator-checklist-completion-simulator-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [simulationPath, simulationText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["operator checklist completion simulator stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, checklistCompletionSimulatorMode: output.checklistCompletionSimulatorMode, itemCount: output.completionValidation.itemCount, simulatedCompleteCount: output.completionValidation.simulatedCompleteCount, realValueProvidedCount: output.completionValidation.realValueProvidedCount, completionSimulatorOnly: output.completionState.completionSimulatorOnly, mockCompletionOnly: output.completionState.mockCompletionOnly, simulatedCompletionAcceptedAsReal: output.completionState.simulatedCompletionAcceptedAsReal, runnerExecutableNow: output.completionState.runnerExecutableNow, executionAllowedNow: output.completionState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
