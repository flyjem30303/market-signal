import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_LAUNCH_NEXT_ACTION_REPORT.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const reportPath = "scripts/report-beta-launch-next-action.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const reportScript = read(reportPath);

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:beta-launch-next-action"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: skipDotenv(withoutBetaValues(process.env)),
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:beta-launch-next-action should exit 0 with missing values");
if (report?.status !== "blocked_waiting_external_input_response") {
  problems.push("report:beta-launch-next-action missing-value run should return blocked_waiting_external_input_response");
}
if (report?.currentState?.runtimeBoundary?.publicDataSource !== "mock") {
  problems.push("report should preserve publicDataSource mock boundary");
}
if (report?.currentState?.runtimeBoundary?.scoreSource !== "mock") {
  problems.push("report should preserve scoreSource mock boundary");
}
if (report?.currentState?.platformValues?.valuesAreNotPrinted !== true) {
  problems.push("report should explicitly avoid printing platform values");
}
if (report?.pmCommand !== "cmd.exe /c npm run report:public-beta-external-input-request") {
  problems.push("missing-value launch next-action should route PM to public beta external input request");
}
if (report?.pmMainlineNextAction !== "use_single_external_input_request_for_platform_values_and_a1_evidence") {
  problems.push("missing-value launch next-action should use the single external-input route");
}
if (report?.a1NextAction !== "collect_a1_twii_four_slot_no_secret_evidence_then_response_readiness_and_pm_classify") {
  problems.push("missing-value launch next-action should keep A1 on the TWII four-slot no-secret evidence route");
}
if (report?.a1Command !== "cmd.exe /c npm run report:a1-twii-four-slot-reply-request") {
  problems.push("missing-value launch next-action should expose the A1 four-slot reply-request command");
}
if (report?.currentState?.a1TwiiFourSlotEvidence?.requiredEvidenceCount !== 4) {
  problems.push("A1 TWII evidence summary should use the four-slot required count");
}
if (report?.currentState?.a1TwiiFourSlotEvidence?.pendingEvidenceCount !== 4) {
  problems.push("A1 TWII evidence summary should report four pending slots while the ledger is pending");
}
if (report?.currentState?.a1TwiiFourSlotEvidence?.nextCommand !== "cmd.exe /c npm run report:a1-twii-four-slot-reply-request") {
  problems.push("A1 TWII evidence nextCommand should point to the four-slot reply request");
}
if (report?.currentState?.a1TwiiFourSlotEvidence?.afterReplyFirstCommand !== "cmd.exe /c npm run report:public-beta-external-input-response-readiness") {
  problems.push("A1 TWII evidence after-reply first command should return to response-readiness");
}

const safeRun = spawnSync("cmd.exe", ["/c", "npm", "run", "report:beta-launch-next-action"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    ...process.env,
    BETA_PLATFORM_VALUES_SKIP_DOTENV: "1",
    BETA_HOSTING_PROJECT_NAME: "taiwan-market-signal-beta",
    BETA_TEMPORARY_URL: "https://taiwan-market-signal-beta.vercel.app/"
  },
  timeout: 120000,
  windowsHide: true
});
const safeReport = parseJson(safeRun.stdout ?? "");

if (safeRun.status !== 0) problems.push("report:beta-launch-next-action should exit 0 with safe placeholder values");
if (safeReport?.status !== "ready_to_run_public_beta_post_reply_one_runner") {
  problems.push("safe-value launch next-action should be ready for public beta post-reply one-runner");
}
if (safeReport?.pmCommand !== "cmd.exe /c npm run run:public-beta-post-reply-route-once") {
  problems.push("safe-value launch next-action should route PM to the public beta post-reply one-runner");
}
if (
  safeReport?.pmMainlineNextAction !==
  "run_public_beta_post_reply_one_runner_then_record_reviewed_artifact_outcome_if_packet_review_reached"
) {
  problems.push("safe-value launch next-action should describe the public beta post-reply one-runner route");
}
if (safeReport?.pmCommand === "cmd.exe /c npm run run:beta-platform-two-value-proof-map-once") {
  problems.push("safe-value launch next-action must not expose the lower-level platform proof runner as PM route");
}
if (safeRun.stdout.includes("taiwan-market-signal-beta.vercel.app")) {
  problems.push("safe-value launch next-action must not print the temporary beta URL");
}

for (const [filePath, source, phrase] of [
  [docPath, doc, "Status: `beta_launch_next_action_report_ready`"],
  [docPath, doc, "CEO decision: `route_beta_launch_next_action_by_current_gate_state`"],
  [docPath, doc, "blocked_waiting_external_input_response"],
  [docPath, doc, "blocked_waiting_two_platform_values"],
  [docPath, doc, "ready_to_run_public_beta_post_reply_one_runner"],
  [docPath, doc, "ready_to_render_pre_execution_packet_candidate"],
  [docPath, doc, "cmd.exe /c npm run report:beta-launch-next-action"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-input-request"],
  [docPath, doc, "cmd.exe /c npm run run:public-beta-post-reply-route-once"],
  [docPath, doc, "cmd.exe /c npm run report:a1-twii-four-slot-reply-request"],
  [docPath, doc, "cmd.exe /c npm run check:a1-twii-evidence-response-shape"],
  [docPath, doc, "BETA_HOSTING_PROJECT_NAME"],
  [docPath, doc, "BETA_TEMPORARY_URL"],
  [docPath, doc, "`publicDataSource=mock`"],
  [docPath, doc, "`scoreSource=mock`"],
  [statusPath, status, "Latest beta launch next-action report slice"],
  [statusPath, status, "beta_launch_next_action_report_ready"],
  [boardPath, board, "`docs/BETA_LAUNCH_NEXT_ACTION_REPORT.md` is `accepted` as PM mainline next-action router"],
  [boardPath, board, "blocked_waiting_external_input_response"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["report:beta-launch-next-action"] !== "node scripts/report-beta-launch-next-action.mjs") {
  problems.push(`${packagePath} missing report:beta-launch-next-action script`);
}
if (pkg.scripts?.["check:beta-launch-next-action"] !== "node scripts/check-beta-launch-next-action.mjs") {
  problems.push(`${packagePath} missing check:beta-launch-next-action script`);
}

for (const phrase of [
  "scripts/check-beta-launch-next-action.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-launch-next-action\"",
  "\"beta-launch-next-action\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "No deployment is authorized by this report.",
  "No SQL is executed by this report.",
  "No Supabase connection or write is executed by this report.",
  "No staging rows or daily_prices rows are created or modified by this report.",
  "No raw market data is fetched, stored, ingested, or committed by this report.",
  "No secrets, raw payloads, row payloads, or stock id payloads are printed by this report.",
  "publicDataSource remains mock and scoreSource remains mock.",
  "A1 source-rights work stays narrowed to the four TWII no-secret evidence slots while PM waits for the current external-input reply."
]) {
  if (!reportScript.includes(phrase)) problems.push(`${reportPath} missing stop line: ${phrase}`);
  if (!doc.includes(phrase)) problems.push(`${docPath} missing stop line: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu,
  /deployment completed/iu,
  /SQL execution is approved/iu,
  /Supabase writes are approved/iu,
  /raw payload approved/iu,
  /investment advice is approved/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
  if (pattern.test(reportScript)) problems.push(`${reportPath} contains forbidden pattern: ${pattern}`);
}

if (doc.includes("cmd.exe /c npm run run:beta-platform-two-value-proof-map-once")) {
  problems.push(`${docPath} must not expose run:beta-platform-two-value-proof-map-once as a PM next-action command`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "beta_launch_next_action_report_ready",
      observedMissingValueRoute: report.status,
      nextRoute: report.pmMainlineNextAction
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
  return next;
}

function skipDotenv(env) {
  return {
    ...env,
    BETA_PLATFORM_VALUES_SKIP_DOTENV: "1"
  };
}
