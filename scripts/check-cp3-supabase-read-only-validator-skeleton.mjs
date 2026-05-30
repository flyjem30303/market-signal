import fs from "node:fs";

const packageJsonPath = "package.json";
const validatorPath = "scripts/validate-supabase-readonly.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const validator = fs.readFileSync(validatorPath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const normalized = validator.toLowerCase();

const requiredPhrases = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "daily_prices",
  "twse_stock_day_staging",
  "market_assets",
  "model_runs",
  "data_freshness",
  "mode: \"read_only_remote_validation\"",
  "connection: \"not_run\"",
  "reachable: \"not_run\"",
  "countStatus: \"not_run\"",
  "rowLimit: 5",
  "mutations: false",
  "sqlExecuted: false",
  "rpcCalled: false",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "filesWritten: false",
  "scoreSourceRealChanged: false",
  "sourceDepthReadyChanged: false",
  "publicClaimsChanged: false",
  "missing_required_environment",
  "remote_execution_not_approved",
  "status: \"blocked\"",
  "process.exitCode = 1"
];

const forbiddenPhrases = [
  "@supabase/supabase-js",
  "createclient",
  ".from(",
  ".select(",
  ".insert(",
  ".upsert(",
  ".update(",
  ".delete(",
  ".rpc(",
  ".storage",
  "insert into",
  "delete from",
  "update public.",
  "truncate",
  "drop table",
  "alter table",
  "create table",
  "fetch(",
  "writefilesync",
  "appendfilesync"
];

const forbiddenSecretOutputPatterns = [
  /console\.\w+\([^)]*process\.env/s,
  /JSON\.stringify\([^)]*process\.env/s
];

const missing = requiredPhrases.filter((phrase) => !validator.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => normalized.includes(phrase));
const forbiddenSecretOutput = forbiddenSecretOutputPatterns
  .filter((pattern) => pattern.test(validator))
  .map((pattern) => pattern.toString());

const packageScript = packageJson.scripts?.["db:readonly-validate"];
const packageScriptOk = packageScript === "node scripts/validate-supabase-readonly.mjs";
const aggregateDoesNotRunValidator = !reviewGate.includes("scripts/validate-supabase-readonly.mjs");

const failures = [
  ...missing.map((phrase) => `missing:${phrase}`),
  ...forbidden.map((phrase) => `forbidden:${phrase}`),
  ...forbiddenSecretOutput.map((pattern) => `forbiddenSecretOutput:${pattern}`),
  ...(packageScriptOk ? [] : [`packageScript:${packageScript ?? "missing"}`]),
  ...(aggregateDoesNotRunValidator ? [] : ["aggregateGateRunsValidator"])
];

console.log(
  JSON.stringify(
    {
      aggregateDoesNotRunValidator,
      failures,
      packageScript,
      status: failures.length === 0 ? "ok" : "blocked",
      validator: validatorPath
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exitCode = 1;
}
