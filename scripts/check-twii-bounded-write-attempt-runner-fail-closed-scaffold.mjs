import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const runPath = "scripts/run-twii-bounded-write-attempt-runner-fail-closed-scaffold.mjs";
const reportPath = "scripts/report-twii-bounded-write-attempt-runner-fail-closed-scaffold.mjs";
const docPath = "docs/TWII_BOUNDED_WRITE_ATTEMPT_RUNNER_FAIL_CLOSED_SCAFFOLD.md";
const scaffoldPath = "data/source-gates/twii-bounded-write-attempt-runner-fail-closed-scaffold.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const runSource = read(runPath);
const reportSource = read(reportPath);
const doc = read(docPath);
const scaffold = JSON.parse(read(scaffoldPath));
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const runnerRun = runNode([runPath]);
const runnerOutput = parseJson(runnerRun.stdout ?? "", "runner stdout");
if (runnerRun.status !== 0) problems.push("runner scaffold must exit 0 when it fail-closes");
if (runnerOutput.status !== "twii_bounded_write_attempt_runner_fail_closed_scaffold_blocked_no_execution") {
  problems.push("runner scaffold status mismatch");
}
if (runnerOutput.outcome !== "bounded_write_attempt_runner_scaffold_invoked_and_fail_closed") {
  problems.push("runner scaffold outcome mismatch");
}

const reportRun = runNode([reportPath]);
const reportOutput = parseJson(reportRun.stdout ?? "", "report stdout");
if (reportRun.status !== 0) problems.push("runner scaffold report must exit 0");
if (reportOutput.status !== "twii_bounded_write_attempt_runner_fail_closed_scaffold_ready_no_execution") {
  problems.push("runner scaffold report status mismatch");
}
if (reportOutput.outcome !== "bounded_write_attempt_runner_scaffold_ready_and_fail_closed") {
  problems.push("runner scaffold report outcome mismatch");
}

assertScaffold(scaffold);
assertRunnerState(runnerOutput.runnerState ?? {});
assertSafety(runnerOutput.safety ?? {});
assertSafety(reportOutput.safety ?? {});

if (pkg.scripts?.["run:twii-bounded-write-attempt-runner-fail-closed-scaffold"] !== `node ${runPath}`) {
  problems.push(`${packagePath} missing run:twii-bounded-write-attempt-runner-fail-closed-scaffold`);
}
if (pkg.scripts?.["report:twii-bounded-write-attempt-runner-fail-closed-scaffold"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-bounded-write-attempt-runner-fail-closed-scaffold`);
}
if (
  pkg.scripts?.["check:twii-bounded-write-attempt-runner-fail-closed-scaffold"] !==
  "node scripts/check-twii-bounded-write-attempt-runner-fail-closed-scaffold.mjs"
) {
  problems.push(`${packagePath} missing check:twii-bounded-write-attempt-runner-fail-closed-scaffold`);
}

for (const phrase of [
  "TWII Bounded Write-Attempt Runner Fail-Closed Scaffold",
  "twii_bounded_write_attempt_runner_fail_closed_scaffold_ready_no_execution",
  "bounded_write_attempt_runner_scaffold_ready_and_fail_closed",
  "data/source-gates/twii-bounded-write-attempt-runner-fail-closed-scaffold.json",
  "runnerMode=bounded_write_attempt_runner_fail_closed_scaffold_no_execution",
  "requiredConfirmationPhrase=CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
  "executeSwitchName=TWII_ONE_ATTEMPT_EXECUTE",
  "confirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
  "preExecutionGateAccepted=true",
  "executeSwitchProvided=false",
  "confirmationPhraseProvided=false",
  "confirmationPhraseMatched=false",
  "serverOnlyCredentialCheckPassed=false",
  "credentialPresenceOnlyCheckAllowed=true",
  "credentialValuesRead=false",
  "rollbackDryRunPassed=false",
  "aggregateReadbackPassed=false",
  "postWriteReviewPassed=false",
  "candidateDuplicateRejectionProofPassed=false",
  "executeRequested=false",
  "runnerInvoked=true",
  "runnerFailClosed=true",
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
  "Latest TWII bounded write-attempt runner fail-closed scaffold slice",
  "docs/TWII_BOUNDED_WRITE_ATTEMPT_RUNNER_FAIL_CLOSED_SCAFFOLD.md",
  "data/source-gates/twii-bounded-write-attempt-runner-fail-closed-scaffold.json",
  "twii_bounded_write_attempt_runner_fail_closed_scaffold_ready_no_execution",
  "bounded_write_attempt_runner_scaffold_ready_and_fail_closed"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_WRITE_ATTEMPT_RUNNER_FAIL_CLOSED_SCAFFOLD.md` is `accepted` as TWII bounded write-attempt runner fail-closed scaffold",
  "twii_bounded_write_attempt_runner_fail_closed_scaffold_ready_no_execution",
  "bounded_write_attempt_runner_scaffold_ready_and_fail_closed"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-write-attempt-runner-fail-closed-scaffold.mjs",
  "name: \"twii-bounded-write-attempt-runner-fail-closed-scaffold\"",
  "\"twii-bounded-write-attempt-runner-fail-closed-scaffold\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [runPath, runSource],
  [reportPath, reportSource],
  [docPath, doc],
  [scaffoldPath, JSON.stringify(scaffold)],
  ["runner stdout", runnerRun.stdout ?? ""],
  ["report stdout", reportRun.stdout ?? ""]
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
      guardedStatus: reportOutput.status,
      acceptedOutcome: reportOutput.outcome,
      runnerFailClosed: runnerOutput.runnerState.runnerFailClosed
    },
    null,
    2
  )
);

function assertScaffold(scaffold) {
  const expected = {
    scaffoldKind: "twii_bounded_write_attempt_runner_fail_closed_scaffold",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runnerMode: "bounded_write_attempt_runner_fail_closed_scaffold_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    preExecutionGateAccepted: true,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckPassed: false,
    credentialPresenceOnlyCheckAllowed: true,
    credentialValuesRead: false,
    rollbackDryRunPassed: false,
    aggregateReadbackPassed: false,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofPassed: false,
    executeRequested: false,
    runnerInvoked: true,
    runnerFailClosed: true,
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
    if (scaffold[key] !== value) problems.push(`scaffold.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertRunnerState(state) {
  for (const [key, value] of Object.entries({
    executeRequested: false,
    runnerInvoked: true,
    runnerFailClosed: true,
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
  })) {
    if (state[key] !== value) problems.push(`runnerState.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertSafety(safety) {
  if (safety.publicDataSource !== "mock" || safety.scoreSource !== "mock") {
    problems.push("runner scaffold must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`runner scaffold safety.${key} must be false`);
  }
}

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
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
