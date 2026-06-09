import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];
const runnerPath = "scripts/run-public-beta-external-reply-file-workflow-proof.mjs";
const checkPath = "scripts/check-public-beta-external-reply-file-workflow-proof.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const dataPath = "src/lib/public-beta-launch-readiness.ts";
const componentPath = "src/components/public-beta-launch-readiness-panel.tsx";

const runner = read(runnerPath);
const check = read(checkPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const projectStatus = read(statusPath);
const data = read(dataPath);
const component = read(componentPath);

for (const [filePath, source, phrase] of [
  [runnerPath, runner, "public_beta_external_reply_file_workflow_proof"],
  [runnerPath, runner, "report:public-beta-external-reply-intake-dry-run"],
  [runnerPath, runner, "run:public-beta-post-reply-route-once"],
  [runnerPath, runner, "tempA1OutcomeFixtureWrittenOutsideRepo"],
  [runnerPath, runner, "valuesStoredInRepo: false"],
  [runnerPath, runner, "This runner does not print or store platform values."],
  [runnerPath, runner, "publicDataSource remains mock and scoreSource remains mock."],
  [checkPath, check, "public_beta_external_reply_file_workflow_proof_guard_ready"],
  [packagePath, JSON.stringify(pkg), "run:public-beta-external-reply-file-workflow-proof"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-external-reply-file-workflow-proof"],
  [reviewGatePath, reviewGate, "public-beta-external-reply-file-workflow-proof"],
  [statusPath, projectStatus, "Latest public Beta external reply file workflow proof slice"],
  [dataPath, data, "externalReplyFileWorkflowProofCommand"],
  [dataPath, data, "workflowProofCommand"],
  [componentPath, component, "Workflow proof"],
  [componentPath, component, "workflowProofCommand"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["run:public-beta-external-reply-file-workflow-proof"] !==
  "node scripts/run-public-beta-external-reply-file-workflow-proof.mjs"
) {
  problems.push(`${packagePath} missing run:public-beta-external-reply-file-workflow-proof`);
}
if (
  pkg.scripts?.["check:public-beta-external-reply-file-workflow-proof"] !==
  "node scripts/check-public-beta-external-reply-file-workflow-proof.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-external-reply-file-workflow-proof`);
}

const safeReplyPath = writeReplyFixture("safe", safeReplyText());
const unsafeReplyPath = writeReplyFixture("unsafe", unsafeReplyText());
const scenarios = [
  {
    expected: "public_beta_external_reply_file_workflow_blocked_before_post_reply",
    name: "missing-reply-file",
    path: null
  },
  {
    expected: "public_beta_external_reply_file_workflow_ready_for_packet_review_and_a1_outcome_gate",
    forbiddenStdout: ["taiwan-market-signal-beta", "https://taiwan-market-signal-beta.vercel.app/"],
    name: "safe-complete-reply",
    path: safeReplyPath
  },
  {
    expected: "public_beta_external_reply_file_workflow_blocked_before_post_reply",
    name: "unsafe-reply",
    path: unsafeReplyPath
  }
];

for (const scenario of scenarios) {
  const env = { ...process.env, BETA_PLATFORM_VALUES_SKIP_DOTENV: "1" };
  delete env.PUBLIC_BETA_EXTERNAL_REPLY_PATH;
  if (scenario.path) env.PUBLIC_BETA_EXTERNAL_REPLY_PATH = scenario.path;
  const result = spawnSync("cmd.exe", ["/c", "npm", "run", "run:public-beta-external-reply-file-workflow-proof"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
    timeout: 1200000,
    windowsHide: true
  });
  const report = parseJson(result.stdout ?? "");

  if (result.status !== 0) problems.push(`${scenario.name} runner should exit 0`);
  if (!report) {
    problems.push(`${scenario.name} runner should emit JSON`);
    continue;
  }
  if (report.status !== scenario.expected) problems.push(`${scenario.name} expected ${scenario.expected}, got ${report.status}`);
  if (report.runtimeBoundary?.publicDataSource !== "mock") problems.push(`${scenario.name} publicDataSource must remain mock`);
  if (report.runtimeBoundary?.scoreSource !== "mock") problems.push(`${scenario.name} scoreSource must remain mock`);
  if (report.derivedInputs?.platformValuesPrinted === true) problems.push(`${scenario.name} must not print platform values`);
  if (report.derivedInputs?.replyFileTextPrinted === true) problems.push(`${scenario.name} must not print reply file text`);
  if (report.derivedInputs?.valuesStoredInRepo === true) problems.push(`${scenario.name} must not store values in repo`);
  for (const [flag, expected] of Object.entries({
    deploymentAuthorized: false,
    deploymentExecuted: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    packetArtifactWritten: false,
    rawPayloadPrinted: false,
    rowCoverageAwarded: false,
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
    if (report.ok !== true) problems.push("safe fixture should be ok");
    if (report.derivedInputs?.a1SlotCount !== 4) problems.push("safe fixture should derive four A1 slots");
    if (report.steps?.length !== 2) problems.push("safe fixture should run dry-run and post-reply steps");
    if (!report.steps?.some((step) => step.id === "public-beta-post-reply-route-once" && step.status === "public_beta_post_reply_route_ready_for_packet_review_and_a1_outcome_gate")) {
      problems.push("safe fixture should reach post-reply packet review and A1 outcome gate state");
    }
  }
  for (const forbidden of scenario.forbiddenStdout ?? []) {
    if ((result.stdout ?? "").includes(forbidden)) problems.push(`${scenario.name} stdout must not echo value ${forbidden}`);
  }
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  guardedStatus: "public_beta_external_reply_file_workflow_proof_guard_ready",
  scenarioCount: scenarios.length,
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
    "safeEvidenceSummary: Reviewed no-secret summary is complete for workflow proof validation without copied contract text or private operational details.",
    "remainingRisk: Execution remains blocked until PM accepts all slots in a separate outcome gate.",
    ""
  ];
}

function writeReplyFixture(name, text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `public-beta-external-reply-workflow-${name}-`));
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
