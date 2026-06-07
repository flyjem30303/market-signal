import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_TWO_VALUE_OPERATOR_HANDOFF.md";
const validatorDocPath = "docs/BETA_PLATFORM_TWO_VALUE_VALIDATOR.md";
const chairmanPacketPath = "docs/CHAIRMAN_BETA_LAUNCH_REVIEW_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const validatorDoc = read(validatorDocPath);
const chairmanPacket = read(chairmanPacketPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const projectStatus = read(statusPath);
const board = read(boardPath);

for (const phrase of [
  "Status: `beta_two_value_operator_handoff_ready_waiting_values`",
  "CEO decision: `reduce_operator_handoff_to_two_safe_values`",
  "beta_two_value_operator_handoff",
  "handoff_ready_waiting_for_project_name_and_public_beta_url",
  "BETA_HOSTING_PROJECT_NAME=",
  "BETA_TEMPORARY_URL=",
  "cmd.exe /c npm run validate:beta-platform-two-values",
  "`blocked_waiting_values`",
  "`rejected_unsafe_values`",
  "`accepted_two_value_shape_only`",
  "cmd.exe /c npm run run:beta-packet-window-proof-map",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "Do not paste secrets into repo files.",
  "Do not reopen the full operator sheet unless this handoff fails."
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [validatorDocPath, validatorDoc, "Status: `beta_platform_two_value_validator_ready_waiting_values`"],
  [chairmanPacketPath, chairmanPacket, "CEO recommends the next action is to collect only two safe external Beta values"],
  [statusPath, projectStatus, "Latest beta two value operator handoff slice"],
  [statusPath, projectStatus, "beta_two_value_operator_handoff_ready_waiting_values"],
  [
    boardPath,
    board,
    "`docs/BETA_TWO_VALUE_OPERATOR_HANDOFF.md` is `accepted` as I/PM two-value operator handoff"
  ],
  [boardPath, board, "handoff_ready_waiting_for_project_name_and_public_beta_url"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["check:beta-two-value-operator-handoff"] !== "node scripts/check-beta-two-value-operator-handoff.mjs") {
  problems.push(`${packagePath} missing check:beta-two-value-operator-handoff script`);
}

for (const phrase of [
  "scripts/check-beta-two-value-operator-handoff.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-two-value-operator-handoff\"",
  "\"beta-two-value-operator-handoff\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

const absentRun = spawnSync("cmd.exe", ["/c", "npm", "run", "validate:beta-platform-two-values"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: withoutBetaValues(process.env),
  windowsHide: true
});

if (absentRun.status !== 0) problems.push("validate:beta-platform-two-values absent-value run should exit 0");
if (!absentRun.stdout.includes('"status": "blocked_waiting_values"')) {
  problems.push("validate:beta-platform-two-values absent-value run did not report blocked_waiting_values");
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
      guardedStatus: "beta_two_value_operator_handoff_ready_waiting_values",
      outcome: "handoff_ready_waiting_for_project_name_and_public_beta_url",
      nextRoute: "validate_two_values_then_run_packet_window_proof_map"
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

function withoutBetaValues(env) {
  const next = { ...env };
  delete next.BETA_HOSTING_PROJECT_NAME;
  delete next.BETA_TEMPORARY_URL;
  return next;
}
