import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const route = "/briefing";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredVisible = [
  "30 秒看懂今日市場氣氛",
  "市場廣度",
  "3 分鐘行動判斷",
  "下一步觀察",
  "正式市場資料尚未啟用",
  "不提供個股買賣建議"
];

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
  "Supabase",
  "SQL",
  "daily_prices",
  "Runtime Status",
  "promotion gate"
];

const problems = [];
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

if (
  packageJson.scripts?.["check:briefing-midpage-readability"] !==
  "node scripts/check-briefing-midpage-readability.mjs"
) {
  problems.push(`${packagePath} missing check:briefing-midpage-readability`);
}

if (!reviewGate.includes("scripts/check-briefing-midpage-readability.mjs")) {
  problems.push(`${reviewGatePath} missing checker registration`);
}

const response = await fetch(`${baseUrl}${route}`);
const html = await response.text();
const text = normalizeVisibleText(html);

const missing = requiredVisible.filter((phrase) => !text.includes(phrase));
const blocked = forbiddenVisible.filter((phrase) => text.includes(phrase));
const markerHits = findMojibakeMarkers(text);

if (response.status !== 200) problems.push(`${route} returned ${response.status}`);
problems.push(...missing.map((phrase) => `${route} missing ${phrase}`));
problems.push(...blocked.map((phrase) => `${route} exposes ${phrase}`));
problems.push(...markerHits.map((marker) => `${route} marker ${marker}`));

const status = problems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      checkedRoute: route,
      missing,
      blocked,
      markerHits,
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
