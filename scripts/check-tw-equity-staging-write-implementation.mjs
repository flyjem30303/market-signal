import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_STAGING_WRITE_IMPLEMENTATION.md";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const acceptancePath = "docs/TW_EQUITY_WRITE_IMPLEMENTATION_FINAL_AUTHORIZATION_ACCEPTANCE.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const runner = read(runnerPath);
const acceptance = read(acceptancePath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Staging Write Implementation",
  "tw_equity_staging_write_implementation_ready_not_executed",
  "narrow server-side staging write path",
  "`staging_twse_stock_day_runs`",
  "`staging_twse_stock_day_prices`",
  "The runner remains fail-closed unless all of these are true",
  "rollback dry-run remote count for the candidate run scope is empty",
  "uses dynamic server-side Supabase client creation inside the runner only",
  "does not expose the service role key to client-side code",
  "does not print Supabase URL or key material",
  "does not call update, delete, or upsert",
  "`TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE=enabled` is reserved for local implementation checker coverage",
  "dry-run/no-execute mode never connects or mutates",
  "execute mode without a valid candidate remains blocked without connecting",
  "mocked execute mode reaches the insert path without remote connection",
  "does not execute a real Supabase write",
  "No SQL, real Supabase connection, real Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [acceptancePath, acceptance, "Chairman oral decision: accepted"],
  [runnerPath, runner, "tw_equity_staging_write_fail_closed_write_capable_runner"],
  [runnerPath, runner, "executeBoundedStagingWrite"],
  [runnerPath, runner, "createWriteClient"],
  [runnerPath, runner, "TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE"],
  [runnerPath, runner, "createMockSupabaseClient"],
  [runnerPath, runner, "await import(\"@supabase/supabase-js\")"],
  [runnerPath, runner, ".from(\"staging_twse_stock_day_runs\").insert([candidateInput.candidateRun])"],
  [runnerPath, runner, ".from(\"staging_twse_stock_day_prices\").insert(candidateInput.candidatePrices)"],
  [runnerPath, runner, "rollback_dry_run_scope_not_empty"],
  [runnerPath, runner, "writeImplementationReady: true"]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
}

for (const pattern of [
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /\bfetch\s*\(/u,
  /\bwriteFile/u,
  /\bappendFile/u,
  /sb_secret_/u,
  /sb_publishable_/u
]) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden token: ${pattern}`);
}

for (const phrase of [
  "Latest TW equity staging write implementation slice",
  "docs/TW_EQUITY_STAGING_WRITE_IMPLEMENTATION.md",
  "tw_equity_staging_write_implementation_ready_not_executed",
  "runner is now write-capable only behind exact command, confirmation, candidate input, credentials, and rollback dry-run gates",
  "local checker uses `TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE=enabled` to cover the write path without remote connection",
  "actual bounded write execution is still not performed"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:tw-equity-staging-write-implementation"] !== "node scripts/check-tw-equity-staging-write-implementation.mjs") {
  problems.push("package.json missing check:tw-equity-staging-write-implementation");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-write-implementation.mjs")) {
    problems.push(`${pathName} missing staging write implementation checker`);
  }
  if (!text.includes("tw-equity-staging-write-implementation")) {
    problems.push(`${pathName} missing tw-equity-staging-write-implementation name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-write-implementation"')) {
  problems.push("review gate core set missing tw-equity-staging-write-implementation");
}

const dryRun = runRunner({ candidatePath: null, execute: false, mockSupabase: false });
if (dryRun.status !== 0) {
  problems.push("dry-run no-execute must pass");
} else {
  const parsed = parseJson(dryRun.stdout, "dry-run output");
  if (parsed.connectionAttempted !== false) problems.push("dry-run must not connect");
  if (parsed.writeAttempted !== false) problems.push("dry-run must not write");
  if (parsed.mutations !== false) problems.push("dry-run must not mutate");
  if (parsed.writeImplementationReady !== true) problems.push("dry-run must report implementation ready");
}

const missingCandidate = runRunner({ candidatePath: null, execute: true, mockSupabase: false });
if (missingCandidate.status === 0) {
  problems.push("execute without candidate must be blocked");
} else {
  const parsed = parseJson(missingCandidate.stdout, "missing-candidate output");
  if (parsed.connectionAttempted !== false) problems.push("missing candidate must not connect");
  if (parsed.writeAttempted !== false) problems.push("missing candidate must not write");
  if (parsed.mutations !== false) problems.push("missing candidate must not mutate");
  if (!parsed.problems?.includes("missing_candidate_input_artifact_contract")) {
    problems.push("missing candidate output must include missing_candidate_input_artifact_contract");
  }
}

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tw-equity-write-implementation-"));
try {
  const candidatePath = path.join(tempDir, "candidate.json");
  fs.writeFileSync(candidatePath, JSON.stringify(makeSyntheticCandidate(), null, 2), "utf8");

  const mockedWrite = runRunner({ candidatePath, execute: true, mockSupabase: true });
  if (mockedWrite.status !== 0) {
    problems.push(`mocked write path must pass: ${mockedWrite.stdout}`);
  } else {
    const parsed = parseJson(mockedWrite.stdout, "mocked-write output");
    if (parsed.mockSupabaseUsed !== true) problems.push("mocked write must use mock Supabase");
    if (parsed.connectionAttempted !== false) problems.push("mocked write must not connect remotely");
    if (parsed.writeAttempted !== true) problems.push("mocked write must attempt insert path");
    if (parsed.mutations !== true) problems.push("mocked write must report mutation success");
    if (parsed.writtenRunRows !== 1) problems.push("mocked write must report one run row");
    if (parsed.writtenPriceRows !== 3) problems.push("mocked write must report three price rows");
    if (parsed.sqlExecuted !== false) problems.push("mocked write must not execute SQL");
    if (parsed.secretsPrinted !== false || parsed.rowPayloadsPrinted !== false || parsed.sourcePayloadsPrinted !== false) {
      problems.push("mocked write must keep sanitized output flags false");
    }
    if (parsed.publicDataSource !== "mock" || parsed.scoreSource !== "mock") {
      problems.push("mocked write must keep public and score source mock");
    }
  }
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function runRunner({ candidatePath, execute, mockSupabase }) {
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
  if (execute) args.push("--execute");

  return spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
      TW_EQUITY_STAGING_WRITE_CONFIRMATION: "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
      TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE: mockSupabase ? "enabled" : "disabled"
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
      created_by: "local-implementation-checker",
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
      source_row_hash: `synthetic-implementation-hash-${symbol}`
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
