import fs from "node:fs";

const roadMapPath = "docs/TWSE_OPENAPI_FIELD_CONTRACT_ROADMAP.md";
const sourceAdapterPath = "src/lib/twse-openapi-source-adapter-contract.ts";
const parserPath = "src/lib/twse-openapi-parser-contract.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";

const problems = [];

const roadMapSource = read(roadMapPath);
const sourceSource = read(sourceAdapterPath);
const parserSource = read(parserPath);
const pkgSource = read(packagePath);
const reviewGateSource = read(reviewGatePath);
const statusSource = read(statusPath);
const roleSource = read(rolePath);

for (const phrase of [
  "## Source contract fields (raw route shape)",
  "twiiIndexHistory",
  "listedStockDailyClose",
  "listedStockDailyTradingInfo",
  "marketDailyStatistics",
  "Failure class mapping to handoff",
  "Roadmap: field-contract escalation",
  "publicDataSource",
  "scoreSource",
  "rawMarketDataFetch"
]) {
  if (!roadMapSource.includes(phrase)) problems.push(`${roadMapPath} missing: ${phrase}`);
}

for (const phrase of [
  "export type TwseOpenApiRouteId",
  "export type TwseOpenApiNormalizedDailyClose",
  "requiredFor",
  "ROUTE_REQUIRED_FIELDS",
  "Date",
  "ClosingIndex",
  "ClosingPrice",
  "OpeningPrice",
  "/indicesReport/MI_5MINS_HIST",
  "/exchangeReport/STOCK_DAY_AVG_ALL",
  "/exchangeReport/STOCK_DAY_ALL",
  "/exchangeReport/MI_INDEX"
]) {
  if (phrase === "ROUTE_REQUIRED_FIELDS") {
    if (!parserSource.includes(phrase)) problems.push(`contract files missing: ${phrase}`);
    continue;
  }
  if (!sourceSource.includes(phrase) && !parserSource.includes(phrase)) {
    problems.push(`contract files missing: ${phrase}`);
  }
}

for (const phrase of [
  "twse_openapi_parser_contract_with_synthetic_fixtures_only",
  "twse_openapi_parser_contract_consumer_adapter_no_fetch"
]) {
  if (!statusSource.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!roleSource.includes(phrase)) problems.push(`${rolePath} missing: ${phrase}`);
}

const pkg = JSON.parse(pkgSource);
if (
  !pkg.scripts?.["check:twse-openapi-field-contract-roadmap"] ||
  pkg.scripts["check:twse-openapi-field-contract-roadmap"] !==
    "node scripts/check-twse-openapi-field-contract-roadmap.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-field-contract-roadmap script`);
}

for (const phrase of [
  "scripts/check-twse-openapi-field-contract-roadmap.mjs",
  "twse-openapi-field-contract-roadmap",
  "expectStatus: \"ok\""
]) {
  if (!reviewGateSource.includes(phrase)) problems.push(`${reviewGatePath} missing reference: ${phrase}`);
}

for (const pattern of [
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /rawMarketDataFetch:\s*true/u,
  /sqlExecution:\s*true/u,
  /supabaseWrite:\s*true/u
]) {
  if (pattern.test(roadMapSource) || pattern.test(sourceSource) || pattern.test(parserSource)) {
    problems.push(`forbidden boundary: ${pattern}`);
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
      guardedStatus: "twse_openapi_source_adapter_contract_scaffold_no_data_fetch",
      artifact: roadMapPath,
      modules: [sourceAdapterPath, parserPath]
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
