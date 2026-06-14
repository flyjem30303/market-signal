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

const globalRequiredVisibleFragments = ["指數燈號", "非投資建議"];

const routeRequiredVisibleFragments = {
  "/": ["指數狀態儀表站", "30 秒", "3 分鐘", "示範資料"],
  "/briefing": ["市場簡報", "30 秒看市場氣氛", "3 分鐘", "今日警示清單"],
  "/weekly": ["週報", "30 秒", "風險聲明"],
  "/membership": ["會員功能預覽", "每日市場三層解讀", "自選追蹤", "盤後複盤"],
  "/methodology": ["方法說明", "資料狀態", "燈號"],
  "/disclaimer": ["風險聲明", "不保證", "投資決策"],
  "/terms": ["使用條款", "資料", "使用者責任"],
  "/privacy": ["隱私", "公開 Beta", "敏感資料"],
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
    const mojibakeHits = findBadTextMarkers(visibleText);
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
    const mojibakeHits = findBadTextMarkers(visibleText);

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

function findBadTextMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-codepoint");
  if (/[\u0080-\u009F]/u.test(text)) markers.push("control-codepoint");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱"]) {
    if (text.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return [...new Set(markers)];
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
  const source = fs.readFileSync(checkerPath, "utf8");
  const expected = [
    "cmd.exe",
    "npm run",
    "publicDataSource",
    "scoreSource",
    "Phase 1",
    "Phase 2",
    "findBadTextMarkers"
  ];

  return expected.map((fragment) => ({
    check: `checker source includes ${fragment}`,
    pass: source.includes(fragment)
  }));
}
