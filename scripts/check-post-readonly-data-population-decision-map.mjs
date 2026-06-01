import fs from "node:fs";

const reviewPath = "docs/reviews/POST_READONLY_DATA_POPULATION_DECISION_MAP_2026-06-01.md";
const postRunPath = "docs/reviews/POST_EQUITY_ROW_COVERAGE_READONLY_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const postRun = fs.readFileSync(postRunPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `post_readonly_data_population_decision_map_recorded`",
  "POST_EQUITY_ROW_COVERAGE_READONLY_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md",
  "remote read path succeeded safely",
  "target_relation: daily_prices",
  "coverage_status: blocked",
  "reason: aggregate_count_incomplete",
  "expected_symbol_count: 6",
  "required_trading_sessions: 60",
  "expected_total_rows: 360",
  "observed_total_rows: 5",
  "missing_rows: 355",
  "twii_observed_rows: 0",
  "etf_0050_observed_rows: 1",
  "etf_006208_observed_rows: 1",
  "equity_2330_observed_rows: 1",
  "equity_2382_observed_rows: 1",
  "equity_2308_observed_rows: 1",
  "publicDataSource: mock",
  "scoreSource: mock",
  "DIAGNOSIS-001 count_unavailable is no longer the primary blocker",
  "DIAGNOSIS-002 stock_id aggregate count path works at remote-read level",
  "DIAGNOSIS-003 row coverage is blocked by insufficient daily_prices population",
  "DIAGNOSIS-004 TWII is the sharpest coverage gap because observed rows are zero",
  "Index | TWII | Data",
  "ETF | 0050, 006208 | Legal",
  "Equity | 2330, 2382, 2308 | Engineering",
  "Storage | daily_prices | Engineering",
  "staging-first is preferred",
  "This map does not run SQL",
  "This map does not connect to Supabase",
  "This map does not write Supabase",
  "This map does not create staging rows",
  "This map does not modify `daily_prices`",
  "This map does not fetch or ingest raw market data",
  "This map does not print secrets",
  "This map does not print row payloads",
  "This map does not print stock_id payloads",
  "This map does not award row coverage points",
  "This map does not promote `publicDataSource=supabase`",
  "This map does not set `scoreSource=real`",
  "This map does not promote CP3 readiness",
  "This map does not approve public coverage claims",
  "PREPARE_SOURCE_SPECIFIC_BACKFILL_DESIGN_PACKET"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "observed_total_rows: 5",
  "missing_rows: 355",
  "TWII | 0",
  "0050 | 1",
  "006208 | 1",
  "2330 | 1",
  "2382 | 1",
  "2308 | 1",
  "REMOTE_READ_SUCCEEDED_ROW_COVERAGE_BLOCKED"
]) {
  if (!postRun.includes(phrase)) {
    missing.push(`${postRunPath}: ${phrase}`);
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
  packageJson.scripts?.["check:post-readonly-data-population-decision-map"] !==
  "node scripts/check-post-readonly-data-population-decision-map.mjs"
) {
  missing.push(`${packagePath}: check:post-readonly-data-population-decision-map`);
}
if (!reviewGate.includes("scripts/check-post-readonly-data-population-decision-map.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-post-readonly-data-population-decision-map.mjs`);
}
if (reviewGate.includes("scripts/run-row-coverage-readonly-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
