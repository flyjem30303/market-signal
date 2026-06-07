import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_PACKET_WINDOW_ONE_COMMAND_PROOF_MAP.md";
const runnerPath = "scripts/run-beta-packet-window-proof-map.mjs";
const runbookPath = "docs/BETA_PACKET_WINDOW_NO_SECRET_ARTIFACT_CREATION_RUNBOOK.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const runner = read(runnerPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `beta_packet_window_one_command_proof_map_ready_waiting_values`",
  "CEO decision: `compress_packet_window_preflight_to_one_safe_command_map`",
  "beta_packet_window_one_command_proof_map",
  "one_command_proof_map_ready_external_values_still_pending",
  "cmd.exe /c npm run run:beta-packet-window-proof-map",
  "validate:beta-platform-two-values",
  "run:beta-packet-window-candidate-dry-run",
  "render:beta-packet-window-candidate-template",
  "render:beta-packet-window-reviewed-artifact-record-template",
  "`blocked_waiting_values`",
  "`rejected_unsafe_values`",
  "`repo_proof_blocked`",
  "`candidate_template_blocked`",
  "`reviewed_artifact_template_blocked`",
  "`reviewed_artifact_template_ready_pending_pm_review`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "validate:beta-platform-two-values",
  "run:beta-packet-window-candidate-dry-run",
  "render:beta-packet-window-candidate-template",
  "render:beta-packet-window-reviewed-artifact-record-template",
  "accepted_two_value_shape_only",
  "packet_window_candidate_ready_shape_only",
  "packet_window_candidate_template_ready_shape_only",
  "reviewed_artifact_record_template_ready_pending_pm_review",
  "blocked_waiting_values",
  "deploymentAuthorized: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["run:beta-packet-window-proof-map"] !== "node scripts/run-beta-packet-window-proof-map.mjs") {
  problems.push(`${packagePath} missing run:beta-packet-window-proof-map script`);
}

if (
  pkg.scripts?.["check:beta-packet-window-one-command-proof-map"] !==
  "node scripts/check-beta-packet-window-one-command-proof-map.mjs"
) {
  problems.push(`${packagePath} missing check:beta-packet-window-one-command-proof-map script`);
}

for (const phrase of [
  "scripts/check-beta-packet-window-one-command-proof-map.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-packet-window-one-command-proof-map\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [runbookPath, "beta_packet_window_no_secret_artifact_creation_runbook_ready_waiting_values"],
  [statusPath, "Latest beta packet window one-command proof map slice"],
  [statusPath, "beta_packet_window_one_command_proof_map_ready_waiting_values"],
  [boardPath, "`docs/BETA_PACKET_WINDOW_ONE_COMMAND_PROOF_MAP.md` is `accepted` as PM mainline one-command proof map"],
  [boardPath, "one_command_proof_map_ready_external_values_still_pending"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const absentRun = spawnSync("cmd.exe", ["/c", "npm", "run", "run:beta-packet-window-proof-map"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: withoutBetaValues(process.env),
  windowsHide: true
});

if (absentRun.status !== 0) problems.push(`${runnerPath} absent-value proof map should exit 0`);
if (!absentRun.stdout.includes('"status": "blocked_waiting_values"')) {
  problems.push(`${runnerPath} absent-value proof map did not report blocked_waiting_values`);
}
if (!absentRun.stdout.includes('"stoppedAt": "two-value-validator"')) {
  problems.push(`${runnerPath} absent-value proof map should stop at two-value-validator`);
}

for (const phrase of [
  "production deployment",
  "preview deployment",
  "deployment command execution",
  "hosting project creation",
  "hosting project mutation",
  "DNS change",
  "SSL configuration change",
  "platform env mutation",
  "secret output",
  "secret storage action",
  "SQL execution",
  "Supabase connection",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "row coverage points",
  "complete MVP coverage claim",
  "Supabase public-source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

const forbiddenPatterns = [
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

for (const [filePath, source] of [
  [docPath, doc],
  [runnerPath, runner]
]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern: ${pattern}`);
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
      guardedStatus: "beta_packet_window_one_command_proof_map_ready_waiting_values",
      outcome: "one_command_proof_map_ready_external_values_still_pending",
      runner: "run:beta-packet-window-proof-map"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}

function withoutBetaValues(env) {
  const next = { ...env };
  delete next.BETA_HOSTING_PROJECT_NAME;
  delete next.BETA_TEMPORARY_URL;
  return next;
}
