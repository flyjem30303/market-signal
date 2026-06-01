import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_EXECUTION_DECISION_GATE_2026-06-02.md";
const commandMapPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_COMMAND_MAP_2026-06-01.md";
const templatePath = "docs/reviews/TWII_REPORT_ONLY_PROBE_POST_RUN_REVIEW_TEMPLATE_2026-06-01.md";
const runnerPath = "scripts/run-twii-report-only-probe-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const commandMap = fs.readFileSync(commandMapPath, "utf8");
const template = fs.readFileSync(templatePath, "utf8");
const runner = fs.readFileSync(runnerPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_report_only_probe_one_attempt_execution_decision_gate_recorded`",
  "TWII_REPORT_ONLY_PROBE_COMMAND_MAP_2026-06-01.md",
  "approve_exactly_one_twii_report_only_probe_attempt_after_guarded_runner_prep",
  "approval_state: accepted",
  "approved_by: CEO_under_chairman_delegation",
  "approved_at: 2026-06-02T00:00:00+08:00",
  "attempt_limit: 1",
  "remote_execution_allowed_now: true",
  "target_symbol: TWII",
  "selected_candidate: official-exchange-index",
  "publicDataSource: mock",
  "scoreSource: mock",
  "$env:TWII_REPORT_ONLY_PROBE_CONFIRMATION=\"CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT\"; $env:NEXT_PUBLIC_DATA_SOURCE=\"mock\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-twii-report-only-probe-once.mjs",
  "npm run check:twii-report-only-probe-guarded-runner",
  "npm run check:twii-report-only-probe-command-map",
  "npm run check:twii-report-only-probe-post-run-template",
  "npm run check:twii-report-only-probe-one-attempt-execution-decision-gate",
  "npm run check:review-gates",
  "failureClass",
  "httpStatusGroup",
  "parsedRowCount",
  "dateRangeStart",
  "dateRangeEnd",
  "rowPayloadsPrinted",
  "stockIdPayloadsPrinted",
  "secretsPrinted",
  "sqlExecuted",
  "writesAttempted",
  "marketDataFilesWritten",
  "rowCoverageCreditAwarded",
  "scoreSourceRealEnabled",
  "This gate approves exactly one TWII report-only probe attempt",
  "Do not run more than one TWII report-only probe attempt from this gate",
  "Do not use this gate after one attempt has been executed",
  "Do not retry if the attempt is blocked or fails",
  "Do not run SQL",
  "Do not connect to Supabase",
  "Do not write Supabase",
  "Do not create staging rows",
  "Do not modify `daily_prices`",
  "Do not print secrets",
  "Do not print row payloads",
  "Do not print stock_id payloads",
  "Do not write market-data files",
  "Do not commit raw market data",
  "Do not approve source rights",
  "Do not approve a parser",
  "Do not approve ingestion",
  "Do not award row coverage credit",
  "Do not promote `publicDataSource=supabase`",
  "Do not set `scoreSource=real`",
  "Do not promote CP3 readiness",
  "Do not approve public coverage claims",
  "TWII_REPORT_ONLY_PROBE_POST_RUN_REVIEW_TEMPLATE_2026-06-01.md",
  "parser-design preparation, source-rights rejection, or fallback-source selection",
  "ACCEPTED_FOR_EXACTLY_ONE_TWII_REPORT_ONLY_PROBE_ATTEMPT",
  "The goal is source-depth evidence for TWII, not data ingestion."
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "TWII_REPORT_ONLY_PROBE_RUNNER_READY_FOR_SEPARATE_ONE_ATTEMPT_EXECUTION_DECISION",
  "runner: scripts/run-twii-report-only-probe-once.mjs",
  "confirmation_token: CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT"
]) {
  if (!commandMap.includes(phrase)) {
    missing.push(`${commandMapPath}: ${phrase}`);
  }
}

for (const phrase of [
  "POST_RUN_REVIEW_TEMPLATE_READY_BEFORE_TWII_REPORT_ONLY_PROBE_EXECUTION",
  "status: pending_run",
  "rowPayloadsPrinted: false"
]) {
  if (!template.includes(phrase)) {
    missing.push(`${templatePath}: ${phrase}`);
  }
}

for (const phrase of [
  "process.env.TWII_REPORT_ONLY_PROBE_CONFIRMATION !== REQUIRED_CONFIRMATION",
  "NEXT_PUBLIC_DATA_SOURCE !== \"mock\"",
  "rowPayloadsPrinted: false",
  "marketDataFilesWritten: false",
  "scoreSourceRealEnabled: false"
]) {
  if (!runner.includes(phrase)) {
    missing.push(`${runnerPath}: ${phrase}`);
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
  packageJson.scripts?.["check:twii-report-only-probe-one-attempt-execution-decision-gate"] !==
  "node scripts/check-twii-report-only-probe-one-attempt-execution-decision-gate.mjs"
) {
  missing.push(`${packagePath}: check:twii-report-only-probe-one-attempt-execution-decision-gate`);
}
if (!reviewGate.includes("scripts/check-twii-report-only-probe-one-attempt-execution-decision-gate.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-report-only-probe-one-attempt-execution-decision-gate.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
