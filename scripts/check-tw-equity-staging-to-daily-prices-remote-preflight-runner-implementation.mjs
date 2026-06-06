import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_RUNNER_IMPLEMENTATION.md";
const runnerPath = "scripts/run-tw-equity-staging-to-daily-prices-remote-preflight-once.mjs";
const authorizationPath = "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_AUTHORIZATION_PACKET.md";
const authReportPath = "scripts/report-tw-equity-staging-to-daily-prices-remote-preflight-authorization.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const runner = read(runnerPath);
const authorization = read(authorizationPath);
const authReport = read(authReportPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Staging To Daily Prices Remote Preflight Runner Implementation",
  "tw_equity_staging_to_daily_prices_remote_preflight_runner_implemented_not_executed",
  "scripts/run-tw-equity-staging-to-daily-prices-remote-preflight-once.mjs",
  "TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001",
  "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_PREFLIGHT_ONCE",
  "TW_EQUITY_DAILY_PRICES_PREFLIGHT_MOCK_SUPABASE=enabled",
  "ready_for_manual_execution_gate_not_executed",
  "Execute mode without confirmation or credentials returns `blocked` without connecting",
  "remote_preflight_passed_merge_still_requires_separate_authorization",
  "writes the named post-run review artifact immediately",
  "cannot directly:",
  "award row coverage points",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "EXPECTED = {",
  "TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001",
  "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_PREFLIGHT_ONCE",
  "TW_EQUITY_DAILY_PRICES_PREFLIGHT_CONFIRMATION",
  "TW_EQUITY_DAILY_PRICES_PREFLIGHT_MOCK_SUPABASE",
  "validateCommandContract",
  "executeBoundedReadonlyPreflight",
  "createReadonlyClient",
  "createMockSupabaseClient",
  "writePostRunReview",
  "ready_for_manual_execution_gate_not_executed",
  "remote_preflight_passed_merge_still_requires_separate_authorization",
  "remote_preflight_blocked_existing_daily_prices_target_rows",
  "canAwardRowCoveragePoints: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "sqlExecuted: false",
  "supabaseWriteAttempted: false",
  "mutations: false",
  "stockIdsPrinted: false"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const pattern of [
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /\bfetch\s*\(/u,
  /sb_secret_/u,
  /sb_publishable_/u
]) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden token: ${pattern}`);
}

for (const phrase of [
  "Required command status: `implemented_fail_closed_not_executed`",
  "A later runner may execute only after this implementation checker proves the command exists and fail-closed behavior is active"
]) {
  if (!authorization.includes(phrase)) problems.push(`${authorizationPath} missing: ${phrase}`);
}

for (const phrase of [
  "requiredCommandStatus: \"implemented_fail_closed_not_executed\"",
  "runnerImplementedNow: true",
  "separateRunnerImplementationGateRequired: false"
]) {
  if (!authReport.includes(phrase)) problems.push(`${authReportPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging-to-daily_prices remote preflight runner implementation slice",
  "docs/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_RUNNER_IMPLEMENTATION.md",
  "scripts/run-tw-equity-staging-to-daily-prices-remote-preflight-once.mjs",
  "scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation.mjs",
  "tw_equity_staging_to_daily_prices_remote_preflight_runner_implemented_not_executed",
  "implements the fail-closed bounded readonly aggregate-count runner",
  "mock execution proves the aggregate-count path without a real remote connection",
  "No real Supabase connection, SQL, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation"] !==
  "node scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation.mjs")) {
    problems.push(`${pathName} missing TW equity remote preflight runner implementation checker`);
  }
  if (!text.includes("tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation")) {
    problems.push(`${pathName} missing tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation"')) {
  problems.push("review gate core set missing tw-equity-staging-to-daily-prices-remote-preflight-runner-implementation");
}

const reviewPath = "docs/reviews/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_POST_RUN_REVIEW_CHECKER_MOCK.md";
const exactArgs = [
  runnerPath,
  "--authorization-id",
  "TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001",
  "--staging-scope",
  "AUTH-003",
  "--candidate-input",
  "data/candidates/tw-equity-staging-candidate.json",
  "--post-run-review",
  reviewPath,
  "--confirm-bounded-readonly-preflight"
];

const noExecute = runRunner(exactArgs, {});
if (noExecute.status !== 0) {
  problems.push(`no-execute exact command must pass: ${noExecute.stdout || noExecute.stderr}`);
} else {
  const parsed = parseJson(noExecute.stdout, "no-execute output");
  if (parsed.status !== "ready_for_manual_execution_gate_not_executed") problems.push("no-execute status mismatch");
  if (parsed.connectionAttempted !== false) problems.push("no-execute must not connect");
  if (parsed.executionAttempted !== false) problems.push("no-execute must not attempt remote");
  if (parsed.localPreflightReady !== false) problems.push("no-execute must not be ready without confirmation env");
  if (parsed.publicDataSource !== "mock" || parsed.scoreSource !== "mock") problems.push("no-execute must keep mock sources");
}

const blockedExecute = runRunner([...exactArgs, "--execute"], {});
if (blockedExecute.status === 0) {
  problems.push("execute without confirmation env must fail closed");
} else {
  const parsed = parseJson(blockedExecute.stdout, "blocked-execute output");
  if (parsed.connectionAttempted !== false) problems.push("blocked execute must not connect");
  if (!parsed.problems?.includes("missing_bounded_readonly_preflight_confirmation")) {
    problems.push("blocked execute must report missing confirmation");
  }
}

try {
  if (fs.existsSync(reviewPath)) fs.rmSync(reviewPath, { force: true });
  const mockedExecute = runRunner([...exactArgs, "--execute"], {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
    TW_EQUITY_DAILY_PRICES_PREFLIGHT_CONFIRMATION: "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_PREFLIGHT_ONCE",
    TW_EQUITY_DAILY_PRICES_PREFLIGHT_MOCK_SUPABASE: "enabled"
  });
  if (mockedExecute.status !== 0) {
    problems.push(`mocked execute must pass: ${mockedExecute.stdout || mockedExecute.stderr}`);
  } else {
    const parsed = parseJson(mockedExecute.stdout, "mocked-execute output");
    if (parsed.status !== "remote_preflight_passed_merge_still_requires_separate_authorization") {
      problems.push("mocked execute status mismatch");
    }
    if (parsed.connectionAttempted !== false) problems.push("mocked execute must not connect remotely");
    if (parsed.mockSupabaseUsed !== true) problems.push("mocked execute must use mock Supabase");
    if (parsed.postRunReviewWritten !== true) problems.push("mocked execute must write temporary post-run review");
    if (!fs.existsSync(reviewPath)) problems.push("mocked execute review path missing");
    if (parsed.sqlExecuted !== false || parsed.supabaseWriteAttempted !== false || parsed.mutations !== false) {
      problems.push("mocked execute must keep SQL/write/mutation flags false");
    }
    if (parsed.aggregateCounts?.length !== 8) problems.push("mocked execute must emit eight aggregate counts");
  }
} finally {
  if (fs.existsSync(reviewPath)) fs.rmSync(reviewPath, { force: true });
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function runRunner(args, extraEnv) {
  return spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      ...extraEnv
    },
    shell: false
  });
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
