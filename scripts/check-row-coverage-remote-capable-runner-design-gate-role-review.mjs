import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_DESIGN_GATE_ROLE_REVIEW_2026-06-01.md";
const designGatePath = "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_DESIGN_GATE_2026-06-01.md";
const postRunPath = "docs/reviews/CP3_ROW_COVERAGE_REVISED_RUNNER_SECOND_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";
const guardedCheckerPath = "scripts/check-row-coverage-readonly-guarded-runner.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const content = readFileSync(target, "utf8");
const designGate = readFileSync(designGatePath, "utf8");
const postRun = readFileSync(postRunPath, "utf8");
const runner = readFileSync(runnerPath, "utf8");
const guardedChecker = readFileSync(guardedCheckerPath, "utf8");
const reviewGate = readFileSync(reviewGatePath, "utf8");

const requiredPhrases = [
  "CP3 Row Coverage Remote-Capable Runner Design Gate Role Review",
  "CP3 row coverage remote-capable runner design gate role review recorded",
  "ACCEPT_DESIGN_GATE_FOR_FUTURE_GUARDED_IMPLEMENTATION_PREP_ONLY",
  "accepts the design gate as sufficient for a future bounded implementation-preparation slice",
  "does not modify `scripts/run-row-coverage-readonly-once.mjs`",
  "does not add a Supabase client",
  "does not connect to Supabase",
  "does not read remote rows",
  "does not execute the runner",
  "does not run SQL",
  "does not write Supabase",
  "does not write staging rows",
  "does not write `daily_prices`",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not print secrets",
  "does not set `scoreSource=real`",
  "does not award row coverage points",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "REVIEWED-001 docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_DESIGN_GATE_2026-06-01.md",
  "REVIEWED-002 scripts/check-row-coverage-remote-capable-runner-design-gate.mjs",
  "REVIEWED-003 docs/reviews/CP3_ROW_COVERAGE_REVISED_RUNNER_SECOND_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md",
  "REVIEWED-004 scripts/check-row-coverage-revised-runner-second-attempt-post-run-review.mjs",
  "REVIEWED-005 scripts/run-row-coverage-readonly-once.mjs",
  "REVIEWED-006 scripts/check-row-coverage-readonly-guarded-runner.mjs",
  "REVIEWED-007 scripts/check-review-gates.mjs",
  "CEO-FINDING-001 accept the design gate",
  "PM-FINDING-001 this is the right acceleration point",
  "ENGINEERING-FINDING-001 the future code boundary is narrow",
  "QA-FINDING-001 acceptance must stay evidence-based",
  "DATA-FINDING-001 only aggregate counts are in scope",
  "SECURITY-FINDING-001 secrets must stay presence-only",
  "LEGAL-PUBLIC-CLAIMS-FINDING-001 public data source remains mock and scoreSource remains mock",
  "ACCEPT-001 design gate is accepted for future guarded implementation preparation only",
  "ACCEPT-002 current runner remains unchanged in this role review slice",
  "ACCEPT-003 current runner remains fail-closed without confirmation",
  "ACCEPT-004 current runner remains no-remote skeleton",
  "ACCEPT-005 current runner reports runner_skeleton_no_remote_execution",
  "ACCEPT-006 scripts/check-review-gates.mjs does not execute scripts/run-row-coverage-readonly-once.mjs",
  "ACCEPT-007 Supabase connection remains blocked",
  "ACCEPT-008 SQL execution remains blocked",
  "ACCEPT-009 Supabase writes remain blocked",
  "ACCEPT-014 publicDataSource remains mock",
  "ACCEPT-015 scoreSource remains mock and scoreSource=real remains blocked",
  "ACCEPT-016 row coverage points remain unawarded",
  "ACCEPT-017 CP3 remains not_ready",
  "ACCEPT-018 public claims remain blocked",
  "ACCEPT-019 future implementation must modify runner and static checker together",
  "ACCEPT-020 future implementation must not execute the runner against Supabase",
  "ACCEPT-021 future execution requires a separate one-attempt execution gate",
  "BLOCKED-001 adding a Supabase client in this role review slice",
  "BLOCKED-002 connecting to Supabase in this role review slice",
  "BLOCKED-003 reading remote rows in this role review slice",
  "BLOCKED-004 running SQL or migrations",
  "BLOCKED-005 writing Supabase",
  "BLOCKED-008 fetching or ingesting market data",
  "BLOCKED-009 printing secrets or key metadata",
  "BLOCKED-011 setting scoreSource=real",
  "BLOCKED-012 awarding row coverage points",
  "BLOCKED-014 clearing CP3 not_ready",
  "The design gate is accepted.",
  "one bounded implementation-preparation slice",
  "adds the remote-capable read-only count path behind exact confirmation",
  "updates the static checker in the same slice",
  "must still avoid remote execution",
  "keep public data source mock",
  "keep `scoreSource=real` blocked",
  "keep row coverage points unawarded",
  "NEXT-SLICE-001 implement the guarded remote-capable runner path behind exact confirmation only",
  "NEXT-SLICE-002 update scripts/check-row-coverage-readonly-guarded-runner.mjs in the same slice",
  "NEXT-SLICE-003 allow only approved Supabase client import and persistSession false",
  "NEXT-SLICE-004 target daily_prices only",
  "NEXT-SLICE-005 read aggregate counts only, with no row payload output",
  "NEXT-SLICE-006 keep scripts/check-review-gates.mjs from executing the runner",
  "NEXT-SLICE-008 do not run the runner against Supabase in the implementation slice",
  "scripts/check-row-coverage-remote-capable-runner-design-gate-role-review.mjs passes",
  "scripts/check-row-coverage-remote-capable-runner-design-gate.mjs passes",
  "scripts/check-row-coverage-revised-runner-second-attempt-post-run-review.mjs passes",
  "scripts/check-row-coverage-readonly-guarded-runner.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "Next build passes",
  "localhost health passes",
  "Supabase connection remains blocked",
  "SQL execution remains blocked",
  "public claims remain blocked"
];

const evidencePhrases = [
  {
    content: designGate,
    file: designGatePath,
    phrase: "PREPARE_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_IMPLEMENTATION_ONLY"
  },
  {
    content: designGate,
    file: designGatePath,
    phrase: "still require a separate execution gate before any remote run"
  },
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
    content: guardedChecker,
    file: guardedCheckerPath,
    phrase: "persistSession: false"
  },
  {
    content: reviewGate,
    file: reviewGatePath,
    phrase: "scripts/check-row-coverage-remote-capable-runner-design-gate.mjs"
  }
];

const forbiddenPhrases = [
  "IMPLEMENT_NOW",
  "REMOTE_EXECUTION_APPROVED",
  "Supabase connection is approved",
  "remote rows are approved",
  "SQL execution is approved",
  "Supabase writes are approved",
  "environment values may be printed",
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
