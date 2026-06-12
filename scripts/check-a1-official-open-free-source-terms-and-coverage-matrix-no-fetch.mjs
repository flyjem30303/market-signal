import fs from "node:fs";

const matrixPath = "docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const matrix = read(matrixPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A1 Official Open Free Source Terms and Coverage Matrix No-Fetch",
  "`a1_official_open_free_source_terms_and_coverage_matrix_ready_local_only`",
  "legal_free_automatable_source_terms_and_coverage_matrix_no_fetch",
  "no-fetch: do not retrieve market rows from any source.",
  "no-SQL: do not run SQL.",
  "no-Supabase: do not connect to Supabase and do not write Supabase.",
  "no-raw-data: do not fetch, store, commit, print, or transform",
  "Do not create staging rows.",
  "Do not modify `daily_prices`.",
  "Keep `publicDataSource=mock`.",
  "Keep `scoreSource=mock`.",
  "TWSE OpenAPI / official public data candidate",
  "Candidate Source Terms and Coverage Matrix",
  "Automation signal",
  "Free signal",
  "Terms / license items still to confirm",
  "Daily close",
  "Volume",
  "Date",
  "Symbol",
  "ETF",
  "Index",
  "Stock",
  "Cannot use or unconfirmed items",
  "Next PM decision",
  "select_first_terms_review_lane_twse_openapi_or_twii_index",
  "prepare_selected_official_source_terms_evidence_packet_no_fetch"
];

for (const phrase of requiredPhrases) {
  if (!matrix.includes(phrase)) problems.push(`${matrixPath} missing: ${phrase}`);
}

const signalGroups = [
  {
    name: "coverage signals",
    patterns: [/Daily close/i, /Volume/i, /ETF/i, /Index/i, /Stock/i]
  },
  {
    name: "terms signals",
    patterns: [/terms/i, /license/i, /attribution/i, /redistribution/i]
  },
  {
    name: "automation signals",
    patterns: [/Automation signal/i, /automatable/i, /scheduled/i]
  },
  {
    name: "free signals",
    patterns: [/Free signal/i, /free\/open/i, /no fee/i]
  }
];

for (const group of signalGroups) {
  const matched = group.patterns.some((pattern) => pattern.test(matrix));
  if (!matched) problems.push(`${matrixPath} missing ${group.name}`);
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
  /\bsource response body sample\b/i,
  /\bmarket row sample\b/i,
  /\bstock-id row list\b/i
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(matrix)) problems.push(`${matrixPath} forbidden pattern: ${pattern}`);
}

let parsedPackage = {};
try {
  parsedPackage = JSON.parse(packageJson);
} catch {
  problems.push(`${packagePath} invalid JSON`);
}

if (
  parsedPackage?.scripts?.["check:a1-official-open-free-source-terms-and-coverage-matrix-no-fetch"] !==
  "node scripts/check-a1-official-open-free-source-terms-and-coverage-matrix-no-fetch.mjs"
) {
  problems.push(`${packagePath} missing check:a1-official-open-free-source-terms-and-coverage-matrix-no-fetch`);
}

if (!reviewGate.includes("check-a1-official-open-free-source-terms-and-coverage-matrix-no-fetch.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}
if (!reviewGate.includes("a1-official-open-free-source-terms-and-coverage-matrix-no-fetch")) {
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
        mode: "a1_official_open_free_source_terms_and_coverage_matrix_no_fetch",
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
        nextPmDecision: "select_first_terms_review_lane_twse_openapi_or_twii_index",
        nextRecommendedA1Task: "prepare_selected_official_source_terms_evidence_packet_no_fetch"
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
