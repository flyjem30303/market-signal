import { readFileSync } from "node:fs";

const target = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_ONCE_LATEST_SANITIZED_RUN_2026-05-31.md";
const content = readFileSync(target, "utf8");

const requiredPhrases = [
  "CP3 Freshness Runtime Read-Once Latest Sanitized Run",
  "Date: 2026-05-31",
  "CP3 freshness runtime read-once latest sanitized run recorded",
  "ACCEPT_FRESHNESS_READ_ONLY_RUNTIME_EVIDENCE_WITHOUT_PUBLIC_SOURCE_PROMOTION",
  "one process-scoped freshness runtime read-only attempt",
  "data_runs",
  "does not run SQL",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not fetch or ingest market data",
  "does not commit raw market data",
  "does not print secrets",
  "does not print row payloads",
  "does not modify `.env.local`",
  "does not change the public data source away from mock",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "Execution count: one guarded freshness read-only attempt",
  "Exit code: `0`",
  "Runner status: `ok`",
  "Remote attempted: `true`",
  "Freshness state: `complete`",
  "Freshness as-of date: `2026-05-27`",
  "Market: `TWSE`",
  "Source name: `TWSE OpenAPI`",
  "Snapshot is mock: `false`",
  "Score source: `mock`",
  "No Supabase URL, anon key, service role key, key prefix, key suffix, key length, row payload, SQL text, or raw market data is recorded",
  "freshness runtime read evidence only",
  "not evidence of market-data completeness",
  "row quality",
  "model credibility",
  "source rights",
  "public claim readiness",
  "`scoreSource=real` readiness",
  "Public data source remains mock",
  "`data_runs` remains the current runtime baseline",
  "`data_freshness` remains a remote-only candidate",
  "`scoreSource=real` remains blocked",
  "CP3 readiness remains `not_ready`",
  "Source-depth production gate remains blocked",
  "SQL execution remains blocked",
  "Migration execution remains blocked",
  "Supabase writes remain blocked",
  "Insert, update, upsert, delete, RPC, and storage writes remain blocked",
  "Market-data fetch, parse, ingestion, and raw market-data commit remain blocked",
  "Public market-data claims remain blocked",
  "Additional remote attempts require a new explicit gate",
  "Freshness read-only runtime evidence is now successful",
  "existing `data_runs` boundary",
  "public data source mock and score source mock",
  "Add a local progress/runtime status field for freshness read-only evidence",
  "Keep `data_freshness` as an unmapped remote-only candidate",
  "Latest freshness read-once sanitized run checker passes",
  "Freshness guarded runner checker passes",
  "Data freshness source behavior checker passes",
  "Review gates pass",
  "TypeScript check passes"
];

const forbiddenPhrases = [
  "CP3_READY_NOW",
  "PROMOTE_CP3_READINESS_NOW",
  "scoreSource=real approved",
  "PUBLIC_DATA_SOURCE_REAL",
  "ALLOW_SQL_EXECUTION",
  "ALLOW_MIGRATION_EXECUTION",
  "ALLOW_SUPABASE_WRITES",
  "ALLOW_INSERT_UPDATE_UPSERT_DELETE",
  "ALLOW_MARKET_INGESTION",
  "ALLOW_RAW_MARKET_DATA_COMMIT",
  "PUBLIC_CLAIMS_APPROVED",
  "SOURCE_DEPTH_PRODUCTION_READY",
  "SECOND_REMOTE_ATTEMPT_APPROVED",
  "KEY_PREFIX_RECORDED",
  "KEY_SUFFIX_RECORDED",
  "raw output committed",
  "data_freshness replaces data_runs now"
];

const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => content.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked",
      target
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
