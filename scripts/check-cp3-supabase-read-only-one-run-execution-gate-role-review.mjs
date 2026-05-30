import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_RUN_EXECUTION_GATE_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only one-run execution gate role review recorded",
  "ACCEPT_ONE_RUN_EXECUTION_GATE_BOUNDARY",
  "does not execute the validator",
  "does not connect to Supabase",
  "does not run SQL",
  "does not approve any write\npath",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_RUN_EXECUTION_GATE_2026-05-30.md",
  "scripts/check-cp3-supabase-read-only-one-run-execution-gate.mjs",
  "scripts/validate-supabase-readonly.mjs",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs",
  "scripts/check-review-gates.mjs",
  "CEO-FINDING-001 the gate is narrow enough for controlled acceleration",
  "CEO-FINDING-002 one future read-only run is acceptable as evidence gathering",
  "CEO-FINDING-003 the gate does not authorize ingestion, SQL, writes, public claims, or scoreSource=real",
  "PM-FINDING-002 one-run scope prevents uncontrolled repeated remote checks",
  "PM-FINDING-004 aggregate gates remain local-only and safe for routine development",
  "ENGINEERING-FINDING-001 command scope matches npm run db:readonly-validate",
  "ENGINEERING-FINDING-002 validator remains guarded by SUPABASE_READONLY_VALIDATE_CONFIRMATION",
  "ENGINEERING-FINDING-003 required confirmation remains CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
  "ENGINEERING-FINDING-004 approved read-only checks are limited to head true count exact select checks",
  "ENGINEERING-FINDING-005 scripts/check-review-gates.mjs does not execute the validator",
  "ENGINEERING-FINDING-006 SQL, RPC, storage, fetch, mutation, and file-write paths remain forbidden",
  "QA-FINDING-001 required pre-run checks are explicit",
  "QA-FINDING-002 stop conditions are explicit",
  "QA-FINDING-005 default validator behavior remains blocked without confirmation",
  "DATA-FINDING-001 target objects are daily_prices, twse_stock_day_staging, market_assets, model_runs, and data_freshness",
  "DATA-FINDING-002 no row payloads may be printed or committed",
  "DATA-FINDING-003 object reachability evidence is useful but insufficient for data-quality promotion",
  "DATA-FINDING-004 no market-data fetch or parsing is authorized",
  "DATA-FINDING-005 no staging or daily_prices writes are authorized",
  "SECURITY-FINDING-001 environment values must not be printed",
  "SECURITY-FINDING-002 key prefixes, suffixes, and lengths must not be printed",
  "SECURITY-FINDING-003 service role key must not be printed",
  "SECURITY-FINDING-004 output must remain redacted JSON",
  "LEGAL-FINDING-001 no public claim is created by this gate",
  "LEGAL-FINDING-002 no scoreSource=real claim is authorized",
  "LEGAL-FINDING-003 no source-depth readiness promotion is authorized",
  "LEGAL-FINDING-004 public data source must remain mock",
  "ACCEPT-001 one future run may be considered after this review passes",
  "ACCEPT-002 the future command must be npm run db:readonly-validate",
  "ACCEPT-003 the future run must include SUPABASE_READONLY_VALIDATE_CONFIRMATION=CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
  "ACCEPT-004 the future run must be one discrete checkpoint",
  "ACCEPT-005 the future run must remain read-only",
  "ACCEPT-006 the future output must remain redacted JSON",
  "ACCEPT-007 the future run must be followed by a post-run review",
  "ACCEPT-008 aggregate review gates must remain local-only",
  "BLOCKED-001 remote execution is not performed in this role review",
  "BLOCKED-002 SQL execution remains blocked",
  "BLOCKED-004 Supabase writes remain blocked",
  "BLOCKED-005 insert update upsert delete remain blocked",
  "BLOCKED-010 row payload output remains blocked",
  "BLOCKED-011 secret output remains blocked",
  "BLOCKED-013 scoreSource=real remains blocked",
  "BLOCKED-014 CP3 source-depth readiness promotion remains blocked",
  "BLOCKED-015 public claims remain blocked",
  "The one-run execution gate is accepted.",
  "CEO-controlled single read-only Supabase validation checkpoint",
  "not ingestion, not SQL, not a write, not public\nreadiness, and not scoreSource=real",
  "NEXT-SLICE-001 decide whether to perform the single read-only validation run",
  "NEXT-SLICE-002 if executed, run only npm run db:readonly-validate with the explicit confirmation variable",
  "NEXT-SLICE-003 immediately record a post-run review after execution",
  "NEXT-SLICE-004 if not executed yet, continue local-only runtime support work",
  "scripts/check-cp3-supabase-read-only-one-run-execution-gate-role-review.mjs passes",
  "scripts/check-cp3-supabase-read-only-one-run-execution-gate.mjs passes",
  "scripts/check-cp3-supabase-read-only-guarded-validator-implementation-review.mjs passes",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "Supabase remote execution is not performed in this role review slice",
  "SQL execution remains blocked",
  "Supabase writes remain blocked",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "RUN_SUPABASE_NOW",
  "REMOTE_EXECUTION_PERFORMED",
  "SQL execution is approved",
  "Supabase writes are approved",
  "insert is approved",
  "update is approved",
  "upsert is approved",
  "delete is approved",
  "ALLOW_ROW_PAYLOAD_OUTPUT",
  "ALLOW_ENVIRONMENT_VALUE_OUTPUT",
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
