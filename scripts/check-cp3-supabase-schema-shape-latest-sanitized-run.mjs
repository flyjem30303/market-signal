import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_LATEST_SANITIZED_RUN_2026-05-31.md";
const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Schema-Shape Latest Sanitized Run",
  "Date: 2026-05-31",
  "CP3 Supabase schema-shape latest sanitized run recorded",
  "ACCEPT_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_WITHOUT_READINESS_PROMOTION",
  "one process-scoped Supabase schema-shape read-only validator attempt",
  "does not record secrets",
  "row payloads",
  "raw validator output",
  "raw market data",
  "Execution count: one guarded schema-shape read-only attempt",
  "Exit code: `0`",
  "Validator status: `ok`",
  "Validator reason: `schema_shape_validation_ok`",
  "Connection status: `ok`",
  "Validator mode: `schema_shape_readonly_remote_validation`",
  "Row limit: `0`",
  "Required environment variables: present, values not recorded",
  "Files written: `false`",
  "Mutations: `false`",
  "SQL executed: `false`",
  "RPC called: `false`",
  "Secrets printed: `false`",
  "Row payloads printed: `false`",
  "Raw market data printed: `false`",
  "Public claims changed: `false`",
  "`scoreSource=real` changed: `false`",
  "Source-depth ready changed: `false`",
  "`daily_prices`: reachable `ok`; contract status `local-baselined`; shape status `ok`; missing expected fields `none`",
  "`twse_stock_day_staging`: reachable `ok`; contract status `needs-reconciliation`; shape status `needs-reconciliation`",
  "`staging_twse_stock_day_runs`",
  "`staging_twse_stock_day_prices`",
  "`market_assets`: reachable `ok`; contract status `remote-only-pending-contract`; shape status `ok`",
  "`model_runs`: reachable `ok`; contract status `remote-only-pending-contract`; shape status `ok`",
  "`data_freshness`: reachable `ok`; contract status `remote-only-pending-contract`; shape status `ok`",
  "schema-shape evidence only",
  "not evidence of row freshness",
  "data completeness",
  "data quality",
  "model credibility",
  "production source-depth readiness",
  "public claim readiness",
  "`scoreSource=real` readiness",
  "Public data source remains mock",
  "`scoreSource=real` remains blocked",
  "CP3 readiness remains `not_ready`",
  "Source-depth production gate remains blocked",
  "SQL execution remains blocked",
  "Migration execution remains blocked",
  "Supabase writes remain blocked",
  "Insert, update, upsert, delete, RPC, and storage writes remain blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit remain blocked",
  "Public market-data claims remain blocked",
  "Additional remote attempts require a new explicit gate",
  "Schema-shape evidence is now successful",
  "reconciling `twse_stock_day_staging` naming and contract status",
  "runtime can consume read-only freshness/schema evidence",
  "public data source and score source remain mock",
  "Create a `twse_stock_day_staging` reconciliation action map",
  "Keep no SQL, no Supabase writes, no market ingestion, no public claims, and no `scoreSource=real`",
  "Latest schema-shape sanitized run checker passes",
  "Review gates pass",
  "TypeScript check passes"
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
  "SECOND_REMOTE_ATTEMPT_APPROVED",
  "KEY_PREFIX_RECORDED",
  "KEY_SUFFIX_RECORDED",
  "raw output committed"
];

const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => content.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked",
      target
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
