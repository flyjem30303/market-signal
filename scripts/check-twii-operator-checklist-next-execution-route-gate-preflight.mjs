import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-checklist-next-execution-route-gate-preflight.mjs";
const docPath = "docs/TWII_OPERATOR_CHECKLIST_NEXT_EXECUTION_ROUTE_GATE_PREFLIGHT.md";
const a1Path = "docs/A1_OPERATOR_CHECKLIST_NEXT_EXECUTION_ROUTE_CONTRACT_REVIEW.md";
const a2Path = "docs/A2_OPERATOR_CHECKLIST_NEXT_EXECUTION_ROUTE_COPY_GUARD.md";
const gatePath = "data/source-gates/twii-operator-checklist-next-execution-route-gate-preflight.json";
const routePath = "data/source-gates/twii-operator-checklist-next-execution-route.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const a1 = read(a1Path);
const a2 = read(a2Path);
const gateText = read(gatePath);
const routeText = read(routePath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "operator checklist next execution route stdout");

if (run.status !== 0) problems.push("operator checklist next execution route report must exit 0");
if (output.status !== "twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "operator_checklist_next_execution_route_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.nextRouteGateMode !== "operator_checklist_next_execution_route_fail_closed_no_execution") problems.push("nextRouteGateMode mismatch");
if (output.selectedNextRoute !== "wait_for_real_operator_values_execute_switch_confirmation_credentials_and_pre_execution_checks") problems.push("selectedNextRoute mismatch");
if (output.allowedNextCommandCategory !== "review_only_pre_execution_route_preparation") problems.push("allowedNextCommandCategory mismatch");
if (output.routeValidation?.prerequisiteReferenceCount < 5) problems.push("prerequisiteReferenceCount must be >= 5");
if (output.routeValidation?.blockedReasonCount < 10) problems.push("blockedReasonCount must be >= 10");
if (output.routeValidation?.forbiddenExecutionConditionCount < 8) problems.push("forbiddenExecutionConditionCount must be >= 8");
for (const key of ["nextRouteGatePrepared", "routeReferenced", "completionSimulatorGateReferenced", "finalExecutionPacketReferenced", "executeSwitchIntakeGateReferenced", "serverOnlyPreExecutionChecksReferenced", "postRunReviewContractReferenced", "routeReviewOnly", "localOnly", "blockedReasonsPrepared", "allowedNextCommandCategoryPrepared", "forbiddenExecutionConditionsPrepared"]) if (output.routeState?.[key] !== true) problems.push(`routeState.${key} must be true`);
for (const key of ["realValuesProvidedNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "executeSwitchProvided", "confirmationPhraseProvided", "confirmationPhraseMatched", "serverOnlyCredentialCheckPassed", "credentialValuesRead", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.routeState?.[key] !== false) problems.push(`routeState.${key} must be false`);
if (pkg.scripts?.["report:twii-operator-checklist-next-execution-route-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-checklist-next-execution-route-gate-preflight"] !== "node scripts/check-twii-operator-checklist-next-execution-route-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Operator Checklist Next Execution Route Gate Preflight", "twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution", "operator_checklist_next_execution_route_ready_execution_still_blocked", "nextRouteGateMode=operator_checklist_next_execution_route_fail_closed_no_execution", "routeReviewOnly=true", "localOnly=true", "blockedReasonsPrepared=true", "allowedNextCommandCategoryPrepared=true", "forbiddenExecutionConditionsPrepared=true", "selectedNextRoute=wait_for_real_operator_values_execute_switch_confirmation_credentials_and_pre_execution_checks", "allowedNextCommandCategory=review_only_pre_execution_route_preparation", "currentRouteStatus=blocked_waiting_real_operator_and_pre_execution_values", "routeCanAdvanceWithoutRealValues=false", "realValuesProvidedNow=false", "executeSwitchProvided=false", "confirmationPhraseProvided=false", "serverOnlyCredentialCheckPassed=false", "credentialValuesRead=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["a1_operator_checklist_next_execution_route_contract_review_ready", "required route fields", "required prerequisite references", "blocked reasons", "allowed next command category", "forbidden execution conditions", "fail-closed", "PM integration notes"]) if (!includesCaseInsensitive(a1, phrase)) problems.push(`${a1Path} missing ${phrase}`);
for (const phrase of ["a2_operator_checklist_next_execution_route_copy_guard_ready", "safe wording", "forbidden wording", "public copy rule", "internal operator copy rule", "PM integration notes", "scoreSource=real"]) if (!includesCaseInsensitive(a2, phrase)) problems.push(`${a2Path} missing ${phrase}`);
for (const phrase of ["Latest TWII operator checklist next execution route gate preflight slice", "docs/TWII_OPERATOR_CHECKLIST_NEXT_EXECUTION_ROUTE_GATE_PREFLIGHT.md", "twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_OPERATOR_CHECKLIST_NEXT_EXECUTION_ROUTE_GATE_PREFLIGHT.md` is `accepted` as TWII operator checklist next execution route gate preflight", "twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-operator-checklist-next-execution-route-gate-preflight.mjs", "name: \"twii-operator-checklist-next-execution-route-gate-preflight\"", "\"twii-operator-checklist-next-execution-route-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [routePath, routeText], [docPath, doc], [a1Path, a1], [a2Path, a2], ["operator checklist next execution route stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, selectedNextRoute: output.selectedNextRoute, allowedNextCommandCategory: output.allowedNextCommandCategory, currentRouteStatus: output.currentRouteStatus, blockedReasonCount: output.routeValidation.blockedReasonCount, routeReviewOnly: output.routeState.routeReviewOnly, realValuesProvidedNow: output.routeState.realValuesProvidedNow, runnerExecutableNow: output.routeState.runnerExecutableNow, executionAllowedNow: output.routeState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function includesCaseInsensitive(text, phrase) { return text.toLowerCase().includes(phrase.toLowerCase()); }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
