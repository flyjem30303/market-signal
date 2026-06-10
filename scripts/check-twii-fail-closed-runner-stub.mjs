import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const runnerPath = "scripts/run-twii-fail-closed-runner-stub.mjs";
const reportPath = "scripts/report-twii-fail-closed-runner-stub-post-run-review.mjs";
const docPath = "docs/TWII_FAIL_CLOSED_RUNNER_STUB.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const runnerSource = read(runnerPath);
const reportSource = read(reportPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const runnerRun = spawnSync(process.execPath, [runnerPath], {
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

const runnerOutput = parseJson(runnerRun.stdout ?? "", "runner stdout");
const reportOutput = parseJson(reportRun.stdout ?? "", "post-run review stdout");

if (runnerRun.status !== 0) problems.push("runner stub must exit 0");
if (reportRun.status !== 0) problems.push("post-run review must exit 0");
if (runnerOutput.runnerStatus !== "twii_fail_closed_runner_stub_blocked_no_execution") {
  problems.push("runnerStatus mismatch");
}
if (reportOutput.status !== "twii_fail_closed_runner_stub_post_run_review_ready_no_execution") {
  problems.push("post-run review status mismatch");
}
if (reportOutput.outcome !== "runner_stub_review_confirms_no_execution") {
  problems.push("post-run review outcome mismatch");
}
for (const output of [runnerOutput, reportOutput]) {
  assertFalseFlags(output);
}

if (pkg.scripts?.["run:twii-fail-closed-runner-stub"] !== `node ${runnerPath}`) {
  problems.push(`${packagePath} missing run:twii-fail-closed-runner-stub`);
}
if (pkg.scripts?.["report:twii-fail-closed-runner-stub-post-run-review"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-fail-closed-runner-stub-post-run-review`);
}
if (pkg.scripts?.["check:twii-fail-closed-runner-stub"] !== "node scripts/check-twii-fail-closed-runner-stub.mjs") {
  problems.push(`${packagePath} missing check:twii-fail-closed-runner-stub`);
}

for (const phrase of [
  "TWII Fail-Closed Runner Stub",
  "twii_fail_closed_runner_stub_blocked_no_execution",
  "twii_fail_closed_runner_stub_post_run_review_ready_no_execution",
  "runner_stub_review_confirms_no_execution",
  "runnerMode=fail_closed_no_execution",
  "runnerExecutableNow=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII fail-closed runner stub slice",
  "docs/TWII_FAIL_CLOSED_RUNNER_STUB.md",
  "scripts/run-twii-fail-closed-runner-stub.mjs",
  "twii_fail_closed_runner_stub_post_run_review_ready_no_execution",
  "runner_stub_review_confirms_no_execution"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_FAIL_CLOSED_RUNNER_STUB.md` is `accepted` as TWII fail-closed runner stub",
  "twii_fail_closed_runner_stub_post_run_review_ready_no_execution",
  "runner_stub_review_confirms_no_execution"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-fail-closed-runner-stub.mjs",
  "name: \"twii-fail-closed-runner-stub\"",
  "\"twii-fail-closed-runner-stub\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [runnerPath, runnerSource],
  [reportPath, reportSource],
  [docPath, doc],
  ["runner stdout", runnerRun.stdout ?? ""],
  ["post-run review stdout", reportRun.stdout ?? ""]
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
      runnerStatus: runnerOutput.runnerStatus,
      postRunReviewStatus: reportOutput.status,
      acceptedOutcome: reportOutput.outcome
    },
    null,
    2
  )
);

function assertFalseFlags(output) {
  for (const key of [
    "credentialValuesRead",
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
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
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output[key] !== false && output.safety?.[key] !== false) problems.push(`${key} must be false`);
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
