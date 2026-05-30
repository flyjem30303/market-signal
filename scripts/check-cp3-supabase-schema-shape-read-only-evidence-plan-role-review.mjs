import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN_ROLE_REVIEW_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Schema-Shape Read-Only Evidence Plan Role Review",
  "CP3 Supabase schema-shape read-only evidence plan role review recorded",
  "ACCEPT_SCHEMA_SHAPE_PLAN_AND_PRIORITIZE_LOCAL_SCHEMA_DOCUMENTATION_ALIGNMENT",
  "does not authorize remote schema-shape validation",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not promote CP3 readiness",
  "does not approve public claims",
  "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN_2026-05-30.md",
  "supabase/migrations/0001_initial_schema.sql",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "src/lib/supabase/database.types.ts",
  "src/lib/repositories/supabase-raw-market-repository.ts",
  "The schema-shape plan is accepted",
  "local schema documentation alignment before validator design",
  "`daily_prices` has local schema/type support",
  "`twse_stock_day_staging` needs object-name reconciliation",
  "`market_assets`, `model_runs`, and `data_freshness` are reachable remotely but not represented in local migration/type baselines",
  "stable contract for Engineering, QA, Data, and Security",
  "canonical local/remote contract first",
  "tables, views, aliases, or compatibility objects",
  "validator design should follow only after the contract is explicit",
  "separates object reachability, schema shape, data quality, freshness, scoring correctness, and public claims",
  "preserve `not_ready` status",
  "no remote validation occurred",
  "schema prerequisite only",
  "does not accept shape evidence as freshness",
  "blocks row values, sample rows, key material, SQL result payloads, raw market data",
  "separate execution gate",
  "No public claim",
  "source-depth production wording",
  "Schema-shape evidence is the correct prerequisite after reachability",
  "Local schema documentation alignment should happen before remote validator design",
  "`daily_prices` is the only reviewed object with clear local schema/type support",
  "`twse_stock_day_staging` requires object-name reconciliation",
  "`market_assets`, `model_runs`, and `data_freshness` require local/remote contract documentation before runtime wiring",
  "Future remote schema-shape validation requires a separate execution decision gate",
  "Remote schema-shape validation is blocked",
  "Supabase connection is blocked in this role-review slice",
  "SQL execution is blocked",
  "Migration execution is blocked",
  "Supabase writes are blocked",
  "Insert, update, upsert, delete, RPC, and storage writes are blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit are blocked",
  "`.env.local` modification is blocked",
  "`scoreSource=real` remains blocked",
  "CP3 readiness promotion remains blocked",
  "Public market-data claims remain blocked",
  "local schema documentation alignment as the next slice before validator design",
  "reduces ambiguity around object names and ownership without touching Supabase",
  "runtime wiring encodes the wrong contract",
  "Create a local-only CP3 Supabase schema contract alignment document",
  "maps reachable remote objects to local migrations, generated types, and runtime repositories",
  "marks each object as local-baselined, needs reconciliation, or remote-only pending contract",
  "records expected field categories for remote-only objects",
  "identifies which objects are runtime-critical versus review/support-only",
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
  "validator design is first priority",
  "runtime wiring is first priority"
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
