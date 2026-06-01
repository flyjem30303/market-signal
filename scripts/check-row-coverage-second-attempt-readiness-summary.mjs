import { readFileSync } from "node:fs";

const packageJsonPath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const requiredArtifacts = [
  "docs/reviews/CP3_ROW_COVERAGE_QUERY_CONTRACT_REVISION_IMPLEMENTATION_REVIEW_2026-06-01.md",
  "docs/reviews/CP3_ROW_COVERAGE_SECOND_ATTEMPT_FINAL_LOCAL_PREFLIGHT_2026-06-01.md",
  "docs/reviews/CP3_ROW_COVERAGE_SECOND_ATTEMPT_SANITIZED_OUTPUT_CONTRACT_2026-06-01.md",
  "scripts/check-row-coverage-query-contract-revision-implementation-review.mjs",
  "scripts/check-row-coverage-second-attempt-final-local-preflight.mjs",
  "scripts/check-row-coverage-second-attempt-sanitized-output-contract.mjs",
  "scripts/check-row-coverage-second-attempt-output-sample-validation.mjs"
];

const requiredScripts = [
  "check:row-coverage-query-contract-revision-implementation-review",
  "check:row-coverage-second-attempt-final-local-preflight",
  "check:row-coverage-second-attempt-sanitized-output-contract",
  "check:row-coverage-second-attempt-output-sample-validation",
  "check:row-coverage-second-attempt-readiness-summary"
];

const requiredReviewGateNames = [
  "row-coverage-query-contract-revision-implementation-review",
  "row-coverage-second-attempt-final-local-preflight",
  "row-coverage-second-attempt-sanitized-output-contract",
  "row-coverage-second-attempt-output-sample-validation",
  "row-coverage-second-attempt-readiness-summary"
];

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const reviewGate = readFileSync(reviewGatePath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const failures = [];

for (const artifact of requiredArtifacts) {
  try {
    readFileSync(artifact, "utf8");
  } catch {
    failures.push(`missing required artifact: ${artifact}`);
  }
}

for (const scriptName of requiredScripts) {
  if (!packageJson.scripts?.[scriptName]) {
    failures.push(`missing package script: ${scriptName}`);
  }
}

for (const gateName of requiredReviewGateNames) {
  if (!reviewGate.includes(`name: "${gateName}"`)) {
    failures.push(`missing review gate entry: ${gateName}`);
  }
}

const requiredRunnerPhrases = [
  "ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION",
  ".from(\"stocks\")",
  ".select(\"id, symbol\")",
  ".in(\"symbol\", ALLOWED_SYMBOLS)",
  ".from(\"daily_prices\")",
  ".select(\"stock_id\", { count: \"exact\", head: true })",
  ".eq(\"stock_id\", stockId)",
  "canAwardRowCoveragePoints: false",
  "canClaimCoverage: false",
  "canSetScoreSourceReal: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "sqlExecuted: false"
];

for (const phrase of requiredRunnerPhrases) {
  if (!runner.includes(phrase)) {
    failures.push(`runner missing required phrase: ${phrase}`);
  }
}

const forbiddenRunnerPatterns = [
  /\.select\("symbol",\s*\{\s*count:\s*"exact",\s*head:\s*true\s*\}\)/,
  /\.eq\("symbol",\s*symbol\)/,
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /console\.(log|error|warn)\([^)]*process\.env/i,
  /keyPrefix/i,
  /keySuffix/i,
  /keyLength/i
];

for (const pattern of forbiddenRunnerPatterns) {
  if (pattern.test(runner)) {
    failures.push(`runner contains forbidden pattern: ${pattern}`);
  }
}

const reviewGateRunsRunner = /command:\s*\[node,\s*"scripts\/run-row-coverage-readonly-once\.mjs"\]/.test(reviewGate);
if (reviewGateRunsRunner) {
  failures.push("review gate must not execute the row coverage remote runner");
}

console.log(
  JSON.stringify(
    {
      nextDecision: "execute_exactly_one_supabase_readonly_attempt_only_after_explicit_active_approval",
      publicDataSource: "mock",
      readiness: failures.length === 0 ? "local_ready_remote_paused" : "blocked",
      scoreSource: "mock",
      stage: "row_coverage_second_attempt",
      status: failures.length === 0 ? "ok" : "blocked",
      unresolved: [
        "no_second_remote_attempt_executed_in_this_slice",
        "row_coverage_points_unawarded",
        "scoreSource_real_blocked",
        "CP3_not_ready",
        "git_backup_paused_under_current_instruction"
      ],
      failures
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exitCode = 1;
}
