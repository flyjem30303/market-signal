import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_SECOND_WRITE_RUNNER_CONTRACT_ALIGNMENT.md";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const checkerPath = "scripts/check-tw-equity-second-write-runner-contract-alignment.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const runner = read(runnerPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Second Write Runner Contract Alignment",
  "tw_equity_second_write_runner_contract_aligned_not_executed",
  "RUNNER_ACCEPTS_AUTH_002_CONTRACT_LOCAL_MOCK_ONLY",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002",
  "CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE",
  "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md",
  "\"connectionAttempted\": false",
  "\"mockSupabaseUsed\": true",
  "\"writtenPriceRows\": 180",
  "mock-only and proves only that the local guarded insert path would be reached",
  "STOP-001 no real Supabase connection occurred",
  "NEXT-SLICE-001 execute exactly one `AUTH-002` bounded staging write retry"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "const ATTEMPT_CONTRACTS = [",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002",
  "CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE",
  "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md",
  "candidateAuthorizationIds",
  "resolveExpected(args)"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity second write runner contract alignment slice",
  "docs/TW_EQUITY_SECOND_WRITE_RUNNER_CONTRACT_ALIGNMENT.md",
  "scripts/check-tw-equity-second-write-runner-contract-alignment.mjs",
  "tw_equity_second_write_runner_contract_aligned_not_executed",
  "runner now accepts the second `AUTH-002` command contract in local mock mode",
  "No real Supabase connection, SQL, write retry, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:tw-equity-second-write-runner-contract-alignment"] !== `node ${checkerPath}`) {
  problems.push("package.json missing check:tw-equity-second-write-runner-contract-alignment");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes(checkerPath)) problems.push(`${pathName} missing second write runner contract alignment checker`);
  if (!text.includes("tw-equity-second-write-runner-contract-alignment")) {
    problems.push(`${pathName} missing tw-equity-second-write-runner-contract-alignment name`);
  }
}

if (!reviewGate.includes('"tw-equity-second-write-runner-contract-alignment"')) {
  problems.push("review gate core set missing tw-equity-second-write-runner-contract-alignment");
}

const mockResult = spawnSync(
  process.execPath,
  [
    runnerPath,
    "--authorization-id",
    "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002",
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
    "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md",
    "--candidate-input",
    "data/candidates/tw-equity-staging-candidate.json",
    "--rollback-dry-run",
    "--execute"
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      TW_EQUITY_STAGING_WRITE_CONFIRMATION: "CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE",
      TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE: "enabled"
    },
    shell: false
  }
);

if (mockResult.status !== 0) {
  problems.push(`${runnerPath} AUTH-002 mock execution must exit 0`);
} else {
  const report = parseJson(mockResult.stdout);
  if (report.authorizationId !== "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002") problems.push("AUTH-002 report authorization mismatch");
  if (report.exactCommandMatched !== true) problems.push("AUTH-002 exact command must match");
  if (report.confirmationPresent !== true) problems.push("AUTH-002 confirmation must be present");
  if (report.candidateInputAccepted !== true) problems.push("AUTH-002 must accept candidate artifact");
  if (report.candidateInputPriceRows !== 180) problems.push("AUTH-002 candidate price rows must be 180");
  if (report.connectionAttempted !== false) problems.push("AUTH-002 mock must not connect remotely");
  if (report.mockSupabaseUsed !== true) problems.push("AUTH-002 must use mock Supabase");
  if (report.writeAttempted !== true) problems.push("AUTH-002 mock must enter write path");
  if (report.writtenRunRows !== 1 || report.writtenPriceRows !== 180) problems.push("AUTH-002 mock written row counts must match candidate");
  if (report.postRunReview !== "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md") {
    problems.push("AUTH-002 post-run review path mismatch");
  }
  if (report.publicDataSource !== "mock" || report.scoreSource !== "mock") problems.push("AUTH-002 must keep mock sources");
  if (report.sqlExecuted !== false || report.secretsPrinted !== false || report.rowPayloadsPrinted !== false) {
    problems.push("AUTH-002 must keep sanitized safety flags false");
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [runnerPath, runner]
]) {
  if (/sb_secret_/u.test(text) || /sb_publishable_/u.test(text)) {
    problems.push(`${pathName} must not contain literal Supabase key material`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("runner output is not valid JSON");
    return {};
  }
}
