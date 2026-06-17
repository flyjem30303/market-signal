import fs from "node:fs";

const contractPath = "src/lib/twse-openapi-source-adapter-contract.ts";
const statusPath = "PROJECT_STATUS.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const contract = read(contractPath);
const status = read(statusPath);
const roles = read(rolePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "export type TwseOpenApiRouteId",
  "export type TwseOpenApiDatasetId",
  "export type TwseOpenApiRouteContract",
  "export type TwseOpenApiAttributionContract",
  "export type TwseOpenApiNormalizedDailyClose",
  "export type TwseOpenApiAdapterBoundary",
  "datasetId",
  "sourceFields",
  "normalizedFields",
  "\"11755\"",
  "\"11548\"",
  "\"11549\"",
  "twiiIndexHistory",
  "listedStockDailyClose",
  "listedStockDailyTradingInfo",
  "marketDailyStatistics",
  "/indicesReport/MI_5MINS_HIST",
  "/exchangeReport/STOCK_DAY_AVG_ALL",
  "/exchangeReport/STOCK_DAY_ALL",
  "/exchangeReport/MI_INDEX",
  "accepted_metadata_route_for_twii_index_history",
  "accepted_metadata_route_for_listed_stock_daily_close",
  "accepted_metadata_route_for_listed_stock_daily_trading_info",
  "accepted_metadata_route_for_market_daily_statistics",
  "TWSE open-data TWII daily OHLC route from data.gov dataset 11755",
  "TWSE open-data listed-stock daily close and monthly-average route from data.gov dataset 11548",
  "TWSE open-data listed-stock daily trading route from data.gov dataset 11549",
  "TWSE_OPENAPI_DATA_GOV",
  "transactions",
  "資料來源：TWSE OpenAPI / data.gov 開放資料",
  "不得宣稱即時逐筆行情",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "rawMarketDataFetch: false",
  "sqlExecution: false",
  "supabaseWrite: false",
  "getTwseOpenApiAdapterReadiness",
  "twse_openapi_source_adapter_contract_scaffold_no_data_fetch",
  "twse_openapi_parser_contract_with_synthetic_fixtures_only"
]) {
  if (!contract.includes(phrase)) problems.push(`${contractPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWSE OpenAPI source adapter contract scaffold slice",
  "twse_openapi_source_adapter_contract_scaffold_no_data_fetch",
  "twse_openapi_parser_contract_with_synthetic_fixtures_only"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "twse_openapi_source_adapter_contract_scaffold_no_data_fetch",
  "twse_openapi_parser_contract_with_synthetic_fixtures_only"
]) {
  if (!roles.includes(phrase)) problems.push(`${rolePath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:twse-openapi-source-adapter-contract"] !==
  "node scripts/check-twse-openapi-source-adapter-contract.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-source-adapter-contract script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-source-adapter-contract.mjs",
  "twse-openapi-source-adapter-contract",
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
  /executionAuthority:\s*"authorized"/u,
  /rawMarketDataFetch:\s*true/u,
  /sqlExecution:\s*true/u,
  /supabaseWrite:\s*true/u
]) {
  if (pattern.test(contract)) problems.push(`${contractPath} contains forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twse_openapi_source_adapter_contract_scaffold_no_data_fetch",
      nextRoute: "twse_openapi_parser_contract_with_synthetic_fixtures_only",
      contractPath
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
