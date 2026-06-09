import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/A1_SOURCE_RIGHTS_READINESS_SUMMARY.md";
const reportPath = "scripts/report-a1-source-rights-readiness-summary.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:a1-source-rights-readiness-summary"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:a1-source-rights-readiness-summary should exit 0");
if (!report) problems.push("report:a1-source-rights-readiness-summary should emit JSON");

if (report) {
  if (report.status !== "blocked_waiting_a1_exact_source_rights_evidence") {
    problems.push(`current report status should remain blocked_waiting_a1_exact_source_rights_evidence, got ${report.status}`);
  }
  if (report.nextCommand !== "cmd.exe /c npm run report:a1-twii-four-slot-reply-request") {
    problems.push("blocked readiness summary should route A1 back to the TWII four-slot reply request");
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (report.lanes?.TWII?.pendingCount !== 4) problems.push("TWII should currently have four pending slots");
  if (report.lanes?.ETF?.pendingCount !== 6) problems.push("ETF should currently have six pending slots");
  if (report.lanes?.TWII?.canOpenOutcomeGate !== false) problems.push("TWII outcome gate must remain closed");
  if (report.lanes?.ETF?.canOpenOutcomeGate !== false) problems.push("ETF outcome gate must remain closed");
  for (const flag of [
    "automatedRemoteRun",
    "candidateArtifactGenerated",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "publicSourcePromoted",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }
}

for (const [filePath, source, phrase] of [
  [docPath, doc, "Status: `a1_source_rights_readiness_summary_ready_evidence_pending`"],
  [docPath, doc, "Current outcome: `blocked_waiting_a1_exact_source_rights_evidence`"],
  [docPath, doc, "cmd.exe /c npm run report:a1-source-rights-readiness-summary"],
  [docPath, doc, "cmd.exe /c npm run report:a1-twii-four-slot-reply-request"],
  [docPath, doc, "TWII readiness: `4/4` pending"],
  [docPath, doc, "ETF readiness: `6/6` pending"],
  [docPath, doc, "`publicDataSource=mock`"],
  [docPath, doc, "`scoreSource=mock`"],
  [statusPath, status, "Latest A1 source-rights readiness summary slice"],
  [statusPath, status, "a1_source_rights_readiness_summary_ready_evidence_pending"],
  [boardPath, board, "`report:a1-source-rights-readiness-summary` is `accepted` as PM/A1 readiness rollup"],
  [boardPath, board, "blocked_waiting_a1_exact_source_rights_evidence"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["report:a1-source-rights-readiness-summary"] !== "node scripts/report-a1-source-rights-readiness-summary.mjs") {
  problems.push(`${packagePath} missing report:a1-source-rights-readiness-summary`);
}
if (pkg.scripts?.["check:a1-source-rights-readiness-summary"] !== "node scripts/check-a1-source-rights-readiness-summary.mjs") {
  problems.push(`${packagePath} missing check:a1-source-rights-readiness-summary`);
}

for (const phrase of [
  "scripts/check-a1-source-rights-readiness-summary.mjs",
  "name: \"a1-source-rights-readiness-summary\"",
  "\"a1-source-rights-readiness-summary\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const [filePath, source] of [
  [docPath, doc],
  [reportPath, reportSource],
  ["report output", run.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "a1_source_rights_readiness_summary_ready_evidence_pending",
      reportStatus: report.status,
      nextCommand: report.nextCommand
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /source rights (are )?approved/iu,
    /candidate generation is approved/iu,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /daily_prices mutation is approved/iu,
    /row coverage points awarded/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu,
    /public launch complete/iu
  ];
}
