import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-final-no-write-authorization-packet.mjs";
const docPath = "docs/TWII_FINAL_NO_WRITE_AUTHORIZATION_PACKET.md";
const packetPath = "data/source-gates/twii-final-no-write-authorization-packet.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const packet = JSON.parse(read(packetPath));
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

const output = parseJson(run.stdout ?? "", "final no-write authorization packet stdout");
if (run.status !== 0) problems.push("final no-write authorization packet report must exit 0");
if (output.status !== "twii_final_no_write_authorization_packet_ready_no_execution") {
  problems.push("final no-write authorization packet status mismatch");
}
if (output.outcome !== "final_no_write_authorization_packet_ready_execution_still_blocked") {
  problems.push("final no-write authorization packet outcome mismatch");
}
if (output.packetReadyForCeoDecision !== true) problems.push("packetReadyForCeoDecision must be true");
if (output.authorizationMode !== "final_no_write_authorization_packet") problems.push("authorizationMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
assertPacket(packet);
assertFalseState(output.noExecutionState ?? {});
assertControls(output.controls ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-final-no-write-authorization-packet"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-final-no-write-authorization-packet`);
}
if (pkg.scripts?.["check:twii-final-no-write-authorization-packet"] !== "node scripts/check-twii-final-no-write-authorization-packet.mjs") {
  problems.push(`${packagePath} missing check:twii-final-no-write-authorization-packet`);
}

for (const phrase of [
  "TWII Final No-Write Authorization Packet",
  "twii_final_no_write_authorization_packet_ready_no_execution",
  "final_no_write_authorization_packet_ready_execution_still_blocked",
  "data/source-gates/twii-final-no-write-authorization-packet.json",
  "authorizationMode=final_no_write_authorization_packet",
  "requiredConfirmationPhrase=CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
  "executeSwitchRequired=true",
  "executeSwitchProvided=false",
  "confirmationPhraseRequired=true",
  "confirmationPhraseProvided=false",
  "serverOnlyCredentialCheckRequired=true",
  "serverOnlyCredentialCheckPassed=false",
  "credentialValuesRead=false",
  "rollbackDryRunRequired=true",
  "rollbackDryRunPassed=false",
  "aggregateReadbackRequired=true",
  "aggregateReadbackPassed=false",
  "postWriteReviewRequired=true",
  "postWriteReviewPassed=false",
  "candidateDuplicateRejectionProofRequired=true",
  "candidateDuplicateRejectionProofPassed=false",
  "executeRequested=false",
  "sqlExecuted=false",
  "supabaseConnectionAttempted=false",
  "supabaseWritesEnabled=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII final no-write authorization packet slice",
  "docs/TWII_FINAL_NO_WRITE_AUTHORIZATION_PACKET.md",
  "data/source-gates/twii-final-no-write-authorization-packet.json",
  "twii_final_no_write_authorization_packet_ready_no_execution",
  "final_no_write_authorization_packet_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_FINAL_NO_WRITE_AUTHORIZATION_PACKET.md` is `accepted` as TWII final no-write authorization packet",
  "twii_final_no_write_authorization_packet_ready_no_execution",
  "final_no_write_authorization_packet_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-final-no-write-authorization-packet.mjs",
  "name: \"twii-final-no-write-authorization-packet\"",
  "\"twii-final-no-write-authorization-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [packetPath, JSON.stringify(packet)],
  ["final no-write authorization packet stdout", run.stdout ?? ""]
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
      writeAuthorizationDecision: output.writeAuthorizationDecision,
      executionAllowedNow: output.noExecutionState.executionAllowedNow
    },
    null,
    2
  )
);

function assertPacket(packet) {
  const expected = {
    packetKind: "twii_final_no_write_authorization_packet",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    authorizationMode: "final_no_write_authorization_packet",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    packetReadyForCeoDecision: true,
    writeAuthorizationDecision: "blocked_until_explicit_execute_switch_confirmation_and_all_pre_write_controls_pass",
    executeSwitchRequired: true,
    executeSwitchProvided: false,
    confirmationPhraseRequired: true,
    confirmationPhraseProvided: false,
    serverOnlyCredentialCheckRequired: true,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    rollbackDryRunRequired: true,
    rollbackDryRunPassed: false,
    aggregateReadbackRequired: true,
    aggregateReadbackPassed: false,
    postWriteReviewRequired: true,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofRequired: true,
    candidateDuplicateRejectionProofPassed: false,
    executeRequested: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (packet[key] !== value) problems.push(`packet.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertControls(controls) {
  for (const [key, value] of Object.entries({
    executeSwitchRequired: true,
    executeSwitchProvided: false,
    confirmationPhraseRequired: true,
    confirmationPhraseProvided: false,
    serverOnlyCredentialCheckRequired: true,
    serverOnlyCredentialCheckPassed: false,
    rollbackDryRunRequired: true,
    rollbackDryRunPassed: false,
    aggregateReadbackRequired: true,
    aggregateReadbackPassed: false,
    postWriteReviewRequired: true,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofRequired: true,
    candidateDuplicateRejectionProofPassed: false
  })) {
    if (controls[key] !== value) problems.push(`controls.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertFalseState(state) {
  for (const key of [
    "credentialValuesRead",
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
    "dailyPricesMutated",
    "candidateRowsAccepted",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow"
  ]) {
    if (state[key] !== false) problems.push(`${key} must be false`);
  }
}

function assertSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("final no-write authorization packet must stay mock/mock");
  }
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "credentialValuesRead",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`final no-write authorization packet safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /row coverage scoring is approved/iu
  ];
}
