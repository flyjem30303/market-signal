import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-future-one-time-authorization-packet.mjs";
const docPath = "docs/TWII_FUTURE_ONE_TIME_AUTHORIZATION_PACKET.md";
const packetPath = "data/source-gates/twii-future-one-time-authorization-packet.json";
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

const output = parseJson(run.stdout ?? "", "future one-time authorization packet stdout");
if (run.status !== 0) problems.push("future one-time authorization packet report must exit 0");
if (output.status !== "twii_future_one_time_authorization_packet_ready_no_execution") {
  problems.push("authorization packet status must be ready no execution");
}
if (output.outcome !== "authorization_packet_ready_execution_still_blocked") {
  problems.push("authorization packet outcome must keep execution blocked");
}
if (output.authorizationReadyForPmReview !== true) problems.push("authorizationReadyForPmReview must be true");
if (output.recommendedNextAction !== "pm_review_future_one_time_authorization_packet_before_any_execution_attempt") {
  problems.push("recommendedNextAction mismatch");
}
if (output.executionAllowedNow !== false) problems.push("executionAllowedNow must be false");
if (output.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
if (output.implementationAllowedNow !== false) problems.push("implementationAllowedNow must be false");
if (output.upstream?.proofBundleStatus !== "ready_for_pm_review_no_execution") problems.push("proofBundleStatus mismatch");
if (output.target?.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
if (output.target?.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (output.controls?.executeSwitchRequired !== true) problems.push("executeSwitchRequired must be true");
if (output.controls?.executeDefault !== false) problems.push("executeDefault must be false");
if (output.controls?.confirmationPhraseRequired !== true) problems.push("confirmationPhraseRequired must be true");
if (output.controls?.serverOnlyCredentialHandling !== true) problems.push("serverOnlyCredentialHandling must be true");
if (output.controls?.credentialValueOutputAllowed !== false) problems.push("credentialValueOutputAllowed must be false");

assertPacket(packet);
assertSafety(output);

if (pkg.scripts?.["report:twii-future-one-time-authorization-packet"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:twii-future-one-time-authorization-packet`);
}
if (pkg.scripts?.["check:twii-future-one-time-authorization-packet"] !== "node scripts/check-twii-future-one-time-authorization-packet.mjs") {
  problems.push(`${packagePath} missing check:twii-future-one-time-authorization-packet`);
}

for (const phrase of [
  "TWII Future One-Time Authorization Packet",
  "twii_future_one_time_authorization_packet_ready_no_execution",
  "authorization_packet_ready_execution_still_blocked",
  "data/source-gates/twii-future-one-time-authorization-packet.json",
  "authorizationReadyForPmReview=true",
  "executeSwitchRequired=true",
  "executeDefault=false",
  "confirmationPhraseRequired=true",
  "serverOnlyCredentialHandling=true",
  "credentialValueOutputAllowed=false",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "does not authorize SQL"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII future one-time authorization packet slice",
  "docs/TWII_FUTURE_ONE_TIME_AUTHORIZATION_PACKET.md",
  "data/source-gates/twii-future-one-time-authorization-packet.json",
  "twii_future_one_time_authorization_packet_ready_no_execution",
  "authorization_packet_ready_execution_still_blocked"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_FUTURE_ONE_TIME_AUTHORIZATION_PACKET.md` is `accepted` as TWII future one-time authorization packet",
  "twii_future_one_time_authorization_packet_ready_no_execution",
  "authorization_packet_ready_execution_still_blocked",
  "pm_review_future_one_time_authorization_packet_before_any_execution_attempt"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-future-one-time-authorization-packet.mjs",
  "name: \"twii-future-one-time-authorization-packet\"",
  "\"twii-future-one-time-authorization-packet\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [packetPath, JSON.stringify(packet)],
  ["future one-time authorization packet stdout", run.stdout ?? ""]
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
      authorizationReadyForPmReview: output.authorizationReadyForPmReview,
      recommendedNextAction: output.recommendedNextAction
    },
    null,
    2
  )
);

function assertPacket(packet) {
  if (packet.authorizationPacketKind !== "twii_future_one_time_authorization_packet") {
    problems.push("authorizationPacketKind mismatch");
  }
  if (packet.requiredProofBundleStatus !== "ready_for_pm_review_no_execution") {
    problems.push("requiredProofBundleStatus mismatch");
  }
  if (packet.authorizationReadyForPmReview !== true) problems.push("packet authorizationReadyForPmReview must be true");
  if (packet.executeSwitchRequired !== true) problems.push("packet executeSwitchRequired must be true");
  if (packet.executeDefault !== false) problems.push("packet executeDefault must be false");
  if (packet.confirmationPhraseRequired !== true) problems.push("packet confirmationPhraseRequired must be true");
  if (packet.serverOnlyCredentialHandling !== true) problems.push("packet serverOnlyCredentialHandling must be true");
  if (packet.credentialValueOutputAllowed !== false) problems.push("packet credentialValueOutputAllowed must be false");
  if (packet.executionAllowedNow !== false) problems.push("packet executionAllowedNow must be false");
  if (packet.writeGateExecutableNow !== false) problems.push("packet writeGateExecutableNow must be false");
  if (packet.implementationAllowedNow !== false) problems.push("packet implementationAllowedNow must be false");
}

function assertSafety(output) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push("authorization packet must stay mock/mock");
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
    if (output.safety?.[key] !== false) problems.push(`authorization packet safety.${key} must be false`);
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
