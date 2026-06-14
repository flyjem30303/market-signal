const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const publicRoutes = [
  "/",
  "/briefing",
  "/weekly",
  "/membership",
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy",
  "/stocks/TWII",
  "/stocks/2330",
  "/stocks/0050",
  "/stocks/006208",
  "/stocks/2382",
  "/stocks/2308"
];

const requiredPublicSignals = {
  "/": ["指數狀態儀表站", "30 秒", "3 分鐘", "示範資料", "不提供買賣建議"],
  "/briefing": ["30 秒看懂今日市場氣氛", "3 分鐘行動判斷", "示範資料", "不提供買賣建議"],
  "/weekly": ["本週市場狀態整理", "示範資料", "不提供買賣建議"],
  "/membership": ["會員功能預覽", "30 秒", "3 分鐘", "每日市場三層解讀", "自選追蹤與自訂警示", "目前不開放會員登入或付費"],
  "/methodology": ["方法說明", "正式資料尚未啟用", "不是交易指令"],
  "/disclaimer": ["風險聲明", "不是投資建議", "不要當成交易指令"],
  "/terms": ["使用條款", "資訊參考", "不是投資建議"],
  "/privacy": ["隱私與資料說明", "公開 Beta", "不要在任何表單"],
  "/stocks/TWII": ["狀態儀表", "30 秒", "3 分鐘", "示範資料", "不提供買賣建議"],
  "/stocks/2330": ["狀態儀表", "30 秒", "3 分鐘", "示範資料", "不提供買賣建議"],
  "/stocks/0050": ["狀態儀表", "30 秒", "3 分鐘", "示範資料", "不提供買賣建議"],
  "/stocks/006208": ["狀態儀表", "30 秒", "3 分鐘", "示範資料", "不提供買賣建議"],
  "/stocks/2382": ["狀態儀表", "30 秒", "3 分鐘", "示範資料", "不提供買賣建議"],
  "/stocks/2308": ["狀態儀表", "30 秒", "3 分鐘", "示範資料", "不提供買賣建議"]
};

const forbiddenVisibleFragments = [
  "cmd.exe",
  "npm run",
  "pre-launch",
  "PRE-LAUNCH",
  "hard blocker",
  "Hard Blocker",
  "HARD BLOCKER",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "dry-run",
  "packet",
  "operator",
  "commit ",
  "Git",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL",
  "daily_prices",
  "staging rows",
  "raw market data",
  "raw payload",
  "Runtime Status",
  "promotion gate",
  "real-data promotion",
  "PM ",
  "CEO ",
  "A1 ",
  "A2 ",
  "A3 ",
  "A4 ",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO"
];

const routeResults = [];

for (const route of publicRoutes) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    const visibleText = normalizeVisibleText(html);
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const mojibakeHits = findMojibakeMarkers(visibleText);
    const missingRequiredSignals = (requiredPublicSignals[route] ?? []).filter(
      (phrase) => !visibleText.includes(phrase)
    );

    routeResults.push({
      forbiddenHits,
      missingRequiredSignals,
      mojibakeHits,
      pass:
        response.status === 200 &&
        forbiddenHits.length === 0 &&
        mojibakeHits.length === 0 &&
        missingRequiredSignals.length === 0,
      route,
      status: response.status
    });
  } catch (error) {
    routeResults.push({
      error: error instanceof Error ? error.message : String(error),
      pass: false,
      route
    });
  }
}

const status = routeResults.every((result) => result.pass) ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only",
      checkedRoutes: publicRoutes.length,
      forbiddenVisibleFragments,
      routeResults,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/[\u0080-\u009f]/u.test(text)) markers.push("c1-control-character");
  if (/\?[^/?.!,，。；：、\s]{1,8}\?/u.test(text)) markers.push("question-mark-run");
  return markers;
}
