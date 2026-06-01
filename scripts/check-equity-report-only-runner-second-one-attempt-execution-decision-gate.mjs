import fs from "node:fs";

const reviewPath = "docs/reviews/EQUITY_REPORT_ONLY_RUNNER_SECOND_ONE_ATTEMPT_EXECUTION_DECISION_GATE_2026-06-01.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `equity_report_only_runner_second_one_attempt_execution_decision_required`",
  "BLOCKED_BUT_USEFUL",
  "exact failed month cannot be identified",
  "failedMonthKeys",
  "zeroRowMonthKeys",
  "approve_exactly_one_second_equity_report_only_runner_attempt_after_month_key_output_hardening",
  "approval_state: pending",
  "approved_by: none",
  "attempt_limit: 1",
  "remote_execution_allowed_now: false",
  "EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION=CEO_APPROVED_EQUITY_REPORT_ONLY_RUNNER_EXECUTION NEXT_PUBLIC_DATA_SOURCE=mock node scripts/run-equity-report-only-runner-once.mjs",
  "npm run check:equity-report-only-runner-implementation",
  "npm run check:equity-2330-single-failed-month-local-diagnostic-plan",
  "npm run check:equity-report-only-runner-second-one-attempt-execution-decision-gate",
  "npm run check:review-gates",
  "symbol, month, errorCategory, httpStatus, parsedRowCount",
  "do not create row coverage evidence",
  "This gate does not approve execution yet",
  "Do not set `EQUITY_REPORT_ONLY_RUNNER_CONFIRMATION` from this gate",
  "Do not run `scripts/run-equity-report-only-runner-once.mjs` from this gate",
  "Do not fetch TWSE from this gate",
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
  "READY_FOR_CHAIRMAN_ACCEPT_OR_REJECT",
  "The goal is not data ingestion"
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
  packageJson.scripts?.["check:equity-report-only-runner-second-one-attempt-execution-decision-gate"] !==
  "node scripts/check-equity-report-only-runner-second-one-attempt-execution-decision-gate.mjs"
) {
  missing.push(`${packagePath}: check:equity-report-only-runner-second-one-attempt-execution-decision-gate`);
}
if (!reviewGate.includes("scripts/check-equity-report-only-runner-second-one-attempt-execution-decision-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-equity-report-only-runner-second-one-attempt-execution-decision-gate.mjs`);
}
if (reviewGate.includes("scripts/run-equity-report-only-runner-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the equity report-only runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
