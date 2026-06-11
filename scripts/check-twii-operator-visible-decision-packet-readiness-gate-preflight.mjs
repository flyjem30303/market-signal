import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-visible-decision-packet-readiness-gate-preflight.mjs";
const docPath = "docs/TWII_OPERATOR_VISIBLE_DECISION_PACKET_READINESS_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-operator-visible-decision-packet-readiness-gate-preflight.json";
const packetsPath = "data/source-gates/twii-operator-visible-decision-packet-readiness-fixtures.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const packetsText = read(packetsPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "operator visible decision packet readiness stdout");

if (run.status !== 0) problems.push("operator visible decision packet readiness report must exit 0");
if (output.status !== "twii_operator_visible_decision_packet_readiness_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "operator_visible_decision_packet_readiness_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.packetGateMode !== "operator_visible_decision_packet_readiness_fail_closed_no_execution") problems.push("packetGateMode mismatch");
if (output.packetValidation?.packetCount !== 3) problems.push("packetCount must be 3");
if (output.packetValidation?.validPacketCount !== 3) problems.push("validPacketCount must be 3");
for (const statusName of ["accepted", "rejected", "repair_required"]) if (!(output.packetValidation?.observedStatuses ?? []).includes(statusName)) problems.push(`packet missing ${statusName}`);
for (const key of ["packetGatePrepared", "sourceRecorderGateReferenced", "sourceMockRecordsReferenced", "operatorPacketFixturesReferenced", "dryRunOnly", "operatorPacketOnly", "acceptedPacketPrepared", "rejectedPacketPrepared", "repairRequiredPacketPrepared", "packetsDerivedFromMockRecords"]) if (output.packetState?.[key] !== true) problems.push(`packetState.${key} must be true`);
for (const key of ["realDecisionValueReadNow", "realDecisionValueRecordedNow", "operatorPacketAcceptedAsReal", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.packetState?.[key] !== false) problems.push(`packetState.${key} must be false`);
if (output.packetState?.operatorReviewStatusDefault !== "pending_operator_review") problems.push("operatorReviewStatusDefault mismatch");
if (pkg.scripts?.["report:twii-operator-visible-decision-packet-readiness-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-visible-decision-packet-readiness-gate-preflight"] !== "node scripts/check-twii-operator-visible-decision-packet-readiness-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Operator Visible Decision Packet Readiness Gate Preflight", "twii_operator_visible_decision_packet_readiness_gate_preflight_ready_no_execution", "operator_visible_decision_packet_readiness_ready_execution_still_blocked", "packetGateMode=operator_visible_decision_packet_readiness_fail_closed_no_execution", "dryRunOnly=true", "operatorPacketOnly=true", "acceptedPacketPrepared=true", "rejectedPacketPrepared=true", "repairRequiredPacketPrepared=true", "packetsDerivedFromMockRecords=true", "operatorReviewStatusDefault=pending_operator_review", "realDecisionValueReadNow=false", "realDecisionValueRecordedNow=false", "operatorPacketAcceptedAsReal=false", "acceptedDecisionRecordedNow=false", "rejectedDecisionRecordedNow=false", "repairRequiredDecisionRecordedNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["Latest TWII operator-visible decision packet readiness gate preflight slice", "docs/TWII_OPERATOR_VISIBLE_DECISION_PACKET_READINESS_GATE_PREFLIGHT.md", "twii_operator_visible_decision_packet_readiness_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_OPERATOR_VISIBLE_DECISION_PACKET_READINESS_GATE_PREFLIGHT.md` is `accepted` as TWII operator-visible decision packet readiness gate preflight", "twii_operator_visible_decision_packet_readiness_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-operator-visible-decision-packet-readiness-gate-preflight.mjs", "name: \"twii-operator-visible-decision-packet-readiness-gate-preflight\"", "\"twii-operator-visible-decision-packet-readiness-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [packetsPath, packetsText], [docPath, doc], ["operator visible decision packet readiness stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, packetGateMode: output.packetGateMode, packetCount: output.packetValidation.packetCount, validPacketCount: output.packetValidation.validPacketCount, operatorPacketOnly: output.packetState.operatorPacketOnly, operatorReviewStatusDefault: output.packetState.operatorReviewStatusDefault, realDecisionValueReadNow: output.packetState.realDecisionValueReadNow, runnerExecutableNow: output.packetState.runnerExecutableNow, executionAllowedNow: output.packetState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
