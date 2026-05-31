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
  "SUPABASE_READONLY_VALIDATE_CONFIRMATION",
  "CP3_SUPABASE_READONLY_REMOTE_VALIDATE",
  "confirmationStatus",
  "confirmation: confirmationStatus",
  "missing_or_invalid",
  "daily_prices",
  "twse_stock_day_staging",
  "market_assets",
  "model_runs",
  "data_freshness",
  "await import(\"@supabase/supabase-js\")",
  "createClient",
  "persistSession: false",
  "mode: \"read_only_remote_validation\"",
  "connection: \"not_run\"",
  "connection: blocked ? \"blocked\" : \"ok\"",
  ".from(name)",
  ".select(\"*\", { count: \"exact\", head: true })",
  ".limit(rowLimit)",
  "reachable: \"not_run\"",
  "countStatus: \"not_run\"",
  "const rowLimit = 5",
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
  "read_only_validation_blocked",
  "read_only_validation_ok",
  "status: \"blocked\"",
  "process.exitCode = 1"
];

const forbiddenPhrases = [
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
const packageScriptOk = packageScript === "node --env-file=.env.local scripts/validate-supabase-readonly.mjs";
const aggregateDoesNotRunValidator = !reviewGate.includes("scripts/validate-supabase-readonly.mjs");
const supabaseImportOk = (validator.match(/@supabase\/supabase-js/g) ?? []).length === 1;
const rowLimitOk = !/const\s+rowLimit\s*=\s*(?:[6-9]|\d{2,})/.test(validator);

const failures = [
  ...missing.map((phrase) => `missing:${phrase}`),
  ...forbidden.map((phrase) => `forbidden:${phrase}`),
  ...forbiddenSecretOutput.map((pattern) => `forbiddenSecretOutput:${pattern}`),
  ...(packageScriptOk ? [] : [`packageScript:${packageScript ?? "missing"}`]),
  ...(aggregateDoesNotRunValidator ? [] : ["aggregateGateRunsValidator"]),
  ...(supabaseImportOk ? [] : ["supabaseImportCount"]),
  ...(rowLimitOk ? [] : ["rowLimitAboveFive"])
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
