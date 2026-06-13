import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-public-visible-language-quality.mjs";

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

const globalRequiredVisibleFragments = ["示範資料", "非投資建議"];

const routeRequiredVisibleFragments = {
  "/": ["指數狀態儀表站", "30 秒", "3 分鐘", "市場氣氛", "資料可信度"],
  "/briefing": ["每日市場晨報", "30 秒", "3 分鐘", "觀察重點", "下一步"],
  "/weekly": ["市場週報", "30 秒", "資料更新時間", "風險聲明"],
  "/membership": ["會員功能預覽", "30 秒", "3 分鐘", "每日市場三層解讀", "Watchlist 與自訂警示", "盤後複盤報告", "目前不開放會員登入或付費"],
  "/methodology": ["方法說明", "市場氣氛", "資料品質", "正式資料必須先通過驗證"],
  "/disclaimer": ["風險聲明", "資料限制", "市場風險自負"],
  "/terms": ["使用條款", "資料狀態", "請自行評估風險"],
  "/privacy": ["隱私與資料說明", "交易帳戶", "資料保護方向"],
  "/stocks/TWII": ["TWII", "30 秒", "3 分鐘", "資料邊界"],
  "/stocks/2330": ["2330", "30 秒", "3 分鐘", "資料邊界"],
  "/stocks/0050": ["0050", "30 秒", "3 分鐘", "資料邊界"],
  "/stocks/006208": ["006208", "30 秒", "3 分鐘", "資料邊界"],
  "/stocks/2382": ["2382", "30 秒", "3 分鐘", "資料邊界"],
  "/stocks/2308": ["2308", "30 秒", "3 分鐘", "資料邊界"]
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
  "Phase 1",
  "Phase 2",
  "Membership MVP",
  "member-only"
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

const registrationResults = checkRegistration();
const checkerSourceResults = checkCheckerSource();
const blocked = publicResults.filter((result) => !result.pass);
const blockedInternal = internalBoundaryResults.filter((result) => !result.pass);
const blockedRegistration = registrationResults.filter((result) => !result.pass);
const blockedCheckerSource = checkerSourceResults.filter((result) => !result.pass);
const status =
  blocked.length === 0 &&
  blockedInternal.length === 0 &&
  blockedRegistration.length === 0 &&
  blockedCheckerSource.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      baseUrl,
      checkedPublicRoutes: publicRoutes.length,
      checkedInternalBoundaries: internalBoundaryRoutes.length,
      blocked,
      blockedInternal,
      blockedRegistration,
      blockedCheckerSource,
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
    const html = await response.text();
    const visibleText = normalizeVisibleText(html);
    const pageTitle = extractTitle(html);
    const routeRequired = routeRequiredVisibleFragments[route] ?? [];
    const required = [...globalRequiredVisibleFragments, ...routeRequired];
    const missing = required.filter((phrase) => !visibleText.includes(phrase));
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const roleHits = forbiddenRoleFragments.filter((pattern) => pattern.test(visibleText)).map(String);
    const mojibakeHits = findMojibakeMarkers(visibleText);
    const titleHits = pageTitle.includes("| 指數燈號 | 指數燈號") ? ["duplicated-site-title"] : [];

    return {
      forbiddenHits,
      missing,
      mojibakeHits,
      pass:
        response.status === 200 &&
        missing.length === 0 &&
        forbiddenHits.length === 0 &&
        roleHits.length === 0 &&
        mojibakeHits.length === 0 &&
        titleHits.length === 0,
      roleHits,
      route,
      status: response.status,
      titleHits,
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
      pass:
        allowedStatuses.includes(response.status) &&
        forbiddenHits.length === 0 &&
        roleHits.length === 0 &&
        mojibakeHits.length === 0,
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

function extractTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match?.[1]?.replace(/&amp;/g, "&").trim() ?? "";
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-codepoint");
  if (/[\u0080-\u009F]/u.test(text)) markers.push("control-codepoint");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}

function checkRegistration() {
  const packageJson = fs.readFileSync(packagePath, "utf8");
  const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

  return [
    {
      check: "package script registered",
      pass: packageJson.includes('"check:public-visible-language-quality"')
    },
    {
      check: "review gate registered",
      pass: reviewGate.includes("scripts/check-public-visible-language-quality.mjs")
    },
    {
      check: "focused gate registered",
      pass: reviewGate.includes('"public-visible-language-quality"')
    }
  ];
}

function checkCheckerSource() {
  const checkerSource = fs.readFileSync(checkerPath, "utf8");

  return [
    {
      check: "checker source has readable required phrases",
      pass:
        checkerSource.includes("指數狀態儀表站") &&
        checkerSource.includes("會員功能預覽") &&
        checkerSource.includes("風險聲明") &&
        checkerSource.includes("資料邊界")
    },
    {
      check: "checker source blocks internal residue",
      pass:
        checkerSource.includes("cmd.exe") &&
        checkerSource.includes("publicDataSource") &&
        checkerSource.includes("candidateArtifactPath") &&
        checkerSource.includes("Phase 2")
    },
    {
      check: "checker source has no literal replacement character",
      pass: !checkerSource.includes("\uFFFD")
    },
    {
      check: "checker source has no private-use characters",
      pass: !/[\uE000-\uF8FF]/u.test(checkerSource)
    }
  ];
}
