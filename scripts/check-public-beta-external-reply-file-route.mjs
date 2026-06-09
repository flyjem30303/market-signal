import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];
const reportPath = "scripts/report-public-beta-external-reply-file-route.mjs";
const checkPath = "scripts/check-public-beta-external-reply-file-route.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const dataPath = "src/lib/public-beta-launch-readiness.ts";
const componentPath = "src/components/public-beta-launch-readiness-panel.tsx";

const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const projectStatus = read(statusPath);
const data = read(dataPath);
const component = read(componentPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "public_beta_external_reply_file_route"],
  [reportPath, reportSource, "report:public-beta-external-reply-intake-dry-run"],
  [reportPath, reportSource, "report:public-beta-a1-reply-pm-classification-preview"],
  [reportPath, reportSource, "run:public-beta-external-reply-file-workflow-proof"],
  [reportPath, reportSource, "defaultReplyFilePath"],
  [reportPath, reportSource, "defaultReplyFilePathUsed"],
  [reportPath, reportSource, "tmp\\\\public-beta-external-reply.txt"],
  [reportPath, reportSource, "external_reply_file_route_ready_for_workflow_proof"],
  [reportPath, reportSource, "external_reply_file_route_waiting_a1_bounded_repair"],
  [reportPath, reportSource, "fileTextEchoed: false"],
  [reportPath, reportSource, "slotTextEchoed: false"],
  [checkPath, checkSource, "public_beta_external_reply_file_route_guard_ready"],
  [packagePath, JSON.stringify(pkg), "report:public-beta-external-reply-file-route"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-reply-file-route"],
  [reviewGatePath, reviewGate, "public-beta-external-reply-file-route"],
  [statusPath, projectStatus, "Latest public Beta external reply file route slice"],
  [dataPath, data, "externalReplyFileRouteCommand"],
  [dataPath, data, "routeCommand"],
  [componentPath, component, "Reply file route"],
  [componentPath, component, "routeCommand"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["report:public-beta-external-reply-file-route"] !== "node scripts/report-public-beta-external-reply-file-route.mjs") {
  problems.push(`${packagePath} missing report:public-beta-external-reply-file-route`);
}
if (pkg.scripts?.["check:public-beta-external-reply-file-route"] !== "node scripts/check-public-beta-external-reply-file-route.mjs") {
  problems.push(`${packagePath} missing check:public-beta-external-reply-file-route`);
}

const fixtures = [
  {
    expectedCommand: "cmd.exe /c npm run write:public-beta-external-reply-file-template",
    expectedStatus: "external_reply_file_route_waiting_reply_file",
    name: "missing-file",
    path: null
  },
  {
    expectedCommand: "cmd.exe /c npm run fill:public-beta-external-reply-file-from-env",
    expectedStatus: "external_reply_file_route_waiting_existing_file_fill",
    name: "placeholder-reply",
    path: writeFixture("placeholder", placeholderReplyText())
  },
  {
    expectedCommand: "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof",
    expectedStatus: "external_reply_file_route_ready_for_workflow_proof",
    forbiddenStdout: ["taiwan-market-signal-beta", "https://taiwan-market-signal-beta.vercel.app/", "reviewed-terms-summary-label"],
    name: "safe-complete-reply",
    path: writeFixture("safe", safeReplyText())
  },
  {
    expectedCommand: "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
    expectedStatus: "external_reply_file_route_waiting_a1_bounded_repair",
    name: "partial-a1-reply",
    path: writeFixture("partial", partialReplyText())
  },
  {
    expectedCommand: "cmd.exe /c npm run report:public-beta-external-input-copy-packet",
    expectedStatus: "external_reply_file_route_rejected_unsafe_shape",
    name: "unsafe-reply",
    path: writeFixture("unsafe", unsafeReplyText())
  }
];

for (const fixture of fixtures) {
  const env = { ...process.env };
  delete env.PUBLIC_BETA_EXTERNAL_REPLY_PATH;
  if (fixture.path) {
    env.PUBLIC_BETA_EXTERNAL_REPLY_PATH = fixture.path;
  } else {
    env.PUBLIC_BETA_EXTERNAL_REPLY_PATH = path.join(os.tmpdir(), "public-beta-external-reply-route-missing", "reply.txt");
  }
  const result = spawnSync("cmd.exe", ["/c", "npm", "run", "report:public-beta-external-reply-file-route"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    timeout: 600000,
    windowsHide: true
  });
  const report = parseJson(result.stdout ?? "");

  if (result.status !== 0) problems.push(`${fixture.name} should exit 0`);
  if (!report) {
    problems.push(`${fixture.name} should emit JSON`);
    continue;
  }
  if (report.status !== fixture.expectedStatus) problems.push(`${fixture.name} expected ${fixture.expectedStatus}, got ${report.status}`);
  if (report.nextExecutableStep?.command !== fixture.expectedCommand) problems.push(`${fixture.name} next command mismatch`);
  if (report.inputSummary?.fileTextEchoed !== false) problems.push(`${fixture.name} must not echo file text`);
  if (report.inputSummary?.slotTextEchoed !== false) problems.push(`${fixture.name} must not echo slot text`);
  if (report.inputSummary?.valueEchoed !== false) problems.push(`${fixture.name} must not echo values`);
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push(`${fixture.name} publicDataSource must remain mock`);
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push(`${fixture.name} scoreSource must remain mock`);
  for (const [flag, expected] of Object.entries({
    deploymentAuthorized: false,
    evidenceRecorded: false,
    fileTextEchoed: false,
    hostingMutated: false,
    marketDataFetched: false,
    rawPayloadPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    slotTextEchoed: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  })) {
    if (report.safety?.[flag] !== expected) problems.push(`${fixture.name} safety.${flag} must be ${String(expected)}`);
  }
  for (const forbidden of fixture.forbiddenStdout ?? []) {
    if ((result.stdout ?? "").includes(forbidden)) problems.push(`${fixture.name} stdout must not echo ${forbidden}`);
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
  guardedStatus: "public_beta_external_reply_file_route_guard_ready",
  scenarioCount: fixtures.length,
  publicDataSource: "mock",
  scoreSource: "mock"
}, null, 2));

function safeReplyText() {
  return [
    "BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta",
    "BETA_TEMPORARY_URL=https://taiwan-market-signal-beta.vercel.app/",
    "",
    ...slot("vendor-terms-evidence", "reviewed-terms-summary-label"),
    ...slot("internal-feed-owner-evidence", "internal-feed-owner-review-label"),
    ...slot("field-contract-evidence", "field-contract-review-label"),
    ...slot("asset-mapping-evidence", "asset-mapping-review-label")
  ].join("\n");
}

function placeholderReplyText() {
  return [
    "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
    "BETA_TEMPORARY_URL=https://<public-beta-hostname>/",
    "",
    ...placeholderSlot("vendor-terms-evidence"),
    ...placeholderSlot("internal-feed-owner-evidence"),
    ...placeholderSlot("field-contract-evidence"),
    ...placeholderSlot("asset-mapping-evidence")
  ].join("\n");
}

function partialReplyText() {
  return [
    "BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta",
    "BETA_TEMPORARY_URL=https://taiwan-market-signal-beta.vercel.app/",
    "",
    ...slot("vendor-terms-evidence", "reviewed-terms-summary-label"),
    ...slot("internal-feed-owner-evidence", "internal-feed-owner-review-label"),
    "evidenceSlotId: field-contract-evidence",
    "sourceReferenceLabel: field-contract-review-label",
    "safeEvidenceSummary: Reviewed no-secret summary is complete for route validation without copied contract text or private operational details.",
    "",
    ...slot("asset-mapping-evidence", "asset-mapping-review-label")
  ].join("\n");
}

function placeholderSlot(id) {
  return [
    `evidenceSlotId: ${id}`,
    "sourceReferenceLabel: <no-secret label>",
    "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
    "remainingRisk: <one to two sentences; smallest blocker or execution risk>",
    ""
  ];
}

function unsafeReplyText() {
  return [
    "BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta",
    "BETA_TEMPORARY_URL=https://unsafe-project.supabase.co/",
    "",
    ...slot("vendor-terms-evidence", "reviewed-terms-summary-label")
  ].join("\n");
}

function slot(id, label) {
  return [
    `evidenceSlotId: ${id}`,
    `sourceReferenceLabel: ${label}`,
    "safeEvidenceSummary: Reviewed no-secret summary is complete for route validation without copied contract text or private operational details.",
    "remainingRisk: Execution remains blocked until PM accepts all slots in a separate outcome gate.",
    ""
  ];
}

function writeFixture(name, text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `public-beta-external-reply-route-${name}-`));
  const filePath = path.join(dir, "reply.txt");
  fs.writeFileSync(filePath, text, "utf8");
  return filePath;
}

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
