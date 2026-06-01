import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_QUERY_CONTRACT_REVISION_IMPLEMENTATION_REVIEW_2026-06-01.md";
const diagnosticPath = "docs/reviews/CP3_ROW_COVERAGE_COUNT_UNAVAILABLE_LOCAL_DIAGNOSTIC_PLAN_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const guardedCheckerPath = "scripts/check-row-coverage-readonly-guarded-runner.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const diagnostic = readFileSync(diagnosticPath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const guardedChecker = readFileSync(guardedCheckerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Query Contract Revision Implementation Review",
  "CP3 row coverage query contract revision implementation review recorded",
  "LOCAL_QUERY_CONTRACT_FIX_ACCEPTED_SECOND_REMOTE_ATTEMPT_STILL_BLOCKED",
  "does not run a second remote attempt",
  "does not connect to Supabase in this slice",
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
  "IMPLEMENTED-001 runner no longer counts daily_prices by symbol",
  "IMPLEMENTED-002 runner no longer filters daily_prices with .eq(\"symbol\", symbol)",
  "IMPLEMENTED-003 runner resolves stocks.id from stocks.symbol before counting daily_prices",
  "IMPLEMENTED-004 runner queries stocks with .select(\"id, symbol\")",
  "IMPLEMENTED-005 runner filters stocks with .in(\"symbol\", ALLOWED_SYMBOLS)",
  "IMPLEMENTED-008 runner counts daily_prices with .select(\"stock_id\", { count: \"exact\", head: true })",
  "IMPLEMENTED-009 runner filters daily_prices with .eq(\"stock_id\", stockId)",
  "IMPLEMENTED-010 runner reports stock_mapping_unavailable if stocks lookup fails",
  "IMPLEMENTED-011 runner reports stock_mapping_missing if a symbol has no stock id",
  "IMPLEMENTED-013 static checker rejects the old daily_prices.symbol count path",
  "IMPLEMENTED-014 static checker requires stock_id counting",
  "SAFETY-001 no second remote attempt was executed",
  "SAFETY-002 no SQL was executed",
  "SAFETY-003 no Supabase write was performed",
  "SAFETY-010 no stock_id values were printed",
  "SAFETY-011 publicDataSource remains mock",
  "SAFETY-012 scoreSource remains mock",
  "SAFETY-013 canAwardRowCoveragePoints remains false",
  "SAFETY-015 CP3 remains not_ready",
  "ENGINEERING-FINDING-001 runner now aligns with local schema evidence",
  "ENGINEERING-FINDING-002 checker now rejects returning to the old daily_prices.symbol path",
  "SECURITY-FINDING-001 stock ids are internal lookup values and remain hidden from output",
  "DECISION-001 local query-contract fix is accepted",
  "DECISION-003 no second remote attempt is approved by this review",
  "DECISION-005 row coverage points remain unawarded",
  "DECISION-006 scoreSource remains mock",
  "NEXT-SLICE-001 create a second one-attempt execution decision gate only after local checks pass",
  "NEXT-SLICE-002 do not execute the second attempt without explicit approval",
  "scripts/check-row-coverage-query-contract-revision-implementation-review.mjs passes",
  "scripts/check-row-coverage-readonly-guarded-runner.mjs passes",
  "scripts/check-row-coverage-count-unavailable-local-diagnostic-plan.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "no second remote attempt occurs",
  "SQL execution remains blocked",
  "Supabase writes remain blocked"
];

const evidencePhrases = [
  {
    content: diagnostic,
    file: diagnosticPath,
    phrase: "FIX-004 count daily_prices by stock_id instead of symbol"
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
    phrase: "scripts/check-row-coverage-count-unavailable-local-diagnostic-plan.mjs"
  }
];

const forbiddenPhrases = [
  "second remote attempt approved",
  "second attempt executed",
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
