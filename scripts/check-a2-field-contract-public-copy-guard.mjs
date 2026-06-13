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
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "investment advice",
  "accept_a2_field_contract_public_copy_guard_for_source_coverage_runtime"
]);

requireIncludes("runtime labels", moduleSource, [
  "指數欄位契約",
  "ETF 價格欄位契約",
  "個股欄位契約",
  "指數資料至少需要交易日、收盤值、來源識別與更新時間",
  "個股資料先聚焦每日收盤與交易資訊",
  "資料來源與覆蓋率"
]);

requireIncludes("runtime component", component, [
  "public-beta-source-coverage-runtime__field-contracts",
  "欄位契約",
  "公開資料來源",
  "分數來源"
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
  for (const marker of findMojibakeMarkers(source)) {
    problems.push(`${label} exposes ${marker}`);
  }
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

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
