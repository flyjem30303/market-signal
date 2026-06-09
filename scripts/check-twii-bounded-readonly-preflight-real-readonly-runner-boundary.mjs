import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_REAL_READONLY_RUNNER_BOUNDARY.md";
const reportPath = "scripts/report-twii-bounded-readonly-preflight-real-readonly-runner-boundary.mjs";
const checkerPath = "scripts/check-twii-bounded-readonly-preflight-real-readonly-runner-boundary.mjs";
const runnerPath = "scripts/run-twii-bounded-readonly-preflight-once.mjs";
const postRunReviewPath = "scripts/report-twii-bounded-readonly-preflight-post-run-review.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const runnerSource = read(runnerPath);
const postRunReviewSource = read(postRunReviewPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(reportRun.stdout ?? "", "real readonly runner boundary report stdout");
if (reportRun.status !== 0) problems.push("real readonly runner boundary report must exit 0");
if (report.status !== "twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt") {
  problems.push("real readonly runner boundary report must be ready no remote attempt");
}
if (report.outcome !== "ready_for_single_remote_readonly_attempt_authorization_not_executed") {
  problems.push("real readonly runner boundary outcome must be authorization not executed");
}
assertSafety(report, "real readonly runner boundary report");

const expectedScripts = {
  "report:twii-bounded-readonly-preflight-real-readonly-runner-boundary": `node ${reportPath}`,
  "check:twii-bounded-readonly-preflight-real-readonly-runner-boundary": `node ${checkerPath}`
};
for (const [scriptName, command] of Object.entries(expectedScripts)) {
  if (pkg.scripts?.[scriptName] !== command) problems.push(`${packagePath} missing ${scriptName}`);
}

for (const phrase of [
  "TWII Bounded Readonly Preflight Real Readonly Runner Boundary",
  "twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt",
  "ready_for_single_remote_readonly_attempt_authorization_not_executed",
  "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready",
  "ready_for_single_remote_readonly_attempt_not_executed",
  "twii_bounded_readonly_preflight_real_readonly_boundary_blocked_execute_not_enabled",
  "blocked_execute_requested_no_remote_attempt",
  "twii_bounded_readonly_preflight_post_run_review_accepted_real_readonly_boundary_dry_run",
  "accepted_real_readonly_boundary_dry_run_no_remote_attempt",
  "--dry-run-real-readonly-boundary",
  "--execute",
  "No SQL",
  "No Supabase connection in this boundary slice",
  "No Supabase read in this boundary slice",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "dryRunRealReadonlyBoundary",
  "executeRequested",
  "remoteExecutionBoundaryImplemented",
  "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready",
  "twii_bounded_readonly_preflight_real_readonly_boundary_blocked_execute_not_enabled"
]) {
  if (!runnerSource.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "twii_bounded_readonly_preflight_post_run_review_accepted_real_readonly_boundary_dry_run",
  "accepted_real_readonly_boundary_dry_run_no_remote_attempt"
]) {
  if (!postRunReviewSource.includes(phrase)) problems.push(`${postRunReviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded readonly preflight real-readonly runner boundary slice",
  "docs/TWII_BOUNDED_READONLY_PREFLIGHT_REAL_READONLY_RUNNER_BOUNDARY.md",
  "twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt",
  "ready_for_single_remote_readonly_attempt_authorization_not_executed"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_READONLY_PREFLIGHT_REAL_READONLY_RUNNER_BOUNDARY.md` is `accepted` as TWII bounded readonly preflight real-readonly runner boundary",
  "twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-readonly-preflight-real-readonly-runner-boundary.mjs",
  "name: \"twii-bounded-readonly-preflight-real-readonly-runner-boundary\"",
  "\"twii-bounded-readonly-preflight-real-readonly-runner-boundary\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [runnerPath, runnerSource],
  [postRunReviewPath, postRunReviewSource],
  [docPath, doc],
  ["real readonly runner boundary report stdout", reportRun.stdout ?? ""]
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
      guardedStatus: "twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt"
    },
    null,
    2
  )
);

function assertSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseConnectionAllowedInThisBoundary",
    "supabaseReadAllowedInThisBoundary",
    "supabaseWriteAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
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
    /\bfetch\s*\(/u,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource=supabase is approved/u,
    /scoreSource=real is approved/u,
    /SQL execution is approved/u,
    /Supabase writes are approved/u
  ];
}
