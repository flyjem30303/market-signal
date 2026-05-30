import { readFileSync } from "node:fs";

const target =
  "docs/reviews/CP3_SUPABASE_READ_ONLY_ONE_ATTEMPT_DIRECT_NODE_EXECUTION_DECISION_GATE_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Read-Only One-Attempt Direct-Node Execution Decision Gate",
  "CP3 Supabase read-only one-attempt direct-node execution decision gate recorded",
  "AUTHORIZE_ONE_ATTEMPT_DIRECT_NODE_READ_ONLY_RETRY_AFTER_PRECHECKS",
  "one process-scoped direct-node read-only retry",
  "after immediate pre-execution checks pass",
  "does not execute the retry",
  "does not connect to Supabase",
  "does not run SQL",
  "does not modify `.env.local`",
  "does not write Supabase",
  "does not ingest market data",
  "does not promote readiness",
  "Chairman delegated oral review authority to the CEO",
  "accepted the command shape for execution-decision use",
  "one read-only object-reachability attempt",
  "may execute exactly one process-scoped direct-node read-only retry",
  "if and only if immediate pre-execution checks pass",
  "SUPABASE_READONLY_VALIDATE_CONFIRMATION",
  "CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
  "C:\\Program Files\\nodejs\\node.exe",
  "scripts\\validate-supabase-readonly.mjs",
  "scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate.mjs",
  "scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate-role-review.mjs",
  "scripts/check-cp3-supabase-read-only-one-attempt-direct-node-execution-decision-gate.mjs",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs",
  "If any pre-execution check fails, the retry remains blocked",
  "do not promote CP3 readiness immediately",
  "Create a post-run review document first",
  "keep CP3 as `not_ready` until reviewed",
  "More than one retry is blocked",
  "Background retry loop is blocked",
  "Aggregate review gate remote execution is blocked",
  "SQL execution is blocked",
  "Migration execution is blocked",
  "Insert, update, upsert, delete, RPC, and storage writes are blocked",
  "Supabase writes are blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit are blocked",
  "Public data source remains mock",
  "`scoreSource=real` remains blocked",
  "Source-depth production gate remains blocked",
  "Public market-data claims remain blocked",
  "CEO authorizes the next slice to attempt exactly one direct-node read-only validation run",
  "does not authorize SQL, writes, ingestion, public claims, or readiness promotion",
  "Execute no retry inside this decision-gate slice",
  "Execute at most one retry",
  "Do not commit secrets, row payloads, raw market data, or unreviewed validator output",
  "Remote retry is authorized only for the next execution slice, not this slice",
  "CP3 remains `not_ready` before post-run review"
];

const forbiddenPhrases = [
  "AUTHORIZE_MULTIPLE_RETRIES",
  "RUN_RETRY_IN_THIS_SLICE",
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
  "CP3 is ready",
  "readiness promoted"
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
