import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const modulePath = "src/lib/public-beta-source-coverage-runtime-labels.ts";
const componentPath = "src/components/public-beta-source-coverage-runtime-labels-panel.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const problems = [];

const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const moduleSource = readText(modulePath);
const component = readText(componentPath);
const dashboard = readText(dashboardPath);
const briefing = readText(briefingPath);
const css = readText(cssPath);

if (
  pkg.scripts?.["check:public-beta-source-coverage-runtime-labels"] !==
  "node scripts/check-public-beta-source-coverage-runtime-labels.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-source-coverage-runtime-labels`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-public-beta-source-coverage-runtime-labels.mjs",
  "public-beta-source-coverage-runtime-labels"
]);

requireIncludes("module", moduleSource, [
  "getPublicBetaSourceCoverageRuntimeLabels",
  "資料來源與覆蓋狀態",
  "正式市場資料、來源權利、覆蓋品質與更新節奏仍在檢查",
  "大盤基準",
  "核心 ETF",
  "上市個股批次",
  "先看資料狀態",
  "再看覆蓋缺口",
  "最後決定觀察方向",
  "正式資料上線前，不宣稱即時真實資料",
  'publicDataSource: "mock"',
  'scoreSource: "mock"'
]);

requireIncludes("component", component, [
  "PublicBetaSourceCoverageRuntimeLabelsPanel",
  "Public Beta source coverage runtime labels",
  "Source & Coverage",
  "展示可用",
  "檢查中",
  "暫停公開",
  "public-beta-source-coverage-runtime__layers",
  "public-beta-source-coverage-runtime__actions",
  "public-beta-source-coverage-runtime__boundary",
  "publicDataSource=",
  "scoreSource="
]);

requireIncludes("dashboard", dashboard, [
  "PublicBetaSourceCoverageRuntimeLabelsPanel",
  '<PublicBetaSourceCoverageRuntimeLabelsPanel context="home"',
  '<PublicBetaSourceCoverageRuntimeLabelsPanel context="stock"'
]);

requireIncludes("briefing", briefing, [
  "PublicBetaSourceCoverageRuntimeLabelsPanel",
  '<PublicBetaSourceCoverageRuntimeLabelsPanel context="briefing"'
]);

requireIncludes("css", css, [
  ".public-beta-source-coverage-runtime",
  ".public-beta-source-coverage-runtime__layers",
  ".public-beta-source-coverage-runtime__actions",
  ".public-beta-source-coverage-runtime__boundary"
]);

for (const [label, source] of [
  ["module", moduleSource],
  ["component", component],
  ["dashboard", dashboard],
  ["briefing", briefing]
]) {
  requireExcludes(label, source, forbiddenRuntimePhrases());
}

const routeResults = await Promise.all(
  ["/", "/briefing", "/stocks/TWII", "/stocks/2330", "/stocks/0050", "/stocks/006208", "/stocks/2382", "/stocks/2308"].map(
    checkRoute
  )
);

if (problems.length) {
  console.error(JSON.stringify({ problems, routeResults, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      routeResults,
      status: "ok",
      summary:
        "Public routes expose source and coverage runtime labels in mock-only reader-facing language without real-data promotion."
    },
    null,
    2
  )
);

async function checkRoute(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const required = [
    "Source &amp; Coverage",
    "資料來源與覆蓋狀態",
    "大盤基準",
    "核心 ETF",
    "上市個股批次",
    "展示可用",
    "檢查中",
    "暫停公開",
    "先看資料狀態",
    "再看覆蓋缺口",
    "最後決定觀察方向",
    "publicDataSource=mock",
    "scoreSource=mock",
    "不宣稱即時真實資料",
    "不提供買賣建議"
  ];
  const forbidden = [
    "publicDataSource=supabase approved",
    "scoreSource=real approved",
    "SQL execution is approved",
    "Supabase writes are approved",
    "raw market data fetch is approved",
    "正式資料已上線",
    "完整覆蓋已完成"
  ];
  const missing = required.filter((token) => !html.includes(token));
  const blocked = forbidden.filter((token) => html.includes(token));

  if (response.status !== 200) problems.push(`${path} returned ${response.status}`);
  for (const token of missing) problems.push(`${path} missing ${token}`);
  for (const token of blocked) problems.push(`${path} exposes ${token}`);

  return {
    blocked,
    missing,
    pass: response.status === 200 && missing.length === 0 && blocked.length === 0,
    path,
    status: response.status
  };
}

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

function forbiddenRuntimePhrases() {
  return [
    'publicDataSource: "supabase"',
    'scoreSource: "real"',
    "rawMarketDataFetch: true",
    "sqlExecution: true",
    "supabaseWrite: true",
    "dailyPricesMutation: true"
  ];
}
