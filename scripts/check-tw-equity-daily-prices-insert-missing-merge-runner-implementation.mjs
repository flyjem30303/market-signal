import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_RUNNER_IMPLEMENTATION.md";
const authorizationPath = "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_SKIP_EXISTING_MERGE_AUTHORIZATION_PACKET.md";
const runnerPath = "scripts/run-tw-equity-daily-prices-insert-missing-merge-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const authorization = read(authorizationPath);
const runner = read(runnerPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "Status: `tw_equity_daily_prices_insert_missing_merge_runner_implemented_not_executed`",
  "TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001",
  "insert_missing_skip_existing_no_overwrite",
  "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE",
  "TW_EQUITY_DAILY_PRICES_MERGE_MOCK_SUPABASE=enabled",
  "Expected insert rows: `177`",
  "Expected skip rows: `3`",
  "Expected final target rows: `180`",
  "The only permitted mutation is `.insert()` into `daily_prices`",
  "`.update()`",
  "`.upsert()`",
  "`.delete()`",
  "This implementation slice does not execute real Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `tw_equity_daily_prices_insert_missing_skip_existing_merge_authorization_ready_not_executed`",
  "expected inserted rows: `177`",
  "expected skipped existing rows: `3`",
  "expected final target rows for the accepted 3-symbol x 60-session scope: `180`",
  "Never update, overwrite, upsert, or delete production rows in this policy"
]) {
  if (!authorization.includes(phrase)) problems.push(`${authorizationPath} missing: ${phrase}`);
}

for (const phrase of [
  "EXPECTED = {",
  "TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001",
  "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE",
  "TW_EQUITY_DAILY_PRICES_MERGE_CONFIRMATION",
  "TW_EQUITY_DAILY_PRICES_MERGE_MOCK_SUPABASE",
  "executeBoundedInsertMissingMerge",
  "countExactExistingRow",
  "toDailyPriceInsertRow",
  ".from(\"daily_prices\").insert",
  "insert_missing_merge_passed_readback_complete",
  "insert_row_count_mismatch",
  "skip_row_count_mismatch",
  "post_write_readback_count_mismatch",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "sqlExecuted: false",
  "stockIdsPrinted: false"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const pattern of [
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /\bfetch\s*\(/u,
  /sb_secret_/u,
  /sb_publishable_/u
]) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden token: ${pattern}`);
}

if (
  pkg.scripts?.["check:tw-equity-daily-prices-insert-missing-merge-runner-implementation"] !==
  "node scripts/check-tw-equity-daily-prices-insert-missing-merge-runner-implementation.mjs"
) {
  problems.push(`${packagePath} missing check:tw-equity-daily-prices-insert-missing-merge-runner-implementation`);
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-daily-prices-insert-missing-merge-runner-implementation.mjs")) {
    problems.push(`${pathName} missing insert-missing merge runner checker command`);
  }
  if (!text.includes("tw-equity-daily-prices-insert-missing-merge-runner-implementation")) {
    problems.push(`${pathName} missing insert-missing merge runner checker name`);
  }
}

if (!reviewGate.includes('"tw-equity-daily-prices-insert-missing-merge-runner-implementation"')) {
  problems.push("review gate core set missing tw-equity-daily-prices-insert-missing-merge-runner-implementation");
}

for (const phrase of [
  "Latest TW equity daily_prices insert-missing merge runner implementation slice",
  "docs/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_RUNNER_IMPLEMENTATION.md",
  "scripts/run-tw-equity-daily-prices-insert-missing-merge-once.mjs",
  "scripts/check-tw-equity-daily-prices-insert-missing-merge-runner-implementation.mjs",
  "tw_equity_daily_prices_insert_missing_merge_runner_implemented_not_executed"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

const reviewPath = "docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_CHECKER_MOCK.md";
const exactArgs = [
  runnerPath,
  "--authorization-id",
  "TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001",
  "--staging-scope",
  "AUTH-003",
  "--policy-id",
  "insert_missing_skip_existing_no_overwrite",
  "--candidate-input",
  "data/candidates/tw-equity-staging-candidate.json",
  "--post-run-review",
  reviewPath,
  "--confirm-bounded-daily-prices-merge"
];

const noExecute = runRunner(exactArgs, {});
if (noExecute.status !== 0) {
  problems.push(`no-execute exact command must pass: ${noExecute.stdout || noExecute.stderr}`);
} else {
  const parsed = parseJson(noExecute.stdout, "no-execute output");
  if (parsed.status !== "ready_for_manual_execution_gate_not_executed") problems.push("no-execute status mismatch");
  if (parsed.connectionAttempted !== false) problems.push("no-execute must not connect");
  if (parsed.writeAttempted !== false) problems.push("no-execute must not write");
  if (parsed.localPreflightReady !== false) problems.push("no-execute must not be ready without confirmation env");
}

const blockedExecute = runRunner([...exactArgs, "--execute"], {});
if (blockedExecute.status === 0) {
  problems.push("execute without confirmation env must fail closed");
} else {
  const parsed = parseJson(blockedExecute.stdout, "blocked-execute output");
  if (parsed.connectionAttempted !== false) problems.push("blocked execute must not connect");
  if (parsed.writeAttempted !== false) problems.push("blocked execute must not write");
  if (!parsed.problems?.includes("missing_bounded_daily_prices_merge_confirmation")) {
    problems.push("blocked execute must report missing confirmation");
  }
}

try {
  if (fs.existsSync(reviewPath)) fs.rmSync(reviewPath, { force: true });
  const mockedExecute = runRunner([...exactArgs, "--execute"], {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
    TW_EQUITY_DAILY_PRICES_MERGE_CONFIRMATION: "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE",
    TW_EQUITY_DAILY_PRICES_MERGE_MOCK_SUPABASE: "enabled"
  });
  if (mockedExecute.status !== 0) {
    problems.push(`mocked execute must pass: ${mockedExecute.stdout || mockedExecute.stderr}`);
  } else {
    const parsed = parseJson(mockedExecute.stdout, "mocked-execute output");
    if (parsed.status !== "insert_missing_merge_passed_readback_complete") problems.push("mocked execute status mismatch");
    if (parsed.insertedRows !== 177) problems.push("mocked execute inserted rows mismatch");
    if (parsed.skippedExistingRows !== 3) problems.push("mocked execute skipped rows mismatch");
    if (parsed.finalTargetRowsAfterWrite !== 180) problems.push("mocked execute readback mismatch");
    if (parsed.connectionAttempted !== false) problems.push("mocked execute must not connect remotely");
    if (parsed.mockSupabaseUsed !== true) problems.push("mocked execute must use mock Supabase");
    if (parsed.postRunReviewWritten !== true) problems.push("mocked execute must write temporary post-run review");
    if (!fs.existsSync(reviewPath)) problems.push("mocked execute review path missing");
    if (parsed.sqlExecuted !== false || parsed.supabaseWriteAttempted !== true || parsed.mutations !== true) {
      problems.push("mocked execute write flags mismatch");
    }
    if (parsed.publicDataSource !== "mock" || parsed.scoreSource !== "mock") problems.push("mocked execute must keep mock runtime");
  }
} finally {
  if (fs.existsSync(reviewPath)) fs.rmSync(reviewPath, { force: true });
}

const conflictReviewPath = "docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_CHECKER_MOCK_CONFLICT.md";
try {
  if (fs.existsSync(conflictReviewPath)) fs.rmSync(conflictReviewPath, { force: true });
  const mockedConflict = runRunner(
    [...exactArgs.slice(0, -2), conflictReviewPath, "--confirm-bounded-daily-prices-merge", "--execute"],
    {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
      TW_EQUITY_DAILY_PRICES_MERGE_CONFIRMATION: "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE",
      TW_EQUITY_DAILY_PRICES_MERGE_MOCK_MODE: "conflict",
      TW_EQUITY_DAILY_PRICES_MERGE_MOCK_SUPABASE: "enabled"
    }
  );
  if (mockedConflict.status === 0) {
    problems.push("mocked conflict must fail closed");
  } else {
    const parsed = parseJson(mockedConflict.stdout, "mocked-conflict output");
    if (parsed.status !== "blocked") problems.push("mocked conflict status mismatch");
    if (!parsed.problems?.includes("conflicting_existing_rows_detected")) {
      problems.push("mocked conflict must report conflict");
    }
    if (parsed.writeAttempted !== false || parsed.mutations !== false) {
      problems.push("mocked conflict must not write");
    }
    if (parsed.postRunReviewWritten !== true) problems.push("mocked conflict must write temporary post-run review");
    if (!fs.existsSync(conflictReviewPath)) problems.push("mocked conflict review path missing");
  }
} finally {
  if (fs.existsSync(conflictReviewPath)) fs.rmSync(conflictReviewPath, { force: true });
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
