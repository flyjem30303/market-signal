import fs from "node:fs";

const reviewPath = "docs/reviews/EQUITY_REPORT_ONLY_RUNNER_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `equity_report_only_runner_one_attempt_post_run_review_recorded`",
  "equity_runner_execution_approval_required",
  "EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION=CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION",
  "NEXT_PUBLIC_DATA_SOURCE=mock",
  "node scripts/run-equity-report-only-runner-once.mjs",
  "mode: equity_report_only_runner",
  "source_id: twse-stock-day",
  "target_symbols: 2330, 2382, 2308",
  "status: blocked",
  "remote_attempted: true",
  "publicDataSource: mock",
  "scoreSource: mock",
  "total_parsed_row_count: 2337",
  "failed_month_count: 1",
  "zero_row_month_count: 1",
  "duplicate_trade_date_count: 0",
  "parser_flag_count: 1",
  "row_coverage_credit_awarded: false",
  "scoreSource_real_enabled: false",
  "sql_executed: false",
  "writes_attempted: false",
  "row_payloads_printed: false",
  "secrets_printed: false",
  "2330 | 761 | 1 | 1 | 1",
  "2382 | 788 | 0 | 0 | 0",
  "2308 | 788 | 0 | 0 | 0",
  "BLOCKED_BUT_USEFUL",
  "did not run SQL",
  "did not connect to Supabase",
  "did not write Supabase",
  "did not create staging rows",
  "did not modify `daily_prices`",
  "did not write files",
  "did not print secrets",
  "did not print row payloads",
  "did not commit raw market data",
  "did not award row coverage points",
  "did not promote `publicDataSource=supabase`",
  "did not set `scoreSource=real`",
  "Do not rerun the runner until a new one-attempt execution decision gate is recorded"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const pattern of [
  /open_price/i,
  /close_price/i,
  /high_price/i,
  /low_price/i,
  /trade_value/i,
  /volume/i,
  /NEXT_PUBLIC_SUPABASE_URL/,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /https:\/\/[a-z0-9-]+\.supabase\.co/i,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
  /\bselect\s+\*\s+from\b/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+[a-z_]+\s+set\b/i,
  /\bdelete\s+from\b/i
]) {
  if (pattern.test(review)) {
    blocked.push(`${reviewPath}: forbidden review pattern ${String(pattern)}`);
  }
}

if (
  packageJson.scripts?.["check:equity-report-only-runner-one-attempt-post-run-review"] !==
  "node scripts/check-equity-report-only-runner-one-attempt-post-run-review.mjs"
) {
  missing.push(`${packagePath}: check:equity-report-only-runner-one-attempt-post-run-review`);
}
if (!reviewGate.includes("scripts/check-equity-report-only-runner-one-attempt-post-run-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-equity-report-only-runner-one-attempt-post-run-review.mjs`);
}
if (reviewGate.includes("scripts/run-equity-report-only-runner-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not rerun the equity report-only runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
