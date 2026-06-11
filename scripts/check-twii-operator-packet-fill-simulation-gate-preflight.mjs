import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-packet-fill-simulation-gate-preflight.mjs";
const docPath = "docs/TWII_OPERATOR_PACKET_FILL_SIMULATION_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-operator-packet-fill-simulation-gate-preflight.json";
const simulationsPath = "data/source-gates/twii-operator-packet-fill-simulation-fixtures.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const simulationsText = read(simulationsPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "operator packet fill simulation stdout");

if (run.status !== 0) problems.push("operator packet fill simulation report must exit 0");
if (output.status !== "twii_operator_packet_fill_simulation_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "operator_packet_fill_simulation_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.fillSimulationGateMode !== "operator_packet_fill_simulation_fail_closed_no_execution") problems.push("fillSimulationGateMode mismatch");
if (output.simulationValidation?.simulationCount !== 3) problems.push("simulationCount must be 3");
if (output.simulationValidation?.validSimulationCount !== 3) problems.push("validSimulationCount must be 3");
for (const statusName of ["accepted", "rejected", "repair_required"]) if (!(output.simulationValidation?.observedStatuses ?? []).includes(statusName)) problems.push(`simulation missing ${statusName}`);
for (const key of ["fillSimulationGatePrepared", "sourcePacketGateReferenced", "sourcePacketFixturesReferenced", "fillSimulationFixturesReferenced", "dryRunOnly", "placeholderOnly", "acceptedFillSimulationPrepared", "rejectedFillSimulationPrepared", "repairRequiredFillSimulationPrepared", "simulationsDerivedFromOperatorPackets"]) if (output.simulationState?.[key] !== true) problems.push(`simulationState.${key} must be true`);
for (const key of ["realDecisionValueReadNow", "realDecisionValueRecordedNow", "simulatedFillAcceptedAsReal", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.simulationState?.[key] !== false) problems.push(`simulationState.${key} must be false`);
if (pkg.scripts?.["report:twii-operator-packet-fill-simulation-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-packet-fill-simulation-gate-preflight"] !== "node scripts/check-twii-operator-packet-fill-simulation-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Operator Packet Fill Simulation Gate Preflight", "twii_operator_packet_fill_simulation_gate_preflight_ready_no_execution", "operator_packet_fill_simulation_ready_execution_still_blocked", "fillSimulationGateMode=operator_packet_fill_simulation_fail_closed_no_execution", "dryRunOnly=true", "placeholderOnly=true", "acceptedFillSimulationPrepared=true", "rejectedFillSimulationPrepared=true", "repairRequiredFillSimulationPrepared=true", "simulationsDerivedFromOperatorPackets=true", "realDecisionValueReadNow=false", "realDecisionValueRecordedNow=false", "simulatedFillAcceptedAsReal=false", "acceptedDecisionRecordedNow=false", "rejectedDecisionRecordedNow=false", "repairRequiredDecisionRecordedNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["Latest TWII operator packet fill simulation gate preflight slice", "docs/TWII_OPERATOR_PACKET_FILL_SIMULATION_GATE_PREFLIGHT.md", "twii_operator_packet_fill_simulation_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_OPERATOR_PACKET_FILL_SIMULATION_GATE_PREFLIGHT.md` is `accepted` as TWII operator packet fill simulation gate preflight", "twii_operator_packet_fill_simulation_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-operator-packet-fill-simulation-gate-preflight.mjs", "name: \"twii-operator-packet-fill-simulation-gate-preflight\"", "\"twii-operator-packet-fill-simulation-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [simulationsPath, simulationsText], [docPath, doc], ["operator packet fill simulation stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, fillSimulationGateMode: output.fillSimulationGateMode, simulationCount: output.simulationValidation.simulationCount, validSimulationCount: output.simulationValidation.validSimulationCount, placeholderOnly: output.simulationState.placeholderOnly, realDecisionValueReadNow: output.simulationState.realDecisionValueReadNow, runnerExecutableNow: output.simulationState.runnerExecutableNow, executionAllowedNow: output.simulationState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
