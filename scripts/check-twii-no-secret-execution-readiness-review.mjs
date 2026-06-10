import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-no-secret-execution-readiness-review.mjs";
const docPath = "docs/TWII_NO_SECRET_EXECUTION_READINESS_REVIEW.md";
const reviewPath = "data/source-gates/twii-no-secret-execution-readiness-review.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const review = JSON.parse(read(reviewPath));
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

const output = parseJson(run.stdout ?? "", "no-secret execution readiness review stdout");
if (run.status !== 0) problems.push("no-secret execution readiness review report must exit 0");
if (output.status !== "twii_no_secret_execution_readiness_review_ready_no_execution") {
  problems.push("no-secret execution readiness review status mismatch");
}
if (output.outcome !== "no_secret_execution_readiness_review_ready_execution_still_blocked") {
  problems.push("no-secret execution readiness review outcome mismatch");
}
if (output.reviewReadyForPmDecision !== true) problems.push("reviewReadyForPmDecision must be true");
if (output.reviewMode !== "no_secret_execution_readiness_review_no_execution") problems.push("reviewMode mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
assertReview(review);
assertFalseState(output.noExecutionState ?? {});
assertControls(output.controls ?? {});
assertSafety(output.safety ?? {});

if (pkg.scripts?.["report:twii-no-secret-execution-readiness-review"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-no-secret-execution-readiness-review`);
}
if (pkg.scripts?.["check:twii-no-secret-execution-readiness-review"] !== "node scripts/check-twii-no-secret-execution-readiness-review.mjs") {
  problems.push(`${packagePath} missing check:twii-no-secret-execution-readiness-review`);
}

for (const phrase of [
  "TWII No-Secret Execution Readiness Review",
  "twii_no_secret_execution_readiness_review_ready_no_execution",
  "no_secret_execution_readiness_review_ready_execution_still_blocked",
  "data/source-gates/twii-no-secret-execution-readiness-review.json",
  "reviewMode=no_secret_execution_readiness_review_no_execution",
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
  "Latest TWII no-secret execution readiness review slice",
  "docs/TWII_NO_SECRET_EXECUTION_READINESS_REVIEW.md",
  "data/source-gates/twii-no-secret-execution-readiness-review.json",
  "twii_no_secret_execution_readiness_review_ready_no_execution",
  "no_secret_execution_readiness_review_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_NO_SECRET_EXECUTION_READINESS_REVIEW.md` is `accepted` as TWII no-secret execution readiness review",
  "twii_no_secret_execution_readiness_review_ready_no_execution",
  "no_secret_execution_readiness_review_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-no-secret-execution-readiness-review.mjs",
  "name: \"twii-no-secret-execution-readiness-review\"",
  "\"twii-no-secret-execution-readiness-review\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [reviewPath, JSON.stringify(review)],
  ["no-secret execution readiness review stdout", run.stdout ?? ""]
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
      readinessDecision: output.readinessDecision,
      executionAllowedNow: output.noExecutionState.executionAllowedNow
    },
    null,
    2
  )
);

function assertReview(review) {
  const expected = {
    reviewKind: "twii_no_secret_execution_readiness_review_no_execution",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    reviewMode: "no_secret_execution_readiness_review_no_execution",
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
    if (review[key] !== value) problems.push(`review.${key} must be ${JSON.stringify(value)}`);
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
    problems.push("no-secret readiness review must stay mock/mock");
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
    if (safety[key] !== false) problems.push(`no-secret readiness review safety.${key} must be false`);
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
