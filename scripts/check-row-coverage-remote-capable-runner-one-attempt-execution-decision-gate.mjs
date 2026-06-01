import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_ONE_ATTEMPT_EXECUTION_DECISION_GATE_2026-06-01.md";
const implementationReviewPath =
  "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_LOCAL_IMPLEMENTATION_REVIEW_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const guardedCheckerPath = "scripts/check-row-coverage-readonly-guarded-runner.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const implementationReview = readFileSync(implementationReviewPath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const guardedChecker = readFileSync(guardedCheckerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Remote-Capable Runner One-Attempt Execution Decision Gate",
  "CP3 row coverage remote-capable runner one-attempt execution decision gate recorded",
  "ONE_ATTEMPT_GATE_PREPARED_EXECUTION_PAUSED_WHILE_USER_AWAY",
  "does not run the command",
  "does not set the confirmation environment variable in this slice",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not write staging rows",
  "does not write `daily_prices`",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not output row payloads",
  "does not print secrets",
  "does not set `scoreSource=real`",
  "does not award row coverage points",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "PAUSED-001 user is currently away",
  "PAUSED-008 this gate therefore records the future decision packet only",
  "PAUSED-009 this gate does not execute the confirmed runner",
  "PAUSED-010 execution requires chairman return or explicit delegated approval in the active conversation",
  "COMMAND-001 command shell: PowerShell",
  "COMMAND-003 command: $env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION=\"CP3_ROW_COVERAGE_READONLY_VALIDATE\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-row-coverage-readonly-once.mjs",
  "COMMAND-004 execute at most once",
  "COMMAND-005 do not pipe output to a file",
  "COMMAND-006 do not redirect output to a file",
  "COMMAND-007 do not print environment values",
  "COMMAND-011 do not run through scripts/check-review-gates.mjs",
  "PRECHECK-001 check:row-coverage-readonly-guarded-runner must pass",
  "PRECHECK-002 check:row-coverage-remote-capable-runner-local-implementation-review must pass",
  "PRECHECK-003 check:row-coverage-remote-capable-runner-one-attempt-execution-decision-gate must pass",
  "PRECHECK-004 check:review-gates must pass",
  "PRECHECK-005 npm run build must pass",
  "PRECHECK-008 NEXT_PUBLIC_DATA_SOURCE must remain mock",
  "OUTPUT-002 mode row_coverage_readonly_remote_validation",
  "OUTPUT-003 targetRelation daily_prices",
  "OUTPUT-004 expectedSymbolCount 6",
  "OUTPUT-005 requiredTradingSessions 60",
  "OUTPUT-006 expectedTotalRows 360",
  "OUTPUT-006A queryContract resolve stocks.symbol to stocks.id, then count daily_prices.stock_id",
  "OUTPUT-009 symbolsChecked sanitized symbol identifiers and aggregate observedRows only",
  "OUTPUT-014 filesWritten false",
  "OUTPUT-015 mutations false",
  "OUTPUT-016 sqlExecuted false",
  "OUTPUT-017 secretsPrinted false",
  "OUTPUT-018 rowPayloadsPrinted false",
  "OUTPUT-019 publicDataSource mock",
  "OUTPUT-020 scoreSource mock",
  "OUTPUT-021 canAwardRowCoveragePoints false",
  "FORBID-001 no SQL",
  "FORBID-002 no Supabase write",
  "FORBID-004 no daily_prices write",
  "FORBID-006 no market data fetch",
  "FORBID-009 no row payload output",
  "FORBID-010 no secret output",
  "FORBID-012 no scoreSource=real",
  "FORBID-016 no automatic Git commit while user is away",
  "POSTRUN-001 create a post-run review document before any readiness change",
  "POSTRUN-002 record whether command ran exactly once",
  "POSTRUN-012 do not copy raw rows",
  "POSTRUN-015 keep scoreSource mock until a separate score-source gate is approved",
  "POSTRUN-016 keep CP3 not_ready until all CP3 blockers are cleared",
  "one exact read-only row coverage attempt can be considered when the chairman is present",
  "The current stage is ready for human-visible decision rather than more local-only expansion.",
  "NEXT-SLICE-001 while user is away, stop before confirmed remote execution",
  "NEXT-SLICE-002 if another heartbeat arrives before the user returns, maintain checks and localhost health only",
  "NEXT-SLICE-003 when user returns, report this gate and request whether to execute the one future attempt",
  "scripts/check-row-coverage-remote-capable-runner-one-attempt-execution-decision-gate.mjs passes",
  "scripts/check-row-coverage-remote-capable-runner-local-implementation-review.mjs passes",
  "scripts/check-row-coverage-readonly-guarded-runner.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "confirmed runner command not executed",
  "Supabase execution remains paused while user is away",
  "SQL execution remains blocked"
];

const evidencePhrases = [
  {
    content: implementationReview,
    file: implementationReviewPath,
    phrase: "LOCAL_IMPLEMENTATION_ACCEPTED_REMOTE_EXECUTION_STILL_BLOCKED"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "mode: \"row_coverage_readonly_remote_validation\""
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "persistSession: false"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".from(\"stocks\")"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".select(\"id, symbol\")"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".in(\"symbol\", ALLOWED_SYMBOLS)"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".from(\"daily_prices\")"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".select(\"stock_id\", { count: \"exact\", head: true })"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: ".eq(\"stock_id\", stockId)"
  },
  {
    content: guardedChecker,
    file: guardedCheckerPath,
    phrase: "expected one approved Supabase import"
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-remote-capable-runner-local-implementation-review.mjs"
  }
];

const forbiddenPhrases = [
  "RUN_CONFIRMED_COMMAND_NOW",
  "EXECUTION_COMPLETED",
  "SQL execution is approved",
  "Supabase writes are approved",
  "scoreSource=real approved",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW",
  "public claims are approved",
  "may run SQL now",
  "may write remote data"
];

const missing = [
  ...requiredPhrases.filter((phrase) => !content.includes(phrase)).map((phrase) => `${target}: ${phrase}`),
  ...evidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = forbiddenPhrases.filter((phrase) => content.includes(phrase));
const reviewGateRunsRunner = /command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate);

if (reviewGateRunsRunner) {
  forbidden.push(`${reviewGatePath}: review gate must not execute row coverage runner`);
}

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
