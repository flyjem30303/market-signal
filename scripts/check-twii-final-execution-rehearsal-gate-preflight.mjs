import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-final-execution-rehearsal-gate-preflight.mjs";
const docPath = "docs/TWII_FINAL_EXECUTION_REHEARSAL_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-final-execution-rehearsal-gate-preflight.json";
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

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

const output = parseJson(run.stdout ?? "", "final execution rehearsal gate stdout");
if (run.status !== 0) problems.push("final execution rehearsal gate report must exit 0");
if (output.status !== "twii_final_execution_rehearsal_gate_preflight_ready_no_execution") {
  problems.push("final execution rehearsal gate status mismatch");
}
if (output.outcome !== "final_execution_rehearsal_ready_execution_still_blocked") {
  problems.push("final execution rehearsal gate outcome mismatch");
}
if (output.mode !== "twii_final_execution_rehearsal_gate_preflight_no_execution") {
  problems.push("final execution rehearsal gate mode mismatch");
}
if (output.rehearsalMode !== "final_execution_rehearsal_fail_closed_no_execution") {
  problems.push("rehearsalMode mismatch");
}
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");

assertGate(gate);
assertRehearsalState(output.rehearsalState ?? {});
assertAuthorizationValuesState(output.authorizationValuesState ?? {});
assertCandidateState(output.candidateState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-final-execution-rehearsal-gate-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-final-execution-rehearsal-gate-preflight`);
}
if (
  pkg.scripts?.["check:twii-final-execution-rehearsal-gate-preflight"] !==
  "node scripts/check-twii-final-execution-rehearsal-gate-preflight.mjs"
) {
  problems.push(`${packagePath} missing check:twii-final-execution-rehearsal-gate-preflight`);
}

for (const phrase of [
  "TWII Final Execution Rehearsal Gate Preflight",
  "twii_final_execution_rehearsal_gate_preflight_ready_no_execution",
  "final_execution_rehearsal_ready_execution_still_blocked",
  "data/source-gates/twii-final-execution-rehearsal-gate-preflight.json",
  "sourceGoNoGoGatePath=data/source-gates/twii-final-execution-run-authorization-go-no-go-gate-preflight.json",
  "candidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
  "rehearsalMode=final_execution_rehearsal_fail_closed_no_execution",
  "rehearsalPrepared=true",
  "sourceGoNoGoGateReferenced=true",
  "goDecisionAcceptedNow=false",
  "noGoDecisionRecordedNow=false",
  "exactRuntimeExecutionCommandPrepared=false",
  "exactCommandAcceptedNow=false",
  "finalExecutionRunPrepared=false",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "finalExecutionAllowedNow=false",
  "implementationAllowedNow=false",
  "candidateArtifactReferenceOnly=true",
  "candidateArtifactRowsRead=false",
  "rowPayloadRead=false",
  "rawPayloadRead=false",
  "authorizationValuesRead=false",
  "executeSwitchValueRead=false",
  "confirmationPhraseValueRead=false",
  "requiredExecuteSwitchName=TWII_ONE_ATTEMPT_EXECUTE",
  "requiredConfirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
  "rehearsalArtifacts=[source_go_no_go_gate,server_only_boundary,fail_closed_default,operator_stop_conditions,post_run_review,aggregate_readback,rollback_readiness,promotion_lock,public_copy_guard]",
  "sqlExecuted=false",
  "supabaseClientImported=false",
  "supabaseConnectionAttempted=false",
  "supabaseWritesEnabled=false",
  "supabaseReadsEnabled=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII final execution rehearsal gate preflight slice",
  "docs/TWII_FINAL_EXECUTION_REHEARSAL_GATE_PREFLIGHT.md",
  "data/source-gates/twii-final-execution-rehearsal-gate-preflight.json",
  "twii_final_execution_rehearsal_gate_preflight_ready_no_execution",
  "final_execution_rehearsal_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_FINAL_EXECUTION_REHEARSAL_GATE_PREFLIGHT.md` is `accepted` as TWII final execution rehearsal gate preflight",
  "twii_final_execution_rehearsal_gate_preflight_ready_no_execution",
  "final_execution_rehearsal_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-final-execution-rehearsal-gate-preflight.mjs",
  "name: \"twii-final-execution-rehearsal-gate-preflight\"",
  "\"twii-final-execution-rehearsal-gate-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, gateText],
  ["final execution rehearsal gate stdout", run.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: output.status,
      acceptedOutcome: output.outcome,
      rehearsalMode: output.rehearsalMode,
      goDecisionAcceptedNow: output.rehearsalState.goDecisionAcceptedNow,
      runnerExecutableNow: output.rehearsalState.runnerExecutableNow,
      executionAllowedNow: output.rehearsalState.executionAllowedNow,
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_final_execution_rehearsal_gate_preflight",
    sourceGoNoGoGatePath: "data/source-gates/twii-final-execution-run-authorization-go-no-go-gate-preflight.json",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    rehearsalMode: "final_execution_rehearsal_fail_closed_no_execution",
    rehearsalPrepared: true,
    sourceGoNoGoGateReferenced: true,
    goDecisionAcceptedNow: false,
    noGoDecisionRecordedNow: false,
    exactRuntimeExecutionCommandPrepared: false,
    exactCommandAcceptedNow: false,
    finalExecutionRunPrepared: false,
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    rehearsalDecision: "final_execution_rehearsal_ready_but_execution_still_blocked",
    nextIfRehearsalAccepted: "operator_may_request_real_final_execution_run_authorization_in_separate_step",
    nextIfRehearsalBlocked: "repair_pre_execution_contracts_before_any_real_execution_attempt",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertRehearsalState(state) {
  for (const key of [
    "rehearsalPrepared",
    "sourceGoNoGoGateReferenced",
    "serverOnlyBoundaryReferenced",
    "failClosedDefaultReferenced",
    "operatorStopConditionsPrepared",
    "postRunReviewRequirementReferenced",
    "aggregateReadbackRequirementReferenced",
    "rollbackRequirementReferenced",
    "executeSwitchRequirementReferenced",
    "confirmationPhraseRequirementReferenced"
  ]) {
    if (state[key] !== true) problems.push(`rehearsalState.${key} must be true`);
  }
  for (const key of ["goDecisionAcceptedNow", "noGoDecisionRecordedNow", "exactRuntimeExecutionCommandPrepared", "exactCommandAcceptedNow", "finalExecutionRunPrepared", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) {
    if (state[key] !== false) problems.push(`rehearsalState.${key} must be false`);
  }
}

function assertAuthorizationValuesState(state) {
  for (const key of ["goDecisionAcceptedNow", "noGoDecisionRecordedNow", "exactCommandAcceptedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "envValueOutput"]) {
    if (state[key] !== false) problems.push(`authorizationValuesState.${key} must be false`);
  }
}

function assertCandidateState(state) {
  if (state.candidateArtifactReferenceOnly !== true) problems.push("candidateState.candidateArtifactReferenceOnly must be true");
  for (const key of ["candidateArtifactRowsRead", "sourcePayloadRead", "rowPayloadRead", "rawPayloadRead"]) {
    if (state[key] !== false) problems.push(`candidateState.${key} must be false`);
  }
}

function assertNoExecutionState(state) {
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "envValueOutput",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "finalExecutionAllowedNow",
    "implementationAllowedNow"
  ]) {
    if (state[key] !== false) problems.push(`noExecutionState.${key} must be false`);
  }
}

function assertSafety(safety) {
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  if (safety.candidateArtifactReferenceOnly !== true) problems.push("safety.candidateArtifactReferenceOnly must be true");
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "goDecisionAcceptedNow",
    "noGoDecisionRecordedNow",
    "exactCommandAcceptedNow",
    "authorizationValuesRead",
    "executeSwitchValueRead",
    "confirmationPhraseValueRead",
    "credentialValuesRead",
    "sourcePayloadRead",
    "rowPayloadRead",
    "rawPayloadRead",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "envValueOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

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
