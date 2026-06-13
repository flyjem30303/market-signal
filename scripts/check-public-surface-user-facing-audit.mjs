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

const internalBoundaryRoutes = [
  { route: "/internal", allowedStatuses: [404] },
  { route: "/internal/cp3-dry-run", allowedStatuses: [404] },
  { route: "/internal/etf-source-readiness", allowedStatuses: [404] },
  { route: "/internal/raw-market-preview", allowedStatuses: [404] },
  { route: "/api/internal/raw-market?symbol=2330", allowedStatuses: [404, 401] }
];

const routeRequiredPhrases = {
  "/": ["指數狀態儀表站", "30 秒", "3 分鐘", "示範資料", "正式資料升級前檢查", "不提供個股買賣建議"],
  "/briefing": ["30 秒看懂今日市場氣氛", "3 分鐘行動判斷", "今日市場提醒", "示範資料", "不提供買賣建議"],
  "/weekly": ["本週市場狀態整理", "30 秒", "3 分鐘", "示範資料", "非投資建議"],
  "/membership": ["會員功能預覽", "30 秒", "3 分鐘", "每日市場三層解讀", "Watchlist 與自訂警示", "目前不開放會員登入或付費"],
  "/methodology": ["方法說明", "資料狀態", "示範資料", "不提供個股買賣建議"],
  "/disclaimer": ["風險聲明", "不是投資建議", "不保證", "公開 Beta"],
  "/terms": ["使用條款", "資訊參考", "不是投資建議", "公開 Beta"],
  "/privacy": ["隱私與資料說明", "公開 Beta", "不需要輸入", "敏感資料"],
  "/stocks/TWII": ["狀態儀表", "30 秒", "3 分鐘", "資料狀態", "不提供個股買賣建議"],
  "/stocks/2330": ["狀態儀表", "30 秒", "3 分鐘", "資料狀態", "不提供個股買賣建議"],
  "/stocks/0050": ["狀態儀表", "30 秒", "3 分鐘", "資料狀態", "不提供個股買賣建議"],
  "/stocks/006208": ["狀態儀表", "30 秒", "3 分鐘", "資料狀態", "不提供個股買賣建議"],
  "/stocks/2382": ["狀態儀表", "30 秒", "3 分鐘", "資料狀態", "不提供個股買賣建議"],
  "/stocks/2308": ["狀態儀表", "30 秒", "3 分鐘", "資料狀態", "不提供個股買賣建議"]
};

const forbiddenVisibleFragments = [
  "cmd.exe",
  "npm run",
  "pre-launch",
  "PRE-LAUNCH",
  "hard blocker",
  "Hard Blocker",
  "HARD BLOCKER",
  "Remaining Hard",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "dry-run",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "commit ",
  "Git",
  "PUBLIC_BETA",
  "BETA_",
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
  "Data Readiness",
  "promotion gate",
  "readonly",
  "bounded",
  "PGRST",
  "OFFICIAL-",
  "candidateArtifactPath",
  "source_row_hash",
  "產品可用度",
  "真實資料閉環",
  "後端資料流程",
  "不匯入市場原始資料",
  "資料線",
  "目前硬阻塞",
  "剩餘阻塞",
  "開發進度",
  "內部覆核",
  "工作包",
  "執行包"
];

const forbiddenRoleFragments = [
  /\bCEO\b/u,
  /\bPM\b/u,
  /\bA1\b/u,
  /\bA2\b/u,
  /\bD:\\/u,
  /\bC:\\/u
];

const publicResults = [];
for (const route of publicRoutes) {
  publicResults.push(await checkPublicRoute(route));
}

const internalBoundaryResults = [];
for (const routeConfig of internalBoundaryRoutes) {
  internalBoundaryResults.push(await checkInternalBoundary(routeConfig));
}

const blocked = publicResults.filter((result) => !result.pass);
const blockedInternal = internalBoundaryResults.filter((result) => !result.pass);
const status = blocked.length === 0 && blockedInternal.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      baseUrl,
      checkedPublicRoutes: publicRoutes.length,
      checkedInternalBoundaries: internalBoundaryRoutes.length,
      blocked,
      blockedInternal,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

async function checkPublicRoute(route) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const visibleText = normalizeVisibleText(await response.text());
    const required = routeRequiredPhrases[route] ?? [];
    const missing = required.filter((phrase) => !visibleText.includes(phrase));
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const roleHits = forbiddenRoleFragments.filter((pattern) => pattern.test(visibleText)).map(String);
    const mojibakeHits = findMojibakeMarkers(visibleText);

    return {
      forbiddenHits,
      missing,
      mojibakeHits,
      pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && roleHits.length === 0 && mojibakeHits.length === 0,
      roleHits,
      route,
      status: response.status,
      visibleLength: visibleText.length
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      pass: false,
      route
    };
  }
}

async function checkInternalBoundary({ allowedStatuses, route }) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const visibleText = normalizeVisibleText(await response.text());
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const roleHits = forbiddenRoleFragments.filter((pattern) => pattern.test(visibleText)).map(String);
    const mojibakeHits = findMojibakeMarkers(visibleText);

    return {
      forbiddenHits,
      mojibakeHits,
      pass: allowedStatuses.includes(response.status) && forbiddenHits.length === 0 && roleHits.length === 0 && mojibakeHits.length === 0,
      roleHits,
      route,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      pass: false,
      route
    };
  }
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-codepoint");
  if (/[ÃÂ�]/u.test(text)) markers.push("utf8-decoding-artifact");
  if (/ï¿½/u.test(text)) markers.push("replacement-sequence");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
