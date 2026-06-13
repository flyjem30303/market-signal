import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeRequired = {
  "/": ["30 秒內看懂市場氛圍", "3 分鐘內判斷", "全市場總覽", "警示提醒", "正式市場資料尚未啟用"],
  "/briefing": ["30 秒看懂今日市場氣氛", "3 分鐘行動判斷", "下一步觀察", "不提供個股買賣建議"],
  "/stocks/2330": ["30 秒快速閱讀", "決策輔助摘要", "下一步觀察", "不提供個股買賣建議"]
};

const forbiddenVisible = [
  "Current hard blockers",
  "Remaining hard blockers",
  "External reply dry-run intake",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "cmd.exe",
  "npm run",
  "readonly-attempt",
  "post-run",
  "preflight",
  "packet",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "SQL",
  "Supabase"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass: Boolean(packageJson.scripts?.["check:public-beta-decision-loop-bridge"])
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("check-public-beta-decision-loop-bridge.mjs") &&
      reviewGate.includes('"public-beta-decision-loop-bridge"')
  }
];

const pageResults = await Promise.all(
  Object.entries(routeRequired).map(async ([path, required]) => {
    const response = await fetch(`${baseUrl}${path}`);
    const text = normalizeVisibleText(await response.text());
    const missing = required.filter((phrase) => !text.includes(phrase));
    const forbiddenHits = forbiddenVisible.filter((phrase) => text.includes(phrase));
    const markerHits = findMojibakeMarkers(text);
    return {
      forbiddenHits,
      markerHits,
      missing,
      pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
      path,
      status: response.status
    };
  })
);

const status = pageResults.every((item) => item.pass) && registration.every((item) => item.pass) ? "ok" : "blocked";

console.log(JSON.stringify({ pageResults, registration, status }, null, 2));

if (status !== "ok") process.exitCode = 1;

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
