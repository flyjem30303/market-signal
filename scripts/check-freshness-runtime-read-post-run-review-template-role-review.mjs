import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_POST_RUN_REVIEW_TEMPLATE_ROLE_REVIEW_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 freshness runtime-read post-run review template role review recorded",
  "ACCEPT_POST_RUN_REVIEW_TEMPLATE_BOUNDARY",
  "does not execute\nthe checkpoint",
  "does not enable `DATA_FRESHNESS_SUPABASE_READS`",
  "does not\nmodify `.env.local`",
  "does not connect to Supabase",
  "does not run SQL",
  "does not\nwrite Supabase",
  "does not fetch market data",
  "does not record real output",
  "does\nnot approve `scoreSource=real`",
  "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_POST_RUN_REVIEW_TEMPLATE_2026-05-30.md",
  "scripts/check-freshness-runtime-read-post-run-review-template.mjs",
  "scripts/check-freshness-runtime-read-open-decision-gate.mjs",
  "scripts/check-data-freshness-source-fallback.mjs",
  "CEO-FINDING-001 the template makes future execution accountable before execution occurs",
  "CEO-FINDING-003 the verdict options preserve no-promotion boundaries",
  "CEO-FINDING-004 the template is preparation-only and does not approve execution",
  "PM-FINDING-003 page observation fields cover both /briefing and /stocks/2330",
  "PM-FINDING-004 boundary confirmation fields explicitly capture rollback and no-promotion state",
  "ENGINEERING-FINDING-001 process_started and process_stopped are required fields",
  "ENGINEERING-FINDING-002 rollback_completed is a required field",
  "ENGINEERING-FINDING-004 DATA_FRESHNESS_SOURCE and DATA_FRESHNESS_SUPABASE_READS rollback fields are explicit",
  "ENGINEERING-FINDING-006 the checker does not connect to Supabase or run the checkpoint",
  "QA-FINDING-001 verdict options include success without promotion, fallback, blocked, stopped, and inconclusive",
  "QA-FINDING-003 template status clearly says no runtime read was performed",
  "DATA-FINDING-003 no staging rows or daily_prices writes are authorized",
  "DATA-FINDING-005 CP3 source-depth production gate remains not_ready",
  "SECURITY-FINDING-001 the template requires confirmation that .env.local was not modified",
  "SECURITY-FINDING-005 this role review prints no secret values and records no real output",
  "LEGAL-FINDING-002 no scoreSource=real claim is authorized",
  "LEGAL-FINDING-004 public data source remains mock",
  "ACCEPT-001 the template may be used only after a future explicitly opened checkpoint",
  "ACCEPT-002 the template must record rollback_completed",
  "ACCEPT-003 the template must record process_stopped",
  "ACCEPT-006 the template must choose exactly one verdict option",
  "ACCEPT-007 the template must keep public data source mock",
  "ACCEPT-008 the template must keep scoreSource=real blocked",
  "BLOCKED-001 this role review is not execution",
  "BLOCKED-002 DATA_FRESHNESS_SUPABASE_READS is not enabled in this role review",
  "BLOCKED-004 Supabase connection remains blocked",
  "BLOCKED-005 SQL execution remains blocked",
  "BLOCKED-006 Supabase writes remain blocked",
  "BLOCKED-013 scoreSource=real remains blocked",
  "The post-run review template is accepted.",
  "OPTION-A remains unexecuted.",
  "continue local-only runtime support unless CEO explicitly opens the bounded\ncheckpoint later",
  "NEXT-SLICE-001 continue local-only runtime support work",
  "NEXT-SLICE-002 keep OPTION-A unexecuted until CEO explicitly opens it",
  "scripts/check-freshness-runtime-read-post-run-review-template-role-review.mjs passes",
  "scripts/check-freshness-runtime-read-post-run-review-template.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "Supabase remote execution is not performed in this role review slice",
  "public data source remains mock",
  "DATA_FRESHNESS_SUPABASE_READS remains disabled",
  "scoreSource=real remains blocked"
];

const forbiddenPhrases = [
  "EXECUTE_FRESHNESS_RUNTIME_READ_NOW",
  "REMOTE_EXECUTION_PERFORMED",
  "REAL_OUTPUT_RECORDED",
  "OPTION-A executed",
  "DATA_FRESHNESS_SUPABASE_READS is enabled in this role review",
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
