import fs from "node:fs";

const modulePath = "src/lib/twse-openapi-index-baseline-synthetic-fixture.ts";
const parserPath = "src/lib/twse-openapi-parser-contract.ts";
const a1Path = "docs/A1_INDEX_BASELINE_SYNTHETIC_CONTRACT_CASES_NO_FETCH.md";
const statusPath = "PROJECT_STATUS.md";
const pmGoalPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const source = readText(modulePath);
const parser = readText(parserPath);
const a1 = readText(a1Path);
const status = readText(statusPath);
const pmGoal = readText(pmGoalPath);
const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);

if (
  pkg.scripts?.["check:twse-openapi-index-baseline-synthetic-parser-fixture"] !==
  "node scripts/check-twse-openapi-index-baseline-synthetic-parser-fixture.mjs"
) {
  problems.push(`${packagePath} missing check:twse-openapi-index-baseline-synthetic-parser-fixture`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-twse-openapi-index-baseline-synthetic-parser-fixture.mjs",
  "twse-openapi-index-baseline-synthetic-parser-fixture"
]);

requireIncludes("fixture module", source, [
  "TWSE_OPENAPI_INDEX_BASELINE_SYNTHETIC_FIXTURE_BOUNDARY",
  "twse_openapi_index_baseline_synthetic_parser_fixture_ready_no_fetch",
  "index_baseline_synthetic_rows_only",
  "twse_openapi_index_baseline_synthetic_parser_fixture_review_then_mock_runtime_handoff",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "rawMarketDataFetch: false",
  "sqlExecution: false",
  "supabaseWrite: false",
  "index_valid_date_close",
  "index_missing_close",
  "index_duplicate_trade_date",
  "index_missing_optional_fields",
  "index_revision_warning",
  "index_timezone_session_gap",
  "runTwseOpenApiIndexBaselineSyntheticFixture",
  "parseTwseOpenApiSyntheticRows(\"twiiIndexHistory\"",
  "revision_policy_required_before_replacement",
  "session_gap_policy_required_before_real_promotion",
  "statusMatchesExpectation"
]);

requireIncludes("parser contract", parser, [
  "parseTwseOpenApiSyntheticRows",
  "twiiIndexHistory",
  "duplicate_dates",
  "missing_required_field",
  "fixturePolicy: \"synthetic_rows_only\""
]);

requireIncludes("A1 cases doc", a1, [
  "Status: `a1_index_baseline_synthetic_contract_cases_ready_no_fetch`",
  "prepare_index_baseline_synthetic_parser_fixture_no_fetch",
  "index_revision_warning",
  "index_timezone_session_gap"
]);

requireIncludes("project status", status, [
  "Latest BRIEF index-baseline synthetic parser fixture slice",
  "twse_openapi_index_baseline_synthetic_parser_fixture_ready_no_fetch",
  "prepare_index_baseline_synthetic_parser_fixture_no_fetch"
]);

requireIncludes("PM goal", pmGoal, [
  "prepare_index_baseline_synthetic_parser_fixture_no_fetch",
  "twse_openapi_index_baseline_synthetic_parser_fixture_ready_no_fetch"
]);

for (const [label, text] of [
  ["fixture module", source],
  ["parser contract", parser]
]) {
  requireExcludes(label, text, [
    "publicDataSource: \"supabase\"",
    "scoreSource: \"real\"",
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
      summary: "Index-baseline synthetic parser fixture is no-fetch, local-only, and ready for mock runtime handoff planning."
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
