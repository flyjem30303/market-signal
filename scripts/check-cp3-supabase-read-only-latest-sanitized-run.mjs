import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_SUPABASE_READ_ONLY_LATEST_SANITIZED_RUN_2026-06-02.md";
const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Read-Only Latest Sanitized Run",
  "Date: 2026-06-02",
  "CP3 Supabase read-only latest sanitized run recorded",
  "ACCEPT_BLOCKED_READ_ONLY_ATTEMPT_AS_LATEST_SANITIZED_EVIDENCE",
  "one process-scoped Supabase read-only validator attempt",
  "does not record secrets",
  "row payloads",
  "raw validator output",
  "raw market data",
  "Execution count: one guarded read-only attempt",
  "Exit code: `1`",
  "Validator status: `blocked`",
  "Validator reason: `read_only_validation_blocked`",
  "Connection status: `blocked`",
  "Required environment variables: present, values not recorded",
  "Files written: `false`",
  "Mutations: `false`",
  "SQL executed: `false`",
  "RPC called: `false`",
  "Secrets printed: `false`",
  "Row payloads printed: `false`",
  "Public claims changed: `false`",
  "`scoreSource=real` changed: `false`",
  "Source-depth ready changed: `false`",
  "`daily_prices`",
  "`twse_stock_day_staging`",
  "`market_assets`",
  "`model_runs`",
  "`data_freshness`",
  "error category `unknown`",
  "error code state `blank`",
  "blocked object-reachability evidence only",
  "not evidence of schema sufficiency",
  "row freshness",
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
  "Supabase object reachability is currently blocked",
  "first classified attempt returned `unknown` with blank error codes",
  "why the Supabase SDK result has no usable error code",
  "root-cause isolation",
  "credential scope",
  "table/RLS policy",
  "object existence",
  "project URL",
  "environment loading",
  "Runtime wiring",
  "keeps public data source as mock",
  "keeps `scoreSource=real` blocked",
  "Latest sanitized run checker passes",
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
  "row count:",
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
