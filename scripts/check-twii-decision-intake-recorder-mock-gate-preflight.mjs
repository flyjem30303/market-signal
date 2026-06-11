import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-decision-intake-recorder-mock-gate-preflight.mjs";
const docPath = "docs/TWII_DECISION_INTAKE_RECORDER_MOCK_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-decision-intake-recorder-mock-gate-preflight.json";
const recordsPath = "data/source-gates/twii-decision-intake-recorder-mock-records.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const gateText = read(gatePath);
const recordsText = read(recordsPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "decision intake recorder mock stdout");

if (run.status !== 0) problems.push("decision intake recorder mock report must exit 0");
if (output.status !== "twii_decision_intake_recorder_mock_gate_preflight_ready_no_execution") problems.push("status mismatch");
if (output.outcome !== "decision_intake_recorder_mock_ready_execution_still_blocked") problems.push("outcome mismatch");
if (output.recorderGateMode !== "decision_intake_recorder_mock_fail_closed_no_execution") problems.push("recorderGateMode mismatch");
if (output.recorderValidation?.recordCount !== 3) problems.push("recordCount must be 3");
if (output.recorderValidation?.validRecordCount !== 3) problems.push("validRecordCount must be 3");
for (const statusName of ["accepted", "rejected", "repair_required"]) if (!(output.recorderValidation?.observedStatuses ?? []).includes(statusName)) problems.push(`record missing ${statusName}`);
for (const key of ["recorderGatePrepared", "sourceDryRunGateReferenced", "sourceDryRunFixturesReferenced", "mockRecordsReferenced", "dryRunOnly", "mockRecorderOnly", "acceptedRecordMockPrepared", "rejectedRecordMockPrepared", "repairRequiredRecordMockPrepared", "recordsDerivedFromSyntheticFixtures"]) if (output.recorderState?.[key] !== true) problems.push(`recorderState.${key} must be true`);
for (const key of ["realDecisionValueReadNow", "realDecisionValueRecordedNow", "mockRecordAcceptedAsReal", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "runnerExecutableNow", "executionAllowedNow", "implementationAllowedNow"]) if (output.recorderState?.[key] !== false) problems.push(`recorderState.${key} must be false`);
if (pkg.scripts?.["report:twii-decision-intake-recorder-mock-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-decision-intake-recorder-mock-gate-preflight"] !== "node scripts/check-twii-decision-intake-recorder-mock-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);
for (const phrase of ["TWII Decision Intake Recorder Mock Gate Preflight", "twii_decision_intake_recorder_mock_gate_preflight_ready_no_execution", "decision_intake_recorder_mock_ready_execution_still_blocked", "recorderGateMode=decision_intake_recorder_mock_fail_closed_no_execution", "dryRunOnly=true", "mockRecorderOnly=true", "acceptedRecordMockPrepared=true", "rejectedRecordMockPrepared=true", "repairRequiredRecordMockPrepared=true", "recordsDerivedFromSyntheticFixtures=true", "realDecisionValueReadNow=false", "realDecisionValueRecordedNow=false", "mockRecordAcceptedAsReal=false", "acceptedDecisionRecordedNow=false", "rejectedDecisionRecordedNow=false", "repairRequiredDecisionRecordedNow=false", "runnerExecutableNow=false", "executionAllowedNow=false", "publicDataSource=mock", "scoreSource=mock", "sqlExecuted=false", "supabaseClientImported=false", "supabaseConnectionAttempted=false", "dailyPricesMutated=false", "candidateRowsAccepted=false"]) if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
for (const phrase of ["Latest TWII decision intake recorder mock gate preflight slice", "docs/TWII_DECISION_INTAKE_RECORDER_MOCK_GATE_PREFLIGHT.md", "twii_decision_intake_recorder_mock_gate_preflight_ready_no_execution"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing ${phrase}`);
for (const phrase of ["`docs/TWII_DECISION_INTAKE_RECORDER_MOCK_GATE_PREFLIGHT.md` is `accepted` as TWII decision intake recorder mock gate preflight", "twii_decision_intake_recorder_mock_gate_preflight_ready_no_execution"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing ${phrase}`);
for (const phrase of ["scripts/check-twii-decision-intake-recorder-mock-gate-preflight.mjs", "name: \"twii-decision-intake-recorder-mock-gate-preflight\"", "\"twii-decision-intake-recorder-mock-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
for (const [filePath, text] of [[gatePath, gateText], [recordsPath, recordsText], [docPath, doc], ["decision intake recorder mock stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
if (problems.length > 0) { console.error(JSON.stringify({ status: "blocked", problems }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, recorderGateMode: output.recorderGateMode, recordCount: output.recorderValidation.recordCount, validRecordCount: output.recorderValidation.validRecordCount, mockRecorderOnly: output.recorderState.mockRecorderOnly, realDecisionValueReadNow: output.recorderState.realDecisionValueReadNow, runnerExecutableNow: output.recorderState.runnerExecutableNow, executionAllowedNow: output.recorderState.executionAllowedNow }, null, 2));

function forbiddenPatterns() { return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/]; }
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
