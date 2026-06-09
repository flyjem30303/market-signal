import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_RUNNER_STUB.md";
const runnerPath = "scripts/run-twii-bounded-readonly-preflight-once.mjs";
const postRunReviewPath = "scripts/report-twii-bounded-readonly-preflight-post-run-review.mjs";
const reportPath = "scripts/report-twii-bounded-readonly-preflight-runner-stub.mjs";
const checkerPath = "scripts/check-twii-bounded-readonly-preflight-runner-stub.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const runnerSource = read(runnerPath);
const postRunReviewSource = read(postRunReviewPath);
const reportSource = read(reportPath);
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
const report = parseJson(reportRun.stdout ?? "", "runner stub report stdout");
if (reportRun.status !== 0) problems.push("runner stub report must exit 0");
if (report.status !== "twii_bounded_readonly_preflight_runner_stub_ready_fail_closed") {
  problems.push("runner stub report must be ready");
}
if (report.outcome !== "accepted_fail_closed_runner_stub_no_remote_attempt") {
  problems.push("runner stub outcome must be accepted fail-closed");
}
assertSafety(report, "runner stub report");

const expectedScripts = {
  "run:twii-bounded-readonly-preflight-once": `node ${runnerPath}`,
  "report:twii-bounded-readonly-preflight-post-run-review": `node ${postRunReviewPath}`,
  "report:twii-bounded-readonly-preflight-runner-stub": `node ${reportPath}`,
  "check:twii-bounded-readonly-preflight-runner-stub": `node ${checkerPath}`
};

for (const [scriptName, command] of Object.entries(expectedScripts)) {
  if (pkg.scripts?.[scriptName] !== command) {
    problems.push(`${packagePath} missing ${scriptName}`);
  }
}

for (const phrase of [
  "TWII Bounded Readonly Preflight Runner Stub",
  "twii_bounded_readonly_preflight_runner_stub_ready_fail_closed",
  "twii_bounded_readonly_preflight_stub_blocked_confirmation_required",
  "blocked_fail_closed_no_remote_attempt",
  "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE",
  "No SQL",
  "No Supabase connection",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded readonly preflight runner stub slice",
  "docs/TWII_BOUNDED_READONLY_PREFLIGHT_RUNNER_STUB.md",
  "twii_bounded_readonly_preflight_runner_stub_ready_fail_closed"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_READONLY_PREFLIGHT_RUNNER_STUB.md` is `accepted` as TWII bounded readonly preflight runner stub",
  "twii_bounded_readonly_preflight_runner_stub_ready_fail_closed"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-readonly-preflight-runner-stub.mjs",
  "name: \"twii-bounded-readonly-preflight-runner-stub\"",
  "\"twii-bounded-readonly-preflight-runner-stub\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [runnerPath, runnerSource],
  [postRunReviewPath, postRunReviewSource],
  [reportPath, reportSource],
  [docPath, doc],
  ["runner stub report stdout", reportRun.stdout ?? ""]
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
      guardedStatus: "twii_bounded_readonly_preflight_runner_stub_ready_fail_closed"
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
    "supabaseConnectionAllowed",
    "supabaseReadAllowedByThisStub",
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
