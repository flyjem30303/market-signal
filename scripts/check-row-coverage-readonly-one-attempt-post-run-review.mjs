import fs from "node:fs";

const reportPath = "docs/reviews/CP3_ROW_COVERAGE_READONLY_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const decisionGatePath =
  "docs/reviews/CP3_ROW_COVERAGE_FINAL_ONE_ATTEMPT_READONLY_EXECUTION_DECISION_GATE_2026-06-01.md";
const report = fs.readFileSync(reportPath, "utf8");
const decisionGate = fs.readFileSync(decisionGatePath, "utf8");

const requiredReportPhrases = [
  "Status: `CP3 row coverage readonly one-attempt post-run review recorded`",
  "Decision: `STOP_AFTER_ONE_ATTEMPT_WITH_SANITIZED_BLOCKED_RESULT`",
  "Trigger: `CP3 row coverage final one-attempt readonly execution decision gate recorded`",
  "did not connect to Supabase",
  "did not run SQL",
  "did not write Supabase",
  "did not create staging rows",
  "did not write `daily_prices`",
  "did not fetch or ingest market data",
  "did not commit raw market data",
  "did not print secrets",
  "did not modify `.env.local`",
  "did not change the public data source away from mock",
  "did not set `scoreSource=real`",
  "did not approve public claims",
  "did not award row coverage points",
  "did not promote CP3 readiness",
  "PRE-RUN-001 `scripts/check-row-coverage-contract.mjs` passed",
  "PRE-RUN-002 `scripts/check-row-coverage-readonly-validation-contract.mjs` passed",
  "PRE-RUN-003 `scripts/check-row-coverage-readonly-local-preflight.mjs` passed",
  "PRE-RUN-004 `scripts/check-row-coverage-readonly-guarded-runner.mjs` passed",
  "PRE-RUN-005 `scripts/check-row-coverage-final-one-attempt-readonly-execution-decision-gate.mjs` passed",
  "PRE-RUN-006 `scripts/check-review-gates.mjs` passed before execution",
  "$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION=\"CP3_ROW_COVERAGE_READONLY_VALIDATE\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-row-coverage-readonly-once.mjs",
  "Execution count: `1`",
  "Exit code: `1`",
  "\"preflightStatus\": \"blocked\"",
  "\"reason\": \"preflight_blocked\"",
  "\"remoteAttempted\": false",
  "\"targetRelation\": \"daily_prices\"",
  "\"canAwardRowCoveragePoints\": false",
  "\"canClaimCoverage\": false",
  "\"canSetScoreSourceReal\": false",
  "\"connectionAttempted\": false",
  "\"filesWritten\": false",
  "\"mutations\": false",
  "\"publicDataSource\": \"mock\"",
  "\"rowPayloadsPrinted\": false",
  "\"scoreSource\": \"mock\"",
  "\"secretsPrinted\": false",
  "\"sqlExecuted\": false",
  "No Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data were recorded.",
  "Outcome category: `preflight_blocked`.",
  "did not provide the full process-only preflight environment",
  "STOP-001 no retry was executed",
  "STOP-002 no alternate Supabase validator was executed in the same slice",
  "STOP-003 no SQL or write command was used for investigation",
  "STOP-004 no ingestion, market-data fetch, or staging action was executed",
  "STOP-005 no `.env.local` mutation was performed",
  "STOP-006 public-facing data source remains mock",
  "STOP-007 `scoreSource=real` remains blocked",
  "STOP-008 row coverage points remain unawarded",
  "STOP-009 CP3 readiness remains unpromoted",
  "The next slice should not retry the remote read immediately.",
  "NEXT-SLICE-001 revise the row coverage read-only command map",
  "NEXT-SLICE-004 record a new one-attempt decision gate before any second row coverage read-only attempt"
];

const requiredEvidencePhrases = [
  {
    content: decisionGate,
    file: decisionGatePath,
    phrase: "The next slice may execute the guarded runner exactly once if all immediate pre-run checks pass."
  }
];

const forbiddenReportPhrases = [
  "Execution count: `2`",
  "remoteAttempted\": true",
  "connectionAttempted\": true",
  "sqlExecuted\": true",
  "mutations\": true",
  "filesWritten\": true",
  "rowPayloadsPrinted\": true",
  "secretsPrinted\": true",
  "canAwardRowCoveragePoints\": true",
  "canClaimCoverage\": true",
  "canSetScoreSourceReal\": true",
  "publicDataSource\": \"supabase\"",
  "scoreSource\": \"real\"",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW"
];

const missing = [
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase)).map((phrase) => `${reportPath}: ${phrase}`),
  ...requiredEvidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = forbiddenReportPhrases.filter((phrase) => report.includes(phrase));
const status = missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked";

console.log(JSON.stringify({ forbidden, missing, status }, null, 2));

if (status !== "ok") {
  process.exit(1);
}
