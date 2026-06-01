import fs from "node:fs";

const reviewPath = "docs/reviews/POST_EQUITY_ROW_COVERAGE_READONLY_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const decisionPath = "docs/reviews/POST_EQUITY_ROW_COVERAGE_READONLY_ATTEMPT_DECISION_PACKET_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const decision = fs.readFileSync(decisionPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `post_equity_row_coverage_readonly_attempt_post_run_review_recorded`",
  "POST_EQUITY_ROW_COVERAGE_READONLY_ATTEMPT_DECISION_PACKET_2026-06-01.md",
  "accepted by Chairman for exactly one bounded Supabase readonly row coverage attempt",
  "ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION=\"CP3_ROW_COVERAGE_READONLY_VALIDATE\"",
  "scripts\\run-row-coverage-readonly-once.mjs",
  "mode: row_coverage_readonly_remote_validation",
  "target_relation: daily_prices",
  "preflight_status: ready_for_guarded_readonly_decision",
  "remote_attempted: true",
  "connection_attempted: true",
  "status: blocked",
  "coverage_status: blocked",
  "reason: aggregate_count_incomplete",
  "exit_code: 1",
  "publicDataSource: mock",
  "scoreSource: mock",
  "expected_symbol_count: 6",
  "required_trading_sessions: 60",
  "expected_total_rows: 360",
  "observed_total_rows: 5",
  "missing_rows: 355",
  "calendar_status: not_run",
  "can_award_row_coverage_points: false",
  "can_claim_coverage: false",
  "can_set_score_source_real: false",
  "files_written: false",
  "mutations: false",
  "sql_executed: false",
  "row_payloads_printed: false",
  "secrets_printed: false",
  "TWII | 0",
  "0050 | 1",
  "006208 | 1",
  "2330 | 1",
  "2382 | 1",
  "2308 | 1",
  "REMOTE_READ_SUCCEEDED_ROW_COVERAGE_BLOCKED",
  "count_unavailable",
  "observed aggregate row count is far below the expected threshold",
  "did not run SQL",
  "did not write Supabase",
  "did not create staging rows",
  "did not modify `daily_prices`",
  "did not fetch or ingest raw market data",
  "did not write files",
  "did not print secrets",
  "did not print row payloads",
  "did not print stock_id payloads",
  "did not award row coverage points",
  "did not promote `publicDataSource=supabase`",
  "did not set `scoreSource=real`",
  "did not promote CP3 readiness",
  "data population",
  "Do not rerun row coverage readonly until a new one-attempt execution decision gate is recorded",
  "safe backfill plan",
  "row coverage points unawarded"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "decision_state: accepted_for_exactly_one_bounded_readonly_attempt",
  "execution_approved_by_this_packet: true",
  "approved_by: Chairman"
]) {
  if (!decision.includes(phrase)) {
    missing.push(`${decisionPath}: ${phrase}`);
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
  packageJson.scripts?.["check:post-equity-row-coverage-readonly-attempt-post-run-review"] !==
  "node scripts/check-post-equity-row-coverage-readonly-attempt-post-run-review.mjs"
) {
  missing.push(`${packagePath}: check:post-equity-row-coverage-readonly-attempt-post-run-review`);
}
if (!reviewGate.includes("scripts/check-post-equity-row-coverage-readonly-attempt-post-run-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-post-equity-row-coverage-readonly-attempt-post-run-review.mjs`);
}
if (reviewGate.includes("scripts/run-row-coverage-readonly-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the row coverage runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
