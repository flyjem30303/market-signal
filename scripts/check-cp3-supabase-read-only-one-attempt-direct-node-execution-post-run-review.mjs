import { readFileSync } from "node:fs";

const target =
  "docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_ATTEMPT_DIRECT_NODE_EXECUTION_POST_RUN_REVIEW_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Read-Only One-Attempt Direct-Node Execution Post-Run Review",
  "CP3 Supabase read-only one-attempt direct-node execution post-run review recorded",
  "ACCEPT_SANITIZED_READ_ONLY_RETRY_EVIDENCE_FOR_ROLE_REVIEW",
  "one authorized process-scoped direct-node read-only retry",
  "does not promote CP3 readiness",
  "does not set `scoreSource=real`",
  "does not approve SQL",
  "does not approve writes",
  "does not approve ingestion",
  "does not approve public claims",
  "scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate.mjs",
  "scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate-role-review.mjs",
  "scripts/check-cp3-supabase-read-only-one-attempt-direct-node-execution-decision-gate.mjs",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs",
  "Execution count: one authorized attempt",
  "Command path: direct Node",
  "Confirmation scope: process-scoped only",
  "Exit code: `0`",
  "Validator status: `ok`",
  "Validator reason: `read_only_validation_ok`",
  "Connection status: `ok`",
  "required variables were present, values were not recorded",
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
  "object-reachability evidence only",
  "not data completeness evidence",
  "not data quality evidence",
  "not model credibility evidence",
  "not production source-depth evidence",
  "No secrets, key prefixes, key suffixes, key lengths, row payloads, or raw market data",
  "No raw validator output is committed as an artifact",
  "Only sanitized status categories and object names are recorded",
  "CP3 readiness promotion is blocked until role review",
  "`scoreSource=real` remains blocked",
  "SQL execution remains blocked",
  "Migration execution remains blocked",
  "Supabase writes remain blocked",
  "Insert, update, upsert, delete, RPC, and storage writes remain blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit remain blocked",
  "Public data source remains mock",
  "Source-depth production gate remains blocked",
  "Public market-data claims remain blocked",
  "Additional retry attempts remain blocked",
  "should move to role review",
  "should not by itself promote runtime readiness",
  "Perform role review of this post-run evidence",
  "Keep CP3 as `not_ready` until role review explicitly changes the status",
  "Review gates pass",
  "TypeScript check passes",
  "CP3 remains `not_ready`"
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
  "SECOND_RETRY_APPROVED",
  "raw validator output committed",
  "KEY_PREFIX_RECORDED",
  "KEY_SUFFIX_RECORDED",
  "row payload recorded"
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
