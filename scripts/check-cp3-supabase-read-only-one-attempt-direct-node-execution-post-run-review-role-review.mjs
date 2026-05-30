import { readFileSync } from "node:fs";

const target =
  "docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_ATTEMPT_DIRECT_NODE_EXECUTION_POST_RUN_REVIEW_ROLE_REVIEW_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Read-Only One-Attempt Direct-Node Execution Post-Run Review Role Review",
  "CP3 Supabase read-only one-attempt direct-node execution post-run review role review recorded",
  "ACCEPT_OBJECT_REACHABILITY_AS_NARROW_CP3_PREREQUISITE",
  "only as a narrow CP3 prerequisite for Supabase object reachability",
  "does not promote CP3 readiness",
  "does not approve live market-data ingestion",
  "does not approve SQL",
  "does not approve Supabase writes",
  "does not approve public claims",
  "does not set `scoreSource=real`",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_ATTEMPT_DIRECT_NODE_EXECUTION_POST_RUN_REVIEW_2026-05-30.md",
  "scripts/check-cp3-supabase-read-only-one-attempt-direct-node-execution-post-run-review.mjs",
  "scripts/validate-supabase-readonly.mjs",
  "`daily_prices`",
  "`twse_stock_day_staging`",
  "`market_assets`",
  "`model_runs`",
  "`data_freshness`",
  "Validator returned `status: ok`",
  "Validator returned `connection: ok`",
  "Validator reported no file writes",
  "Validator reported no mutations",
  "Validator reported no SQL execution",
  "Validator reported no RPC call",
  "Validator reported no secrets printed",
  "Validator reported no row payloads printed",
  "Validator reported no public-claim change",
  "Validator reported no `scoreSource=real` change",
  "Validator reported no source-depth-ready change",
  "can the app-side validator reach the expected Supabase objects without writes? Yes",
  "not as launch readiness",
  "remote object reachability is no longer unknown",
  "Additional retries need a new gate",
  "It does not validate table schema sufficiency",
  "row freshness",
  "data completeness",
  "scoring correctness",
  "UI runtime wiring",
  "QA requires follow-up gates for schema shape",
  "Object reachability is accepted as a narrow data-platform prerequisite",
  "not accepted as market-data quality evidence",
  "secrets, key prefixes, key suffixes, key lengths, row payloads, and raw validator output were not committed",
  "process-scoped confirmation and sanitized reporting",
  "No public claim may be made from this evidence",
  "Supabase object reachability prerequisite: accepted",
  "CP3 readiness: remains `not_ready`",
  "Public data source: remains mock",
  "`scoreSource=real`: remains blocked",
  "Source-depth production gate: remains blocked",
  "SQL execution remains blocked",
  "Migration execution remains blocked",
  "Supabase writes remain blocked",
  "Insert, update, upsert, delete, RPC, and storage writes remain blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit remain blocked",
  "Additional remote retries remain blocked",
  "The CEO accepts Supabase object reachability as completed for the narrow CP3 prerequisite",
  "move to the next bounded prerequisite",
  "schema-shape/read-only evidence or mock-only runtime wiring",
  "Create a next-prerequisite options map for post-reachability work",
  "Do not run SQL",
  "Do not write Supabase",
  "Do not ingest market data",
  "Do not set `scoreSource=real`",
  "Review gates pass",
  "TypeScript check passes",
  "Supabase object reachability is accepted only as a narrow prerequisite"
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
  "launch readiness approved",
  "market-data quality accepted",
  "real data source approved"
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
