import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_DRY_RUN_COMMAND_MAP_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const riskyArgs = process.argv.slice(2).filter((arg) =>
  ["execute", "connect", "supabase", "sql", "fetch", "parse", "write", "scoreSource=real"].some((token) =>
    arg.toLowerCase().includes(token.toLowerCase())
  )
);

const envProblems = [
  process.env.DATA_FRESHNESS_SOURCE === "supabase" ? "DATA_FRESHNESS_SOURCE=supabase is refused" : null,
  process.env.DATA_FRESHNESS_SUPABASE_READS === "enabled"
    ? "DATA_FRESHNESS_SUPABASE_READS=enabled is refused"
    : null,
  process.env.NEXT_PUBLIC_DATA_SOURCE && process.env.NEXT_PUBLIC_DATA_SOURCE !== "mock"
    ? "NEXT_PUBLIC_DATA_SOURCE must remain mock when present"
    : null
].filter(Boolean);

const requiredPhrases = [
  "Status: CP3 freshness runtime-read dry-run command map recorded",
  "COMMAND_MAP_ONLY_DO_NOT_EXECUTE_FRESHNESS_RUNTIME_READ",
  "does not execute the checkpoint",
  "does not run the\ntemporary process",
  "does not request `/briefing`",
  "does not request\n`/stocks/2330`",
  "does not enable `DATA_FRESHNESS_SUPABASE_READS`",
  "does not set\n`DATA_FRESHNESS_SOURCE` to `supabase`",
  "does not modify `.env.local`",
  "does not\nconnect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does not fetch\nmarket data",
  "does not parse market rows",
  "does not print secrets",
  "does not record\nreal output",
  "does not approve `scoreSource=real`",
  "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_LOCAL_PREFLIGHT_RUNNER_2026-05-30.md",
  "SEQUENCE-001 run local preflight runner first",
  "SEQUENCE-004 start one temporary Next process with process env only",
  "SEQUENCE-005 set NEXT_PUBLIC_DATA_SOURCE=mock in the temporary process",
  "SEQUENCE-006 set DATA_FRESHNESS_SOURCE=supabase in the temporary process only",
  "SEQUENCE-007 set DATA_FRESHNESS_SUPABASE_READS=enabled in the temporary process only",
  "SEQUENCE-008 request /briefing exactly once",
  "SEQUENCE-009 request /stocks/2330 exactly once",
  "SEQUENCE-010 capture sanitized categories only",
  "SEQUENCE-011 stop the temporary process immediately",
  "SEQUENCE-012 confirm rollback to DATA_FRESHNESS_SOURCE=mock",
  "SEQUENCE-013 confirm rollback to DATA_FRESHNESS_SUPABASE_READS=disabled",
  "DESCRIPTIVE-COMMAND-001 node scripts/check-freshness-runtime-read-local-preflight-runner.mjs",
  "DESCRIPTIVE-COMMAND-010 write post-run review from template",
  "These command descriptions are not authorization to run them in this slice.",
  "OBSERVE-001 process_started yes no",
  "OBSERVE-003 rollback_completed yes no",
  "OBSERVE-004 briefing_http_status category only",
  "OBSERVE-006 stock_http_status category only",
  "OBSERVE-010 secret_output_seen yes no",
  "OBSERVE-011 row_payload_output_seen yes no",
  "OBSERVE-012 verdict one option only",
  "STOP-001 local preflight runner fails",
  "STOP-004 .env.local would need to be modified",
  "STOP-006 command would run SQL",
  "STOP-007 command would write Supabase",
  "STOP-009 command would fetch or parse market rows",
  "STOP-013 scoreSource=real would be set or claimed",
  "STOP-016 rollback cannot be confirmed",
  "STOP-017 temporary process cannot be stopped",
  "BLOCKED-001 this command map is not execution",
  "BLOCKED-002 temporary process is not started in this slice",
  "BLOCKED-003 /briefing is not requested by this slice",
  "BLOCKED-004 /stocks/2330 is not requested by this slice",
  "BLOCKED-005 DATA_FRESHNESS_SUPABASE_READS remains disabled",
  "BLOCKED-006 DATA_FRESHNESS_SOURCE remains mock",
  "BLOCKED-008 Supabase connection remains blocked",
  "BLOCKED-009 SQL execution remains blocked",
  "BLOCKED-017 scoreSource=real remains blocked",
  "BLOCKED-018 CP3 source-depth production gate remains not_ready",
  "CEO accepts this as a dry-run command map only.",
  "OPTION-A unexecuted until CEO explicitly opens a separate runtime-read\ncheckpoint.",
  "NEXT-SLICE-001 role-review this dry-run command map before any execution packet change",
  "scripts/check-freshness-runtime-read-dry-run-command-map.mjs passes",
  "Supabase remote execution is not performed in this command-map slice",
  "DATA_FRESHNESS_SUPABASE_READS remains disabled",
  "scoreSource=real remains blocked"
];

const forbiddenPhrases = [
  "EXECUTE_FRESHNESS_RUNTIME_READ_NOW",
  "REMOTE_EXECUTION_PERFORMED",
  "TEMPORARY_PROCESS_STARTED",
  "BRIEFING_REQUEST_PERFORMED",
  "STOCK_REQUEST_PERFORMED",
  "DATA_FRESHNESS_SUPABASE_READS is enabled in this slice",
  "DATA_FRESHNESS_SOURCE is supabase in this slice",
  "Supabase connection is approved",
  "SQL execution is approved",
  "Supabase writes are approved",
  "market-data fetch is approved",
  "market-row parsing is approved",
  "real output is recorded",
  "secrets are printed",
  "scoreSource=real approved",
  "CP3 source-depth production gate is ready",
  "public claims are approved"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));
const status =
  missing.length === 0 && forbidden.length === 0 && riskyArgs.length === 0 && envProblems.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      boundaries: {
        command_map_only: true,
        data_freshness_source: "mock",
        data_freshness_supabase_reads: "disabled",
        public_data_source: "mock",
        score_source: "mock",
        supabase_remote_execution: "not_performed"
      },
      envProblems,
      forbidden,
      missing,
      riskyArgs,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exitCode = 1;
}
