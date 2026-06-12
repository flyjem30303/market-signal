import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const componentPath = "src/components/public-beta-route-consistency-panel.tsx";
const modulePath = "src/lib/public-beta-route-consistency.ts";
const cssPath = "src/app/globals.css";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const problems = [];
const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const dashboard = readText(dashboardPath);
const briefing = readText(briefingPath);
const component = readText(componentPath);
const moduleSource = readText(modulePath);
const css = readText(cssPath);

if (pkg.scripts?.["check:public-beta-route-consistency"] !== "node scripts/check-public-beta-route-consistency.mjs") {
  problems.push(`${packagePath} missing check:public-beta-route-consistency`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-public-beta-route-consistency.mjs",
  "public-beta-route-consistency"
]);

requireIncludes("dashboard", dashboard, [
  "PublicBetaRouteConsistencyPanel",
  '<PublicBetaRouteConsistencyPanel context="home"',
  '<PublicBetaRouteConsistencyPanel context="stock"'
]);

requireIncludes("briefing", briefing, [
  "PublicBetaRouteConsistencyPanel",
  '<PublicBetaRouteConsistencyPanel context="briefing"'
]);

requireIncludes("component", component, [
  "公開 Beta 閱讀路徑",
  "Public Beta route consistency",
  "public-beta-route-consistency__steps",
  "public-beta-route-consistency__boundary",
  "資料來源與覆蓋",
  "候選確認中",
  "下一個資料關卡",
  "先補來源與欄位，不升級正式資料",
  "公開邊界",
  "publicDataSource=",
  "scoreSource="
]);

requireIncludes("module", moduleSource, [
  "getPublicBetaRouteConsistency",
  "首頁、晨報、標的頁共用同一套判讀順序",
  "從市場到標的，保持同一條閱讀路徑",
  "30 秒看懂市場氛圍、核心指標與警示清單",
  "3 分鐘拆成因、更新時間、影響級別與下一步",
  "資料來源與覆蓋率仍在候選確認階段",
  "下一步只會先補官方候選來源的條款位置",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "不宣稱即時真實資料"
]);

requireIncludes("css", css, [
  ".public-beta-route-consistency",
  ".public-beta-route-consistency__steps",
  ".public-beta-route-consistency__boundary",
  ".public-beta-route-consistency__step"
]);

for (const [label, source] of [
  ["component", component],
  ["module", moduleSource],
  ["dashboard", dashboard],
  ["briefing", briefing]
]) {
  requireExcludes(label, source, forbiddenRuntimePhrases());
}
requireExcludes("component", component, mojibakeMarkers());
requireExcludes("module", moduleSource, mojibakeMarkers());

const routeResults = await Promise.all(["/", "/briefing", "/stocks/2330"].map(checkRoute));

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
        "Home, briefing, and stock detail share the same readable public Beta path, source coverage state, and mock-only boundary."
    },
    null,
    2
  )
);

async function checkRoute(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const required = [
    "公開 Beta 閱讀路徑",
    "首頁：市場總覽",
    "晨報：行動判斷",
    "資料來源與覆蓋",
    "候選確認中",
    "下一個資料關卡",
    "先補來源與欄位，不升級正式資料",
    "公開邊界",
    "publicDataSource=mock",
    "scoreSource=mock",
    "不宣稱即時真實資料",
    "不提供買賣建議"
  ];
  const forbidden = [
    ...mojibakeMarkers(),
    "publicDataSource=supabase approved",
    "scoreSource=real approved",
    "SQL execution is approved",
    "Supabase writes are approved",
    "raw market data fetch is approved"
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

function mojibakeMarkers() {
  return ["嚗", "銝", "蝚", "甇", "摰", "閬", "隤", "蝷", "霅", "璅"];
}
