import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-public-beta-external-reply-file-template.mjs";
const checkPath = "scripts/check-public-beta-external-reply-file-template.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const dataPath = "src/lib/public-beta-launch-readiness.ts";
const componentPath = "src/components/public-beta-launch-readiness-panel.tsx";
const gitignorePath = ".gitignore";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);
const data = read(dataPath);
const component = read(componentPath);
const gitignore = read(gitignorePath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "public_beta_external_reply_file_template"],
  [reportPath, reportSource, "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>"],
  [reportPath, reportSource, "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"],
  [reportPath, reportSource, "vendor-terms-evidence"],
  [reportPath, reportSource, "asset-mapping-evidence"],
  [reportPath, reportSource, "placeholdersOnly: true"],
  [reportPath, reportSource, "valueEchoed: false"],
  [reportPath, reportSource, "fileTextEchoed: false"],
  [reportPath, reportSource, "writerCommand"],
  [reportPath, reportSource, "cmd.exe /c npm run write:public-beta-external-reply-file-template"],
  [reportPath, reportSource, "cmd.exe /c npm run report:public-beta-external-reply-intake-dry-run"],
  [reportPath, reportSource, "cmd.exe /c npm run report:public-beta-external-reply-file-route"],
  [reportPath, reportSource, "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof"],
  [reportPath, reportSource, "lowerLevelPostReplyCommand"],
  [reportPath, reportSource, "tmp\\\\\\\\public-beta-external-reply.txt"],
  [reportPath, reportSource, "Keep the reply file local and outside Git."],
  [checkPath, checkSource, "public_beta_external_reply_file_template_guard_ready"],
  [packagePath, JSON.stringify(pkg), "report:public-beta-external-reply-file-template"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-reply-file-template"],
  [reviewGatePath, reviewGate, "public-beta-external-reply-file-template"],
  [statusPath, status, "Latest public Beta external reply file template slice"],
  [gitignorePath, gitignore, "tmp/"],
  [dataPath, data, "externalReplyFileTemplateCommand"],
  [dataPath, data, "templateCommand"],
  [componentPath, component, "Reply file template"],
  [componentPath, component, "templateCommand"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:public-beta-external-reply-file-template"] !==
  "node scripts/report-public-beta-external-reply-file-template.mjs"
) {
  problems.push(`${packagePath} missing report:public-beta-external-reply-file-template script`);
}
if (
  pkg.scripts?.["check:public-beta-external-reply-file-template"] !==
  "node scripts/check-public-beta-external-reply-file-template.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-external-reply-file-template script`);
}

const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:public-beta-external-reply-file-template"], {
  cwd: process.cwd(),
  encoding: "utf8",
  timeout: 300000,
  windowsHide: true
});
const report = parseJson(run.stdout ?? "");

if (run.status !== 0) problems.push("template report should exit 0");
if (!report) {
  problems.push("template report should emit JSON");
} else {
  if (report.status !== "public_beta_external_reply_file_template_ready") problems.push("unexpected template status");
  if (report.copyableTemplate?.placeholdersOnly !== true) problems.push("template should be placeholders only");
  if (report.copyableTemplate?.valueEchoed !== false) problems.push("template must not echo values");
  if (report.copyableTemplate?.fileTextEchoed !== false) problems.push("template must not echo file text");
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (report.localFileWorkflow?.routeCommand !== "cmd.exe /c npm run report:public-beta-external-reply-file-route") {
    problems.push("template workflow should route filled files through the reply-file route first");
  }
  if (report.localFileWorkflow?.writerCommand !== "cmd.exe /c npm run write:public-beta-external-reply-file-template") {
    problems.push("template workflow should expose the local ignored placeholder writer");
  }
  if (
    report.localFileWorkflow?.completeReplyNextCommand !==
    "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof"
  ) {
    problems.push("template workflow should use external reply file workflow proof for complete replies");
  }
  if (report.localFileWorkflow?.lowerLevelPostReplyCommand !== "cmd.exe /c npm run run:public-beta-post-reply-route-once") {
    problems.push("template workflow should keep the post-reply one-runner as lower-level support");
  }
  if (report.requiredBlocks?.length !== 2) problems.push("template should expose two required blocks");
  if (!report.copyableTemplate?.lines?.includes("evidenceSlotId: vendor-terms-evidence")) {
    problems.push("template missing first A1 slot line");
  }
  if (!report.copyableTemplate?.lines?.includes("evidenceSlotId: asset-mapping-evidence")) {
    problems.push("template missing last A1 slot line");
  }
  for (const [flag, expected] of Object.entries({
    deploymentAuthorized: false,
    evidenceRecorded: false,
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
    if (report.safety?.[flag] !== expected) problems.push(`safety.${flag} must be ${String(expected)}`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(reportSource)) problems.push(`${reportPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  guardedStatus: "public_beta_external_reply_file_template_guard_ready",
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
    /scoreSource:\s*"real"/u
  ];
}
