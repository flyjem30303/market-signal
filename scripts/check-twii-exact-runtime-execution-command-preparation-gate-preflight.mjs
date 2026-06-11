import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-exact-runtime-execution-command-preparation-gate-preflight.mjs";
const docPath = "docs/TWII_EXACT_RUNTIME_EXECUTION_COMMAND_PREPARATION_GATE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-exact-runtime-execution-command-preparation-gate-preflight.json";
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

const output = parseJson(run.stdout ?? "", "exact runtime execution command preparation gate stdout");
if (run.status !== 0) problems.push("exact runtime execution command preparation gate report must exit 0");
if (output.status !== "twii_exact_runtime_execution_command_preparation_gate_preflight_ready_no_execution") {
  problems.push("exact runtime execution command preparation gate status mismatch");
}
if (output.outcome !== "exact_runtime_execution_command_preparation_gate_ready_execution_still_blocked") {
  problems.push("exact runtime execution command preparation gate outcome mismatch");
}
if (output.mode !== "twii_exact_runtime_execution_command_preparation_gate_preflight_no_execution") {
  problems.push("exact runtime execution command preparation gate mode mismatch");
}
if (output.commandPreparationMode !== "exact_runtime_execution_command_preparation_gate_fail_closed_no_execution") {
  problems.push("commandPreparationMode mismatch");
}
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");

assertGate(gate);
assertCommandPreparationGateState(output.commandPreparationGateState ?? {});
assertAuthorizationValuesState(output.authorizationValuesState ?? {});
assertCandidateState(output.candidateState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-exact-runtime-execution-command-preparation-gate-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-exact-runtime-execution-command-preparation-gate-preflight`);
}
if (
  pkg.scripts?.["check:twii-exact-runtime-execution-command-preparation-gate-preflight"] !==
  "node scripts/check-twii-exact-runtime-execution-command-preparation-gate-preflight.mjs"
) {
  problems.push(`${packagePath} missing check:twii-exact-runtime-execution-command-preparation-gate-preflight`);
}

for (const phrase of [
  "TWII Exact Runtime Execution Command Preparation Gate Preflight",
  "twii_exact_runtime_execution_command_preparation_gate_preflight_ready_no_execution",
  "exact_runtime_execution_command_preparation_gate_ready_execution_still_blocked",
  "data/source-gates/twii-exact-runtime-execution-command-preparation-gate-preflight.json",
  "sourceDecisionGatePath=data/source-gates/twii-explicit-bounded-runtime-attempt-decision-gate-preflight.json",
  "candidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
  "commandPreparationMode=exact_runtime_execution_command_preparation_gate_fail_closed_no_execution",
  "commandPreparationGatePrepared=true",
  "decisionGateReferenced=true",
  "exactRuntimeExecutionCommandPrepared=false",
  "exactRuntimeExecutionCommandReferenceOnly=true",
  "separateFinalExecutionRunRequired=true",
  "serverOnlyBoundaryReferenced=true",
  "failClosedDefaultReferenced=true",
  "postRunReviewRequirementReferenced=true",
  "aggregateReadbackRequirementReferenced=true",
  "rollbackRequirementReferenced=true",
  "executeSwitchRequirementReferenced=true",
  "confirmationPhraseRequirementReferenced=true",
  "authorizationDecisionAcceptedNow=false",
  "explicitAttemptDecisionAcceptedNow=false",
  "exactCommandAcceptedNow=false",
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
  "commandPreparationDecisionVocabulary=[accepted_for_exact_command_text_preparation,rejected,repair_required,deferred_or_expired]",
  "requiredCommandPreparationArtifacts=[source_decision_gate,source_operator_packet,server_only_boundary,fail_closed_default,post_run_review,aggregate_readback,rollback_readiness,promotion_lock]",
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
  "Latest TWII exact runtime execution command preparation gate preflight slice",
  "docs/TWII_EXACT_RUNTIME_EXECUTION_COMMAND_PREPARATION_GATE_PREFLIGHT.md",
  "data/source-gates/twii-exact-runtime-execution-command-preparation-gate-preflight.json",
  "twii_exact_runtime_execution_command_preparation_gate_preflight_ready_no_execution",
  "exact_runtime_execution_command_preparation_gate_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_EXACT_RUNTIME_EXECUTION_COMMAND_PREPARATION_GATE_PREFLIGHT.md` is `accepted` as TWII exact runtime execution command preparation gate preflight",
  "twii_exact_runtime_execution_command_preparation_gate_preflight_ready_no_execution",
  "exact_runtime_execution_command_preparation_gate_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-exact-runtime-execution-command-preparation-gate-preflight.mjs",
  "name: \"twii-exact-runtime-execution-command-preparation-gate-preflight\"",
  "\"twii-exact-runtime-execution-command-preparation-gate-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, gateText],
  ["exact runtime execution command preparation gate stdout", run.stdout ?? ""]
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
      commandPreparationMode: output.commandPreparationMode,
      exactRuntimeExecutionCommandPrepared: output.commandPreparationGateState.exactRuntimeExecutionCommandPrepared,
      exactCommandAcceptedNow: output.commandPreparationGateState.exactCommandAcceptedNow,
      runnerExecutableNow: output.commandPreparationGateState.runnerExecutableNow,
      executionAllowedNow: output.commandPreparationGateState.executionAllowedNow,
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_exact_runtime_execution_command_preparation_gate_preflight",
    sourceDecisionGatePath: "data/source-gates/twii-explicit-bounded-runtime-attempt-decision-gate-preflight.json",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    commandPreparationMode: "exact_runtime_execution_command_preparation_gate_fail_closed_no_execution",
    commandPreparationGatePrepared: true,
    decisionGateReferenced: true,
    exactRuntimeExecutionCommandPrepared: false,
    exactRuntimeExecutionCommandReferenceOnly: true,
    separateFinalExecutionRunRequired: true,
    serverOnlyBoundaryReferenced: true,
    failClosedDefaultReferenced: true,
    postRunReviewRequirementReferenced: true,
    aggregateReadbackRequirementReferenced: true,
    rollbackRequirementReferenced: true,
    executeSwitchRequirementReferenced: true,
    confirmationPhraseRequirementReferenced: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    authorizationDecisionAcceptedNow: false,
    explicitAttemptDecisionAcceptedNow: false,
    exactCommandAcceptedNow: false,
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
    commandPreparationGateDecision: "exact_runtime_execution_command_preparation_gate_ready_but_command_not_prepared_and_execution_blocked",
    nextIfCommandPreparationAccepted: "operator_may_prepare_exact_command_text_in_separate_step",
    nextIfCommandPreparationRejected: "keep_runtime_write_attempt_blocked_and_repair_command_preparation_gate",
    nextIfCommandPreparationDeferred: "refresh_attempt_decision_gate_before_any_command_preparation",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertCommandPreparationGateState(state) {
  for (const key of [
    "commandPreparationGatePrepared",
    "decisionGateReferenced",
    "exactRuntimeExecutionCommandReferenceOnly",
    "separateFinalExecutionRunRequired",
    "serverOnlyBoundaryReferenced",
    "failClosedDefaultReferenced",
    "postRunReviewRequirementReferenced",
    "aggregateReadbackRequirementReferenced",
    "rollbackRequirementReferenced",
    "executeSwitchRequirementReferenced",
    "confirmationPhraseRequirementReferenced"
  ]) {
    if (state[key] !== true) problems.push(`commandPreparationGateState.${key} must be true`);
  }
  for (const key of ["exactRuntimeExecutionCommandPrepared", "authorizationDecisionAcceptedNow", "explicitAttemptDecisionAcceptedNow", "exactCommandAcceptedNow", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) {
    if (state[key] !== false) problems.push(`commandPreparationGateState.${key} must be false`);
  }
}

function assertAuthorizationValuesState(state) {
  for (const key of ["authorizationDecisionAcceptedNow", "explicitAttemptDecisionAcceptedNow", "exactCommandAcceptedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "envValueOutput"]) {
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
