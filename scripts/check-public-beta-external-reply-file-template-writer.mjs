import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];
const writerPath = "scripts/write-public-beta-external-reply-file-template.mjs";
const checkPath = "scripts/check-public-beta-external-reply-file-template-writer.mjs";
const reportPath = "scripts/report-public-beta-external-reply-file-template.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const gitignorePath = ".gitignore";

const writerSource = read(writerPath);
const checkSource = read(checkPath);
const reportSource = read(reportPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const gitignore = read(gitignorePath);

for (const [filePath, source, phrase] of [
  [writerPath, writerSource, "public_beta_external_reply_file_template_writer"],
  [writerPath, writerSource, "PUBLIC_BETA_EXTERNAL_REPLY_TEMPLATE_OUTPUT_PATH"],
  [writerPath, writerSource, "public_beta_external_reply_file_template_written"],
  [writerPath, writerSource, "public_beta_external_reply_file_template_writer_blocked_existing_file"],
  [writerPath, writerSource, "fileTextEchoed: false"],
  [writerPath, writerSource, "valuesEchoed: false"],
  [writerPath, writerSource, "cmd.exe /c npm run report:public-beta-external-reply-file-route"],
  [writerPath, writerSource, "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof"],
  [checkPath, checkSource, "public_beta_external_reply_file_template_writer_guard_ready"],
  [reportPath, reportSource, "writerCommand"],
  [packagePath, JSON.stringify(pkg), "write:public-beta-external-reply-file-template"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-reply-file-template-writer"],
  [reviewGatePath, reviewGate, "public-beta-external-reply-file-template-writer"],
  [statusPath, status, "Latest external reply file template writer slice"],
  [gitignorePath, gitignore, "tmp/"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["write:public-beta-external-reply-file-template"] !==
  "node scripts/write-public-beta-external-reply-file-template.mjs"
) {
  problems.push(`${packagePath} missing write:public-beta-external-reply-file-template`);
}
if (
  pkg.scripts?.["check:public-beta-external-reply-file-template-writer"] !==
  "node scripts/check-public-beta-external-reply-file-template-writer.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-external-reply-file-template-writer`);
}

const tempOutputPath = path.join("tmp", `public-beta-external-reply-writer-check-${Date.now()}.txt`);
try {
  if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
  const env = {
    ...process.env,
    PUBLIC_BETA_EXTERNAL_REPLY_TEMPLATE_OUTPUT_PATH: tempOutputPath
  };
  const writeRun = spawnSync("cmd.exe", ["/c", "npm", "run", "write:public-beta-external-reply-file-template"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    timeout: 300000,
    windowsHide: true
  });
  const writeReport = parseJson(writeRun.stdout ?? "");

  if (writeRun.status !== 0) problems.push("writer should exit 0 for a fresh tmp output path");
  if (!writeReport) {
    problems.push("writer should emit JSON");
  } else {
    if (writeReport.status !== "public_beta_external_reply_file_template_written") problems.push("writer status mismatch");
    if (writeReport.outputPath !== tempOutputPath) problems.push("writer should report the requested output path");
    if (writeReport.fileWritten !== true) problems.push("writer should mark fileWritten true");
    if (writeReport.fileOverwritten !== false) problems.push("writer must not overwrite");
    if (writeReport.placeholdersOnly !== true) problems.push("writer should be placeholders only");
    if (writeReport.fileTextEchoed !== false) problems.push("writer must not echo file text");
    if (writeReport.valuesEchoed !== false) problems.push("writer must not echo values");
    if (writeReport.routeCommand !== "cmd.exe /c npm run report:public-beta-external-reply-file-route") {
      problems.push("writer should route filled files through reply-file route");
    }
    if (writeReport.runtimeBoundary?.publicDataSource !== "mock") problems.push("writer publicDataSource must remain mock");
    if (writeReport.runtimeBoundary?.scoreSource !== "mock") problems.push("writer scoreSource must remain mock");
    for (const [flag, expected] of Object.entries({
      deploymentAuthorized: false,
      evidenceRecorded: false,
      fileTextEchoed: false,
      hostingMutated: false,
      marketDataFetched: false,
      rawPayloadPrinted: false,
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sourceRightsApproved: false,
      sqlExecuted: false,
      supabaseReadsEnabled: false,
      supabaseWritesEnabled: false,
      valuesStored: false
    })) {
      if (writeReport.safety?.[flag] !== expected) problems.push(`writer safety.${flag} must be ${String(expected)}`);
    }
  }

  if (!fs.existsSync(tempOutputPath)) {
    problems.push("writer should create the temp reply file");
  } else {
    const text = fs.readFileSync(tempOutputPath, "utf8");
    for (const phrase of [
      "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
      "BETA_TEMPORARY_URL=https://<public-beta-hostname>/",
      "evidenceSlotId: vendor-terms-evidence",
      "evidenceSlotId: internal-feed-owner-evidence",
      "evidenceSlotId: field-contract-evidence",
      "evidenceSlotId: asset-mapping-evidence",
      "sourceReferenceLabel: <no-secret label>",
      "remainingRisk: <one to two sentences; smallest blocker or execution risk>"
    ]) {
      if (!text.includes(phrase)) problems.push(`written template missing phrase: ${phrase}`);
    }
  }

  const secondRun = spawnSync("cmd.exe", ["/c", "npm", "run", "write:public-beta-external-reply-file-template"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    timeout: 300000,
    windowsHide: true
  });
  const secondReport = parseJson(secondRun.stdout ?? "");
  if (secondRun.status !== 0) problems.push("writer existing-file guard should still exit 0");
  if (secondReport?.status !== "public_beta_external_reply_file_template_writer_blocked_existing_file") {
    problems.push("writer should block and not overwrite an existing file");
  }
  if (secondReport?.fileOverwritten !== false) problems.push("existing-file guard must not overwrite");
  if (secondReport?.fileTextEchoed !== false) problems.push("existing-file guard must not echo file text");
  if (secondReport?.valuesEchoed !== false) problems.push("existing-file guard must not echo values");
} finally {
  if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
}

for (const [filePath, source] of [
  [writerPath, writerSource],
  [reportPath, reportSource]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  guardedStatus: "public_beta_external_reply_file_template_writer_guard_ready",
  publicDataSource: "mock",
  scoreSource: "mock"
}, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
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

function forbiddenPatterns() {
  return [
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\bfetch\s*\(/u,
    /git",\s*"add"/iu,
    /git",\s*"commit"/iu,
    /git",\s*"push"/iu,
    /publicDataSource:\s*"supabase"/u,
    /scoreSource:\s*"real"/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u
  ];
}
