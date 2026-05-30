import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Local Schema Contract Alignment",
  "CP3 Supabase local schema contract alignment recorded",
  "ALIGN_LOCAL_SCHEMA_CONTRACT_BEFORE_REMOTE_SCHEMA_VALIDATOR_DESIGN",
  "does not connect to Supabase",
  "does not run SQL",
  "does not run remote validation",
  "does not write Supabase",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not promote CP3 readiness",
  "does not approve public claims",
  "supabase/migrations/0001_initial_schema.sql",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "src/lib/supabase/database.types.ts",
  "src/lib/repositories/supabase-raw-market-repository.ts",
  "src/lib/repositories/supabase-data-freshness-repository.ts",
  "`daily_prices`",
  "`twse_stock_day_staging`",
  "`market_assets`",
  "`model_runs`",
  "`data_freshness`",
  "`local-baselined`",
  "`needs-reconciliation`",
  "`remote-only-pending-contract`",
  "runtime-critical",
  "review/support-only",
  "global asset identity",
  "score provenance",
  "freshness disclosure",
  "public.daily_prices",
  "Minimum runtime fields",
  "`stock_id`",
  "`trade_date`",
  "`open`",
  "`high`",
  "`low`",
  "`close`",
  "`volume`",
  "`turnover`",
  "`created_at`",
  "Do not write `daily_prices`",
  "Do not use this alignment as historical-depth or data-quality proof",
  "public.staging_twse_stock_day_runs",
  "public.staging_twse_stock_day_prices",
  "exact reachable object name `twse_stock_day_staging` is not confirmed",
  "view, compatibility alias, remote-only table, or naming mismatch",
  "Do not build runtime dependency on this object yet",
  "Do not write staging rows",
  "No local migration baseline was found in this slice",
  "No generated type baseline was found in this slice",
  "No direct runtime repository usage was confirmed in this slice",
  "Do not claim global coverage from reachability alone",
  "Do not write model run rows",
  "Do not use this object to promote model credibility",
  "Local schema baseline includes `data_runs`, not confirmed `data_freshness`",
  "Reconcile relationship to `data_runs` before runtime dependency",
  "Runtime wiring may continue only against mock/public-safe state",
  "Create a schema-shape validator design gate",
  "must not execute remote validation",
  "must not authorize a connection",
  "Remote schema-shape validation is blocked",
  "Supabase connection is blocked in this slice",
  "SQL execution is blocked",
  "Migration execution is blocked",
  "Supabase writes are blocked",
  "Insert, update, upsert, delete, RPC, and storage writes are blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit are blocked",
  "`.env.local` modification is blocked",
  "`scoreSource=real` remains blocked",
  "CP3 readiness promotion remains blocked",
  "Public market-data claims remain blocked",
  "proceed to a validator design gate, not an execution gate",
  "`daily_prices` is local-baselined",
  "still require reconciliation before runtime code or public claims depend on them",
  "Review gates pass",
  "TypeScript check passes",
  "No remote validation is executed in this slice",
  "CP3 remains `not_ready`",
  "Public data source remains mock"
];

const forbiddenPhrases = [
  "CP3_READY_NOW",
  "PROMOTE_CP3_READINESS_NOW",
  "scoreSource=real approved",
  "ALLOW_SQL_EXECUTION",
  "ALLOW_MIGRATION_EXECUTION",
  "ALLOW_SUPABASE_WRITES",
  "ALLOW_INSERT_UPDATE_UPSERT_DELETE",
  "ALLOW_MARKET_INGESTION",
  "ALLOW_RAW_MARKET_DATA_COMMIT",
  "PUBLIC_CLAIMS_APPROVED",
  "SOURCE_DEPTH_PRODUCTION_READY",
  "REMOTE_SCHEMA_VALIDATION_APPROVED_NOW",
  "REMOTE_SCHEMA_VALIDATION_EXECUTED",
  "CONNECTION_APPROVED_NOW",
  "runtime may depend on market_assets now"
];

const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => content.includes(phrase));

if (missing.length > 0 || forbidden.length > 0) {
  console.error(
    JSON.stringify(
      {
        status: "error",
        target,
        missing,
        forbidden
      },
      null,
      2
    )
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      target,
      requiredPhrases: requiredPhrases.length,
      forbiddenPhrases: forbiddenPhrases.length
    },
    null,
    2
  )
);
