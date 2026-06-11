import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-final-execution-run-authorization-go-no-go-gate-preflight.mjs";
const docPath = "docs/TWII_FINAL_EXECUTION_RUN_AUTHORIZATION_GO_NO_GO_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-final-execution-run-authorization-go-no-go-gate-preflight.json";
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

const output = parseJson(run.stdout ?? "", "final execution run authorization go/no-go gate stdout");
if (run.status !== 0) problems.push("final execution run authorization go/no-go gate report must exit 0");
if (output.status !== "twii_final_execution_run_authorization_go_no_go_gate_preflight_ready_no_execution") {
  problems.push("final execution run authorization go/no-go gate status mismatch");
}
if (output.outcome !== "final_execution_run_go_no_go_gate_ready_execution_still_blocked") {
  problems.push("final execution run authorization go/no-go gate outcome mismatch");
}
if (output.mode !== "twii_final_execution_run_authorization_go_no_go_gate_preflight_no_execution") {
  problems.push("final execution run authorization go/no-go gate mode mismatch");
}
if (output.goNoGoGateMode !== "final_execution_run_authorization_blocker_go_no_go_gate_fail_closed_no_execution") {
  problems.push("goNoGoGateMode mismatch");
}
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");

assertGate(gate);
assertGoNoGoGateState(output.goNoGoGateState ?? {});
assertAuthorizationValuesState(output.authorizationValuesState ?? {});
assertCandidateState(output.candidateState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-final-execution-run-authorization-go-no-go-gate-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-final-execution-run-authorization-go-no-go-gate-preflight`);
}
if (
  pkg.scripts?.["check:twii-final-execution-run-authorization-go-no-go-gate-preflight"] !==
  "node scripts/check-twii-final-execution-run-authorization-go-no-go-gate-preflight.mjs"
) {
  problems.push(`${packagePath} missing check:twii-final-execution-run-authorization-go-no-go-gate-preflight`);
}

for (const phrase of [
  "TWII Final Execution Run Authorization Go/No-Go Gate Preflight",
  "twii_final_execution_run_authorization_go_no_go_gate_preflight_ready_no_execution",
  "final_execution_run_go_no_go_gate_ready_execution_still_blocked",
  "data/source-gates/twii-final-execution-run-authorization-go-no-go-gate-preflight.json",
  "sourceCommandPreparationGatePath=data/source-gates/twii-exact-runtime-execution-command-preparation-gate-preflight.json",
  "candidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
  "goNoGoGateMode=final_execution_run_authorization_blocker_go_no_go_gate_fail_closed_no_execution",
  "goNoGoGatePrepared=true",
  "commandPreparationGateReferenced=true",
  "finalExecutionRunAuthorizationRequired=true",
  "goDecisionAcceptedNow=false",
  "noGoDecisionRecordedNow=false",
  "exactRuntimeExecutionCommandPrepared=false",
  "exactCommandAcceptedNow=false",
  "authorizationDecisionAcceptedNow=false",
  "explicitAttemptDecisionAcceptedNow=false",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
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
  "goNoGoDecisionVocabulary=[go_for_final_execution_run_preparation,no_go,repair_required,deferred_or_expired]",
  "requiredGoNoGoArtifacts=[source_command_preparation_gate,source_decision_gate,source_operator_packet,server_only_boundary,fail_closed_default,post_run_review,aggregate_readback,rollback_readiness,promotion_lock]",
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
  "Latest TWII final execution run authorization go/no-go gate preflight slice",
  "docs/TWII_FINAL_EXECUTION_RUN_AUTHORIZATION_GO_NO_GO_GATE_PREFLIGHT.md",
  "data/source-gates/twii-final-execution-run-authorization-go-no-go-gate-preflight.json",
  "twii_final_execution_run_authorization_go_no_go_gate_preflight_ready_no_execution",
  "final_execution_run_go_no_go_gate_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_FINAL_EXECUTION_RUN_AUTHORIZATION_GO_NO_GO_GATE_PREFLIGHT.md` is `accepted` as TWII final execution run authorization go/no-go gate preflight",
  "twii_final_execution_run_authorization_go_no_go_gate_preflight_ready_no_execution",
  "final_execution_run_go_no_go_gate_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-final-execution-run-authorization-go-no-go-gate-preflight.mjs",
  "name: \"twii-final-execution-run-authorization-go-no-go-gate-preflight\"",
  "\"twii-final-execution-run-authorization-go-no-go-gate-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, gateText],
  ["final execution run authorization go/no-go gate stdout", run.stdout ?? ""]
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
      goNoGoGateMode: output.goNoGoGateMode,
      goDecisionAcceptedNow: output.goNoGoGateState.goDecisionAcceptedNow,
      noGoDecisionRecordedNow: output.goNoGoGateState.noGoDecisionRecordedNow,
      runnerExecutableNow: output.goNoGoGateState.runnerExecutableNow,
      executionAllowedNow: output.goNoGoGateState.executionAllowedNow,
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_final_execution_run_authorization_go_no_go_gate_preflight",
    sourceCommandPreparationGatePath: "data/source-gates/twii-exact-runtime-execution-command-preparation-gate-preflight.json",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    goNoGoGateMode: "final_execution_run_authorization_blocker_go_no_go_gate_fail_closed_no_execution",
    goNoGoGatePrepared: true,
    commandPreparationGateReferenced: true,
    finalExecutionRunAuthorizationRequired: true,
    goDecisionAcceptedNow: false,
    noGoDecisionRecordedNow: false,
    exactRuntimeExecutionCommandPrepared: false,
    exactCommandAcceptedNow: false,
    authorizationDecisionAcceptedNow: false,
    explicitAttemptDecisionAcceptedNow: false,
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
    goNoGoGateDecision: "final_execution_run_go_no_go_gate_ready_but_go_not_accepted_and_execution_blocked",
    nextIfGoAccepted: "operator_may_prepare_final_execution_run_in_separate_step",
    nextIfNoGoRecorded: "keep_runtime_write_attempt_blocked_and_record_no_go_reason",
    nextIfDecisionDeferred: "refresh_exact_command_preparation_gate_before_any_go_decision",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertGoNoGoGateState(state) {
  for (const key of [
    "goNoGoGatePrepared",
    "commandPreparationGateReferenced",
    "finalExecutionRunAuthorizationRequired",
    "serverOnlyBoundaryReferenced",
    "failClosedDefaultReferenced",
    "postRunReviewRequirementReferenced",
    "aggregateReadbackRequirementReferenced",
    "rollbackRequirementReferenced",
    "executeSwitchRequirementReferenced",
    "confirmationPhraseRequirementReferenced"
  ]) {
    if (state[key] !== true) problems.push(`goNoGoGateState.${key} must be true`);
  }
  for (const key of ["goDecisionAcceptedNow", "noGoDecisionRecordedNow", "exactRuntimeExecutionCommandPrepared", "exactCommandAcceptedNow", "authorizationDecisionAcceptedNow", "explicitAttemptDecisionAcceptedNow", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) {
    if (state[key] !== false) problems.push(`goNoGoGateState.${key} must be false`);
  }
}

function assertAuthorizationValuesState(state) {
  for (const key of ["authorizationDecisionAcceptedNow", "explicitAttemptDecisionAcceptedNow", "exactCommandAcceptedNow", "goDecisionAcceptedNow", "noGoDecisionRecordedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "envValueOutput"]) {
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
    "implementationAllowedNow"
  ]) {
    if (state[key] !== false) problems.push(`noExecutionState.${key} must be false`);
  }
}

function assertSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("safety must stay publicDataSource=mock and scoreSource=mock");
  }
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
    "authorizationDecisionAcceptedNow",
    "explicitAttemptDecisionAcceptedNow",
    "exactCommandAcceptedNow",
    "goDecisionAcceptedNow",
    "noGoDecisionRecordedNow",
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
    /@supabase\/supabase-js/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /createClient\(/u,
    /SUPABASE_SERVICE_ROLE_KEY=/u,
    /NEXT_PUBLIC_SUPABASE_URL=/u,
    /-----BEGIN/u,
    /eyJ[a-zA-Z0-9_-]{20,}/u
  ];
}

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} must be JSON: ${error.message}`);
    return {};
  }
}
