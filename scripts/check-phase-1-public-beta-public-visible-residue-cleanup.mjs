const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const publicRoutes = [
  "/",
  "/briefing",
  "/weekly",
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
  "/": ["指數狀態儀表站", "市場總覽", "資料狀態", "風險提醒"],
  "/briefing": ["市場快報", "30 秒看市場狀態", "下一步觀察", "資料邊界"],
  "/weekly": ["市場週報", "市場燈號", "示範資料", "資料更新狀態"],
  "/methodology": ["方法說明", "燈號是市場閱讀工具", "核心模組", "風險聲明"],
  "/disclaimer": ["風險聲明", "不提供投資建議", "不是建議", "資料限制"],
  "/terms": ["使用條款", "資料與風險邊界", "服務定位", "使用責任"],
  "/privacy": ["隱私政策", "公開版不需要敏感交易資料", "目前階段", "未來功能"],
  "/stocks/TWII": ["台灣加權指數", "標的摘要", "綜合分數", "風險分數"],
  "/stocks/2330": ["台積電", "標的摘要", "綜合分數", "風險分數"],
  "/stocks/0050": ["元大台灣50", "標的摘要", "綜合分數", "風險分數"],
  "/stocks/006208": ["富邦台50", "標的摘要", "綜合分數", "風險分數"],
  "/stocks/2382": ["廣達", "標的摘要", "綜合分數", "風險分數"],
  "/stocks/2308": ["台達電", "標的摘要", "綜合分數", "風險分數"]
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

const mojibakeFragments = [
  "撣",
  "蝪",
  "嚗",
  "鞈",
  "雿",
  "銝",
  "瘥",
  "蝘",
  "閬",
  "憸",
  "甇",
  "摰",
  "餈",
  "蝷",
  "鞎",
  "蝬",
  "靘",
  "璅",
  "皜",
  "隤",
  "銵",
  "閫",
  "?",
  "?啁",
  "?祇",
  "?梁",
  "?寞"
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
      guardedStatus: "phase_1_public_beta_public_visible_residue_cleanup_ready_for_users",
      checkedRoutes: publicRoutes.length,
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
  const markers = new Set();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp === 0xfffd) markers.add("replacement-code-point");
    if (cp >= 0xe000 && cp <= 0xf8ff) markers.add("private-use-code-point");
    if (cp >= 0x80 && cp <= 0x9f) markers.add("c1-control-character");
  }
  if (/\?{3,}/u.test(text)) markers.add("question-mark-run");
  for (const fragment of mojibakeFragments) {
    if (text.includes(fragment)) markers.add(`mojibake-fragment:${fragment}`);
  }
  return [...markers];
}
