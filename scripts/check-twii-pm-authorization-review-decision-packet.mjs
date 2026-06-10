import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-pm-authorization-review-decision-packet.mjs";
const docPath = "docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_PACKET.md";
const packetPath = "data/source-gates/twii-pm-authorization-review-decision-packet.json";
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

const output = parseJson(run.stdout ?? "", "PM authorization review decision packet stdout");
if (run.status !== 0) problems.push("PM authorization review decision packet report must exit 0");
if (output.status !== "twii_pm_authorization_review_decision_packet_ready_no_execution") {
  problems.push("decision packet status must be ready no execution");
}
if (output.outcome !== "authorization_review_accepted_for_future_gate_preparation_execution_still_blocked") {
  problems.push("decision packet outcome mismatch");
}
if (output.reviewDecision !== "accepted_for_future_execution_gate_preparation_only") {
  problems.push("reviewDecision mismatch");
}
if (output.nextIfAccepted !== "prepare_one_attempt_runner_execution_gate_no_execution") {
  problems.push("nextIfAccepted mismatch");
}
if (output.nextIfRejected !== "repair_authorization_packet_or_proof_bundle") {
  problems.push("nextIfRejected mismatch");
}
if (output.authorizationReadyForPmReview !== true) problems.push("authorizationReadyForPmReview must be true");
if (output.reviewDecisionRecorded !== true) problems.push("reviewDecisionRecorded must be true");
if (output.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
if (output.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.upstream?.authorizationReportStatus !== "twii_future_one_time_authorization_packet_ready_no_execution") {
  problems.push("authorization report status mismatch");
}

assertPacket(packet);
assertSafety(output);

if (pkg.scripts?.["report:twii-pm-authorization-review-decision-packet"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-pm-authorization-review-decision-packet`);
}
if (pkg.scripts?.["check:twii-pm-authorization-review-decision-packet"] !== "node scripts/check-twii-pm-authorization-review-decision-packet.mjs") {
  problems.push(`${packagePath} missing check:twii-pm-authorization-review-decision-packet`);
}

for (const phrase of [
  "TWII PM Authorization Review Decision Packet",
  "twii_pm_authorization_review_decision_packet_ready_no_execution",
  "authorization_review_accepted_for_future_gate_preparation_execution_still_blocked",
  "data/source-gates/twii-pm-authorization-review-decision-packet.json",
  "reviewDecision=accepted_for_future_execution_gate_preparation_only",
  "decisionAlternatives",
  "nextIfAccepted=prepare_one_attempt_runner_execution_gate_no_execution",
  "nextIfRejected=repair_authorization_packet_or_proof_bundle",
  "reviewDecisionRecorded=true",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII PM authorization review decision packet slice",
  "docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_PACKET.md",
  "data/source-gates/twii-pm-authorization-review-decision-packet.json",
  "twii_pm_authorization_review_decision_packet_ready_no_execution",
  "authorization_review_accepted_for_future_gate_preparation_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_PACKET.md` is `accepted` as TWII PM authorization review decision packet",
  "twii_pm_authorization_review_decision_packet_ready_no_execution",
  "authorization_review_accepted_for_future_gate_preparation_execution_still_blocked",
  "prepare_one_attempt_runner_execution_gate_no_execution"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-pm-authorization-review-decision-packet.mjs",
  "name: \"twii-pm-authorization-review-decision-packet\"",
  "\"twii-pm-authorization-review-decision-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [packetPath, JSON.stringify(packet)],
  ["PM authorization review decision packet stdout", run.stdout ?? ""]
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
      reviewDecision: output.reviewDecision,
      nextIfAccepted: output.nextIfAccepted
    },
    null,
    2
  )
);

function assertPacket(packet) {
  if (packet.decisionPacketKind !== "twii_pm_authorization_review_decision_packet") {
    problems.push("decisionPacketKind mismatch");
  }
  if (packet.reviewDecision !== "accepted_for_future_execution_gate_preparation_only") {
    problems.push("packet reviewDecision mismatch");
  }
  if (!packet.decisionAlternatives?.includes("accepted_for_future_execution_gate_preparation_only")) {
    problems.push("packet missing accepted alternative");
  }
  if (!packet.decisionAlternatives?.includes("rejected_needs_repair")) {
    problems.push("packet missing rejected alternative");
  }
  if (packet.reviewDecisionRecorded !== true) problems.push("packet reviewDecisionRecorded must be true");
  if (packet.executionAllowedNow !== false) problems.push("packet executionAllowedNow must be false");
  if (packet.writeGateExecutableNow !== false) problems.push("packet writeGateExecutableNow must be false");
  if (packet.implementationAllowedNow !== false) problems.push("packet implementationAllowedNow must be false");
}

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("decision packet must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`decision packet safety.${key} must be false`);
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
