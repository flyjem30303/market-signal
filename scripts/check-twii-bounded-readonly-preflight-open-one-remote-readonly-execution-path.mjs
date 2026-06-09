import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_OPEN_ONE_REMOTE_READONLY_EXECUTION_PATH.md";
const runnerPath = "scripts/run-twii-bounded-readonly-preflight-remote-readonly-once.mjs";
const reviewPath = "scripts/report-twii-bounded-readonly-preflight-remote-readonly-post-run-review.mjs";
const reportPath = "scripts/report-twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path.mjs";
const checkerPath = "scripts/check-twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path.mjs";
const pkgPath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const runnerSource = read(runnerPath);
const reviewSource = read(reviewPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(pkgPath));
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
const report = parseJson(reportRun.stdout ?? "", "open one remote readonly report stdout");
if (reportRun.status !== 0) problems.push("open one remote readonly report must exit 0");
if (report.status !== "twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path_ready") {
  problems.push("open one remote readonly execution path report must be ready");
}
if (report.outcome !== "accepted_one_sanitized_remote_readonly_probe_path") {
  problems.push("open one remote readonly execution path outcome must be accepted");
}
assertReportSafety(report, "open one remote readonly report");

const expectedScripts = {
  "run:twii-bounded-readonly-preflight-remote-readonly-once": `node ${runnerPath}`,
  "report:twii-bounded-readonly-preflight-remote-readonly-post-run-review": `node ${reviewPath}`,
  "report:twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path": `node ${reportPath}`,
  "check:twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path": `node ${checkerPath}`
};
for (const [name, command] of Object.entries(expectedScripts)) {
  if (pkg.scripts?.[name] !== command) problems.push(`${pkgPath} missing ${name}`);
}

for (const phrase of [
  "TWII Bounded Readonly Preflight Open One Remote Readonly Execution Path",
  "twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path_ready",
  "accepted_one_sanitized_remote_readonly_probe_path",
  "run:twii-bounded-readonly-preflight-remote-readonly-once",
  "report:twii-bounded-readonly-preflight-remote-readonly-post-run-review",
  "stocks",
  "daily_prices",
  "No SQL",
  "No Supabase write",
  "No daily_prices mutation",
  "No row payload output",
  "No stock id payload output",
  "No secret output",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded readonly preflight open-one remote readonly execution path slice",
  "docs/TWII_BOUNDED_READONLY_PREFLIGHT_OPEN_ONE_REMOTE_READONLY_EXECUTION_PATH.md",
  "twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path_ready",
  "accepted_one_sanitized_remote_readonly_probe_path"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_READONLY_PREFLIGHT_OPEN_ONE_REMOTE_READONLY_EXECUTION_PATH.md` is `accepted` as TWII bounded readonly preflight open-one remote readonly execution path",
  "twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path.mjs",
  "name: \"twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path\"",
  "\"twii-bounded-readonly-preflight-open-one-remote-readonly-execution-path\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [label, text] of [
  [runnerPath, runnerSource],
  [reviewPath, reviewSource],
  [reportPath, reportSource],
  [docPath, doc],
  ["open one remote readonly report stdout", reportRun.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${String(pattern)}`);
  }
}

if (!/@supabase\/supabase-js/u.test(runnerSource) || !/createClient/u.test(runnerSource)) {
  problems.push("remote readonly runner must use Supabase client");
}
if (!/\.select\([^)]*head: true/u.test(runnerSource)) {
  problems.push("remote readonly runner must use head count selects");
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path_ready"
    },
    null,
    2
  )
);

function assertReportSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlExecuted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
  if (output.safety?.supabaseReadAttempted !== true) problems.push(`${label}.supabaseReadAttempted must be true`);
}

function forbiddenPatterns() {
  return [
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource=supabase is approved/u,
    /scoreSource=real is approved/u,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /candidate rows accepted/u,
    /row coverage scoring is approved/u
  ];
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
