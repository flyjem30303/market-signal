import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const sourcePaths = [
  "src/components/public-beta-data-readiness-status.tsx",
  "src/lib/public-beta-data-readiness-status.ts",
  "src/components/dashboard-shell.tsx",
  "src/app/briefing/page.tsx"
];

const routeChecks = [
  {
    path: "/",
    required: [
      "正式市場資料尚未啟用",
      "示範資料",
      "資料品質",
      "不提供個股買賣建議",
      "目前資料可用於閱讀流程，尚未切換正式資料",
      "30 秒可用：市場閱讀",
      "個股示範覆蓋",
      "不能當成買賣指令",
      "正式資料升級前檢查",
      "來源可用條件",
      "大盤指數與 ETF 覆蓋",
      "回退與公開說明"
    ]
  },
  {
    path: "/briefing",
    required: [
      "正式市場資料尚未啟用",
      "示範資料",
      "資料品質",
      "不提供個股買賣建議",
      "目前資料可用於閱讀流程，尚未切換正式資料",
      "30 秒可用：市場閱讀",
      "個股示範覆蓋",
      "不能當成買賣指令",
      "正式資料升級前檢查",
      "來源可用條件",
      "大盤指數與 ETF 覆蓋",
      "回退與公開說明"
    ]
  }
];

const forbiddenVisibleTerms = [
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "cmd.exe",
  "npm run",
  "packet",
  "operator",
  "Supabase",
  "SQL",
  "daily_prices",
  "staging rows",
  "raw market data",
  "raw payload",
  "Runtime Status",
  "promotion gate"
];

const forbiddenSourcePatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /publicDataSource:\s*"supabase"/u,
  /scoreSource:\s*"real"/u,
  /real market data is live/iu
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-data-readiness-status"] ===
      "node scripts/check-public-beta-data-readiness-status.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-data-readiness-status.mjs") &&
      reviewGate.includes('"public-beta-data-readiness-status"')
  }
];

const sourceResults = sourcePaths.map((path) => {
  const source = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
  const forbiddenHits = forbiddenSourcePatterns.filter((pattern) => pattern.test(source)).map(String);
  const markerHits = findHardMojibakeMarkers(source);
  return {
    forbiddenHits,
    markerHits,
    pass: source.length > 0 && forbiddenHits.length === 0 && markerHits.length === 0,
    path
  };
});

const routeResults = await Promise.all(routeChecks.map(checkRoute));
const status =
  registration.every((item) => item.pass) &&
  sourceResults.every((item) => item.pass) &&
  routeResults.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(JSON.stringify({ registration, routeResults, sourceResults, status }, null, 2));

if (status !== "ok") process.exitCode = 1;

async function checkRoute({ path, required }) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = normalizeVisibleText(await response.text());
  const missing = required.filter((phrase) => !text.includes(phrase));
  const forbiddenHits = forbiddenVisibleTerms.filter((phrase) => text.includes(phrase));
  const markerHits = findHardMojibakeMarkers(text);

  return {
    forbiddenHits,
    markerHits,
    missing,
    pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
    path,
    status: response.status
  };
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findHardMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
