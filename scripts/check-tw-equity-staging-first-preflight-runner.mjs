import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const designPath = "docs/TW_EQUITY_STAGING_FIRST_PREFLIGHT_RUNNER_DESIGN.md";
const runnerPath = "scripts/report-tw-equity-staging-first-preflight.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const design = read(designPath);
const runner = read(runnerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Staging-First Preflight Runner Design",
  "tw_equity_staging_first_preflight_runner_design_ready_no_execution",
  "scripts/report-tw-equity-staging-first-preflight.mjs",
  "stdout-only",
  "no-network",
  "no-Supabase",
  "no-SQL",
  "no-file-write",
  "blocked_until_source_classification_and_write_authorization",
  "tw_equity_daily_prices_staging",
  "template_fields_defined_not_executable",
  "CEO approves implementing this stdout-only preflight runner"
]) {
  if (!design.includes(phrase)) problems.push(`${designPath} missing: ${phrase}`);
}

for (const phrase of [
  "docs/DATA_REALIFICATION_ACCELERATION_GATE.md",
  "docs/TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET.md",
  "docs/TW_EQUITY_SOURCE_REVIEW_READINESS_SUMMARY.md",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "laneId: \"tw-equity\"",
  "symbols: [\"2330\", \"2382\", \"2308\"]",
  "expectedTradingSessions: 60",
  "expectedRows: 180",
  "latestObservedRows: 3",
  "latestMissingRows: 177",
  "sourceClassificationStatus: \"waiting_human_source_legal_classification\"",
  "targetRelationProposal: \"tw_equity_daily_prices_staging\"",
  "productionDailyPricesBlocked: true",
  "rollbackPosture: \"required_not_authorized\"",
  "retentionPosture: \"required_not_authorized\"",
  "postRunReviewReadiness: \"template_fields_defined_not_executable\"",
  "filesWritten: false",
  "mutations: false",
  "sqlExecuted: false",
  "supabaseConnectionAttempted: false",
  "supabaseWrites: false",
  "marketDataFetched: false",
  "marketDataIngested: false",
  "sourcePayloadsPrinted: false",
  "sourceDerivedRowsStored: false",
  "secretsPrinted: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging-first preflight runner slice",
  "docs/TW_EQUITY_STAGING_FIRST_PREFLIGHT_RUNNER_DESIGN.md",
  "scripts/report-tw-equity-staging-first-preflight.mjs",
  "tw_equity_staging_first_preflight_runner_design_ready_no_execution",
  "blocked_until_source_classification_and_write_authorization",
  "template_fields_defined_not_executable"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:tw-equity-staging-first-preflight"] !== "node scripts/report-tw-equity-staging-first-preflight.mjs") {
  problems.push("package.json missing report:tw-equity-staging-first-preflight");
}

if (pkg.scripts?.["check:tw-equity-staging-first-preflight-runner"] !== "node scripts/check-tw-equity-staging-first-preflight-runner.mjs") {
  problems.push("package.json missing check:tw-equity-staging-first-preflight-runner");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-first-preflight-runner.mjs")) {
    problems.push(`${path} missing TW equity staging-first preflight runner checker`);
  }
  if (!text.includes("tw-equity-staging-first-preflight-runner")) {
    problems.push(`${path} missing tw-equity-staging-first-preflight-runner name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-first-preflight-runner"')) {
  problems.push("review gate core set missing tw-equity-staging-first-preflight-runner");
}

const forbiddenRunnerPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /\bfetch\s*\(/u,
  /\bwriteFile/u,
  /\bappendFile/u,
  /\bmkdir/u,
  /\brm\s*\(/u,
  /\bunlink/u,
  /\bcreateWriteStream/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u,
  /sb_publishable_/u
];

for (const pattern of forbiddenRunnerPatterns) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden token: ${pattern}`);
}

const result = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${runnerPath} exited with ${result.status}: ${(result.stderr || result.stdout).trim()}`);
} else {
  try {
    validateReport(JSON.parse(result.stdout));
  } catch (error) {
    problems.push(`${runnerPath} did not print valid JSON: ${error.message}`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function validateReport(report) {
  const expected = {
    status: "blocked_until_source_classification_and_write_authorization",
    laneId: "tw-equity",
    expectedTradingSessions: 60,
    expectedRows: 180,
    latestObservedRows: 3,
    latestMissingRows: 177,
    sourceClassificationStatus: "waiting_human_source_legal_classification",
    targetRelationProposal: "tw_equity_daily_prices_staging",
    productionDailyPricesBlocked: true,
    rollbackPosture: "required_not_authorized",
    retentionPosture: "required_not_authorized",
    postRunReviewReadiness: "template_fields_defined_not_executable",
    filesWritten: false,
    mutations: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWrites: false,
    marketDataFetched: false,
    marketDataIngested: false,
    sourcePayloadsPrinted: false,
    sourceDerivedRowsStored: false,
    secretsPrinted: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  };

  for (const [key, value] of Object.entries(expected)) {
    if (report[key] !== value) problems.push(`report ${key} expected ${JSON.stringify(value)} but got ${JSON.stringify(report[key])}`);
  }

  if (JSON.stringify(report.symbols) !== JSON.stringify(["2330", "2382", "2308"])) {
    problems.push(`report symbols mismatch: ${JSON.stringify(report.symbols)}`);
  }

  if (!Array.isArray(report.requiredAuthorizationMissing) || report.requiredAuthorizationMissing.length < 8) {
    problems.push("report requiredAuthorizationMissing must contain required authorization blockers");
  }

  if (!Array.isArray(report.problems) || report.problems.length !== 0) {
    problems.push(`report problems must be empty array: ${JSON.stringify(report.problems)}`);
  }
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
