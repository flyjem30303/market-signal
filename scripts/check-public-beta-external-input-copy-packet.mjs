import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-public-beta-external-input-copy-packet.mjs";
const checkPath = "scripts/check-public-beta-external-input-copy-packet.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "public_beta_external_input_copy_packet_ready"],
  [reportPath, reportSource, "copyable_no_secret_external_input_packet"],
  [reportPath, reportSource, "report:public-beta-external-input-request"],
  [reportPath, reportSource, "PM one-screen reply packet"],
  [reportPath, reportSource, "Block 1 - Beta platform two values"],
  [reportPath, reportSource, "Block 2 - A1 TWII four-slot no-secret evidence"],
  [reportPath, reportSource, "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>"],
  [reportPath, reportSource, "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"],
  [reportPath, reportSource, "vendor-terms-evidence"],
  [reportPath, reportSource, "internal-feed-owner-evidence"],
  [reportPath, reportSource, "field-contract-evidence"],
  [reportPath, reportSource, "asset-mapping-evidence"],
  [reportPath, reportSource, "evidenceSlotId"],
  [reportPath, reportSource, "sourceReferenceLabel"],
  [reportPath, reportSource, "safeEvidenceSummary"],
  [reportPath, reportSource, "remainingRisk"],
  [reportPath, reportSource, "run:public-beta-post-reply-route-once"],
  [reportPath, reportSource, "report:public-beta-external-reply-file-route"],
  [reportPath, reportSource, "replyRouteContract"],
  [reportPath, reportSource, "firstCommandAfterReplyFile"],
  [reportPath, reportSource, "fallbackResponseReadinessCommand"],
  [reportPath, reportSource, "run:a1-twii-post-reply-pm-classification-once"],
  [reportPath, reportSource, "No platform values are read from env or printed by this report."],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "public_beta_external_input_copy_packet_ready"],
  [packagePath, JSON.stringify(pkg), "report:public-beta-external-input-copy-packet"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-input-copy-packet"],
  [reviewGatePath, reviewGate, "public-beta-external-input-copy-packet"],
  [statusPath, status, "Latest public Beta external input copy packet slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:public-beta-external-input-copy-packet"] !==
  "node scripts/report-public-beta-external-input-copy-packet.mjs"
) {
  problems.push(`${packagePath} missing report:public-beta-external-input-copy-packet`);
}

if (
  pkg.scripts?.["check:public-beta-external-input-copy-packet"] !==
  "node scripts/check-public-beta-external-input-copy-packet.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-external-input-copy-packet`);
}

for (const forbidden of [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "process.env.BETA_HOSTING_PROJECT_NAME",
  "process.env.BETA_TEMPORARY_URL",
  "publicDataSource: \"supabase\"",
  "scoreSource: \"real\"",
  ".insert(",
  ".update(",
  ".delete(",
  "fetch("
]) {
  if (reportSource.includes(forbidden)) problems.push(`${reportPath} forbidden phrase ${forbidden}`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:public-beta-external-input-copy-packet"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: { ...process.env, BETA_PLATFORM_VALUES_SKIP_DOTENV: "1" },
  timeout: 420000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("report:public-beta-external-input-copy-packet should exit 0");
if (!report) {
  problems.push("report:public-beta-external-input-copy-packet should emit JSON");
} else {
  if (report.status !== "public_beta_external_input_copy_packet_ready") {
    problems.push(`unexpected status ${String(report.status)}`);
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") {
    problems.push("runtimeBoundary.publicDataSource must be mock");
  }
  if (report.runtimeBoundary?.scoreSource !== "mock") {
    problems.push("runtimeBoundary.scoreSource must be mock");
  }
  if (!report.replyPacket?.platformBlock?.lines?.includes("BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>")) {
    problems.push("replyPacket.platformBlock missing BETA_HOSTING_PROJECT_NAME placeholder");
  }
  if (!report.replyPacket?.platformBlock?.lines?.includes("BETA_TEMPORARY_URL=https://<public-beta-hostname>/")) {
    problems.push("replyPacket.platformBlock missing BETA_TEMPORARY_URL placeholder");
  }
  if (!report.replyPacket?.platformBlock?.afterReply?.includes("cmd.exe /c npm run report:public-beta-external-reply-file-route")) {
    problems.push("replyPacket.platformBlock should route first to external reply file route");
  }
  if (!report.replyPacket?.platformBlock?.afterReply?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
    problems.push("replyPacket.platformBlock should route to public Beta post-reply one-runner");
  }
  for (const slot of [
    "vendor-terms-evidence",
    "internal-feed-owner-evidence",
    "field-contract-evidence",
    "asset-mapping-evidence"
  ]) {
    if (!report.replyPacket?.a1Block?.pendingSlotIds?.includes(slot)) {
      problems.push(`replyPacket.a1Block missing slot ${slot}`);
    }
  }
  for (const field of ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"]) {
    if (!report.replyPacket?.a1Block?.requiredPerSlot?.includes(field)) {
      problems.push(`replyPacket.a1Block missing required field ${field}`);
    }
  }
  if (!report.replyPacket?.a1Block?.afterReply?.includes("cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once")) {
    problems.push("replyPacket.a1Block should route to A1 post-reply one-runner");
  }
  if (!report.replyPacket?.a1Block?.afterReply?.includes("cmd.exe /c npm run report:public-beta-external-reply-file-route")) {
    problems.push("replyPacket.a1Block should route first to external reply file route");
  }
  if (!report.replyPacket?.completeWhen?.includes("response-readiness passes before the post-reply runner")) {
    problems.push("replyPacket.completeWhen should include response-readiness before runner");
  }
  for (const flag of [
    "deploymentAuthorized",
    "evidenceRecorded",
    "hostingMutated",
    "marketDataFetched",
    "rawPayloadPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "valuesStored"
  ]) {
    if (report.safety?.[flag] !== false) {
      problems.push(`safety.${flag} must remain false`);
    }
  }
  if (report.replyRouteContract?.firstCommandAfterReplyFile !== "cmd.exe /c npm run report:public-beta-external-reply-file-route") {
    problems.push("replyRouteContract.firstCommandAfterReplyFile should be external reply file route");
  }
  if (
    report.replyRouteContract?.fallbackResponseReadinessCommand !==
    "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
  ) {
    problems.push("replyRouteContract.fallbackResponseReadinessCommand should be response-readiness");
  }
  if (
    report.replyRouteContract?.proofRunnerAfterCompleteSafeReply !==
    "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof"
  ) {
    problems.push("replyRouteContract.proofRunnerAfterCompleteSafeReply should be the workflow proof");
  }
}

console.log(JSON.stringify({
  status: problems.length === 0 ? "ok" : "blocked",
  guardedStatus: "public_beta_external_input_copy_packet_ready",
  problems,
  publicDataSource: report?.runtimeBoundary?.publicDataSource ?? "mock",
  scoreSource: report?.runtimeBoundary?.scoreSource ?? "mock"
}, null, 2));

if (problems.length > 0) process.exitCode = 1;

function read(filePath) {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}
