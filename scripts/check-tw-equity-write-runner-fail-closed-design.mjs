import fs from "node:fs";

const problems = [];

const designPath = "docs/TW_EQUITY_WRITE_RUNNER_FAIL_CLOSED_DESIGN.md";
const decisionPath = "docs/TW_EQUITY_BOUNDED_STAGING_WRITE_EXECUTION_DECISION_V1.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";

const design = read(designPath);
const decision = read(decisionPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Write Runner Fail-Closed Design",
  "tw_equity_write_runner_fail_closed_design_ready_no_runner_created",
  "docs/TW_EQUITY_BOUNDED_STAGING_WRITE_EXECUTION_DECISION_V1.md",
  "No write runner exists in this slice",
  "scripts/run-tw-equity-staging-write-once.mjs",
  "no Supabase connection",
  "no SQL",
  "no file write",
  "no market-data fetch",
  "no market-data ingestion",
  "no secret output",
  "no service-role key output",
  "no source payload output",
  "`publicDataSource` equivalent remains `mock`",
  "`scoreSource` remains `mock`",
  "no staging row creation",
  "no production `daily_prices` mutation",
  "no row coverage points",
  "no public redistribution",
  "no public promotion",
  "authorization id exactly matches the approved packet",
  "exact command matches the approved packet",
  "lane equals `tw-equity`",
  "symbols equal `2330`, `2382`, `2308`",
  "sessions equals `60`",
  "target relation equals `tw_equity_daily_prices_staging`",
  "max rows equals `180`",
  "source classification reference points to `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`",
  "redistribution remains `unknown_keep_blocked`",
  "service-role posture is explicitly approved for this one run",
  "RLS posture is explicitly acknowledged",
  "rollback owner is named",
  "rollback dry-run posture is defined",
  "retention window is defined",
  "post-run review artifact is provided",
  "no retry is acknowledged",
  "no score-source promotion is acknowledged",
  "do not create the runnable write runner in this GOAL"
]) {
  if (!design.includes(phrase)) problems.push(`${designPath} missing: ${phrase}`);
}

if (!decision.includes("tw_equity_bounded_staging_write_execution_decision_v1_ready_not_executed")) {
  problems.push(`${decisionPath} missing execution decision status`);
}

for (const phrase of [
  "Latest TW equity write runner fail-closed design slice",
  "docs/TW_EQUITY_WRITE_RUNNER_FAIL_CLOSED_DESIGN.md",
  "tw_equity_write_runner_fail_closed_design_ready_no_runner_created",
  "future write runner remains absent",
  "default no Supabase connection, no SQL, no file write, no market-data fetch, no secret output",
  "publicDataSource equivalent remains mock",
  "scoreSource remains mock",
  "do not create the runnable write runner in this GOAL"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-write-runner-fail-closed-design"] !==
  "node scripts/check-tw-equity-write-runner-fail-closed-design.mjs"
) {
  problems.push("package.json missing check:tw-equity-write-runner-fail-closed-design");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-write-runner-fail-closed-design.mjs")) {
    problems.push(`${path} missing TW equity write runner fail-closed design checker`);
  }
  if (!text.includes("tw-equity-write-runner-fail-closed-design")) {
    problems.push(`${path} missing tw-equity-write-runner-fail-closed-design name`);
  }
}

if (!reviewGate.includes('"tw-equity-write-runner-fail-closed-design"')) {
  problems.push("review gate core set missing tw-equity-write-runner-fail-closed-design");
}

if (fs.existsSync(runnerPath)) {
  problems.push(`${runnerPath} must remain absent until a separate actual bounded staging write GOAL`);
}

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /\bfetch\s*\(/u,
  /\bwriteFile/u,
  /\bappendFile/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /market-data fetch is approved/u,
  /market-data ingestion is approved/u,
  /publicDataSource=supabase approved/u,
  /scoreSource=real approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(design)) problems.push(`${designPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
