import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-real-write-runner-implementation-review-gate.mjs";
const docPath = "docs/TWII_REAL_WRITE_RUNNER_IMPLEMENTATION_REVIEW_GATE.md";
const gatePath = "data/source-gates/twii-real-write-runner-implementation-review-gate.json";
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

const output = parseJson(run.stdout ?? "", "real write-runner implementation review gate stdout");
if (run.status !== 0) problems.push("real write-runner implementation review gate report must exit 0");
if (output.status !== "twii_real_write_runner_implementation_review_gate_ready_no_execution") {
  problems.push("real write-runner implementation review gate status mismatch");
}
if (output.outcome !== "real_write_runner_implementation_review_ready_implementation_still_blocked") {
  problems.push("real write-runner implementation review gate outcome mismatch");
}
if (output.gateReadyForCeoDecision !== true) problems.push("gateReadyForCeoDecision must be true");
if (output.reviewMode !== "real_write_runner_implementation_review_no_execution") problems.push("reviewMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
assertGate(gate);
assertNoExecutionState(output.noExecutionState ?? {});
assertImplementationControls(output.implementationControls ?? {});
assertExecutionControls(output.executionControls ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-real-write-runner-implementation-review-gate"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-real-write-runner-implementation-review-gate`);
}
if (
  pkg.scripts?.["check:twii-real-write-runner-implementation-review-gate"] !==
  "node scripts/check-twii-real-write-runner-implementation-review-gate.mjs"
) {
  problems.push(`${packagePath} missing check:twii-real-write-runner-implementation-review-gate`);
}

for (const phrase of [
  "TWII Real Write-Runner Implementation Review Gate",
  "twii_real_write_runner_implementation_review_gate_ready_no_execution",
  "real_write_runner_implementation_review_ready_implementation_still_blocked",
  "data/source-gates/twii-real-write-runner-implementation-review-gate.json",
  "reviewMode=real_write_runner_implementation_review_no_execution",
  "requiredConfirmationPhrase=CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
  "executeSwitchName=TWII_ONE_ATTEMPT_EXECUTE",
  "confirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
  "runnerScaffoldAccepted=true",
  "supabaseClientImplementationAllowed=false",
  "credentialPresenceCheckImplementationAllowed=false",
  "boundedInsertImplementationAllowed=false",
  "executeSwitchProvided=false",
  "confirmationPhraseProvided=false",
  "confirmationPhraseMatched=false",
  "serverOnlyCredentialCheckPassed=false",
  "credentialValuesRead=false",
  "rollbackDryRunPassed=false",
  "aggregateReadbackPassed=false",
  "postWriteReviewPassed=false",
  "candidateDuplicateRejectionProofPassed=false",
  "executeRequested=false",
  "sqlExecuted=false",
  "supabaseClientImported=false",
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
  "Latest TWII real write-runner implementation review gate slice",
  "docs/TWII_REAL_WRITE_RUNNER_IMPLEMENTATION_REVIEW_GATE.md",
  "data/source-gates/twii-real-write-runner-implementation-review-gate.json",
  "twii_real_write_runner_implementation_review_gate_ready_no_execution",
  "real_write_runner_implementation_review_ready_implementation_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_REAL_WRITE_RUNNER_IMPLEMENTATION_REVIEW_GATE.md` is `accepted` as TWII real write-runner implementation review gate",
  "twii_real_write_runner_implementation_review_gate_ready_no_execution",
  "real_write_runner_implementation_review_ready_implementation_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-real-write-runner-implementation-review-gate.mjs",
  "name: \"twii-real-write-runner-implementation-review-gate\"",
  "\"twii-real-write-runner-implementation-review-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [gatePath, JSON.stringify(gate)],
  ["real write-runner implementation review gate stdout", run.stdout ?? ""]
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
      implementationAllowedNow: output.noExecutionState.implementationAllowedNow
    },
    null,
    2
  )
);

function assertGate(gate) {
  const expected = {
    gateKind: "twii_real_write_runner_implementation_review_gate",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    reviewMode: "real_write_runner_implementation_review_no_execution",
    requiredConfirmationPhrase: "CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A",
    executeSwitchName: "TWII_ONE_ATTEMPT_EXECUTE",
    confirmationPhraseName: "TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE",
    runnerScaffoldAccepted: true,
    supabaseClientImplementationAllowed: false,
    credentialPresenceCheckImplementationAllowed: false,
    boundedInsertImplementationAllowed: false,
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    rollbackDryRunPassed: false,
    aggregateReadbackPassed: false,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofPassed: false,
    executeRequested: false,
    sqlExecuted: false,
    supabaseClientImported: false,
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

function assertImplementationControls(controls) {
  for (const [key, value] of Object.entries({
    runnerScaffoldAccepted: true,
    supabaseClientImplementationAllowed: false,
    credentialPresenceCheckImplementationAllowed: false,
    boundedInsertImplementationAllowed: false
  })) {
    if (controls[key] !== value) problems.push(`implementationControls.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertExecutionControls(controls) {
  for (const [key, value] of Object.entries({
    executeSwitchProvided: false,
    confirmationPhraseProvided: false,
    confirmationPhraseMatched: false,
    serverOnlyCredentialCheckPassed: false,
    credentialValuesRead: false,
    rollbackDryRunPassed: false,
    aggregateReadbackPassed: false,
    postWriteReviewPassed: false,
    candidateDuplicateRejectionProofPassed: false
  })) {
    if (controls[key] !== value) problems.push(`executionControls.${key} must be ${JSON.stringify(value)}`);
  }
}

function assertNoExecutionState(state) {
  for (const key of [
    "executeRequested",
    "sqlExecuted",
    "supabaseClientImported",
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
    problems.push("real write-runner implementation review gate must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`real write-runner implementation review gate safety.${key} must be false`);
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
