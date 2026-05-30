import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_LOCAL_PREFLIGHT_RUNNER_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");
const node = process.execPath;

const riskyArgs = process.argv.slice(2).filter((arg) =>
  [
    "execute",
    "connect",
    "supabase",
    "sql",
    "fetch",
    "parse",
    "write",
    "scoreSource=real",
    "DATA_FRESHNESS_SUPABASE_READS=enabled"
  ].some((token) => arg.toLowerCase().includes(token.toLowerCase()))
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
  "Status: CP3 freshness runtime-read local preflight runner recorded",
  "LOCAL_PREFLIGHT_ONLY_DO_NOT_EXECUTE_FRESHNESS_RUNTIME_READ",
  "does not execute a runtime read",
  "does not\nenable `DATA_FRESHNESS_SUPABASE_READS`",
  "does not set `DATA_FRESHNESS_SOURCE` to\n`supabase`",
  "does not modify `.env.local`",
  "does not connect to Supabase",
  "does not\nrun SQL",
  "does not write Supabase",
  "does not fetch market data",
  "does not parse\nmarket rows",
  "does not record real output",
  "does not approve\n`scoreSource=real`",
  "RUNNER-SCOPE-001 run local static freshness runtime-read gates only",
  "RUNNER-SCOPE-004 refuse execution-like command arguments",
  "RUNNER-SCOPE-005 refuse DATA_FRESHNESS_SOURCE=supabase during this local runner",
  "RUNNER-SCOPE-006 refuse DATA_FRESHNESS_SUPABASE_READS=enabled during this local runner",
  "RUNNER-SCOPE-007 refuse NEXT_PUBLIC_DATA_SOURCE values other than mock when present",
  "PREFLIGHT-001 node scripts/check-freshness-runtime-read-activation-gate.mjs",
  "PREFLIGHT-008 node scripts/check-data-freshness-source-fallback.mjs",
  "REFUSE-009 DATA_FRESHNESS_SOURCE is supabase",
  "REFUSE-010 DATA_FRESHNESS_SUPABASE_READS is enabled",
  "REFUSE-011 NEXT_PUBLIC_DATA_SOURCE is present and not mock",
  "BLOCKED-001 this runner is not execution",
  "BLOCKED-002 DATA_FRESHNESS_SUPABASE_READS remains disabled",
  "BLOCKED-003 DATA_FRESHNESS_SOURCE remains mock",
  "BLOCKED-005 Supabase connection remains blocked",
  "BLOCKED-006 SQL execution remains blocked",
  "BLOCKED-014 scoreSource=real remains blocked",
  "BLOCKED-015 CP3 source-depth production gate remains not_ready",
  "The governance chain is now runnable as a local preflight without opening\nremote runtime behavior.",
  "NEXT-SLICE-001 run this local preflight runner in routine checks",
  "NEXT-SLICE-002 keep OPTION-A unexecuted until CEO explicitly opens it",
  "scripts/check-freshness-runtime-read-local-preflight-runner.mjs passes",
  "Supabase remote execution is not performed in this local preflight runner",
  "DATA_FRESHNESS_SUPABASE_READS remains disabled",
  "scoreSource=real remains blocked"
];

const forbiddenPhrases = [
  "EXECUTE_FRESHNESS_RUNTIME_READ_NOW",
  "REMOTE_EXECUTION_PERFORMED",
  "DATA_FRESHNESS_SUPABASE_READS is enabled in this runner",
  "DATA_FRESHNESS_SOURCE is supabase in this runner",
  "Supabase connection is approved",
  "SQL execution is approved",
  "Supabase writes are approved",
  "market-data fetch is approved",
  "market-row parsing is approved",
  "real output is recorded",
  "scoreSource=real approved",
  "CP3 source-depth production gate is ready",
  "public claims are approved"
];

const localChecks = [
  "scripts/check-freshness-runtime-read-activation-gate.mjs",
  "scripts/check-freshness-runtime-read-activation-gate-role-review.mjs",
  "scripts/check-freshness-runtime-read-execution-packet-draft.mjs",
  "scripts/check-freshness-runtime-read-execution-packet-role-review.mjs",
  "scripts/check-freshness-runtime-read-open-decision-gate.mjs",
  "scripts/check-freshness-runtime-read-post-run-review-template.mjs",
  "scripts/check-freshness-runtime-read-post-run-review-template-role-review.mjs",
  "scripts/check-data-freshness-source-fallback.mjs"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));
const checkResults = localChecks.map((script) => runLocalCheck(script));
const failedChecks = checkResults.filter((result) => !result.pass);

const status =
  missing.length === 0 &&
  forbidden.length === 0 &&
  riskyArgs.length === 0 &&
  envProblems.length === 0 &&
  failedChecks.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      boundaries: {
        data_freshness_source: "mock",
        data_freshness_supabase_reads: "disabled",
        public_data_source: "mock",
        score_source: "mock",
        supabase_remote_execution: "not_performed"
      },
      checkResults,
      envProblems,
      failedChecks,
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

function runLocalCheck(script) {
  const result = spawnSync(node, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  const observedStatus = readStatus(output, result.status);

  return {
    exit_code: result.status,
    name: script,
    observed_status: observedStatus,
    pass: observedStatus === "ok"
  };
}

function readStatus(output, exitCode) {
  const jsonStart = output.indexOf("{");
  const jsonEnd = output.lastIndexOf("}");

  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    try {
      const parsed = JSON.parse(output.slice(jsonStart, jsonEnd + 1));
      if (parsed.status) return parsed.status;
    } catch {
      // Some tools may print non-JSON diagnostics before failing.
    }
  }

  return exitCode === 0 ? "ok" : "blocked";
}
