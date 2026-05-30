import fs from "node:fs";

const commandMapPath = "docs/reviews/CP3_FRESHNESS_EXACT_ONE_ATTEMPT_READONLY_ACTIVATION_COMMAND_MAP_2026-05-30.md";
const readinessPacketPath = "docs/reviews/CP3_FRESHNESS_READ_ONLY_RUNTIME_ACTIVATION_READINESS_PACKET_2026-05-30.md";
const commandMap = fs.readFileSync(commandMapPath, "utf8");
const readinessPacket = fs.readFileSync(readinessPacketPath, "utf8");

const requiredPhrases = [
  "Status: `CP3 freshness exact one-attempt read-only activation command map recorded`",
  "Decision: `DRAFT_EXACT_ONE_ATTEMPT_READONLY_ACTIVATION_COMMAND_WITHOUT_EXECUTION`",
  "Trigger: `CP3 freshness read-only runtime activation readiness packet recorded`",
  "does not execute the command",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not fetch or ingest market data",
  "does not commit raw market data",
  "does not print secrets",
  "does not modify `.env.local`",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "Command status: `drafted_not_approved_for_execution`",
  "Command target: `scripts/run-freshness-runtime-read-once.mjs`",
  "DATA_FRESHNESS_SOURCE=supabase",
  "DATA_FRESHNESS_SUPABASE_READS=enabled",
  "NEXT_PUBLIC_DATA_SOURCE=mock",
  "FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION=CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT",
  "This command is not executed in this slice.",
  "The command target is not implemented in this slice.",
  "PRE-RUN-001 `scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs` must pass immediately before the attempt",
  "PRE-RUN-002 `scripts/check-cp3-freshness-readonly-runtime-activation-readiness-packet.mjs` must pass immediately before the attempt",
  "PRE-RUN-003 `scripts/check-review-gates.mjs` must pass immediately before the attempt",
  "PRE-RUN-004 the guarded runner target must exist and must fail closed without `FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION`",
  "PRE-RUN-005 the guarded runner must not contain SQL strings",
  "PRE-RUN-006 the guarded runner must not call write, insert, update, delete, upsert, rpc, or storage APIs",
  "PRE-RUN-007 the guarded runner must redact secrets and row payloads",
  "PRE-RUN-008 CEO must restate the exact command and one-attempt limit in the execution slice",
  "OUTPUT-003 output must not include Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data",
  "ROLLBACK-001 command uses process-only env and must not modify `.env.local`",
  "ROLLBACK-002 after the process exits, expected baseline is `DATA_FRESHNESS_SOURCE=mock`",
  "ROLLBACK-003 after the process exits, expected baseline is `DATA_FRESHNESS_SUPABASE_READS=disabled`",
  "STOP-003 any command includes SQL",
  "STOP-004 any command includes writes, ingestion, or market-data fetch",
  "STOP-007 any command prints secrets, row payloads, or raw market data",
  "Accepted as a draft command map only.",
  "NEXT-SLICE-001 implement `scripts/run-freshness-runtime-read-once.mjs` as a fail-closed guarded runner",
  "NEXT-SLICE-004 do not execute the guarded runner in the implementation slice"
];

const requiredEvidencePhrases = [
  {
    content: readinessPacket,
    file: readinessPacketPath,
    phrase: "NEXT-SLICE-002 after the checker passes, CEO may prepare an exact one-attempt read-only activation command map."
  }
];

const forbiddenPhrases = [
  "EXECUTE_NOW",
  "executed successfully",
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
  ...requiredPhrases.filter((phrase) => !commandMap.includes(phrase)).map((phrase) => `${commandMapPath}: ${phrase}`),
  ...requiredEvidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = forbiddenPhrases.filter((phrase) => commandMap.includes(phrase));
const status = missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exit(1);
}
