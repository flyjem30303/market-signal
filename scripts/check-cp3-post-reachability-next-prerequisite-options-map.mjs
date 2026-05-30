import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_POST_REACHABILITY_NEXT_PREREQUISITE_OPTIONS_MAP_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Post-Reachability Next-Prerequisite Options Map",
  "CP3 post-reachability next-prerequisite options map recorded",
  "RECOMMEND_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_BEFORE_RUNTIME_WIRING",
  "Supabase object reachability is accepted as a narrow CP3 prerequisite",
  "does not run SQL",
  "does not write Supabase",
  "does not ingest market data",
  "does not set `scoreSource=real`",
  "does not promote CP3 readiness",
  "does not approve public claims",
  "Supabase object reachability: accepted",
  "CP3 remains `not_ready`",
  "Option A: Schema-Shape Read-Only Evidence",
  "without running SQL and without committing row payloads",
  "Confirms whether the reachable objects expose the minimum structure needed by the runtime path",
  "Reduces risk before wiring UI/runtime against Supabase-backed assumptions",
  "Draft schema-shape evidence requirements",
  "Define expected object/column presence at a document level",
  "Add static checker for the evidence plan",
  "Require a separate execution gate before any future remote schema-shape validation",
  "Running SQL is blocked",
  "Running migrations is blocked",
  "Writing Supabase is blocked",
  "Fetching, parsing, ingesting, or committing market data is blocked",
  "Setting `scoreSource=real` is blocked",
  "Promoting CP3 readiness is blocked",
  "highest decision quality",
  "best next prerequisite because runtime wiring depends on schema assumptions",
  "Option B: Mock-Only Runtime Wiring",
  "public data source mock",
  "`scoreSource=real` blocked",
  "UI wiring could encode assumptions that later schema-shape evidence rejects",
  "Option C: Data Freshness Read-Only Plan",
  "defer",
  "Option D: Additional Supabase Retry",
  "reject for now",
  "Additional remote retries remain blocked unless a new concrete need emerges",
  "Proceed with Option A: Schema-Shape Read-Only Evidence",
  "smallest useful step after object reachability",
  "runtime wiring would otherwise depend on",
  "without jumping into SQL, writes, ingestion, or real score-source promotion",
  "CP3_SUPABASE_SCHEMA_SHAPE_READ_ONLY_EVIDENCE_PLAN",
  "aggregate review-gate entry",
  "connect to Supabase",
  "modify `.env.local`",
  "commit row payloads",
  "Next recommended prerequisite: schema-shape read-only evidence plan",
  "SQL/write/ingestion/public claims: remain blocked",
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
  "REMOTE_VALIDATION_EXECUTED",
  "ADDITIONAL_RETRY_APPROVED",
  "mock-only runtime wiring is first priority",
  "schema shape can be skipped"
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
