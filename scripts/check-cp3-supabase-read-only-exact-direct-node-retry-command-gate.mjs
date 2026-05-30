import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_EXACT_DIRECT_NODE_RETRY_COMMAND_GATE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only exact direct-node retry command gate recorded",
  "DRAFT_EXACT_DIRECT_NODE_RETRY_COMMAND_GATE",
  "does not approve execution",
  "does not execute the\nvalidator",
  "does not set the confirmation variable in this slice",
  "does not\nconnect to Supabase",
  "does not run SQL",
  "does not approve any write path",
  "COMMAND-SHAPE-001 use direct node invocation",
  "COMMAND-SHAPE-002 executable is C:\\Program Files\\nodejs\\node.exe",
  "COMMAND-SHAPE-003 script is scripts\\validate-supabase-readonly.mjs",
  "COMMAND-SHAPE-004 load only NEXT_PUBLIC_SUPABASE_URL from .env.local",
  "COMMAND-SHAPE-005 load only NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local",
  "COMMAND-SHAPE-006 load only SUPABASE_SERVICE_ROLE_KEY from .env.local",
  "COMMAND-SHAPE-007 set SUPABASE_READONLY_VALIDATE_CONFIRMATION only inside the same PowerShell process",
  "COMMAND-SHAPE-008 required confirmation value is CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
  "COMMAND-SHAPE-009 do not call npm run db:readonly-validate",
  "COMMAND-SHAPE-010 do not call scripts/check-review-gates.mjs",
  "COMMAND-SHAPE-011 do not persist env values",
  "COMMAND-SHAPE-012 do not modify .env.local",
  "COMMAND-SHAPE-013 stop after exactly one validator invocation",
  "EXECUTION-STATUS-001 command is documented only",
  "EXECUTION-STATUS-002 command is not executed in this slice",
  "EXECUTION-STATUS-003 confirmation variable is not set in this slice",
  "EXECUTION-STATUS-004 Supabase is not contacted in this slice",
  "EXECUTION-STATUS-006 no Supabase readiness evidence is accepted in this slice",
  "PRE-EXEC-001 this exact command gate must pass",
  "PRE-EXEC-002 role review of this exact command gate must pass",
  "PRE-EXEC-003 validator safety checker must pass immediately before execution",
  "PRE-EXEC-007 post-run review must be the immediate next slice after execution",
  "PRE-EXEC-008 CEO must explicitly record one-attempt execution decision",
  "OUTPUT-003 output must not include row payloads",
  "OUTPUT-004 output must not include secrets",
  "OUTPUT-005 output must not include key prefixes",
  "OUTPUT-006 output must not include key suffixes",
  "OUTPUT-007 output must not include key lengths",
  "OUTPUT-009 successful object reachability must not promote data readiness by itself",
  "NOT-APPROVED-001 execution is not approved by this gate",
  "NOT-APPROVED-002 confirmation-enabled validator run is not approved by this gate",
  "NOT-APPROVED-003 Supabase connection is not approved in this slice",
  "NOT-APPROVED-004 SQL execution is not approved",
  "NOT-APPROVED-006 Supabase writes are not approved",
  "NOT-APPROVED-012 .env.local modification is not approved",
  "NOT-APPROVED-014 scoreSource=real is not approved",
  "NOT-APPROVED-015 CP3 source-depth readiness promotion is not approved",
  "NOT-APPROVED-016 public claims are not approved",
  "STOP-002 stop if command would persist confirmation beyond the process",
  "STOP-003 stop if command would invoke npm wrapper",
  "STOP-005 stop if command would run SQL or mutate data",
  "CEO-FINDING-001 exact command shape is now concrete enough for role review",
  "ENGINEERING-FINDING-001 direct node invocation removes npm-wrapper ambiguity",
  "ENGINEERING-FINDING-002 env loading is limited to three required Supabase keys",
  "ENGINEERING-FINDING-003 confirmation remains process-scoped in the proposed shape",
  "The exact direct-node retry command shape is drafted but not approved for\nexecution.",
  "NEXT-SLICE-001 perform role review of this exact direct-node retry command gate",
  "NEXT-SLICE-002 do not execute the retry during role review",
  "NEXT-SLICE-003 if role review passes, CEO decides whether to authorize one execution checkpoint",
  "scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate.mjs passes",
  "scripts/check-cp3-supabase-read-only-narrow-remote-retry-readiness-gate-role-review.mjs passes",
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
