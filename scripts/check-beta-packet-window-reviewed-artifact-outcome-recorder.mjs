import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_OUTCOME_RECORDER.md";
const recorderPath = "scripts/record-beta-packet-window-reviewed-artifact-outcome.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewsDir = "docs/reviews";

const doc = read(docPath);
const recorder = read(recorderPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const board = read(boardPath);

for (const phrase of [
  "Status: `beta_packet_window_reviewed_artifact_outcome_recorder_ready_waiting_values`",
  "CEO decision: `make_reviewed_artifact_outcome_recordable_after_proof_map`",
  "beta_packet_window_reviewed_artifact_outcome_recorder",
  "outcome_recorder_ready_external_values_still_pending",
  "record:beta-packet-window-reviewed-artifact-outcome",
  "`accepted`",
  "`rejected`",
  "`blocked_waiting_values`",
  "`ready_pending_apply`",
  "`recorded`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "`deploymentAuthorized=false`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "allowedOutcomes",
  "\"accepted\"",
  "\"rejected\"",
  "--apply",
  "--dry-run",
  "run:beta-packet-window-proof-map",
  "render:beta-packet-window-reviewed-artifact-record-template",
  "BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_",
  "publicDataSource",
  "scoreSource",
  "deploymentAuthorized",
  "No artifact file was written.",
  "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
]) {
  if (!recorder.includes(phrase)) problems.push(`${recorderPath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [statusPath, status, "Latest beta packet window reviewed artifact outcome recorder slice"],
  [statusPath, status, "beta_packet_window_reviewed_artifact_outcome_recorder_ready_waiting_values"],
  [
    boardPath,
    board,
    "`docs/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_OUTCOME_RECORDER.md` is `accepted` as PM mainline reviewed artifact outcome recorder"
  ],
  [boardPath, board, "outcome_recorder_ready_external_values_still_pending"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["record:beta-packet-window-reviewed-artifact-outcome"] !==
  "node scripts/record-beta-packet-window-reviewed-artifact-outcome.mjs"
) {
  problems.push(`${packagePath} missing record:beta-packet-window-reviewed-artifact-outcome script`);
}
if (
  pkg.scripts?.["check:beta-packet-window-reviewed-artifact-outcome-recorder"] !==
  "node scripts/check-beta-packet-window-reviewed-artifact-outcome-recorder.mjs"
) {
  problems.push(`${packagePath} missing check:beta-packet-window-reviewed-artifact-outcome-recorder script`);
}

for (const phrase of [
  "scripts/check-beta-packet-window-reviewed-artifact-outcome-recorder.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-packet-window-reviewed-artifact-outcome-recorder\"",
  "\"beta-packet-window-reviewed-artifact-outcome-recorder\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

const before = listReviews();
const dryRun = spawnSync(
  "cmd.exe",
  [
    "/c",
    "npm",
    "run",
    "record:beta-packet-window-reviewed-artifact-outcome",
    "--",
    "--dry-run",
    "--outcome",
    "accepted",
    "--reviewedBy",
    "PM",
    "--note",
    "PM dry-run verifies the reviewed artifact outcome recorder without writing a review artifact."
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: withoutBetaValues(process.env),
    windowsHide: true
  }
);
const after = listReviews();

if (dryRun.status !== 0) problems.push(`${recorderPath} absent-value dry-run should exit 0`);
if (JSON.stringify(before) !== JSON.stringify(after)) {
  problems.push(`${recorderPath} dry-run absent values mutated ${reviewsDir}`);
}
if (!dryRun.stdout.includes('"status": "blocked_waiting_values"')) {
  problems.push(`${recorderPath} absent-value dry-run did not report blocked_waiting_values`);
}
if (!dryRun.stdout.includes('"artifactPath": null')) {
  problems.push(`${recorderPath} absent-value dry-run should not report artifact path`);
}

const safeDryRunBefore = listReviews();
const safeDryRun = spawnSync(
  "cmd.exe",
  [
    "/c",
    "npm",
    "run",
    "record:beta-packet-window-reviewed-artifact-outcome",
    "--",
    "--dry-run",
    "--outcome",
    "accepted",
    "--reviewedBy",
    "PM",
    "--note",
    "PM dry-run verifies safe platform values can reach pending apply without writing a review artifact."
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: withSafeBetaValues(process.env),
    windowsHide: true
  }
);
const safeDryRunAfter = listReviews();

if (safeDryRun.status !== 0) problems.push(`${recorderPath} safe-value dry-run should exit 0`);
if (JSON.stringify(safeDryRunBefore) !== JSON.stringify(safeDryRunAfter)) {
  problems.push(`${recorderPath} safe-value dry-run mutated ${reviewsDir}`);
}
for (const phrase of [
  '"status": "ready_pending_apply"',
  '"artifactWriteAllowed": true',
  '"deploymentAuthorized": false',
  '"publicDataSource": "mock"',
  '"scoreSource": "mock"',
  '"outcome": "accepted"',
  '"reviewedBy": "PM"'
]) {
  if (!safeDryRun.stdout.includes(phrase)) {
    problems.push(`${recorderPath} safe-value dry-run missing phrase: ${phrase}`);
  }
}
if (!safeDryRun.stdout.includes('"artifactPath": "docs/reviews/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_')) {
  problems.push(`${recorderPath} safe-value dry-run should report a docs/reviews artifact path`);
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
  [recorderPath, recorder],
  ["dry-run-output", dryRun.stdout],
  ["safe-dry-run-output", safeDryRun.stdout]
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
      guardedStatus: "beta_packet_window_reviewed_artifact_outcome_recorder_ready_waiting_values",
      outcome: "outcome_recorder_ready_external_values_still_pending"
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

function listReviews() {
  if (!fs.existsSync(reviewsDir)) return [];
  return fs.readdirSync(reviewsDir).sort();
}

function withoutBetaValues(env) {
  const next = { ...env };
  delete next.BETA_HOSTING_PROJECT_NAME;
  delete next.BETA_TEMPORARY_URL;
  return next;
}

function withSafeBetaValues(env) {
  return {
    ...withoutBetaValues(env),
    BETA_HOSTING_PROJECT_NAME: "codex-safe-beta",
    BETA_TEMPORARY_URL: "https://codex-safe-beta.vercel.app/"
  };
}
