import { readFileSync } from "node:fs";

const target =
  "docs/reviews/CP3_SUPABASE_READ_ONLY_EXACT_DIRECT_NODE_RETRY_COMMAND_GATE_ROLE_REVIEW_2026-05-30.md";

const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Supabase Read-Only Exact Direct-Node Retry Command Gate Role Review",
  "CP3 Supabase read-only exact direct-node retry command gate role review recorded",
  "ACCEPT_EXACT_DIRECT_NODE_RETRY_COMMAND_GATE_FOR_EXECUTION_DECISION",
  "only as an execution-decision artifact",
  "does not approve execution",
  "does not execute the validator",
  "does not set confirmation",
  "does not connect to Supabase",
  "does not run SQL",
  "does not approve writes",
  "docs/reviews/CP3_SUPABASE_READ_ONLY_EXACT_DIRECT_NODE_RETRY_COMMAND_GATE_2026-05-30.md",
  "scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate.mjs",
  "scripts/check-cp3-supabase-read-only-validator-skeleton.mjs",
  "scripts/validate-supabase-readonly.mjs",
  "The command gate is acceptable for one execution decision",
  "Execution remains a separate decision",
  "No background retry loop",
  "The direct-node path is accepted as a command shape",
  "load only the three required environment variables",
  "use process-scoped confirmation",
  "avoid the npm wrapper",
  "Pre-execution gates must run immediately before any future execution",
  "Success, failure, malformed output, blocked output, and access-denied output",
  "can only test object reachability",
  "No environment values, key prefixes, key suffixes, key lengths, row payloads",
  "Public data source remains mock",
  "`scoreSource=real` remains blocked",
  "Proceed to a one-attempt execution decision gate",
  "Use the direct-node command shape only if the CEO later approves execution",
  "Limit any future approved retry to one execution",
  "Require immediate post-run review after any future attempt",
  "Keep CP3 readiness as `not_ready`",
  "Remote retry is not approved in this role review",
  "Confirmation-enabled validator run is not approved in this role review",
  "Supabase connection is not approved in this role review",
  "SQL, migration, insert, update, upsert, delete, RPC, storage, and write actions remain blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit remain blocked",
  "`.env.local` modification remains blocked",
  "Dependency install remains blocked",
  "Source-depth production gate remains blocked",
  "Public market-data claims remain blocked",
  "The exact direct-node command gate is accepted for execution-decision use",
  "This role review is not execution",
  "Draft the one-attempt direct-node execution decision gate",
  "Do not execute the retry in that decision-gate draft slice",
  "Review gates pass",
  "TypeScript check passes",
  "Remote retry remains blocked",
  "SQL and writes remain blocked",
  "CP3 remains `not_ready`"
];

const forbiddenPhrases = [
  "REMOTE_RETRY_APPROVED_NOW",
  "RUN_SUPABASE_NOW",
  "CONFIRMATION_ENABLED_RUN_APPROVED",
  "ALLOW_SQL_EXECUTION",
  "ALLOW_SUPABASE_WRITES",
  "ALLOW_INSERT_UPDATE_UPSERT_DELETE",
  "scoreSource=real approved",
  "source-depth production gate is ready",
  "public claims are approved",
  "market ingestion is approved",
  "schema changes are approved"
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
