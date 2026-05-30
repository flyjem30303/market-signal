import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_REVISED_RUNNER_SECOND_ONE_ATTEMPT_EXECUTION_DECISION_GATE_2026-05-30.md";
const credentialRevisionPath = "docs/reviews/CP3_FRESHNESS_CREDENTIAL_LOADING_COMMAND_REVISION_2026-05-30.md";
const runnerPath = "scripts/run-freshness-runtime-read-once.mjs";

const report = fs.readFileSync(reportPath, "utf8");
const credentialRevision = fs.readFileSync(credentialRevisionPath, "utf8");
const runner = fs.readFileSync(runnerPath, "utf8");

const requiredReportPhrases = [
  "Status: `CP3 freshness revised runner second one-attempt execution decision gate recorded`",
  "Decision: `AUTHORIZE_NEXT_SLICE_SECOND_ONE_ATTEMPT_READONLY_EXECUTION_IF_IMMEDIATE_PRECHECKS_PASS`",
  "Trigger: `CP3 freshness credential loading command revision recorded`",
  "does not execute the runner",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not fetch or ingest market data",
  "does not commit raw market data",
  "does not print secrets",
  "does not modify `.env.local`",
  "does not change the public data source away from mock",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "Current gate status: `ready_for_next_slice_second_one_attempt_execution_decision`.",
  "This decision gate is not execution.",
  "$env:DATA_FRESHNESS_SOURCE=\"supabase\"; $env:DATA_FRESHNESS_SUPABASE_READS=\"enabled\"; $env:NEXT_PUBLIC_DATA_SOURCE=\"mock\"; $env:FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION=\"CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT\"; & 'C:\\Program Files\\nodejs\\node.exe' scripts\\run-freshness-runtime-read-once.mjs",
  "only to load `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into the current process",
  "Any command drift or runner safety drift stops execution.",
  "PRE-RUN-001 `scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs` must pass.",
  "PRE-RUN-003 `scripts/check-cp3-freshness-runtime-read-once-guarded-runner.mjs` must pass.",
  "PRE-RUN-005 `scripts/check-cp3-freshness-credential-loading-command-revision.mjs` must pass.",
  "PRE-RUN-006 `scripts/check-review-gates.mjs` must pass.",
  "PRE-RUN-007 TypeScript noEmit must pass.",
  "PRE-RUN-008 Next build must pass or the execution slice must explicitly justify why build is skipped.",
  "PRE-RUN-009 `NEXT_PUBLIC_DATA_SOURCE` must remain `mock`.",
  "PRE-RUN-010 `.env.local` must remain unchanged.",
  "LIMIT-001 run the revised guarded runner at most once in the execution slice.",
  "LIMIT-002 do not retry if the run fails.",
  "LIMIT-003 do not run alternate Supabase validators in the same slice.",
  "OUTPUT-003 do not print Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data.",
  "SUCCESS-003 keep `NEXT_PUBLIC_DATA_SOURCE=mock`.",
  "SUCCESS-004 keep `scoreSource=real` blocked.",
  "SUCCESS-005 do not promote CP3 readiness.",
  "FAILURE-003 do not retry.",
  "Accepted as the execution decision gate for the revised runner.",
  "The next slice may execute the guarded runner exactly once if all immediate pre-run checks pass.",
  "NEXT-SLICE-002 if checks pass, execute `scripts/run-freshness-runtime-read-once.mjs` exactly once with the approved process-only runtime gate environment.",
  "NEXT-SLICE-003 create same-slice second-attempt post-run review from sanitized output.",
  "NEXT-SLICE-004 do not promote CP3 readiness, public claims, public data source, or `scoreSource=real`."
];

const requiredEvidencePhrases = [
  {
    content: credentialRevision,
    file: credentialRevisionPath,
    phrase: "A second remote attempt remains blocked until a new one-attempt execution decision gate is recorded after local checks pass."
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "const DOTENV_LOCAL_ALLOWED_KEYS = [\"NEXT_PUBLIC_SUPABASE_URL\", \"SUPABASE_SERVICE_ROLE_KEY\"]"
  },
  {
    content: runner,
    file: runnerPath,
    phrase: "process.env.FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION !== REQUIRED_CONFIRMATION"
  }
];

const forbiddenReportPhrases = [
  "EXECUTED_THIS_SLICE",
  "second remote attempt executed",
  "runtime read completed",
  "Supabase connection performed",
  "SQL execution is approved",
  "Supabase writes are approved",
  "market ingestion is approved",
  "raw row payload captured",
  "NEXT_PUBLIC_DATA_SOURCE=supabase approved",
  "scoreSource=real approved",
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
