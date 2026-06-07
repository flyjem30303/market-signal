import fs from "node:fs";
import path from "node:path";

const problems = [];

const docPath = "docs/BETA_PACKET_TO_DEPLOYMENT_PRE_EXECUTION_BRIDGE.md";
const recorderDocPath = "docs/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_OUTCOME_RECORDER.md";
const proofMapDocPath = "docs/BETA_PACKET_WINDOW_ONE_COMMAND_PROOF_MAP.md";
const executionDraftPath = "docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md";
const futureGatePath = "docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewsDir = "docs/reviews";

const doc = read(docPath);
const recorderDoc = read(recorderDocPath);
const proofMapDoc = read(proofMapDocPath);
const executionDraft = read(executionDraftPath);
const futureGate = read(futureGatePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const projectStatus = read(statusPath);
const board = read(boardPath);

for (const phrase of [
  "Status: `beta_packet_to_deployment_pre_execution_bridge_ready_waiting_reviewed_artifact`",
  "CEO decision: `bridge_accepted_packet_artifact_to_pre_execution_packet_not_deployment`",
  "beta_packet_to_deployment_pre_execution_bridge",
  "bridge_ready_waiting_for_accepted_reviewed_artifact",
  "`waiting_for_accepted_reviewed_artifact`",
  "`accepted_artifact_ready_for_pre_execution_packet`",
  "`rejected_or_blocked_artifact_requires_repair`",
  "An accepted reviewed artifact is not deployment authorization.",
  "deploymentAuthorized=false",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "docs/reviews/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_*.md",
  "secret/env owner outside repo",
  "rollback owner and rollback reference",
  "incident owner and first-response channel"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [recorderDocPath, recorderDoc, "beta_packet_window_reviewed_artifact_outcome_recorder_ready_waiting_values"],
  [proofMapDocPath, proofMapDoc, "beta_packet_window_one_command_proof_map_ready_waiting_values"],
  [executionDraftPath, executionDraft, "beta_deployment_execution_packet_draft_not_executable"],
  [futureGatePath, futureGate, "future_deployment_execution_gate_ready_not_executed"],
  [statusPath, projectStatus, "Latest beta packet to deployment pre-execution bridge slice"],
  [statusPath, projectStatus, "beta_packet_to_deployment_pre_execution_bridge_ready_waiting_reviewed_artifact"],
  [
    boardPath,
    board,
    "`docs/BETA_PACKET_TO_DEPLOYMENT_PRE_EXECUTION_BRIDGE.md` is `accepted` as PM mainline packet-to-deployment pre-execution bridge"
  ],
  [boardPath, board, "bridge_ready_waiting_for_accepted_reviewed_artifact"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:beta-packet-to-deployment-pre-execution-bridge"] !==
  "node scripts/check-beta-packet-to-deployment-pre-execution-bridge.mjs"
) {
  problems.push(`${packagePath} missing check:beta-packet-to-deployment-pre-execution-bridge script`);
}

for (const phrase of [
  "scripts/check-beta-packet-to-deployment-pre-execution-bridge.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-packet-to-deployment-pre-execution-bridge\"",
  "\"beta-packet-to-deployment-pre-execution-bridge\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

const reviewedArtifacts = listReviewedArtifacts();
const acceptedArtifacts = reviewedArtifacts.filter((filePath) => read(filePath).includes("Status: `accepted`"));
const rejectedOrBlockedArtifacts = reviewedArtifacts.filter((filePath) => {
  const source = read(filePath);
  return source.includes("Status: `rejected`") || source.includes("Status: `blocked`");
});

const observedBridgeState =
  acceptedArtifacts.length > 0
    ? "accepted_artifact_ready_for_pre_execution_packet"
    : rejectedOrBlockedArtifacts.length > 0
      ? "rejected_or_blocked_artifact_requires_repair"
      : "waiting_for_accepted_reviewed_artifact";

if (observedBridgeState === "accepted_artifact_ready_for_pre_execution_packet") {
  for (const filePath of acceptedArtifacts) {
    const artifact = read(filePath);
    for (const phrase of [
      "publicDataSource: `mock`",
      "scoreSource: `mock`",
      "Deployment authorized: `false`",
      "No deployment command execution.",
      "No `publicDataSource=supabase`.",
      "No `scoreSource=real`."
    ]) {
      if (!artifact.includes(phrase)) problems.push(`${filePath} accepted artifact missing boundary phrase: ${phrase}`);
    }
  }
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

for (const [filePath, source] of [[docPath, doc]]) {
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
      guardedStatus: "beta_packet_to_deployment_pre_execution_bridge_ready_waiting_reviewed_artifact",
      observedBridgeState,
      reviewedArtifactCount: reviewedArtifacts.length,
      acceptedArtifactCount: acceptedArtifacts.length,
      outcome: "bridge_ready_waiting_for_accepted_reviewed_artifact"
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

function listReviewedArtifacts() {
  if (!fs.existsSync(reviewsDir)) return [];
  return fs
    .readdirSync(reviewsDir)
    .filter((fileName) => /^BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_\d{4}-\d{2}-\d{2}(?:_\d{2})?\.md$/u.test(fileName))
    .map((fileName) => path.join(reviewsDir, fileName));
}
