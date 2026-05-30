import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_RECONCILIATION_PLAN_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: `CP3 TWSE stock day staging reconciliation plan recorded`",
  "RECONCILE_TWSE_STOCK_DAY_STAGING_BEFORE_RUNTIME_OR_MIGRATION_ACTION",
  "does not authorize a second remote attempt",
  "does not connect to Supabase",
  "does not run a validator",
  "does not run SQL",
  "does not create or edit migrations",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "INPUT-001 CP3_SUPABASE_SCHEMA_SHAPE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-05-30 records twse_stock_day_staging reachable ok",
  "INPUT-002 CP3_SUPABASE_SCHEMA_SHAPE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-05-30 records twse_stock_day_staging shapeStatus needs-reconciliation",
  "INPUT-003 CP3_SUPABASE_SCHEMA_SHAPE_EVIDENCE_TO_ACTION_MAP_2026-05-30 sets twse_stock_day_staging as P0",
  "INPUT-004 CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30 says local migration defines staging_twse_stock_day_runs and staging_twse_stock_day_prices",
  "INPUT-005 CP3_TWSE_STOCK_DAY_STAGING_SQL_DESIGN_2026-05-29 says future migration scope should define exactly staging_twse_stock_day_runs and staging_twse_stock_day_prices",
  "INPUT-006 no local baseline currently confirms exact object name twse_stock_day_staging",
  "QUESTION-001 What is twse_stock_day_staging relative to the local staging baseline?",
  "Alias",
  "View",
  "Table",
  "Naming mismatch",
  "Deprecate reliance",
  "CHECK-001 inspect local migrations for staging_twse_stock_day_runs",
  "CHECK-002 inspect local migrations for staging_twse_stock_day_prices",
  "CHECK-005 inspect repository code for twse_stock_day_staging references",
  "CHECK-009 do not query Supabase",
  "CHECK-010 do not run SQL",
  "DIRECTION-001 default canonical local names remain staging_twse_stock_day_runs and staging_twse_stock_day_prices",
  "DIRECTION-002 twse_stock_day_staging remains non-canonical until reconciled",
  "DIRECTION-003 do not add runtime dependency on twse_stock_day_staging",
  "DIRECTION-004 do not create compatibility SQL yet",
  "DIRECTION-005 do not rename migrations or generated types in this slice",
  "CEO-FINDING-001 reconciliation is now the fastest safe path toward runtime clarity",
  "ENGINEERING-FINDING-001 local canonical design has two staging objects, not the singular reachable name",
  "ENGINEERING-FINDING-002 twse_stock_day_staging must remain review/support-only until object identity is resolved",
  "DATA-FINDING-001 schema-shape reachability does not identify whether the object is table, view, or alias",
  "GUARDRAIL-001 no second remote schema-shape attempt",
  "GUARDRAIL-002 no Supabase connection",
  "GUARDRAIL-004 no SQL execution",
  "GUARDRAIL-006 no migration creation or edit",
  "GUARDRAIL-007 no Supabase writes",
  "GUARDRAIL-010 no market-data fetch, parse, ingestion, or raw market-data commit",
  "GUARDRAIL-012 no scoreSource=real",
  "GUARDRAIL-014 no CP3 readiness promotion",
  "CEO accepts this reconciliation plan as the P0 response to schema-shape evidence.",
  "`staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` remain canonical",
  "`twse_stock_day_staging` is a reachable remote evidence name but not a runtime dependency",
  "NEXT-SLICE-001 perform local-only staging reference audit",
  "NEXT-SLICE-002 classify twse_stock_day_staging as alias, view, table, naming mismatch, or deprecated runtime reliance",
  "NEXT-SLICE-003 record recommended canonical naming rule",
  "scripts/check-cp3-twse-stock-day-staging-reconciliation-plan.mjs passes",
  "scripts/check-cp3-supabase-schema-shape-evidence-to-action-map.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "AUTHORIZE_SECOND_ATTEMPT",
  "RUN_VALIDATOR_AGAIN",
  "CONNECT_TO_SUPABASE_NOW",
  "SQL execution is approved now",
  "migration execution is approved now",
  "Supabase writes are approved now",
  "market ingestion is approved now",
  "scoreSource=real approved",
  "CP3_READY_NOW",
  "public claims are approved",
  "runtime readiness is approved"
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
