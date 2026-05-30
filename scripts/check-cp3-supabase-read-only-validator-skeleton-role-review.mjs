import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_VALIDATOR_SKELETON_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only validator skeleton role review recorded",
  "ACCEPT_LOCAL_SKELETON_ONLY",
  "local preparation artifact only",
  "It is not a remote validation approval",
  "does not authorize connecting to Supabase",
  "package.json",
  "scripts/validate-supabase-readonly.mjs",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs",
  "scripts/check-review-gates.mjs",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_VALIDATION_PRE_EXECUTION_GATE_2026-05-30.md",
  "CEO-FINDING-001 skeleton moves the project closer to Supabase runtime without opening remote access",
  "CEO-FINDING-002 next acceleration should remain gated by explicit remote run approval",
  "PM-FINDING-001 command name exists and can be referenced in future approval gates",
  "PM-FINDING-002 aggregate review gate remains local-only and does not execute the validator",
  "ENGINEERING-FINDING-001 validator contains no Supabase client import",
  "ENGINEERING-FINDING-002 validator contains no createClient call",
  "ENGINEERING-FINDING-003 validator contains no from, select, insert, update, upsert, delete, rpc, storage, SQL, or fetch path",
  "ENGINEERING-FINDING-004 validator exits blocked by default",
  "QA-FINDING-001 output shape matches the pre-execution gate fields",
  "QA-FINDING-002 output reports connection not_run and object checks not_run",
  "QA-FINDING-003 rowLimit remains 5",
  "DATA-FINDING-001 planned objects are named without reading rows",
  "DATA-FINDING-002 daily_prices and staging objects remain untouched",
  "SECURITY-FINDING-001 environment values are not printed",
  "SECURITY-FINDING-002 key prefixes, suffixes, and lengths are not printed",
  "SECURITY-FINDING-003 no environment file is written or committed by the validator",
  "LEGAL-FINDING-001 no public claim is introduced",
  "LEGAL-FINDING-002 scoreSource=real remains blocked",
  "BOUNDARY-001 local skeleton may remain in package.json as db:readonly-validate",
  "BOUNDARY-002 local skeleton may be executed to confirm blocked redacted output",
  "BOUNDARY-003 local skeleton must keep status blocked until remote execution approval exists",
  "BOUNDARY-004 local skeleton must keep connection not_run until remote execution approval exists",
  "BOUNDARY-005 local skeleton must keep object checks not_run until remote execution approval exists",
  "BOUNDARY-006 local skeleton must keep mutations false",
  "BOUNDARY-007 local skeleton must keep sqlExecuted false",
  "BOUNDARY-008 local skeleton must keep rpcCalled false",
  "BOUNDARY-009 local skeleton must keep secretsPrinted false",
  "BOUNDARY-010 local skeleton must keep rowPayloadsPrinted false",
  "BOUNDARY-011 local skeleton must keep filesWritten false",
  "BOUNDARY-012 local skeleton must keep scoreSourceRealChanged false",
  "BOUNDARY-013 local skeleton must keep sourceDepthReadyChanged false",
  "BOUNDARY-014 local skeleton must keep publicClaimsChanged false",
  "BLOCKED-001 no Supabase connection",
  "BLOCKED-002 no remote read-only query",
  "BLOCKED-003 no remote row reads",
  "BLOCKED-004 no SQL execution",
  "BLOCKED-005 no SQL migration",
  "BLOCKED-006 no Supabase writes",
  "BLOCKED-007 no staging rows",
  "BLOCKED-008 no daily_prices writes",
  "BLOCKED-009 no seed SQL",
  "BLOCKED-010 no market-data fetch",
  "BLOCKED-011 no market-row parsing",
  "BLOCKED-012 no raw market rows committed",
  "BLOCKED-013 no environment values printed",
  "BLOCKED-014 no .env.local modification",
  "BLOCKED-015 no scoreSource=real",
  "BLOCKED-016 no source-depth readiness promotion",
  "BLOCKED-017 no public claims",
  "The skeleton is acceptable and useful because it creates the future operator\nsurface while remaining fail-closed.",
  "The next useful slice is a remote-run\napproval packet draft",
  "before any actual Supabase\nconnection is attempted",
  "NEXT-SLICE-001 draft Supabase read-only remote-run approval packet",
  "NEXT-SLICE-002 include exact command npm run db:readonly-validate",
  "NEXT-SLICE-003 include current skeleton safety evidence",
  "NEXT-SLICE-004 include required human confirmation language",
  "NEXT-SLICE-005 include expected redacted output",
  "NEXT-SLICE-006 include stop conditions for secrets, writes, SQL, row payloads, and scoreSource=real",
  "NEXT-SLICE-007 do not connect to Supabase in the packet draft slice",
  "NEXT-SLICE-008 keep public data source mock",
  "scripts/check-cp3-supabase-read-only-validator-skeleton-role-review.mjs passes",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes",
  "scripts/check-cp3-supabase-read-only-validation-pre-execution-gate.mjs passes",
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
  "APPROVE_REMOTE_RUN_NOW",
  "remote validation approval granted",
  "Supabase connection is approved",
  "Supabase connection is authorized",
  "remote read-only query is approved now",
  "remote rows may be read now",
  "SQL execution is approved",
  "SQL migration is approved",
  "Supabase writes are approved",
  "staging rows are written",
  "daily_prices rows are written",
  "seed SQL is created",
  "market-data fetch is approved",
  "market rows are parsed",
  "environment values are printed",
  ".env.local is modified",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "production-ready approved",
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
