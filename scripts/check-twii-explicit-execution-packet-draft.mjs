import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-explicit-execution-packet-draft.mjs";
const docPath = "docs/TWII_EXPLICIT_EXECUTION_PACKET_DRAFT.md";
const packetPath = "data/source-gates/twii-explicit-execution-packet-draft.json";
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

const output = parseJson(run.stdout ?? "", "explicit execution packet draft stdout");
if (run.status !== 0) problems.push("explicit execution packet draft report must exit 0");
if (output.status !== "twii_explicit_execution_packet_draft_ready_no_execution") {
  problems.push("explicit execution packet draft status must be ready no execution");
}
if (output.outcome !== "explicit_execution_packet_draft_ready_execution_still_blocked") {
  problems.push("explicit execution packet draft outcome must keep execution blocked");
}
if (output.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
if (output.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.acceptedPrerequisiteSlots !== 6) problems.push("acceptedPrerequisiteSlots must be 6");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.target?.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (output.executionControls?.execute !== false) problems.push("execute must be false");
if (output.executionControls?.confirmationPhraseRequired !== true) problems.push("confirmation phrase must be required");
if (output.executionControls?.credentialHandling?.credentialValueOutputAllowed !== false) {
  problems.push("credential value output must be false");
}

assertSafety(output);
assertPacket(packet);

if (pkg.scripts?.["report:twii-explicit-execution-packet-draft"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-explicit-execution-packet-draft`);
}
if (pkg.scripts?.["check:twii-explicit-execution-packet-draft"] !== "node scripts/check-twii-explicit-execution-packet-draft.mjs") {
  problems.push(`${packagePath} missing check:twii-explicit-execution-packet-draft`);
}

for (const phrase of [
  "TWII Explicit Execution Packet Draft",
  "twii_explicit_execution_packet_draft_ready_no_execution",
  "explicit_execution_packet_draft_ready_execution_still_blocked",
  "data/source-gates/twii-explicit-execution-packet-draft.json",
  "execute=false",
  "confirmationPhraseRequired=true",
  "credential handling",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII explicit execution packet draft slice",
  "docs/TWII_EXPLICIT_EXECUTION_PACKET_DRAFT.md",
  "data/source-gates/twii-explicit-execution-packet-draft.json",
  "twii_explicit_execution_packet_draft_ready_no_execution",
  "explicit_execution_packet_draft_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_EXPLICIT_EXECUTION_PACKET_DRAFT.md` is `accepted` as TWII explicit execution packet draft",
  "twii_explicit_execution_packet_draft_ready_no_execution",
  "explicit_execution_packet_draft_ready_execution_still_blocked"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-explicit-execution-packet-draft.mjs",
  "name: \"twii-explicit-execution-packet-draft\"",
  "\"twii-explicit-execution-packet-draft\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [packetPath, JSON.stringify(packet)],
  ["explicit execution packet draft stdout", run.stdout ?? ""]
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
      executionAllowedNow: output.executionAllowedNow,
      writeGateExecutableNow: output.writeGateExecutableNow,
      implementationAllowedNow: output.implementationAllowedNow
    },
    null,
    2
  )
);

function assertPacket(packet) {
  if (packet.executionPacketKind !== "twii_explicit_execution_packet_draft") problems.push("executionPacketKind mismatch");
  if (packet.candidateGatePacketPath !== "data/source-gates/twii-write-implementation-candidate-gate-packet.json") {
    problems.push("candidateGatePacketPath mismatch");
  }
  if (packet.futureWriteGateReviewPacketPath !== "data/source-gates/twii-future-write-gate-review-packet.json") {
    problems.push("futureWriteGateReviewPacketPath mismatch");
  }
  if (packet.targetTable !== "daily_prices") problems.push("packet targetTable must be daily_prices");
  if (packet.targetLane !== "TWII") problems.push("packet targetLane must be TWII");
  if (packet.targetScope !== "twii_index_daily_prices_missing_rows") problems.push("packet targetScope mismatch");
  if (packet.maxRows !== 60) problems.push("packet maxRows must be 60");
  if (packet.writeMode !== "bounded_insert_missing_only") problems.push("packet writeMode mismatch");
  if (packet.duplicatePolicy !== "reject_duplicates") problems.push("packet duplicatePolicy mismatch");
  if (packet.execute !== false) problems.push("packet execute must be false");
  if (packet.confirmationPhraseRequired !== true) problems.push("packet confirmationPhraseRequired must be true");
  if (packet.credentialHandling?.serviceRoleServerOnly !== true) problems.push("credential serviceRoleServerOnly must be true");
  if (packet.credentialHandling?.presenceCheckBooleanOnly !== true) problems.push("credential presenceCheckBooleanOnly must be true");
  if (packet.credentialHandling?.credentialValueOutputAllowed !== false) problems.push("credential output must be false");
  if (packet.executionAllowedNow !== false) problems.push("packet executionAllowedNow must be false");
  if (packet.writeGateExecutableNow !== false) problems.push("packet writeGateExecutableNow must be false");
  if (packet.implementationAllowedNow !== false) problems.push("packet implementationAllowedNow must be false");
}

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("explicit execution packet draft must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`explicit execution packet draft safety.${key} must be false`);
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
