import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const runnerPath = "scripts/run-beta-platform-two-value-proof-map-once.mjs";
const checkPath = "scripts/check-beta-platform-two-value-proof-map-once.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const launchBoardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const runner = read(runnerPath);
const check = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const reviewGate = read(reviewGatePath);
const launchBoard = read(launchBoardPath);

for (const [filePath, source, phrase] of [
  [runnerPath, runner, "platform_two_value_packet_window_chain_ready_pending_pm_review"],
  [runnerPath, runner, "report:public-beta-external-input-response-readiness"],
  [runnerPath, runner, "validate:beta-platform-two-values"],
  [runnerPath, runner, "run:beta-packet-window-proof-map"],
  [runnerPath, runner, "report:beta-mainline-current-route"],
  [runnerPath, runner, "blocked_waiting_two_platform_values"],
  [runnerPath, runner, "blocked_unsafe_platform_values"],
  [runnerPath, runner, "This runner does not print platform values."],
  [runnerPath, runner, "This runner does not store platform values."],
  [runnerPath, runner, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, check, "beta_platform_two_value_proof_map_once_ready"],
  [packagePath, JSON.stringify(pkg), "run:beta-platform-two-value-proof-map-once"],
  [packagePath, JSON.stringify(pkg), "check:beta-platform-two-value-proof-map-once"],
  [reviewGatePath, reviewGate, "scripts/check-beta-platform-two-value-proof-map-once.mjs"],
  [reviewGatePath, reviewGate, 'name: "beta-platform-two-value-proof-map-once"'],
  [launchBoardPath, launchBoard, "`run:beta-platform-two-value-proof-map-once` is `accepted` as PM mainline post-platform-value one-command proof chain"],
  [launchBoardPath, launchBoard, "platform_two_value_packet_window_chain_ready_pending_pm_review"],
  [launchBoardPath, launchBoard, "without printing/storing platform values"],
  [statusPath, status, "Latest beta platform two-value proof-map once runner slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["run:beta-platform-two-value-proof-map-once"] !==
  "node scripts/run-beta-platform-two-value-proof-map-once.mjs"
) {
  problems.push(`${packagePath} missing run:beta-platform-two-value-proof-map-once`);
}

if (
  pkg.scripts?.["check:beta-platform-two-value-proof-map-once"] !==
  "node scripts/check-beta-platform-two-value-proof-map-once.mjs"
) {
  problems.push(`${packagePath} missing check:beta-platform-two-value-proof-map-once`);
}

const absentRun = runScript({
  env: withoutBetaValues({
    ...process.env,
    BETA_PLATFORM_VALUES_SKIP_DOTENV: "1"
  })
});
const absentReport = parseJson(absentRun.stdout);

if (absentRun.status !== 0) problems.push("absent-value once runner should exit 0");
if (absentReport?.status !== "blocked_waiting_platform_values_or_a1_reply") {
  problems.push("absent-value once runner should stop at response-readiness missing-input state");
}
if (absentReport?.stoppedAt !== "after-reply-response-readiness") {
  problems.push("absent-value once runner should stop at after-reply-response-readiness");
}
if (absentReport?.nextCommand !== "cmd.exe /c npm run report:public-beta-external-input-request") {
  problems.push("absent-value once runner should route back to external input request");
}

const safeProject = "taiwan-market-signal-beta";
const safeUrl = "https://taiwan-market-signal-beta.vercel.app/";
const safeRun = runScript({
  env: {
    ...process.env,
    BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
    BETA_HOSTING_PROJECT_NAME: safeProject,
    BETA_TEMPORARY_URL: safeUrl
  }
});
const safeReport = parseJson(safeRun.stdout);

if (safeRun.status !== 0) problems.push("safe-value once runner should exit 0");
if (safeReport?.status !== "platform_two_value_packet_window_chain_ready_pending_pm_review") {
  problems.push("safe-value once runner should reach pending PM review");
}
if (safeReport?.stoppedAt !== null) problems.push("safe-value once runner should not stop early");
if (!safeReport?.steps?.some((step) => step.name === "packet-window-proof-map")) {
  problems.push("safe-value once runner should include packet-window-proof-map step");
}
if (!safeReport?.steps?.some((step) => step.name === "mainline-route-refresh")) {
  problems.push("safe-value once runner should refresh mainline route");
}
if (JSON.stringify(safeReport).includes(safeProject) || JSON.stringify(safeReport).includes(safeUrl)) {
  problems.push("safe-value once runner must not print concrete platform values");
}
for (const [flag, expected] of Object.entries({
  deploymentAuthorized: false,
  deploymentExecuted: false,
  evidenceRecorded: false,
  hostingMutated: false,
  marketDataFetched: false,
  platformValuesPrinted: false,
  rowCoverageAwarded: false,
  scoreSourceRealEnabled: false,
  secretsPrinted: false,
  sqlExecuted: false,
  supabaseReadsEnabled: false,
  supabaseWritesEnabled: false,
  valuesStored: false
})) {
  if (safeReport?.safety?.[flag] !== expected) problems.push(`safe-value safety.${flag} must be false`);
}
if (safeReport?.runtimeBoundary?.publicDataSource !== "mock") {
  problems.push("safe-value publicDataSource must remain mock");
}
if (safeReport?.runtimeBoundary?.scoreSource !== "mock") {
  problems.push("safe-value scoreSource must remain mock");
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(runner)) problems.push(`${runnerPath} forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "beta_platform_two_value_proof_map_once_ready",
      absentStatus: absentReport.status,
      safeStatus: safeReport.status,
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

function runScript({ env }) {
  return spawnSync("cmd.exe", ["/c", "npm", "run", "run:beta-platform-two-value-proof-map-once"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    timeout: 900000,
    windowsHide: true
  });
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
  return next;
}

function forbiddenPatterns() {
  return [
    /fs\.writeFile/u,
    /\.env\.local.*write/iu,
    /vercel\s+deploy/iu,
    /npm run deploy/iu,
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
