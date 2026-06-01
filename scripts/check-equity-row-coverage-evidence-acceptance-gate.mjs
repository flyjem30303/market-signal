import fs from "node:fs";

const reviewPath = "docs/reviews/EQUITY_ROW_COVERAGE_EVIDENCE_ACCEPTANCE_GATE_2026-06-01.md";
const postRunPath = "docs/reviews/EQUITY_REPORT_ONLY_RUNNER_SECOND_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const postRun = fs.readFileSync(postRunPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `equity_row_coverage_evidence_acceptance_gate_recorded`",
  "EQUITY_REPORT_ONLY_RUNNER_SECOND_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md",
  "accepted_scope: clean_sanitized_equity_report_only_sample",
  "source_id: twse-stock-day",
  "target_symbols: 2330, 2382, 2308",
  "months_per_symbol: 39",
  "total_parsed_row_count: 2364",
  "failed_month_count: 0",
  "zero_row_month_count: 0",
  "duplicate_trade_date_count: 0",
  "parser_flag_count: 0",
  "failed_month_keys: []",
  "zero_row_month_keys: []",
  "accepted as local decision-quality row coverage evidence",
  "does not activate production ingestion",
  "does not award row coverage points",
  "does not prove full Taiwan equity universe coverage",
  "does not prove global market coverage",
  "does not permit `publicDataSource=supabase`",
  "does not permit `scoreSource=real`",
  "does not permit SQL execution",
  "does not permit Supabase writes",
  "does not permit staging rows",
  "does not permit `daily_prices` writes",
  "does not permit raw market data commits",
  "publicDataSource: mock",
  "scoreSource: mock",
  "row_coverage_credit_awarded: false",
  "scoreSource_real_enabled: false",
  "sql_executed: false",
  "supabase_writes_enabled: false",
  "row_payloads_printed: false",
  "secrets_printed: false",
  "ACCEPT_AS_LOCAL_DECISION_QUALITY_EVIDENCE_ONLY"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "status: ready_for_review",
  "total_parsed_row_count: 2364",
  "failed_month_count: 0",
  "zero_row_month_count: 0",
  "parser_flag_count: 0",
  "failed_month_keys: []",
  "zero_row_month_keys: []",
  "row_coverage_credit_awarded: false",
  "scoreSource_real_enabled: false"
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
  packageJson.scripts?.["check:equity-row-coverage-evidence-acceptance-gate"] !==
  "node scripts/check-equity-row-coverage-evidence-acceptance-gate.mjs"
) {
  missing.push(`${packagePath}: check:equity-row-coverage-evidence-acceptance-gate`);
}
if (!reviewGate.includes("scripts/check-equity-row-coverage-evidence-acceptance-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-equity-row-coverage-evidence-acceptance-gate.mjs`);
}
if (reviewGate.includes("scripts/run-equity-report-only-runner-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the equity report-only runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
