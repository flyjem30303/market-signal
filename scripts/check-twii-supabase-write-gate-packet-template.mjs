import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-supabase-write-gate-packet-template.mjs";
const docPath = "docs/TWII_SUPABASE_WRITE_GATE_PACKET_TEMPLATE.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const safePacketPath = path.join("tmp", "twii-write-gate-packet-template.safe.json");
const unsafePacketPath = path.join("tmp", "twii-write-gate-packet-template.unsafe.json");

const doc = read(docPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

fs.mkdirSync("tmp", { recursive: true });
const safePacket = createSafePacket();
fs.writeFileSync(safePacketPath, `${JSON.stringify(safePacket, null, 2)}\n`);
fs.writeFileSync(
  unsafePacketPath,
  `${JSON.stringify({ ...safePacket, promotionAllowed: true, safety: { ...safePacket.safety, scoreSource: "real" } }, null, 2)}\n`
);

const templateRun = runReport([]);
const templateOutput = parseJson(templateRun.stdout ?? "", "blank template stdout");
if (templateRun.status !== 0) problems.push("blank template report must exit 0");
assertAccepted(templateOutput, "blank template");

const safeRun = runReport(["--packet-path", safePacketPath]);
const safeOutput = parseJson(safeRun.stdout ?? "", "safe packet stdout");
if (safeRun.status !== 0) problems.push("safe packet report must exit 0");
assertAccepted(safeOutput, "safe packet");

const unsafeRun = runReport(["--packet-path", unsafePacketPath]);
const unsafeOutput = parseJson(unsafeRun.stdout ?? "", "unsafe packet stdout");
if (unsafeRun.status === 0) problems.push("unsafe packet must fail closed");
if (unsafeOutput.status !== "blocked") problems.push("unsafe packet must be blocked");

if (pkg.scripts?.["report:twii-supabase-write-gate-packet-template"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-supabase-write-gate-packet-template`);
}
if (
  pkg.scripts?.["check:twii-supabase-write-gate-packet-template"] !==
  "node scripts/check-twii-supabase-write-gate-packet-template.mjs"
) {
  problems.push(`${packagePath} missing check:twii-supabase-write-gate-packet-template`);
}

for (const phrase of [
  "TWII Supabase Write Gate Packet Template",
  "twii_supabase_write_gate_packet_template_ready_local_only",
  "\"packetKind\": \"twii_supabase_write_gate_packet\"",
  "\"targetTable\": \"daily_prices\"",
  "\"writeMode\": \"bounded_insert_missing_only\"",
  "\"duplicatePolicy\": \"reject_duplicates\"",
  "Accepted validation means only",
  "It does not make the write gate executable",
  "Stop before any write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII Supabase write gate packet template slice",
  "docs/TWII_SUPABASE_WRITE_GATE_PACKET_TEMPLATE.md",
  "twii_supabase_write_gate_packet_template_ready_local_only",
  "write_gate_packet_shape_accepted_for_future_authorization_review_only"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_SUPABASE_WRITE_GATE_PACKET_TEMPLATE.md` is `accepted` as TWII Supabase write gate packet template",
  "twii_supabase_write_gate_packet_template_ready_local_only",
  "write_gate_packet_shape_accepted_for_future_authorization_review_only"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-supabase-write-gate-packet-template.mjs",
  "name: \"twii-supabase-write-gate-packet-template\"",
  "\"twii-supabase-write-gate-packet-template\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["safe packet stdout", safeRun.stdout ?? ""]
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
      guardedStatus: safeOutput.status,
      acceptedOutcome: safeOutput.outcome,
      unsafeStatus: unsafeOutput.status
    },
    null,
    2
  )
);

function createSafePacket() {
  return {
    packetKind: "twii_supabase_write_gate_packet",
    authorizationId: "twii-write-gate-check",
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

function runReport(extraArgs) {
  return spawnSync(process.execPath, [reportPath, ...extraArgs], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
}

function assertAccepted(output, label) {
  if (output.status !== "twii_supabase_write_gate_packet_template_ready_local_only") {
    problems.push(`${label} status must be template ready`);
  }
  if (output.outcome !== "write_gate_packet_shape_accepted_for_future_authorization_review_only") {
    problems.push(`${label} outcome must be future authorization review only`);
  }
  if (output.currentBoundary?.writeGateExecutableNow !== false) problems.push(`${label} write gate must not be executable now`);
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
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
    /\bfetch\s*\(/u,
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

