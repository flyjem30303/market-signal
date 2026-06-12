import fs from "node:fs";

const docPath = "docs/A1_ETF_MARKET_PRICE_SOURCE_SCOPE_NO_FETCH.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const required = [
  "A1 ETF Market Price Source Scope No-Fetch",
  "Status: `a1_etf_market_price_source_scope_no_fetch_ready`",
  "etf_market_price_source_scope_without_market_row_fetch",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`0050`",
  "`006208`",
  "exchange-traded market-price fields",
  "`symbol`",
  "`displayName`",
  "`sessionDate`",
  "`closePrice`",
  "`priceChange`",
  "`changePercent`",
  "`volume`",
  "`turnover`",
  "`sourceName`",
  "`sourceUpdatedAt`",
  "`missingSessionPolicy`",
  "`revisionPolicy`",
  "NAV",
  "Holdings / constituents",
  "Premium / discount",
  "Intraday iNAV",
  "Distribution / dividend schedules",
  "Fund factsheet text",
  "ETF recommendation ranking",
  "ETF source-rights status: `checking`",
  "ETF redistribution status: `not_approved`",
  "ETF market-price field contract: `draft_only`",
  "ETF row coverage credit: `blocked`",
  "ETF runtime posture: `mock_only`",
  "ETF 市價來源範圍仍在確認中",
  "0050 與 006208 目前只是 mock 觀察範例",
  "ETF 市價、NAV、成分股與折溢價資料會分開處理",
  "ETF 區塊不提供買賣建議",
  "`accept_a1_etf_market_price_source_scope_no_fetch`",
  "`wire_etf_market_price_scope_into_public_runtime_labels`",
  "`prepare_etf_market_price_field_contract_no_fetch`",
  "`review_etf_market_price_scope_public_copy_safety`",
  "SQL execution",
  "Supabase connection, read, or write",
  "`daily_prices` mutation",
  "ETF market-row fetch, ingestion, storage, output, or commit",
  "ETF raw payload output",
  "ETF endpoint output",
  "ETF candidate row acceptance",
  "ETF row coverage points",
  "NAV display",
  "holdings display",
  "premium-discount display",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "investment advice"
];

for (const phrase of required) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing ${phrase}`);
}

requireExcludes("A1 ETF scope", doc, [
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
  /candidate row sample/iu,
  /sb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /建議買進 ETF[^`]/iu,
  /建議賣出 ETF[^`]/iu
]);

if (
  pkg.scripts?.["check:a1-etf-market-price-source-scope-no-fetch"] !==
  "node scripts/check-a1-etf-market-price-source-scope-no-fetch.mjs"
) {
  problems.push(`${packagePath} missing check:a1-etf-market-price-source-scope-no-fetch`);
}

for (const token of [
  "scripts/check-a1-etf-market-price-source-scope-no-fetch.mjs",
  "a1-etf-market-price-source-scope-no-fetch"
]) {
  if (!reviewGate.includes(token)) problems.push(`${reviewGatePath} missing ${token}`);
}

requireNoMojibake("A1 ETF scope", doc);

if (problems.length) {
  console.error(JSON.stringify({ docPath, problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      docPath,
      excludedScopes: ["NAV", "holdings", "premium-discount", "intraday iNAV", "factsheet text"],
      nextA1Route: "prepare_etf_market_price_field_contract_no_fetch",
      nextA2Route: "review_etf_market_price_scope_public_copy_safety",
      nextPmRoute: "wire_etf_market_price_scope_into_public_runtime_labels",
      publicDataSource: "mock",
      scoreSource: "mock",
      status: "ok",
      targetSymbols: ["0050", "006208"]
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
