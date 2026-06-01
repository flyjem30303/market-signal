import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_SECOND_ATTEMPT_FINAL_LOCAL_PREFLIGHT_2026-06-01.md";
const queryReviewPath = "docs/reviews/CP3_ROW_COVERAGE_QUERY_CONTRACT_REVISION_IMPLEMENTATION_REVIEW_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const guardedCheckerPath = "scripts/check-row-coverage-readonly-guarded-runner.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const queryReview = readFileSync(queryReviewPath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const guardedChecker = readFileSync(guardedCheckerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Second Attempt Final Local Preflight",
  "CP3 row coverage second attempt final local preflight recorded",
  "SECOND_ATTEMPT_LOCALLY_READY_REMOTE_EXECUTION_STILL_PAUSED",
  "does not run the confirmed command",
  "does not set the confirmation environment variable",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not write staging rows",
  "does not write `daily_prices`",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not print secrets",
  "does not output row payloads",
  "does not print `stock_id` values",
  "does not set `scoreSource=real`",
  "does not award row coverage points",
  "does not approve public claims",
  "STATE-001 publicDataSource remains mock",
  "STATE-002 scoreSource remains mock",
  "STATE-003 CP3 remains not_ready",
  "STATE-007 second row coverage remote attempt has not executed in this slice",
  "STATE-008 Git backup remains paused under current instruction",
  "QUERY-001 runner resolves stocks.symbol to stocks.id before counting daily_prices",
  "QUERY-002 runner queries stocks with .select(\"id, symbol\")",
  "QUERY-003 runner filters stocks with .in(\"symbol\", ALLOWED_SYMBOLS)",
  "QUERY-004 runner counts daily_prices with .select(\"stock_id\", { count: \"exact\", head: true })",
  "QUERY-005 runner filters daily_prices with .eq(\"stock_id\", stockId)",
  "QUERY-006 runner must not count daily_prices by symbol",
  "QUERY-007 runner must not filter daily_prices with .eq(\"symbol\", symbol)",
  "QUERY-008 stock_id values remain internal and hidden from output",
  "ATTEMPT-001 future execution must use ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION exactly",
  "ATTEMPT-003 future execution must run at most once",
  "ATTEMPT-004 future execution must not be launched through scripts/check-review-gates.mjs",
  "ATTEMPT-009 future execution must be followed immediately by a sanitized post-run review",
  "ATTEMPT-010 future execution remains paused until explicit active approval",
  "CEO-FINDING-001 local preparation is sufficient",
  "CEO-FINDING-002 the next meaningful business move is one controlled readonly attempt",
  "PM-FINDING-001 this packet gives a clear go/no-go checkpoint",
  "ENGINEERING-FINDING-001 query contract is now aligned with local schema evidence",
  "SECURITY-FINDING-001 output remains aggregate and sanitized",
  "scripts/check-row-coverage-second-attempt-final-local-preflight.mjs passes",
  "scripts/check-row-coverage-query-contract-revision-implementation-review.mjs passes",
  "scripts/check-row-coverage-readonly-guarded-runner.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "no second remote attempt occurs",
  "SQL execution remains blocked",
  "Supabase writes remain blocked",
  "NEXT-DECISION-001 if the user returns and asks for Supabase readonly attempt, report this preflight first",
  "NEXT-DECISION-003 after execution, immediately create post-run review before any readiness or scoring change",
  "NEXT-DECISION-004 keep public data source mock until a separate runtime activation gate accepts evidence",
  "NEXT-DECISION-005 keep scoreSource mock until a separate score-source gate accepts evidence"
];

const evidencePhrases = [
  {
    content: queryReview,
    file: queryReviewPath,
    phrase: "LOCAL_QUERY_CONTRACT_FIX_ACCEPTED_SECOND_REMOTE_ATTEMPT_STILL_BLOCKED"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".select(\"id, symbol\")"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".in(\"symbol\", ALLOWED_SYMBOLS)"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".select(\"stock_id\", { count: \"exact\", head: true })"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".eq(\"stock_id\", stockId)"
  },
  {
    content: guardedChecker,
    file: guardedCheckerPath,
    phrase: "runner must not count daily_prices by symbol"
  },
  {
    content: guardedChecker,
    file: guardedCheckerPath,
    phrase: "runner must count daily_prices by stock_id"
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-second-attempt-final-local-preflight.mjs"
  }
];

const forbiddenPhrases = [
  "RUN_CONFIRMED_COMMAND_NOW",
  "EXECUTION_COMPLETED",
  "SQL execution is approved",
  "Supabase writes are approved",
  "scoreSource=real approved",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW",
  "public claims are approved",
  "stock_id values printed",
  "raw rows copied"
];

const forbiddenRunnerPatterns = [
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /\.storage\b/i,
  /insert\s+into/i,
  /delete\s+from/i,
  /update\s+public\./i,
  /truncate/i,
  /drop\s+table/i,
  /alter\s+table/i,
  /create\s+table/i,
  /fetch\s*\(/i,
  /writeFileSync/i,
  /appendFileSync/i,
  /console\.(log|error|warn)\([^)]*process\.env/i,
  /\.select\("symbol",\s*\{\s*count:\s*"exact",\s*head:\s*true\s*\}\)/,
  /\.eq\("symbol",\s*symbol\)/
];

const missing = [
  ...requiredPhrases.filter((phrase) => !content.includes(phrase)).map((phrase) => `${target}: ${phrase}`),
  ...evidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = [
  ...forbiddenPhrases.filter((phrase) => content.includes(phrase)),
  ...forbiddenRunnerPatterns.filter((pattern) => pattern.test(runner)).map((pattern) => `${runnerPath}: ${pattern}`)
];
const reviewGateRunsRunner = /command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate);

if (reviewGateRunsRunner) {
  forbidden.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
