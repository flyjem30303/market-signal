import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-real-decision-intake-packet-template-gate-preflight.mjs";
const docPath = "docs/TWII_REAL_DECISION_INTAKE_PACKET_TEMPLATE_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-real-decision-intake-packet-template-gate-preflight.json";
const templatePath = "data/source-gates/twii-real-decision-intake-packet-template.blank.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const templateText = read(templatePath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "real decision template gate stdout");

if (run.status !== 0) problems.push("real decision template report must exit 0");
if (output.status !== "twii_real_decision_intake_packet_template_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "real_decision_intake_packet_template_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.templateGateMode !== "real_decision_intake_packet_template_fail_closed_no_execution") problems.push("templateGateMode mismatch");
if (output.templateValidation?.placeholderCount !== 5) problems.push("placeholderCount must be 5");
if (output.templateValidation?.valuesFilledNow !== false) problems.push("valuesFilledNow must be false");
for (const key of ["templateGatePrepared", "sourceFixtureValidatorGateReferenced", "blankTemplateReferenced"]) if (output.templateState?.[key] !== true) problems.push(`templateState.${key} must be true`);
for (const key of ["blankTemplateValuesFilledNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "templateDecisionAcceptedAsReal", "acceptedDecisionRecordedNow", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.templateState?.[key] !== false) problems.push(`templateState.${key} must be false`);
if (pkg.scripts?.["report:twii-real-decision-intake-packet-template-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-real-decision-intake-packet-template-gate-preflight"] !== "node scripts/check-twii-real-decision-intake-packet-template-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Real Decision Intake Packet Template Gate Preflight", "twii_real_decision_intake_packet_template_gate_preflight_ready_no_execution", "real_decision_intake_packet_template_ready_execution_still_blocked", "blankTemplateValuesFilledNow=false", "realDecisionValueReadNow=false", "templateDecisionAcceptedAsReal=false", "acceptedDecisionRecordedNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "requiredBlankPlaceholders=[__DECISION_STATUS__,__DECISION_RECORDED_BY_ROLE__,__DECISION_RECORDED_AT_LABEL__,__DECISION_REASON_SUMMARY__,__REPAIR_REQUIRED_SUMMARY_OR_EMPTY__]", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["Latest TWII real decision intake packet template gate preflight slice", "docs/TWII_REAL_DECISION_INTAKE_PACKET_TEMPLATE_GATE_PREFLIGHT.md", "twii_real_decision_intake_packet_template_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_REAL_DECISION_INTAKE_PACKET_TEMPLATE_GATE_PREFLIGHT.md` is `accepted` as TWII real decision intake packet template gate preflight", "twii_real_decision_intake_packet_template_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-real-decision-intake-packet-template-gate-preflight.mjs", "name: \"twii-real-decision-intake-packet-template-gate-preflight\"", "\"twii-real-decision-intake-packet-template-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [templatePath, templateText], [docPath, doc], ["real decision template gate stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, templateGateMode: output.templateGateMode, placeholderCount: output.templateValidation.placeholderCount, valuesFilledNow: output.templateValidation.valuesFilledNow, realDecisionValueReadNow: output.templateState.realDecisionValueReadNow, runnerExecutableNow: output.templateState.runnerExecutableNow, executionAllowedNow: output.templateState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
