import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_PACKET_WINDOW_READINESS_SUMMARY.md";
const reportPath = "scripts/report-beta-packet-window-readiness-summary.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const board = read(boardPath);

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:beta-packet-window-readiness-summary"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: withoutBetaValues(process.env),
  timeout: 360000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:beta-packet-window-readiness-summary should exit 0");
if (!report) problems.push("report:beta-packet-window-readiness-summary should emit JSON");

if (report) {
  if (report.status !== "blocked_waiting_two_platform_values") {
    problems.push(`current report status should be blocked_waiting_two_platform_values, got ${report.status}`);
  }
  if (report.pmNextCommand !== "cmd.exe /c npm run validate:beta-platform-two-values") {
    problems.push("blocked summary should route to validate:beta-platform-two-values");
  }
  if (report.validator?.valuesAreNotPrinted !== true) problems.push("valuesAreNotPrinted must be true");
  if (report.proofMap?.stoppedAt !== "two-value-validator") problems.push("proof map should stop at two-value-validator");
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  for (const flag of [
    "artifactCreated",
    "deploymentAuthorized",
    "deploymentExecuted",
    "hostingResourceMutated",
    "marketDataFetched",
    "platformEnvMutated",
    "publicSourcePromoted",
    "reviewedArtifactAccepted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseConnected",
    "supabaseWritten"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }
  if (!report.sourceReports?.validator?.parsedJson) problems.push("validator source report should parse");
  if (!report.sourceReports?.proofMap?.parsedJson) problems.push("proof map source report should parse");
}

for (const [filePath, source, phrase] of [
  [docPath, doc, "Status: `beta_packet_window_readiness_summary_ready_waiting_values`"],
  [docPath, doc, "Current outcome: `blocked_waiting_two_platform_values`"],
  [docPath, doc, "cmd.exe /c npm run report:beta-packet-window-readiness-summary"],
  [docPath, doc, "cmd.exe /c npm run validate:beta-platform-two-values"],
  [docPath, doc, "cmd.exe /c npm run run:beta-packet-window-proof-map"],
  [docPath, doc, "`publicDataSource=mock`"],
  [docPath, doc, "`scoreSource=mock`"],
  [statusPath, status, "Latest beta packet-window readiness summary slice"],
  [statusPath, status, "beta_packet_window_readiness_summary_ready_waiting_values"],
  [boardPath, board, "`report:beta-packet-window-readiness-summary` is `accepted` as PM packet-window readiness rollup"],
  [boardPath, board, "blocked_waiting_two_platform_values"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["report:beta-packet-window-readiness-summary"] !== "node scripts/report-beta-packet-window-readiness-summary.mjs") {
  problems.push(`${packagePath} missing report:beta-packet-window-readiness-summary`);
}
if (pkg.scripts?.["check:beta-packet-window-readiness-summary"] !== "node scripts/check-beta-packet-window-readiness-summary.mjs") {
  problems.push(`${packagePath} missing check:beta-packet-window-readiness-summary`);
}

for (const phrase of [
  "scripts/check-beta-packet-window-readiness-summary.mjs",
  "name: \"beta-packet-window-readiness-summary\"",
  "\"beta-packet-window-readiness-summary\""
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
      guardedStatus: "beta_packet_window_readiness_summary_ready_waiting_values",
      reportStatus: report.status,
      nextCommand: report.pmNextCommand
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

function withoutBetaValues(env) {
  const next = { ...env };
  delete next.BETA_HOSTING_PROJECT_NAME;
  delete next.BETA_TEMPORARY_URL;
  next.BETA_PLATFORM_VALUES_SKIP_DOTENV = "1";
  return next;
}

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /vercel deploy/iu,
    /npm run deploy/iu,
    /RUN_DEPLOY_NOW/u,
    /DEPLOYMENT_COMPLETED/u,
    /production deployment completed/iu,
    /preview deployment completed/iu,
    /deployment command executed/iu,
    /hosting project created/iu,
    /platform env mutated/iu,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /row coverage points awarded/iu,
    /complete MVP coverage achieved/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu
  ];
}
