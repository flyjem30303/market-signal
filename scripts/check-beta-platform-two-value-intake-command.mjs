import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-beta-platform-two-value-intake-command.mjs";
const checkPath = "scripts/check-beta-platform-two-value-intake-command.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "beta_platform_two_value_intake_command"],
  [reportPath, reportSource, "prefer_ephemeral_post_reply_one_runner_before_env_persistence"],
  [reportPath, reportSource, "BETA_HOSTING_PROJECT_NAME"],
  [reportPath, reportSource, "BETA_TEMPORARY_URL"],
  [reportPath, reportSource, "cmd.exe /c npm run report:public-beta-external-input-response-readiness"],
  [reportPath, reportSource, "cmd.exe /c npm run run:public-beta-post-reply-route-once"],
  [reportPath, reportSource, "the one-runner handles platform validation, packet-window proof map, and mainline route refresh internally"],
  [reportPath, reportSource, "No values are stored by this report."],
  [reportPath, reportSource, "No local env file persistence is executed by this report."],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "beta_platform_two_value_intake_command_ready"],
  [packagePath, JSON.stringify(pkg), "report:beta-platform-two-value-intake-command"],
  [packagePath, JSON.stringify(pkg), "check:beta-platform-two-value-intake-command"],
  [reviewGatePath, reviewGate, "name: \"beta-platform-two-value-intake-command\""],
  [reviewGatePath, reviewGate, "scripts/check-beta-platform-two-value-intake-command.mjs"],
  [statusPath, status, "Latest beta platform two-value intake command slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:beta-platform-two-value-intake-command"] !==
  "node scripts/report-beta-platform-two-value-intake-command.mjs"
) {
  problems.push(`${packagePath} missing report:beta-platform-two-value-intake-command`);
}

if (
  pkg.scripts?.["check:beta-platform-two-value-intake-command"] !==
  "node scripts/check-beta-platform-two-value-intake-command.mjs"
) {
  problems.push(`${packagePath} missing check:beta-platform-two-value-intake-command`);
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push(`${reportPath} should exit 0`);
if (!report) {
  problems.push(`${reportPath} should emit JSON`);
} else {
  if (report.status !== "ready_waiting_two_safe_platform_values") {
    problems.push(`unexpected report status ${String(report.status)}`);
  }
  if (report.mode !== "beta_platform_two_value_intake_command") {
    problems.push("report mode must be beta_platform_two_value_intake_command");
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (!Array.isArray(report.commandSkeleton) || report.commandSkeleton.length !== 5) {
    problems.push("commandSkeleton must include five local shell steps");
  }
  if (!report.commandSkeleton?.includes("cmd.exe /c npm run report:public-beta-external-input-response-readiness")) {
    problems.push("commandSkeleton must include response-readiness");
  }
  if (!report.commandSkeleton?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
    problems.push("commandSkeleton must include combined post-reply one-runner");
  }
  if (report.commandSkeleton?.includes("cmd.exe /c npm run run:beta-packet-window-proof-map")) {
    problems.push("commandSkeleton must not expose lower-level packet-window proof map as the routine PM step");
  }
  if (report.commandSkeleton?.includes("cmd.exe /c npm run validate:beta-platform-two-values")) {
    problems.push("commandSkeleton must not expose standalone validator as the routine PM step");
  }
  if (JSON.stringify(report).includes("taiwan-market-signal-beta.example.app")) {
    problems.push("report must not include sample concrete URLs");
  }
  if (JSON.stringify(report).includes("sb_")) {
    problems.push("report must not include Supabase key-like content");
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "beta_platform_two_value_intake_command_ready",
      nextCommand: "cmd.exe /c npm run report:beta-platform-two-value-intake-command",
      publicDataSource: "mock",
      scoreSource: "mock"
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
    /fs\.writeFile/u,
    /\.env\.local.*write/iu,
    /vercel\s+deploy/iu,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /publicDataSource:\s*"supabase"/u,
    /scoreSource:\s*"real"/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
  ];
}
