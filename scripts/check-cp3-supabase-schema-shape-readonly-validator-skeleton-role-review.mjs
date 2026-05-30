import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_READONLY_VALIDATOR_SKELETON_ROLE_REVIEW_2026-05-30.md";
const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Schema-Shape Readonly Validator Skeleton Role Review",
  "CP3 Supabase schema-shape readonly validator skeleton role review recorded",
  "ACCEPT_FAIL_CLOSED_SCHEMA_SHAPE_VALIDATOR_SKELETON_ONLY",
  "local fail-closed skeleton only",
  "does not authorize Supabase connection",
  "does not authorize remote schema-shape validation",
  "does not run SQL",
  "does not write Supabase",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not promote CP3 readiness",
  "does not approve public claims",
  "scripts/validate-supabase-schema-shape-readonly.mjs",
  "scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs",
  "scripts/check-review-gates.mjs",
  "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_VALIDATOR_DESIGN_GATE_2026-05-30.md",
  "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_VALIDATOR_DESIGN_GATE_ROLE_REVIEW_2026-05-30.md",
  "docs/reviews/CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30.md",
  "without touching Supabase",
  "future schema-shape execution packet",
  "aggregate review gate checks only the skeleton safety checker",
  "does not execute the validator itself",
  "does not import `@supabase/supabase-js`",
  "does not call `createClient`",
  "does not call `.from`, `.select`, `.insert`, `.update`, `.upsert`, `.delete`, `.rpc`, or storage APIs",
  "does not use `fetch`",
  "does not execute raw SQL",
  "does not write files",
  "always exits fail-closed with `status: \"blocked\"`",
  "mode: \"schema_shape_readonly_skeleton\"",
  "connection: \"not_run\"",
  "rowLimit: 0",
  "reachable: \"not_run\"",
  "shapeStatus: \"not_run\"",
  "`daily_prices`, `twse_stock_day_staging`, `market_assets`, `model_runs`, and `data_freshness`",
  "`filesWritten`, `mutations`, `sqlExecuted`, `rpcCalled`, `secretsPrinted`, `rowPayloadsPrinted`, `rawMarketDataPrinted`, `scoreSourceRealChanged`, `sourceDepthReadyChanged`, and `publicClaimsChanged`",
  "records `daily_prices` as `local-baselined`",
  "records `twse_stock_day_staging` as `needs-reconciliation`",
  "records `market_assets`, `model_runs`, and `data_freshness` as `remote-only-pending-contract`",
  "does not prove data quality, data freshness, row completeness, historical depth, source-depth readiness, or model credibility",
  "environment presence only as `present` or `missing`",
  "does not print key material, key prefixes, key suffixes, key lengths, row values, sample rows, SQL payloads, or unredacted secret-bearing errors",
  "blocks Supabase client imports, write methods, SQL phrases, `fetch`, and file writes",
  "No public claim is introduced",
  "No global coverage claim is introduced",
  "No production-readiness claim is introduced",
  "Public data source remains mock",
  "`scoreSource=real` remains blocked",
  "The skeleton may remain as `scripts/validate-supabase-schema-shape-readonly.mjs`",
  "The skeleton may be run locally only to confirm fail-closed redacted output",
  "The skeleton safety checker may be part of the aggregate review gate",
  "The aggregate review gate must not execute `scripts/validate-supabase-schema-shape-readonly.mjs`",
  "The skeleton must keep `status: \"blocked\"` until a later execution decision gate exists",
  "The skeleton must keep `connection: \"not_run\"` until a later execution decision gate exists",
  "The skeleton must keep all object shape checks as `not_run` until a later execution decision gate exists",
  "The skeleton must keep `rowLimit: 0`",
  "The skeleton must keep all safety flags false",
  "Supabase connection is blocked",
  "Remote schema-shape validation is blocked",
  "SQL execution is blocked",
  "Migration execution is blocked",
  "Supabase writes are blocked",
  "Insert, update, upsert, delete, RPC, and storage writes are blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit are blocked",
  "Staging writes are blocked",
  "`daily_prices` writes are blocked",
  "Seed SQL is blocked",
  "`.env.local` modification is blocked",
  "`scoreSource=real` is blocked",
  "Source-depth production readiness promotion is blocked",
  "CP3 readiness promotion is blocked",
  "Public claims are blocked",
  "The skeleton is acceptable",
  "not treat this as evidence of schema correctness",
  "future validator surface can be guarded",
  "schema-shape remote execution packet draft",
  "not an execution run",
  "Draft a schema-shape remote execution packet",
  "Include the exact command shape and confirmation variable",
  "Include expected sanitized output categories",
  "Include stop conditions for secrets, row payloads, SQL, writes, market data, and `scoreSource=real`",
  "Include a one-attempt maximum rule for any later reviewed execution",
  "Do not connect to Supabase in the packet draft slice",
  "Do not execute remote validation in the packet draft slice",
  "Keep CP3 as `not_ready`",
  "scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton-role-review.mjs` passes",
  "scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs` passes",
  "scripts/check-cp3-supabase-schema-shape-validator-design-gate-role-review.mjs` passes",
  "scripts/check-review-gates.mjs` passes",
  "TypeScript check passes",
  "No Supabase connection is made",
  "No remote validation is executed",
  "No SQL is executed",
  "No Supabase write occurs",
  "No market data is fetched or ingested",
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
  "REMOTE_SCHEMA_VALIDATION_APPROVED_NOW",
  "REMOTE_SCHEMA_VALIDATION_EXECUTED",
  "CONNECTION_APPROVED_NOW",
  "FULL_VALIDATOR_IMPLEMENTATION_APPROVED",
  "may connect to Supabase now",
  "may run remote validation now",
  "may run SQL now",
  "may write Supabase now"
];

const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => content.includes(phrase));

if (missing.length > 0 || forbidden.length > 0) {
  console.error(
    JSON.stringify(
      {
        forbidden,
        missing,
        status: "error",
        target
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
      forbiddenPhrases: forbiddenPhrases.length,
      requiredPhrases: requiredPhrases.length,
      status: "ok",
      target
    },
    null,
    2
  )
);
