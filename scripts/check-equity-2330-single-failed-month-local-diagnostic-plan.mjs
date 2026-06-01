import fs from "node:fs";

const reviewPath = "docs/reviews/EQUITY_2330_SINGLE_FAILED_MONTH_LOCAL_DIAGNOSTIC_PLAN_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `equity_2330_single_failed_month_local_diagnostic_plan_recorded`",
  "EQUITY_REPORT_ONLY_RUNNER_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md",
  "symbol: 2330",
  "failed_month_count: 1",
  "zero_row_month_count: 1",
  "parser_flag_count: 1",
  "http_status_summary: 200: 38, error: 1",
  "parsed_row_count: 761",
  "first_observed_trade_date: 2023-01-03",
  "last_observed_trade_date: 2026-05-29",
  "publicDataSource: mock",
  "scoreSource: mock",
  "row_coverage_credit_awarded: false",
  "transient HTTP, network, timeout, or endpoint availability issue",
  "request-level error",
  "non-JSON, unavailable, empty, or otherwise parser-unusable response",
  "does not include the exact failed month key",
  "which exact 2330 month failed",
  "TWSE has a source data gap",
  "row coverage evidence has been accepted",
  "publicDataSource=supabase",
  "scoreSource=real",
  "failedMonthKeys",
  "symbol: string",
  "month: YYYY-MM",
  "errorCategory: sanitized_category",
  "httpStatus: number_or_null",
  "parsedRowCount: number",
  "Do not rerun `scripts/run-equity-report-only-runner-once.mjs` from this plan",
  "Do not fetch TWSE from this plan",
  "Do not run SQL",
  "Do not connect to Supabase",
  "Do not write Supabase",
  "Do not create staging rows",
  "Do not modify `daily_prices`",
  "Do not print secrets",
  "Do not print row payloads",
  "Do not commit raw market data",
  "Do not award row coverage credit",
  "Do not promote `publicDataSource=supabase`",
  "Do not set `scoreSource=real`",
  "CONTINUE_WITH_OUTPUT_CONTRACT_HARDENING",
  "new one-attempt execution decision gate before any second remote attempt"
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
  packageJson.scripts?.["check:equity-2330-single-failed-month-local-diagnostic-plan"] !==
  "node scripts/check-equity-2330-single-failed-month-local-diagnostic-plan.mjs"
) {
  missing.push(`${packagePath}: check:equity-2330-single-failed-month-local-diagnostic-plan`);
}
if (!reviewGate.includes("scripts/check-equity-2330-single-failed-month-local-diagnostic-plan.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-equity-2330-single-failed-month-local-diagnostic-plan.mjs`);
}
if (reviewGate.includes("scripts/run-equity-report-only-runner-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not rerun the equity report-only runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
