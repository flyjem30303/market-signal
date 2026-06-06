import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_SANITIZED_CANDIDATE_INPUT_VALIDATOR.md";
const boundaryPath = "docs/TW_EQUITY_WRITE_IMPLEMENTATION_DESIGN_TO_CODE_BOUNDARY.md";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
const boundary = read(boundaryPath);
const runner = read(runnerPath);
const writeImplementationCreated = runner.includes("tw_equity_staging_write_fail_closed_write_capable_runner");
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "TW Equity Sanitized Candidate Input Validator",
  "tw_equity_sanitized_candidate_input_validator_ready_not_mutating",
  "local validator for the future TW equity staging write candidate input artifact",
  "does not create the candidate artifact",
  "sourcePayloadIncluded=false",
  "sourceUrlPayloadIncluded=false",
  "secretsIncluded=false",
  "`rawSourcePayload`",
  "`candidateRun` must be normalized to `staging_twse_stock_day_runs` field names",
  "`candidatePrices` must be normalized to `staging_twse_stock_day_prices` field names",
  "`candidateInputAccepted=true`",
  "`rollbackDryRunCountReady=true` only when `--rollback-dry-run` is also present",
  "`writeImplementationReady=false`",
  "No SQL, Supabase connection, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [boundaryPath, boundary, "Candidate Input Artifact Contract"],
  [runnerPath, runner, "validateCandidateInputArtifact"],
  [runnerPath, runner, "candidateInputPriceRows"],
  [runnerPath, runner, "candidateInputRunRows"],
  [runnerPath, runner, "candidate_input_artifact_contract_invalid"],
  [runnerPath, runner, "candidate_forbidden_top_level_key_"],
  [runnerPath, runner, "candidate_prices_empty"],
  [runnerPath, runner, "rollbackDryRunCandidatePriceRows"],
  [runnerPath, runner, "rollbackDryRunCandidateRunRows"],
  [runnerPath, runner, writeImplementationCreated ? "writeImplementationReady: true" : "writeImplementationReady: false"],
  [runnerPath, runner, "sourcePayloadsPrinted: false"],
  [runnerPath, runner, "rowPayloadsPrinted: false"],
  [runnerPath, runner, "secretsPrinted: false"]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity sanitized candidate input validator slice",
  "docs/TW_EQUITY_SANITIZED_CANDIDATE_INPUT_VALIDATOR.md",
  "tw_equity_sanitized_candidate_input_validator_ready_not_mutating",
  "runner validates sanitized candidate input JSON artifacts locally",
  "accepted candidate input only unlocks rollback dry-run counts, not Supabase mutation",
  "no candidate artifact, raw market data, SQL, Supabase write, staging rows, public promotion, row coverage points, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-sanitized-candidate-input-validator"] !==
  "node scripts/check-tw-equity-sanitized-candidate-input-validator.mjs"
) {
  problems.push("package.json missing check:tw-equity-sanitized-candidate-input-validator");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-sanitized-candidate-input-validator.mjs")) {
    problems.push(`${pathName} missing sanitized candidate input validator checker`);
  }
  if (!text.includes("tw-equity-sanitized-candidate-input-validator")) {
    problems.push(`${pathName} missing tw-equity-sanitized-candidate-input-validator name`);
  }
}

if (!reviewGate.includes('"tw-equity-sanitized-candidate-input-validator"')) {
  problems.push("review gate core set missing tw-equity-sanitized-candidate-input-validator");
}

const forbiddenPatterns = writeImplementationCreated
  ? [
      /\.update\(/u,
      /\.delete\(/u,
      /\.upsert\(/u,
      /\bfetch\s*\(/u,
      /\bwriteFile/u,
      /\bappendFile/u,
      /sb_secret_/u,
      /sb_publishable_/u
    ]
  : [
      /@supabase\/supabase-js/u,
      /createClient/u,
      /\.from\(/u,
      /\.insert\(/u,
      /\.update\(/u,
      /\.delete\(/u,
      /\.upsert\(/u,
      /\bfetch\s*\(/u,
      /\bwriteFile/u,
      /\bappendFile/u,
      /sb_secret_/u,
      /sb_publishable_/u
    ];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(runner)) problems.push(`${runnerPath} contains forbidden write-capable token: ${pattern}`);
}

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tw-equity-candidate-"));
const validCandidatePath = path.join(tempDir, "valid-candidate.json");
const invalidCandidatePath = path.join(tempDir, "invalid-candidate.json");

fs.writeFileSync(validCandidatePath, JSON.stringify(makeSyntheticCandidate(), null, 2), "utf8");
fs.writeFileSync(invalidCandidatePath, JSON.stringify({ rawSourcePayload: "blocked" }, null, 2), "utf8");

const validAttempt = runRunner(validCandidatePath);
if (validAttempt.status !== 0 && writeImplementationCreated) {
  problems.push(`${runnerPath} with valid candidate must pass mocked write implementation path`);
} else if (validAttempt.status === 0 && !writeImplementationCreated) {
  problems.push(`${runnerPath} with valid candidate must still remain blocked because write implementation is absent`);
} else {
  const parsed = JSON.parse(validAttempt.stdout);
  if (parsed.candidateInputAccepted !== true) problems.push("valid candidate must set candidateInputAccepted true");
  if (parsed.candidateInputRunRows !== 1) problems.push("valid candidate must expose one candidate run row");
  if (parsed.candidateInputPriceRows !== 3) problems.push("valid candidate must expose three candidate price rows");
  if (parsed.rollbackDryRunCountReady !== true) problems.push("valid candidate with rollback dry-run must set rollbackDryRunCountReady true");
  if (parsed.rollbackDryRunCandidateRunRows !== 1) problems.push("valid candidate must expose rollback run count");
  if (parsed.rollbackDryRunCandidatePriceRows !== 3) problems.push("valid candidate must expose rollback price count");
  if (parsed.connectionAttempted !== false) problems.push("valid candidate checker path must not attempt remote connection");
  if (parsed.mutations !== writeImplementationCreated) {
    problems.push(`valid candidate mutations expected ${writeImplementationCreated}`);
  }
  if (parsed.sqlExecuted !== false) problems.push("valid candidate must not execute SQL");
  if (parsed.sourcePayloadsPrinted !== false) problems.push("valid candidate must not print source payloads");
  if (parsed.rowPayloadsPrinted !== false) problems.push("valid candidate must not print row payloads");
  if (!writeImplementationCreated && !parsed.problems?.includes("runner_skeleton_has_no_supabase_write_implementation")) {
    problems.push("valid candidate output missing runner skeleton implementation blocker");
  }
  if (writeImplementationCreated && parsed.mockSupabaseUsed !== true) problems.push("valid candidate checker path must use mock Supabase");
}

const invalidAttempt = runRunner(invalidCandidatePath);
if (invalidAttempt.status === 0) {
  problems.push(`${runnerPath} with invalid candidate must be blocked`);
} else {
  const parsed = JSON.parse(invalidAttempt.stdout);
  if (parsed.candidateInputAccepted !== false) problems.push("invalid candidate must set candidateInputAccepted false");
  if (!parsed.problems?.includes("candidate_input_artifact_contract_invalid")) {
    problems.push("invalid candidate output missing candidate_input_artifact_contract_invalid");
  }
  if (!parsed.problems?.some((problem) => problem.startsWith("candidate_forbidden_top_level_key_"))) {
    problems.push("invalid candidate output missing forbidden key blocker");
  }
  if (parsed.connectionAttempted !== false) problems.push("invalid candidate must not attempt connection");
  if (parsed.mutations !== false) problems.push("invalid candidate must not mutate");
}

fs.rmSync(tempDir, { force: true, recursive: true });

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function runRunner(candidatePath) {
  return spawnSync(process.execPath, [
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
    "--rollback-dry-run",
    "--candidate-input",
    candidatePath,
    "--execute"
  ], {
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
  const runId = "11111111-1111-4111-8111-111111111111";
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
      created_by: "local-validator",
      review_status: "draft",
      decision: "ready_for_review"
    },
    candidatePrices: ["2330", "2382", "2308"].map((symbol, index) => ({
      run_id: runId,
      source_id: "twse-stock-day",
      exchange_code: "TWSE",
      symbol,
      trade_date: `2026-01-0${index + 1}`,
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
      source_row_hash: `synthetic-hash-${symbol}`
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
