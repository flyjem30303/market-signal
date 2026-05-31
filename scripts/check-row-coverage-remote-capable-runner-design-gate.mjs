import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_DESIGN_GATE_2026-06-01.md";
const postRunPath = "docs/reviews/CP3_ROW_COVERAGE_REVISED_RUNNER_SECOND_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const postRun = readFileSync(postRunPath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Remote-Capable Runner Design Gate",
  "CP3 row coverage remote-capable runner design gate recorded",
  "PREPARE_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_IMPLEMENTATION_ONLY",
  "preparation of a future implementation plan",
  "scripts/run-row-coverage-readonly-once.mjs",
  "does not modify the runner further",
  "does not add a Supabase client",
  "does not connect to Supabase",
  "does not read remote rows",
  "does not execute the command",
  "does not run SQL",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not print secrets",
  "does not set `scoreSource=real`",
  "does not award row coverage points",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "BASELINE-001 current file remains scripts/run-row-coverage-readonly-once.mjs",
  "BASELINE-002 current runner remains fail-closed without confirmation",
  "BASELINE-005 current runner remains no-remote skeleton",
  "BASELINE-006 current runner reports runner_skeleton_no_remote_execution",
  "BASELINE-007 current runner reports remoteAttempted false",
  "BASELINE-016 scripts/check-review-gates.mjs does not execute scripts/run-row-coverage-readonly-once.mjs",
  "ALLOW-CHANGE-001 may import createClient from @supabase/supabase-js only after implementation approval",
  "ALLOW-CHANGE-002 may instantiate Supabase client with persistSession false only after implementation approval",
  "ALLOW-CHANGE-006 may target daily_prices only",
  "ALLOW-CHANGE-007 may read only aggregate counts grouped by allowed symbol and date window",
  "ALLOW-CHANGE-008 may use head/count-style read-only queries when possible",
  "ALLOW-CHANGE-009 may return sanitized symbol-level coverage counts without row payloads",
  "ALLOW-CHANGE-010 may compute expectedTotalRows, observedTotalRows, missingRows, and coverageStatus",
  "ALLOW-CHANGE-011 may keep canAwardRowCoveragePoints false until post-run review accepts evidence",
  "FORBID-CODE-001 no insert",
  "FORBID-CODE-002 no update",
  "FORBID-CODE-003 no upsert",
  "FORBID-CODE-004 no delete",
  "FORBID-CODE-005 no rpc",
  "FORBID-CODE-006 no storage",
  "FORBID-CODE-007 no SQL strings for insert, update, delete, truncate, drop, alter, create, migration, or seed",
  "FORBID-CODE-008 no fetch market data",
  "FORBID-CODE-010 no writeFileSync",
  "FORBID-CODE-011 no appendFileSync",
  "FORBID-CODE-012 no console output of process.env values",
  "FORBID-CODE-016 no row payload output",
  "FORBID-CODE-018 no raw market data output",
  "FORBID-CODE-019 no scoreSource=real",
  "FORBID-CODE-020 no row coverage point award in runner",
  "STATIC-CHECK-001 must verify scripts/check-review-gates.mjs does not execute scripts/run-row-coverage-readonly-once.mjs",
  "STATIC-CHECK-002 must verify only approved Supabase client import appears",
  "STATIC-CHECK-003 must verify persistSession false appears if createClient appears",
  "STATIC-CHECK-004 must verify target relation remains daily_prices only",
  "STATIC-CHECK-005 must verify allowed symbols remain TWII, 0050, 006208, 2330, 2382, 2308",
  "STATIC-CHECK-006 must verify requiredTradingSessions remains 60",
  "STATIC-CHECK-007 must reject insert, update, upsert, delete, rpc, storage, SQL mutation strings, fetch, writeFileSync, and appendFileSync",
  "STATIC-CHECK-017 must verify canAwardRowCoveragePoints false",
  "STATIC-CHECK-018 must verify canSetScoreSourceReal false",
  "OUTPUT-002 mode: row_coverage_readonly_remote_validation",
  "OUTPUT-005 targetRelation: daily_prices",
  "OUTPUT-006 expectedSymbolCount: 6",
  "OUTPUT-007 requiredTradingSessions: 60",
  "OUTPUT-008 expectedTotalRows: 360",
  "OUTPUT-009 observedTotalRows: number | not_run",
  "OUTPUT-010 missingRows: number | not_run",
  "OUTPUT-014 remoteAttempted: true | false",
  "OUTPUT-023 canAwardRowCoveragePoints: false",
  "NOT-APPROVED-001 do not change scripts/run-row-coverage-readonly-once.mjs further in this slice",
  "NOT-APPROVED-002 do not add Supabase client in this slice",
  "NOT-APPROVED-003 do not run scripts/run-row-coverage-readonly-once.mjs against Supabase",
  "NOT-APPROVED-004 do not connect to Supabase",
  "NOT-APPROVED-005 do not read remote rows",
  "NOT-APPROVED-006 do not run SQL",
  "NOT-APPROVED-008 do not write Supabase",
  "NOT-APPROVED-018 do not modify .env.local",
  "NOT-APPROVED-019 do not set scoreSource=real",
  "NOT-APPROVED-020 do not award row coverage points",
  "FUTURE-APPROVAL-001 role review must accept this implementation gate draft",
  "FUTURE-APPROVAL-002 implementation slice must modify runner and static checker together",
  "FUTURE-APPROVAL-003 implementation slice must run static safety checker before any remote execution",
  "FUTURE-APPROVAL-008 execution gate must be the only gate that can allow one remote run",
  "bridge from local pre-remote readiness into a narrow remote-capable row coverage implementation",
  "add only the minimum confirmation-guarded read-only Supabase count path for `daily_prices`",
  "still require a separate execution gate before any remote run",
  "NEXT-SLICE-001 perform role review of this row coverage remote-capable runner design gate",
  "NEXT-SLICE-004 verify current runner remains no-remote skeleton in this slice",
  "NEXT-SLICE-005 keep scripts/check-review-gates.mjs from executing the runner",
  "scripts/check-row-coverage-remote-capable-runner-design-gate.mjs passes",
  "scripts/check-row-coverage-revised-runner-second-attempt-post-run-review.mjs passes",
  "scripts/check-row-coverage-readonly-guarded-runner.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "Supabase connection remains blocked",
  "SQL execution remains blocked"
];

const evidencePhrases = [
  {
    content: postRun,
    file: postRunPath,
    phrase: "Accepted as the completed local pre-remote readiness stage for row coverage."
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "mode: \"row_coverage_readonly_remote_validation\""
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-readonly-guarded-runner.mjs"
  }
];

const forbiddenPhrases = [
  "IMPLEMENT_ROW_COVERAGE_REMOTE_RUNNER_NOW",
  "REMOTE_ROW_COVERAGE_IMPLEMENTATION_APPROVED",
  "Supabase client is added",
  "Supabase connection is approved now",
  "remote rows may be read now",
  "SQL execution is approved",
  "Supabase writes are approved",
  "environment values are printed",
  ".env.local is modified",
  "scoreSource=real approved",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW",
  "public claims are approved",
  "may connect to Supabase now",
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
