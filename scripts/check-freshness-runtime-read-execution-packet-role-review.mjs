import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_EXECUTION_PACKET_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 freshness runtime-read execution packet role review recorded",
  "ACCEPT_FRESHNESS_RUNTIME_READ_EXECUTION_PACKET_BOUNDARY",
  "does not execute the checkpoint",
  "does not enable `DATA_FRESHNESS_SUPABASE_READS`",
  "does not modify `.env.local`",
  "does not connect to Supabase",
  "does not run SQL",
  "does\nnot write Supabase",
  "does not fetch market data",
  "does not approve\n`scoreSource=real`",
  "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_EXECUTION_PACKET_DRAFT_2026-05-30.md",
  "scripts/check-freshness-runtime-read-execution-packet-draft.mjs",
  "scripts/check-freshness-runtime-read-activation-gate-role-review.mjs",
  "scripts/check-data-freshness-source-fallback.mjs",
  "CEO-FINDING-001 the packet is narrow enough for one bounded freshness runtime-read decision",
  "CEO-FINDING-002 the packet is preparation-only and does not itself approve execution",
  "CEO-FINDING-003 temporary process env and rollback values are explicit",
  "CEO-FINDING-004 the target pages are limited to /briefing and /stocks/2330",
  "PM-FINDING-003 the packet gives CEO a clear future yes/no decision point",
  "ENGINEERING-FINDING-001 the temporary env values keep NEXT_PUBLIC_DATA_SOURCE=mock",
  "ENGINEERING-FINDING-002 DATA_FRESHNESS_SOURCE=supabase is limited to freshness only",
  "ENGINEERING-FINDING-003 DATA_FRESHNESS_SUPABASE_READS=enabled is temporary and bounded",
  "ENGINEERING-FINDING-004 rollback values restore DATA_FRESHNESS_SOURCE=mock and DATA_FRESHNESS_SUPABASE_READS=disabled",
  "ENGINEERING-FINDING-006 execution shape does not include SQL, writes, ingestion, or row payload output",
  "QA-FINDING-002 output categories are redacted and testable",
  "DATA-FINDING-003 no staging rows or daily_prices writes are authorized",
  "DATA-FINDING-005 CP3 source-depth production gate remains not_ready",
  "SECURITY-FINDING-001 .env.local modification remains blocked",
  "SECURITY-FINDING-004 output must not contain Supabase URL, anon key, service role key, SQL, row payloads, or raw market data",
  "LEGAL-FINDING-002 no scoreSource=real claim is authorized",
  "LEGAL-FINDING-004 public data source remains mock",
  "ACCEPT-001 one future bounded freshness runtime-read checkpoint may be decided by CEO",
  "ACCEPT-002 future use of DATA_FRESHNESS_SUPABASE_READS=enabled must be temporary process env only",
  "ACCEPT-003 future checkpoint must keep NEXT_PUBLIC_DATA_SOURCE=mock",
  "ACCEPT-004 future checkpoint must request /briefing exactly once",
  "ACCEPT-005 future checkpoint must request /stocks/2330 exactly once",
  "ACCEPT-006 future checkpoint must record redacted output only",
  "ACCEPT-007 future checkpoint must roll back to DATA_FRESHNESS_SOURCE=mock and DATA_FRESHNESS_SUPABASE_READS=disabled",
  "ACCEPT-008 future checkpoint must be followed by a post-run review",
  "BLOCKED-001 this role review is not execution approval",
  "BLOCKED-002 DATA_FRESHNESS_SUPABASE_READS is not enabled in this review",
  "BLOCKED-004 Supabase connection remains blocked",
  "BLOCKED-005 SQL execution remains blocked",
  "BLOCKED-006 Supabase writes remain blocked",
  "BLOCKED-013 scoreSource=real remains blocked",
  "The execution packet is accepted as a preparation artifact.",
  "CEO may now decide\nwhether to open one bounded freshness runtime-read checkpoint",
  "this role\nreview does not execute it",
  "NEXT-SLICE-001 CEO decides whether to open one bounded freshness runtime-read checkpoint",
  "NEXT-SLICE-002 if opened, run all pre-run local checks first",
  "NEXT-SLICE-003 if opened, execute only one temporary-process checkpoint",
  "NEXT-SLICE-004 if executed, immediately record post-run review",
  "scripts/check-freshness-runtime-read-execution-packet-role-review.mjs passes",
  "scripts/check-freshness-runtime-read-execution-packet-draft.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "Supabase remote execution is not performed in this role review slice",
  "public data source remains mock",
  "scoreSource=real remains blocked"
];

const forbiddenPhrases = [
  "EXECUTE_FRESHNESS_RUNTIME_READ_NOW",
  "REMOTE_EXECUTION_PERFORMED",
  "DATA_FRESHNESS_SUPABASE_READS is enabled in this review",
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
