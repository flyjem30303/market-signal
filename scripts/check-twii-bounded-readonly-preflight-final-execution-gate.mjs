import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TWII_BOUNDED_READONLY_PREFLIGHT_FINAL_EXECUTION_GATE.md";
const reportPath = "scripts/report-twii-bounded-readonly-preflight-final-execution-gate.mjs";
const checkerPath = "scripts/check-twii-bounded-readonly-preflight-final-execution-gate.mjs";
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
const report = parseJson(reportRun.stdout ?? "", "final execution gate report stdout");
if (reportRun.status !== 0) problems.push("final execution gate report must exit 0");
if (report.status !== "twii_bounded_readonly_preflight_final_execution_gate_ready_not_executed") {
  problems.push("final execution gate report must be ready not executed");
}
if (report.outcome !== "ready_for_explicit_single_attempt_decision_not_executed") {
  problems.push("final execution gate outcome must be ready for explicit decision not executed");
}
assertSafety(report, "final execution gate report");

if (
  pkg.scripts?.["report:twii-bounded-readonly-preflight-final-execution-gate"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-bounded-readonly-preflight-final-execution-gate`);
}
if (
  pkg.scripts?.["check:twii-bounded-readonly-preflight-final-execution-gate"] !==
  `node ${checkerPath}`
) {
  problems.push(`${packagePath} missing check:twii-bounded-readonly-preflight-final-execution-gate`);
}

for (const phrase of [
  "TWII Bounded Readonly Preflight Final Execution Gate",
  "twii_bounded_readonly_preflight_final_execution_gate_ready_not_executed",
  "ready_for_explicit_single_attempt_decision_not_executed",
  "authorize_one_bounded_readonly_preflight_attempt",
  "implement_real_readonly_runner_before_attempt",
  "twii-bounded-readonly-preflight-20260609-a",
  "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE",
  "No SQL",
  "No Supabase connection in this final gate",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded readonly preflight final execution gate slice",
  "docs/TWII_BOUNDED_READONLY_PREFLIGHT_FINAL_EXECUTION_GATE.md",
  "twii_bounded_readonly_preflight_final_execution_gate_ready_not_executed",
  "ready_for_explicit_single_attempt_decision_not_executed"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_READONLY_PREFLIGHT_FINAL_EXECUTION_GATE.md` is `accepted` as TWII bounded readonly preflight final execution gate",
  "twii_bounded_readonly_preflight_final_execution_gate_ready_not_executed"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-readonly-preflight-final-execution-gate.mjs",
  "name: \"twii-bounded-readonly-preflight-final-execution-gate\"",
  "\"twii-bounded-readonly-preflight-final-execution-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["final execution gate report stdout", reportRun.stdout ?? ""]
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
      guardedStatus: "twii_bounded_readonly_preflight_final_execution_gate_ready_not_executed"
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
    "supabaseConnectionAllowedInThisGate",
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
