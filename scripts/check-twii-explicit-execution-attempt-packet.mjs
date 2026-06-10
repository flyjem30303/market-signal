import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-explicit-execution-attempt-packet.mjs";
const docPath = "docs/TWII_EXPLICIT_EXECUTION_ATTEMPT_PACKET.md";
const packetPath = "data/source-gates/twii-explicit-execution-attempt-packet.json";
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

const output = parseJson(run.stdout ?? "", "explicit execution attempt packet stdout");
if (run.status !== 0) problems.push("explicit execution attempt packet report must exit 0");
if (output.status !== "twii_explicit_execution_attempt_packet_ready_no_execution") {
  problems.push("attempt packet status must be ready no execution");
}
if (output.outcome !== "explicit_execution_attempt_packet_ready_execution_still_blocked") {
  problems.push("attempt packet outcome mismatch");
}
if (output.packetReadyForPmReview !== true) problems.push("packetReadyForPmReview must be true");
if (output.runnerMode !== "fail_closed_no_execution") problems.push("runnerMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") problems.push("targetScope mismatch");
assertFalseState(output.noExecutionState ?? {});
assertSafety(output.safety ?? {});
assertPacket(packet);

if (pkg.scripts?.["report:twii-explicit-execution-attempt-packet"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-explicit-execution-attempt-packet`);
}
if (pkg.scripts?.["check:twii-explicit-execution-attempt-packet"] !== "node scripts/check-twii-explicit-execution-attempt-packet.mjs") {
  problems.push(`${packagePath} missing check:twii-explicit-execution-attempt-packet`);
}

for (const phrase of [
  "TWII Explicit Execution Attempt Packet",
  "twii_explicit_execution_attempt_packet_ready_no_execution",
  "explicit_execution_attempt_packet_ready_execution_still_blocked",
  "data/source-gates/twii-explicit-execution-attempt-packet.json",
  "runnerMode=fail_closed_no_execution",
  "requiredConfirmationPhrase=CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
  "rollbackDryRunRequired=true",
  "aggregateReadbackRequired=true",
  "postWriteReviewRequired=true",
  "executeRequested=false",
  "confirmationPhraseProvided=false",
  "credentialValuesRead=false",
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
  "Latest TWII explicit execution attempt packet slice",
  "docs/TWII_EXPLICIT_EXECUTION_ATTEMPT_PACKET.md",
  "data/source-gates/twii-explicit-execution-attempt-packet.json",
  "twii_explicit_execution_attempt_packet_ready_no_execution",
  "explicit_execution_attempt_packet_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_EXPLICIT_EXECUTION_ATTEMPT_PACKET.md` is `accepted` as TWII explicit execution attempt packet",
  "twii_explicit_execution_attempt_packet_ready_no_execution",
  "explicit_execution_attempt_packet_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-explicit-execution-attempt-packet.mjs",
  "name: \"twii-explicit-execution-attempt-packet\"",
  "\"twii-explicit-execution-attempt-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [packetPath, JSON.stringify(packet)],
  ["explicit execution attempt packet stdout", run.stdout ?? ""]
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
      runnerMode: output.runnerMode,
      executionAllowedNow: output.noExecutionState.executionAllowedNow
    },
    null,
    2
  )
);

function assertPacket(packet) {
  const expected = {
    packetKind: "twii_explicit_execution_attempt_packet_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runnerMode: "fail_closed_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    rollbackDryRunRequired: true,
    aggregateReadbackRequired: true,
    postWriteReviewRequired: true,
    executeRequested: false,
    confirmationPhraseProvided: false,
    credentialValuesRead: false,
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

function assertFalseState(state) {
  for (const key of [
    "executeRequested",
    "confirmationPhraseProvided",
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
    if (state[key] !== false) problems.push(`noExecutionState.${key} must be false`);
  }
}

function assertSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("attempt packet must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`attempt packet safety.${key} must be false`);
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
