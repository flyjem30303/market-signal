import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_LOCAL_IMPLEMENTATION_REVIEW_2026-06-01.md";
const prepGatePath = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_IMPLEMENTATION_PREP_SAFETY_GATE_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const guardedCheckerPath = "scripts/check-row-coverage-readonly-guarded-runner.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const prepGate = readFileSync(prepGatePath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const guardedChecker = readFileSync(guardedCheckerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Remote-Capable Runner Local Implementation Review",
  "CP3 row coverage remote-capable runner local implementation review recorded",
  "LOCAL_IMPLEMENTATION_ACCEPTED_REMOTE_EXECUTION_STILL_BLOCKED",
  "guarded row coverage runner and its static checker were updated locally",
  "does not run the runner with confirmation",
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
  "IMPLEMENTED-001 scripts/run-row-coverage-readonly-once.mjs imports createClient from @supabase/supabase-js",
  "IMPLEMENTED-002 scripts/run-row-coverage-readonly-once.mjs keeps exact confirmation CP3_ROW_COVERAGE_READONLY_VALIDATE",
  "IMPLEMENTED-006 scripts/run-row-coverage-readonly-once.mjs creates Supabase client only after confirmation and ready preflight",
  "IMPLEMENTED-007 scripts/run-row-coverage-readonly-once.mjs uses persistSession false",
  "IMPLEMENTED-008 scripts/run-row-coverage-readonly-once.mjs resolves stocks.symbol to stocks.id before daily_prices counts",
  "IMPLEMENTED-009 scripts/run-row-coverage-readonly-once.mjs keeps allowed symbols TWII, 0050, 006208, 2330, 2382, 2308",
  "IMPLEMENTED-010 scripts/run-row-coverage-readonly-once.mjs keeps requiredTradingSessions 60",
  "IMPLEMENTED-011 scripts/run-row-coverage-readonly-once.mjs computes expectedTotalRows 360",
  "IMPLEMENTED-012 scripts/run-row-coverage-readonly-once.mjs uses head/count aggregate reads only for daily_prices.stock_id",
  "IMPLEMENTED-013 scripts/run-row-coverage-readonly-once.mjs returns sanitized symbol identifiers and aggregate counts only",
  "IMPLEMENTED-014 scripts/check-row-coverage-readonly-guarded-runner.mjs allows only the approved Supabase SDK path",
  "IMPLEMENTED-015 scripts/check-row-coverage-readonly-guarded-runner.mjs verifies fail-closed behavior without confirmation",
  "IMPLEMENTED-016 scripts/check-row-coverage-readonly-guarded-runner.mjs rejects writes, SQL mutation strings, file writes, fetch, secret output, and row payload output",
  "IMPLEMENTED-017 scripts/check-review-gates.mjs still does not execute scripts/run-row-coverage-readonly-once.mjs",
  "FAIL-CLOSED-001 no confirmation returns status blocked",
  "FAIL-CLOSED-002 no confirmation returns reason missing_confirmation",
  "FAIL-CLOSED-003 no confirmation returns remoteAttempted false",
  "FAIL-CLOSED-004 no confirmation returns connectionAttempted false",
  "FAIL-CLOSED-007 no confirmation returns sqlExecuted false",
  "FAIL-CLOSED-008 no confirmation returns secretsPrinted false",
  "FAIL-CLOSED-009 no confirmation returns rowPayloadsPrinted false",
  "FAIL-CLOSED-010 no confirmation returns publicDataSource mock",
  "FAIL-CLOSED-011 no confirmation returns scoreSource mock",
  "BLOCKED-001 running run:row-coverage-readonly with confirmation",
  "BLOCKED-002 connecting to Supabase",
  "BLOCKED-003 reading remote counts",
  "BLOCKED-004 running SQL",
  "BLOCKED-005 writing Supabase",
  "BLOCKED-007 writing daily_prices",
  "BLOCKED-009 fetching or ingesting market data",
  "BLOCKED-010 printing secrets or key metadata",
  "BLOCKED-012 setting scoreSource=real",
  "BLOCKED-013 awarding row coverage points",
  "BLOCKED-015 clearing CP3 not_ready",
  "The local implementation is accepted as code-ready for a later one-attempt execution decision.",
  "governance should stop expanding",
  "No public score, readiness, or claim changes are allowed from this local implementation alone.",
  "NEXT-SLICE-001 prepare one-attempt execution decision gate only if the chairman is present or delegated approval is active",
  "NEXT-SLICE-002 do not run the confirmed command while the user is away",
  "NEXT-SLICE-007 keep Git backup paused under the current away instruction",
  "scripts/check-row-coverage-remote-capable-runner-local-implementation-review.mjs passes",
  "scripts/check-row-coverage-remote-capable-runner-implementation-prep-safety-gate.mjs passes",
  "scripts/check-row-coverage-readonly-guarded-runner.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "Supabase execution remains blocked while user is away",
  "SQL execution remains blocked"
];

const evidencePhrases = [
  {
    content: prepGate,
    file: prepGatePath,
    phrase: "APPROVE_NEXT_LOCAL_IMPLEMENTATION_SLICE_ONLY_NO_REMOTE_EXECUTION"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "import { createClient } from \"@supabase/supabase-js\""
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
    content: runner,
    file: runnerPath,
    phrase: "publicDataSource: \"mock\""
  },
  {
    content: guardedChecker,
    file: guardedCheckerPath,
    phrase: "expected one approved Supabase import"
  },
  {
    content: guardedChecker,
    file: guardedCheckerPath,
    phrase: "expected createClient import and call only"
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-readonly-guarded-runner.mjs"
  }
];

const forbiddenPhrases = [
  "REMOTE_EXECUTION_APPROVED",
  "RUN_CONFIRMED_COMMAND_NOW",
  "SQL execution is approved",
  "Supabase writes are approved",
  "scoreSource=real approved",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW",
  "public claims are approved",
  "may run SQL now",
  "may write remote data"
];

const forbiddenRunnerPatterns = [
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /\.storage\b/i,
  /insert\s+into/i,
  /delete\s+from/i,
  /update\s+public\./i,
  /truncate/i,
  /drop\s+table/i,
  /alter\s+table/i,
  /create\s+table/i,
  /fetch\s*\(/i,
  /writeFileSync/i,
  /appendFileSync/i,
  /console\.(log|error|warn)\([^)]*process\.env/i
];

if (runner.includes(".select(\"symbol\", { count: \"exact\", head: true })")) {
  forbiddenPhrases.push("runner still uses old daily_prices.symbol count path");
}

if (runner.includes(".eq(\"symbol\", symbol)")) {
  forbiddenPhrases.push("runner still filters daily_prices by symbol");
}

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
