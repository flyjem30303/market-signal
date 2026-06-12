import fs from "node:fs";

const handoffPath = "docs/A1_PUBLIC_BETA_SOURCE_COVERAGE_RUNTIME_NO_FETCH_HANDOFF.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const handoff = read(handoffPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A1 Public Beta Source Coverage Runtime No-Fetch Handoff",
  "`a1_public_beta_source_coverage_runtime_no_fetch_handoff_ready_local_only`",
  "public_beta_index_dashboard_source_coverage_runtime_support_no_fetch",
  "TWSE OpenAPI",
  "daily close",
  "daily trading information",
  "twse_openapi_official_candidate",
  "twse_index_official_candidate",
  "twse_equity_daily_candidate",
  "twse_etf_daily_candidate",
  "tpex_official_candidate",
  "Coverage Universe Roadmap",
  "Index baseline",
  "Core ETF context",
  "Batch 1 listed equities",
  "Full listed equities",
  "Mock Runtime Consumer Readiness",
  "A1 / A2 / PM Split",
  "prepare_twse_openapi_terms_field_coverage_matrix_no_fetch",
  "wire_mock_runtime_source_coverage_labels",
  "Do not run SQL.",
  "Do not connect to Supabase.",
  "Do not write Supabase.",
  "Do not create staging rows.",
  "Do not modify `daily_prices`.",
  "Do not fetch market rows.",
  "Do not store market rows.",
  "Do not commit market rows.",
  "Keep `publicDataSource=mock`.",
  "Keep `scoreSource=mock`.",
  "Do not claim TWSE OpenAPI is accepted for ingestion."
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
  /\braw\s+payload\s+sample\b/i,
  /\bmarket\s+row\s+sample\b/i,
  /\bstock-id\s+row\s+list\b/i
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
  parsedPackage?.scripts?.["check:a1-public-beta-source-coverage-runtime-no-fetch-handoff"] !==
  "node scripts/check-a1-public-beta-source-coverage-runtime-no-fetch-handoff.mjs"
) {
  problems.push(`${packagePath} missing check:a1-public-beta-source-coverage-runtime-no-fetch-handoff`);
}

if (!reviewGate.includes("check-a1-public-beta-source-coverage-runtime-no-fetch-handoff.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}
if (!reviewGate.includes("a1-public-beta-source-coverage-runtime-no-fetch-handoff")) {
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
        mode: "a1_public_beta_source_coverage_runtime_no_fetch_handoff",
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
        nextRecommendedA1Task: "prepare_twse_openapi_terms_field_coverage_matrix_no_fetch",
        pmMainlineTask: "wire_mock_runtime_source_coverage_labels",
        a2SupportTask: "prepare_official_candidate_public_copy_guard"
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
