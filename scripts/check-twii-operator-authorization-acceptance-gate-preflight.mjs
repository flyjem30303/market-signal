import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-twii-operator-authorization-acceptance-gate-preflight.mjs";
const docPath = "docs/TWII_OPERATOR_AUTHORIZATION_ACCEPTANCE_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-operator-authorization-acceptance-gate-preflight.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const gateText = read(gatePath);
const gate = JSON.parse(gateText);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const run = spawnSync(process.execPath, [reportPath], { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true });
const output = parseJson(run.stdout ?? "", "operator authorization acceptance gate stdout");

if (run.status !== 0) problems.push("operator authorization acceptance gate report must exit 0");
if (output.status !== "twii_operator_authorization_acceptance_gate_preflight_ready_no_execution") problems.push("operator authorization acceptance gate status mismatch");
if (output.outcome !== "operator_authorization_acceptance_gate_ready_execution_still_blocked") problems.push("operator authorization acceptance gate outcome mismatch");
if (output.mode !== "twii_operator_authorization_acceptance_gate_preflight_no_execution") problems.push("operator authorization acceptance gate mode mismatch");
if (output.acceptanceGateMode !== "operator_authorization_acceptance_gate_fail_closed_no_execution") problems.push("acceptanceGateMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") problems.push("targetScope must be twii_index_daily_prices_missing_rows");
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");

for (const key of ["acceptanceGatePrepared", "sourceAuthRequestPacketReferenced", "decisionRecordPrepared", "serverOnlyBoundaryReferenced", "failClosedDefaultReferenced", "operatorStopConditionsPrepared", "postRunReviewRequirementReferenced", "aggregateReadbackRequirementReferenced", "rollbackRequirementReferenced", "executeSwitchRequirementReferenced", "confirmationPhraseRequirementReferenced"]) {
  if (output.acceptanceState?.[key] !== true) problems.push(`acceptanceState.${key} must be true`);
}
for (const key of ["acceptedDecisionRecordedNow", "rejectedDecisionRecordedNow", "repairRequiredDecisionRecordedNow", "realExecutionAuthorizationRequestedNow", "realExecutionAuthorizationAcceptedNow", "authorizationDecisionAcceptedNow", "goDecisionAcceptedNow", "noGoDecisionRecordedNow", "exactRuntimeExecutionCommandPrepared", "exactCommandAcceptedNow", "finalExecutionRunPrepared", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) {
  if (output.acceptanceState?.[key] !== false) problems.push(`acceptanceState.${key} must be false`);
}
if (output.candidateState?.candidateArtifactReferenceOnly !== true) problems.push("candidateArtifactReferenceOnly must be true");
for (const key of ["candidateArtifactRowsRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead"]) {
  if (output.candidateState?.[key] !== false) problems.push(`candidateState.${key} must be false`);
}
for (const key of ["sqlExecuted", "supabaseClientImported", "supabaseConnectionAttempted", "supabaseReadsEnabled", "supabaseWritesEnabled", "marketDataFetched", "marketDataIngested", "dailyPricesMutated", "stagingRowsCreated", "candidateRowsAccepted", "rowCoverageScoringAllowed", "envValueOutput", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) {
  if (output.noExecutionState?.[key] !== false) problems.push(`noExecutionState.${key} must be false`);
}

if (pkg.scripts?.["report:twii-operator-authorization-acceptance-gate-preflight"] !== `node ${reportPath}`) problems.push(`${packagePath} missing report script`);
if (pkg.scripts?.["check:twii-operator-authorization-acceptance-gate-preflight"] !== "node scripts/check-twii-operator-authorization-acceptance-gate-preflight.mjs") problems.push(`${packagePath} missing check script`);

for (const phrase of [
  "TWII Operator Authorization Acceptance Gate Preflight",
  "twii_operator_authorization_acceptance_gate_preflight_ready_no_execution",
  "operator_authorization_acceptance_gate_ready_execution_still_blocked",
  "data/source-gates/twii-operator-authorization-acceptance-gate-preflight.json",
  "sourceAuthRequestPacketPath=data/source-gates/twii-real-final-execution-auth-request-packet-preflight.json",
  "acceptanceGateMode=operator_authorization_acceptance_gate_fail_closed_no_execution",
  "acceptanceGatePrepared=true",
  "sourceAuthRequestPacketReferenced=true",
  "decisionRecordPrepared=true",
  "acceptedDecisionRecordedNow=false",
  "rejectedDecisionRecordedNow=false",
  "repairRequiredDecisionRecordedNow=false",
  "realExecutionAuthorizationAcceptedNow=false",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "implementationAllowedNow=false",
  "acceptanceDecisionVocabulary=[accepted,rejected,repair_required,deferred_or_expired]",
  "sqlExecuted=false",
  "supabaseClientImported=false",
  "supabaseConnectionAttempted=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}
for (const phrase of [
  "Latest TWII operator authorization acceptance gate preflight slice",
  "docs/TWII_OPERATOR_AUTHORIZATION_ACCEPTANCE_GATE_PREFLIGHT.md",
  "data/source-gates/twii-operator-authorization-acceptance-gate-preflight.json",
  "twii_operator_authorization_acceptance_gate_preflight_ready_no_execution",
  "operator_authorization_acceptance_gate_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}
for (const phrase of [
  "`docs/TWII_OPERATOR_AUTHORIZATION_ACCEPTANCE_GATE_PREFLIGHT.md` is `accepted` as TWII operator authorization acceptance gate preflight",
  "twii_operator_authorization_acceptance_gate_preflight_ready_no_execution",
  "operator_authorization_acceptance_gate_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}
for (const phrase of [
  "scripts/check-twii-operator-authorization-acceptance-gate-preflight.mjs",
  "name: \"twii-operator-authorization-acceptance-gate-preflight\"",
  "\"twii-operator-authorization-acceptance-gate-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}
for (const [filePath, text] of [[reportPath, reportSource], [docPath, doc], [gatePath, gateText], ["operator authorization acceptance gate stdout", run.stdout ?? ""]]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  status: "ok",
  guardedStatus: output.status,
  acceptedOutcome: output.outcome,
  acceptanceGateMode: output.acceptanceGateMode,
  acceptedDecisionRecordedNow: output.acceptanceState.acceptedDecisionRecordedNow,
  runnerExecutableNow: output.acceptanceState.runnerExecutableNow,
  executionAllowedNow: output.acceptanceState.executionAllowedNow,
  implementationAllowedNow: output.noExecutionState.implementationAllowedNow
}, null, 2));

function forbiddenPatterns() {
  return [
    /from\s+["']@supabase\/supabase-js["']/,
    /createClient\s*\(/,
    /\.from\s*\(/,
    /\.insert\s*\(/,
    /\.upsert\s*\(/,
    /\.update\s*\(/,
    /\.delete\s*\(/,
    /scoreSource\s*[:=]\s*["']real["']/,
    /publicDataSource\s*[:=]\s*["']supabase["']/
  ];
}
function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}
function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} is not JSON: ${error.message}`);
    return {};
  }
}
