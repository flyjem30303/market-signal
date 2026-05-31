import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "docs/reviews/CP3_ROW_COVERAGE_CREDENTIAL_LOADING_COMMAND_REVISION_2026-06-01.md";
const postRunPath = "docs/reviews/CP3_ROW_COVERAGE_READONLY_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-01.md";
const implementationReviewPath =
  "docs/reviews/CP3_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_LOCAL_IMPLEMENTATION_REVIEW_2026-06-01.md";
const runnerPath = "scripts/run-row-coverage-readonly-once.mjs";

const report = fs.readFileSync(reportPath, "utf8");
const postRun = fs.readFileSync(postRunPath, "utf8");
const implementationReview = fs.readFileSync(implementationReviewPath, "utf8");
const runner = fs.readFileSync(runnerPath, "utf8");

const requiredRunnerPhrases = [
  "const DOTENV_LOCAL_ALLOWED_KEYS = [",
  "\"NEXT_PUBLIC_SUPABASE_URL\"",
  "\"NEXT_PUBLIC_SUPABASE_ANON_KEY\"",
  "\"SUPABASE_SERVICE_ROLE_KEY\"",
  "\"NEXT_PUBLIC_DATA_SOURCE\"",
  "loadProcessEnvFromDotEnvLocal();",
  "function loadProcessEnvFromDotEnvLocal()",
  "path.join(root, \".env.local\")",
  "fs.existsSync(envPath)",
  "fs.readFileSync(envPath, \"utf8\")",
  "if (!process.env[key] && parsed[key])",
  "process.env[key] = parsed[key]",
  "function parseDotEnv(text)",
  "function normalizeDotEnvValue(value)"
];

const requiredReportPhrases = [
  "Status: `CP3 row coverage credential loading command revision recorded`",
  "Decision: `REVISE_ROW_COVERAGE_RUNNER_TO_LOAD_DOTENV_LOCAL_PROCESS_ONLY_WITHOUT_EXECUTION`",
  "Trigger: `CP3 row coverage readonly one-attempt post-run review recorded`",
  "does not retry the remote read",
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
  "does not award row coverage points",
  "does not promote CP3 readiness",
  "loads only these environment keys from `.env.local` into the current process after the missing-confirmation fail-closed gate passes",
  "`NEXT_PUBLIC_SUPABASE_URL`",
  "`NEXT_PUBLIC_SUPABASE_ANON_KEY`",
  "`SUPABASE_SERVICE_ROLE_KEY`",
  "`NEXT_PUBLIC_DATA_SOURCE`",
  "never prints values",
  "never writes `.env.local`",
  "SAFE-001 runner still exits before reading `.env.local` when confirmation is missing.",
  "SAFE-003 runner loads only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_DATA_SOURCE`.",
  "SAFE-008 runner output remains sanitized and allowlisted.",
  "SAFE-009 runner still blocks row coverage point awards.",
  "SAFE-010 runner still blocks `scoreSource=real`.",
  "A second row coverage read-only attempt remains blocked until a new one-attempt execution decision gate is recorded after local checks pass.",
  "NEXT-SLICE-001 create a new one-attempt execution decision gate for the revised row coverage runner if all local checks pass."
];

const requiredEvidencePhrases = [
  {
    content: postRun,
    file: postRunPath,
    phrase: "Outcome category: `preflight_blocked`."
  },
  {
    content: postRun,
    file: postRunPath,
    phrase:
      "NEXT-SLICE-001 revise the row coverage read-only command map so Supabase credentials and `NEXT_PUBLIC_DATA_SOURCE=mock` are provided through process-only environment loading without printing secrets."
  },
  {
    content: implementationReview,
    file: implementationReviewPath,
    phrase: "LOCAL_IMPLEMENTATION_ACCEPTED_REMOTE_EXECUTION_STILL_BLOCKED"
  }
];

const forbiddenRunnerPatterns = [
  /fetch\s*\(/i,
  /\.insert\s*\(/i,
  /\.update\s*\(/i,
  /\.delete\s*\(/i,
  /\.upsert\s*\(/i,
  /\.rpc\s*\(/i,
  /\.storage\b/i,
  /["'`]SELECT\s+/i,
  /["'`]INSERT\s+/i,
  /["'`]UPDATE\s+/i,
  /["'`]DELETE\s+/i,
  /console\.(log|error|warn)\([^)]*process\.env/i
];

const forbiddenReportPhrases = [
  "second row coverage attempt executed",
  "retry was executed",
  "Supabase connection performed",
  "SQL execution is approved",
  "Supabase writes are approved",
  "market ingestion is approved",
  "raw row payload captured",
  "NEXT_PUBLIC_DATA_SOURCE=supabase approved",
  "scoreSource=real approved",
  "ROW_COVERAGE_POINTS_AWARDED",
  "CP3_READY_NOW",
  "public claims are approved"
];

const failClosed = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP
  },
  shell: false
});

let failClosedJson = null;
try {
  failClosedJson = JSON.parse(failClosed.stdout);
} catch {
  // Report below.
}

const missing = [
  ...requiredRunnerPhrases.filter((phrase) => !runner.includes(phrase)).map((phrase) => `${runnerPath}: ${phrase}`),
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase)).map((phrase) => `${reportPath}: ${phrase}`),
  ...requiredEvidencePhrases
    .filter(({ content, phrase }) => !content.includes(phrase))
    .map(({ file, phrase }) => `${file}: ${phrase}`)
];
const forbidden = [
  ...forbiddenRunnerPatterns.filter((pattern) => pattern.test(runner)).map((pattern) => `${runnerPath}: ${pattern}`),
  ...forbiddenReportPhrases.filter((phrase) => report.includes(phrase)).map((phrase) => `${reportPath}: ${phrase}`)
];
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

const status = missing.length === 0 && forbidden.length === 0 && failClosedProblems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify({ failClosed: { exitCode: failClosed.status, output: failClosedJson }, failClosedProblems, forbidden, missing, status }, null, 2)
);

if (status !== "ok") {
  process.exit(1);
}
