import fs from "node:fs";

const docPath = "docs/TWSE_OPENAPI_BOUNDED_METADATA_TERMS_VALIDATION.md";
const statusPath = "PROJECT_STATUS.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];

const doc = read(docPath);
const status = read(statusPath);
const roles = read(rolePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `twse_openapi_bounded_metadata_terms_validation_ready_no_market_rows`",
  "metadata_terms_validated_adapter_design_ready_execution_still_blocked",
  "twse_openapi_source_adapter_contract_scaffold_no_data_fetch",
  "Data.gov Open Government Data License: `https://data.gov.tw/license`",
  "TWSE OpenAPI swagger: `https://openapi.twse.com.tw/v1/swagger.json`",
  "TWSE Terms of Use: `https://www.twse.com.tw/zh/terms/use.html`",
  "TWSE Trading Information use / contracts / fee standards: `https://www.twse.com.tw/zh/products/information/use.html`",
  "Use the data.gov open-data route as the primary no-cost automatable source path",
  "Preserve attribution to TWSE OpenAPI / data.gov open-data references",
  "Real-time or second-level freshness claims",
  "PM performed a metadata-only check",
  "Swagger version: `2.0`",
  "Host: `openapi.twse.com.tw`",
  "Base path: `/v1`",
  "/indicesReport/MI_5MINS_HIST",
  "/exchangeReport/STOCK_DAY_AVG_ALL",
  "/exchangeReport/STOCK_DAY_ALL",
  "/exchangeReport/MI_INDEX",
  "accepted_metadata_route_for_twii_index_history",
  "accepted_metadata_route_for_listed_stock_daily_close",
  "accepted_metadata_route_for_listed_stock_daily_trading_info",
  "accepted_metadata_route_for_market_daily_statistics",
  "The Swagger metadata does not provide a complete response field schema",
  "field contract is accepted only at source-adapter design level",
  "Create a no-fetch source adapter contract interface",
  "Define expected normalized output shapes",
  "Calling candidate endpoints for market rows",
  "Writing Supabase",
  "Mutating `daily_prices`",
  "Promoting runtime from mock to real",
  "PM mainline:",
  "A1:",
  "A2:",
  "D:",
  "This packet does not authorize:",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "investment-advice claims"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWSE OpenAPI bounded metadata / terms validation slice",
  "twse_openapi_bounded_metadata_terms_validation_ready_no_market_rows",
  "twse_openapi_source_adapter_contract_scaffold_no_data_fetch"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "twse_openapi_bounded_metadata_terms_validation_ready_no_market_rows",
  "twse_openapi_source_adapter_contract_scaffold_no_data_fetch",
  "A1 owns endpoint metadata / field-contract notes",
  "A2 owns public attribution / delay / no-advice copy guard"
]) {
  if (!roles.includes(phrase)) problems.push(`${rolePath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:twse-openapi-bounded-metadata-terms-validation"] !==
  "node scripts/check-twse-openapi-bounded-metadata-terms-validation.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-bounded-metadata-terms-validation script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-bounded-metadata-terms-validation.mjs",
  "twse-openapi-bounded-metadata-terms-validation",
  "expectStatus: \"ok\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const pattern of [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu,
  /market rows were fetched/iu,
  /endpoint data fetch is authorized/iu,
  /parser implementation against live rows is authorized/iu,
  /investment advice is allowed/iu
]) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twse_openapi_bounded_metadata_terms_validation_ready_no_market_rows",
      outcome: "metadata_terms_validated_adapter_design_ready_execution_still_blocked",
      nextRoute: "twse_openapi_source_adapter_contract_scaffold_no_data_fetch",
      docPath
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
