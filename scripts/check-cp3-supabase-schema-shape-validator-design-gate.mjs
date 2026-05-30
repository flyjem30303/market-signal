import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_VALIDATOR_DESIGN_GATE_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Schema-Shape Validator Design Gate",
  "CP3 Supabase schema-shape validator design gate recorded",
  "DESIGN_SCHEMA_SHAPE_VALIDATOR_WITHOUT_EXECUTION_AUTHORIZATION",
  "does not implement the validator",
  "does not connect to Supabase",
  "does not run remote validation",
  "does not run SQL",
  "does not write Supabase",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not promote CP3 readiness",
  "does not approve public claims",
  "docs/reviews/CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30.md",
  "Can the reachable Supabase objects expose the expected field names or documented reconciliation status",
  "must not prove data quality",
  "data freshness",
  "row completeness",
  "historical depth",
  "model credibility",
  "source-depth readiness",
  "`scripts/validate-supabase-schema-shape-readonly.mjs`",
  "This file is not created in this slice",
  "SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION",
  "CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE",
  "`daily_prices`",
  "`twse_stock_day_staging`",
  "`market_assets`",
  "`model_runs`",
  "`data_freshness`",
  "`local-baselined`",
  "`needs-reconciliation`",
  "`remote-only-pending-contract`",
  "verify expected field names can be projected by name",
  "do not validate historical depth",
  "do not write `daily_prices`",
  "classify object kind as `table`, `view`, `alias`, `remote_only`, `unknown`, or `blocked`",
  "do not fetch staging source rows",
  "do not write staging rows",
  "do not claim global coverage",
  "do not wire runtime to this object",
  "do not write model run rows",
  "do not promote model credibility",
  "do not set `scoreSource=real`",
  "classify relationship to local `data_runs`",
  "do not claim freshness quality",
  "`rawMarketDataPrinted`",
  "`objects[].contractStatus`",
  "`objects[].objectKind`",
  "`objects[].fieldNamesPresent`",
  "`objects[].missingExpectedFields`",
  "`objects[].relationshipToLocalBaseline`",
  "must not print",
  "row values",
  "sample rows",
  "key material",
  "key prefixes",
  "key suffixes",
  "key lengths",
  "SQL result payloads",
  "raw market data",
  "unredacted secret-bearing errors",
  "use Supabase client metadata/query projection only as read-only evidence",
  "set a strict row limit of `0` or avoid row selection where possible",
  "never call `insert`, `update`, `upsert`, `delete`, `rpc`, or storage writes",
  "never execute raw SQL",
  "never create seed SQL",
  "never write output files automatically",
  "never mutate `.env.local`",
  "return fail-closed JSON on missing confirmation",
  "This design gate does not authorize implementation or execution",
  "A later execution decision gate is required before any command may connect to Supabase",
  "aggregate review gates do not run remote validation",
  "no Supabase write methods are present",
  "CP3 remains `not_ready`",
  "The CEO does not authorize implementation or execution in this slice",
  "Perform role review of this schema-shape validator design gate",
  "Do not implement the validator in the role-review slice",
  "No validator implementation is created in this slice",
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
  "REMOTE_SCHEMA_VALIDATION_APPROVED_NOW",
  "REMOTE_SCHEMA_VALIDATION_EXECUTED",
  "VALIDATOR_IMPLEMENTED_NOW",
  "CONNECTION_APPROVED_NOW"
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
