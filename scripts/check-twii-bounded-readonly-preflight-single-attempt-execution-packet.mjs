import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_SINGLE_ATTEMPT_EXECUTION_PACKET.md";
const reportPath = "scripts/report-twii-bounded-readonly-preflight-single-attempt-execution-packet.mjs";
const checkerPath = "scripts/check-twii-bounded-readonly-preflight-single-attempt-execution-packet.mjs";
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
const report = parseJson(reportRun.stdout ?? "", "single-attempt execution packet report stdout");
if (reportRun.status !== 0) problems.push("single-attempt execution packet report must exit 0");
if (report.status !== "twii_bounded_readonly_preflight_single_attempt_execution_packet_ready_not_executed") {
  problems.push("single-attempt execution packet report must be ready not executed");
}
if (report.outcome !== "ready_for_one_bounded_readonly_attempt_authorization_not_executed") {
  problems.push("single-attempt execution packet outcome must be ready not executed");
}
assertSafety(report, "single-attempt execution packet report");

if (
  pkg.scripts?.["report:twii-bounded-readonly-preflight-single-attempt-execution-packet"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-bounded-readonly-preflight-single-attempt-execution-packet`);
}
if (
  pkg.scripts?.["check:twii-bounded-readonly-preflight-single-attempt-execution-packet"] !==
  `node ${checkerPath}`
) {
  problems.push(`${packagePath} missing check:twii-bounded-readonly-preflight-single-attempt-execution-packet`);
}

for (const phrase of [
  "TWII Bounded Readonly Preflight Single Attempt Execution Packet",
  "twii_bounded_readonly_preflight_single_attempt_execution_packet_ready_not_executed",
  "ready_for_one_bounded_readonly_attempt_authorization_not_executed",
  "CEO_AUTHORIZES_ONE_TWII_BOUNDED_READONLY_PREFLIGHT_ATTEMPT_20260609_A",
  "twii-bounded-readonly-preflight-20260609-a",
  "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE",
  "twii_bounded_readonly_preflight_real_readonly_runner_boundary_ready_no_remote_attempt",
  "ready_for_single_remote_readonly_attempt_authorization_not_executed",
  "twii_bounded_readonly_preflight_real_readonly_boundary_dry_run_ready",
  "accepted_real_readonly_boundary_dry_run_no_remote_attempt",
  "--dry-run-real-readonly-boundary",
  "--execute",
  "authorization-phrase",
  "No SQL",
  "No Supabase connection in this packet",
  "No Supabase read in this packet",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded readonly preflight single-attempt execution packet slice",
  "docs/TWII_BOUNDED_READONLY_PREFLIGHT_SINGLE_ATTEMPT_EXECUTION_PACKET.md",
  "twii_bounded_readonly_preflight_single_attempt_execution_packet_ready_not_executed",
  "ready_for_one_bounded_readonly_attempt_authorization_not_executed"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_READONLY_PREFLIGHT_SINGLE_ATTEMPT_EXECUTION_PACKET.md` is `accepted` as TWII bounded readonly preflight single-attempt execution packet",
  "twii_bounded_readonly_preflight_single_attempt_execution_packet_ready_not_executed"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-readonly-preflight-single-attempt-execution-packet.mjs",
  "name: \"twii-bounded-readonly-preflight-single-attempt-execution-packet\"",
  "\"twii-bounded-readonly-preflight-single-attempt-execution-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["single-attempt execution packet report stdout", reportRun.stdout ?? ""]
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
      guardedStatus: "twii_bounded_readonly_preflight_single_attempt_execution_packet_ready_not_executed"
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
    "supabaseConnectionAllowedInThisPacket",
    "supabaseReadAllowedInThisPacket",
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
