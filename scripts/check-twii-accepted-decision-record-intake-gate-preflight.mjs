import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-accepted-decision-record-intake-gate-preflight.mjs";
const docPath = "docs/TWII_ACCEPTED_DECISION_RECORD_INTAKE_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-accepted-decision-record-intake-gate-preflight.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const gateText = read(gatePath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "accepted decision record intake gate stdout");

if (run.status !== 0) problems.push("accepted decision record intake gate report must exit 0");
if (output.status !== "twii_accepted_decision_record_intake_gate_preflight_ready_no_execution") problems.push("accepted decision record intake gate status mismatch");
if (output.outcome !== "accepted_decision_record_intake_gate_ready_execution_still_blocked") problems.push("accepted decision record intake gate outcome mismatch");
if (output.mode !== "twii_accepted_decision_record_intake_gate_preflight_no_execution") problems.push("accepted decision record intake gate mode mismatch");
if (output.intakeGateMode !== "accepted_decision_record_intake_gate_fail_closed_no_execution") problems.push("intakeGateMode mismatch");

for (const key of ["intakeGatePrepared", "sourceAcceptanceGateReferenced", "decisionIntakeSchemaPrepared", "serverOnlyBoundaryReferenced", "failClosedDefaultReferenced", "operatorStopConditionsPrepared", "postRunReviewRequirementReferenced", "aggregateReadbackRequirementReferenced", "rollbackRequirementReferenced", "executeSwitchRequirementReferenced", "confirmationPhraseRequirementReferenced"]) if (output.intakeState?.[key] !== true) problems.push(`intakeState.${key} must be true`);
for (const key of ["decisionValueReadNow", "decisionValueRecordedNow", "acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "realExecutionAuthorizationAcceptedNow", "authorizationDecisionAcceptedNow", "goDecisionAcceptedNow", "noGoDecisionRecordedNow", "exactRuntimeExecutionCommandPrepared", "exactCommandAcceptedNow", "finalExecutionRunPrepared", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.intakeState?.[key] !== false) problems.push(`intakeState.${key} must be false`);
if (output.candidateState?.candidateArtifactReferenceOnly !== true) problems.push("candidateArtifactReferenceOnly must be true");
for (const key of ["candidateArtifactRowsRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead"]) if (output.candidateState?.[key] !== false) problems.push(`candidateState.${key} must be false`);
for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "envValueOutput", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) if (output.noExecutionState?.[key] !== false) problems.push(`noExecutionState.${key} must be false`);

if (pkg.scripts?.["report:twii-accepted-decision-record-intake-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-accepted-decision-record-intake-gate-preflight"] !== "node scripts/check-twii-accepted-decision-record-intake-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);

for (const phrase of [
  "TWII Accepted Decision Record Intake Gate Preflight",
  "twii_accepted_decision_record_intake_gate_preflight_ready_no_execution",
  "accepted_decision_record_intake_gate_ready_execution_still_blocked",
  "data/source-gates/twii-accepted-decision-record-intake-gate-preflight.json",
  "sourceAcceptanceGatePath=data/source-gates/twii-operator-authorization-acceptance-gate-preflight.json",
  "intakeGateMode=accepted_decision_record_intake_gate_fail_closed_no_execution",
  "intakeGatePrepared=true",
  "sourceAcceptanceGateReferenced=true",
  "decisionIntakeSchemaPrepared=true",
  "decisionValueReadNow=false",
  "decisionValueRecordedNow=false",
  "acceptedDecisionRecordedNow=false",
  "rejectedDecisionRecordedNow=false",
  "repairRequiredDecisionRecordedNow=false",
  "realExecutionAuthorizationAcceptedNow=false",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "implementationAllowedNow=false",
  "decisionIntakeVocabulary=[accepted,rejected,repair_required,deferred_or_expired]",
  "sqlExecuted=false",
  "supabaseClientImported=false",
  "supabaseConnectionAttempted=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "does not authorize SQL"
]) if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);

for (const phrase of ["Latest TWII accepted decision record intake gate preflight slice", "docs/TWII_ACCEPTED_DECISION_RECORD_INTAKE_GATE_PREFLIGHT.md", "data/source-gates/twii-accepted-decision-record-intake-gate-preflight.json", "twii_accepted_decision_record_intake_gate_preflight_ready_no_execution", "accepted_decision_record_intake_gate_ready_execution_still_blocked"]) if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
for (const phrase of ["`docs/TWII_ACCEPTED_DECISION_RECORD_INTAKE_GATE_PREFLIGHT.md` is `accepted` as TWII accepted decision record intake gate preflight", "twii_accepted_decision_record_intake_gate_preflight_ready_no_execution", "accepted_decision_record_intake_gate_ready_execution_still_blocked"]) if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
for (const phrase of ["scripts/check-twii-accepted-decision-record-intake-gate-preflight.mjs", "name: \"twii-accepted-decision-record-intake-gate-preflight\"", "\"twii-accepted-decision-record-intake-gate-preflight\""]) if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
for (const [filePath, text] of [[reportPath, reportSource], [docPath, doc], [gatePath, gateText], ["accepted decision record intake gate stdout", run.stdout ?? ""]]) for (const pattern of forbiddenPatterns()) if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: "ok", guardedStatus: output.status, acceptedOutcome: output.outcome, intakeGateMode: output.intakeGateMode, decisionValueReadNow: output.intakeState.decisionValueReadNow, acceptedDecisionRecordedNow: output.intakeState.acceptedDecisionRecordedNow, runnerExecutableNow: output.intakeState.runnerExecutableNow, executionAllowedNow: output.intakeState.executionAllowedNow, implementationAllowedNow: output.noExecutionState.implementationAllowedNow }, null, 2));

function forbiddenPatterns() {
  return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/];
}
function read(filePath) { return fs.readFileSync(filePath, "utf8"); }
function parseJson(text, label) { try { return JSON.parse(text); } catch (error) { problems.push(`${label} is not JSON: ${error.message}`); return {}; } }
