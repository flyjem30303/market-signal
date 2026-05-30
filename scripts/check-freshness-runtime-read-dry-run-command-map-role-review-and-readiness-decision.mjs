import fs from "node:fs";

const reportPath =
  "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_DRY_RUN_COMMAND_MAP_ROLE_REVIEW_AND_READINESS_DECISION_2026-05-30.md";
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
  "Status: CP3 freshness runtime-read dry-run command map role review and readiness decision recorded",
  "ACCEPT_DRY_RUN_COMMAND_MAP_AND_PREPARE_BOUNDED_RUNTIME_READ_DECISION",
  "does not execute the runtime\nread",
  "does not start a temporary process",
  "does not request `/briefing`",
  "does not\nrequest `/stocks/2330`",
  "does not enable `DATA_FRESHNESS_SUPABASE_READS`",
  "does\nnot set `DATA_FRESHNESS_SOURCE` to `supabase`",
  "does not modify `.env.local`",
  "does not connect to Supabase",
  "does not run SQL",
  "does not write Supabase",
  "does\nnot fetch market data",
  "does not parse market rows",
  "does not print secrets",
  "does\nnot record real output",
  "does not approve public claims",
  "does not promote CP3\nsource-depth readiness",
  "does not approve `scoreSource=real`",
  "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_DRY_RUN_COMMAND_MAP_2026-05-30.md",
  "CEO-FINDING-005 project velocity should now move from repeated preparation to a single explicit go no-go decision",
  "PM-FINDING-005 next report should be one yes no decision, not another small planning artifact",
  "ENGINEERING-FINDING-001 future checkpoint uses process env only and leaves .env.local unchanged",
  "ENGINEERING-FINDING-004 future checkpoint uses DATA_FRESHNESS_SUPABASE_READS=enabled only inside the temporary process",
  "QA-FINDING-002 /briefing and /stocks/2330 are limited to one request each in a future checkpoint",
  "SECURITY-FINDING-002 no Supabase URL, anon key, service role key, key prefix, key suffix, or key length may be printed",
  "DATA-FINDING-002 the future checkpoint is not market-data ingestion",
  "LEGAL-FINDING-005 scoreSource=real remains blocked",
  "READINESS-DECISION-001 dry-run command map is accepted",
  "READINESS-DECISION-004 CEO may prepare one explicit bounded runtime-read checkpoint request next",
  "READINESS-DECISION-005 CEO does not execute the checkpoint in this slice",
  "READINESS-DECISION-006 CEO does not bundle SQL, market ingestion, Supabase writes, or scoreSource=real into the checkpoint",
  "READINESS-DECISION-007 CEO rejects further small planning-only slices unless a new blocker appears",
  "OPTION-A open one bounded freshness runtime-read checkpoint using the accepted command map",
  "OPTION-B defer runtime-read execution and continue mock-only runtime UX work",
  "CEO recommendation: choose OPTION-A as the next stage only if the operator is\npresent",
  "BLOCKED-001 this role review is not execution",
  "BLOCKED-002 temporary process is not started in this slice",
  "BLOCKED-005 DATA_FRESHNESS_SUPABASE_READS remains disabled",
  "BLOCKED-006 DATA_FRESHNESS_SOURCE remains mock",
  "BLOCKED-008 Supabase connection remains blocked",
  "BLOCKED-009 SQL execution remains blocked",
  "BLOCKED-017 scoreSource=real remains blocked",
  "BLOCKED-018 CP3 source-depth production gate remains not_ready",
  "The project has reached the end of useful local-only preparation for freshness\nruntime-read.",
  "The next\nuseful decision is not another preparation artifact",
  "scripts/check-freshness-runtime-read-dry-run-command-map-role-review-and-readiness-decision.mjs passes",
  "Supabase remote execution is not performed in this role-review decision slice",
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
        data_freshness_source: "mock",
        data_freshness_supabase_reads: "disabled",
        readiness_decision: "prepare_one_explicit_bounded_checkpoint_request_next",
        remote_execution: "not_performed",
        score_source: "mock"
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
