import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-real-operator-intake-checklist-packet-gate-preflight.mjs";
const docPath = "docs/TWII_REAL_OPERATOR_INTAKE_CHECKLIST_PACKET_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-real-operator-intake-checklist-packet-gate-preflight.json";
const checklistPath = "data/source-gates/twii-real-operator-intake-checklist-packet.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const checklistText = read(checklistPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "real operator intake checklist packet stdout");

if (run.status !== 0) problems.push("real operator intake checklist packet report must exit 0");
if (output.status !== "twii_real_operator_intake_checklist_packet_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "real_operator_intake_checklist_packet_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.checklistGateMode !== "real_operator_intake_checklist_packet_fail_closed_no_execution") problems.push("checklistGateMode mismatch");
if (output.checklistValidation?.itemCount < 6) problems.push("itemCount must be >= 6");
if (output.checklistValidation?.missingItemCount !== output.checklistValidation?.itemCount) problems.push("all checklist items must be missing");
for (const key of ["checklistGatePrepared", "sourceBlockerGateReferenced", "sourceBlockerRequirementsReferenced", "checklistPacketReferenced", "checklistPacketOnly", "completionCriteriaPrepared"]) if (output.checklistState?.[key] !== true) problems.push(`checklistState.${key} must be true`);
for (const key of ["realValuesProvidedNow", "allChecklistItemsProvidedNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "realChecklistAcceptedNow", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.checklistState?.[key] !== false) problems.push(`checklistState.${key} must be false`);
if (pkg.scripts?.["report:twii-real-operator-intake-checklist-packet-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-real-operator-intake-checklist-packet-gate-preflight"] !== "node scripts/check-twii-real-operator-intake-checklist-packet-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Real Operator Intake Checklist Packet Gate Preflight", "twii_real_operator_intake_checklist_packet_gate_preflight_ready_no_execution", "real_operator_intake_checklist_packet_ready_execution_still_blocked", "checklistGateMode=real_operator_intake_checklist_packet_fail_closed_no_execution", "checklistPacketOnly=true", "realValuesProvidedNow=false", "allChecklistItemsProvidedNow=false", "completionCriteriaPrepared=true", "currentChecklistStatus=blocked_missing_real_values", "realDecisionValueReadNow=false", "realDecisionValueRecordedNow=false", "realChecklistAcceptedNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["Latest TWII real operator intake checklist packet gate preflight slice", "docs/TWII_REAL_OPERATOR_INTAKE_CHECKLIST_PACKET_GATE_PREFLIGHT.md", "twii_real_operator_intake_checklist_packet_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_REAL_OPERATOR_INTAKE_CHECKLIST_PACKET_GATE_PREFLIGHT.md` is `accepted` as TWII real operator intake checklist packet gate preflight", "twii_real_operator_intake_checklist_packet_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-real-operator-intake-checklist-packet-gate-preflight.mjs", "name: \"twii-real-operator-intake-checklist-packet-gate-preflight\"", "\"twii-real-operator-intake-checklist-packet-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [checklistPath, checklistText], [docPath, doc], ["real operator intake checklist packet stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, checklistGateMode: output.checklistGateMode, itemCount: output.checklistValidation.itemCount, missingItemCount: output.checklistValidation.missingItemCount, checklistPacketOnly: output.checklistState.checklistPacketOnly, realValuesProvidedNow: output.checklistState.realValuesProvidedNow, realDecisionValueReadNow: output.checklistState.realDecisionValueReadNow, runnerExecutableNow: output.checklistState.runnerExecutableNow, executionAllowedNow: output.checklistState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
