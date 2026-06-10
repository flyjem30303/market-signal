import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-future-write-gate-review-packet.mjs";
const docPath = "docs/TWII_FUTURE_WRITE_GATE_REVIEW_PACKET.md";
const packetPath = "data/source-gates/twii-future-write-gate-review-packet.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const packet = JSON.parse(read(packetPath));
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

const output = parseJson(run.stdout ?? "", "future write gate review stdout");
if (run.status !== 0) problems.push("future write gate review report must exit 0");
if (output.status !== "twii_future_write_gate_review_packet_ready_no_execution") {
  problems.push("future write gate review status must be ready no execution");
}
if (output.outcome !== "future_write_gate_review_ready_implementation_still_blocked") {
  problems.push("future write gate review outcome must keep implementation blocked");
}
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
if (output.futureExplicitExecutionPacketRequired !== true) problems.push("futureExplicitExecutionPacketRequired must be true");
if (output.acceptedPrerequisiteSlots !== 6) problems.push("acceptedPrerequisiteSlots must be 6");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.requiredFutureExecutionControls?.credentialHandlingRequirement?.credentialValueOutputAllowed !== false) {
  problems.push("credential value output must be false");
}
if (output.requiredFutureExecutionControls?.executeSwitchRequirement?.executeDefault !== false) {
  problems.push("execute default must be false");
}
if (output.requiredFutureExecutionControls?.confirmationPhraseRequirement?.requiredForFutureExecution !== true) {
  problems.push("confirmation phrase must be required");
}

assertSafety(output);
assertPacket(packet);

if (pkg.scripts?.["report:twii-future-write-gate-review-packet"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-future-write-gate-review-packet`);
}
if (pkg.scripts?.["check:twii-future-write-gate-review-packet"] !== "node scripts/check-twii-future-write-gate-review-packet.mjs") {
  problems.push(`${packagePath} missing check:twii-future-write-gate-review-packet`);
}

for (const phrase of [
  "TWII Future Write Gate Review Packet",
  "twii_future_write_gate_review_packet_ready_no_execution",
  "future_write_gate_review_ready_implementation_still_blocked",
  "data/source-gates/twii-future-write-gate-review-packet.json",
  "credential handling",
  "execute switch",
  "confirmation phrase",
  "implementationAllowedNow=false",
  "writeGateExecutableNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII future write gate review packet slice",
  "docs/TWII_FUTURE_WRITE_GATE_REVIEW_PACKET.md",
  "data/source-gates/twii-future-write-gate-review-packet.json",
  "twii_future_write_gate_review_packet_ready_no_execution",
  "future_write_gate_review_ready_implementation_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_FUTURE_WRITE_GATE_REVIEW_PACKET.md` is `accepted` as TWII future write gate review packet",
  "twii_future_write_gate_review_packet_ready_no_execution",
  "future_write_gate_review_ready_implementation_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-future-write-gate-review-packet.mjs",
  "name: \"twii-future-write-gate-review-packet\"",
  "\"twii-future-write-gate-review-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [packetPath, JSON.stringify(packet)],
  ["future write gate review stdout", run.stdout ?? ""]
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
      guardedStatus: output.status,
      acceptedOutcome: output.outcome,
      implementationAllowedNow: output.implementationAllowedNow,
      writeGateExecutableNow: output.writeGateExecutableNow
    },
    null,
    2
  )
);

function assertPacket(packet) {
  if (packet.packetKind !== "twii_future_write_gate_review_packet") problems.push("packetKind mismatch");
  if (packet.candidateGatePacketPath !== "data/source-gates/twii-write-implementation-candidate-gate-packet.json") {
    problems.push("candidateGatePacketPath mismatch");
  }
  if (packet.requiredAcceptedPrerequisiteSlots !== 6) problems.push("requiredAcceptedPrerequisiteSlots must be 6");
  if (packet.targetTable !== "daily_prices") problems.push("packet targetTable must be daily_prices");
  if (packet.targetLane !== "TWII") problems.push("packet targetLane must be TWII");
  if (packet.targetScope !== "twii_index_daily_prices_missing_rows") problems.push("packet targetScope mismatch");
  if (packet.maxRows !== 60) problems.push("packet maxRows must be 60");
  if (packet.implementationAllowedNow !== false) problems.push("packet implementationAllowedNow must be false");
  if (packet.writeGateExecutableNow !== false) problems.push("packet writeGateExecutableNow must be false");
}

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("future write gate review must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`future write gate review safety.${key} must be false`);
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
