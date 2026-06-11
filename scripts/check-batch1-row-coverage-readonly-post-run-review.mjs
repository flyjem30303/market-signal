import fs from "node:fs";

const reportPath = "docs/reviews/BATCH1_ROW_COVERAGE_READONLY_POST_RUN_REVIEW_2026-06-12.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const statusPath = "PROJECT_STATUS.md";
const roadmapPath = "src/lib/public-beta-data-realization-roadmap.ts";
const visibleLanguagePath = "scripts/check-public-visible-language-quality.mjs";

const files = new Map(
  [reportPath, packagePath, reviewGatePath, fullHealthPath, statusPath, roadmapPath, visibleLanguagePath].map((file) => [
    file,
    fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""
  ])
);

const required = [
  [reportPath, "batch1_row_coverage_readonly_post_run_review_recorded"],
  [reportPath, "STOP_AFTER_ONE_ATTEMPT_WITH_SANITIZED_BLOCKED_RESULT"],
  [reportPath, "docs/CEO_CHAIRMAN_BATCH1_BOUNDED_READONLY_OPERATOR_DECISION.md"],
  [reportPath, "Execution count: `1`"],
  [reportPath, "Runner exit code: `1`"],
  [reportPath, "$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION='CP3_ROW_COVERAGE_READONLY_VALIDATE'; node scripts/run-row-coverage-readonly-once.mjs"],
  [reportPath, "\"coverageStatus\": \"blocked\""],
  [reportPath, "\"expectedSymbolCount\": 6"],
  [reportPath, "\"expectedTotalRows\": 360"],
  [reportPath, "\"missingRows\": 178"],
  [reportPath, "\"observedTotalRows\": 182"],
  [reportPath, "\"reason\": \"aggregate_count_incomplete\""],
  [reportPath, "\"remoteAttempted\": true"],
  [reportPath, "\"connectionAttempted\": true"],
  [reportPath, "\"symbol\": \"TWII\""],
  [reportPath, "\"symbol\": \"0050\""],
  [reportPath, "\"symbol\": \"006208\""],
  [reportPath, "\"symbol\": \"2330\""],
  [reportPath, "\"symbol\": \"2382\""],
  [reportPath, "\"symbol\": \"2308\""],
  [reportPath, "\"mutations\": false"],
  [reportPath, "\"filesWritten\": false"],
  [reportPath, "\"publicDataSource\": \"mock\""],
  [reportPath, "\"rowPayloadsPrinted\": false"],
  [reportPath, "\"scoreSource\": \"mock\""],
  [reportPath, "\"secretsPrinted\": false"],
  [reportPath, "\"sqlExecuted\": false"],
  [reportPath, "No Supabase URL, service role key, anon key, row payloads, `stock_id` values"],
  [reportPath, "Outcome category: `aggregate_count_incomplete`"],
  [reportPath, "182 rows were observed and 178 rows are missing"],
  [reportPath, "STOP-001 no retry was executed"],
  [reportPath, "STOP-003 no SQL or write command was used for investigation"],
  [reportPath, "STOP-004 no ingestion, market-data fetch, or staging action was executed"],
  [reportPath, "STOP-006 public-facing data source remains mock"],
  [reportPath, "STOP-007 `scoreSource=real` remains blocked"],
  [reportPath, "STOP-008 row coverage points remain unawarded"],
  [reportPath, "Accepted as a completed bounded readonly attempt with a blocked aggregate coverage result"],
  [reportPath, "NEXT-SLICE-002 prepare a Batch 1 data coverage route decision"],
  [statusPath, "Latest Batch 1 row coverage readonly post-run review slice"],
  [statusPath, "docs/reviews/BATCH1_ROW_COVERAGE_READONLY_POST_RUN_REVIEW_2026-06-12.md"],
  [statusPath, "observed 182 of 360 expected rows"],
  [roadmapPath, "post_run_review_recorded_blocked"],
  [roadmapPath, "observed_182_of_360_missing_178"],
  [visibleLanguagePath, "post_run_review_recorded_blocked"],
  [visibleLanguagePath, "observed_182_of_360_missing_178"],
  [packagePath, "\"check:batch1-row-coverage-readonly-post-run-review\": \"node scripts/check-batch1-row-coverage-readonly-post-run-review.mjs\""],
  [reviewGatePath, "scripts/check-batch1-row-coverage-readonly-post-run-review.mjs"],
  [fullHealthPath, "scripts/check-batch1-row-coverage-readonly-post-run-review.mjs"]
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
  [reportPath, "RUNTIME_READY_NOW"],
  [reportPath, "CP3_READY_NOW"],
  [reportPath, "sb_secret_"],
  [reportPath, "sb_publishable_"],
  [reportPath, "SUPABASE_SERVICE_ROLE_KEY="],
  [reportPath, "NEXT_PUBLIC_SUPABASE_ANON_KEY="],
  [reportPath, "raw payload:"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (/command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(read(reviewGatePath))) {
  blocked.push(`${reviewGatePath}: review gate must not execute the row coverage runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
