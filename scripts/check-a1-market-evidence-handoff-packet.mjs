import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-a1-market-evidence-handoff-packet.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const source = fs.readFileSync(reportPath, "utf8");
const packageSource = fs.readFileSync(packagePath, "utf8");
const reviewGateSource = fs.readFileSync(reviewGatePath, "utf8");
const problems = [];

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (run.status !== 0) {
  problems.push(`${reportPath} exited ${String(run.status)} ${run.stderr.trim()}`);
}

const reportText = run.stdout.trim();
const report = run.status === 0 ? JSON.parse(reportText) : {};

if (report.mode !== "a1_market_evidence_handoff_packet") problems.push("unexpected mode");
if (report.status !== "ready_for_mainline_review_not_promotion") problems.push(`unexpected status ${report.status}`);
if (report.acceptedInput?.decision !== "accepted_for_mainline_review") problems.push("A1 input must be accepted for review");
if (report.acceptedInput?.input !== "local_promotion_prerequisites_gate") problems.push("unexpected accepted input");
if (report.sourceGate?.canPrepareDecisionPacket !== true) problems.push("source gate must allow decision packet preparation");
if (report.sourceGate?.status !== "local_prerequisites_defined_remote_evidence_missing") problems.push("unexpected source gate status");
if (report.relatedMainlineBridge?.mode !== "mainline_readonly_packet_bridge") problems.push("missing related bridge mode");
if (report.relatedMainlineBridge?.status !== "ready_to_present_not_execute") problems.push("related bridge must be presentation-only ready");
if (report.relatedMainlineBridge?.stillReviewOnly !== true) problems.push("related bridge must remain review only");
if (report.publicDataSource !== "mock" || report.scoreSource !== "mock") problems.push("runtime sources must stay mock");
for (const flag of [
  "canExecuteRemoteAttempt",
  "canAwardRowCoveragePoints",
  "canPromotePublicDataSource",
  "canSetScoreSourceReal"
]) {
  if (report[flag] !== false) problems.push(`${flag} must be false`);
}
if (report.postRunReviewRequired !== true) problems.push("postRunReviewRequired must be true");

for (const phrase of [
  "publicDataSource=supabase",
  "scoreSource=real",
  "row coverage points",
  "data-quality score lift",
  "readonly attempt execution"
]) {
  if (!report.blockedPromotions?.includes(phrase)) problems.push(`missing blocked promotion ${phrase}`);
}

for (const phrase of [
  "report-project-progress-snapshot.mjs",
  "report-promotion-prerequisites-gate.mjs",
  "report-mainline-readonly-packet-bridge.mjs",
  "a1_market_evidence_handoff_packet",
  "ready_for_mainline_review_not_promotion",
  "blocked_local_contract_missing",
  "sanitized aggregate summary for mainline review",
  "local review context only"
]) {
  if (!source.includes(phrase)) problems.push(`missing source phrase ${phrase}`);
}

if (!packageSource.includes('"report:a1-market-evidence-handoff-packet": "node scripts/report-a1-market-evidence-handoff-packet.mjs"')) {
  problems.push("package.json missing report script");
}
if (!packageSource.includes('"check:a1-market-evidence-handoff-packet": "node scripts/check-a1-market-evidence-handoff-packet.mjs"')) {
  problems.push("package.json missing check script");
}
if (!reviewGateSource.includes("scripts/check-a1-market-evidence-handoff-packet.mjs")) {
  problems.push("review gate missing checker");
}

for (const pattern of [
  /\braw rows\b/i,
  /\bstock_id\b/i,
  /\btoken\b/i,
  /\bkey\b/i,
  /https?:\/\/[^\s"]*supabase[^\s"]*/i,
  /\bSQL\b/,
  /\bselect\b/i,
  /\binsert\b/i,
  /\bupdate\b/i,
  /\bdelete\b/i
]) {
  if (pattern.test(reportText)) problems.push(`forbidden report output pattern ${String(pattern)}`);
}

for (const pattern of [
  /@supabase\/supabase-js/,
  /createClient/,
  /fetch\(/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /process\.env/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /canExecuteRemoteAttempt:\s*true/,
  /canAwardRowCoveragePoints:\s*true/,
  /canPromotePublicDataSource:\s*true/,
  /canSetScoreSourceReal:\s*true/
]) {
  if (pattern.test(source)) problems.push(`forbidden source pattern ${String(pattern)}`);
}

console.log(
  JSON.stringify(
    {
      problems,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) process.exitCode = 1;
