import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_RUN_EXECUTION_GATE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only one-run execution gate recorded",
  "APPROVE_ONE_FUTURE_READ_ONLY_VALIDATION_RUN",
  "does not execute the validator",
  "does not connect to\nSupabase",
  "does not run SQL",
  "does not approve any write path",
  "COMMAND-001 npm run db:readonly-validate",
  "COMMAND-002 require SUPABASE_READONLY_VALIDATE_CONFIRMATION=CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
  "COMMAND-003 require NEXT_PUBLIC_SUPABASE_URL to be present",
  "COMMAND-004 require NEXT_PUBLIC_SUPABASE_ANON_KEY to be present",
  "COMMAND-005 require SUPABASE_SERVICE_ROLE_KEY to be present",
  "COMMAND-006 run only once per CEO execution decision",
  "COMMAND-007 do not add the validator command to scripts/check-review-gates.mjs",
  "COMMAND-008 do not run this command from aggregate local gates",
  "READ-ONLY-001 daily_prices head true count exact select check",
  "READ-ONLY-002 twse_stock_day_staging head true count exact select check",
  "READ-ONLY-003 market_assets head true count exact select check",
  "READ-ONLY-004 model_runs head true count exact select check",
  "READ-ONLY-005 data_freshness head true count exact select check",
  "READ-ONLY-006 rowLimit must remain 5 or lower",
  "FORBIDDEN-001 no SQL execution",
  "FORBIDDEN-003 no Supabase writes",
  "FORBIDDEN-004 no insert update upsert delete",
  "FORBIDDEN-005 no RPC calls",
  "FORBIDDEN-006 no storage calls",
  "FORBIDDEN-010 no row payloads printed",
  "FORBIDDEN-011 no environment values printed",
  "FORBIDDEN-016 no scoreSource=real",
  "FORBIDDEN-017 no CP3 source-depth readiness promotion",
  "FORBIDDEN-018 no public claims",
  "FORBIDDEN-022 no schema changes",
  "PRE-RUN-001 scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes",
  "PRE-RUN-002 scripts/check-cp3-supabase-read-only-guarded-validator-implementation-review.mjs passes",
  "PRE-RUN-003 scripts/check-cp3-supabase-read-only-one-run-execution-gate.mjs passes",
  "PRE-RUN-004 scripts/check-review-gates.mjs passes",
  "PRE-RUN-005 TypeScript noEmit passes",
  "OUTPUT-004 output must include secretsPrinted false",
  "OUTPUT-005 output must include rowPayloadsPrinted false",
  "OUTPUT-006 output must include sqlExecuted false",
  "OUTPUT-007 output must include mutations false",
  "OUTPUT-008 output must include rpcCalled false",
  "OUTPUT-009 output must include filesWritten false",
  "OUTPUT-010 output must include scoreSourceRealChanged false",
  "OUTPUT-011 output must include sourceDepthReadyChanged false",
  "OUTPUT-012 output must include publicClaimsChanged false",
  "STOP-001 stop if any required environment name is missing",
  "STOP-002 stop if confirmation value is absent or different",
  "STOP-003 stop if static checker fails",
  "STOP-004 stop if aggregate gate fails",
  "STOP-006 stop if validator source changes after this gate without review",
  "POST-RUN-001 record whether connection was reachable without printing secrets",
  "POST-RUN-002 record object-level status without printing row payloads",
  "POST-RUN-006 do not promote scoreSource=real from this run alone",
  "POST-RUN-007 do not promote CP3 source-depth production gate from this run alone",
  "CEO-FINDING-001 this is the narrowest useful bridge from local-only preparation to Supabase runtime evidence",
  "ENGINEERING-FINDING-001 command scope matches the guarded validator implementation",
  "SECURITY-FINDING-001 secret and row-payload redaction remains mandatory",
  "The project may proceed toward one future Supabase read-only validation run only\ninside this exact boundary.",
  "not ingestion, not\nSQL execution, not scoreSource=real, and not public readiness promotion",
  "NEXT-SLICE-001 perform role review of this one-run execution gate",
  "NEXT-SLICE-002 keep the actual validator unexecuted during the role review slice",
  "NEXT-SLICE-003 after role review, decide whether to perform the single read-only run",
  "scripts/check-cp3-supabase-read-only-one-run-execution-gate.mjs passes",
  "Supabase remote execution is not performed in this gate slice",
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
  "row payloads may be printed",
  "environment values may be printed",
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
