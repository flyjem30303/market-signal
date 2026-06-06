import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const runner = read(runnerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "tw_equity_staging_write_fail_closed_runner_skeleton",
  "ready_for_manual_execution_gate_not_executed",
  "runner_skeleton_has_no_supabase_write_implementation",
  "connectionAttempted: false",
  "filesWritten: false",
  "marketDataFetched: false",
  "marketDataIngested: false",
  "mutations: false",
  "publicDataSource: \"mock\"",
  "rowPayloadsPrinted: false",
  "scoreSource: \"mock\"",
  "secretsPrinted: false",
  "serviceRoleKeyPrinted: false",
  "sourcePayloadsPrinted: false",
  "sqlExecuted: false"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging write fail-closed runner skeleton slice",
  "scripts/run-tw-equity-staging-write-once.mjs",
  "tw_equity_staging_write_fail_closed_runner_skeleton",
  "default no Supabase connection, no SQL, no file write, no market-data fetch, no secrets, no source payload output",
  "target relation set is reconciled to canonical staging objects",
  "execution remains blocked because no Supabase write implementation exists"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-staging-write-runner-safety"] !==
  "node scripts/check-tw-equity-staging-write-runner-safety.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-write-runner-safety");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-write-runner-safety.mjs")) {
    problems.push(`${path} missing TW equity staging write runner safety checker`);
  }
  if (!text.includes("tw-equity-staging-write-runner-safety")) {
    problems.push(`${path} missing tw-equity-staging-write-runner-safety name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-write-runner-safety"')) {
  problems.push("review gate core set missing tw-equity-staging-write-runner-safety");
}

for (const pattern of [
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
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u,
  /sb_publishable_/u
]) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden token: ${pattern}`);
}

const dryRun = spawnSync(process.execPath, [
  runnerPath,
  "--authorization-id",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "--lane",
  "tw-equity",
  "--symbols",
  "2330,2382,2308",
  "--sessions",
  "60",
  "--target",
  "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
  "--max-rows",
  "180",
  "--post-run-review",
  "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md"
], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (dryRun.status !== 0) {
  problems.push(`${runnerPath} dry-run exact command exited ${dryRun.status}: ${(dryRun.stderr || dryRun.stdout).trim()}`);
} else {
  validateDryRun(JSON.parse(dryRun.stdout));
}

const executeAttempt = spawnSync(process.execPath, [
  runnerPath,
  "--authorization-id",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "--lane",
  "tw-equity",
  "--symbols",
  "2330,2382,2308",
  "--sessions",
  "60",
  "--target",
  "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
  "--max-rows",
  "180",
  "--post-run-review",
  "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  "--execute"
], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (executeAttempt.status === 0) {
  problems.push(`${runnerPath} --execute must fail closed`);
} else {
  const parsed = JSON.parse(executeAttempt.stdout);
  if (parsed.executionAttempted !== false) problems.push("--execute output must keep executionAttempted false");
  if (!parsed.problems?.includes("runner_skeleton_has_no_supabase_write_implementation")) {
    problems.push("--execute output missing runner skeleton implementation blocker");
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function validateDryRun(report) {
  const expected = {
    canAwardRowCoveragePoints: false,
    canClaimRealDataLive: false,
    canPromotePublicSource: false,
    canSetScoreSourceReal: false,
    connectionAttempted: false,
    exactCommandMatched: true,
    executionAttempted: false,
    executionRequested: false,
    filesWritten: false,
    marketDataFetched: false,
    marketDataIngested: false,
    mutations: false,
    publicDataSource: "mock",
    publicRedistributionBlocked: true,
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    sourcePayloadsPrinted: false,
    sqlExecuted: false,
    status: "ready_for_manual_execution_gate_not_executed",
    targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices"
  };

  for (const [key, value] of Object.entries(expected)) {
    if (report[key] !== value) problems.push(`dry-run ${key} expected ${JSON.stringify(value)} got ${JSON.stringify(report[key])}`);
  }
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}
