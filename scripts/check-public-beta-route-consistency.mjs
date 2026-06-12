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
  "Public Beta Reading Path",
  "public-beta-route-consistency__steps",
  "public-beta-route-consistency__boundary",
  "資料來源",
  "候選來源仍在確認",
  "資料升級條件未通過",
  "公開邊界",
  "publicDataSource=",
  "scoreSource="
]);

requireIncludes("module", moduleSource, [
  "getPublicBetaRouteConsistency",
  "從首頁總覽到 briefing，再到標的頁",
  "把標的訊號放回市場脈絡中判讀",
  "首頁：看市場溫度",
  "Briefing：看原因與行動",
  "看標的細節",
  "目前仍是 mock-only 公開 Beta",
  "不是即時真實資料",
  "不提供買賣建議",
  'publicDataSource: "mock"',
  'scoreSource: "mock"'
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
requireNoMojibake("component", component);
requireNoMojibake("module", moduleSource);

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
        "Home, briefing, and stock detail expose the same reader-facing public Beta path and mock-only boundary."
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
    "Public Beta Reading Path",
    "首頁：看市場溫度",
    "Briefing：看原因與行動",
    "資料升級條件未通過",
    "公開邊界",
    "publicDataSource=mock",
    "scoreSource=mock",
    "不是即時真實資料",
    "不提供買賣建議"
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
    .replace(/\s+/g, " ")
    .trim();
}
