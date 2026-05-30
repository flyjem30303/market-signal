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
  "const rowLimit = 0",
  "await import(\"@supabase/supabase-js\")",
  "createClient",
  "persistSession: false",
  "schema_shape_readonly_skeleton",
  "schema_shape_readonly_remote_validation",
  ".from(object.name)",
  ".select(object.projection, { count: \"exact\", head: true })",
  ".limit(rowLimit)",
  "connection: \"not_run\"",
  "connection: blocked ? \"blocked\" : \"ok\"",
  "rowLimit",
  "daily_prices",
  "twse_stock_day_staging",
  "market_assets",
  "model_runs",
  "data_freshness",
  "contractStatus: \"local-baselined\"",
  "contractStatus: \"needs-reconciliation\"",
  "contractStatus: \"remote-only-pending-contract\"",
  "fieldNamesPresent: \"not_run\"",
  "fieldNamesPresent: \"blocked\"",
  "sanitized_categories_only",
  "missingExpectedFields: \"not_run\"",
  "missingExpectedFields: \"blocked\"",
  "not_applicable_remote_contract_pending",
  "objectKind: \"not_run\"",
  "objectKind: \"blocked\"",
  "objectKind: \"unknown\"",
  "reachable: \"not_run\"",
  "reachable: \"blocked\"",
  "reachable: \"ok\"",
  "shapeStatus: \"not_run\"",
  "shapeStatus: \"blocked\"",
  "relationshipToLocalBaseline",
  "unexpectedRuntimeBlockers",
  "missing_schema_shape_execution_confirmation",
  "missing_required_environment",
  "schema_shape_validation_blocked",
  "schema_shape_validation_ok",
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
  "process.exitCode = status === \"ok\" ? 0 : 1"
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
const supabaseImportCount = (validator.match(/@supabase\/supabase-js/g) ?? []).length;
const createClientCount = (validator.match(/\bcreateClient\b/g) ?? []).length;
const rowLimitZero = /const\s+rowLimit\s*=\s*0\b/.test(validator);
const rowLimitPositive = /const\s+rowLimit\s*=\s*[1-9]/.test(validator);
const rawSelectWithoutHead = /\.select\([^)]*\)(?!\s*\.limit\(rowLimit\))/s.test(validator)
  && !validator.includes(".select(object.projection, { count: \"exact\", head: true })");
const confirmationGuardsClient =
  validator.indexOf("confirmation !== requiredConfirmation") < validator.indexOf("await import(\"@supabase/supabase-js\")");
const missingEnvGuardsClient =
  validator.indexOf("missingEnv.length > 0") < validator.indexOf("await import(\"@supabase/supabase-js\")");

const failures = [
  ...missing.map((phrase) => `missing:${phrase}`),
  ...forbidden.map((phrase) => `forbidden:${phrase}`),
  ...forbiddenSecretOutput.map((pattern) => `forbiddenSecretOutput:${pattern}`),
  ...(aggregateDoesNotRunValidator ? [] : ["aggregateGateRunsValidator"]),
  ...(supabaseImportCount === 1 ? [] : [`supabaseImportCount:${supabaseImportCount}`]),
  ...(createClientCount === 2 ? [] : [`createClientCount:${createClientCount}`]),
  ...(rowLimitZero ? [] : ["rowLimitNotZero"]),
  ...(rowLimitPositive ? ["rowLimitPositive"] : []),
  ...(rawSelectWithoutHead ? ["rawSelectWithoutHeadLimitContract"] : []),
  ...(confirmationGuardsClient ? [] : ["confirmationDoesNotGuardClient"]),
  ...(missingEnvGuardsClient ? [] : ["missingEnvDoesNotGuardClient"])
];

console.log(
  JSON.stringify(
    {
      aggregateDoesNotRunValidator,
      confirmationGuardsClient,
      failures,
      missingEnvGuardsClient,
      rowLimitZero,
      status: failures.length === 0 ? "ok" : "blocked",
      supabaseImportCount,
      validator: validatorPath
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exitCode = 1;
}
