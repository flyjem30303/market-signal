import fs from "node:fs";

const handoffPath = "docs/A1_SOURCE_AND_COVERAGE_NO_FETCH_HANDOFF.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const handoff = read(handoffPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A1 Source and Coverage No-Fetch Handoff",
  "`a1_source_and_coverage_no_fetch_handoff_ready_local_only`",
  "continue_data_line_source_and_coverage_without_market_row_fetch",
  "TWSE OpenAPI / public official route",
  "listed stock daily close",
  "daily trading information",
  "TWII",
  "0050",
  "006208",
  "Full listed-stock universe",
  "Do not run SQL",
  "Do not connect to Supabase",
  "Do not write Supabase",
  "Do not create staging rows",
  "Do not modify `daily_prices`",
  "Do not fetch market rows",
  "Do not store market rows",
  "Do not commit market rows",
  "Keep `publicDataSource=mock`",
  "Keep `scoreSource=mock`",
  "accept_a1_source_and_coverage_no_fetch_route",
  "prepare_official_openapi_terms_and_field_contract_evidence_matrix_no_fetch"
];

for (const phrase of requiredPhrases) {
  if (!handoff.includes(phrase)) problems.push(`${handoffPath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /\bfetch\(/i,
  /\bfrom\(/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+daily_prices\b/i,
  /publicDataSource\s*=\s*"supabase"/i,
  /scoreSource\s*=\s*"real"/i,
  /rawMarketDataFetch\s*=\s*true/i,
  /supabaseWrite\s*=\s*true/i,
  /dailyPricesMutation\s*=\s*true/i
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(handoff)) problems.push(`${handoffPath} forbidden pattern: ${pattern}`);
}

let parsedPackage = {};
try {
  parsedPackage = JSON.parse(packageJson);
} catch {
  problems.push(`${packagePath} invalid JSON`);
}

if (
  parsedPackage?.scripts?.["check:a1-source-and-coverage-no-fetch-handoff"] !==
  "node scripts/check-a1-source-and-coverage-no-fetch-handoff.mjs"
) {
  problems.push(`${packagePath} missing check:a1-source-and-coverage-no-fetch-handoff`);
}

if (!reviewGate.includes("check-a1-source-and-coverage-no-fetch-handoff.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}
if (!reviewGate.includes("a1-source-and-coverage-no-fetch-handoff")) {
  problems.push(`${reviewGatePath} missing checker gate name`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        status: "ok",
        mode: "a1_source_and_coverage_no_fetch_handoff",
        runtimeBoundary: {
          publicDataSource: "mock",
          scoreSource: "mock",
          rawMarketDataFetch: false,
          sqlExecuted: false,
          supabaseReadAttempt: false,
          supabaseWrite: false,
          stagingWriteEnabled: false,
          dailyPricesMutation: false
        },
        nextRecommendedA1Task: "prepare_official_openapi_terms_and_field_contract_evidence_matrix_no_fetch"
      },
      null,
      2
    )
  );
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}
