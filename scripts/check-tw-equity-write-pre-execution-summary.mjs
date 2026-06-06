import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_WRITE_PRE_EXECUTION_SUMMARY.md";
const validatorPath = "docs/TW_EQUITY_SANITIZED_CANDIDATE_INPUT_VALIDATOR.md";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const validator = read(validatorPath);
const runner = read(runnerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Write Pre-Execution Summary",
  "tw_equity_write_pre_execution_summary_ready_not_mutating",
  "local pre-execution summary for the future TW equity bounded staging write",
  "`writePreExecutionSummary.ready` may be true only when all of these are true",
  "`writePreExecutionSummaryReady`",
  "`writePreExecutionSummary.candidateRunRows`",
  "`writePreExecutionSummary.candidatePriceRows`",
  "`writePreExecutionSummary.rollbackScopeRunId`",
  "`writePreExecutionSummary.postRunReviewRequired=true`",
  "`writePreExecutionSummary.noRetry=true`",
  "`writePreExecutionSummary.blockedUntilSeparateWriteImplementation=true`",
  "`writePreExecutionSummary.writeImplementationReady=false`",
  "`writePreExecutionSummary.connectionPlanned=false`",
  "`writePreExecutionSummary.sqlPlanned=false`",
  "`writePreExecutionSummary.mutationsPlanned=false`",
  "runner still exits blocked in execution mode because `runner_skeleton_has_no_supabase_write_implementation` remains active",
  "No SQL, Supabase connection, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [validatorPath, validator, "tw_equity_sanitized_candidate_input_validator_ready_not_mutating"],
  [runnerPath, runner, "buildWritePreExecutionSummary"],
  [runnerPath, runner, "writePreExecutionSummary"],
  [runnerPath, runner, "writePreExecutionSummaryReady"],
  [runnerPath, runner, "postRunReviewRequired: true"],
  [runnerPath, runner, "noRetry: true"],
  [runnerPath, runner, "destructiveRollbackAllowed: false"],
  [runnerPath, runner, "publicPromotionAllowed: false"],
  [runnerPath, runner, "rowCoveragePointsAllowed: false"],
  [runnerPath, runner, "scoreSourcePromotionAllowed: false"]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity write pre-execution summary slice",
  "docs/TW_EQUITY_WRITE_PRE_EXECUTION_SUMMARY.md",
  "tw_equity_write_pre_execution_summary_ready_not_mutating",
  "runner now emits writePreExecutionSummary and writePreExecutionSummaryReady",
  "ready summary includes candidate counts, rollback scope, post-run review requirement, no retry, and no-promotion locks",
  "summary readiness does not execute Supabase or create a write-capable implementation"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-write-pre-execution-summary"] !==
  "node scripts/check-tw-equity-write-pre-execution-summary.mjs"
) {
  problems.push("package.json missing check:tw-equity-write-pre-execution-summary");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-write-pre-execution-summary.mjs")) {
    problems.push(`${pathName} missing write pre-execution summary checker`);
  }
  if (!text.includes("tw-equity-write-pre-execution-summary")) {
    problems.push(`${pathName} missing tw-equity-write-pre-execution-summary name`);
  }
}

if (!reviewGate.includes('"tw-equity-write-pre-execution-summary"')) {
  problems.push("review gate core set missing tw-equity-write-pre-execution-summary");
}

if (/\bfetch\s*\(/u.test(runner)) problems.push(`${runnerPath} must not fetch market data`);
if (/\bwriteFile/u.test(runner) || /\bappendFile/u.test(runner)) problems.push(`${runnerPath} must not write local artifacts`);
if (/sb_secret_/u.test(runner) || /sb_publishable_/u.test(runner)) problems.push(`${runnerPath} must not contain literal Supabase key material`);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tw-equity-preexec-"));
const candidatePath = path.join(tempDir, "candidate.json");
fs.writeFileSync(candidatePath, JSON.stringify(makeSyntheticCandidate(), null, 2), "utf8");

const validAttempt = runRunner(candidatePath);
if (validAttempt.status !== 0) {
  problems.push(`${runnerPath} valid execution-mode preflight must pass into implementation path`);
} else {
  const parsed = JSON.parse(validAttempt.stdout);
  const summary = parsed.writePreExecutionSummary;
  if (parsed.writePreExecutionSummaryReady !== true) problems.push("valid path must set writePreExecutionSummaryReady true");
  if (summary?.ready !== true) problems.push("valid path summary.ready must be true");
  if (summary?.candidateRunRows !== 1) problems.push("summary candidateRunRows must be 1");
  if (summary?.candidatePriceRows !== 3) problems.push("summary candidatePriceRows must be 3");
  if (summary?.rollbackScopeRunId !== "22222222-2222-4222-8222-222222222222") problems.push("summary rollbackScopeRunId mismatch");
  if (summary?.rollbackScopeTargetRelation !== "staging_twse_stock_day_runs,staging_twse_stock_day_prices") {
    problems.push("summary rollbackScopeTargetRelation mismatch");
  }
  if (summary?.postRunReviewRequired !== true) problems.push("summary postRunReviewRequired must be true");
  if (summary?.noRetry !== true) problems.push("summary noRetry must be true");
  if (summary?.blockedUntilSeparateWriteImplementation !== false) problems.push("summary must no longer be blocked until separate implementation");
  if (summary?.connectionPlanned !== true) problems.push("summary connectionPlanned must be true when all gates pass");
  if (summary?.sqlPlanned !== false) problems.push("summary sqlPlanned must be false");
  if (summary?.mutationsPlanned !== true) problems.push("summary mutationsPlanned must be true when all gates pass");
  if (summary?.destructiveRollbackAllowed !== false) problems.push("summary destructiveRollbackAllowed must be false");
  if (summary?.publicPromotionAllowed !== false) problems.push("summary publicPromotionAllowed must be false");
  if (summary?.rowCoveragePointsAllowed !== false) problems.push("summary rowCoveragePointsAllowed must be false");
  if (summary?.scoreSourcePromotionAllowed !== false) problems.push("summary scoreSourcePromotionAllowed must be false");
  if (parsed.connectionAttempted !== false) problems.push("mocked valid execution path must not attempt remote Supabase connection");
  if (parsed.mockSupabaseUsed !== true) problems.push("valid execution path must use mock Supabase in checker");
  if (parsed.writeAttempted !== true) problems.push("valid execution path must reach write attempt when mocked");
  if (parsed.mutations !== true) problems.push("valid execution path must report staging mutation success when mocked");
  if (parsed.sqlExecuted !== false) problems.push("runner must not execute SQL");
}

const missingCandidateAttempt = runRunner(null);
if (missingCandidateAttempt.status === 0) {
  problems.push(`${runnerPath} missing candidate path must be blocked`);
} else {
  const parsed = JSON.parse(missingCandidateAttempt.stdout);
  if (parsed.writePreExecutionSummaryReady !== false) problems.push("missing candidate must keep writePreExecutionSummaryReady false");
  if (parsed.writePreExecutionSummary?.ready !== false) problems.push("missing candidate summary.ready must be false");
  if (parsed.writePreExecutionSummary?.candidatePriceRows !== 0) problems.push("missing candidate price count must be 0");
}

fs.rmSync(tempDir, { force: true, recursive: true });

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function runRunner(candidatePath) {
  const args = [
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
    "--rollback-dry-run"
  ];
  if (candidatePath) args.push("--candidate-input", candidatePath);
  args.push("--execute");

  return spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
      TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE: "enabled",
      TW_EQUITY_STAGING_WRITE_CONFIRMATION: "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE"
    },
    shell: false
  });
}

function makeSyntheticCandidate() {
  const runId = "22222222-2222-4222-8222-222222222222";
  const startedAt = "2026-06-06T00:00:00.000Z";
  const finishedAt = "2026-06-06T00:01:00.000Z";
  return {
    authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
    targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
    sourceId: "twse-stock-day",
    symbols: ["2330", "2382", "2308"],
    maxRows: 180,
    sourcePayloadIncluded: false,
    sourceUrlPayloadIncluded: false,
    secretsIncluded: false,
    candidateRun: {
      run_id: runId,
      run_type: "staging_candidate",
      source_id: "twse-stock-day",
      source_url_template: "sanitized-template-only",
      license_url: "https://example.invalid/sanitized-license-placeholder",
      attribution_text: "Synthetic validator fixture, not market data.",
      requested_symbol_count: 3,
      requested_month_count: 1,
      successful_month_count: 1,
      failed_month_count: 0,
      total_candidate_row_count: 3,
      zero_row_months: [],
      duplicate_trade_dates: 0,
      missing_required_field_count: 0,
      non_numeric_price_count: 0,
      non_numeric_volume_amount_count: 0,
      source_note_count: 0,
      parser_flag_count: 0,
      http_status_summary: { synthetic: true },
      rate_limit_policy: { synthetic: true },
      started_at: startedAt,
      finished_at: finishedAt,
      created_by: "local-pre-execution-summary",
      review_status: "draft",
      decision: "ready_for_review"
    },
    candidatePrices: ["2330", "2382", "2308"].map((symbol, index) => ({
      run_id: runId,
      source_id: "twse-stock-day",
      exchange_code: "TWSE",
      symbol,
      trade_date: `2026-02-0${index + 1}`,
      open_price: 1 + index,
      high_price: 2 + index,
      low_price: 1 + index,
      close_price: 1.5 + index,
      price_change: 0,
      volume: 1000 + index,
      trade_value: 1000 + index,
      transaction_count: 10 + index,
      note: "synthetic validator fixture, not market data",
      quality_flags: ["synthetic"],
      source_fetched_at: finishedAt,
      source_row_hash: `synthetic-preexec-hash-${symbol}`
    }))
  };
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
