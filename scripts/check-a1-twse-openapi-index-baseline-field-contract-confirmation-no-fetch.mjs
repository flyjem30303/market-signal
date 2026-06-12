import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const docPath = "docs/A1_TWSE_OPENAPI_INDEX_BASELINE_FIELD_CONTRACT_CONFIRMATION_NO_FETCH.md";
const problems = [];

const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const doc = readText(docPath);

if (
  pkg.scripts?.["check:a1-twse-openapi-index-baseline-field-contract-confirmation-no-fetch"] !==
  "node scripts/check-a1-twse-openapi-index-baseline-field-contract-confirmation-no-fetch.mjs"
) {
  problems.push(`${packagePath} missing check:a1-twse-openapi-index-baseline-field-contract-confirmation-no-fetch`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-a1-twse-openapi-index-baseline-field-contract-confirmation-no-fetch.mjs",
  "a1-twse-openapi-index-baseline-field-contract-confirmation-no-fetch"
]);

requireIncludes("field contract packet", doc, [
  "Status: `a1_twse_openapi_index_baseline_field_contract_confirmation_ready_local_only`",
  "index_baseline",
  "listed_equity_batch1",
  "Required Normalized Fields",
  "`trade_date`",
  "`close_value`",
  "`instrument_code`",
  "`instrument_name`",
  "Optional Field Handling",
  "Missing Session And Revision Policy",
  "Batch 1 Listed-Equity Planning Rules",
  "PM-Usable Runtime Handoff",
  "A2 Public Copy Guard Notes",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "Do not fetch TWSE OpenAPI market rows",
  "Do not run SQL",
  "Do not connect to Supabase",
  "Do not modify `daily_prices`",
  "Do not output stock-id row lists",
  "Do not claim public Beta coverage is complete",
  "prepare_index_baseline_synthetic_contract_cases_no_fetch",
  "prepare_batch1_listed_equity_symbol_policy_no_row_list"
]);

requireExcludes("field contract packet", doc, [
  "publicDataSource=supabase",
  "scoreSource=real",
  "SQL execution approved",
  "Supabase write approved",
  "raw market data approved",
  "field contract is executable now",
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
      summary:
        "A1 TWSE OpenAPI index baseline and Batch 1 listed-equity field contract confirmation packet is local-only, no-fetch, and PM-usable."
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
