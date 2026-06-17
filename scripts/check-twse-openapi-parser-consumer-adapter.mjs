import fs from "node:fs";

const modulePath = "src/lib/twse-openapi-parser-consumer-adapter.ts";
const parserPath = "src/lib/twse-openapi-parser-contract.ts";
const statusPath = "PROJECT_STATUS.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const selectorReportPath = "scripts/report-public-beta-data-realification-next-action.mjs";
const selectorCheckPath = "scripts/check-public-beta-data-realification-next-action.mjs";

const problems = [];

const source = read(modulePath);
const parser = read(parserPath);
const status = read(statusPath);
const roles = read(rolePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const selectorReport = read(selectorReportPath);
const selectorCheck = read(selectorCheckPath);

for (const phrase of [
  "export type TwseOpenApiRuntimeHandoffStatus",
  "export type TwseOpenApiRuntimeDailyPoint",
  "export type TwseOpenApiRuntimeHandoff",
  "TWSE_OPENAPI_PARSER_CONSUMER_ADAPTER_BOUNDARY",
  "fixturePolicy: \"synthetic_parser_result_only\"",
  "nextRoute: \"twse_openapi_runtime_mock_consumer_wiring_readiness\"",
  "publicDataSource: \"mock\"",
  "rawMarketDataFetch: false",
  "scoreSource: \"mock\"",
  "sqlExecution: false",
  "supabaseWrite: false",
  "status: \"twse_openapi_parser_contract_consumer_adapter_no_fetch\"",
  "buildTwseOpenApiRuntimeHandoff",
  "isTwseOpenApiRuntimeHandoffReady",
  "parser_result_failure_class:",
  "runtime_handoff_fail_closed_no_points_exported",
  "parser_result_empty_after_normalization",
  "synthetic_parser_result_only",
  "calculateChange",
  "collectWarnings"
]) {
  if (!source.includes(phrase)) problems.push(`${modulePath} missing: ${phrase}`);
}

for (const phrase of [
  "twse_openapi_parser_contract_consumer_adapter_no_fetch",
  "twse_openapi_runtime_mock_consumer_wiring_readiness"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!roles.includes(phrase)) problems.push(`${rolePath} missing: ${phrase}`);
}

for (const phrase of [
  "twse_openapi_parser_contract_with_synthetic_fixtures_only",
  "twse_openapi_parser_contract_consumer_adapter_no_fetch"
]) {
  if (!parser.includes(phrase)) problems.push(`${parserPath} missing: ${phrase}`);
}

for (const phrase of [
  "twse_openapi_runtime_mock_consumer_wiring_readiness",
  "prepare_twse_openapi_runtime_mock_consumer_wiring_readiness",
  "twse_openapi_runtime_consumer_adapter_synthetic_case_notes",
  "runtime_mock_consumer_public_boundary_copy_guardrail",
  "src/lib/twse-openapi-parser-consumer-adapter.ts"
]) {
  if (!selectorReport.includes(phrase)) problems.push(`${selectorReportPath} missing: ${phrase}`);
}

for (const phrase of [
  "twse_openapi_runtime_mock_consumer_wire",
  "continue_data_line_source_and_coverage_without_market_row_fetch",
  "runtime_mock_consumer_public_boundary_copy_guardrail"
]) {
  if (!selectorCheck.includes(phrase)) problems.push(`${selectorCheckPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:twse-openapi-parser-consumer-adapter"] !==
  "node scripts/check-twse-openapi-parser-consumer-adapter.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-parser-consumer-adapter script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-parser-consumer-adapter.mjs",
  "twse-openapi-parser-consumer-adapter",
  "expectStatus: \"ok\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const pattern of [
  /\bfetch\s*\(/u,
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /process\.env/u,
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /rawMarketDataFetch:\s*true/u,
  /sqlExecution:\s*true/u,
  /supabaseWrite:\s*true/u
]) {
  if (pattern.test(source)) problems.push(`${modulePath} contains forbidden pattern: ${pattern}`);
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
