import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_PACKET_WINDOW_EXECUTABLE_CANDIDATE_TEMPLATE.md";
const rendererPath = "scripts/render-beta-packet-window-candidate-template.mjs";
const dryRunDocPath = "docs/BETA_PACKET_WINDOW_CANDIDATE_DRY_RUN_RUNNER.md";
const candidateGatePath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const renderer = read(rendererPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `beta_packet_window_executable_candidate_template_ready_waiting_values`",
  "CEO decision: `prepare_packet_window_candidate_template_before_platform_values`",
  "beta_packet_window_executable_candidate_template",
  "candidate_template_ready_external_values_still_pending",
  "cmd.exe /c npm run render:beta-packet-window-candidate-template",
  "run:beta-packet-window-candidate-dry-run",
  "packet_window_candidate_ready_shape_only",
  "packet_window_candidate_template_ready_shape_only",
  "blocked_waiting_values",
  "rejected_unsafe_values",
  "repo_proof_blocked",
  "shape-only",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "run:beta-packet-window-candidate-dry-run",
  "packet_window_candidate_ready_shape_only",
  "packet_window_candidate_template_ready_shape_only",
  "blocked_waiting_values",
  "rejected_unsafe_values",
  "repo_proof_blocked",
  "packetCandidateAllowed: gitOk",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "create_separate_reviewed_packet_window_artifact"
]) {
  if (!renderer.includes(phrase)) problems.push(`${rendererPath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["render:beta-packet-window-candidate-template"] !== "node scripts/render-beta-packet-window-candidate-template.mjs") {
  problems.push(`${packagePath} missing render:beta-packet-window-candidate-template script`);
}

if (
  pkg.scripts?.["check:beta-packet-window-executable-candidate-template"] !==
  "node scripts/check-beta-packet-window-executable-candidate-template.mjs"
) {
  problems.push(`${packagePath} missing check:beta-packet-window-executable-candidate-template script`);
}

for (const phrase of [
  "scripts/check-beta-packet-window-executable-candidate-template.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-packet-window-executable-candidate-template\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [dryRunDocPath, "beta_packet_window_candidate_dry_run_runner_ready_waiting_values"],
  [candidateGatePath, "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending"],
  [statusPath, "Latest beta packet window executable candidate template slice"],
  [statusPath, "beta_packet_window_executable_candidate_template_ready_waiting_values"],
  [boardPath, "`docs/BETA_PACKET_WINDOW_EXECUTABLE_CANDIDATE_TEMPLATE.md` is `accepted` as PM mainline executable candidate template"],
  [boardPath, "candidate_template_ready_external_values_still_pending"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const absentRun = spawnSync(process.execPath, [rendererPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: withoutBetaValues(process.env),
  windowsHide: true
});

if (absentRun.status !== 0) problems.push(`${rendererPath} absent-value render should exit 0`);
if (!absentRun.stdout.includes('"status": "blocked_waiting_values"')) {
  problems.push(`${rendererPath} absent-value render did not report blocked_waiting_values`);
}
if (!absentRun.stdout.includes('"candidateTemplate": null')) {
  problems.push(`${rendererPath} absent-value render should not emit candidate template`);
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
  [rendererPath, renderer]
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
      guardedStatus: "beta_packet_window_executable_candidate_template_ready_waiting_values",
      outcome: "candidate_template_ready_external_values_still_pending",
      renderer: "render:beta-packet-window-candidate-template"
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
