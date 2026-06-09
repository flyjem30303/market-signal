import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];
const runnerPath = "scripts/run-twii-non-executing-write-runner-skeleton.mjs";
const reportPath = "scripts/report-twii-non-executing-write-runner-skeleton.mjs";
const docPath = "docs/TWII_NON_EXECUTING_WRITE_RUNNER_SKELETON.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const safePacketPath = path.join("tmp", "twii-non-executing-runner-safe-packet.json");
const confirmation = "CEO_PM_ACK_TWII_NON_EXECUTING_WRITE_RUNNER_SKELETON_ONLY";

const doc = read(docPath);
const runnerSource = read(runnerPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

fs.mkdirSync("tmp", { recursive: true });
fs.writeFileSync(safePacketPath, `${JSON.stringify(createSafePacket(), null, 2)}\n`);

const missingPacket = runNode([runnerPath]);
const missingPacketOutput = parseJson(missingPacket.stdout ?? "", "missing packet stdout");
if (missingPacket.status === 0) problems.push("missing packet run must fail closed");
if (!missingPacketOutput.problems?.includes("blocked_missing_packet_path")) {
  problems.push("missing packet run must include blocked_missing_packet_path");
}

const missingExecute = runNode([runnerPath, "--packet-path", safePacketPath]);
const missingExecuteOutput = parseJson(missingExecute.stdout ?? "", "missing execute stdout");
if (missingExecute.status === 0) problems.push("missing execute run must fail closed");
if (!missingExecuteOutput.problems?.includes("blocked_missing_execute_switch")) {
  problems.push("missing execute run must include blocked_missing_execute_switch");
}

const fullStopLine = runNode([
  runnerPath,
  "--packet-path",
  safePacketPath,
  "--execute",
  "true",
  "--confirmation",
  confirmation
]);
const fullStopLineOutput = parseJson(fullStopLine.stdout ?? "", "full stop-line stdout");
if (fullStopLine.status !== 0) problems.push("full skeleton stop line must exit 0");
if (fullStopLineOutput.status !== "blocked_non_executing_skeleton_only") {
  problems.push("full skeleton stop line must still be blocked_non_executing_skeleton_only");
}
assertSafety(fullStopLineOutput, "full skeleton output");

const reportRun = runNode([
  reportPath,
  "--packet-path",
  safePacketPath,
  "--execute",
  "true",
  "--confirmation",
  confirmation
]);
const reportOutput = parseJson(reportRun.stdout ?? "", "report stdout");
if (reportRun.status !== 0) problems.push("skeleton report must exit 0");
if (reportOutput.status !== "twii_non_executing_write_runner_skeleton_ready_fail_closed") {
  problems.push("skeleton report status must be ready fail closed");
}
if (reportOutput.outcome !== "runner_skeleton_fail_closed_before_real_write") {
  problems.push("skeleton report outcome must be fail closed before real write");
}
assertSafety(reportOutput, "skeleton report");

if (pkg.scripts?.["run:twii-non-executing-write-runner-skeleton"] !== `node ${runnerPath}`) {
  problems.push(`${packagePath} missing run:twii-non-executing-write-runner-skeleton`);
}
if (pkg.scripts?.["report:twii-non-executing-write-runner-skeleton"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-non-executing-write-runner-skeleton`);
}
if (
  pkg.scripts?.["check:twii-non-executing-write-runner-skeleton"] !==
  "node scripts/check-twii-non-executing-write-runner-skeleton.mjs"
) {
  problems.push(`${packagePath} missing check:twii-non-executing-write-runner-skeleton`);
}

for (const phrase of [
  "TWII Non-Executing Write Runner Skeleton",
  "twii_non_executing_write_runner_skeleton_ready_fail_closed",
  "blocked_missing_packet_path",
  "blocked_missing_execute_switch",
  "blocked_missing_confirmation_phrase",
  "blocked_non_executing_skeleton_only",
  "No SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII non-executing write runner skeleton slice",
  "docs/TWII_NON_EXECUTING_WRITE_RUNNER_SKELETON.md",
  "twii_non_executing_write_runner_skeleton_ready_fail_closed",
  "runner_skeleton_fail_closed_before_real_write"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_NON_EXECUTING_WRITE_RUNNER_SKELETON.md` is `accepted` as TWII non-executing write runner skeleton",
  "twii_non_executing_write_runner_skeleton_ready_fail_closed",
  "runner_skeleton_fail_closed_before_real_write"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-non-executing-write-runner-skeleton.mjs",
  "name: \"twii-non-executing-write-runner-skeleton\"",
  "\"twii-non-executing-write-runner-skeleton\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [runnerPath, runnerSource],
  [reportPath, reportSource],
  [docPath, doc],
  ["report stdout", reportRun.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
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
      guardedStatus: reportOutput.status,
      acceptedOutcome: reportOutput.outcome
    },
    null,
    2
  )
);

function createSafePacket() {
  return {
    packetKind: "twii_supabase_write_gate_packet",
    authorizationId: "twii-non-executing-runner-check",
    chairmanDecision: "accepted",
    ceoDecision: "accepted",
    pmOwner: "PM",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    sourceRightsDecisionReference: "accepted-source-rights-reference",
    fieldContractReference: "accepted-field-contract-reference",
    assetMappingReference: "accepted-asset-mapping-reference",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    writeMode: "bounded_insert_missing_only",
    duplicatePolicy: "reject_duplicates",
    rollbackPlan: {
      required: true,
      scope: "authorizationId",
      noWriteStopLine: true
    },
    postWriteReadbackPlan: {
      aggregateOnly: true,
      requiredFields: [
        "attempted_row_count",
        "inserted_row_count",
        "rejected_row_count",
        "duplicate_row_count",
        "target_scope",
        "target_table",
        "post_write_max_trade_date"
      ]
    },
    postWriteReviewCommand: "cmd.exe /c npm run report:twii-post-write-review -- --summary-path <SUMMARY_JSON>",
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    scoreSourceRealAllowed: false,
    safety: {
      publicDataSource: "mock",
      scoreSource: "mock",
      rawPayloadOutputAllowed: false,
      rowPayloadOutputAllowed: false,
      stockIdPayloadOutputAllowed: false,
      secretOutputAllowed: false
    }
  };
}

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
}

function assertSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "rawPayloadOutput",
    "rowPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u,
    /SQL execution is approved/iu,
    /Supabase writes are approved/iu,
    /row coverage scoring is approved/iu
  ];
}

