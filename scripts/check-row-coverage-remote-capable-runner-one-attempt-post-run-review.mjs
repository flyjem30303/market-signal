import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const executionGatePath =
  "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_ONE_ATTEMPT_EXECUTION_DECISION_GATE_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const executionGate = readFileSync(executionGatePath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Remote-Capable Runner One-Attempt Post-Run Review",
  "CP3 row coverage remote-capable runner one-attempt post-run review recorded",
  "REMOTE_ATTEMPT_RECORDED_COVERAGE_REMAINS_BLOCKED",
  "EXECUTION-001 command executed exactly once",
  "EXECUTION-005 command exit code was 1",
  "EXECUTION-006 status was blocked",
  "EXECUTION-007 reason was aggregate_count_incomplete",
  "EXECUTION-008 mode was row_coverage_readonly_remote_validation",
  "EXECUTION-009 preflightStatus was ready_for_guarded_readonly_decision",
  "EXECUTION-010 targetRelation was daily_prices",
  "EXECUTION-011 remoteAttempted was true",
  "EXECUTION-012 connectionAttempted was true",
  "EXECUTION-013 no SQL was executed",
  "EXECUTION-014 no Supabase write was performed",
  "EXECUTION-015 no files were written by the runner",
  "EXECUTION-016 no row payloads were printed",
  "EXECUTION-017 no secrets were printed",
  "OUTPUT-002 coverageStatus blocked",
  "OUTPUT-003 expectedSymbolCount 6",
  "OUTPUT-004 expectedTotalRows 360",
  "OUTPUT-005 observedTotalRows 0",
  "OUTPUT-006 missingRows 360",
  "OUTPUT-007 requiredTradingSessions 60",
  "OUTPUT-008 symbolsChecked empty sanitized list",
  "OUTPUT-009 problems sanitized count_unavailable for TWII, 0050, 006208, 2330, 2382, 2308",
  "OUTPUT-010 canAwardRowCoveragePoints false",
  "OUTPUT-011 canClaimCoverage false",
  "OUTPUT-012 canSetScoreSourceReal false",
  "OUTPUT-014 mutations false",
  "OUTPUT-015 publicDataSource mock",
  "OUTPUT-017 scoreSource mock",
  "OUTPUT-019 sqlExecuted false",
  "PROBLEM-001 TWII count_unavailable",
  "PROBLEM-002 0050 count_unavailable",
  "PROBLEM-003 006208 count_unavailable",
  "PROBLEM-004 2330 count_unavailable",
  "PROBLEM-005 2382 count_unavailable",
  "PROBLEM-006 2308 count_unavailable",
  "PROBLEM-007 observedTotalRows remained 0",
  "PROBLEM-008 missingRows remained 360",
  "SAFETY-001 did not run SQL",
  "SAFETY-002 did not write Supabase",
  "SAFETY-004 did not write daily_prices",
  "SAFETY-008 did not print secrets",
  "SAFETY-010 did not print row payloads",
  "SAFETY-012 public data source remained mock",
  "SAFETY-013 scoreSource remained mock",
  "SAFETY-014 canAwardRowCoveragePoints remained false",
  "SAFETY-016 CP3 remained not_ready",
  "CEO-FINDING-001 the attempt was useful because it crossed the runtime boundary safely and produced a concrete blocked result",
  "ENGINEERING-FINDING-002 the sanitized output is too coarse to distinguish policy denial, table absence, column mismatch, or network/API error",
  "DATA-FINDING-001 observedTotalRows 0 and missingRows 360 means no row coverage points can be awarded",
  "SECURITY-FINDING-001 service credentials were not printed and no key metadata was exposed",
  "LEGAL-PUBLIC-CLAIMS-FINDING-002 scoreSource=real remains blocked",
  "DECISION-001 remote attempt is recorded",
  "DECISION-002 row coverage evidence is not accepted",
  "DECISION-003 row coverage points remain unawarded",
  "DECISION-004 scoreSource remains mock",
  "DECISION-005 scoreSource=real remains blocked",
  "DECISION-007 CP3 remains not_ready",
  "DECISION-009 no second remote attempt is approved by this review",
  "NEXT-SLICE-001 add a local-only diagnostic plan for count_unavailable causes",
  "NEXT-SLICE-003 verify daily_prices relation and symbol column assumptions against existing schema docs and generated types",
  "NEXT-SLICE-005 do not run another row coverage remote attempt until a new one-attempt gate is recorded",
  "scripts/check-row-coverage-remote-capable-runner-one-attempt-post-run-review.mjs passes",
  "scripts/check-row-coverage-remote-capable-runner-one-attempt-execution-decision-gate.mjs passes",
  "scripts/check-row-coverage-readonly-guarded-runner.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "no second remote attempt occurs",
  "SQL execution remains blocked",
  "Supabase writes remain blocked"
];

const evidencePhrases = [
  {
    content: executionGate,
    file: executionGatePath,
    phrase: "ONE_ATTEMPT_GATE_PREPARED_EXECUTION_PAUSED_WHILE_USER_AWAY"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "mode: \"row_coverage_readonly_remote_validation\""
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "canAwardRowCoveragePoints: false"
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-remote-capable-runner-one-attempt-execution-decision-gate.mjs"
  }
];

const forbiddenPhrases = [
  "ROW_COVERAGE_POINTS_AWARDED",
  "scoreSource=real approved",
  "CP3_READY_NOW",
  "public claims are approved",
  "second remote attempt approved",
  "SQL execution is approved",
  "Supabase writes are approved",
  "raw rows copied",
  "secrets copied"
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
