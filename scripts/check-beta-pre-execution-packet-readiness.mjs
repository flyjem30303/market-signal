import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-beta-pre-execution-packet-readiness.mjs";
const checkPath = "scripts/check-beta-pre-execution-packet-readiness.mjs";
const docPath = "docs/BETA_PRE_EXECUTION_PACKET_READINESS.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "beta_pre_execution_packet_readiness"],
  [reportPath, reportSource, "compress_packet_pre_execution_readiness_into_one_pm_route"],
  [reportPath, reportSource, "report:beta-mainline-current-route"],
  [reportPath, reportSource, "report:beta-packet-window-readiness-summary"],
  [reportPath, reportSource, "goalReadiness"],
  [reportPath, reportSource, "packetExecutionSequence"],
  [reportPath, reportSource, "deploymentAuthorized: false"],
  [reportPath, reportSource, "supabaseRead: false"],
  [reportPath, reportSource, "supabaseWritten: false"],
  [checkPath, checkSource, "beta_pre_execution_packet_readiness_ready_waiting_platform_values"],
  [docPath, doc, "Status: `beta_pre_execution_packet_readiness_ready_waiting_platform_values`"],
  [docPath, doc, "cmd.exe /c npm run report:beta-pre-execution-packet-readiness"],
  [docPath, doc, "cmd.exe /c npm run check:beta-pre-execution-packet-readiness"],
  [docPath, doc, "BETA_HOSTING_PROJECT_NAME"],
  [docPath, doc, "BETA_TEMPORARY_URL"],
  [docPath, doc, "`goalReadiness`"],
  [docPath, doc, "`publicDataSource=mock`"],
  [docPath, doc, "`scoreSource=mock`"],
  [statusPath, status, "Latest beta pre-execution packet readiness slice"],
  [boardPath, board, "`report:beta-pre-execution-packet-readiness` is `accepted` as PM mainline packet pre-execution readiness surface"],
  [reviewGatePath, reviewGate, "name: \"beta-pre-execution-packet-readiness\""]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["report:beta-pre-execution-packet-readiness"] !== "node scripts/report-beta-pre-execution-packet-readiness.mjs") {
  problems.push(`${packagePath} missing report:beta-pre-execution-packet-readiness`);
}
if (pkg.scripts?.["check:beta-pre-execution-packet-readiness"] !== "node scripts/check-beta-pre-execution-packet-readiness.mjs") {
  problems.push(`${packagePath} missing check:beta-pre-execution-packet-readiness`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:beta-pre-execution-packet-readiness"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 420000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:beta-pre-execution-packet-readiness should exit 0");
if (!report) {
  problems.push("report:beta-pre-execution-packet-readiness should emit JSON");
} else {
  if (report.mode !== "beta_pre_execution_packet_readiness") problems.push("mode should be beta_pre_execution_packet_readiness");
  if (report.status !== "blocked_waiting_two_platform_values") {
    problems.push(`current status should be blocked_waiting_two_platform_values, got ${report.status}`);
  }
  if (report.pmNextCommand !== "cmd.exe /c npm run validate:beta-platform-two-values") {
    problems.push("pmNextCommand should remain the two-value validator while platform values are missing");
  }
  for (const blocker of [
    "BETA_HOSTING_PROJECT_NAME",
    "BETA_TEMPORARY_URL",
    "beta_platform_values_and_packet",
    "a1_source_rights_and_coverage_frontier",
    "two-value-validator"
  ]) {
    if (!report.currentBlockers?.includes(blocker)) problems.push(`currentBlockers should include ${blocker}`);
  }
  if (report.mainline?.status !== "blocked_waiting_two_platform_values") {
    problems.push("mainline.status should remain blocked_waiting_two_platform_values");
  }
  if (report.mainline?.pmDefaultWhenBlocked !== true) {
    problems.push("mainline.pmDefaultWhenBlocked should be true");
  }
  if (report.packetWindow?.status !== "blocked_waiting_two_platform_values") {
    problems.push("packetWindow.status should remain blocked_waiting_two_platform_values");
  }
  if (report.packetWindow?.proofMapStoppedAt !== "two-value-validator") {
    problems.push("packetWindow.proofMapStoppedAt should be two-value-validator");
  }
  if (report.goalReadiness?.status !== "public_beta_goal_not_ready_continue_parallel_work") {
    problems.push("goalReadiness.status should remain public_beta_goal_not_ready_continue_parallel_work");
  }
  for (const ready of ["runtime_core_routes", "a2_public_trust_copy"]) {
    if (!report.goalReadiness?.readyItems?.includes(ready)) problems.push(`goalReadiness.readyItems should include ${ready}`);
  }
  if (!report.goalReadiness?.heldItems?.includes("promotion_boundary")) {
    problems.push("goalReadiness.heldItems should include promotion_boundary");
  }
  for (const blocked of ["beta_platform_values_and_packet", "a1_source_rights_and_coverage_frontier"]) {
    if (!report.goalReadiness?.blockedItems?.includes(blocked)) problems.push(`goalReadiness.blockedItems should include ${blocked}`);
  }
  if (!Array.isArray(report.packetExecutionSequence) || report.packetExecutionSequence.length !== 4) {
    problems.push("packetExecutionSequence should have four steps");
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  for (const flag of [
    "artifactCreated",
    "candidateRendered",
    "deploymentAuthorized",
    "deploymentExecuted",
    "evidenceRecorded",
    "hostingResourceMutated",
    "marketDataFetched",
    "platformEnvMutated",
    "publicSourcePromoted",
    "reviewedArtifactAccepted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseConnected",
    "supabaseRead",
    "supabaseWritten"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }
  if (!report.sourceReports?.betaMainlineCurrentRoute?.parsedJson) {
    problems.push("sourceReports.betaMainlineCurrentRoute should parse");
  }
  if (!report.sourceReports?.betaPacketWindowReadinessSummary?.parsedJson) {
    problems.push("sourceReports.betaPacketWindowReadinessSummary should parse");
  }
}

for (const [filePath, source] of [
  [reportPath, reportSource],
  [docPath, doc],
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
      guardedStatus: "beta_pre_execution_packet_readiness_ready_waiting_platform_values",
      reportStatus: report.status,
      nextCommand: report.pmNextCommand,
      currentBlockers: report.currentBlockers
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
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
    /Supabase reads are approved/iu,
    /Supabase writes are approved/iu,
    /row coverage points awarded/iu,
    /complete MVP coverage achieved/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu
  ];
}
