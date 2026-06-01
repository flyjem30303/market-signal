import fs from "node:fs";

const reportPath = "docs/reviews/CP3_ROW_COVERAGE_BOUNDED_READONLY_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [reportPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [reportPath, "CP3 row coverage bounded readonly attempt post-run review recorded"],
  [reportPath, "STOP_AFTER_BOUNDED_READONLY_ATTEMPT_WITH_AGGREGATE_INCOMPLETE_RESULT"],
  [reportPath, "CEO explicitly requested bounded Supabase readonly attempt"],
  [reportPath, "Execution count: `1`"],
  [reportPath, "Exit code: `1`"],
  [reportPath, "\"coverageStatus\": \"blocked\""],
  [reportPath, "\"expectedSymbolCount\": 6"],
  [reportPath, "\"expectedTotalRows\": 360"],
  [reportPath, "\"missingRows\": 355"],
  [reportPath, "\"observedTotalRows\": 5"],
  [reportPath, "\"reason\": \"aggregate_count_incomplete\""],
  [reportPath, "\"remoteAttempted\": true"],
  [reportPath, "\"connectionAttempted\": true"],
  [reportPath, "\"mutations\": false"],
  [reportPath, "\"publicDataSource\": \"mock\""],
  [reportPath, "\"rowPayloadsPrinted\": false"],
  [reportPath, "\"scoreSource\": \"mock\""],
  [reportPath, "\"secretsPrinted\": false"],
  [reportPath, "\"sqlExecuted\": false"],
  [reportPath, "No Supabase URL, service role key, anon key, row payloads, `stock_id` values"],
  [reportPath, "Outcome category: `aggregate_count_incomplete`"],
  [reportPath, "only 5 rows were observed and 355 rows are missing"],
  [reportPath, "STOP-001 no retry was executed"],
  [reportPath, "STOP-003 no SQL or write command was used for investigation"],
  [reportPath, "STOP-004 no ingestion, market-data fetch, or staging action was executed"],
  [reportPath, "STOP-006 public-facing data source remains mock"],
  [reportPath, "STOP-007 `scoreSource=real` remains blocked"],
  [reportPath, "STOP-008 row coverage points remain unawarded"],
  [reportPath, "Accepted as a completed bounded readonly attempt with a blocked aggregate"],
  [reportPath, "NEXT-SLICE-001 record this attempt in the row coverage readiness UI"],
  [packagePath, "\"check:row-coverage-bounded-readonly-attempt-post-run-review\": \"node scripts/check-row-coverage-bounded-readonly-attempt-post-run-review.mjs\""],
  [reviewGatePath, "scripts/check-row-coverage-bounded-readonly-attempt-post-run-review.mjs"]
];

const forbidden = [
  [reportPath, "Execution count: `2`"],
  [reportPath, "\"mutations\": true"],
  [reportPath, "\"filesWritten\": true"],
  [reportPath, "\"rowPayloadsPrinted\": true"],
  [reportPath, "\"secretsPrinted\": true"],
  [reportPath, "\"sqlExecuted\": true"],
  [reportPath, "\"canAwardRowCoveragePoints\": true"],
  [reportPath, "\"canClaimCoverage\": true"],
  [reportPath, "\"canSetScoreSourceReal\": true"],
  [reportPath, "\"publicDataSource\": \"supabase\""],
  [reportPath, "\"scoreSource\": \"real\""],
  [reportPath, "ROW_COVERAGE_POINTS_AWARDED"],
  [reportPath, "CP3_READY_NOW"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

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

function read(file) {
  return files.get(file) ?? "";
}
