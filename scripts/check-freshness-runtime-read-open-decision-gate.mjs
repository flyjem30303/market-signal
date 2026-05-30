import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_OPEN_DECISION_GATE_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: CP3 freshness runtime-read open decision gate recorded",
  "DECISION_GATE_ONLY_DO_NOT_EXECUTE_FRESHNESS_RUNTIME_READ",
  "does not execute the checkpoint",
  "does not enable\n`DATA_FRESHNESS_SUPABASE_READS`",
  "does not modify `.env.local`",
  "does not connect\nto Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not fetch market\ndata",
  "does not approve `scoreSource=real`",
  "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_EXECUTION_PACKET_ROLE_REVIEW_2026-05-30.md",
  "scripts/check-freshness-runtime-read-execution-packet-role-review.mjs",
  "scripts/check-freshness-runtime-read-execution-packet-draft.mjs",
  "scripts/check-data-freshness-source-fallback.mjs",
  "OPTION-A open one bounded freshness runtime-read checkpoint after all pre-run checks pass",
  "OPTION-B defer remote runtime read and continue local-only runtime support work",
  "OPTION-C revise packet if any condition, output, page target, or env boundary changes",
  "CEO recommendation: choose OPTION-B",
  "OPEN-001 run all pre-run local checks first",
  "OPEN-002 use temporary process env only",
  "OPEN-003 set NEXT_PUBLIC_DATA_SOURCE=mock",
  "OPEN-004 set DATA_FRESHNESS_SOURCE=supabase",
  "OPEN-005 set DATA_FRESHNESS_SUPABASE_READS=enabled",
  "OPEN-006 request /briefing exactly once",
  "OPEN-007 request /stocks/2330 exactly once",
  "OPEN-010 restore DATA_FRESHNESS_SOURCE=mock",
  "OPEN-011 restore DATA_FRESHNESS_SUPABASE_READS=disabled",
  "PRECHECK-001 node scripts/check-freshness-runtime-read-open-decision-gate.mjs",
  "PRECHECK-006 node scripts/check-review-gates.mjs",
  "PRECHECK-007 node node_modules/typescript/bin/tsc --noEmit",
  "PRECHECK-008 node node_modules/next/dist/bin/next build",
  "STOP-001 .env.local would need to be modified",
  "STOP-003 any command would run SQL",
  "STOP-004 any command would write Supabase",
  "STOP-010 scoreSource=real would be set or claimed",
  "STOP-012 more than one checkpoint attempt would be needed",
  "DEFER-001 keep NEXT_PUBLIC_DATA_SOURCE=mock",
  "DEFER-002 keep DATA_FRESHNESS_SOURCE=mock",
  "DEFER-003 keep DATA_FRESHNESS_SUPABASE_READS=disabled",
  "DEFER-004 continue local-only runtime support work",
  "BLOCKED-001 this decision gate is not execution",
  "BLOCKED-002 DATA_FRESHNESS_SUPABASE_READS is not enabled in this gate",
  "BLOCKED-004 Supabase connection remains blocked",
  "BLOCKED-005 SQL execution remains blocked",
  "BLOCKED-006 Supabase writes remain blocked",
  "BLOCKED-013 scoreSource=real remains blocked",
  "CEO chooses to keep this\nslice as decision-gate-only: no remote execution is performed now",
  "NEXT-SLICE-001 continue local-only runtime support work",
  "NEXT-SLICE-002 improve post-run review template before any future OPTION-A execution",
  "NEXT-SLICE-003 keep OPTION-A unexecuted until CEO explicitly opens it",
  "scripts/check-freshness-runtime-read-open-decision-gate.mjs passes",
  "Supabase remote execution is not performed in this decision gate slice",
  "public data source remains mock",
  "DATA_FRESHNESS_SUPABASE_READS remains disabled",
  "scoreSource=real remains blocked"
];

const forbiddenPhrases = [
  "EXECUTE_FRESHNESS_RUNTIME_READ_NOW",
  "REMOTE_EXECUTION_PERFORMED",
  "OPTION-A executed",
  "DATA_FRESHNESS_SUPABASE_READS is enabled in this gate",
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
