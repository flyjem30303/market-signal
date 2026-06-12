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
  "資料來源與覆蓋範圍",
  "大盤基準",
  "核心 ETF",
  "第一批個股",
  "大盤欄位對照",
  "上市個股欄位對照",
  "第一批個股示範",
  "不宣稱全市場覆蓋",
  "資產類型分開",
  "先看資料邊界",
  "再看覆蓋範圍",
  "最後做觀察判斷",
  "來源與覆蓋率尚未通過 gate",
  "不宣稱真實資料",
  "不提供買賣建議",
  'publicDataSource: "mock"',
  'scoreSource: "mock"'
]);

requireIncludes("component", component, [
  "PublicBetaSourceCoverageRuntimeLabelsPanel",
  "Public Beta source coverage runtime labels",
  "Source & Coverage",
  "等待條件",
  "檢查中",
  "mock 示範",
  "下一步：",
  "資料來源",
  "分數來源",
  "公開邊界",
  "public-beta-source-coverage-runtime__layers",
  "public-beta-source-coverage-runtime__field-contracts",
  "public-beta-source-coverage-runtime__index-checks",
  "public-beta-source-coverage-runtime__batch1-policy",
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
  ".public-beta-source-coverage-runtime__field-contracts",
  ".public-beta-source-coverage-runtime__index-checks",
  ".public-beta-source-coverage-runtime__batch1-policy",
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
  requireNoMojibake(label, source);
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
  const text = normalizeVisibleText(html);
  const required = [
    "Source & Coverage",
    "資料來源與覆蓋範圍",
    "大盤基準",
    "核心 ETF",
    "第一批個股",
    "大盤欄位對照",
    "上市個股欄位對照",
    "第一批個股示範",
    "不宣稱全市場覆蓋",
    "資產類型分開",
    "先看資料邊界",
    "再看覆蓋範圍",
    "最後做觀察判斷",
    "publicDataSource=mock",
    "scoreSource=mock",
    "不宣稱真實資料"
  ];
  const forbidden = [
    ...forbiddenPublicOperations(),
    "publicDataSource=supabase approved",
    "scoreSource=real approved",
    "SQL execution is approved",
    "Supabase writes are approved",
    "raw market data fetch is approved"
  ];
  const missing = required.filter((token) => !text.includes(token));
  const blocked = forbidden.filter((token) => text.includes(token));
  const markers = findMojibakeMarkers(text);

  if (response.status !== 200) problems.push(`${path} returned ${response.status}`);
  for (const token of missing) problems.push(`${path} missing ${token}`);
  for (const token of blocked) problems.push(`${path} exposes ${token}`);
  for (const token of markers) problems.push(`${path} exposes ${token}`);

  return {
    blocked,
    markers,
    missing,
    pass: response.status === 200 && missing.length === 0 && blocked.length === 0 && markers.length === 0,
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

function requireNoMojibake(label, text) {
  for (const marker of findMojibakeMarkers(text)) problems.push(`${label} exposes ${marker}`);
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

function forbiddenPublicOperations() {
  return [
    "Current hard blockers",
    "Remaining hard blockers",
    "External reply dry-run intake",
    "BETA_HOSTING_PROJECT_NAME",
    "BETA_TEMPORARY_URL",
    "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
    "cmd.exe /c npm run",
    "readonly-attempt",
    "post-run",
    "preflight",
    "packet"
  ];
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
