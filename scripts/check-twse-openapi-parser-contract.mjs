import fs from "node:fs";

const modulePath = "src/lib/twse-openapi-parser-contract.ts";
const adapterPath = "src/lib/twse-openapi-source-adapter-contract.ts";
const statusPath = "PROJECT_STATUS.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const source = read(modulePath);
const adapter = read(adapterPath);
const status = read(statusPath);
const roles = read(rolePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "export type TwseOpenApiParserFailureClass",
  "\"none\"",
  "\"no_rows\"",
  "\"not_object\"",
  "\"missing_required_field\"",
  "\"field_mismatch\"",
  "\"duplicate_dates\"",
  "\"schema_drift_blocked\"",
  "export type TwseOpenApiSyntheticRow",
  "export type TwseOpenApiParserContractResult",
  "TWSE_OPENAPI_PARSER_CONTRACT_BOUNDARY",
  "fixturePolicy: \"synthetic_rows_only\"",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "rawMarketDataFetch: false",
  "sqlExecution: false",
  "supabaseWrite: false",
  "parseTwseOpenApiSyntheticRows",
  "parseTwseOpenApiTradeDate",
  "parseTwseOpenApiNumericCell",
  "ROUTE_REQUIRED_FIELDS",
  "twiiIndexHistory",
  "listedStockDailyClose",
  "listedStockDailyTradingInfo",
  "marketDailyStatistics",
  "twse_openapi_parser_contract_with_synthetic_fixtures_only",
  "twse_openapi_parser_contract_consumer_adapter_no_fetch"
]) {
  if (!source.includes(phrase)) problems.push(`${modulePath} missing: ${phrase}`);
}

for (const phrase of [
  "twse_openapi_source_adapter_contract_scaffold_no_data_fetch",
  "TWSE_OPENAPI_ATTRIBUTION",
  "TWSE_OPENAPI_ADAPTER_BOUNDARY"
]) {
  if (!adapter.includes(phrase)) problems.push(`${adapterPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWSE OpenAPI parser contract synthetic fixtures slice",
  "twse_openapi_parser_contract_with_synthetic_fixtures_only",
  "twse_openapi_parser_contract_consumer_adapter_no_fetch"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "twse_openapi_parser_contract_with_synthetic_fixtures_only",
  "twse_openapi_parser_contract_consumer_adapter_no_fetch"
]) {
  if (!roles.includes(phrase)) problems.push(`${rolePath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:twse-openapi-parser-contract"] !== "node --experimental-strip-types scripts/check-twse-openapi-parser-contract.mjs") {
  problems.push(`${packagePath} missing check:twse-openapi-parser-contract script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-parser-contract.mjs",
  "twse-openapi-parser-contract",
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
  /supabaseWrite:\s*true/u,
  /daily_prices/u
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
      guardedStatus: "twse_openapi_parser_contract_with_synthetic_fixtures_only",
      nextRoute: "twse_openapi_parser_contract_consumer_adapter_no_fetch",
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
