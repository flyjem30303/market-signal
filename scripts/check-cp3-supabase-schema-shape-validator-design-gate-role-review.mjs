import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_VALIDATOR_DESIGN_GATE_ROLE_REVIEW_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Schema-Shape Validator Design Gate Role Review",
  "CP3 Supabase schema-shape validator design gate role review recorded",
  "ACCEPT_DESIGN_AND_ALLOW_FAIL_CLOSED_SCHEMA_SHAPE_VALIDATOR_SKELETON",
  "allows the next slice to create a local fail-closed skeleton only",
  "does not authorize implementation that connects to Supabase",
  "does not authorize remote schema-shape validation",
  "does not run SQL",
  "does not write Supabase",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not promote CP3 readiness",
  "does not approve public claims",
  "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_VALIDATOR_DESIGN_GATE_2026-05-30.md",
  "docs/reviews/CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30.md",
  "The design gate is accepted",
  "The next slice may create a fail-closed skeleton",
  "Execution remains a separate future decision",
  "bounded implementation slice",
  "output shape, confirmation guard, and object-specific rules",
  "must not import or instantiate a Supabase client for remote use",
  "must not be wired into aggregate gates as an executing remote validator",
  "local tests/checkers proving fail-closed behavior",
  "missing confirmation behavior",
  "no SQL path",
  "no write methods",
  "no row payload output",
  "not data quality, not freshness, not completeness, not historical depth",
  "blocks key material, key prefixes, key suffixes, key lengths, row values, sample rows",
  "No public claim, global coverage claim, source-depth production language",
  "Next slice may create `scripts/validate-supabase-schema-shape-readonly.mjs` as a fail-closed skeleton only",
  "Skeleton must not connect to Supabase",
  "Skeleton must not run remote validation",
  "Skeleton must not execute SQL",
  "Skeleton must not call `insert`, `update`, `upsert`, `delete`, `rpc`, or storage writes",
  "Skeleton must not print row payloads",
  "Aggregate review gates may check skeleton safety but must not execute remote validation",
  "exit with fail-closed JSON unless explicitly authorized in a later execution gate",
  "report `status: \"blocked\"` when confirmation is absent",
  "report `mode: \"schema_shape_readonly_skeleton\"`",
  "report `filesWritten: false`",
  "report `mutations: false`",
  "report `sqlExecuted: false`",
  "report `rpcCalled: false`",
  "report `secretsPrinted: false`",
  "report `rowPayloadsPrinted: false`",
  "report `rawMarketDataPrinted: false`",
  "report `scoreSourceRealChanged: false`",
  "report `sourceDepthReadyChanged: false`",
  "report `publicClaimsChanged: false`",
  "`daily_prices`, `twse_stock_day_staging`, `market_assets`, `model_runs`, and `data_freshness`",
  "Remote schema-shape validation is blocked",
  "Supabase connection is blocked",
  "SQL execution is blocked",
  "Migration execution is blocked",
  "Supabase writes are blocked",
  "Insert, update, upsert, delete, RPC, and storage writes are blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit are blocked",
  "Validator execution approval remains blocked until a later execution decision gate",
  "authorizes only a local fail-closed skeleton as the next slice",
  "without touching Supabase",
  "Create the fail-closed schema-shape validator skeleton",
  "Add a skeleton safety checker",
  "skeleton safety only",
  "Do not connect to Supabase",
  "Do not execute remote validation",
  "Keep CP3 as `not_ready`",
  "Review gates pass",
  "TypeScript check passes",
  "No validator remote execution is created in this slice",
  "No remote validation is executed in this slice",
  "Public data source remains mock",
  "`scoreSource=real` remains blocked"
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
  "FULL_VALIDATOR_IMPLEMENTATION_APPROVED"
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
