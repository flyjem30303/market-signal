import fs from "node:fs";

const reportPath =
  "docs/reviews/CP3_ROW_COVERAGE_FINAL_ONE_ATTEMPT_READONLY_EXECUTION_DECISION_GATE_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const runnerCheckerPath = "scripts/check-row-coverage-readonly-guarded-runner.mjs";
const report = fs.readFileSync(reportPath, "utf8");
const runner = fs.readFileSync(runnerPath, "utf8");
const runnerChecker = fs.readFileSync(runnerCheckerPath, "utf8");

const requiredReportPhrases = [
  "Status: `CP3 row coverage final one-attempt readonly execution decision gate recorded`",
  "Decision: `AUTHORIZE_NEXT_SLICE_ONE_ATTEMPT_ROW_COVERAGE_READONLY_EXECUTION_IF_IMMEDIATE_PRECHECKS_PASS`",
  "Trigger: `CP3 row coverage readonly guarded runner recorded`",
  "does not execute the guarded runner",
  "does not set the confirmation value",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not fetch or ingest market data",
  "does not commit raw market data",
  "does not print secrets",
  "does not modify `.env.local`",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not award row coverage points",
  "does not promote CP3 readiness",
  "Current gate status: `ready_for_next_slice_one_attempt_row_coverage_readonly_execution_decision`",
  "This decision gate is not execution.",
  "$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION=\"CP3_ROW_COVERAGE_READONLY_VALIDATE\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-row-coverage-readonly-once.mjs",
  "Any command drift stops execution.",
  "PRE-RUN-001 `scripts/check-row-coverage-contract.mjs` must pass",
  "PRE-RUN-002 `scripts/check-row-coverage-readonly-validation-contract.mjs` must pass",
  "PRE-RUN-003 `scripts/check-row-coverage-readonly-local-preflight.mjs` must pass",
  "PRE-RUN-004 `scripts/check-row-coverage-readonly-guarded-runner.mjs` must pass",
  "PRE-RUN-005 `scripts/check-review-gates.mjs` must pass",
  "PRE-RUN-006 TypeScript noEmit must pass",
  "PRE-RUN-008 `NEXT_PUBLIC_DATA_SOURCE` must remain `mock`",
  "PRE-RUN-009 `.env.local` must remain unchanged",
  "LIMIT-001 run the guarded runner at most once in the execution slice",
  "LIMIT-002 do not retry if the run fails",
  "LIMIT-003 do not run alternate Supabase validators in the same slice",
  "OUTPUT-003 do not print Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data",
  "SUCCESS-003 keep `NEXT_PUBLIC_DATA_SOURCE=mock`",
  "SUCCESS-004 keep `scoreSource=real` blocked",
  "SUCCESS-005 do not promote CP3 readiness",
  "SUCCESS-007 do not award row coverage points until a separate post-run review accepts the evidence",
  "FAILURE-003 do not retry",
  "ROLLBACK-002 expected baseline after execution is `NEXT_PUBLIC_DATA_SOURCE=mock`",
  "ROLLBACK-005 row coverage awarded points remain zero unless a separate post-run review changes the contract",
  "The next slice may execute the guarded runner exactly once if all immediate pre-run checks pass.",
  "NEXT-SLICE-002 if checks pass, execute `scripts/run-row-coverage-readonly-once.mjs` exactly once with the approved process-only environment",
  "NEXT-SLICE-003 create same-slice post-run review from sanitized output",
  "NEXT-SLICE-004 do not promote CP3 readiness, public claims, public data source, row coverage points, or `scoreSource=real`"
];

const requiredEvidencePhrases = [
  {
    content: runner,
    file: runnerPath,
    phrase: "const REQUIRED_CONFIRMATION = \"CP3_ROW_COVERAGE_READONLY_VALIDATE\""
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "remoteAttempted: false"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "canAwardRowCoveragePoints: false"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "canSetScoreSourceReal: false"
  },
  {
    content: runnerChecker,
    file: runnerCheckerPath,
    phrase: "expected missing_confirmation reason"
  }
];

const forbiddenReportPhrases = [
  "EXECUTED_THIS_SLICE",
  "row coverage read completed",
  "Supabase connection performed",
  "SQL execution is approved",
  "Supabase writes are approved",
  "market ingestion is approved",
  "raw row payload captured",
  "NEXT_PUBLIC_DATA_SOURCE=supabase approved",
  "scoreSource=real approved",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW",
  "public claims are approved"
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
