import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-public-visible-language-quality.mjs";

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

const inaccessibleRoutes = [
  "/membership",
  "/watchlist",
  "/internal",
  "/internal/cp3-dry-run",
  "/internal/etf-source-readiness",
  "/internal/raw-market-preview",
  "/api/internal/raw-market?symbol=2330"
];

const publicSourceFiles = [
  "src/app/page.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/stocks/[symbol]/page.tsx",
  "src/components/dashboard-shell.tsx",
  "src/components/data-freshness-strip.tsx",
  "src/components/public-data-source-boundary-notice.tsx",
  "src/components/public-next-reading-flow.tsx",
  "src/components/public-route-reading-contract.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/lib/assets.ts",
  "src/lib/market-data.ts",
  "src/lib/signal-model.ts"
];

const requiredByRoute = {
  "/": ["市場分數", "風險分數", "正式每日資料尚未啟用", "非投資建議"],
  "/briefing": ["市場快報", "30 秒看懂市場燈號", "3 分鐘把市場燈號拆成原因", "資料與風險邊界"],
  "/weekly": ["市場週報", "正式資料尚未啟用", "非投資建議"],
  "/methodology": ["方法說明", "市場分數", "風險分數", "非投資建議"],
  "/disclaimer": ["風險聲明", "不是投資建議", "正式市場資料尚未啟用"],
  "/terms": ["使用條款", "市場資訊整理", "自行承擔風險"],
  "/privacy": ["隱私權與資料說明", "不要求使用者提供姓名", "會員功能資料邊界"],
  "/stocks/TWII": ["TWII", "市場分數", "風險分數", "示範資料"],
  "/stocks/2330": ["2330", "市場分數", "風險分數", "示範資料"],
  "/stocks/0050": ["0050", "市場分數", "風險分數", "示範資料"],
  "/stocks/006208": ["006208", "市場分數", "風險分數", "示範資料"],
  "/stocks/2382": ["2382", "市場分數", "風險分數", "示範資料"],
  "/stocks/2308": ["2308", "市場分數", "風險分數", "示範資料"]
};

const forbiddenVisibleFragments = [
  "cmd.exe",
  "npm run",
  "hard blocker",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "dry-run",
  "preflight",
  "post-run",
  "operator",
  "PUBLIC_BETA",
  "BETA_",
  "publicDataSource",
  "scoreSource",
  "daily_prices",
  "staging rows",
  "raw payload",
  "candidateArtifactPath",
  "source_row_hash",
  "Membership MVP",
  "member-only"
];

const publicResults = [];
for (const route of publicRoutes) {
  publicResults.push(await checkPublicRoute(route));
}

const inaccessibleResults = [];
for (const route of inaccessibleRoutes) {
  inaccessibleResults.push(await checkInaccessibleRoute(route));
}

const sourceResults = checkPublicSourceFiles();
const registrationResults = checkRegistration();
const blocked = [
  ...publicResults.filter((result) => !result.pass),
  ...inaccessibleResults.filter((result) => !result.pass),
  ...sourceResults.filter((result) => !result.pass),
  ...registrationResults.filter((result) => !result.pass)
];
const status = blocked.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      baseUrl,
      blocked,
      checkedInaccessibleRoutes: inaccessibleRoutes.length,
      checkedPublicRoutes: publicRoutes.length,
      checkedPublicSourceFiles: publicSourceFiles.length,
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
    const missing = (requiredByRoute[route] ?? []).filter((phrase) => !visibleText.includes(phrase));
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const mojibakeHits = findBadTextMarkers(visibleText);

    return {
      forbiddenHits,
      missing,
      mojibakeHits,
      pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && mojibakeHits.length === 0,
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

async function checkInaccessibleRoute(route) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const visibleText = normalizeVisibleText(await response.text());
    const forbiddenHits = forbiddenVisibleFragments.filter((fragment) => visibleText.includes(fragment));
    const mojibakeHits = findBadTextMarkers(visibleText);

    return {
      forbiddenHits,
      mojibakeHits,
      pass: [401, 404].includes(response.status) && forbiddenHits.length === 0 && mojibakeHits.length === 0,
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

function checkPublicSourceFiles() {
  return publicSourceFiles.map((file) => {
    const source = fs.readFileSync(file, "utf8");
    const mojibakeHits = findBadTextMarkers(source);
    return {
      file,
      mojibakeHits,
      pass: mojibakeHits.length === 0
    };
  });
}

function checkRegistration() {
  const packageJson = fs.readFileSync(packagePath, "utf8");
  const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
  const checker = fs.readFileSync(checkerPath, "utf8");

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
      check: "Phase 2 routes stay inaccessible",
      pass: checker.includes('"/membership"') && checker.includes('"/watchlist"')
    }
  ];
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function findBadTextMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-codepoint");
  if (/[\u0080-\u009F]/u.test(text)) markers.push("control-codepoint");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  if (/(?:嚗|銝|蝭|憟|璅|鞈|撣|閮|瘥|摨|甈|雿|蹐|蹓|||||){2,}/u.test(text)) {
    markers.push("legacy-mojibake-cjk-run");
  }
  return markers;
}
