import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_REMOTE_CAPABLE_VALIDATOR_IMPLEMENTATION_GATE_DRAFT_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only remote-capable validator implementation gate draft role review recorded",
  "ACCEPT_REMOTE_CAPABLE_IMPLEMENTATION_GATE_FOR_CODE_PREPARATION",
  "future code-preparation slice",
  "does not modify the validator",
  "does\nnot add a Supabase client",
  "does not connect to Supabase",
  "does not execute\n`npm run db:readonly-validate`",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_REMOTE_CAPABLE_VALIDATOR_IMPLEMENTATION_GATE_DRAFT_2026-05-30.md",
  "scripts/check-cp3-supabase-read-only-remote-capable-validator-implementation-gate-draft.mjs",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_REMOTE_RUN_APPROVAL_GATE_DRAFT_2026-05-30.md",
  "scripts/check-cp3-supabase-read-only-remote-run-approval-gate-draft.mjs",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs",
  "scripts/validate-supabase-readonly.mjs",
  "package.json",
  "CEO-FINDING-001 gate draft is narrow enough to move from governance into code preparation",
  "CEO-FINDING-002 gate draft still requires a later execution gate before any remote run",
  "CEO-FINDING-003 implementation may proceed only as minimum read-only Supabase path plus static checker",
  "PM-FINDING-001 next work item is code preparation, not remote execution",
  "PM-FINDING-002 validator and static checker must be changed together",
  "PM-FINDING-003 aggregate review gate must remain local-only",
  "ENGINEERING-FINDING-001 allowed future code path is limited to createClient, persistSession false, and head true count exact select checks",
  "ENGINEERING-FINDING-002 forbidden paths cover insert, update, upsert, delete, rpc, storage, SQL mutation strings, fetch, file writes, and row payload output",
  "ENGINEERING-FINDING-003 current validator remains unchanged and fail-closed",
  "QA-FINDING-001 output contract is complete and redacted",
  "QA-FINDING-002 static checker requirements are testable",
  "QA-FINDING-003 rowLimit remains 5 or lower",
  "DATA-FINDING-001 allowed object list is explicit and bounded",
  "DATA-FINDING-002 no raw market rows may be parsed, printed, written, or committed",
  "SECURITY-FINDING-001 environment values, key prefixes, suffixes, and lengths remain blocked",
  "SECURITY-FINDING-002 service role key may only be read for server-side validation and never printed",
  "SECURITY-FINDING-003 execution remains blocked until a later execution gate",
  "LEGAL-FINDING-001 no public claims are introduced",
  "LEGAL-FINDING-002 scoreSource=real remains blocked",
  "LEGAL-FINDING-003 CP3 source-depth production gate remains not_ready",
  "ACCEPT-001 code-change boundaries are narrow enough",
  "ACCEPT-002 static checker requirements are complete enough for implementation",
  "ACCEPT-003 output contract is redacted and bounded",
  "ACCEPT-004 current validator remains unchanged",
  "ACCEPT-005 current validator remains fail-closed",
  "ACCEPT-006 Supabase connection remains blocked",
  "ACCEPT-007 SQL execution remains blocked",
  "ACCEPT-008 Supabase writes remain blocked",
  "ACCEPT-009 scoreSource=real remains blocked",
  "ACCEPT-010 public claims remain blocked",
  "ACCEPT-011 execution gate remains required before any remote run",
  "ACCEPT-012 review gate remains local-only",
  "BLOCKED-001 no validator code change in this role review",
  "BLOCKED-002 no Supabase client added in this role review",
  "BLOCKED-003 no Supabase connection",
  "BLOCKED-004 no remote read-only query",
  "BLOCKED-005 no remote row reads",
  "BLOCKED-006 no SQL execution",
  "BLOCKED-007 no SQL migration",
  "BLOCKED-008 no Supabase writes",
  "BLOCKED-009 no staging rows",
  "BLOCKED-010 no daily_prices writes",
  "BLOCKED-011 no seed SQL",
  "BLOCKED-012 no market-data fetch",
  "BLOCKED-013 no market-row parsing",
  "BLOCKED-014 no raw market rows committed",
  "BLOCKED-015 no environment values printed",
  "BLOCKED-016 no .env.local modification",
  "BLOCKED-017 no scoreSource=real",
  "BLOCKED-018 no source-depth readiness promotion",
  "BLOCKED-019 no public claims",
  "The implementation gate draft is accepted.",
  "modifies the validator and its static checker together",
  "keeping execution blocked until a separate execution gate is recorded",
  "NEXT-SLICE-001 implement remote-capable validator code behind explicit execution confirmation",
  "NEXT-SLICE-002 update static safety checker in the same slice",
  "NEXT-SLICE-003 keep default behavior blocked when execution confirmation is absent",
  "NEXT-SLICE-004 keep scripts/check-review-gates.mjs from executing the validator",
  "NEXT-SLICE-005 run static checker before any remote run",
  "NEXT-SLICE-006 do not run the validator against Supabase in the implementation slice",
  "NEXT-SLICE-007 keep public data source mock",
  "NEXT-SLICE-008 keep scoreSource=real blocked",
  "scripts/check-cp3-supabase-read-only-remote-capable-validator-implementation-gate-draft-role-review.mjs passes",
  "scripts/check-cp3-supabase-read-only-remote-capable-validator-implementation-gate-draft.mjs passes",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "Supabase connection remains blocked",
  "SQL execution remains blocked",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "IMPLEMENT_REMOTE_VALIDATOR_NOW",
  "REMOTE_VALIDATOR_IMPLEMENTATION_APPROVED",
  "Supabase client is added",
  "Supabase connection is approved now",
  "remote rows may be read now",
  "SQL execution is approved",
  "Supabase writes are approved",
  "environment values are printed",
  ".env.local is modified",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "may connect to Supabase now",
  "may run SQL now",
  "may write remote data"
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
