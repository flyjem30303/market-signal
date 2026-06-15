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

const internalBoundaryRoutes = [
  { route: "/internal", allowedStatuses: [404] },
  { route: "/internal/cp3-dry-run", allowedStatuses: [404] },
  { route: "/internal/etf-source-readiness", allowedStatuses: [404] },
  { route: "/internal/raw-market-preview", allowedStatuses: [404] },
  { route: "/api/internal/raw-market?symbol=2330", allowedStatuses: [404, 401] }
];

const routeRequiredPhrases = {
  "/": ["公開 Beta", "市場總覽", "30 秒", "3 分鐘", "示範資料", "非投資建議"],
  "/briefing": ["市場簡報", "30 秒", "3 分鐘", "警示清單", "資料邊界", "正式資料尚未啟用"],
  "/weekly": ["市場週報", "本週市場狀態", "示範資料", "不提供買賣建議"],
  "/methodology": ["方法說明", "燈號方法", "資料狀態", "不是交易指令"],
  "/disclaimer": ["風險聲明", "市場資訊整理", "不構成個股買賣建議"],
  "/terms": ["使用條款", "市場觀察", "不能當作交易指令", "資料來源"],
  "/privacy": ["隱私", "會員功能", "自選追蹤", "自訂警示"],
  "/stocks/TWII": ["TWII", "指數燈號", "30 秒", "3 分鐘", "資料來源與覆蓋", "不是投資建議"],
  "/stocks/2330": ["2330", "指數燈號", "30 秒", "3 分鐘", "資料來源與覆蓋", "不是投資建議"],
  "/stocks/0050": ["0050", "指數燈號", "30 秒", "3 分鐘", "資料來源與覆蓋", "不是投資建議"],
  "/stocks/006208": ["006208", "指數燈號", "30 秒", "3 分鐘", "資料來源與覆蓋", "不是投資建議"],
  "/stocks/2382": ["2382", "指數燈號", "30 秒", "3 分鐘", "資料來源與覆蓋", "不是投資建議"],
  "/stocks/2308": ["2308", "指數燈號", "30 秒", "3 分鐘", "資料來源與覆蓋", "不是投資建議"]
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
  "資料線",
  "watchlist"
];

const forbiddenRoleFragments = [
  /\bCEO\b/u,
  /\bPM\b/u,
  /\bA1\b/u,
  /\bA2\b/u,
  /\bA3\b/u,
  /\bA4\b/u,
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
      pass:
        response.status === 200 &&
        missing.length === 0 &&
        forbiddenHits.length === 0 &&
        roleHits.length === 0 &&
        mojibakeHits.length === 0,
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
  if (/[\u0080-\u009F]/u.test(text)) markers.push("c1-control-character");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱", "擗", "", "", "芷"]) {
    if (text.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return markers;
}
