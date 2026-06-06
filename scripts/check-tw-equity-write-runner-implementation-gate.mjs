import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_WRITE_RUNNER_IMPLEMENTATION_GATE.md";
const authPath = "docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md";
const designPath = "docs/TW_EQUITY_WRITE_RUNNER_FAIL_CLOSED_DESIGN.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";

const doc = read(docPath);
const auth = read(authPath);
const design = read(designPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Write Runner Implementation Gate",
  "tw_equity_write_runner_implementation_gate_ready_fail_closed_skeleton_created",
  "docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md",
  "docs/TW_EQUITY_WRITE_RUNNER_FAIL_CLOSED_DESIGN.md",
  "fail-closed runner skeleton",
  "not a write execution implementation",
  "scripts/run-tw-equity-staging-write-once.mjs",
  "default to no Supabase connection",
  "default to no SQL",
  "default to no file write",
  "default to no market-data fetch",
  "default to no market-data ingestion",
  "default to no secret output",
  "default to no service-role key output",
  "default to no source payload output",
  "keep public data-source posture mock-equivalent",
  "keep `scoreSource` as `mock`",
  "refuse execution unless the exact authorization id matches",
  "refuse execution unless the exact command arguments match",
  "refuse retry unless a new authorization exists",
  "refuse public redistribution",
  "refuse public promotion",
  "refuse row coverage points",
  "refuse score-source promotion",
  "exact runner path exists",
  "no Supabase client import appears",
  "no environment secret is printed",
  "no network fetch appears unless a later execution gate explicitly authorizes it",
  "no SQL string execution appears unless a later execution gate explicitly authorizes it",
  "no filesystem write appears unless a later execution gate explicitly authorizes it",
  "no source payload output appears",
  "no service-role key output appears",
  "default public data-source posture remains mock-equivalent",
  "default `scoreSource` remains `mock`",
  "no staging row write can occur without the exact authorization id",
  "no production `daily_prices` mutation can occur",
  "create the fail-closed runner skeleton in this GOAL",
  "do not create a runnable write execution implementation",
  "one actual bounded staging write execution after target relation reconciliation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [path, text, phrase] of [
  [authPath, auth, "tw_equity_actual_bounded_staging_write_authorization_packet_ready_not_executed"],
  [designPath, design, "tw_equity_write_runner_fail_closed_design_ready_no_runner_created"]
]) {
  if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity write runner implementation gate slice",
  "docs/TW_EQUITY_WRITE_RUNNER_IMPLEMENTATION_GATE.md",
  "tw_equity_write_runner_implementation_gate_ready_fail_closed_skeleton_created",
  "fail-closed runner skeleton is created but no write execution implementation exists",
  "next executable stage is a separate one actual bounded staging write execution after target relation reconciliation GOAL"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-write-runner-implementation-gate"] !==
  "node scripts/check-tw-equity-write-runner-implementation-gate.mjs"
) {
  problems.push("package.json missing check:tw-equity-write-runner-implementation-gate");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-write-runner-implementation-gate.mjs")) {
    problems.push(`${path} missing TW equity write runner implementation gate checker`);
  }
  if (!text.includes("tw-equity-write-runner-implementation-gate")) {
    problems.push(`${path} missing tw-equity-write-runner-implementation-gate name`);
  }
}

if (!reviewGate.includes('"tw-equity-write-runner-implementation-gate"')) {
  problems.push("review gate core set missing tw-equity-write-runner-implementation-gate");
}

if (!fs.existsSync(runnerPath)) {
  problems.push(`${runnerPath} must exist as a fail-closed skeleton`);
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
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
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
