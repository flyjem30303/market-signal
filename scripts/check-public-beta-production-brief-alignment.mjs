const baseUrl = (
  process.env.PUBLIC_BETA_PRODUCTION_URL ??
  process.env.LOCALHOST_BASE_URL ??
  "http://localhost:3000"
).replace(/\/+$/u, "");

const forbiddenVisibleText = [
  "Runtime promotion",
  "Coverage Rollout Plan",
  "Coverage sufficiency",
  "Trust and legal disclosure",
  "Public Beta pre-launch executable state",
  "Current hard blockers",
  "Remaining hard blockers",
  "External reply dry-run intake",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "cmd.exe",
  "npm run",
  "readonly-attempt",
  "post-run",
  "preflight",
  "operator",
  "Allowed:",
  "Next gate:",
  "Readonly result",
  "Freshness metadata",
  "Source depth",
  "Runtime consistency",
  "Readonly state",
  "Data and legal readiness",
  "readiness evidence",
  "PM ",
  "CEO ",
  "A1 ",
  "A2 ",
  "A3 ",
  "A4 ",
  "publicDataSource",
  "scoreSource",
  "Supabase",
  "SQL",
  "daily_prices",
  "staging rows",
  "raw market data",
  "raw payload"
];

const stockSignalRequired = [
  "公開 Beta 狀態",
  "標的快速判讀",
  "30 秒快速閱讀",
  "30 秒看懂標的狀態",
  "3 分鐘複核風險",
  "資料時間",
  "資料邊界",
  "決策輔助摘要",
  "下一步觀察",
  "示範資料",
  "示範分數",
  "不提供買賣建議"
];

const routes = [
  {
    path: "/",
    required: [
      "指數狀態儀表站",
      "30 秒內看懂市場氛圍",
      "3 分鐘內判斷",
      "全市場總覽",
      "首頁快速判讀",
      "先看市場氣氛，再看風險，再決定下一步觀察",
      "30 秒看懂",
      "3 分鐘複核",
      "核心指標面板",
      "核心指標快讀",
      "警示提醒",
      "資料信任",
      "示範資料",
      "不是投資建議"
    ]
  },
  {
    path: "/briefing",
    required: [
      "每日市場晨報",
      "市場晨報",
      "晨報快速判讀",
      "30 秒看懂今日市場氣氛",
      "3 分鐘再決定觀察順序",
      "資料更新時間",
      "3 分鐘行動判斷",
      "今日市場提醒",
      "市場行動摘要",
      "下一步觀察",
      "示範資料",
      "不提供買賣建議"
    ]
  },
  {
    path: "/weekly",
    required: [
      "市場週報",
      "30 秒",
      "週報行動摘要",
      "示範資料",
      "示範分數",
      "非投資建議",
      "不提供買賣建議"
    ]
  },
  {
    path: "/membership",
    required: [
      "會員功能預覽",
      "每日市場三層解讀",
      "自選追蹤與自訂警示",
      "盤後複盤報告",
      "尚未開放登入",
      "不提供個股買賣建議"
    ]
  },
  {
    path: "/stocks/2330",
    required: stockSignalRequired
  },
  {
    path: "/stocks/TWII",
    required: stockSignalRequired
  },
  {
    path: "/stocks/0050",
    required: stockSignalRequired
  },
  {
    path: "/stocks/006208",
    required: stockSignalRequired
  },
  {
    path: "/stocks/2382",
    required: stockSignalRequired
  },
  {
    path: "/stocks/2308",
    required: stockSignalRequired
  }
];

const routeResults = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route.path}`, { redirect: "follow" });
  const html = await response.text();
  const visibleText = normalizeVisibleText(html);
  const missing = route.required.filter((phrase) => !visibleText.includes(phrase));
  const forbidden = forbiddenVisibleText.filter((phrase) => visibleText.includes(phrase));
  const mojibake = findBadEncodingMarkers(visibleText);

  routeResults.push({
    path: route.path,
    status: response.status,
    ok: response.status === 200 && missing.length === 0 && forbidden.length === 0 && mojibake.length === 0,
    missing,
    forbidden,
    mojibake
  });
}

const ok = routeResults.every((result) => result.ok);

console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  mode: "public_beta_production_brief_alignment",
  baseUrl,
  checkedRoutes: routes.length,
  routes: routeResults,
  boundaries: {
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    rawMarketDataFetched: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    visibleInternalRuntimeTokens: false
  }
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/giu, " ")
    .replace(/<style[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function findBadEncodingMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-character");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/[?]{4,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
