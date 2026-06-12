import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const docPath = "docs/A1_INDEX_BASELINE_SYNTHETIC_CONTRACT_CASES_NO_FETCH.md";
const problems = [];

const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const doc = readText(docPath);

if (
  pkg.scripts?.["check:a1-index-baseline-synthetic-contract-cases-no-fetch"] !==
  "node scripts/check-a1-index-baseline-synthetic-contract-cases-no-fetch.mjs"
) {
  problems.push(`${packagePath} missing check:a1-index-baseline-synthetic-contract-cases-no-fetch`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-a1-index-baseline-synthetic-contract-cases-no-fetch.mjs",
  "a1-index-baseline-synthetic-contract-cases-no-fetch"
]);

requireIncludes("A1 synthetic cases", doc, [
  "Status: `a1_index_baseline_synthetic_contract_cases_ready_no_fetch`",
  "index_valid_date_close",
  "index_missing_close",
  "index_duplicate_trade_date",
  "index_missing_optional_fields",
  "index_revision_warning",
  "index_timezone_session_gap",
  "`trade_date`",
  "`close_value`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "rawMarketDataFetch=false",
  "supabaseConnectionAttempted=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "fetch TWSE OpenAPI market rows",
  "run SQL",
  "connect to Supabase",
  "modify `daily_prices`",
  "output stock-id row lists",
  "prepare_index_baseline_synthetic_parser_fixture_no_fetch"
]);

requireExcludes("A1 synthetic cases", doc, [
  "publicDataSource=supabase",
  "scoreSource=real",
  "SQL execution approved",
  "Supabase write approved",
  "raw market data approved",
  "live candidate artifact approved",
  "coverage is complete now"
]);

if (problems.length) {
  console.error(JSON.stringify({ docPath, problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      docPath,
      publicDataSource: "mock",
      scoreSource: "mock",
      status: "ok",
      summary: "A1 index-baseline synthetic contract cases are no-fetch, local-only, and PM-usable."
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
