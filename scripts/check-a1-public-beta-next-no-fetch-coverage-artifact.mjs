import fs from "node:fs";

const docPath = "docs/A1_PUBLIC_BETA_NEXT_NO_FETCH_COVERAGE_ARTIFACT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const packageJson = read(packagePath);
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "A1 Public Beta Next No-Fetch Coverage Artifact",
  "`a1_public_beta_next_no_fetch_coverage_artifact_ready_pm_intake`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`TWII` index baseline",
  "core ETF context (`0050`, `006208`)",
  "Batch 1 listed-equity demo anchors (`2330`, `2382`, `2308`)",
  "TWII 大盤基準準備中",
  "核心 ETF 來源條件待確認",
  "第一批上市個股示範",
  "產業與族群待 taxonomy review",
  "進階指標 mock 可解釋，真實計算未開放",
  "Minimum Field Contract For Future Real Promotion",
  "`symbol`",
  "`sessionDateLabel`",
  "`sourceStatus`",
  "`rightsStatus`",
  "These fields are not raw payloads and not candidate rows.",
  "`wire_next_no_fetch_coverage_artifact_into_public_data_readiness_status`",
  "`review_data_readiness_and_coverage_artifact_public_copy_density`",
  "`prepare_twii_terms_field_cadence_attribution_no_fetch_packet`",
  "SQL execution",
  "Supabase connection",
  "Supabase writes",
  "staging rows",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "row payload output",
  "stock-id row-list output",
  "secret output",
  "candidate row acceptance",
  "row coverage points",
  "public source promotion",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /\bfetch\(/iu,
  /\bcreateClient\(/iu,
  /@supabase\/supabase-js/iu,
  /\.from\(/iu,
  /\.insert\(/iu,
  /\.upsert\(/iu,
  /\binsert\s+into\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /publicDataSource\s*=\s*"supabase"/iu,
  /scoreSource\s*=\s*"real"/iu,
  /rawMarketDataFetch\s*=\s*true/iu,
  /supabaseWrite\s*=\s*true/iu,
  /dailyPricesMutation\s*=\s*true/iu,
  /\braw\s+payload\s+sample\b/iu,
  /\bmarket\s+row\s+sample\b/iu,
  /\bstock-id\s+row\s+list\s+included\b/iu,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} forbidden pattern: ${pattern}`);
}

let parsedPackage = {};
try {
  parsedPackage = JSON.parse(packageJson);
} catch {
  problems.push(`${packagePath} invalid JSON`);
}

if (
  parsedPackage?.scripts?.["check:a1-public-beta-next-no-fetch-coverage-artifact"] !==
  "node scripts/check-a1-public-beta-next-no-fetch-coverage-artifact.mjs"
) {
  problems.push(`${packagePath} missing check:a1-public-beta-next-no-fetch-coverage-artifact`);
}

if (!reviewGate.includes("check-a1-public-beta-next-no-fetch-coverage-artifact.mjs")) {
  problems.push(`${reviewGatePath} missing checker script reference`);
}

if (!reviewGate.includes("a1-public-beta-next-no-fetch-coverage-artifact")) {
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
        mode: "a1_public_beta_next_no_fetch_coverage_artifact",
        publicDataSource: "mock",
        scoreSource: "mock",
        scopes: ["TWII", "core ETF", "Batch 1 listed equities", "sector/industry", "derived indicators"],
        nextPmRoute: "wire_next_no_fetch_coverage_artifact_into_public_data_readiness_status",
        nextA1Route: "prepare_twii_terms_field_cadence_attribution_no_fetch_packet",
        nextA2Route: "review_data_readiness_and_coverage_artifact_public_copy_density"
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
