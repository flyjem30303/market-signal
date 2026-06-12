import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const docPath = "docs/A1_BATCH1_LISTED_EQUITY_SYMBOL_POLICY_NO_ROW_LIST.md";
const pmGoalPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const problems = [];

const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const doc = readText(docPath);
const pmGoal = readText(pmGoalPath);

if (
  pkg.scripts?.["check:a1-batch1-listed-equity-symbol-policy-no-row-list"] !==
  "node scripts/check-a1-batch1-listed-equity-symbol-policy-no-row-list.mjs"
) {
  problems.push(`${packagePath} missing check:a1-batch1-listed-equity-symbol-policy-no-row-list`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-a1-batch1-listed-equity-symbol-policy-no-row-list.mjs",
  "a1-batch1-listed-equity-symbol-policy-no-row-list"
]);

requireIncludes("Batch 1 policy", doc, [
  "Status: `a1_batch1_listed_equity_symbol_policy_ready_no_row_list`",
  "batch1_listed_equity_symbol_policy_no_fetch_no_row_list",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "rawMarketDataFetch=false",
  "supabaseConnectionAttempted=false",
  "dailyPricesMutated=false",
  "candidateRowsAccepted=false",
  "Product visibility",
  "Market relevance",
  "Sector balance",
  "Field clarity",
  "Public Beta safety",
  "`2330`",
  "`2382`",
  "`2308`",
  "No-Row-List Rule",
  "full listed-company universe",
  "raw stock-id row lists",
  "Batch 1 is listed equity only",
  "`0050`",
  "`006208`",
  "`TWII`",
  "`上市個股批次：展示可用`",
  "`第一批示範標的`",
  "`不是完整上市股票覆蓋`",
  "accept_a1_batch1_listed_equity_symbol_policy_no_row_list_for_public_beta_batch_planning",
  "prepare_batch1_listed_equity_mock_runtime_policy_labels"
]);

requireIncludes("PM goal", pmGoal, [
  "docs/A1_BATCH1_LISTED_EQUITY_SYMBOL_POLICY_NO_ROW_LIST.md",
  "prepare_batch1_listed_equity_mock_runtime_policy_labels"
]);

requireExcludes("Batch 1 policy", doc, [
  "publicDataSource=supabase",
  "scoreSource=real",
  "SQL execution approved",
  "Supabase write approved",
  "raw market data approved",
  "full listed-equity coverage approved",
  "live quotes approved",
  "buy now",
  "sell now",
  "guaranteed return approved"
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
      summary: "A1 Batch 1 listed-equity symbol policy is no-fetch, no-row-list, and PM-usable."
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
