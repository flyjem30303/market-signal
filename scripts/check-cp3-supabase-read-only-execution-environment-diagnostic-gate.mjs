import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SUPABASE_READ_ONLY_EXECUTION_ENVIRONMENT_DIAGNOSTIC_GATE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 Supabase read-only execution-environment diagnostic gate recorded",
  "APPROVE_LOCAL_ONLY_EXECUTION_ENVIRONMENT_DIAGNOSTICS",
  "does not\napprove another Supabase remote validation run",
  "does not connect to Supabase",
  "does not run SQL",
  "does not approve any write path",
  "SCOPE-001 inspect PowerShell command composition without printing secret values",
  "SCOPE-003 inspect validator default fail-closed execution without confirmation",
  "SCOPE-004 inspect .env.local key names only, not values",
  "SCOPE-005 inspect environment-variable loading mechanics with present or missing states only",
  "SCOPE-006 inspect whether Access is denied is caused before validator JSON can be produced",
  "SCOPE-009 document findings before any new remote-capable attempt",
  "OUT-OF-SCOPE-001 no Supabase remote validation retry",
  "OUT-OF-SCOPE-002 no confirmation-enabled validator run",
  "OUT-OF-SCOPE-003 no Supabase connection",
  "OUT-OF-SCOPE-004 no SQL execution",
  "OUT-OF-SCOPE-006 no Supabase writes",
  "OUT-OF-SCOPE-007 no insert update upsert delete",
  "OUT-OF-SCOPE-013 no .env.local modification",
  "OUT-OF-SCOPE-015 no scoreSource=real",
  "OUT-OF-SCOPE-016 no CP3 source-depth readiness promotion",
  "OUT-OF-SCOPE-017 no public claims",
  "REDACTION-001 do not print NEXT_PUBLIC_SUPABASE_URL value",
  "REDACTION-002 do not print NEXT_PUBLIC_SUPABASE_ANON_KEY value",
  "REDACTION-003 do not print SUPABASE_SERVICE_ROLE_KEY value",
  "REDACTION-004 do not print key prefixes",
  "REDACTION-005 do not print key suffixes",
  "REDACTION-006 do not print key lengths",
  "REDACTION-008 report only present or missing for required environment names",
  "ALLOW-001 run node scripts/validate-supabase-readonly.mjs without confirmation",
  "ALLOW-002 run npm --version",
  "ALLOW-003 run node --version",
  "ALLOW-004 list .env.local key names only",
  "ALLOW-005 test environment-variable loading into the current process using present or missing output only",
  "ALLOW-007 inspect validator source for forbidden write, SQL, RPC, storage, fetch, and secret-output paths",
  "ALLOW-010 run scripts/check-review-gates.mjs",
  "STOP-004 stop if a diagnostic would connect to Supabase",
  "STOP-005 stop if a diagnostic would set SUPABASE_READONLY_VALIDATE_CONFIRMATION",
  "STOP-006 stop if a diagnostic would run npm run db:readonly-validate with confirmation",
  "STOP-007 stop if a diagnostic would execute SQL or mutate data",
  "REPORT-001 record whether validator fail-closed JSON is produced locally",
  "REPORT-003 record whether required env names can be parsed as present without values",
  "REPORT-004 record whether Access is denied is reproduced by a no-remote command",
  "REPORT-006 record whether a future remote retry is safe, blocked, or needs more local diagnostics",
  "REPORT-007 record that no Supabase evidence is produced by this diagnostic gate",
  "CEO-FINDING-001 this gate keeps acceleration focused without repeating a remote attempt",
  "ENGINEERING-FINDING-001 diagnostic commands isolate shell, npm, node, env loading, and validator default behavior",
  "DATA-FINDING-001 no object reachability or table quality evidence is produced",
  "SECURITY-FINDING-001 redaction rules are strict enough for local diagnostics",
  "goal is to explain Access is denied without using Supabase as the test surface",
  "Only after the diagnostic report passes should CEO decide whether another\nread-only remote checkpoint is justified.",
  "NEXT-SLICE-001 run the approved local-only diagnostic checklist",
  "NEXT-SLICE-002 record a diagnostic report",
  "NEXT-SLICE-003 do not run confirmation-enabled validator during diagnostics",
  "NEXT-SLICE-004 do not retry Supabase remote validation in this slice",
  "scripts/check-cp3-supabase-read-only-execution-environment-diagnostic-gate.mjs passes",
  "scripts/check-cp3-supabase-read-only-one-run-post-run-review.mjs passes",
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
  "RUN_SUPABASE_NOW",
  "RETRY_REMOTE_VALIDATION_NOW",
  "CONFIRMATION_ENABLED_RUN_APPROVED",
  "SQL execution is approved",
  "Supabase writes are approved",
  "insert is approved",
  "update is approved",
  "upsert is approved",
  "delete is approved",
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
