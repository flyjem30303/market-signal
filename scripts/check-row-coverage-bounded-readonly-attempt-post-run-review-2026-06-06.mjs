import fs from "node:fs";

const reportPath = "docs/reviews/ROW_COVERAGE_BOUNDED_READONLY_ATTEMPT_POST_RUN_REVIEW_2026-06-06.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const report = fs.readFileSync(reportPath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const required = [
  "Status: `row coverage bounded readonly attempt post-run review recorded`",
  "Decision: `REMOTE_ATTEMPT_RECORDED_AGGREGATE_COUNT_INCOMPLETE`",
  "CEO named exactly one bounded Supabase readonly row coverage attempt on 2026-06-06",
  "Execution count: `1`",
  "Exit code: `1`",
  "\"coverageStatus\": \"blocked\"",
  "\"expectedSymbolCount\": 6",
  "\"expectedTotalRows\": 360",
  "\"missingRows\": 355",
  "\"observedTotalRows\": 5",
  "\"preflightStatus\": \"ready_for_guarded_readonly_decision\"",
  "\"reason\": \"aggregate_count_incomplete\"",
  "\"remoteAttempted\": true",
  "\"requiredTradingSessions\": 60",
  "\"targetRelation\": \"daily_prices\"",
  "\"connectionAttempted\": true",
  "\"canAwardRowCoveragePoints\": false",
  "\"canClaimCoverage\": false",
  "\"canSetScoreSourceReal\": false",
  "\"filesWritten\": false",
  "\"mutations\": false",
  "\"publicDataSource\": \"mock\"",
  "\"rowPayloadsPrinted\": false",
  "\"scoreSource\": \"mock\"",
  "\"secretsPrinted\": false",
  "\"sqlExecuted\": false",
  "\"symbol\": \"TWII\"",
  "\"observedRows\": 0",
  "\"symbol\": \"0050\"",
  "\"symbol\": \"006208\"",
  "\"symbol\": \"2330\"",
  "\"symbol\": \"2382\"",
  "\"symbol\": \"2308\"",
  "No Supabase URL, service role key, anon key, raw row payloads, SQL text, `stock_id` values",
  "Outcome category: `aggregate_count_incomplete`",
  "only `5` of `360` expected rows were observed",
  "TWII` returned `0` observed rows",
  "each returned `1` observed row",
  "STOP-001 no retry was executed",
  "STOP-003 no SQL or write command was used for investigation",
  "STOP-006 public-facing data source remains mock",
  "STOP-007 `scoreSource=real` remains blocked",
  "STOP-008 row coverage points remain unawarded",
  "remote aggregate count works, but stored coverage is only `5/360`",
  "NEXT-SLICE-002 prepare the data population route for missing `daily_prices` rows without running SQL or writing data"
];

const forbidden = [
  "Execution count: `2`",
  "\"sqlExecuted\": true",
  "\"mutations\": true",
  "\"filesWritten\": true",
  "\"rowPayloadsPrinted\": true",
  "\"secretsPrinted\": true",
  "\"canAwardRowCoveragePoints\": true",
  "\"canClaimCoverage\": true",
  "\"canSetScoreSourceReal\": true",
  "\"publicDataSource\": \"supabase\"",
  "\"scoreSource\": \"real\"",
  "stock_id\":",
  "keyPrefix",
  "keySuffix",
  "keyLength",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW",
  "scoreSource=real approved"
];

const missing = required.filter((phrase) => !report.includes(phrase));
const blocked = forbidden.filter((phrase) => report.includes(phrase));

if (!packageJson.includes("\"check:row-coverage-bounded-readonly-attempt-post-run-review-2026-06-06\": \"node scripts/check-row-coverage-bounded-readonly-attempt-post-run-review-2026-06-06.mjs\"")) {
  missing.push(`${packagePath}: check script registration`);
}

if (!reviewGate.includes("scripts/check-row-coverage-bounded-readonly-attempt-post-run-review-2026-06-06.mjs")) {
  missing.push(`${reviewGatePath}: review gate registration`);
}

if (/command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate)) {
  blocked.push(`${reviewGatePath}: review gate must not execute the row coverage runner`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
