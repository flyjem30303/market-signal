import fs from "node:fs";

const packageJsonPath = "package.json";
const reporterPath = "scripts/report-supabase-readonly-local-preflight.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const reporter = fs.readFileSync(reporterPath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const normalized = reporter.toLowerCase();

const required = [
  "mode: \"supabase_readonly_local_preflight\"",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_DATA_SOURCE",
  "MARKET_SIGNAL_SUPABASE_READS",
  "DATA_FRESHNESS_SUPABASE_READS",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "mutations: false",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "filesWritten: false",
  "publicClaimsChanged: false",
  "readRuntimeEnv",
  "nextRemoteCommand: blocked ? null : \"npm run db:readonly-validate\""
];

const forbidden = [
  "@supabase/supabase-js",
  "createclient",
  "fetch(",
  ".from(",
  ".select(",
  ".insert(",
  ".upsert(",
  ".update(",
  ".delete(",
  ".rpc(",
  "insert into",
  "delete from",
  "update public.",
  "truncate",
  "drop table",
  "alter table",
  "create table",
  "writefilesync",
  "appendfilesync"
];

const forbiddenSecretOutputPatterns = [
  /console\.\w+\([^)]*process\.env/s,
  /JSON\.stringify\([^)]*process\.env/s,
  /console\.\w+\([^)]*env\.[A-Z0-9_]+/s
];

const packageScript = packageJson.scripts?.["report:supabase-readonly-preflight"];
const packageScriptOk = packageScript === "node scripts/report-supabase-readonly-local-preflight.mjs";
const aggregateRunsStaticChecker = reviewGate.includes("scripts/check-supabase-readonly-local-preflight.mjs");
const aggregateDoesNotRunReporter = !reviewGate.includes("scripts/report-supabase-readonly-local-preflight.mjs");

const missing = required.filter((phrase) => !reporter.includes(phrase));
const blocked = forbidden.filter((phrase) => normalized.includes(phrase));
const secretOutput = forbiddenSecretOutputPatterns
  .filter((pattern) => pattern.test(reporter))
  .map((pattern) => pattern.toString());

const failures = [
  ...missing.map((phrase) => `missing:${phrase}`),
  ...blocked.map((phrase) => `forbidden:${phrase}`),
  ...secretOutput.map((pattern) => `secretOutput:${pattern}`),
  ...(packageScriptOk ? [] : [`packageScript:${packageScript ?? "missing"}`]),
  ...(aggregateRunsStaticChecker ? [] : ["aggregateMissingStaticChecker"]),
  ...(aggregateDoesNotRunReporter ? [] : ["aggregateRunsEnvReporter"])
];

console.log(
  JSON.stringify(
    {
      aggregateDoesNotRunReporter,
      aggregateRunsStaticChecker,
      failures,
      packageScript,
      reporter: reporterPath,
      status: failures.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exitCode = 1;
}
