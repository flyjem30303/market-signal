import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_ACTIVATION_GATE_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 freshness runtime-read activation gate role review recorded",
  "ACCEPT_FRESHNESS_RUNTIME_READ_ACTIVATION_GATE_BOUNDARY",
  "does not enable `DATA_FRESHNESS_SUPABASE_READS`",
  "does not modify `.env.local`",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not approve `scoreSource=real`",
  "docs/SUPABASE_EXECUTION_RUNBOOK.md",
  "src/lib/data-freshness-source.ts",
  "scripts/check-freshness-runtime-read-activation-gate.mjs",
  "scripts/check-data-freshness-source-fallback.mjs",
  "scripts/check-review-gates.mjs",
  "CEO-FINDING-001 the gate accelerates runtime readiness without opening remote execution",
  "CEO-FINDING-002 the required two-key model is appropriate for controlled progress",
  "CEO-FINDING-003 the gate keeps NEXT_PUBLIC_DATA_SOURCE=mock as the public data boundary",
  "CEO-FINDING-004 future DATA_FRESHNESS_SUPABASE_READS=enabled use must be a bounded checkpoint",
  "CEO-FINDING-005 failure fallback to mock is required before any runtime read attempt",
  "PM-FINDING-004 the next slice can prepare an exact bounded-read execution packet",
  "ENGINEERING-FINDING-002 DATA_FRESHNESS_SUPABASE_READS is the explicit runtime read enable switch",
  "ENGINEERING-FINDING-003 createServerSupabaseClient remains behind DATA_FRESHNESS_SUPABASE_READS",
  "ENGINEERING-FINDING-004 runtime failure returns buildMockDataFreshnessSnapshot",
  "ENGINEERING-FINDING-006 the gate does not add Supabase writes, SQL, ingestion, or row payload output",
  "QA-FINDING-003 fallback behavior is explicitly checked",
  "DATA-FINDING-003 no staging rows or daily_prices writes are authorized",
  "DATA-FINDING-005 CP3 source-depth production gate remains not_ready",
  "SECURITY-FINDING-001 .env.local must not be modified by this review",
  "SECURITY-FINDING-003 key prefixes, suffixes, lengths, and service role key must not be printed",
  "LEGAL-FINDING-002 no scoreSource=real claim is authorized",
  "LEGAL-FINDING-004 public data source remains mock",
  "ACCEPT-001 one future bounded runtime-read checkpoint may be prepared",
  "ACCEPT-002 future use of DATA_FRESHNESS_SUPABASE_READS=enabled must be explicit and temporary",
  "ACCEPT-003 future runtime read must keep NEXT_PUBLIC_DATA_SOURCE=mock",
  "ACCEPT-004 future runtime read must fall back to mock freshness on failure",
  "ACCEPT-005 future runtime read must not include SQL or writes",
  "ACCEPT-006 future runtime read must be followed by a post-run review",
  "BLOCKED-001 DATA_FRESHNESS_SUPABASE_READS is not enabled in this review",
  "BLOCKED-002 .env.local modification remains blocked",
  "BLOCKED-003 Supabase connection remains blocked",
  "BLOCKED-004 SQL execution remains blocked",
  "BLOCKED-005 Supabase writes remain blocked",
  "BLOCKED-012 scoreSource=real remains blocked",
  "BLOCKED-013 CP3 source-depth production gate remains not_ready",
  "The activation gate is accepted.",
  "separate bounded runtime-read execution packet for freshness only",
  "not a public data-source switch and not scoreSource=real",
  "NEXT-SLICE-001 prepare exact bounded freshness runtime-read execution packet",
  "NEXT-SLICE-002 name the exact environment variables and rollback values",
  "NEXT-SLICE-003 require pre-run local checks before any remote read",
  "NEXT-SLICE-004 require immediate post-run review after any attempt",
  "scripts/check-freshness-runtime-read-activation-gate-role-review.mjs passes",
  "scripts/check-freshness-runtime-read-activation-gate.mjs passes",
  "scripts/check-data-freshness-source-fallback.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "Supabase remote execution is not performed in this role review slice",
  "public data source remains mock",
  "scoreSource=real remains blocked"
];

const forbiddenPhrases = [
  "ENABLE_DATA_FRESHNESS_SUPABASE_READS_NOW",
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
  "market ingestion is approved"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      checked_file: reportPath,
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
