import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];

const reportPath = "scripts/report-public-beta-pm-next-status.mjs";
const checkPath = "scripts/check-public-beta-pm-next-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "public_beta_pm_next_status_ready"],
  [reportPath, reportSource, "report:public-beta-external-reply-file-route"],
  [reportPath, reportSource, "report:beta-mainline-current-route.goalReadiness"],
  [reportPath, reportSource, "report:beta-mainline-current-route"],
  [reportPath, reportSource, "PUBLIC_BETA_EXTERNAL_REPLY_PATH"],
  [reportPath, reportSource, "external_reply_file_exists_fill_platform_values_and_a1_no_secret_slots"],
  [reportPath, reportSource, "completionPercent"],
  [reportPath, reportSource, "nextSingleCommand"],
  [reportPath, reportSource, "write:public-beta-external-reply-file-template"],
  [reportPath, reportSource, "remainingHardBlockers"],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "public_beta_pm_next_status_ready"],
  [packagePath, JSON.stringify(pkg), "report:public-beta-pm-next-status"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-pm-next-status"],
  [reviewGatePath, reviewGate, "public-beta-pm-next-status"],
  [statusPath, status, "Latest public Beta PM next-status slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["report:public-beta-pm-next-status"] !== "node scripts/report-public-beta-pm-next-status.mjs") {
  problems.push(`${packagePath} missing report:public-beta-pm-next-status`);
}

if (pkg.scripts?.["check:public-beta-pm-next-status"] !== "node scripts/check-public-beta-pm-next-status.mjs") {
  problems.push(`${packagePath} missing check:public-beta-pm-next-status`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:public-beta-pm-next-status"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 420000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:public-beta-pm-next-status should exit 0");
if (!report) {
  problems.push("report:public-beta-pm-next-status should emit JSON");
} else {
  if (report.status !== "public_beta_pm_next_status_ready") {
    problems.push(`unexpected status ${String(report.status)}`);
  }
  if (report.mode !== "public_beta_pm_next_status") {
    problems.push("mode should be public_beta_pm_next_status");
  }
  if (typeof report.completionPercent !== "number" || report.completionPercent < 0 || report.completionPercent > 100) {
    problems.push("completionPercent should be a number from 0 to 100");
  }
  if (report.currentRoute?.pmAfterCurrentCommand !== "cmd.exe /c npm run report:public-beta-external-reply-file-route") {
    problems.push("currentRoute.pmAfterCurrentCommand should be route-first");
  }
  const allowedNextCommands = [
    "cmd.exe /c npm run write:public-beta-external-reply-file-template",
    "cmd.exe /c npm run fill:public-beta-external-reply-file-from-env"
  ];
  if (!allowedNextCommands.includes(report.currentRoute?.replyFileRouteNextCommand)) {
    problems.push("replyFileRouteNextCommand should either write the template or route an existing reply file to the copy packet");
  }
  if (!allowedNextCommands.includes(report.nextSingleCommand)) {
    problems.push("nextSingleCommand should either write the reply-file template or route an existing reply file to the copy packet");
  }
  if (!report.nextCommandChain?.includes("cmd.exe /c npm run report:public-beta-external-reply-file-route")) {
    problems.push("nextCommandChain should include the external reply file route");
  }
  for (const blocker of ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"]) {
    if (!report.remainingHardBlockers?.some((item) => item.id === blocker)) {
      problems.push(`remainingHardBlockers should include ${blocker}`);
    }
  }
  if (!report.remainingHardBlockers?.some((item) => item.id === "A1_TWII_FOUR_SLOT_NO_SECRET_SOURCE_RIGHTS_EVIDENCE")) {
    problems.push("remainingHardBlockers should include A1 TWII four-slot evidence");
  }
  if (report.proofSummary?.runtimeRoutesOk !== true) {
    problems.push("proofSummary.runtimeRoutesOk should be true");
  }
  if (report.proofSummary?.publicDataSource !== "mock") problems.push("proofSummary.publicDataSource must be mock");
  if (report.proofSummary?.scoreSource !== "mock") problems.push("proofSummary.scoreSource must be mock");
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("runtimeBoundary.publicDataSource must be mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("runtimeBoundary.scoreSource must be mock");
  for (const sourceReport of ["mainlineCurrentRoute", "replyFileRoute"]) {
    if (!report.sourceReports?.[sourceReport]?.parsedJson) {
      problems.push(`sourceReports.${sourceReport} should parse`);
    }
  }
  if (report.sourceReports?.embeddedGoalReadiness?.parsedJson !== true) {
    problems.push("sourceReports.embeddedGoalReadiness should parse from mainline report");
  }
  for (const flag of [
    "deploymentAuthorized",
    "evidenceRecorded",
    "fileTextEchoed",
    "hostingMutated",
    "marketDataFetched",
    "rawPayloadPrinted",
    "rowCoverageAwarded",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sourceRightsApproved",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "valuesStored"
  ]) {
    if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
  }
}

for (const [filePath, source] of [
  [reportPath, reportSource]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
  }
}

console.log(JSON.stringify({
  status: problems.length === 0 ? "ok" : "blocked",
  guardedStatus: "public_beta_pm_next_status_ready",
  problems,
  publicDataSource: report?.runtimeBoundary?.publicDataSource ?? "mock",
  scoreSource: report?.runtimeBoundary?.scoreSource ?? "mock"
}, null, 2));

if (problems.length > 0) process.exitCode = 1;

function read(filePath) {
  if (!fs.existsSync(filePath)) return filePath.endsWith(".json") ? "{}" : "";
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
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /deploymentAuthorized: true/u,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu
  ];
}
