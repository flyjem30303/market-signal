import fs from "node:fs";

const problems = [];

const docPath = "docs/CHAIRMAN_BETA_LAUNCH_REVIEW_PACKET.md";
const publicBetaPath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const publicBeta = read(publicBetaPath);
const board = read(boardPath);
const projectStatus = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `chairman_beta_launch_review_packet_ready_for_review_not_deployed`",
  "CEO recommendation: `approve_beta_launch_packet_for_two_value_intake_and_pre_execution_review`",
  "`BETA_HOSTING_PROJECT_NAME`",
  "`BETA_TEMPORARY_URL`",
  "`ready_for_local_public_beta_preflight_not_production_deployed`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`182/360`",
  "`180/180`",
  "`0/60`",
  "`2/120`",
  "`accepted_to_continue_beta_packet_window`",
  "No accepted packet-window reviewed artifact exists yet.",
  "Runtime mock-to-real promotion gate is not accepted.",
  "PM next route:",
  "A1 remains on data and source-rights unblock",
  "A2 remains on public trust and copy clarity",
  "I / operator should provide only",
  "visual polish after launch-blocking trust copy and route clarity",
  "Deployment remains unauthorized until a later explicit execution gate."
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [publicBetaPath, publicBeta, "Status: `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`"],
  [boardPath, board, "MVP row coverage target: `360/360`"],
  [boardPath, board, "Latest accepted aggregate row coverage evidence: `182/360`"],
  [boardPath, board, "`docs/BETA_PACKET_TO_DEPLOYMENT_PRE_EXECUTION_BRIDGE.md` is `accepted`"],
  [statusPath, projectStatus, "Latest chairman beta launch review packet slice"],
  [statusPath, projectStatus, "chairman_beta_launch_review_packet_ready_for_review_not_deployed"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["check:chairman-beta-launch-review-packet"] !== "node scripts/check-chairman-beta-launch-review-packet.mjs") {
  problems.push(`${packagePath} missing check:chairman-beta-launch-review-packet script`);
}

for (const phrase of [
  "scripts/check-chairman-beta-launch-review-packet.mjs",
  "expectStatus: \"ok\"",
  "name: \"chairman-beta-launch-review-packet\"",
  "\"chairman-beta-launch-review-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
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
  "Supabase write",
  "Supabase connection for deployment proof",
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

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "chairman_beta_launch_review_packet_ready_for_review_not_deployed",
      recommendedOutcome: "accepted_to_continue_beta_packet_window",
      nextRoute: "two_value_beta_packet_window",
      docPath
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
