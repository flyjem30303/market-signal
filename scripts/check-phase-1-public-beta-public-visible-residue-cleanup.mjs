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
  "/": ["指數狀態儀表站", "30 秒", "3 分鐘", "示範資料", "非投資建議"],
  "/briefing": ["市場簡報", "30 秒看市場氣氛", "3 分鐘", "示範資料", "風險聲明"],
  "/weekly": ["週報", "示範資料", "非投資建議"],
  "/membership": ["會員功能預覽", "每日市場三層解讀", "自選追蹤", "盤後複盤"],
  "/methodology": ["方法說明", "資料狀態", "非投資建議"],
  "/disclaimer": ["風險聲明", "不是投資建議", "不保證"],
  "/terms": ["使用條款", "資料", "不提供"],
  "/privacy": ["隱私", "公開 Beta", "敏感資料"],
  "/stocks/TWII": ["標的快速判讀", "30 秒", "3 分鐘", "示範資料", "非投資建議"],
  "/stocks/2330": ["標的快速判讀", "30 秒", "3 分鐘", "示範資料", "非投資建議"],
  "/stocks/0050": ["標的快速判讀", "30 秒", "3 分鐘", "示範資料", "非投資建議"],
  "/stocks/006208": ["標的快速判讀", "30 秒", "3 分鐘", "示範資料", "非投資建議"],
  "/stocks/2382": ["標的快速判讀", "30 秒", "3 分鐘", "示範資料", "非投資建議"],
  "/stocks/2308": ["標的快速判讀", "30 秒", "3 分鐘", "示範資料", "非投資建議"]
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
    const mojibakeHits = findBadTextMarkers(visibleText);
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

function findBadTextMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/[\u0080-\u009f]/u.test(text)) markers.push("c1-control-character");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱"]) {
    if (text.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return [...new Set(markers)];
}
