import fs from "node:fs";

const validatorPath = "scripts/validate-supabase-schema-shape-readonly.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";

const validator = fs.readFileSync(validatorPath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const normalized = validator.toLowerCase();

const requiredPhrases = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION",
  "CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE",
  "mode: \"schema_shape_readonly_skeleton\"",
  "connection: \"not_run\"",
  "rowLimit: 0",
  "daily_prices",
  "twse_stock_day_staging",
  "market_assets",
  "model_runs",
  "data_freshness",
  "contractStatus: \"local-baselined\"",
  "contractStatus: \"needs-reconciliation\"",
  "contractStatus: \"remote-only-pending-contract\"",
  "fieldNamesPresent: \"not_run\"",
  "missingExpectedFields: \"not_run\"",
  "objectKind: \"not_run\"",
  "reachable: \"not_run\"",
  "shapeStatus: \"not_run\"",
  "relationshipToLocalBaseline",
  "unexpectedRuntimeBlockers",
  "missing_schema_shape_execution_confirmation",
  "missing_required_environment",
  "remote_schema_shape_execution_not_implemented",
  "confirmation: confirmation === requiredConfirmation ? \"present\" : \"missing_or_invalid\"",
  "filesWritten: false",
  "mutations: false",
  "sqlExecuted: false",
  "rpcCalled: false",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "rawMarketDataPrinted: false",
  "scoreSourceRealChanged: false",
  "sourceDepthReadyChanged: false",
  "publicClaimsChanged: false",
  "status: \"blocked\"",
  "process.exitCode = 1"
];

const forbiddenPhrases = [
  "@supabase/supabase-js",
  "createClient",
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
  "appendfilesync",
  "scoreSource=real",
  "CP3_READY_NOW",
  "SOURCE_DEPTH_PRODUCTION_READY"
];

const forbiddenSecretOutputPatterns = [
  /console\.\w+\([^)]*process\.env/s,
  /JSON\.stringify\([^)]*process\.env/s,
  /process\.env\[[^\]]+\]\.slice/s,
  /process\.env\[[^\]]+\]\.length/s
];

const missing = requiredPhrases.filter((phrase) => !validator.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => normalized.includes(phrase.toLowerCase()));
const forbiddenSecretOutput = forbiddenSecretOutputPatterns
  .filter((pattern) => pattern.test(validator))
  .map((pattern) => pattern.toString());
const aggregateDoesNotRunValidator = !reviewGate.includes("scripts/validate-supabase-schema-shape-readonly.mjs");

const failures = [
  ...missing.map((phrase) => `missing:${phrase}`),
  ...forbidden.map((phrase) => `forbidden:${phrase}`),
  ...forbiddenSecretOutput.map((pattern) => `forbiddenSecretOutput:${pattern}`),
  ...(aggregateDoesNotRunValidator ? [] : ["aggregateGateRunsValidator"])
];

console.log(
  JSON.stringify(
    {
      aggregateDoesNotRunValidator,
      failures,
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
