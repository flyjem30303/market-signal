import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-public-beta-external-reply-intake-dry-run.mjs";
const checkPath = "scripts/check-public-beta-external-reply-intake-dry-run.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const reportSource = read(reportPath);
const checkSource = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [reportPath, reportSource, "public_beta_external_reply_intake_dry_run"],
  [reportPath, reportSource, "PUBLIC_BETA_EXTERNAL_REPLY_PATH"],
  [reportPath, reportSource, "blocked_waiting_external_reply_file"],
  [reportPath, reportSource, "external_reply_shape_ready_for_post_reply_one_runner"],
  [reportPath, reportSource, "rejected_unsafe_external_reply_shape"],
  [reportPath, reportSource, "fileTextEchoed: false"],
  [reportPath, reportSource, "valueEchoed: false"],
  [reportPath, reportSource, "replyTextEchoed: false"],
  [reportPath, reportSource, "report:public-beta-external-input-copy-packet"],
  [reportPath, reportSource, "run:public-beta-external-reply-file-workflow-proof"],
  [reportPath, reportSource, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, checkSource, "public_beta_external_reply_intake_dry_run_guard_ready"],
  [packagePath, JSON.stringify(pkg), "report:public-beta-external-reply-intake-dry-run"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-reply-intake-dry-run"],
  [reviewGatePath, reviewGate, "public-beta-external-reply-intake-dry-run"],
  [statusPath, status, "Latest public Beta external reply intake dry-run slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["report:public-beta-external-reply-intake-dry-run"] !==
  "node scripts/report-public-beta-external-reply-intake-dry-run.mjs"
) {
  problems.push(`${packagePath} missing report:public-beta-external-reply-intake-dry-run script`);
}
if (
  pkg.scripts?.["check:public-beta-external-reply-intake-dry-run"] !==
  "node scripts/check-public-beta-external-reply-intake-dry-run.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-external-reply-intake-dry-run script`);
}

const safeFixture = writeFixture("safe", safeReplyText());
const unsafeFixture = writeFixture("unsafe", unsafeReplyText());
const scenarios = [
  {
    expected: "blocked_waiting_external_reply_file",
    name: "missing-file",
    path: null
  },
  {
    expected: "external_reply_shape_ready_for_post_reply_one_runner",
    name: "safe-complete-reply",
    path: safeFixture
  },
  {
    expected: "rejected_unsafe_external_reply_shape",
    name: "unsafe-reply",
    path: unsafeFixture
  }
];

for (const scenario of scenarios) {
  const env = { ...process.env };
  delete env.PUBLIC_BETA_EXTERNAL_REPLY_PATH;
  if (scenario.path) env.PUBLIC_BETA_EXTERNAL_REPLY_PATH = scenario.path;
  const run = spawnSync("cmd.exe", ["/c", "npm", "run", "report:public-beta-external-reply-intake-dry-run"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    timeout: 300000,
    windowsHide: true
  });
  const report = parseJson(run.stdout ?? "");

  if (run.status !== 0) problems.push(`${scenario.name} should exit 0`);
  if (!report) {
    problems.push(`${scenario.name} should emit JSON`);
    continue;
  }
  if (report.status !== scenario.expected) {
    problems.push(`${scenario.name} expected ${scenario.expected}, got ${report.status}`);
  }
  if (report.input?.fileTextEchoed !== false) problems.push(`${scenario.name} must not echo file text`);
  if (report.input?.valueEchoed !== false) problems.push(`${scenario.name} must not echo values`);
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push(`${scenario.name} publicDataSource must remain mock`);
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push(`${scenario.name} scoreSource must remain mock`);
  for (const [flag, expected] of Object.entries({
    deploymentAuthorized: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    rawPayloadPrinted: false,
    replyTextEchoed: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesStored: false
  })) {
    if (report.safety?.[flag] !== expected) problems.push(`${scenario.name} safety.${flag} must be ${String(expected)}`);
  }

  if (scenario.name === "safe-complete-reply") {
    if (report.platformTwoValues?.ok !== true) problems.push("safe fixture platform shape should be ok");
    if (report.a1TwiiFourSlotEvidence?.ok !== true) problems.push("safe fixture A1 shape should be ok");
    if (report.a1TwiiFourSlotEvidence?.acceptedShapeSlotCount !== 4) problems.push("safe fixture should accept four A1 slots");
    if (report.nextExecutableStep?.command !== "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof") {
      problems.push("safe fixture next command should be the external reply file workflow proof");
    }
    if (report.nextCommands?.includes("cmd.exe /c npm run run:public-beta-post-reply-route-once")) {
      problems.push("safe fixture nextCommands should not ask PM to manually run post-reply one-runner from the reply-file dry-run");
    }
    for (const forbidden of ["taiwan-market-signal-beta", "https://taiwan-market-signal-beta.vercel.app/"]) {
      if ((run.stdout ?? "").includes(forbidden)) problems.push(`safe fixture stdout must not echo value ${forbidden}`);
    }
  }

  if (scenario.name === "unsafe-reply") {
    if (report.unsafeShape?.ok !== false) problems.push("unsafe fixture should fail unsafeShape");
    if ((report.unsafeShape?.problemCount ?? 0) < 1) problems.push("unsafe fixture should report at least one unsafe problem");
    if (report.nextExecutableStep?.command !== "cmd.exe /c npm run report:public-beta-external-input-copy-packet") {
      problems.push("unsafe fixture should return to copy packet");
    }
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
  guardedStatus: "public_beta_external_reply_intake_dry_run_guard_ready",
  scenarioCount: scenarios.length,
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

function writeFixture(name, text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `public-beta-external-reply-${name}-`));
  const filePath = path.join(dir, "reply.txt");
  fs.writeFileSync(filePath, text, "utf8");
  return filePath;
}

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

function unsafeReplyText() {
  return [
    "BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta",
    "BETA_TEMPORARY_URL=https://unsafe-project.supabase.co/",
    "",
    ...slot("vendor-terms-evidence", "reviewed-terms-summary-label"),
    "safeEvidenceSummary: This unsafe line mentions raw payload and must be rejected."
  ].join("\n");
}

function slot(id, label) {
  return [
    `evidenceSlotId: ${id}`,
    `sourceReferenceLabel: ${label}`,
    "safeEvidenceSummary: Reviewed no-secret summary is complete for dry-run shape validation without copied contract text or private operational details.",
    "remainingRisk: Execution remains blocked until PM accepts all slots in a separate outcome gate.",
    ""
  ];
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
