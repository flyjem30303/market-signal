import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routes = [
  { path: "/", required: ["指數狀態儀表站", "正式市場資料尚未啟用", "不提供個股買賣建議"] },
  { path: "/briefing", required: ["30 秒看懂今日市場氣氛", "資料品質", "不提供個股買賣建議"] },
  { path: "/stocks/TWII", required: ["30 秒快讀", "決策輔助摘要", "正式市場資料尚未啟用"] },
  { path: "/stocks/2330", required: ["30 秒快讀", "決策輔助摘要", "正式市場資料尚未啟用"] },
  { path: "/stocks/0050", required: ["30 秒快讀", "決策輔助摘要", "正式市場資料尚未啟用"] },
  { path: "/weekly", required: ["週報", "示範資料", "3 分鐘行動判斷"] },
  { path: "/methodology", required: ["方法說明", "資料品質", "示範資料"] },
  { path: "/disclaimer", required: ["風險聲明", "示範資料", "不是投資建議"] },
  { path: "/terms", required: ["使用條款", "示範資料", "投資建議"] },
  { path: "/privacy", required: ["隱私權", "資料來源", "正式上線前"] }
];

const forbiddenVisibleTerms = [
  "Current hard blockers",
  "Remaining hard blockers",
  "External reply dry-run intake",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "cmd.exe",
  "npm run",
  "SQL execution is approved",
  "Supabase writes are approved",
  "raw market data fetch is approved",
  "publicDataSource",
  "scoreSource"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:a2-brief-public-runtime-surface-audit"] ===
      "node scripts/check-a2-brief-public-runtime-surface-audit.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-a2-brief-public-runtime-surface-audit.mjs") &&
      reviewGate.includes('"a2-brief-public-runtime-surface-audit"')
  }
];

const routeResults = await Promise.all(routes.map(checkRoute));
const status = registration.every((item) => item.pass) && routeResults.every((item) => item.pass) ? "ok" : "blocked";

console.log(JSON.stringify({ registration, routeResults, status }, null, 2));

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
