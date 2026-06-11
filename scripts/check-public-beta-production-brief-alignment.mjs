const baseUrl = (process.env.PUBLIC_BETA_PRODUCTION_URL ?? "https://market-signal-two.vercel.app").replace(/\/+$/u, "");

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
  "readonly-attempt",
  "post-run",
  "preflight",
  "operator",
  "Allowed:",
  "Next gate:",
  "PM ",
  "CEO"
];

const routes = [
  {
    path: "/",
    required: [
      "指數狀態儀表站",
      "30 秒可讀",
      "3 分鐘可行動",
      "核心指標快讀",
      "市場氣氛",
      "風險熱度",
      "資料可信度",
      "警示清單",
      "資料覆蓋率展開計畫",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  },
  {
    path: "/briefing",
    required: [
      "市場訊號晨報",
      "警示清單",
      "成因",
      "更新時間",
      "影響級別",
      "下一步",
      "關注",
      "加強觀察",
      "減少風險",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  },
  {
    path: "/weekly",
    required: [
      "公開 Beta 週報",
      "週報資料覆蓋率仍在補齊中",
      "本頁使用示範資料與示範分數",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]
  }
];

const routeResults = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route.path}`, { redirect: "follow" });
  const html = await response.text();
  const visibleText = normalizeVisibleText(html);
  const missing = route.required.filter((phrase) => !visibleText.includes(phrase));
  const forbidden = forbiddenVisibleText.filter((phrase) => visibleText.includes(phrase));
  routeResults.push({
    path: route.path,
    status: response.status,
    ok: response.status === 200 && missing.length === 0 && forbidden.length === 0,
    missing,
    forbidden
  });
}

const ok = routeResults.every((result) => result.ok);

console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  mode: "public_beta_production_brief_alignment",
  baseUrl,
  routes: routeResults,
  boundaries: {
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    rawMarketDataFetched: false,
    publicDataSource: "mock",
    scoreSource: "mock"
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
