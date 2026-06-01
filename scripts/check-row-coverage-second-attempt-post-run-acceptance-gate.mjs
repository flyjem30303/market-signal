import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_SECOND_ATTEMPT_POST_RUN_ACCEPTANCE_GATE_2026-06-01.md";
const summaryPath = "scripts/check-row-coverage-second-attempt-readiness-summary.mjs";
const sampleValidationPath = "scripts/check-row-coverage-second-attempt-output-sample-validation.mjs";
const outputContractPath = "docs/reviews/CP3_ROW_COVERAGE_SECOND_ATTEMPT_SANITIZED_OUTPUT_CONTRACT_2026-06-01.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const summary = readFileSync(summaryPath, "utf8");
const sampleValidation = readFileSync(sampleValidationPath, "utf8");
const outputContract = readFileSync(outputContractPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Second Attempt Post-Run Acceptance Gate",
  "CP3 row coverage second attempt post-run acceptance gate recorded",
  "POST_RUN_ACCEPTANCE_RULES_READY_REMOTE_EXECUTION_STILL_PAUSED",
  "does not run the confirmed command",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not write staging rows",
  "does not write `daily_prices`",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not print secrets",
  "does not output row payloads",
  "does not print `stock_id` values",
  "does not set `scoreSource=real`",
  "does not award row coverage points",
  "does not approve public claims",
  "BLOCKED-ACCEPT-001 status blocked with stock_mapping_unavailable is accepted as diagnostic evidence only",
  "BLOCKED-ACCEPT-002 status blocked with stock_mapping_missing is accepted as diagnostic evidence only",
  "BLOCKED-ACCEPT-003 status blocked with count_unavailable is accepted as diagnostic evidence only",
  "BLOCKED-ACCEPT-004 status blocked with aggregate_count_incomplete is accepted as diagnostic evidence only",
  "OK-ACCEPT-001 status ok requires aggregate_count_complete",
  "OK-ACCEPT-002 status ok requires observedTotalRows 360",
  "OK-ACCEPT-003 status ok requires missingRows 0",
  "OK-ACCEPT-004 status ok requires six sanitized symbolsChecked entries",
  "OK-ACCEPT-007 status ok does not approve scoreSource=real",
  "OK-ACCEPT-010 status ok must proceed to post-run review before any readiness change",
  "REJECT-001 any output containing stock_id is rejected",
  "REJECT-006 any output containing key prefix, key suffix, or key length is rejected",
  "REJECT-007 any output with sqlExecuted true is rejected",
  "REJECT-008 any output with mutations true is rejected",
  "REJECT-009 any output with rowPayloadsPrinted true is rejected",
  "REJECT-010 any output with secretsPrinted true is rejected",
  "REJECT-011 any output with canAwardRowCoveragePoints true is rejected",
  "REJECT-012 any output with canSetScoreSourceReal true is rejected",
  "POSTRUN-001 record execution count exactly one",
  "POSTRUN-004 record symbolsChecked as symbol and observedRows only",
  "POSTRUN-006 keep publicDataSource mock",
  "POSTRUN-007 keep scoreSource mock",
  "POSTRUN-010 create a separate runtime activation gate before any public source promotion",
  "POSTRUN-011 create a separate score-source gate before any scoreSource=real promotion",
  "CEO-FINDING-001 this is the last useful local post-run classification work before an approved readonly attempt",
  "PM-FINDING-001 the project should not add more row coverage process gates unless a real run produces a new issue",
  "scripts/check-row-coverage-second-attempt-post-run-acceptance-gate.mjs passes",
  "scripts/check-row-coverage-second-attempt-readiness-summary.mjs passes",
  "scripts/check-row-coverage-second-attempt-output-sample-validation.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "no second remote attempt occurs",
  "SQL execution remains blocked",
  "Supabase writes remain blocked"
];

const evidencePhrases = [
  {
    content: summary,
    file: summaryPath,
    phrase: "local_ready_remote_paused"
  },
  {
    content: sampleValidation,
    file: sampleValidationPath,
    phrase: "blocked_count_unavailable"
  },
  {
    content: sampleValidation,
    file: sampleValidationPath,
    phrase: "ok_aggregate_count_complete"
  },
  {
    content: sampleValidation,
    file: sampleValidationPath,
    phrase: "forbidden_internal_and_secret_metadata"
  },
  {
    content: outputContract,
    file: outputContractPath,
    phrase: "SANITIZED_OUTPUT_CONTRACT_READY_REMOTE_EXECUTION_STILL_PAUSED"
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-second-attempt-post-run-acceptance-gate.mjs"
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
  "stock_id values printed",
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
