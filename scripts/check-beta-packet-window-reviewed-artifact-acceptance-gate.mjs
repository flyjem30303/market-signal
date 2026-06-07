import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_ACCEPTANCE_GATE.md";
const rendererDocPath = "docs/BETA_PACKET_WINDOW_EXECUTABLE_CANDIDATE_TEMPLATE.md";
const rendererPath = "scripts/render-beta-packet-window-candidate-template.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const rendererDoc = read(rendererDocPath);
const renderer = read(rendererPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `beta_packet_window_reviewed_artifact_acceptance_gate_ready_waiting_values`",
  "CEO decision: `require_reviewed_acceptance_record_after_candidate_template`",
  "beta_packet_window_reviewed_artifact_acceptance_gate",
  "acceptance_gate_ready_external_values_still_pending",
  "render:beta-packet-window-candidate-template",
  "`accepted` or `rejected`",
  "\"status\": \"accepted\"",
  "\"templateStatus\": \"packet_window_candidate_template_ready_shape_only\"",
  "\"worktreeState\": \"clean\"",
  "\"publicDataSource\": \"mock\"",
  "\"scoreSource\": \"mock\"",
  "\"deploymentAuthorized\": false",
  "`blocked_waiting_values`",
  "`rejected`",
  "`accepted`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [rendererDocPath, rendererDoc, "beta_packet_window_executable_candidate_template_ready_waiting_values"],
  [rendererPath, renderer, "packet_window_candidate_template_ready_shape_only"],
  [statusPath, read(statusPath), "Latest beta packet window reviewed artifact acceptance gate slice"],
  [statusPath, read(statusPath), "beta_packet_window_reviewed_artifact_acceptance_gate_ready_waiting_values"],
  [
    boardPath,
    read(boardPath),
    "`docs/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_ACCEPTANCE_GATE.md` is `accepted` as PM mainline reviewed artifact acceptance gate"
  ],
  [boardPath, read(boardPath), "acceptance_gate_ready_external_values_still_pending"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:beta-packet-window-reviewed-artifact-acceptance-gate"] !==
  "node scripts/check-beta-packet-window-reviewed-artifact-acceptance-gate.mjs"
) {
  problems.push(`${packagePath} missing check:beta-packet-window-reviewed-artifact-acceptance-gate script`);
}

for (const phrase of [
  "scripts/check-beta-packet-window-reviewed-artifact-acceptance-gate.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-packet-window-reviewed-artifact-acceptance-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

const renderRun = spawnSync("cmd.exe", ["/c", "npm", "run", "render:beta-packet-window-candidate-template"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: withoutBetaValues(process.env),
  windowsHide: true
});

if (renderRun.status !== 0) problems.push(`${rendererPath} absent-value render should exit 0`);
if (!renderRun.stdout.includes('"status": "blocked_waiting_values"')) {
  problems.push(`${rendererPath} absent-value render did not report blocked_waiting_values`);
}
if (!renderRun.stdout.includes('"candidateTemplate": null')) {
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
  [docPath, doc]
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
      guardedStatus: "beta_packet_window_reviewed_artifact_acceptance_gate_ready_waiting_values",
      outcome: "acceptance_gate_ready_external_values_still_pending"
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
