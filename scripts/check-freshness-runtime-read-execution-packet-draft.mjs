import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_EXECUTION_PACKET_DRAFT_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 freshness runtime-read execution packet draft recorded",
  "PREPARE_ONLY_DO_NOT_EXECUTE_FRESHNESS_RUNTIME_READ",
  "does not execute the checkpoint",
  "does not modify `.env.local`",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not fetch market data",
  "does not print secrets",
  "does not approve\n`scoreSource=real`",
  "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_ACTIVATION_GATE_ROLE_REVIEW_2026-05-30.md",
  "scripts/check-freshness-runtime-read-activation-gate.mjs",
  "scripts/check-data-freshness-source-fallback.mjs",
  "src/lib/data-freshness-source.ts",
  "SCOPE-001 one bounded runtime-read attempt for data freshness only",
  "SCOPE-002 target pages are /briefing and /stocks/2330",
  "SCOPE-003 target read path is getRuntimeDataFreshnessSnapshot",
  "SCOPE-004 target source helper is getSupabaseDataFreshnessSnapshot",
  "SCOPE-005 public score source remains mock",
  "SCOPE-006 public data source remains mock",
  "NEXT_PUBLIC_DATA_SOURCE=mock",
  "DATA_FRESHNESS_SOURCE=supabase",
  "DATA_FRESHNESS_SUPABASE_READS=enabled",
  "DATA_FRESHNESS_SOURCE=mock",
  "DATA_FRESHNESS_SUPABASE_READS=disabled",
  "These values are for one temporary process only.",
  "Rollback is mandatory after the checkpoint attempt",
  "PRECHECK-001 node scripts/check-freshness-runtime-read-activation-gate.mjs",
  "PRECHECK-002 node scripts/check-data-freshness-source-fallback.mjs",
  "PRECHECK-003 node scripts/check-freshness-runtime-read-execution-packet-draft.mjs",
  "PRECHECK-004 node scripts/check-review-gates.mjs",
  "PRECHECK-005 node node_modules/typescript/bin/tsc --noEmit",
  "PRECHECK-006 node node_modules/next/dist/bin/next build",
  "EXECUTION-001 use a temporary process environment only",
  "EXECUTION-002 use a disposable localhost port for the checkpoint",
  "EXECUTION-003 request /briefing exactly once",
  "EXECUTION-004 request /stocks/2330 exactly once",
  "EXECUTION-006 do not capture row payloads",
  "EXECUTION-007 do not capture environment values",
  "OUTPUT-004 http_status_by_page",
  "OUTPUT-005 freshness_state_by_page",
  "OUTPUT-007 fallback_observed",
  "The output must not contain Supabase URL, anon key, service role key",
  "STOP-001 any pre-run check fails",
  "STOP-002 .env.local would need to be modified",
  "STOP-004 a command would run SQL",
  "STOP-005 a command would write Supabase",
  "STOP-010 scoreSource=real would be set or claimed",
  "POSTRUN-004 record whether freshness stayed fallback-safe",
  "POSTRUN-005 record whether rollback values were restored",
  "BLOCKED-001 this packet is not execution approval",
  "BLOCKED-002 DATA_FRESHNESS_SUPABASE_READS is not enabled in this slice",
  "BLOCKED-004 Supabase connection remains blocked",
  "BLOCKED-005 SQL execution remains blocked",
  "BLOCKED-006 Supabase writes remain blocked",
  "BLOCKED-013 scoreSource=real remains blocked",
  "The execution packet is ready as a preparation artifact only.",
  "NEXT-SLICE-001 perform role review of this execution packet draft",
  "NEXT-SLICE-002 do not execute the checkpoint during role review",
  "scripts/check-freshness-runtime-read-execution-packet-draft.mjs passes",
  "Supabase remote execution is not performed in this packet draft slice",
  "public data source remains mock",
  "scoreSource=real remains blocked"
];

const forbiddenPhrases = [
  "EXECUTE_FRESHNESS_RUNTIME_READ_NOW",
  "REMOTE_EXECUTION_PERFORMED",
  "DATA_FRESHNESS_SUPABASE_READS is enabled in this slice",
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
