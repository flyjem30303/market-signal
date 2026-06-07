import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-beta-platform-unblock-kit.mjs";
const checkPath = "scripts/check-beta-platform-unblock-kit.mjs";
const docPath = "docs/BETA_PLATFORM_UNBLOCK_KIT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const missing = [];
const blocked = [];

for (const file of [reportPath, checkPath, docPath, packagePath, reviewGatePath]) {
  if (!fs.existsSync(file)) missing.push(`${file}: file exists`);
}

const reportSource = read(reportPath);
const doc = read(docPath);
const packageJson = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredReportPhrases = [
  "blocked_waiting_two_platform_values",
  "beta_platform_values_ready_for_packet_window",
  "cmd.exe /c npm run validate:beta-platform-two-values",
  "cmd.exe /c npm run run:beta-packet-window-proof-map",
  "record:beta-packet-window-reviewed-artifact-outcome",
  "operatorHandoff",
  "placeholder_only_no_values_printed",
  "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-slug>",
  "BETA_TEMPORARY_URL=https://<public-beta-hostname>/",
  "valuesAreNotStoredInRepo: true",
  "valuesAreNotPrinted: true",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "No deployment is authorized.",
  "No SQL is executed.",
  "No Supabase connection or write is executed.",
  "No raw market data is fetched, stored, ingested, or committed."
];

const forbiddenReportPhrases = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "process.env.BETA_HOSTING_PROJECT_NAME",
  "process.env.BETA_TEMPORARY_URL",
  "deploymentAuthorized: true",
  "publicDataSource: \"supabase\"",
  "scoreSource: \"real\"",
  ".insert(",
  ".update(",
  ".delete(",
  "fetch("
];

for (const phrase of requiredReportPhrases) {
  if (!reportSource.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const phrase of forbiddenReportPhrases) {
  if (reportSource.includes(phrase)) blocked.push(`${reportPath}: forbidden phrase ${phrase}`);
}

const requiredDocPhrases = [
  "Status: `beta_platform_unblock_kit_ready_waiting_values`",
  "CEO decision: `keep_beta_mainline_waiting_only_for_two_safe_platform_values`",
  "`BETA_HOSTING_PROJECT_NAME`",
  "`BETA_TEMPORARY_URL`",
  "`cmd.exe /c npm run report:beta-platform-unblock-kit`",
  "`cmd.exe /c npm run validate:beta-platform-two-values`",
  "`cmd.exe /c npm run run:beta-packet-window-proof-map`",
  "`cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome",
  "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-slug>",
  "BETA_TEMPORARY_URL=https://<public-beta-hostname>/",
  "placeholder-only",
  "A1",
  "A2",
  "I",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "No deployment is authorized",
  "No SQL is executed",
  "No Supabase connection or write is executed",
  "No raw market data is fetched"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) missing.push(`${docPath}: ${phrase}`);
}

if (packageJson.scripts?.["report:beta-platform-unblock-kit"] !== "node scripts/report-beta-platform-unblock-kit.mjs") {
  missing.push(`${packagePath}: report:beta-platform-unblock-kit`);
}

if (packageJson.scripts?.["check:beta-platform-unblock-kit"] !== "node scripts/check-beta-platform-unblock-kit.mjs") {
  missing.push(`${packagePath}: check:beta-platform-unblock-kit`);
}

for (const phrase of [
  "scripts/check-beta-platform-unblock-kit.mjs",
  "name: \"beta-platform-unblock-kit\"",
  "\"beta-platform-unblock-kit\""
]) {
  if (!reviewGate.includes(phrase)) missing.push(`${reviewGatePath}: ${phrase}`);
}

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 240000
});

if (reportRun.status !== 0) {
  blocked.push(`${reportPath}: exited ${String(reportRun.status)} ${reportRun.stderr.trim()}`);
}

const report = parseJson(reportRun.stdout ?? "");
if (!report) {
  blocked.push(`${reportPath}: stdout is not valid JSON`);
} else {
  if (!["blocked_waiting_two_platform_values", "beta_platform_values_ready_for_packet_window"].includes(report.status)) {
    blocked.push(`report.status: ${String(report.status)}`);
  }
  if (report.runtimeBoundary?.publicDataSource !== "mock") blocked.push("report.runtimeBoundary.publicDataSource must be mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") blocked.push("report.runtimeBoundary.scoreSource must be mock");
  if (report.platformValues?.valuesAreNotPrinted !== true) blocked.push("report.platformValues.valuesAreNotPrinted must be true");
  if (report.operatorHandoff?.mode !== "placeholder_only_no_values_printed") {
    blocked.push("report.operatorHandoff.mode must be placeholder_only_no_values_printed");
  }
  if (!Array.isArray(report.operatorHandoff?.replyTemplate)) {
    missing.push("report.operatorHandoff.replyTemplate");
  } else {
    const template = report.operatorHandoff.replyTemplate.join("\n");
    if (!template.includes("BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-slug>")) {
      missing.push("report.operatorHandoff.replyTemplate project placeholder");
    }
    if (!template.includes("BETA_TEMPORARY_URL=https://<public-beta-hostname>/")) {
      missing.push("report.operatorHandoff.replyTemplate url placeholder");
    }
  }
  if (report.operatorHandoff?.valuesAreNotStoredInRepo !== true) {
    blocked.push("report.operatorHandoff.valuesAreNotStoredInRepo must be true");
  }
  if (!Array.isArray(report.stopLines) || report.stopLines.length < 8) missing.push("report.stopLines");
  if (!report.pmMainline?.afterValuesCommand?.includes("run:beta-packet-window-proof-map")) {
    missing.push("report.pmMainline.afterValuesCommand");
  }
  if (!report.pmMainline?.afterProofMapCommand?.includes("record:beta-packet-window-reviewed-artifact-outcome")) {
    missing.push("report.pmMainline.afterProofMapCommand");
  }
  if (!report.parallelLanes?.a1 || !report.parallelLanes?.a2 || !report.parallelLanes?.i) {
    missing.push("report.parallelLanes a1/a2/i");
  }
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

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
