import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_IMPLEMENTATION_PREP_SAFETY_GATE_2026-06-01.md";
const roleReviewPath = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_DESIGN_GATE_ROLE_REVIEW_2026-06-01.md";
const designGatePath = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_DESIGN_GATE_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const guardedCheckerPath = "scripts/check-row-coverage-readonly-guarded-runner.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const roleReview = readFileSync(roleReviewPath, "utf8");
const designGate = readFileSync(designGatePath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const guardedChecker = readFileSync(guardedCheckerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Remote-Capable Runner Implementation Prep Safety Gate",
  "CP3 row coverage remote-capable runner implementation prep safety gate recorded",
  "APPROVE_NEXT_LOCAL_IMPLEMENTATION_SLICE_ONLY_NO_REMOTE_EXECUTION",
  "next local code implementation slice",
  "does not implement code in this slice",
  "does not add a Supabase client in this slice",
  "does not connect to Supabase",
  "does not execute the runner",
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
  "AUTHORIZED-001 modify scripts/run-row-coverage-readonly-once.mjs",
  "AUTHORIZED-002 modify scripts/check-row-coverage-readonly-guarded-runner.mjs in the same slice",
  "AUTHORIZED-004 keep scripts/check-review-gates.mjs from executing scripts/run-row-coverage-readonly-once.mjs",
  "AUTHORIZED-005 permit exactly one approved import path: @supabase/supabase-js",
  "AUTHORIZED-006 permit createClient only for the guarded readonly runner path",
  "AUTHORIZED-007 require persistSession false when createClient appears",
  "AUTHORIZED-010 target daily_prices only",
  "AUTHORIZED-011 keep allowed symbols TWII, 0050, 006208, 2330, 2382, 2308",
  "AUTHORIZED-012 keep requiredTradingSessions 60",
  "AUTHORIZED-013 read aggregate counts only",
  "AUTHORIZED-014 return sanitized totals and symbol identifiers only",
  "AUTHORIZED-015 keep remote execution blocked during implementation validation",
  "GUARD-001 missing confirmation must return status blocked",
  "GUARD-002 missing confirmation must return remoteAttempted false",
  "GUARD-003 missing confirmation must return connectionAttempted false",
  "GUARD-006 confirmation value must remain CP3_ROW_COVERAGE_READONLY_VALIDATE",
  "GUARD-007 confirmation variable must remain ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION",
  "GUARD-008 any remote-capable branch must be unreachable without exact confirmation",
  "GUARD-010 canAwardRowCoveragePoints must remain false",
  "GUARD-013 publicDataSource must remain mock",
  "GUARD-014 scoreSource must remain mock",
  "GUARD-017 sqlExecuted must remain false",
  "GUARD-018 secretsPrinted must remain false",
  "GUARD-019 rowPayloadsPrinted must remain false",
  "FORBID-001 no insert",
  "FORBID-002 no update",
  "FORBID-003 no upsert",
  "FORBID-004 no delete",
  "FORBID-005 no rpc",
  "FORBID-006 no storage",
  "FORBID-007 no SQL mutation strings",
  "FORBID-008 no fetch market data",
  "FORBID-010 no writeFileSync",
  "FORBID-011 no appendFileSync",
  "FORBID-012 no console output of process.env values",
  "FORBID-016 no row payload output",
  "FORBID-018 no raw market data output",
  "FORBID-019 no scoreSource=real",
  "FORBID-020 no row coverage point award in runner",
  "FORBID-024 no runner execution from scripts/check-review-gates.mjs",
  "CHECKER-001 allow @supabase/supabase-js only after this gate",
  "CHECKER-002 allow createClient only if persistSession false is present",
  "CHECKER-003 reject any relation other than daily_prices",
  "CHECKER-004 reject forbidden write and SQL patterns",
  "CHECKER-009 verify fail-closed execution without confirmation",
  "CHECKER-010 verify review gate does not execute the runner",
  "VERIFY-001 run check:row-coverage-remote-capable-runner-implementation-prep-safety-gate",
  "VERIFY-002 run check:row-coverage-readonly-guarded-runner",
  "VERIFY-003 run check:review-gates",
  "VERIFY-004 run npm run build",
  "VERIFY-005 run check:localhost-health",
  "VERIFY-007 do not run run:row-coverage-readonly against Supabase in the implementation slice",
  "This is the last local safety gate before a code implementation slice.",
  "modify the guarded runner and its static checker together",
  "stop before any Supabase execution",
  "avoids further slow governance loops",
  "NEXT-SLICE-001 implement guarded readonly aggregate-count path locally",
  "NEXT-SLICE-002 update static checker to inspect the new code",
  "NEXT-SLICE-004 keep Supabase execution for a later explicit one-attempt gate",
  "scripts/check-row-coverage-remote-capable-runner-implementation-prep-safety-gate.mjs passes",
  "scripts/check-row-coverage-remote-capable-runner-design-gate-role-review.mjs passes",
  "scripts/check-row-coverage-readonly-guarded-runner.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "Supabase connection remains blocked in this slice",
  "SQL execution remains blocked"
];

const evidencePhrases = [
  {
    content: roleReview,
    file: roleReviewPath,
    phrase: "The design gate is accepted."
  },
  {
    content: roleReview,
    file: roleReviewPath,
    phrase: "future execution requires a separate one-attempt execution gate"
  },
  {
    content: designGate,
    file: designGatePath,
    phrase: "still require a separate execution gate before any remote run"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "mode: \"row_coverage_readonly_remote_validation\""
  },
  {
    content: guardedChecker,
    file: guardedCheckerPath,
    phrase: "persistSession: false"
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-remote-capable-runner-design-gate-role-review.mjs"
  }
];

const forbiddenPhrases = [
  "REMOTE_EXECUTION_APPROVED",
  "RUN_SUPABASE_NOW",
  "SQL execution is approved",
  "Supabase writes are approved",
  "print environment values",
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
