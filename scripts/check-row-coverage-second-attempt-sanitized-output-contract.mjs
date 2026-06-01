import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_SECOND_ATTEMPT_SANITIZED_OUTPUT_CONTRACT_2026-06-01.md";
const finalPreflightPath = "docs/reviews/CP3_ROW_COVERAGE_SECOND_ATTEMPT_FINAL_LOCAL_PREFLIGHT_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const finalPreflight = readFileSync(finalPreflightPath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Second Attempt Sanitized Output Contract",
  "CP3 row coverage second attempt sanitized output contract recorded",
  "SANITIZED_OUTPUT_CONTRACT_READY_REMOTE_EXECUTION_STILL_PAUSED",
  "does not run the confirmed command",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not write staging rows",
  "does not write `daily_prices`",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not print secrets",
  "does not print key prefixes, suffixes, or lengths",
  "does not output row payloads",
  "does not print `stock_id` values",
  "does not set `scoreSource=real`",
  "does not award row coverage points",
  "does not approve public claims",
  "OUTPUT-FIELD-001 mode",
  "OUTPUT-FIELD-002 status",
  "OUTPUT-FIELD-004 remoteAttempted",
  "OUTPUT-FIELD-005 connectionAttempted",
  "OUTPUT-FIELD-015 symbolsChecked with symbol and observedRows only",
  "OUTPUT-FIELD-016 problems with sanitized symbol-level reasons only",
  "OUTPUT-FIELD-017 filesWritten false",
  "OUTPUT-FIELD-018 mutations false",
  "OUTPUT-FIELD-019 sqlExecuted false",
  "OUTPUT-FIELD-020 secretsPrinted false",
  "OUTPUT-FIELD-021 rowPayloadsPrinted false",
  "OUTPUT-FIELD-022 publicDataSource mock",
  "OUTPUT-FIELD-023 scoreSource mock",
  "OUTPUT-FIELD-024 canAwardRowCoveragePoints false",
  "OUTPUT-FIELD-025 canClaimCoverage false",
  "OUTPUT-FIELD-026 canSetScoreSourceReal false",
  "FORBID-OUTPUT-001 no stock_id values",
  "FORBID-OUTPUT-002 no raw rows",
  "FORBID-OUTPUT-004 no Supabase URL",
  "FORBID-OUTPUT-005 no anon key",
  "FORBID-OUTPUT-006 no service role key",
  "FORBID-OUTPUT-010 no environment dump",
  "FORBID-OUTPUT-011 no SQL text",
  "ACCEPT-001 status ok only means aggregate count completeness; it does not approve scoreSource=real",
  "ACCEPT-007 aggregate_count_complete can move only to post-run review, not directly to public readiness",
  "ACCEPT-009 post-run review must be created before any readiness change",
  "ACCEPT-010 publicDataSource remains mock until a separate runtime activation gate accepts evidence",
  "ACCEPT-011 scoreSource remains mock until a separate score-source gate accepts evidence",
  "EVIDENCE-001 runner printSanitized appends canAwardRowCoveragePoints false",
  "EVIDENCE-006 runner printSanitized appends publicDataSource mock",
  "EVIDENCE-008 runner printSanitized appends scoreSource mock",
  "EVIDENCE-011 runner symbolsChecked includes symbol and observedRows only",
  "EVIDENCE-012 runner does not include stock_id in symbolsChecked",
  "EVIDENCE-013 runner does not console.log process.env",
  "CEO-FINDING-001 this contract is enough; the project should not add more local-only gates before a future approved readonly attempt",
  "scripts/check-row-coverage-second-attempt-sanitized-output-contract.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "no second remote attempt occurs",
  "SQL execution remains blocked",
  "Supabase writes remain blocked"
];

const evidencePhrases = [
  {
    content: finalPreflight,
    file: finalPreflightPath,
    phrase: "SECOND_ATTEMPT_LOCALLY_READY_REMOTE_EXECUTION_STILL_PAUSED"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "function printSanitized(payload)"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "canAwardRowCoveragePoints: false"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "canClaimCoverage: false"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "canSetScoreSourceReal: false"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "publicDataSource: \"mock\""
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "scoreSource: \"mock\""
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "rowPayloadsPrinted: false"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "secretsPrinted: false"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "sqlExecuted: false"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "symbolsChecked: counts.map((item) => ({"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "observedRows: item.count"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "symbol: item.symbol"
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-second-attempt-sanitized-output-contract.mjs"
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

const forbiddenRunnerPatterns = [
  /console\.(log|error|warn)\([^)]*process\.env/i,
  /console\.(log|error|warn)\([^)]*SUPABASE/i,
  /keyPrefix/i,
  /keySuffix/i,
  /keyLength/i,
  /rawRows/i,
  /rowPayload:\s*[^f]/i,
  /rowPayloads:\s*[^f]/i,
  /symbolsChecked:\s*counts\.map[\s\S]*stock_id/i,
  /symbolsChecked:\s*counts\.map[\s\S]*stockId/i,
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /insert\s+into/i,
  /update\s+public\./i,
  /delete\s+from/i,
  /create\s+table/i,
  /alter\s+table/i,
  /drop\s+table/i
];

const missing = [
  ...requiredPhrases.filter((phrase) => !content.includes(phrase)).map((phrase) => `${target}: ${phrase}`),
  ...evidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = [
  ...forbiddenPhrases.filter((phrase) => content.includes(phrase)),
  ...forbiddenRunnerPatterns.filter((pattern) => pattern.test(runner)).map((pattern) => `${runnerPath}: ${pattern}`)
];
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
