import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-real-operator-packet-intake-blocker-gate-preflight.mjs";
const docPath = "docs/TWII_REAL_OPERATOR_PACKET_INTAKE_BLOCKER_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-real-operator-packet-intake-blocker-gate-preflight.json";
const requirementsPath = "data/source-gates/twii-real-operator-packet-intake-blocker-requirements.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const requirementsText = read(requirementsPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "real operator packet intake blocker stdout");

if (run.status !== 0) problems.push("real operator packet intake blocker report must exit 0");
if (output.status !== "twii_real_operator_packet_intake_blocker_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "real_operator_packet_intake_blocker_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.blockerGateMode !== "real_operator_packet_intake_blocker_fail_closed_no_execution") problems.push("blockerGateMode mismatch");
if (output.blockerValidation?.requiredRealIntakeFieldCount !== 10) problems.push("requiredRealIntakeFieldCount must be 10");
if (output.blockerValidation?.currentBlockerCount !== 2) problems.push("currentBlockerCount must be 2");
for (const key of ["blockerGatePrepared", "sourceFillSimulationGateReferenced", "sourceFillSimulationFixturesReferenced", "blockerRequirementsReferenced", "blockerOnly", "realValuesRequiredForFutureIntake", "missingRealValuesBlockerPrepared", "pendingOperatorReviewBlockerPrepared", "repairRequiredBlockerPrepared"]) if (output.blockerState?.[key] !== true) problems.push(`blockerState.${key} must be true`);
for (const key of ["realValuesProvidedNow", "realDecisionValueReadNow", "realDecisionValueRecordedNow", "realOperatorPacketAcceptedNow", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.blockerState?.[key] !== false) problems.push(`blockerState.${key} must be false`);
if (pkg.scripts?.["report:twii-real-operator-packet-intake-blocker-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-real-operator-packet-intake-blocker-gate-preflight"] !== "node scripts/check-twii-real-operator-packet-intake-blocker-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Real Operator Packet Intake Blocker Gate Preflight", "twii_real_operator_packet_intake_blocker_gate_preflight_ready_no_execution", "real_operator_packet_intake_blocker_ready_execution_still_blocked", "blockerGateMode=real_operator_packet_intake_blocker_fail_closed_no_execution", "blockerOnly=true", "realValuesRequiredForFutureIntake=true", "realValuesProvidedNow=false", "missingRealValuesBlockerPrepared=true", "pendingOperatorReviewBlockerPrepared=true", "repairRequiredBlockerPrepared=true", "realDecisionValueReadNow=false", "realDecisionValueRecordedNow=false", "realOperatorPacketAcceptedNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["Latest TWII real operator packet intake blocker gate preflight slice", "docs/TWII_REAL_OPERATOR_PACKET_INTAKE_BLOCKER_GATE_PREFLIGHT.md", "twii_real_operator_packet_intake_blocker_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_REAL_OPERATOR_PACKET_INTAKE_BLOCKER_GATE_PREFLIGHT.md` is `accepted` as TWII real operator packet intake blocker gate preflight", "twii_real_operator_packet_intake_blocker_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-real-operator-packet-intake-blocker-gate-preflight.mjs", "name: \"twii-real-operator-packet-intake-blocker-gate-preflight\"", "\"twii-real-operator-packet-intake-blocker-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [requirementsPath, requirementsText], [docPath, doc], ["real operator packet intake blocker stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, blockerGateMode: output.blockerGateMode, requiredRealIntakeFieldCount: output.blockerValidation.requiredRealIntakeFieldCount, currentBlockerCount: output.blockerValidation.currentBlockerCount, blockerOnly: output.blockerState.blockerOnly, realValuesProvidedNow: output.blockerState.realValuesProvidedNow, realDecisionValueReadNow: output.blockerState.realDecisionValueReadNow, runnerExecutableNow: output.blockerState.runnerExecutableNow, executionAllowedNow: output.blockerState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
