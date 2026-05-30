import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_GUARDED_VALIDATOR_IMPLEMENTATION_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: `CP3 Supabase schema-shape guarded validator implementation review recorded`",
  "ACCEPT_SCHEMA_SHAPE_GUARDED_REMOTE_CAPABLE_VALIDATOR_CODE",
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
  "IMPLEMENTATION-001 validator path is scripts/validate-supabase-schema-shape-readonly.mjs",
  "IMPLEMENTATION-002 static checker path is scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs",
  "IMPLEMENTATION-003 validator remains blocked by default",
  "IMPLEMENTATION-008 required confirmation variable is SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION",
  "IMPLEMENTATION-009 required confirmation value is CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE",
  "IMPLEMENTATION-010 remote-capable path imports @supabase/supabase-js only after confirmation and environment checks",
  "IMPLEMENTATION-011 remote-capable path uses createClient with persistSession false",
  "IMPLEMENTATION-012 remote-capable path uses head true count exact select checks",
  "IMPLEMENTATION-013 remote-capable path uses rowLimit 0",
  "IMPLEMENTATION-014 remote-capable path targets daily_prices, twse_stock_day_staging, market_assets, model_runs, and data_freshness",
  "IMPLEMENTATION-018 aggregate review gate checks the static checker and does not execute the validator",
  "CEO-FINDING-001 code is ready for execution-gate consideration but not remote execution yet",
  "PM-FINDING-001 next slice should prepare the final one-attempt schema-shape execution gate review",
  "ENGINEERING-FINDING-001 validator and static checker changed together",
  "ENGINEERING-FINDING-003 forbidden write, SQL, RPC, storage, fetch, and file-write paths are absent",
  "QA-FINDING-001 default execution remains blocked without confirmation",
  "DATA-FINDING-002 no raw market rows are printed, parsed, written, or committed",
  "SECURITY-FINDING-001 environment values are not printed",
  "SECURITY-FINDING-003 service role key is not printed",
  "LEGAL-FINDING-002 scoreSource=real remains blocked",
  "BOUNDARY-001 validator may remain remote-capable behind explicit confirmation",
  "BOUNDARY-004 scripts/check-review-gates.mjs must not execute the validator",
  "BOUNDARY-007 rowLimit must remain 0",
  "BOUNDARY-008 output must remain redacted JSON",
  "BOUNDARY-009 mutations must remain false",
  "BOUNDARY-010 sqlExecuted must remain false",
  "BOUNDARY-011 rpcCalled must remain false",
  "BOUNDARY-012 secretsPrinted must remain false",
  "BOUNDARY-013 rowPayloadsPrinted must remain false",
  "BOUNDARY-014 filesWritten must remain false",
  "BOUNDARY-015 scoreSourceRealChanged must remain false",
  "BOUNDARY-016 sourceDepthReadyChanged must remain false",
  "BOUNDARY-017 publicClaimsChanged must remain false",
  "BLOCKED-001 no remote execution in this review",
  "BLOCKED-002 no validator run against Supabase in this review",
  "BLOCKED-003 no SQL execution",
  "BLOCKED-005 no Supabase writes",
  "BLOCKED-011 no raw market rows committed",
  "BLOCKED-013 no .env.local modification",
  "BLOCKED-014 no scoreSource=real",
  "The guarded schema-shape validator implementation is accepted.",
  "It is not enough to run Supabase yet.",
  "NEXT-SLICE-001 prepare final schema-shape one-attempt execution gate review",
  "NEXT-SLICE-002 include exact direct-node command target scripts\\validate-supabase-schema-shape-readonly.mjs",
  "NEXT-SLICE-003 include SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION=CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE",
  "NEXT-SLICE-004 include no SQL, no writes, no row payloads, no secrets, no market data, no scoreSource=real",
  "scripts/check-cp3-supabase-schema-shape-guarded-validator-implementation-review.mjs passes",
  "scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 source-depth production gate remains not_ready",
  "Supabase remote execution remains blocked until execution gate",
  "SQL execution remains blocked",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "RUN_SUPABASE_NOW",
  "REMOTE_EXECUTION_PERFORMED",
  "Supabase remote execution is approved",
  "validator ran against Supabase",
  "SQL execution is approved",
  "Supabase writes are approved",
  "row payloads may be printed",
  "environment values may be printed",
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
