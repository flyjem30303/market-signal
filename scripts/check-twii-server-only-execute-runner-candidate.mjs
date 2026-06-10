import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const runPath = "scripts/run-twii-server-only-execute-runner-candidate.mjs";
const reportPath = "scripts/report-twii-server-only-execute-runner-candidate.mjs";
const docPath = "docs/TWII_SERVER_ONLY_EXECUTE_RUNNER_CANDIDATE.md";
const candidatePath = "data/source-gates/twii-server-only-execute-runner-candidate.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const runSource = read(runPath);
const reportSource = read(reportPath);
const doc = read(docPath);
const candidate = JSON.parse(read(candidatePath));
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const runnerRun = spawnSync(process.execPath, [runPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

const runnerOutput = parseJson(runnerRun.stdout ?? "", "server-only runner candidate stdout");
const reportOutput = parseJson(reportRun.stdout ?? "", "server-only runner candidate report stdout");

if (runnerRun.status !== 0) problems.push("server-only runner candidate must exit 0");
if (reportRun.status !== 0) problems.push("server-only runner candidate report must exit 0");
if (runnerOutput.runnerCandidateStatus !== "twii_server_only_execute_runner_candidate_blocked_no_execution") {
  problems.push("runnerCandidateStatus mismatch");
}
if (reportOutput.status !== "twii_server_only_execute_runner_candidate_ready_no_execution") {
  problems.push("server-only runner candidate report status mismatch");
}
if (reportOutput.outcome !== "server_only_execute_runner_candidate_ready_execution_still_blocked") {
  problems.push("server-only runner candidate report outcome mismatch");
}
assertCandidate(candidate);
assertFalseState(runnerOutput);
assertFalseState(reportOutput.noExecutionState ?? {});
assertSafety(reportOutput.safety ?? {});

if (pkg.scripts?.["run:twii-server-only-execute-runner-candidate"] !== `node ${runPath}`) {
  problems.push(`${packagePath} missing run:twii-server-only-execute-runner-candidate`);
}
if (pkg.scripts?.["report:twii-server-only-execute-runner-candidate"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-server-only-execute-runner-candidate`);
}
if (pkg.scripts?.["check:twii-server-only-execute-runner-candidate"] !== "node scripts/check-twii-server-only-execute-runner-candidate.mjs") {
  problems.push(`${packagePath} missing check:twii-server-only-execute-runner-candidate`);
}

for (const phrase of [
  "TWII Server-Only Execute Runner Candidate",
  "twii_server_only_execute_runner_candidate_ready_no_execution",
  "server_only_execute_runner_candidate_ready_execution_still_blocked",
  "data/source-gates/twii-server-only-execute-runner-candidate.json",
  "runnerMode=server_only_candidate_fail_closed_no_execution",
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
  "Latest TWII server-only execute runner candidate slice",
  "docs/TWII_SERVER_ONLY_EXECUTE_RUNNER_CANDIDATE.md",
  "data/source-gates/twii-server-only-execute-runner-candidate.json",
  "twii_server_only_execute_runner_candidate_ready_no_execution",
  "server_only_execute_runner_candidate_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_SERVER_ONLY_EXECUTE_RUNNER_CANDIDATE.md` is `accepted` as TWII server-only execute runner candidate",
  "twii_server_only_execute_runner_candidate_ready_no_execution",
  "server_only_execute_runner_candidate_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-server-only-execute-runner-candidate.mjs",
  "name: \"twii-server-only-execute-runner-candidate\"",
  "\"twii-server-only-execute-runner-candidate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [runPath, runSource],
  [reportPath, reportSource],
  [docPath, doc],
  [candidatePath, JSON.stringify(candidate)],
  ["server-only runner candidate stdout", runnerRun.stdout ?? ""],
  ["server-only runner candidate report stdout", reportRun.stdout ?? ""]
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
      runnerCandidateStatus: runnerOutput.runnerCandidateStatus,
      guardedStatus: reportOutput.status,
      acceptedOutcome: reportOutput.outcome,
      executionAllowedNow: reportOutput.noExecutionState.executionAllowedNow
    },
    null,
    2
  )
);

function assertCandidate(candidate) {
  const expected = {
    candidateKind: "twii_server_only_execute_runner_candidate_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    runnerMode: "server_only_candidate_fail_closed_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
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
    if (candidate[key] !== value) problems.push(`candidate.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertFalseState(state) {
  for (const key of [
    "executeRequested",
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
    problems.push("server-only runner candidate must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`server-only runner candidate safety.${key} must be false`);
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
