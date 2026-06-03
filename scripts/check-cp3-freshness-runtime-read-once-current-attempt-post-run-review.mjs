import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_ONCE_CURRENT_ATTEMPT_POST_RUN_REVIEW_2026-06-03.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Date: 2026-06-03",
  "Status: `CP3 freshness runtime read-once current attempt post-run review recorded`",
  "Decision: `ACCEPT_CURRENT_FRESHNESS_READ_ONLY_RUNTIME_EVIDENCE_WITHOUT_PUBLIC_SOURCE_PROMOTION`",
  "did not run SQL",
  "did not write Supabase",
  "did not create staging rows",
  "did not write `daily_prices`",
  "did not fetch or ingest market data",
  "did not commit raw market data",
  "did not print secrets",
  "did not print row payloads",
  "did not modify `.env.local`",
  "did not change the public data source away from mock",
  "did not set `scoreSource=real`",
  "did not approve public claims",
  "did not promote CP3 readiness",
  "PRE-RUN-001 `scripts/check-freshness-runtime-prerun-bundle.mjs` passed.",
  "PRE-RUN-002 `scripts/check-review-gates.mjs` passed before execution.",
  "PRE-RUN-003 `NEXT_PUBLIC_DATA_SOURCE` remained `mock`.",
  "PRE-RUN-004 process-only confirmation was used.",
  "$env:DATA_FRESHNESS_SOURCE=\"supabase\"; $env:DATA_FRESHNESS_SUPABASE_READS=\"enabled\"; $env:NEXT_PUBLIC_DATA_SOURCE=\"mock\"; $env:FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION=\"CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-freshness-runtime-read-once.mjs",
  "Execution count: `1`",
  "Exit code: `0`",
  "\"asOfDate\": \"2026-05-27\"",
  "\"isMock\": false",
  "\"market\": \"TWSE\"",
  "\"remoteAttempted\": true",
  "\"scoreSource\": \"mock\"",
  "\"sourceName\": \"TWSE OpenAPI\"",
  "\"state\": \"complete\"",
  "\"status\": \"ok\"",
  "Allowed output fields only: `status`, `remoteAttempted`, `state`, `sourceName`, `isMock`, `scoreSource`, `market`, `asOfDate`.",
  "No Supabase URL, service role key, anon key, key prefix, key suffix, key length, row payloads, SQL text, or raw market data were recorded.",
  "Outcome category: `freshness_metadata_reachable`.",
  "This proves freshness metadata reachability only.",
  "It does not prove market-data correctness, ingestion completeness, source-depth sufficiency, model credibility, public-claim readiness, or `scoreSource=real` readiness.",
  "STOP-001 no retry was executed.",
  "STOP-002 no alternate Supabase validator was executed in the same slice.",
  "STOP-003 no SQL or write command was used for investigation.",
  "STOP-004 no ingestion, market-data fetch, parse, or staging action was executed.",
  "STOP-005 no `.env.local` mutation was performed.",
  "STOP-006 public-facing data source remains mock.",
  "STOP-007 `scoreSource=real` remains blocked.",
  "STOP-008 CP3 readiness remains unpromoted.",
  "Accepted as current successful read-only freshness runtime evidence.",
  "NEXT-SLICE-005 do not write Supabase, ingest market data, or run SQL."
];

const forbiddenPhrases = [
  "Execution count: `2`",
  "retry was actually executed",
  "alternate Supabase validator actually executed",
  "SQL was executed",
  "Supabase write enabled",
  "staging rows created",
  "daily_prices written",
  "market data ingested",
  "raw market data committed",
  "service role key:",
  "anon key:",
  "NEXT_PUBLIC_SUPABASE_URL=",
  "scoreSource=real approved",
  "NEXT_PUBLIC_DATA_SOURCE=supabase",
  "CP3_READY_NOW",
  "public claims are approved"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));
const status = missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked";

console.log(JSON.stringify({ forbidden, missing, status }, null, 2));

if (status !== "ok") {
  process.exit(1);
}
