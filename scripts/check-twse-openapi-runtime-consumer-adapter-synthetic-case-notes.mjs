import fs from "node:fs";

const modulePath = "src/lib/twse-openapi-parser-consumer-adapter.ts";
const notesPath = "docs/TWSE_OPENAPI_RUNTIME_CONSUMER_ADAPTER_SYNTHETIC_CASE_NOTES.md";
const statusPath = "PROJECT_STATUS.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const moduleSource = read(modulePath);
const notesSource = read(notesPath);
const statusSource = read(statusPath);
const rolesSource = read(rolePath);
const pkgSource = read(packagePath);
const reviewGateSource = read(reviewGatePath);

const packageJson = JSON.parse(pkgSource);

for (const phrase of [
  "export type TwseOpenApiRuntimeHandoffStatus",
  "export function buildTwseOpenApiRuntimeHandoff",
  "buildBlockedHandoff",
  "TWSE_OPENAPI_PARSER_CONSUMER_ADAPTER_BOUNDARY",
  "fixturePolicy: \"synthetic_parser_result_only\"",
  "mode: \"synthetic_parser_result_only\"",
  "parser_result_failure_class:",
  "parser_result_empty_after_normalization",
  "runtime_handoff_fail_closed_no_points_exported",
  "status: \"blocked\"",
  "status: \"ready\"",
  "nextRoute: \"twse_openapi_runtime_mock_consumer_wiring_readiness\"",
  "twse_openapi_parser_contract_consumer_adapter_no_fetch"
]) {
  if (!moduleSource.includes(phrase)) {
    problems.push(`${modulePath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Synthetic Case Notes",
  "failureClass: none",
  "failureClass: not_object",
  "failureClass: missing_required_field",
  "failureClass: field_mismatch",
  "failureClass: duplicate_dates",
  "failureClass: schema_drift_blocked",
  "runtime_handoff_fail_closed_no_points_exported",
  "twse_openapi_parser_contract_consumer_adapter_no_fetch",
  "synthetic_parser_result_only",
  "hard boundaries"
]) {
  if (!notesSource.includes(phrase)) {
    problems.push(`${notesPath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "twse_openapi_parser_contract_consumer_adapter_no_fetch",
  "prepare_twse_openapi_runtime_mock_consumer_wiring_readiness"
]) {
  if (!statusSource.includes(phrase)) {
    problems.push(`${statusPath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "twse_openapi_runtime_consumer_adapter_synthetic_case_notes",
  "no field authorizes SQL",
  "raw market-data"
]) {
  if (!rolesSource.includes(phrase)) {
    problems.push(`${rolePath} missing: ${phrase}`);
  }
}

if (
  !packageJson.scripts?.["check:twse-openapi-runtime-consumer-adapter-synthetic-case-notes"] ||
  packageJson.scripts["check:twse-openapi-runtime-consumer-adapter-synthetic-case-notes"] !==
    "node scripts/check-twse-openapi-runtime-consumer-adapter-synthetic-case-notes.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-runtime-consumer-adapter-synthetic-case-notes script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-runtime-consumer-adapter-synthetic-case-notes.mjs",
  "twse-openapi-runtime-consumer-adapter-synthetic-case-notes",
  "expectStatus: \"ok\""
]) {
  if (!reviewGateSource.includes(phrase)) {
    problems.push(`${reviewGatePath} missing reference: ${phrase}`);
  }
}

for (const pattern of [
  /\bfetch\s*\(/u,
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /rawMarketDataFetch:\s*true/u,
  /sqlExecution:\s*true/u,
  /supabaseWrite:\s*true/u,
  /daily_prices/u
]) {
  if (pattern.test(moduleSource)) {
    problems.push(`${modulePath} contains forbidden pattern: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twse_openapi_parser_contract_consumer_adapter_no_fetch",
      nextRoute: "twse_openapi_runtime_mock_consumer_wiring_readiness",
      artifact: notesPath,
      modulePath
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
