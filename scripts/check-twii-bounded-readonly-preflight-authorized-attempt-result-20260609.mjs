import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_AUTHORIZED_ATTEMPT_RESULT_20260609.md";
const reportPath = "scripts/report-twii-bounded-readonly-preflight-authorized-attempt-result-20260609.mjs";
const checkerPath = "scripts/check-twii-bounded-readonly-preflight-authorized-attempt-result-20260609.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
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
const report = parseJson(reportRun.stdout ?? "", "authorized attempt result report stdout");
if (reportRun.status !== 0) problems.push("authorized attempt result report must exit 0");
if (
  report.status !==
  "twii_bounded_readonly_preflight_authorized_attempt_blocked_execute_not_enabled_no_remote_attempt"
) {
  problems.push("authorized attempt result must be blocked execute not enabled no remote");
}
if (report.outcome !== "blocked_execute_not_enabled_no_remote_attempt") {
  problems.push("authorized attempt result outcome must be blocked execute not enabled");
}
assertSafety(report, "authorized attempt result report");

if (
  pkg.scripts?.["report:twii-bounded-readonly-preflight-authorized-attempt-result-20260609"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-bounded-readonly-preflight-authorized-attempt-result-20260609`);
}
if (
  pkg.scripts?.["check:twii-bounded-readonly-preflight-authorized-attempt-result-20260609"] !==
  `node ${checkerPath}`
) {
  problems.push(`${packagePath} missing check:twii-bounded-readonly-preflight-authorized-attempt-result-20260609`);
}

for (const phrase of [
  "TWII Bounded Readonly Preflight Authorized Attempt Result - 2026-06-09",
  "twii_bounded_readonly_preflight_authorized_attempt_blocked_execute_not_enabled_no_remote_attempt",
  "CEO_AUTHORIZES_ONE_TWII_BOUNDED_READONLY_PREFLIGHT_ATTEMPT_20260609_A",
  "twii-bounded-readonly-preflight-20260609-a",
  "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready",
  "accepted_real_readonly_boundary_dry_run_no_remote_attempt",
  "twii_bounded_readonly_preflight_real_readonly_boundary_blocked_execute_not_enabled",
  "blocked_execute_requested_no_remote_attempt",
  "twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path",
  "No SQL",
  "No Supabase connection",
  "No Supabase read",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded readonly preflight authorized attempt result slice",
  "docs/TWII_BOUNDED_READONLY_PREFLIGHT_AUTHORIZED_ATTEMPT_RESULT_20260609.md",
  "twii_bounded_readonly_preflight_authorized_attempt_blocked_execute_not_enabled_no_remote_attempt",
  "blocked_execute_not_enabled_no_remote_attempt"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_READONLY_PREFLIGHT_AUTHORIZED_ATTEMPT_RESULT_20260609.md` is `accepted` as TWII bounded readonly preflight authorized attempt result",
  "twii_bounded_readonly_preflight_authorized_attempt_blocked_execute_not_enabled_no_remote_attempt"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-readonly-preflight-authorized-attempt-result-20260609.mjs",
  "name: \"twii-bounded-readonly-preflight-authorized-attempt-result-20260609\"",
  "\"twii-bounded-readonly-preflight-authorized-attempt-result-20260609\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["authorized attempt result report stdout", reportRun.stdout ?? ""]
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
      guardedStatus:
        "twii_bounded_readonly_preflight_authorized_attempt_blocked_execute_not_enabled_no_remote_attempt"
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
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadAttempted",
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
