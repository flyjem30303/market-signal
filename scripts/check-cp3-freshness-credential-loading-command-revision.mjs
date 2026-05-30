import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "docs/reviews/CP3_FRESHNESS_CREDENTIAL_LOADING_COMMAND_REVISION_2026-05-30.md";
const postRunPath = "docs/reviews/CP3_FRESHNESS_RUNTIME_READ_ONCE_EXECUTION_POST_RUN_REVIEW_2026-05-30.md";
const runnerPath = "scripts/run-freshness-runtime-read-once.mjs";

const report = fs.readFileSync(reportPath, "utf8");
const postRun = fs.readFileSync(postRunPath, "utf8");
const runner = fs.readFileSync(runnerPath, "utf8");

const requiredRunnerPhrases = [
  "const DOTENV_LOCAL_ALLOWED_KEYS = [\"NEXT_PUBLIC_SUPABASE_URL\", \"SUPABASE_SERVICE_ROLE_KEY\"]",
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
  "Status: `CP3 freshness credential loading command revision recorded`",
  "Decision: `REVISE_RUNNER_TO_LOAD_DOTENV_LOCAL_PROCESS_ONLY_WITHOUT_EXECUTION`",
  "Trigger: `CP3 freshness runtime read once execution post-run review recorded`",
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
  "does not promote CP3 readiness",
  "loads only these credential keys from `.env.local` into the current process after all fail-closed runtime gates pass",
  "`NEXT_PUBLIC_SUPABASE_URL`",
  "`SUPABASE_SERVICE_ROLE_KEY`",
  "never prints values",
  "never writes `.env.local`",
  "NEXT_PUBLIC_DATA_SOURCE` must still be `mock`",
  "SAFE-001 runner still exits before reading `.env.local` when confirmation is missing.",
  "SAFE-004 runner loads only `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.",
  "SAFE-005 runner does not load anon key because the server freshness path uses service role only.",
  "SAFE-010 runner output remains sanitized and allowlisted.",
  "A second remote attempt remains blocked until a new one-attempt execution decision gate is recorded after local checks pass.",
  "NEXT-SLICE-001 create a new one-attempt execution decision gate for the revised runner if all local checks pass."
];

const requiredEvidencePhrases = [
  {
    content: postRun,
    file: postRunPath,
    phrase: "Outcome category: `missing_supabase_credentials`."
  },
  {
    content: postRun,
    file: postRunPath,
    phrase: "NEXT-SLICE-001 revise the freshness runtime read command map so Supabase credentials are provided through process-only environment loading without printing secrets."
  }
];

const forbiddenRunnerPatterns = [
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
  /console\.(log|error|warn)\([^)]*process\.env/i,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY/
];

const forbiddenReportPhrases = [
  "second remote attempt executed",
  "retry was executed",
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

console.log(JSON.stringify({ failClosed: { exitCode: failClosed.status, output: failClosedJson }, failClosedProblems, forbidden, missing, status }, null, 2));

if (status !== "ok") {
  process.exit(1);
}
