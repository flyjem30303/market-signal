import fs from "node:fs";

const reviewPath = "docs/reviews/POST_EQUITY_ROW_COVERAGE_READONLY_ATTEMPT_DECISION_PACKET_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `post_equity_row_coverage_readonly_attempt_decision_packet_recorded`",
  "EQUITY_ROW_COVERAGE_EVIDENCE_ACCEPTANCE_GATE_2026-06-01.md",
  "scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs",
  "decision_state: ready_for_explicit_one_attempt_action",
  "execution_approved_by_this_packet: false",
  "required_next_user_action: accept_one_bounded_row_coverage_readonly_attempt",
  "attempt_limit: 1",
  "row_coverage_evidence_acceptance: ok",
  "equity_row_coverage_evidence_acceptance_gate: ok",
  "bounded_row_coverage_readonly_attempt_decision: ok",
  "prior_count_unavailable_diagnostic: recorded",
  "query_contract_revision: stock_id counting via stocks.symbol mapping",
  "publicDataSource: mock",
  "scoreSource: mock",
  "$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION=\"CP3_ROW_COVERAGE_READONLY_VALIDATE\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-row-coverage-readonly-once.mjs",
  "npm run check:row-coverage-readonly-guarded-runner",
  "npm run check:row-coverage-evidence-acceptance",
  "npm run check:equity-row-coverage-evidence-acceptance-gate",
  "npm run check:bounded-row-coverage-readonly-attempt-decision",
  "npm run check:post-equity-row-coverage-readonly-attempt-decision-packet",
  "npm run check:review-gates",
  "mode: row_coverage_readonly_remote_validation",
  "targetRelation: daily_prices",
  "expectedSymbolCount: 6",
  "requiredTradingSessions: 60",
  "expectedTotalRows: 360",
  "observedTotalRows: number",
  "missingRows: number",
  "symbolsChecked: sanitized symbol identifiers and aggregate observedRows only",
  "coverageStatus: ok or blocked",
  "canAwardRowCoveragePoints: false",
  "canClaimCoverage: false",
  "canSetScoreSourceReal: false",
  "This packet does not execute the runner",
  "This packet does not approve execution by itself",
  "Do not run more than one bounded readonly attempt from a future acceptance",
  "Do not run SQL",
  "Do not write Supabase",
  "Do not create staging rows",
  "Do not modify `daily_prices`",
  "Do not fetch or ingest raw market data",
  "Do not print secrets",
  "Do not print row payloads",
  "Do not print stock_id payloads",
  "Do not award row coverage points",
  "Do not promote `publicDataSource=supabase`",
  "Do not set `scoreSource=real`",
  "Do not promote CP3 readiness",
  "Do not approve public coverage claims",
  "REQUEST_EXPLICIT_ACCEPTANCE_FOR_ONE_BOUNDED_READONLY_ATTEMPT"
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
  packageJson.scripts?.["check:post-equity-row-coverage-readonly-attempt-decision-packet"] !==
  "node scripts/check-post-equity-row-coverage-readonly-attempt-decision-packet.mjs"
) {
  missing.push(`${packagePath}: check:post-equity-row-coverage-readonly-attempt-decision-packet`);
}
if (!reviewGate.includes("scripts/check-post-equity-row-coverage-readonly-attempt-decision-packet.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-post-equity-row-coverage-readonly-attempt-decision-packet.mjs`);
}
if (reviewGate.includes("scripts/run-row-coverage-readonly-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the row coverage runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
