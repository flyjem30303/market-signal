import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Schema-Shape Read-Only Evidence Plan",
  "CP3 Supabase schema-shape read-only evidence plan recorded",
  "PLAN_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_BEFORE_RUNTIME_WIRING",
  "does not connect to Supabase",
  "does not run SQL",
  "does not run remote validation",
  "does not write Supabase",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not promote CP3 readiness",
  "Can the project prove, with sanitized read-only evidence",
  "minimum table/view shape required by the CP3 runtime path",
  "not a data-quality gate",
  "not a data-freshness gate",
  "not a scoring-correctness gate",
  "not a public-claim gate",
  "not a production-readiness gate",
  "supabase/migrations/0001_initial_schema.sql",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "src/lib/supabase/database.types.ts",
  "src/lib/repositories/supabase-raw-market-repository.ts",
  "`daily_prices`",
  "`twse_stock_day_staging`",
  "`market_assets`",
  "`model_runs`",
  "`data_freshness`",
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
  "reads `close`, `high`, `low`, `open`, `trade_date`, `turnover`, and `volume`",
  "the exact object name `twse_stock_day_staging` needs reconciliation",
  "Is `twse_stock_day_staging` a table, view, alias, or remote-only object?",
  "reachable remotely, but no local migration or generated TypeScript definition was found",
  "Is `market_assets` a table, view, or remote-only compatibility object?",
  "Is `model_runs` a table, view, or remote-only object?",
  "Is `data_freshness` a table, view, or remote-only compatibility object?",
  "Local code currently references `data_runs` for freshness behavior",
  "`objects[].shapeStatus`",
  "`objects[].fieldNamesPresent`",
  "`objects[].missingExpectedFields`",
  "`objects[].unexpectedRuntimeBlockers`",
  "`filesWritten`",
  "`mutations`",
  "`sqlExecuted`",
  "`rpcCalled`",
  "`secretsPrinted`",
  "`rowPayloadsPrinted`",
  "`scoreSourceRealChanged`",
  "`sourceDepthReadyChanged`",
  "`publicClaimsChanged`",
  "must not print row values",
  "This plan does not authorize remote schema-shape validation",
  "A separate execution decision gate is required",
  "Every reachable object has a documented local baseline or a documented remote-only reconciliation path",
  "`daily_prices` minimum runtime fields are confirmed",
  "`twse_stock_day_staging` object identity is reconciled",
  "`market_assets`, `model_runs`, and `data_freshness` have documented shape status",
  "No row payloads are printed",
  "No SQL is executed",
  "No Supabase writes occur",
  "No market data is fetched, parsed, ingested, or committed",
  "`scoreSource=real` remains blocked",
  "CP3 remains `not_ready` until later role review",
  "not another reachability retry and not immediate runtime wiring",
  "reconciles local schema assumptions with reachable remote objects",
  "Perform role review of this schema-shape read-only evidence plan",
  "Do not execute remote schema-shape validation in the role-review slice",
  "Review gates pass",
  "TypeScript check passes",
  "No remote validation is executed in this slice",
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
  "REMOTE_SCHEMA_VALIDATION_EXECUTED",
  "REMOTE_SCHEMA_VALIDATION_APPROVED_NOW",
  "row payloads may be printed",
  "schema shape proves data quality"
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
