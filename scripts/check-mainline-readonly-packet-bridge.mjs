import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-mainline-readonly-packet-bridge.mjs";
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

const report = run.status === 0 ? JSON.parse(run.stdout) : {};

if (report.mode !== "mainline_readonly_packet_bridge") problems.push("unexpected mode");
if (report.status !== "ready_to_present_not_execute") problems.push(`unexpected status ${report.status}`);
if (report.a1Intake?.decision !== "accepted_for_mainline_review") problems.push("A1 intake must be accepted for review");
if (report.preexecutionPacket?.status !== "ready_to_present_not_execute") {
  problems.push("preexecution packet must be ready to present");
}
if (report.preexecutionPacket?.stillRequiresExplicitExecutionRequest !== true) {
  problems.push("bridge must still require explicit execution request");
}
if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
  problems.push("bridge safety must stay mock");
}
for (const flag of [
  "connectionAttempted",
  "ingestionStarted",
  "scoreSourceRealEnabled",
  "secretsPrinted",
  "sqlExecuted",
  "supabaseWritesEnabled"
]) {
  if (report.safety?.[flag] !== false) problems.push(`safety.${flag} must be false`);
}
for (const phrase of [
  "report-project-progress-snapshot.mjs",
  "report-promotion-prerequisites-gate.mjs",
  "report-row-coverage-readonly-preexecution-packet.mjs",
  "ready_to_present_not_execute",
  "accepted_for_mainline_review",
  "stillRequiresExplicitExecutionRequest",
  "Use this bridge to present a bounded readonly decision packet only",
  "do not execute the attempt from this report",
  "publicDataSource=supabase",
  "scoreSource=real",
  "does not run SQL",
  "execute readonly attempts"
]) {
  if (!source.includes(phrase)) problems.push(`missing source phrase ${phrase}`);
}
for (const phrase of [
  "publicDataSource=supabase",
  "scoreSource=real",
  "row coverage points",
  "data-quality score lift",
  "readonly attempt execution"
]) {
  if (!report.blockedPromotions?.includes(phrase)) problems.push(`missing blocked promotion ${phrase}`);
}
if (!packageSource.includes("\"report:mainline-readonly-packet-bridge\": \"node scripts/report-mainline-readonly-packet-bridge.mjs\"")) {
  problems.push("package.json missing report script");
}
if (!packageSource.includes("\"check:mainline-readonly-packet-bridge\": \"node scripts/check-mainline-readonly-packet-bridge.mjs\"")) {
  problems.push("package.json missing check script");
}
if (!reviewGateSource.includes("scripts/check-mainline-readonly-packet-bridge.mjs")) {
  problems.push("review gate missing checker");
}
if (/scripts\/run-row-coverage-readonly-once\.mjs/.test(source)) {
  problems.push("bridge must not reference the readonly runner directly");
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
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/
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
