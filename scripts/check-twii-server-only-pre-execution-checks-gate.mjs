import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-server-only-pre-execution-checks-gate.mjs";
const docPath = "docs/TWII_SERVER_ONLY_PRE_EXECUTION_CHECKS_GATE.md";
const gatePath = "data/source-gates/twii-server-only-pre-execution-checks-gate.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const gate = JSON.parse(read(gatePath));
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

const output = parseJson(run.stdout ?? "", "server-only pre-execution checks gate stdout");
if (run.status !== 0) problems.push("server-only pre-execution checks gate report must exit 0");
if (output.status !== "twii_server_only_pre_execution_checks_gate_ready_no_execution") {
  problems.push("server-only pre-execution checks gate status mismatch");
}
if (output.outcome !== "server_only_pre_execution_checks_ready_execution_still_blocked") {
  problems.push("server-only pre-execution checks gate outcome mismatch");
}
if (output.gateReadyForCeoDecision !== true) problems.push("gateReadyForCeoDecision must be true");
if (output.preExecutionMode !== "server_only_pre_execution_checks_no_execution") problems.push("preExecutionMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
assertGate(gate);
assertFalseState(output.noExecutionState ?? {});
assertControls(output.controls ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-server-only-pre-execution-checks-gate"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-server-only-pre-execution-checks-gate`);
}
if (
  pkg.scripts?.["check:twii-server-only-pre-execution-checks-gate"] !==
  "node scripts/check-twii-server-only-pre-execution-checks-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twii-server-only-pre-execution-checks-gate`);
}

for (const phrase of [
  "TWII Server-Only Pre-Execution Checks Gate",
  "twii_server_only_pre_execution_checks_gate_ready_no_execution",
  "server_only_pre_execution_checks_ready_execution_still_blocked",
  "data/source-gates/twii-server-only-pre-execution-checks-gate.json",
  "preExecutionMode=server_only_pre_execution_checks_no_execution",
  "requiredConfirmationPhrase=CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
  "executeSwitchName=TWII_ONE_ATTEMPT_EXECUTE",
  "confirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
  "intakeGateAccepted=true",
  "executeSwitchProvided=false",
  "confirmationPhraseProvided=false",
  "confirmationPhraseMatched=false",
  "serverOnlyCredentialCheckRequired=true",
  "serverOnlyCredentialCheckPassed=false",
  "credentialPresenceOnlyCheckAllowed=true",
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
  "Latest TWII server-only pre-execution checks gate slice",
  "docs/TWII_SERVER_ONLY_PRE_EXECUTION_CHECKS_GATE.md",
  "data/source-gates/twii-server-only-pre-execution-checks-gate.json",
  "twii_server_only_pre_execution_checks_gate_ready_no_execution",
  "server_only_pre_execution_checks_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_SERVER_ONLY_PRE_EXECUTION_CHECKS_GATE.md` is `accepted` as TWII server-only pre-execution checks gate",
  "twii_server_only_pre_execution_checks_gate_ready_no_execution",
  "server_only_pre_execution_checks_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-server-only-pre-execution-checks-gate.mjs",
  "name: \"twii-server-only-pre-execution-checks-gate\"",
  "\"twii-server-only-pre-execution-checks-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, JSON.stringify(gate)],
  ["server-only pre-execution checks gate stdout", run.stdout ?? ""]
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
      preExecutionDecision: output.preExecutionDecision,
      executionAllowedNow: output.noExecutionState.executionAllowedNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_server_only_pre_execution_checks_gate",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    preExecutionMode: "server_only_pre_execution_checks_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    intakeGateAccepted: true,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckRequired: true,
    serverOnlyCredentialCheckPassed: false,
    credentialPresenceOnlyCheckAllowed: true,
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
    if (gate[key] !== value) problems.push(`gate.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertControls(controls) {
  for (const [key, value] of Object.entries({
    intakeGateAccepted: true,
    executeSwitchRequired: true,
    executeSwitchProvided: false,
    confirmationPhraseRequired: true,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckRequired: true,
    serverOnlyCredentialCheckPassed: false,
    credentialPresenceOnlyCheckAllowed: true,
    credentialValuesRead: false,
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
    problems.push("server-only pre-execution checks gate must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`server-only pre-execution checks gate safety.${key} must be false`);
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
