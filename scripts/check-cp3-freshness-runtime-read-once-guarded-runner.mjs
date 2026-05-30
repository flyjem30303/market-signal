import { spawnSync } from "node:child_process";
import fs from "node:fs";

const runnerPath = "scripts/run-freshness-runtime-read-once.mjs";
const reportPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_ONCE_GUARDED_RUNNER_2026-05-30.md";
const commandMapPath = "docs/reviews/CP3_FRESHNESS_EXACT_ONE_ATTEMPT_READONLY_ACTIVATION_COMMAND_MAP_2026-05-30.md";
const runner = fs.readFileSync(runnerPath, "utf8");
const report = fs.readFileSync(reportPath, "utf8");
const commandMap = fs.readFileSync(commandMapPath, "utf8");

const requiredRunnerPhrases = [
  "const REQUIRED_CONFIRMATION = \"CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT\"",
  "process.env.FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION !== REQUIRED_CONFIRMATION",
  "reason: \"missing_confirmation\"",
  "remoteAttempted: false",
  "process.env.NEXT_PUBLIC_DATA_SOURCE !== \"mock\"",
  "process.env.DATA_FRESHNESS_SOURCE !== \"supabase\"",
  "process.env.DATA_FRESHNESS_SUPABASE_READS !== \"enabled\"",
  "loadTsModule(\"src/lib/data-freshness-source.ts\")",
  "loadProcessEnvFromDotEnvLocal();",
  "printSanitized({",
  "categorizeError(error)"
];

const requiredReportPhrases = [
  "Status: `CP3 freshness runtime read once guarded runner recorded`",
  "Decision: `IMPLEMENT_FAIL_CLOSED_GUARDED_RUNNER_WITHOUT_EXECUTION`",
  "does not execute the approved command",
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
  "RUNNER-001 exits before loading the runtime wrapper when `FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION` is missing",
  "RUNNER-002 requires `FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION=CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT`",
  "RUNNER-003 requires `NEXT_PUBLIC_DATA_SOURCE=mock`",
  "RUNNER-008 does not contain SQL command text",
  "RUNNER-009 does not call write, insert, update, delete, upsert, rpc, or storage APIs",
  "RUNNER-010 prints only sanitized JSON fields",
  "VERIFY-001 running `scripts/run-freshness-runtime-read-once.mjs` without confirmation returns `status=blocked`",
  "VERIFY-002 fail-closed verification returns `remoteAttempted=false`",
  "Do not execute with the confirmation value yet.",
  "NEXT-SLICE-001 prepare final one-attempt freshness runtime execution decision gate"
];

const requiredEvidencePhrases = [
  {
    content: commandMap,
    file: commandMapPath,
    phrase: "NEXT-SLICE-001 implement `scripts/run-freshness-runtime-read-once.mjs` as a fail-closed guarded runner."
  }
];

const forbiddenRunnerPatterns = [
  /\.from\s*\(\s*["'`][^"'`]*select/i,
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /\.storage\b/i,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/
];

const failClosed = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP
  }
});

let failClosedJson = null;
try {
  failClosedJson = JSON.parse(failClosed.stdout);
} catch {
  // Keep null and report below.
}

const missing = [
  ...requiredRunnerPhrases.filter((phrase) => !runner.includes(phrase)).map((phrase) => `${runnerPath}: ${phrase}`),
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase)).map((phrase) => `${reportPath}: ${phrase}`),
  ...requiredEvidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = forbiddenRunnerPatterns
  .filter((pattern) => pattern.test(runner))
  .map((pattern) => `${runnerPath}: ${pattern}`);
const failClosedProblems = [];

if (failClosed.status !== 1) {
  failClosedProblems.push(`expected exit 1, got ${failClosed.status}`);
}

if (!failClosedJson) {
  failClosedProblems.push("fail-closed output is not JSON");
} else {
  if (failClosedJson.status !== "blocked") failClosedProblems.push("status is not blocked");
  if (failClosedJson.reason !== "missing_confirmation") failClosedProblems.push("reason is not missing_confirmation");
  if (failClosedJson.remoteAttempted !== false) failClosedProblems.push("remoteAttempted is not false");
}

const status =
  missing.length === 0 && forbidden.length === 0 && failClosedProblems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      failClosed: {
        exitCode: failClosed.status,
        output: failClosedJson
      },
      failClosedProblems,
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
