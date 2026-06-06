import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_RUNNER.md";
const policyPath = "docs/TW_EQUITY_DAILY_PRICES_EXISTING_TARGET_OVERLAP_POLICY.md";
const postRunReviewPath = "docs/reviews/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const runnerPath = "scripts/run-tw-equity-daily-prices-overlap-classification-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const policy = read(policyPath);
const postRunReview = read(postRunReviewPath);
const runner = read(runnerPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "Status: `tw_equity_daily_prices_overlap_classification_executed_idempotent_safe_partial_overlap`",
  "TW-EQUITY-DAILY-PRICES-OVERLAP-CLASSIFY-2026-06-07-AUTH-001",
  "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_ONCE",
  "TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_MOCK_SUPABASE=enabled",
  "`idempotent_safe_partial_overlap_skip_existing_insert_missing`",
  "`blocked_conflicting_overlap_requires_reconciliation`",
  "Existing overlap rows: `3`",
  "Exact value match rows: `3`",
  "Conflicting overlap rows: `0`",
  "Missing insert candidate rows: `177`",
  "Passing classification does not authorize production merge",
  "`publicDataSource`: `mock`",
  "`scoreSource`: `mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `overlap_classification_passed_idempotent_safe_partial_overlap`",
  "Classification: `idempotent_safe_partial_overlap_skip_existing_insert_missing`",
  "`existing_overlap_count`: observed=`3`, expected=`3`",
  "`exact_value_match_count`: observed=`3`, expected=`3`",
  "`conflicting_overlap_count`: observed=`0`, expected=`0`",
  "`missing_insert_candidate_count`: observed=`177`, expected=`177`",
  "Production merge authorized: `false`",
  "Row coverage points awarded: `false`",
  "Public runtime state: `mock`",
  "Score runtime state: `mock`"
]) {
  if (!postRunReview.includes(phrase)) problems.push(`${postRunReviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "Create a bounded readonly overlap-classification runner",
  "A future merge runner must be idempotent",
  "A future overlap classifier must not print stock ids"
]) {
  if (!policy.includes(phrase)) problems.push(`${policyPath} missing: ${phrase}`);
}

for (const phrase of [
  "EXPECTED = {",
  "TW-EQUITY-DAILY-PRICES-OVERLAP-CLASSIFY-2026-06-07-AUTH-001",
  "TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_CONFIRMATION",
  "executeBoundedReadonlyOverlapClassification",
  "countExactValueMatchesForRows",
  "idempotent_safe_partial_overlap_skip_existing_insert_missing",
  "blocked_conflicting_overlap_requires_reconciliation",
  "writePostRunReview",
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

if (
  pkg.scripts?.["check:tw-equity-daily-prices-overlap-classification-runner"] !==
  "node scripts/check-tw-equity-daily-prices-overlap-classification-runner.mjs"
) {
  problems.push(`${packagePath} missing check:tw-equity-daily-prices-overlap-classification-runner`);
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-daily-prices-overlap-classification-runner.mjs")) {
    problems.push(`${pathName} missing overlap classification runner checker command`);
  }
  if (!text.includes("tw-equity-daily-prices-overlap-classification-runner")) {
    problems.push(`${pathName} missing overlap classification runner checker name`);
  }
}

if (!reviewGate.includes('"tw-equity-daily-prices-overlap-classification-runner"')) {
  problems.push("review gate core set missing tw-equity-daily-prices-overlap-classification-runner");
}

for (const phrase of [
  "Latest TW equity daily_prices overlap classification runner slice",
  "docs/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_RUNNER.md",
  "docs/reviews/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_POST_RUN_REVIEW_2026-06-07.md",
  "scripts/run-tw-equity-daily-prices-overlap-classification-once.mjs",
  "scripts/check-tw-equity-daily-prices-overlap-classification-runner.mjs",
  "tw_equity_daily_prices_overlap_classification_executed_idempotent_safe_partial_overlap",
  "`3` existing overlap rows",
  "`3` exact value matches",
  "`0` conflicting overlaps",
  "`177` missing insert candidates",
  "separate insert-missing/skip-existing production merge authorization packet only"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

const reviewPath = "docs/reviews/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_POST_RUN_REVIEW_CHECKER_MOCK.md";
const exactArgs = [
  runnerPath,
  "--authorization-id",
  "TW-EQUITY-DAILY-PRICES-OVERLAP-CLASSIFY-2026-06-07-AUTH-001",
  "--staging-scope",
  "AUTH-003",
  "--candidate-input",
  "data/candidates/tw-equity-staging-candidate.json",
  "--post-run-review",
  reviewPath,
  "--confirm-bounded-readonly-overlap-classification"
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
}

const blockedExecute = runRunner([...exactArgs, "--execute"], {});
if (blockedExecute.status === 0) {
  problems.push("execute without confirmation env must fail closed");
} else {
  const parsed = parseJson(blockedExecute.stdout, "blocked-execute output");
  if (parsed.connectionAttempted !== false) problems.push("blocked execute must not connect");
  if (!parsed.problems?.includes("missing_bounded_readonly_overlap_classification_confirmation")) {
    problems.push("blocked execute must report missing confirmation");
  }
}

try {
  if (fs.existsSync(reviewPath)) fs.rmSync(reviewPath, { force: true });
  const mockedExecute = runRunner([...exactArgs, "--execute"], {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
    TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_CONFIRMATION:
      "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_ONCE",
    TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_MOCK_SUPABASE: "enabled"
  });
  if (mockedExecute.status !== 0) {
    problems.push(`mocked execute must pass: ${mockedExecute.stdout || mockedExecute.stderr}`);
  } else {
    const parsed = parseJson(mockedExecute.stdout, "mocked-execute output");
    if (parsed.status !== "overlap_classification_passed_idempotent_safe_partial_overlap") {
      problems.push("mocked execute status mismatch");
    }
    if (parsed.classification !== "idempotent_safe_partial_overlap_skip_existing_insert_missing") {
      problems.push("mocked execute classification mismatch");
    }
    if (parsed.connectionAttempted !== false) problems.push("mocked execute must not connect remotely");
    if (parsed.mockSupabaseUsed !== true) problems.push("mocked execute must use mock Supabase");
    if (parsed.postRunReviewWritten !== true) problems.push("mocked execute must write temporary post-run review");
    if (!fs.existsSync(reviewPath)) problems.push("mocked execute review path missing");
    if (parsed.sqlExecuted !== false || parsed.supabaseWriteAttempted !== false || parsed.mutations !== false) {
      problems.push("mocked execute must keep SQL/write/mutation flags false");
    }
    if (parsed.perSymbolAggregateCounts?.length !== 3) problems.push("mocked execute must emit three per-symbol counts");
  }
} finally {
  if (fs.existsSync(reviewPath)) fs.rmSync(reviewPath, { force: true });
}

const conflictReviewPath =
  "docs/reviews/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_POST_RUN_REVIEW_CHECKER_MOCK_CONFLICT.md";
try {
  if (fs.existsSync(conflictReviewPath)) fs.rmSync(conflictReviewPath, { force: true });
  const mockedConflictExecute = runRunner(
    [...exactArgs.slice(0, -2), conflictReviewPath, "--confirm-bounded-readonly-overlap-classification", "--execute"],
    {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
      TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_CONFIRMATION:
        "CEO_APPROVED_TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_ONCE",
      TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_MOCK_OVERLAP_MODE: "conflict",
      TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_MOCK_SUPABASE: "enabled"
    }
  );
  if (mockedConflictExecute.status === 0) {
    problems.push("mocked conflict execute must fail closed");
  } else {
    const parsed = parseJson(mockedConflictExecute.stdout, "mocked-conflict-execute output");
    if (parsed.status !== "blocked") problems.push("mocked conflict status mismatch");
    if (parsed.classification !== "blocked_conflicting_overlap_requires_reconciliation") {
      problems.push("mocked conflict classification mismatch");
    }
    if (!parsed.problems?.includes("conflicting_overlap_count_nonzero")) {
      problems.push("mocked conflict must report conflicting overlap");
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
