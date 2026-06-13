import fs from "node:fs";

const modulePath = "src/lib/etf-market-price-synthetic-fixture.ts";
const fieldContractPath = "docs/A1_ETF_MARKET_PRICE_FIELD_CONTRACT_NO_FETCH.md";
const statusPath = "PROJECT_STATUS.md";
const pmGoalPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const source = readText(modulePath);
const fieldContract = readText(fieldContractPath);
const status = readText(statusPath);
const pmGoal = readText(pmGoalPath);
const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);

if (
  pkg.scripts?.["check:etf-market-price-synthetic-fixture"] !==
  "node scripts/check-etf-market-price-synthetic-fixture.mjs"
) {
  problems.push(`${packagePath} missing check:etf-market-price-synthetic-fixture`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-etf-market-price-synthetic-fixture.mjs",
  "etf-market-price-synthetic-fixture"
]);

requireIncludes("fixture module", source, [
  "ETF_MARKET_PRICE_SYNTHETIC_FIXTURE_BOUNDARY",
  "etf_market_price_synthetic_fixture_ready_no_fetch",
  "etf_market_price_synthetic_rows_only_no_fetch",
  "etf_market_price_synthetic_fixture_review_then_mock_runtime_handoff",
  'publicDataSource: "mock"',
  'scoreSource: "mock"',
  "rawMarketDataFetch: false",
  "sqlExecution: false",
  "supabaseWrite: false",
  "etf_valid_market_price",
  "etf_missing_close_price",
  "etf_out_of_scope_symbol",
  "etf_duplicate_session",
  "etf_optional_activity_missing",
  "etf_forbidden_nav_field",
  "runEtfMarketPriceSyntheticFixture",
  "parseEtfMarketPriceSyntheticRows",
  "activity_context_unavailable",
  "forbiddenNavValue",
  "statusMatchesExpectation",
  "synthetic_fixture_only",
  "synthetic-fixture-no-fetch",
  "ETF 市價欄位形狀可支撐 mock runtime",
  "缺少收盤價",
  "0050 與 006208",
  "同一 ETF 同一交易日重複",
  "NAV 不屬於 ETF 市價線"
]);

requireIncludes("field contract", fieldContract, [
  "Status: `a1_etf_market_price_field_contract_no_fetch_ready`",
  "`prepare_etf_market_price_synthetic_fixture_no_fetch`",
  "`prepare_etf_market_price_synthetic_contract_cases_no_fetch`"
]);

requireIncludes("project status", status, [
  "Latest BRIEF ETF synthetic fixture slice",
  "etf_market_price_synthetic_fixture_ready_no_fetch",
  "prepare_etf_market_price_synthetic_fixture_no_fetch"
]);

requireIncludes("PM goal", pmGoal, [
  "etf_market_price_synthetic_fixture_ready_no_fetch",
  "prepare_etf_market_price_synthetic_fixture_no_fetch"
]);

for (const [label, text] of [["fixture module", source]]) {
  requireExcludes(label, text, [
    'publicDataSource: "supabase"',
    'scoreSource: "real"',
    "rawMarketDataFetch: true",
    "sqlExecution: true",
    "supabaseWrite: true",
    "createClient",
    "@supabase/supabase-js",
    "SUPABASE_SERVICE_ROLE_KEY",
    "process.env",
    "daily_prices"
  ]);
}

if (/\bfetch\s*\(/u.test(source)) {
  problems.push(`${modulePath} must not call fetch`);
}

requireNoMojibake("fixture module", source);

if (problems.length) {
  console.error(JSON.stringify({ modulePath, problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      modulePath,
      publicDataSource: "mock",
      scoreSource: "mock",
      status: "ok",
      summary: "ETF market-price synthetic fixture is no-fetch, local-only, and ready for mock runtime handoff planning."
    },
    null,
    2
  )
);

function readText(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}

function requireIncludes(label, text, needles) {
  for (const needle of needles) {
    if (!text.includes(needle)) problems.push(`${label} missing ${needle}`);
  }
}

function requireExcludes(label, text, needles) {
  for (const needle of needles) {
    if (text.includes(needle)) problems.push(`${label} must not include ${needle}`);
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
