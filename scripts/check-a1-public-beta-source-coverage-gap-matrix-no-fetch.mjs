import fs from "node:fs";

const docPath = "docs/A1_PUBLIC_BETA_SOURCE_COVERAGE_GAP_MATRIX_NO_FETCH.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const required = [
  "A1 Public Beta Source Coverage Gap Matrix No-Fetch",
  "Status: `a1_public_beta_source_coverage_gap_matrix_no_fetch_ready`",
  "public_beta_source_coverage_gap_matrix_without_market_row_fetch",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`index_baseline`",
  "`core_etf_context`",
  "`listed_equity_batch1`",
  "`listed_equity_full`",
  "`otc_future_expansion`",
  "`sector_industry_context`",
  "`derived_indicator_layer`",
  "`candidate`",
  "`checking`",
  "`future`",
  "`blocked`",
  "`mock_ready_real_candidate`",
  "`mock_only_blocked_for_real_display`",
  "`mock_demo_only`",
  "`not_public_ready`",
  "`mock_explanation_only`",
  "資料來源與覆蓋範圍仍在準備中",
  "目前是 mock 示範，不是即時真實資料",
  "TWII 可作為第一個市場氣氛候選來源",
  "ETF 與個股仍需分開確認來源與欄位",
  "完整上市股票覆蓋尚未開放",
  "不提供買賣建議",
  "`accept_a1_public_beta_source_coverage_gap_matrix_no_fetch`",
  "`wire_source_coverage_gap_matrix_into_public_runtime_readiness_labels`",
  "`prepare_etf_market_price_source_scope_no_fetch`",
  "`review_source_coverage_gap_matrix_public_copy_safety`",
  "SQL execution",
  "Supabase connection, read, or write",
  "`daily_prices` mutation",
  "market-row fetch, ingestion, storage, output, or commit",
  "raw payload output",
  "stock-id row-list output",
  "candidate row acceptance",
  "row coverage points",
  "source promotion",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "real-time market-data claims",
  "official endorsement claims",
  "investment advice"
];

for (const phrase of required) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
}

requireExcludes("A1 coverage gap matrix", doc, [
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
  /raw payload sample/iu,
  /market row sample/iu,
  /stock-id row list sample/iu,
  /sb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /建議買進[^`]/iu,
  /建議賣出[^`]/iu
]);

if (
  pkg.scripts?.["check:a1-public-beta-source-coverage-gap-matrix-no-fetch"] !==
  "node scripts/check-a1-public-beta-source-coverage-gap-matrix-no-fetch.mjs"
) {
  problems.push(`${packagePath} missing check:a1-public-beta-source-coverage-gap-matrix-no-fetch`);
}

for (const token of [
  "scripts/check-a1-public-beta-source-coverage-gap-matrix-no-fetch.mjs",
  "a1-public-beta-source-coverage-gap-matrix-no-fetch"
]) {
  if (!reviewGate.includes(token)) problems.push(`${reviewGatePath} missing ${token}`);
}

requireNoMojibake("A1 coverage gap matrix", doc);

if (problems.length) {
  console.error(JSON.stringify({ docPath, problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      docPath,
      lanes: [
        "index_baseline",
        "core_etf_context",
        "listed_equity_batch1",
        "listed_equity_full",
        "otc_future_expansion",
        "sector_industry_context",
        "derived_indicator_layer"
      ],
      nextA1Route: "prepare_etf_market_price_source_scope_no_fetch",
      nextA2Route: "review_source_coverage_gap_matrix_public_copy_safety",
      nextPmRoute: "wire_source_coverage_gap_matrix_into_public_runtime_readiness_labels",
      publicDataSource: "mock",
      scoreSource: "mock",
      status: "ok"
    },
    null,
    2
  )
);

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}

function requireExcludes(label, text, patterns) {
  for (const pattern of patterns) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${String(pattern)}`);
  }
}

function requireNoMojibake(label, text) {
  for (const marker of findMojibakeMarkers(text)) problems.push(`${label} exposes ${marker}`);
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
