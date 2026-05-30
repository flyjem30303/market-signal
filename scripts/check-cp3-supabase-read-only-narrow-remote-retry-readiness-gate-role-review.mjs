import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_NARROW_REMOTE_RETRY_READINESS_GATE_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only narrow remote-retry readiness gate role review recorded",
  "ACCEPT_NARROW_RETRY_READINESS_BOUNDARY_FOR_NEXT_DECISION",
  "does not approve a retry",
  "does not execute the\nvalidator",
  "does not set the confirmation variable",
  "does not connect to\nSupabase",
  "does not run SQL",
  "does not approve any write path",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_NARROW_REMOTE_RETRY_READINESS_GATE_2026-05-30.md",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_EXECUTION_ENVIRONMENT_DIAGNOSTIC_REPORT_2026-05-30.md",
  "scripts/check-cp3-supabase-read-only-narrow-remote-retry-readiness-gate.mjs",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs",
  "scripts/validate-supabase-readonly.mjs",
  "scripts/check-review-gates.mjs",
  "CEO-FINDING-001 the readiness gate is acceptable as a decision artifact",
  "CEO-FINDING-002 direct-node retry shape is strategically preferable to repeating the npm-wrapper path",
  "CEO-FINDING-003 actual retry still requires a separate exact-command execution gate",
  "PM-FINDING-001 the gate cleanly separates readiness review from execution",
  "PM-FINDING-004 the next slice should record the exact direct-node command shape if CEO continues",
  "ENGINEERING-FINDING-001 direct node invocation reduces npm-wrapper ambiguity from the prior blocked run",
  "ENGINEERING-FINDING-002 the command must load only NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY",
  "ENGINEERING-FINDING-003 SUPABASE_READONLY_VALIDATE_CONFIRMATION must be process-scoped",
  "ENGINEERING-FINDING-005 aggregate review gates must not execute the validator",
  "ENGINEERING-FINDING-006 retry command must stop after one attempt whether it returns ok, blocked, or shell error",
  "QA-FINDING-001 success output and failure output both require post-run review",
  "QA-FINDING-004 blocked or malformed output must not be treated as progress",
  "DATA-FINDING-001 future retry can only produce object reachability evidence",
  "DATA-FINDING-002 object reachability evidence alone does not validate historical market data",
  "DATA-FINDING-004 no staging rows or daily_prices rows may be written",
  "SECURITY-FINDING-002 env values must not be printed",
  "SECURITY-FINDING-003 key prefixes, suffixes, and lengths must not be printed",
  "SECURITY-FINDING-005 process-scoped confirmation is required to avoid persistent remote-run authorization",
  "LEGAL-FINDING-001 no public claim is created by this review",
  "LEGAL-FINDING-002 no scoreSource=real claim is authorized",
  "ACCEPT-001 readiness boundary may proceed to exact-command gate drafting",
  "ACCEPT-002 direct-node command shape may be proposed in the next slice",
  "ACCEPT-003 confirmation must remain process-scoped",
  "ACCEPT-004 only one future retry may be proposed",
  "ACCEPT-005 future retry must have immediate post-run review",
  "ACCEPT-006 full review gate must remain local-only",
  "ACCEPT-007 public data source must remain mock",
  "ACCEPT-008 scoreSource=real must remain blocked",
  "ACCEPT-009 CP3 source-depth production gate must remain not_ready",
  "BLOCKED-001 remote retry is not approved in this review",
  "BLOCKED-002 confirmation-enabled validator run is not approved in this review",
  "BLOCKED-003 Supabase connection is not approved in this review",
  "BLOCKED-004 SQL execution remains blocked",
  "BLOCKED-006 Supabase writes remain blocked",
  "BLOCKED-014 scoreSource=real remains blocked",
  "BLOCKED-015 CP3 source-depth readiness promotion remains blocked",
  "BLOCKED-016 public claims remain blocked",
  "The readiness boundary is accepted for next-step decision making.",
  "draft an exact direct-node retry command gate, not to execute immediately",
  "one-attempt, read-only,\nredacted, post-reviewed operating model",
  "NEXT-SLICE-001 draft exact direct-node retry command gate",
  "NEXT-SLICE-002 do not execute the retry in the command-gate draft slice",
  "NEXT-SLICE-003 include immediate post-run review requirements",
  "scripts/check-cp3-supabase-read-only-narrow-remote-retry-readiness-gate-role-review.mjs passes",
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
