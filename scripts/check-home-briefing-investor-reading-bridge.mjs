import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeRequirements = {
  "/": [
    "指數狀態儀表站",
    "30 秒可讀",
    "3 分鐘可行動",
    "30 秒市場氣氛",
    "3 分鐘行動判斷",
    "正式資料升級前檢查",
    "市場總覽",
    "核心指標",
    "警示清單",
    "正式市場資料尚未啟用"
  ],
  "/briefing": [
    "30 秒看懂今日市場氣氛",
    "3 分鐘行動判斷",
    "正式資料升級前檢查",
    "市場廣度",
    "下一步觀察",
    "正式市場資料尚未啟用"
  ]
};

const forbiddenVisible = [
  "cmd.exe",
  "npm run",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const setupProblems = [];

if (
  packageJson.scripts?.["check:home-briefing-investor-reading-bridge"] !==
  "node scripts/check-home-briefing-investor-reading-bridge.mjs"
) {
  setupProblems.push(`${packagePath} missing check:home-briefing-investor-reading-bridge`);
}

if (!reviewGate.includes("scripts/check-home-briefing-investor-reading-bridge.mjs")) {
  setupProblems.push(`${reviewGatePath} missing checker registration`);
}

const routeResults = await Promise.all(
  Object.entries(routeRequirements).map(async ([path, required]) => {
    const response = await fetch(`${baseUrl}${path}`);
    const text = normalizeVisibleText(await response.text());
    const missing = required.filter((phrase) => !text.includes(phrase));
    const blocked = forbiddenVisible.filter((phrase) => text.includes(phrase));
    const markerHits = findMojibakeMarkers(text);
    return {
      blocked,
      markerHits,
      missing,
      pass: response.status === 200 && missing.length === 0 && blocked.length === 0 && markerHits.length === 0,
      path,
      status: response.status
    };
  })
);

const status = setupProblems.length === 0 && routeResults.every((result) => result.pass) ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      setupProblems,
      routeResults,
      status
    },
    null,
    2
  )
);

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
