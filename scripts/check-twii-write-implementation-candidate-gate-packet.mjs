import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-write-implementation-candidate-gate-packet.mjs";
const docPath = "docs/TWII_WRITE_IMPLEMENTATION_CANDIDATE_GATE_PACKET.md";
const packetPath = "data/source-gates/twii-write-implementation-candidate-gate-packet.json";
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

const output = parseJson(run.stdout ?? "", "candidate gate packet stdout");
if (run.status !== 0) problems.push("candidate gate packet report must exit 0");
if (output.status !== "twii_write_implementation_candidate_gate_packet_ready_future_gate_only") {
  problems.push("candidate gate packet status must be ready future gate only");
}
if (output.outcome !== "future_write_gate_candidate_packet_ready_no_execution") {
  problems.push("candidate gate packet outcome must be no execution");
}
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.futureWriteGatePacketRequired !== true) problems.push("futureWriteGatePacketRequired must be true");
if (output.acceptedPrerequisiteSlots !== 6) problems.push("acceptedPrerequisiteSlots must be 6");
if (output.requiredPrerequisiteSlots !== 6) problems.push("requiredPrerequisiteSlots must be 6");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.target?.maxRows !== 60) problems.push("maxRows must be 60");
if (output.target?.writeMode !== "bounded_insert_missing_only") problems.push("writeMode must be bounded_insert_missing_only");
if (output.target?.duplicatePolicy !== "reject_duplicates") problems.push("duplicatePolicy must be reject_duplicates");

assertSafety(output);
assertPacketShape(packet);

if (pkg.scripts?.["report:twii-write-implementation-candidate-gate-packet"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-write-implementation-candidate-gate-packet`);
}
if (
  pkg.scripts?.["check:twii-write-implementation-candidate-gate-packet"] !==
  "node scripts/check-twii-write-implementation-candidate-gate-packet.mjs"
) {
  problems.push(`${packagePath} missing check:twii-write-implementation-candidate-gate-packet`);
}

for (const phrase of [
  "TWII Write Implementation Candidate Gate Packet",
  "twii_write_implementation_candidate_gate_packet_ready_future_gate_only",
  "future_write_gate_candidate_packet_ready_no_execution",
  "data/source-gates/twii-write-implementation-candidate-gate-packet.json",
  "\"targetTable\": \"daily_prices\"",
  "\"targetLane\": \"TWII\"",
  "\"targetScope\": \"twii_index_daily_prices_missing_rows\"",
  "\"maxRows\": 60",
  "\"writeMode\": \"bounded_insert_missing_only\"",
  "\"duplicatePolicy\": \"reject_duplicates\"",
  "\"promotionAllowed\": false",
  "\"rowCoverageScoringAllowed\": false",
  "\"scoreSourceRealAllowed\": false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII write implementation candidate gate packet slice",
  "docs/TWII_WRITE_IMPLEMENTATION_CANDIDATE_GATE_PACKET.md",
  "data/source-gates/twii-write-implementation-candidate-gate-packet.json",
  "twii_write_implementation_candidate_gate_packet_ready_future_gate_only",
  "future_write_gate_candidate_packet_ready_no_execution"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_WRITE_IMPLEMENTATION_CANDIDATE_GATE_PACKET.md` is `accepted` as TWII write implementation candidate gate packet",
  "twii_write_implementation_candidate_gate_packet_ready_future_gate_only",
  "future_write_gate_candidate_packet_ready_no_execution"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-write-implementation-candidate-gate-packet.mjs",
  "name: \"twii-write-implementation-candidate-gate-packet\"",
  "\"twii-write-implementation-candidate-gate-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [packetPath, JSON.stringify(packet)],
  ["candidate gate packet stdout", run.stdout ?? ""]
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
      acceptedPrerequisiteSlots: output.acceptedPrerequisiteSlots,
      implementationAllowedNow: output.implementationAllowedNow
    },
    null,
    2
  )
);

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("candidate gate packet must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`candidate gate safety.${key} must be false`);
  }
}

function assertPacketShape(packet) {
  if (packet.packetKind !== "twii_write_implementation_candidate_gate_packet") {
    problems.push("packetKind must be twii_write_implementation_candidate_gate_packet");
  }
  if (packet.authorizationId !== "twii-write-implementation-candidate-20260610-a") {
    problems.push("authorizationId must be twii-write-implementation-candidate-20260610-a");
  }
  if (packet.candidateArtifactPath !== "data/candidates/twii-sanitized-candidate.json") {
    problems.push("candidateArtifactPath must point to reviewed TWII candidate artifact");
  }
  if (packet.targetTable !== "daily_prices") problems.push("packet targetTable must be daily_prices");
  if (packet.targetLane !== "TWII") problems.push("packet targetLane must be TWII");
  if (packet.targetScope !== "twii_index_daily_prices_missing_rows") {
    problems.push("packet targetScope must be twii_index_daily_prices_missing_rows");
  }
  if (packet.maxRows !== 60) problems.push("packet maxRows must be 60");
  if (packet.writeMode !== "bounded_insert_missing_only") problems.push("packet writeMode must be bounded_insert_missing_only");
  if (packet.duplicatePolicy !== "reject_duplicates") problems.push("packet duplicatePolicy must be reject_duplicates");
  if (packet.implementationAllowedNow !== false) problems.push("packet implementationAllowedNow must be false");
  if (packet.futureWriteGatePacketRequired !== true) problems.push("packet futureWriteGatePacketRequired must be true");
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
