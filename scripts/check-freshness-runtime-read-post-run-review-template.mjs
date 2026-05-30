import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_POST_RUN_REVIEW_TEMPLATE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 freshness runtime-read post-run review template recorded",
  "TEMPLATE_ONLY_NO_RUNTIME_READ_PERFORMED",
  "does not execute the checkpoint",
  "does not\nenable `DATA_FRESHNESS_SUPABASE_READS`",
  "does not modify `.env.local`",
  "does not\nconnect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not fetch\nmarket data",
  "does not record real output",
  "does not approve\n`scoreSource=real`",
  "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_OPEN_DECISION_GATE_2026-05-30.md",
  "scripts/check-freshness-runtime-read-open-decision-gate.mjs",
  "scripts/check-data-freshness-source-fallback.mjs",
  "POSTRUN-FIELD-001 checkpoint_id",
  "POSTRUN-FIELD-005 precheck_result",
  "POSTRUN-FIELD-008 process_stopped",
  "POSTRUN-FIELD-009 rollback_completed",
  "PAGE-FIELD-001 briefing_http_status",
  "PAGE-FIELD-004 briefing_fallback_observed",
  "PAGE-FIELD-005 stock_2330_http_status",
  "PAGE-FIELD-008 stock_2330_fallback_observed",
  "BOUNDARY-FIELD-001 NEXT_PUBLIC_DATA_SOURCE remained mock",
  "BOUNDARY-FIELD-002 DATA_FRESHNESS_SOURCE restored to mock",
  "BOUNDARY-FIELD-003 DATA_FRESHNESS_SUPABASE_READS restored to disabled",
  "BOUNDARY-FIELD-004 .env.local was not modified",
  "BOUNDARY-FIELD-005 SQL was not run",
  "BOUNDARY-FIELD-006 Supabase writes were not run",
  "BOUNDARY-FIELD-010 scoreSource=real remained blocked",
  "BOUNDARY-FIELD-011 CP3 source-depth production gate remained not_ready",
  "STOP-FIELD-004 command attempted SQL",
  "STOP-FIELD-005 command attempted Supabase write",
  "STOP-FIELD-010 scoreSource=real was set or claimed",
  "STOP-FIELD-012 more than one checkpoint attempt was needed",
  "VERDICT-OPTION-001 success_bounded_read_observed_no_promotion",
  "VERDICT-OPTION-002 fallback_observed_no_promotion",
  "VERDICT-OPTION-003 blocked_before_execution",
  "VERDICT-OPTION-004 stopped_due_to_boundary_risk",
  "VERDICT-OPTION-005 inconclusive_requires_new_gate",
  "Any verdict must keep public data source mock",
  "CP3 source-depth production gate not_ready",
  "BLOCKED-001 this template is not execution",
  "BLOCKED-002 DATA_FRESHNESS_SUPABASE_READS is not enabled in this template",
  "BLOCKED-004 Supabase connection remains blocked",
  "BLOCKED-005 SQL execution remains blocked",
  "BLOCKED-006 Supabase writes remain blocked",
  "BLOCKED-013 scoreSource=real remains blocked",
  "The post-run review template is ready before any runtime-read checkpoint is\nopened.",
  "NEXT-SLICE-001 perform role review of this post-run review template",
  "NEXT-SLICE-002 keep OPTION-A unexecuted until CEO explicitly opens it",
  "scripts/check-freshness-runtime-read-post-run-review-template.mjs passes",
  "Supabase remote execution is not performed in this template slice",
  "public data source remains mock",
  "DATA_FRESHNESS_SUPABASE_READS remains disabled",
  "scoreSource=real remains blocked"
];

const forbiddenPhrases = [
  "EXECUTE_FRESHNESS_RUNTIME_READ_NOW",
  "REMOTE_EXECUTION_PERFORMED",
  "REAL_OUTPUT_RECORDED",
  "DATA_FRESHNESS_SUPABASE_READS is enabled in this template",
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
