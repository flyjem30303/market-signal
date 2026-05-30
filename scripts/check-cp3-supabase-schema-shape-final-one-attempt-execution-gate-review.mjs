import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_FINAL_ONE_ATTEMPT_EXECUTION_GATE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: `CP3 Supabase schema-shape final one-attempt execution gate review recorded`",
  "READY_FOR_NEXT_SLICE_ONE_ATTEMPT_SCHEMA_SHAPE_READ_ONLY_EXECUTION_DECISION",
  "does not execute the validator",
  "does not connect to Supabase",
  "does not set `SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION`",
  "does not modify `.env.local`",
  "does not run SQL",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "BASELINE-001 guarded validator implementation review is recorded",
  "BASELINE-002 scripts/validate-supabase-schema-shape-readonly.mjs is remote-capable only behind explicit confirmation",
  "BASELINE-005 validator remote-capable path uses rowLimit 0",
  "BASELINE-009 scripts/check-review-gates.mjs checks the static safety checker and does not execute the validator",
  "COMMAND-001 execution target is scripts\\validate-supabase-schema-shape-readonly.mjs",
  "COMMAND-002 confirmation variable is SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION",
  "COMMAND-003 confirmation value is CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE",
  "COMMAND-004 command must be direct-node and process-scoped",
  "COMMAND-005 command must run at most once",
  "COMMAND-006 command must not modify .env.local",
  "COMMAND-007 command must not be added to scripts/check-review-gates.mjs",
  "The command above is reviewed but not executed in this slice.",
  "PRE-RUN-001 scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs must pass",
  "PRE-RUN-002 scripts/check-cp3-supabase-schema-shape-guarded-validator-implementation-review.mjs must pass",
  "PRE-RUN-003 scripts/check-cp3-supabase-schema-shape-final-one-attempt-execution-gate-review.mjs must pass",
  "PRE-RUN-004 scripts/check-review-gates.mjs must pass",
  "PRE-RUN-005 TypeScript noEmit must pass",
  "PRE-RUN-006 validator source must be unchanged after this final gate review",
  "PRE-RUN-008 no environment value may be printed",
  "PRE-RUN-009 no row payload may be printed",
  "PRE-RUN-010 no retry loop may be used",
  "OUTPUT-001 record status only as ok or blocked",
  "OUTPUT-004 record env only as present or missing",
  "OUTPUT-006 record rowLimit as 0",
  "OUTPUT-009 do not record row payloads",
  "OUTPUT-010 do not record secrets, key prefixes, key suffixes, or key lengths",
  "STOP-001 stop if the exact command target changes",
  "STOP-004 stop if rowLimit is greater than 0",
  "STOP-005 stop if any insert, update, upsert, delete, RPC, storage, SQL, migration, seed, fetch, or file-write path appears",
  "STOP-006 stop if any environment value would be printed",
  "STOP-008 stop if any row payload or sample row would be printed",
  "STOP-011 stop if scoreSource=real would be set",
  "STOP-015 stop if more than one attempt is required",
  "CEO-FINDING-001 final gate review is sufficient to allow a next-slice one-attempt execution decision",
  "CEO-FINDING-002 current slice still does not execute Supabase",
  "PM-FINDING-001 next slice may be the one-attempt execution slice if all pre-run checks pass immediately before execution",
  "ENGINEERING-FINDING-003 aggregate gate remains local-only and does not run the validator",
  "SECURITY-FINDING-002 .env.local modification remains blocked",
  "LEGAL-FINDING-002 scoreSource=real remains blocked",
  "CEO accepts this final gate review as the last non-runtime checkpoint",
  "The next slice may execute the reviewed command once only if the immediate pre-run checks pass in that same slice.",
  "NEXT-SLICE-001 run immediate pre-run checks",
  "NEXT-SLICE-002 if all checks pass, execute exactly one schema-shape read-only validator attempt",
  "NEXT-SLICE-003 do not retry automatically",
  "NEXT-SLICE-004 capture only sanitized status fields",
  "NEXT-SLICE-005 create post-run review before any readiness or runtime claim change",
  "scripts/check-cp3-supabase-schema-shape-final-one-attempt-execution-gate-review.mjs passes",
  "scripts/check-cp3-supabase-schema-shape-guarded-validator-implementation-review.mjs passes",
  "scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "No Supabase connection is made in this slice",
  "No remote validation is executed in this slice",
  "No SQL is executed",
  "No Supabase write occurs",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "REMOTE_EXECUTION_PERFORMED",
  "RUN_VALIDATOR_IN_THIS_SLICE",
  "RUN_SUPABASE_NOW",
  "SQL execution is approved",
  "Supabase writes are approved",
  "row payloads may be printed",
  "environment values may be printed",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "CP3_READY_NOW",
  "may run SQL now",
  "may write remote data",
  "may print secrets"
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
