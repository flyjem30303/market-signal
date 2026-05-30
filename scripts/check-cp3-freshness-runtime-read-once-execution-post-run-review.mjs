import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_ONCE_EXECUTION_POST_RUN_REVIEW_2026-05-30.md";
const decisionGatePath = "docs/reviews/CP3_FRESHNESS_FINAL_ONE_ATTEMPT_RUNTIME_EXECUTION_DECISION_GATE_2026-05-30.md";

const report = fs.readFileSync(reportPath, "utf8");
const decisionGate = fs.readFileSync(decisionGatePath, "utf8");

const requiredReportPhrases = [
  "Status: `CP3 freshness runtime read once execution post-run review recorded`",
  "Decision: `STOP_AFTER_ONE_ATTEMPT_WITH_SANITIZED_FAILURE`",
  "Trigger: `CP3 freshness final one-attempt runtime execution decision gate recorded`",
  "did not run SQL",
  "did not write Supabase",
  "did not create staging rows",
  "did not write `daily_prices`",
  "did not fetch or ingest market data",
  "did not commit raw market data",
  "did not print secrets",
  "did not modify `.env.local`",
  "did not change the public data source away from mock",
  "did not set `scoreSource=real`",
  "did not approve public claims",
  "did not promote CP3 readiness",
  "PRE-RUN-001 `scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs` passed.",
  "PRE-RUN-004 `scripts/check-cp3-freshness-runtime-read-once-guarded-runner.mjs` passed.",
  "PRE-RUN-005 `scripts/check-review-gates.mjs` passed before execution.",
  "PRE-RUN-006 TypeScript noEmit passed before execution.",
  "PRE-RUN-007 Next build passed before execution.",
  "PRE-RUN-008 `NEXT_PUBLIC_DATA_SOURCE` remained `mock`.",
  "PRE-RUN-009 `.env.local` remained unchanged.",
  "$env:DATA_FRESHNESS_SOURCE=\"supabase\"; $env:DATA_FRESHNESS_SUPABASE_READS=\"enabled\"; $env:NEXT_PUBLIC_DATA_SOURCE=\"mock\"; $env:FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION=\"CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-freshness-runtime-read-once.mjs",
  "Execution count: `1`",
  "Exit code: `1`",
  "\"errorCategory\": \"missing_supabase_credentials\"",
  "\"remoteAttempted\": true",
  "\"status\": \"failed\"",
  "Allowed output fields only: `status`, `remoteAttempted`, `errorCategory`.",
  "No Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data were recorded.",
  "Outcome category: `missing_supabase_credentials`.",
  "not evidence of data quality, schema compatibility, market-data validity, or model credibility",
  "STOP-001 no retry was executed.",
  "STOP-002 no alternate Supabase validator was executed in the same slice.",
  "STOP-003 no SQL or write command was used for investigation.",
  "STOP-004 no ingestion, market-data fetch, or staging action was executed.",
  "STOP-005 no `.env.local` mutation was performed.",
  "STOP-006 public-facing data source remains mock.",
  "STOP-007 `scoreSource=real` remains blocked.",
  "STOP-008 CP3 readiness remains unpromoted.",
  "The next slice should not retry the remote read immediately.",
  "NEXT-SLICE-001 revise the freshness runtime read command map so Supabase credentials are provided through process-only environment loading without printing secrets.",
  "NEXT-SLICE-004 record a new one-attempt decision gate before any second remote attempt."
];

const requiredEvidencePhrases = [
  {
    content: decisionGate,
    file: decisionGatePath,
    phrase: "LIMIT-002 do not retry if the run fails."
  },
  {
    content: decisionGate,
    file: decisionGatePath,
    phrase: "NEXT-SLICE-003 create same-slice post-run review from sanitized output."
  }
];

const forbiddenReportPhrases = [
  "Execution count: `2`",
  "retry was actually executed",
  "alternate Supabase validator actually executed",
  "SQL was executed",
  "Supabase write",
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

const missing = [
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase)).map((phrase) => `${reportPath}: ${phrase}`),
  ...requiredEvidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = forbiddenReportPhrases.filter((phrase) => report.includes(phrase));
const status = missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked";

console.log(JSON.stringify({ forbidden, missing, status }, null, 2));

if (status !== "ok") {
  process.exit(1);
}
