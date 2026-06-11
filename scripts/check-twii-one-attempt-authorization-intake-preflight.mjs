import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-one-attempt-authorization-intake-preflight.mjs";
const docPath = "docs/TWII_ONE_ATTEMPT_AUTHORIZATION_INTAKE_PREFLIGHT.md";
const gatePath = "data/source-gates/twii-one-attempt-authorization-intake-preflight.json";
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

const output = parseJson(run.stdout ?? "", "one-attempt authorization intake stdout");
if (run.status !== 0) problems.push("one-attempt authorization intake report must exit 0");
if (output.status !== "twii_one_attempt_authorization_intake_preflight_ready_no_execution") {
  problems.push("one-attempt authorization intake status mismatch");
}
if (output.outcome !== "one_attempt_authorization_intake_ready_execution_still_blocked") {
  problems.push("one-attempt authorization intake outcome mismatch");
}
if (output.mode !== "twii_one_attempt_authorization_intake_preflight_no_execution") {
  problems.push("one-attempt authorization intake mode mismatch");
}
if (output.intakeMode !== "one_attempt_authorization_intake_preflight_no_execution") problems.push("intakeMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");

assertGate(gate);
assertAuthorizationIntakeState(output.authorizationIntakeState ?? {});
assertAuthorizationValuesState(output.authorizationValuesState ?? {});
assertCandidateState(output.candidateState ?? {});
assertNoExecutionState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-one-attempt-authorization-intake-preflight"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-one-attempt-authorization-intake-preflight`);
}
if (
  pkg.scripts?.["check:twii-one-attempt-authorization-intake-preflight"] !==
  "node scripts/check-twii-one-attempt-authorization-intake-preflight.mjs"
) {
  problems.push(`${packagePath} missing check:twii-one-attempt-authorization-intake-preflight`);
}

for (const phrase of [
  "TWII One-Attempt Authorization Intake Preflight",
  "twii_one_attempt_authorization_intake_preflight_ready_no_execution",
  "one_attempt_authorization_intake_ready_execution_still_blocked",
  "data/source-gates/twii-one-attempt-authorization-intake-preflight.json",
  "sourceFinalPacketGatePath=data/source-gates/twii-final-execution-packet-preflight.json",
  "candidateArtifactPath=data/candidates/twii-sanitized-candidate.json",
  "intakeMode=one_attempt_authorization_intake_preflight_no_execution",
  "authorizationIntakePrepared=true",
  "finalPacketReferenced=true",
  "operatorDecisionVocabularyPrepared=true",
  "executeSwitchRequirementReferenced=true",
  "confirmationPhraseRequirementReferenced=true",
  "authorizationValuesRead=false",
  "executeSwitchValueRead=false",
  "confirmationPhraseValueRead=false",
  "candidateArtifactReferenceOnly=true",
  "candidateArtifactRowsRead=false",
  "rowPayloadRead=false",
  "rawPayloadRead=false",
  "authorizationAcceptedNow=false",
  "finalExecutionAllowedNow=false",
  "implementationAllowedNow=false",
  "requiredExecuteSwitchName=TWII_ONE_ATTEMPT_EXECUTE",
  "requiredConfirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
  "operatorDecisionVocabulary=[accepted,rejected,repair_required,expired_or_not_current]",
  "sqlExecuted=false",
  "supabaseClientImported=false",
  "supabaseConnectionAttempted=false",
  "supabaseWritesEnabled=false",
  "supabaseReadsEnabled=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII one-attempt authorization intake preflight slice",
  "docs/TWII_ONE_ATTEMPT_AUTHORIZATION_INTAKE_PREFLIGHT.md",
  "data/source-gates/twii-one-attempt-authorization-intake-preflight.json",
  "twii_one_attempt_authorization_intake_preflight_ready_no_execution",
  "one_attempt_authorization_intake_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_ONE_ATTEMPT_AUTHORIZATION_INTAKE_PREFLIGHT.md` is `accepted` as TWII one-attempt authorization intake preflight",
  "twii_one_attempt_authorization_intake_preflight_ready_no_execution",
  "one_attempt_authorization_intake_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-one-attempt-authorization-intake-preflight.mjs",
  "name: \"twii-one-attempt-authorization-intake-preflight\"",
  "\"twii-one-attempt-authorization-intake-preflight\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, gateText],
  ["one-attempt authorization intake stdout", run.stdout ?? ""]
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
      intakeMode: output.intakeMode,
      authorizationAcceptedNow: output.authorizationIntakeState.authorizationAcceptedNow,
      finalExecutionAllowedNow: output.authorizationIntakeState.finalExecutionAllowedNow,
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_one_attempt_authorization_intake_preflight",
    sourceFinalPacketGatePath: "data/source-gates/twii-final-execution-packet-preflight.json",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    attemptId: "twii-one-attempt-runner-20260610-a",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    intakeMode: "one_attempt_authorization_intake_preflight_no_execution",
    finalPacketReferenced: true,
    authorizationIntakePrepared: true,
    operatorDecisionVocabularyPrepared: true,
    executeSwitchRequirementReferenced: true,
    confirmationPhraseRequirementReferenced: true,
    candidateArtifactReferenceOnly: true,
    candidateArtifactRowsRead: false,
    authorizationValuesRead: false,
    executeSwitchValueRead: false,
    confirmationPhraseValueRead: false,
    credentialValuesRead: false,
    rowPayloadRead: false,
    rawPayloadRead: false,
    sourcePayloadRead: false,
    authorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    implementationAllowedNow: false,
    intakeDecision: "authorization_intake_ready_but_no_operator_decision_accepted",
    nextIfAuthorizationAccepted: "prepare_bounded_one_attempt_execution_review_without_connecting_supabase",
    nextIfAuthorizationRejected: "repair_final_execution_packet_or_authorization_intake",
    nextIfAuthorizationExpired: "refresh_final_execution_packet_preflight_before_any_execution",
    requiredExecuteSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    requiredConfirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    requiredConfirmationPhraseReference: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A"
  };
  for (const [key, value] of Object.entries(expected)) {
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
  const vocabulary = ["accepted", "rejected", "repair_required", "expired_or_not_current"];
  if (JSON.stringify(gate.operatorDecisionVocabulary) !== JSON.stringify(vocabulary)) {
    problems.push("operatorDecisionVocabulary mismatch");
  }
  if (gate.authorizationIntakePacket?.operationKind !== "future_one_attempt_authorization_intake_no_execution") {
    problems.push("authorizationIntakePacket.operationKind mismatch");
  }
}

function assertAuthorizationIntakeState(state) {
  for (const key of [
    "finalPacketReferenced",
    "authorizationIntakePrepared",
    "operatorDecisionVocabularyPrepared",
    "executeSwitchRequirementReferenced",
    "confirmationPhraseRequirementReferenced"
  ]) {
    if (state[key] !== true) problems.push(`authorizationIntakeState.${key} must be true`);
  }
  for (const key of ["authorizationAcceptedNow", "finalExecutionAllowedNow", "implementationAllowedNow"]) {
    if (state[key] !== false) problems.push(`authorizationIntakeState.${key} must be false`);
  }
}

function assertAuthorizationValuesState(state) {
  for (const key of [
    "authorizationValuesRead",
    "executeSwitchValueRead",
    "confirmationPhraseValueRead",
    "credentialValuesRead",
    "envValueOutput"
  ]) {
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
