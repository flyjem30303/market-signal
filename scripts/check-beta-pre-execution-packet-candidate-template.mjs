import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_PRE_EXECUTION_PACKET_CANDIDATE_TEMPLATE.md";
const rendererPath = "scripts/render-beta-pre-execution-packet-candidate.mjs";
const bridgePath = "docs/BETA_PACKET_TO_DEPLOYMENT_PRE_EXECUTION_BRIDGE.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const renderer = read(rendererPath);
const bridge = read(bridgePath);
const projectStatus = read(statusPath);
const board = read(boardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `beta_pre_execution_packet_candidate_template_ready_waiting_accepted_artifact`",
  "CEO decision: `prepare_pre_execution_candidate_after_accepted_packet_window_artifact_not_deployment`",
  "beta_pre_execution_packet_candidate_template",
  "waiting_for_accepted_packet_window_reviewed_artifact",
  "cmd.exe /c npm run render:beta-pre-execution-packet-candidate",
  "`blocked_waiting_accepted_reviewed_artifact`",
  "`rejected_or_blocked_reviewed_artifact_requires_repair`",
  "`pre_execution_packet_candidate_ready_not_authorized`",
  "`deploymentAuthorized=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "does not write an output file",
  "No deployment command is emitted."
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [bridgePath, bridge, "accepted_artifact_ready_for_pre_execution_packet"],
  [bridgePath, bridge, "deploymentAuthorized=false"],
  [statusPath, projectStatus, "Latest beta pre-execution packet candidate template slice"],
  [statusPath, projectStatus, "beta_pre_execution_packet_candidate_template_ready_waiting_accepted_artifact"],
  [
    boardPath,
    board,
    "`docs/BETA_PRE_EXECUTION_PACKET_CANDIDATE_TEMPLATE.md` is `accepted` as PM mainline pre-execution packet candidate template"
  ],
  [boardPath, board, "waiting_for_accepted_packet_window_reviewed_artifact"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "blocked_waiting_accepted_reviewed_artifact",
  "pre_execution_packet_candidate_ready_not_authorized",
  "candidateAllowed",
  "deploymentAuthorized: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "no_deployment_command_execution",
  "no_publicDataSource_supabase",
  "no_scoreSource_real"
]) {
  if (!renderer.includes(phrase)) problems.push(`${rendererPath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["render:beta-pre-execution-packet-candidate"] !==
  "node scripts/render-beta-pre-execution-packet-candidate.mjs"
) {
  problems.push(`${packagePath} missing render:beta-pre-execution-packet-candidate script`);
}

if (
  pkg.scripts?.["check:beta-pre-execution-packet-candidate-template"] !==
  "node scripts/check-beta-pre-execution-packet-candidate-template.mjs"
) {
  problems.push(`${packagePath} missing check:beta-pre-execution-packet-candidate-template script`);
}

for (const phrase of [
  "scripts/check-beta-pre-execution-packet-candidate-template.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-pre-execution-packet-candidate-template\"",
  "\"beta-pre-execution-packet-candidate-template\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

const renderRun = spawnSync("cmd.exe", ["/c", "npm", "run", "render:beta-pre-execution-packet-candidate"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 120000,
  windowsHide: true
});
const renderJson = parseJsonFromStdout(renderRun.stdout ?? "");

if ((renderRun.status ?? 1) !== 0) {
  problems.push(`render:beta-pre-execution-packet-candidate exited ${renderRun.status ?? 1}`);
}

if (!renderJson) {
  problems.push("render:beta-pre-execution-packet-candidate did not emit JSON");
} else if (renderJson.status === "blocked_waiting_accepted_reviewed_artifact") {
  if (renderJson.candidateAllowed !== false || renderJson.deploymentAuthorized !== false) {
    problems.push("blocked renderer output must keep candidateAllowed=false and deploymentAuthorized=false");
  }
} else if (renderJson.status === "pre_execution_packet_candidate_ready_not_authorized") {
  if (
    renderJson.candidateAllowed !== true ||
    renderJson.deploymentAuthorized !== false ||
    renderJson.publicDataSource !== "mock" ||
    renderJson.scoreSource !== "mock"
  ) {
    problems.push("ready renderer output must preserve mock boundaries and deploymentAuthorized=false");
  }
} else if (renderJson.status !== "rejected_or_blocked_reviewed_artifact_requires_repair") {
  problems.push(`unexpected renderer status: ${renderJson.status}`);
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
      guardedStatus: "beta_pre_execution_packet_candidate_template_ready_waiting_accepted_artifact",
      rendererStatus: renderJson.status,
      candidateAllowed: renderJson.candidateAllowed,
      deploymentAuthorized: renderJson.deploymentAuthorized,
      outcome: "waiting_for_accepted_packet_window_reviewed_artifact"
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

function parseJsonFromStdout(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}
