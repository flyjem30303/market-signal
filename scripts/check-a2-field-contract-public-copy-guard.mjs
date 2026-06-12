import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const docPath = "docs/A2_FIELD_CONTRACT_PUBLIC_COPY_GUARD.md";
const modulePath = "src/lib/public-beta-source-coverage-runtime-labels.ts";
const componentPath = "src/components/public-beta-source-coverage-runtime-labels-panel.tsx";
const problems = [];

const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const doc = readText(docPath);
const moduleSource = readText(modulePath);
const component = readText(componentPath);

if (
  pkg.scripts?.["check:a2-field-contract-public-copy-guard"] !==
  "node scripts/check-a2-field-contract-public-copy-guard.mjs"
) {
  problems.push(`${packagePath} missing check:a2-field-contract-public-copy-guard`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-a2-field-contract-public-copy-guard.mjs",
  "a2-field-contract-public-copy-guard"
]);

requireIncludes("A2 copy guard", doc, [
  "Status: `a2_field_contract_public_copy_guard_ready`",
  "欄位對照仍在檢查",
  "大盤欄位對照",
  "上市個股欄位對照",
  "日期、收盤值與缺漏交易日規則仍在確認",
  "標的代碼、標的名稱、收盤價、成交量與成交金額仍在確認",
  "正式資料上線前只做示範閱讀",
  "不是即時行情",
  "不是投資建議",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "accept_a2_field_contract_public_copy_guard_for_source_coverage_runtime"
]);

requireIncludes("runtime labels", moduleSource, [
  "欄位對照仍在檢查",
  "大盤欄位對照",
  "上市個股欄位對照",
  "日期、收盤值與缺漏交易日規則仍在確認",
  "標的代碼、標的名稱、收盤價、成交量與成交金額仍在確認"
]);

requireIncludes("runtime component", component, [
  "public-beta-source-coverage-runtime__field-contracts",
  "Source field contract status"
]);

for (const [label, source] of [
  ["A2 copy guard", doc],
  ["runtime labels", moduleSource],
  ["runtime component", component]
]) {
  requireExcludes(label, source, [
    "publicDataSource=supabase approved",
    "scoreSource=real approved",
    "SQL execution approved",
    "Supabase write approved",
    "raw market data approved",
    "complete coverage approved",
    "buy now",
    "sell now",
    "guaranteed return approved"
  ]);
}

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
      summary: "A2 field-contract public copy guard preserves reader-facing mock-only non-advice wording."
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
    if (text.includes(needle)) problems.push(`${label} must not expose ${needle}`);
  }
}
