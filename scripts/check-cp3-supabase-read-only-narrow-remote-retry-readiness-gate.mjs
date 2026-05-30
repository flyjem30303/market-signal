import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_NARROW_REMOTE_RETRY_READINESS_GATE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only narrow remote-retry readiness gate recorded",
  "DRAFT_NARROW_REMOTE_RETRY_READINESS_BOUNDARY",
  "does not approve a retry now",
  "does not execute the validator",
  "does not set\nthe confirmation variable",
  "does not connect to Supabase",
  "does not run SQL",
  "does not approve any write path",
  "RATIONALE-001 local node availability has been confirmed",
  "RATIONALE-002 local npm availability has been confirmed",
  "RATIONALE-004 required Supabase env names can be loaded as present without printing values",
  "RATIONALE-006 validator fail-closed behavior works with env but without confirmation",
  "RATIONALE-008 remaining uncertainty is isolated to confirmation-enabled remote path or execution boundary",
  "RETRY-SHAPE-001 future retry must be a single explicit command invocation",
  "RETRY-SHAPE-002 future retry must load only the three required Supabase env names",
  "RETRY-SHAPE-003 future retry must set SUPABASE_READONLY_VALIDATE_CONFIRMATION only inside the command process",
  "RETRY-SHAPE-004 future retry should prefer direct node invocation over npm wrapper if CEO accepts the change",
  "RETRY-SHAPE-005 future retry must not run through scripts/check-review-gates.mjs",
  "RETRY-SHAPE-008 future retry must stop after one attempt whether it succeeds or fails",
  "PRE-RETRY-001 this readiness gate must pass",
  "PRE-RETRY-002 a role review of this readiness gate must pass",
  "PRE-RETRY-003 validator safety checker must pass after any command-shape adjustment",
  "PRE-RETRY-007 CEO must record the exact command shape for the retry",
  "PRE-RETRY-008 post-run review file must be prepared as the immediate next slice",
  "NOT-APPROVED-001 no retry is approved by this gate",
  "NOT-APPROVED-002 no confirmation-enabled validator run is approved by this gate",
  "NOT-APPROVED-003 no Supabase connection is approved by this gate",
  "NOT-APPROVED-004 no SQL execution is approved",
  "NOT-APPROVED-006 no Supabase writes are approved",
  "NOT-APPROVED-012 no .env.local modification is approved",
  "NOT-APPROVED-014 no scoreSource=real is approved",
  "NOT-APPROVED-015 no CP3 source-depth readiness promotion is approved",
  "NOT-APPROVED-016 no public claim is approved",
  "OUTPUT-003 future retry must not print row payloads",
  "OUTPUT-004 future retry must not print secrets",
  "OUTPUT-005 future retry must not print key prefixes",
  "OUTPUT-006 future retry must not print key suffixes",
  "OUTPUT-007 future retry must not print key lengths",
  "STOP-001 stop if command shape would print env values",
  "STOP-002 stop if command shape would persist confirmation beyond the process",
  "STOP-003 stop if command shape would run SQL or mutate data",
  "STOP-009 stop if output redaction cannot be guaranteed",
  "CEO-FINDING-001 a future retry may be justified only after this readiness gate is role-reviewed",
  "ENGINEERING-FINDING-001 direct node invocation may reduce npm wrapper ambiguity",
  "ENGINEERING-FINDING-002 command shape must keep confirmation process-scoped",
  "ENGINEERING-FINDING-003 retry must not alter validator behavior or aggregate gates",
  "SECURITY-FINDING-001 redaction remains the highest-risk control",
  "The project is not ready to retry Supabase remote validation immediately.",
  "ready to review a narrow retry boundary",
  "gate is preparation, not execution",
  "NEXT-SLICE-001 perform role review of this narrow remote-retry readiness gate",
  "NEXT-SLICE-002 do not execute the retry during role review",
  "NEXT-SLICE-003 decide whether a direct-node retry command shape should be approved",
  "scripts/check-cp3-supabase-read-only-narrow-remote-retry-readiness-gate.mjs passes",
  "scripts/check-cp3-supabase-read-only-execution-environment-diagnostic-report.mjs passes",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "Supabase remote validation retry remains blocked",
  "SQL execution remains blocked",
  "Supabase writes remain blocked",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "REMOTE_RETRY_APPROVED_NOW",
  "RUN_SUPABASE_NOW",
  "CONFIRMATION_ENABLED_RUN_APPROVED",
  "ALLOW_SQL_EXECUTION",
  "ALLOW_SUPABASE_WRITES",
  "ALLOW_INSERT_UPDATE_UPSERT_DELETE",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "market ingestion is approved",
  "schema changes are approved"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

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
