import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_SUPABASE_SCHEMA_SHAPE_ONE_ATTEMPT_EXECUTION_DECISION_GATE_2026-05-30.md";
const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Schema-Shape One-Attempt Execution Decision Gate",
  "CP3 Supabase schema-shape one-attempt execution decision gate recorded",
  "AUTHORIZE_SCHEMA_SHAPE_ONE_ATTEMPT_PATH_AFTER_REMOTE_CAPABLE_IMPLEMENTATION_GATE",
  "preparation of a future one-attempt schema-shape read-only validation path",
  "separately approved remote-capable implementation gate",
  "does not execute the validator",
  "does not connect to Supabase",
  "does not inspect remote field names",
  "does not read remote rows",
  "does not set the confirmation variable",
  "does not run `scripts/validate-supabase-schema-shape-readonly.mjs`",
  "does not run SQL",
  "does not modify `.env.local`",
  "does not write Supabase",
  "does not ingest market data",
  "does not commit row payloads",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "Chairman delegated oral review authority to the CEO",
  "narrow schema-shape read-only validation path",
  "schema-shape remote execution packet draft role review accepted the packet",
  "current validator remains a fail-closed skeleton and has no Supabase client",
  "aggregate review gate checks safety artifacts only and does not execute the validator",
  "Object reachability evidence was previously accepted only as a narrow prerequisite",
  "`twse_stock_day_staging` as `needs-reconciliation`",
  "`market_assets`, `model_runs`, and `data_freshness` remain `remote-only-pending-contract`",
  "one attempt maximum",
  "process-scoped environment only",
  "no `.env.local` modification",
  "no aggregate review gate execution of the remote validator",
  "no row payload output",
  "no raw market data output",
  "no SQL execution",
  "no Supabase writes",
  "no market-data fetch or ingestion",
  "no `scoreSource=real`",
  "no CP3 readiness promotion before post-run role review",
  "This decision gate does not authorize the actual remote validation run",
  "scripts\\validate-supabase-schema-shape-readonly.mjs",
  "SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION",
  "CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE",
  "not executed in this slice",
  "schema-shape remote execution packet draft checker",
  "schema-shape remote execution packet draft role review checker",
  "schema-shape validator skeleton checker",
  "schema-shape validator skeleton role review checker",
  "separate remote-capable implementation gate checker",
  "separate remote-capable implementation role review checker",
  "immediate pre-execution check in the same execution slice",
  "If any required check fails, the future execution remains blocked",
  "do not promote CP3 readiness immediately",
  "Create a post-run review document first",
  "keep CP3 as `not_ready`",
  "Immediate execution is blocked",
  "Supabase connection is blocked",
  "Remote schema-shape validation is blocked",
  "Remote field-name inspection is blocked",
  "Remote row reads are blocked",
  "More than one attempt is blocked",
  "Background retry loops are blocked",
  "Aggregate review gate remote execution is blocked",
  "SQL execution is blocked",
  "Migration execution is blocked",
  "Insert, update, upsert, delete, RPC, and storage writes are blocked",
  "Supabase writes are blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit are blocked",
  "Public data source remains mock",
  "`scoreSource=real` remains blocked",
  "Source-depth production gate remains blocked",
  "CP3 remains `not_ready`",
  "CEO authorizes the PM and Engineering roles to prepare the next remote-capable implementation gate",
  "CEO does not authorize execution in this slice",
  "does not authorize adding Supabase writes, SQL, ingestion, public claims, or readiness promotion",
  "one-attempt, read-only, sanitized, post-reviewed, and reversible",
  "Execute no remote validation inside this decision-gate slice",
  "Do not add a Supabase client in this decision-gate slice",
  "Do not set `SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION` in this decision-gate slice",
  "Draft the remote-capable implementation gate next",
  "Keep `scripts/check-review-gates.mjs` from executing the validator",
  "Do not commit secrets, row payloads, raw market data, or unreviewed validator output",
  "scripts/check-cp3-supabase-schema-shape-one-attempt-execution-decision-gate.mjs` passes",
  "scripts/check-cp3-supabase-schema-shape-remote-execution-packet-draft-role-review.mjs` passes",
  "scripts/check-cp3-supabase-schema-shape-remote-execution-packet-draft.mjs` passes",
  "scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs` passes",
  "Review gates pass",
  "TypeScript check passes",
  "No Supabase connection is made",
  "No remote validation is executed",
  "No SQL is executed",
  "No Supabase write occurs",
  "CP3 remains `not_ready` before post-run review"
];

const forbiddenPhrases = [
  "AUTHORIZE_MULTIPLE_ATTEMPTS",
  "RUN_VALIDATOR_IN_THIS_SLICE",
  "REMOTE_SCHEMA_VALIDATION_EXECUTED",
  "REMOTE_SCHEMA_VALIDATION_APPROVED_NOW",
  "CONNECTION_APPROVED_NOW",
  "ALLOW_SQL_EXECUTION",
  "ALLOW_MIGRATION_EXECUTION",
  "ALLOW_SUPABASE_WRITES",
  "ALLOW_INSERT_UPDATE_UPSERT_DELETE",
  "ALLOW_MARKET_INGESTION",
  "ALLOW_RAW_MARKET_DATA_COMMIT",
  "MODIFY_ENV_LOCAL_APPROVED",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "CP3_READY_NOW",
  "readiness promoted"
];

const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => content.includes(phrase));

if (missing.length > 0 || forbidden.length > 0) {
  console.error(JSON.stringify({ forbidden, missing, status: "error", target }, null, 2));
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
