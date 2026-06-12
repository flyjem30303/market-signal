import fs from "node:fs";

const handoffPath = "docs/A1_OFFICIAL_OPEN_SOURCE_COVERAGE_NO_FETCH_HANDOFF.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const handoff = read(handoffPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A1 Official Open Source Coverage No-Fetch Handoff",
  "`a1_official_open_source_coverage_no_fetch_handoff_ready_local_only`",
  "official_open_free_source_coverage_path_without_market_row_fetch",
  "No-fetch: do not retrieve market rows from any source.",
  "No-SQL: do not run SQL.",
  "No-write: do not write Supabase.",
  "Do not connect to Supabase.",
  "Do not create staging rows.",
  "Do not modify `daily_prices`.",
  "Keep `publicDataSource=mock`.",
  "Keep `scoreSource=mock`.",
  "TWSE OpenAPI / official public route",
  "TPEX official public route",
  "Financial Supervisory Commission / official open-data metadata",
  "Items Mock Consumers Can Prepare Now",
  "PM/CEO Rights Confirmations Needed",
  "prepare_official_open_free_source_terms_and_coverage_matrix_no_fetch"
];

for (const phrase of requiredPhrases) {
  if (!handoff.includes(phrase)) problems.push(`${handoffPath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /\bfetch\(/i,
  /\bfrom\(/i,
  /\binsert\s+into\b/i,
  /\bupdate\s+daily_prices\b/i,
  /\bdaily_prices\s+write\b/i,
  /\bdaily_prices\s+writes\b/i,
  /publicDataSource\s*=\s*"supabase"/i,
  /scoreSource\s*=\s*"real"/i,
  /rawMarketDataFetch\s*=\s*true/i,
  /supabaseWrite\s*=\s*true/i,
  /dailyPricesMutation\s*=\s*true/i,
  /\braw\s+payload\b/i,
  /\braw\s+payloads\b/i,
  /\bsource response body sample\b/i,
  /\bmarket row sample\b/i,
  /\bstock-id row list\b/i
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
  parsedPackage?.scripts?.["check:a1-official-open-source-coverage-no-fetch-handoff"] !==
  "node scripts/check-a1-official-open-source-coverage-no-fetch-handoff.mjs"
) {
  problems.push(`${packagePath} missing check:a1-official-open-source-coverage-no-fetch-handoff`);
}

if (!reviewGate.includes("check-a1-official-open-source-coverage-no-fetch-handoff.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}
if (!reviewGate.includes("a1-official-open-source-coverage-no-fetch-handoff")) {
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
        mode: "a1_official_open_source_coverage_no_fetch_handoff",
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
        nextRecommendedA1Task: "prepare_official_open_free_source_terms_and_coverage_matrix_no_fetch"
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
