import fs from "node:fs";

const modulePath = "src/lib/etf-market-price-mock-runtime-handoff.ts";
const fixturePath = "src/lib/etf-market-price-synthetic-fixture.ts";
const statusPath = "PROJECT_STATUS.md";
const pmGoalPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const source = readText(modulePath);
const fixture = readText(fixturePath);
const status = readText(statusPath);
const pmGoal = readText(pmGoalPath);
const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);

if (
  pkg.scripts?.["check:etf-market-price-mock-runtime-handoff"] !==
  "node scripts/check-etf-market-price-mock-runtime-handoff.mjs"
) {
  problems.push(`${packagePath} missing check:etf-market-price-mock-runtime-handoff`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-etf-market-price-mock-runtime-handoff.mjs",
  "etf-market-price-mock-runtime-handoff"
]);

requireIncludes("handoff module", source, [
  "ETF_MARKET_PRICE_MOCK_RUNTIME_HANDOFF_BOUNDARY",
  "etf_market_price_mock_runtime_handoff_ready_no_fetch",
  "etf_market_price_synthetic_fixture_handoff_only",
  "etf_market_price_mock_runtime_handoff_review_then_public_label_integration",
  'publicDataSource: "mock"',
  'scoreSource: "mock"',
  "rawMarketDataFetch: false",
  "sqlExecution: false",
  "supabaseWrite: false",
  "getEtfMarketPriceMockRuntimeHandoff",
  "可示範",
  "暫停公開",
  "政策待確認",
  "thirtySecondMood",
  "threeMinuteAction",
  "mockOnly=true",
  "ETF 市價線目前只能輔助理解 0050、006208 的市場脈絡",
  "使用者可以把 ETF 卡片當作市場 proxy 的觀察入口"
]);

requireIncludes("fixture module", fixture, [
  "runEtfMarketPriceSyntheticFixture",
  "etf_market_price_synthetic_fixture_ready_no_fetch",
  "etf_valid_market_price",
  "etf_missing_close_price",
  "etf_out_of_scope_symbol",
  "etf_duplicate_session",
  "etf_optional_activity_missing",
  "etf_forbidden_nav_field"
]);

requireIncludes("project status", status, [
  "Latest BRIEF ETF mock runtime handoff slice",
  "etf_market_price_mock_runtime_handoff_ready_no_fetch",
  "etf_market_price_mock_runtime_handoff_review_then_public_label_integration"
]);

requireIncludes("PM goal", pmGoal, [
  "etf_market_price_mock_runtime_handoff_ready_no_fetch",
  "etf_market_price_mock_runtime_handoff_review_then_public_label_integration"
]);

for (const [label, text] of [
  ["handoff module", source],
  ["fixture module", fixture]
]) {
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
  if (/\bfetch\s*\(/u.test(text)) problems.push(`${label} must not call fetch`);
}

requireNoMojibake("handoff module", source);

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
      summary: "ETF market-price mock runtime handoff is local-only, no-fetch, and ready for public label integration planning."
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
