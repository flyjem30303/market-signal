import fs from "node:fs";

const reviewPath = "docs/reviews/TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-02.md";
const decisionGatePath = "docs/reviews/TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_EXECUTION_DECISION_GATE_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const review = fs.readFileSync(reviewPath, "utf8");
const decisionGate = fs.readFileSync(decisionGatePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "Status: `twii_report_only_probe_one_attempt_post_run_review_recorded`",
  "TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_EXECUTION_DECISION_GATE_2026-06-02.md",
  "authorized exactly one TWII report-only probe attempt",
  "TWII_REPORT_ONLY_PROBE_CONFIRMATION=\"CEO_APPROVED_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT\"",
  "NEXT_PUBLIC_DATA_SOURCE=\"mock\"",
  "scripts\\run-twii-report-only-probe-once.mjs",
  "mode: twii_report_only_probe",
  "targetSymbol: TWII",
  "selectedCandidate: official-exchange-index",
  "startedAt: 2026-06-01T16:07:41.884Z",
  "finishedAt: 2026-06-01T16:07:42.132Z",
  "status: ready_for_review",
  "failureClass: none",
  "remoteAttempted: true",
  "connectionAttempted: true",
  "processExitCode: 1",
  "processTailIssue: windows_uv_handle_closing_assertion_after_sanitized_output",
  "publicDataSource: mock",
  "scoreSource: mock",
  "httpStatusGroup: 2xx",
  "parsedRowCount: 20",
  "dateRangeStart: 2026-05-04",
  "dateRangeEnd: 2026-05-29",
  "missingSessionCount: 0",
  "duplicateTradeDateCount: 0",
  "fieldParseFailureCount: 0",
  "calendarGapCount: 0",
  "parserFlagCount: 0",
  "rowPayloadsPrinted: false",
  "stockIdPayloadsPrinted: false",
  "secretsPrinted: false",
  "sqlExecuted: false",
  "writesAttempted: false",
  "marketDataFilesWritten: false",
  "rowCoverageCreditAwarded: false",
  "scoreSourceRealEnabled: false",
  "FINDING-001 exactly_one_attempt_consumed: true",
  "FINDING-002 sanitized_json_available: true",
  "FINDING-003 source_returned_parseable_twii_aggregate_evidence: true",
  "FINDING-006 process_tail_assertion_requires_runner_stability_fix_before_any_future_probe: true",
  "FINDING-007 evidence_supports_parser_design_preparation_discussion: true",
  "FINDING-008 evidence_does_not_approve_source_rights_or_ingestion: true",
  "READY_FOR_TWII_PARSER_DESIGN_PREPARATION_AFTER_RUNNER_STABILITY_FIX",
  "Do not rerun the TWII probe from this gate.",
  "The runner did not run SQL",
  "The runner did not connect to Supabase",
  "The runner did not write Supabase",
  "The runner did not create staging rows",
  "The runner did not modify `daily_prices`",
  "The runner did not write market-data files",
  "The runner did not print secrets",
  "The runner did not print row payloads",
  "The runner did not print stock_id payloads",
  "The runner did not commit raw market data",
  "The runner did not award row coverage points",
  "The runner did not promote `publicDataSource=supabase`",
  "The runner did not set `scoreSource=real`",
  "Do not rerun the TWII report-only probe until a new one-attempt execution decision gate is recorded",
  "Fix the runner process-tail stability issue in local-only mode before any future remote attempt",
  "Keep source-rights approval, ingestion approval, row coverage credit, and public claims blocked"
]) {
  if (!review.includes(phrase)) {
    missing.push(`${reviewPath}: ${phrase}`);
  }
}

for (const phrase of [
  "ACCEPTED_FOR_EXACTLY_ONE_TWII_REPORT_ONLY_PROBE_ATTEMPT",
  "attempt_limit: 1",
  "remote_execution_allowed_now: true"
]) {
  if (!decisionGate.includes(phrase)) {
    missing.push(`${decisionGatePath}: ${phrase}`);
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
  packageJson.scripts?.["check:twii-report-only-probe-one-attempt-post-run-review"] !==
  "node scripts/check-twii-report-only-probe-one-attempt-post-run-review.mjs"
) {
  missing.push(`${packagePath}: check:twii-report-only-probe-one-attempt-post-run-review`);
}
if (!reviewGate.includes("scripts/check-twii-report-only-probe-one-attempt-post-run-review.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-twii-report-only-probe-one-attempt-post-run-review.mjs`);
}
if (reviewGate.includes("scripts/run-twii-report-only-probe-once.mjs")) {
  blocked.push(`${reviewGatePath}: review gate must not execute the TWII report-only probe runner`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
