import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_ONE_CHECKPOINT_POST_RUN_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 freshness runtime-read one checkpoint post-run review recorded",
  "BOUNDED_CHECKPOINT_COMPLETED_HTTP_200_NO_PROMOTION",
  "One bounded freshness runtime-read checkpoint was executed with temporary\nprocess env only.",
  "requested `/briefing` exactly once and `/stocks/2330`\nexactly once",
  "Both page requests returned HTTP 200.",
  "The temporary process was\nstopped.",
  "Rollback was confirmed to `DATA_FRESHNESS_SOURCE=mock`,\n`DATA_FRESHNESS_SUPABASE_READS=disabled`, and `NEXT_PUBLIC_DATA_SOURCE=mock`.",
  "does not approve production readiness",
  "does not approve\npublic claims",
  "does not approve CP3 source-depth readiness",
  "does not approve\ndata quality",
  "does not approve market-data ingestion",
  "does not approve\n`scoreSource=real`",
  "PRECHECK-001 scripts/check-freshness-runtime-read-dry-run-command-map-role-review-and-readiness-decision.mjs passed",
  "RUNTIME-BOUNDARY-001 temporary process env only",
  "RUNTIME-BOUNDARY-002 NEXT_PUBLIC_DATA_SOURCE=mock",
  "RUNTIME-BOUNDARY-003 DATA_FRESHNESS_SOURCE=supabase only inside the temporary process",
  "RUNTIME-BOUNDARY-004 DATA_FRESHNESS_SUPABASE_READS=enabled only inside the temporary process",
  "RUNTIME-BOUNDARY-005 .env.local was not modified",
  "RUNTIME-BOUNDARY-006 no SQL command was run",
  "RUNTIME-BOUNDARY-007 no Supabase write command was run",
  "RUNTIME-BOUNDARY-008 no market-data fetch command was run",
  "RUNTIME-BOUNDARY-010 no scoreSource=real setting was used",
  "OBSERVE-001 process_started yes",
  "OBSERVE-002 briefing_http_status 200",
  "OBSERVE-003 stock_2330_http_status 200",
  "OBSERVE-004 process_stopped yes",
  "OBSERVE-005 rollback_completed yes",
  "OBSERVE-006 fallback_state unknown",
  "OBSERVE-007 row_payload_output_seen no",
  "OBSERVE-008 secret_output_seen no",
  "OBSERVE-009 sql_execution_seen no",
  "OBSERVE-010 supabase_write_seen no",
  "OBSERVE-011 market_data_fetch_seen no",
  "OBSERVE-012 market_row_parse_seen no",
  "The checkpoint produced HTTP availability evidence only.",
  "It did not produce\nrow-level evidence, data-quality evidence, market-source evidence, source-depth\nevidence, or score-source promotion evidence.",
  "STOP-AND-ROLLBACK-001 temporary process was stopped after the two page observations",
  "STOP-AND-ROLLBACK-005 normal mock dev server was restarted after the checkpoint",
  "STOP-AND-ROLLBACK-006 /stocks/2330 returned HTTP 200 after rollback",
  "STOP-AND-ROLLBACK-007 /stocks/TWII returned HTTP 200 after rollback",
  "BLOCKED-001 no SQL execution is approved",
  "BLOCKED-002 no Supabase write is approved",
  "BLOCKED-007 no market-data ingestion is approved",
  "BLOCKED-014 scoreSource=real remains blocked",
  "BLOCKED-015 CP3 source-depth production gate remains not_ready",
  "CEO decision: stop local preparation for freshness runtime-read.",
  "NEXT-STAGE-001 do not repeat this same freshness runtime-read checkpoint unless a new code or env boundary changes",
  "NEXT-STAGE-002 prepare a separate bounded read-only schema/data-shape evidence step before SQL or writes",
  "scripts/check-freshness-runtime-read-one-checkpoint-post-run-review.mjs passes",
  "SQL execution remains blocked",
  "Supabase writes remain blocked",
  "market ingestion remains blocked",
  "scoreSource=real remains blocked"
];

const forbiddenPhrases = [
  "PRODUCTION_READY_APPROVED",
  "PUBLIC_CLAIMS_APPROVED",
  "SOURCE_DEPTH_READY",
  "DATA_QUALITY_APPROVED",
  "MARKET_INGESTION_APPROVED",
  "APPROVE_SQL_EXECUTION",
  "APPROVE_SUPABASE_WRITE",
  "APPROVE_DAILY_PRICES_WRITE",
  "scoreSource=real approved",
  "row payload output seen yes",
  "secret output seen yes",
  "service role key",
  "anon key value",
  "Supabase URL value"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));
const status = missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      evidence_level: "http_availability_only",
      forbidden,
      missing,
      promotions: {
        cp3_source_depth: "not_ready",
        public_claims: "blocked",
        score_source: "mock",
        sql: "blocked",
        supabase_writes: "blocked"
      },
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exitCode = 1;
}
