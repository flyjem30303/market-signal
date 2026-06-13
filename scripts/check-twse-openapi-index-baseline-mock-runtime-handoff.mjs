import fs from "node:fs";

const modulePath = "src/lib/twse-openapi-index-baseline-mock-runtime-handoff.ts";
const fixturePath = "src/lib/twse-openapi-index-baseline-synthetic-fixture.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const source = readText(modulePath);
const fixture = readText(fixturePath);
const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);

if (
  pkg.scripts?.["check:twse-openapi-index-baseline-mock-runtime-handoff"] !==
  "node scripts/check-twse-openapi-index-baseline-mock-runtime-handoff.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-index-baseline-mock-runtime-handoff`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-twse-openapi-index-baseline-mock-runtime-handoff.mjs",
  "twse-openapi-index-baseline-mock-runtime-handoff"
]);

requireIncludes("handoff module", source, [
  "TWSE_OPENAPI_INDEX_BASELINE_MOCK_RUNTIME_HANDOFF_BOUNDARY",
  "twse_openapi_index_baseline_mock_runtime_handoff_ready_no_fetch",
  "index_baseline_synthetic_fixture_handoff_only",
  "index_baseline_mock_runtime_handoff_review_then_public_label_integration",
  'publicDataSource: "mock"',
  'scoreSource: "mock"',
  "rawMarketDataFetch: false",
  "sqlExecution: false",
  "supabaseWrite: false",
  "getTwseOpenApiIndexBaselineMockRuntimeHandoff",
  "可示範",
  "暫停公開",
  "政策待確認",
  "thirtySecondMood",
  "threeMinuteAction",
  "mockOnly=true"
]);

requireIncludes("fixture module", fixture, [
  "runTwseOpenApiIndexBaselineSyntheticFixture",
  "twse_openapi_index_baseline_synthetic_parser_fixture_ready_no_fetch",
  "index_valid_date_close",
  "index_missing_close",
  "index_duplicate_trade_date",
  "index_revision_warning",
  "index_timezone_session_gap"
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

for (const marker of findMojibakeMarkers(source)) {
  problems.push(`${modulePath} exposes ${marker}`);
}

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
      summary: "Index-baseline mock runtime handoff is local-only, no-fetch, and ready for public label integration planning."
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

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
