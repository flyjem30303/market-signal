import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeChecks = [
  {
    path: "/",
    required: [
      "指數狀態儀表站",
      "30 秒可讀",
      "3 分鐘可行動",
      "市場總覽",
      "核心指標",
      "警示清單",
      "正式市場資料尚未啟用",
      "不提供個股買賣建議"
    ]
  },
  {
    path: "/briefing",
    required: [
      "30 秒看懂今日市場氣氛",
      "3 分鐘行動判斷",
      "市場廣度",
      "下一步觀察",
      "正式市場資料尚未啟用",
      "不提供個股買賣建議"
    ]
  },
  {
    path: "/stocks/2330",
    required: [
      "30 秒快讀",
      "決策輔助摘要",
      "成因",
      "更新時間",
      "影響級別",
      "下一步觀察",
      "正式市場資料尚未啟用",
      "不提供個股買賣建議"
    ]
  }
];

const forbiddenVisibleTerms = [
  "Current hard blockers",
  "Remaining hard blockers",
  "External reply dry-run intake",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
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
  "Supabase",
  "SQL",
  "daily_prices",
  "staging rows",
  "raw market data",
  "raw payload",
  "Runtime Status",
  "promotion gate"
];

const files = {
  packageJson: JSON.parse(fs.readFileSync(packagePath, "utf8")),
  reviewGate: fs.readFileSync(reviewGatePath, "utf8")
};

const registration = [
  {
    file: packagePath,
    pass:
      files.packageJson.scripts?.["check:public-beta-decision-journey-panel"] ===
      "node scripts/check-public-beta-decision-journey-panel.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      files.reviewGate.includes("scripts/check-public-beta-decision-journey-panel.mjs") &&
      files.reviewGate.includes('"public-beta-decision-journey-panel"')
  }
];

const routeResults = await Promise.all(routeChecks.map(checkRoute));
const status = routeResults.every((item) => item.pass) && registration.every((item) => item.pass) ? "ok" : "blocked";

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
