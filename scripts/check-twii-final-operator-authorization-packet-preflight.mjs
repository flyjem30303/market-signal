import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-final-operator-authorization-packet-preflight.mjs";
const docPath = "docs/TWII_FINAL_OPERATOR_AUTHORIZATION_PACKET_PREFLIGHT.md";
const packetPath = "data/source-gates/twii-final-operator-authorization-packet-preflight.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const packetText = read(packetPath);
const packet = JSON.parse(packetText);
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

const output = parseJson(run.stdout ?? "", "final operator authorization packet stdout");
if (run.status !== 0) problems.push("final operator authorization packet report must exit 0");
if (output.status !== "twii_final_operator_authorization_packet_preflight_ready_no_execution") {
  problems.push("final operator authorization packet status mismatch");
}
if (output.outcome !== "final_operator_authorization_packet_ready_execution_still_blocked") {
  problems.push("final operator authorization packet outcome mismatch");
}
if (output.mode !== "twii_final_operator_authorization_packet_preflight_no_execution") {
  problems.push("final operator authorization packet mode mismatch");
}
if (output.packetMode !== "final_operator_authorization_packet_preflight_fail_closed_no_execution") {
  problems.push("packetMode mismatch");
}
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");

assertPacket(packet);
assertOperatorAuthorizationPacketState(output.operatorAuthorizationPacketState ?? {});
assertAuthorizationValuesState(output.authorizationValuesState ?? {});
assertCandidateState(output.candidateState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-final-operator-authorization-packet-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-final-operator-authorization-packet-preflight`);
}
if (
  pkg.scripts?.["check:twii-final-operator-authorization-packet-preflight"] !==
  "node scripts/check-twii-final-operator-authorization-packet-preflight.mjs"
) {
  problems.push(`${packagePath} missing check:twii-final-operator-authorization-packet-preflight`);
}

for (const phrase of [
  "TWII Final Operator Authorization Packet Preflight",
  "twii_final_operator_authorization_packet_preflight_ready_no_execution",
  "final_operator_authorization_packet_ready_execution_still_blocked",
  "data/source-gates/twii-final-operator-authorization-packet-preflight.json",
  "sourceRuntimeGatePath=data/source-gates/twii-final-runtime-execution-gate-preflight.json",
  "candidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
  "packetMode=final_operator_authorization_packet_preflight_fail_closed_no_execution",
  "packetPrepared=true",
  "runtimeGateReferenced=true",
  "operatorDecisionRequired=true",
  "serverOnlyBoundaryReferenced=true",
  "failClosedDefaultReferenced=true",
  "postRunReviewRequirementReferenced=true",
  "aggregateReadbackRequirementReferenced=true",
  "rollbackRequirementReferenced=true",
  "executeSwitchRequirementReferenced=true",
  "confirmationPhraseRequirementReferenced=true",
  "authorizationDecisionAcceptedNow=false",
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
  "operatorDecisionVocabulary=[accepted_for_explicit_attempt_decision_review,rejected,repair_required,deferred_or_expired]",
  "requiredOperatorReviewArtifacts=[source_runtime_gate,server_only_boundary,fail_closed_default,post_run_review,aggregate_readback,rollback_readiness,promotion_lock]",
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
  "Latest TWII final operator authorization packet preflight slice",
  "docs/TWII_FINAL_OPERATOR_AUTHORIZATION_PACKET_PREFLIGHT.md",
  "data/source-gates/twii-final-operator-authorization-packet-preflight.json",
  "twii_final_operator_authorization_packet_preflight_ready_no_execution",
  "final_operator_authorization_packet_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_FINAL_OPERATOR_AUTHORIZATION_PACKET_PREFLIGHT.md` is `accepted` as TWII final operator authorization packet preflight",
  "twii_final_operator_authorization_packet_preflight_ready_no_execution",
  "final_operator_authorization_packet_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-final-operator-authorization-packet-preflight.mjs",
  "name: \"twii-final-operator-authorization-packet-preflight\"",
  "\"twii-final-operator-authorization-packet-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [packetPath, packetText],
  ["final operator authorization packet stdout", run.stdout ?? ""]
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
      packetMode: output.packetMode,
      authorizationDecisionAcceptedNow: output.operatorAuthorizationPacketState.authorizationDecisionAcceptedNow,
      runnerExecutableNow: output.operatorAuthorizationPacketState.runnerExecutableNow,
      executionAllowedNow: output.operatorAuthorizationPacketState.executionAllowedNow,
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertPacket(packet) {
  const expected = {
    packetKind: "twii_final_operator_authorization_packet_preflight",
    sourceRuntimeGatePath: "data/source-gates/twii-final-runtime-execution-gate-preflight.json",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    packetMode: "final_operator_authorization_packet_preflight_fail_closed_no_execution",
    packetPrepared: true,
    runtimeGateReferenced: true,
    operatorDecisionRequired: true,
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
    operatorPacketDecision: "final_operator_authorization_packet_ready_but_execution_still_blocked",
    nextIfOperatorAcceptsPacket: "operator_may_make_explicit_bounded_runtime_attempt_decision_in_separate_step",
    nextIfOperatorRejectsPacket: "repair_final_operator_authorization_packet_or_runtime_gate",
    nextIfOperatorDefersPacket: "keep_runtime_write_attempt_blocked_and_refresh_packet_before_any_execution",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`packet.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertOperatorAuthorizationPacketState(state) {
  for (const key of [
    "packetPrepared",
    "runtimeGateReferenced",
    "operatorDecisionRequired",
    "serverOnlyBoundaryReferenced",
    "failClosedDefaultReferenced",
    "postRunReviewRequirementReferenced",
    "aggregateReadbackRequirementReferenced",
    "rollbackRequirementReferenced",
    "executeSwitchRequirementReferenced",
    "confirmationPhraseRequirementReferenced"
  ]) {
    if (state[key] !== true) problems.push(`operatorAuthorizationPacketState.${key} must be true`);
  }
  for (const key of ["authorizationDecisionAcceptedNow", "runnerExecutableNow", "executionAllowedNow", "writeGateExecutableNow", "implementationAllowedNow"]) {
    if (state[key] !== false) problems.push(`operatorAuthorizationPacketState.${key} must be false`);
  }
}

function assertAuthorizationValuesState(state) {
  for (const key of ["authorizationDecisionAcceptedNow", "authorizationValuesRead", "executeSwitchValueRead", "confirmationPhraseValueRead", "credentialValuesRead", "envValueOutput"]) {
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
