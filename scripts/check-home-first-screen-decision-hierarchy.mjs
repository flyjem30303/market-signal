import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const dashboardPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredVisible = [
  "首頁快速判讀",
  "30 秒看懂",
  "市場氣氛",
  "市場廣度",
  "主要風險",
  "資料時間",
  "3 分鐘複核",
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
  "raw market data",
  "Phase 1",
  "Phase 2",
  "Membership MVP"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const setupProblems = [];

if (
  packageJson.scripts?.["check:home-first-screen-decision-hierarchy"] !==
  "node scripts/check-home-first-screen-decision-hierarchy.mjs"
) {
  setupProblems.push(`${packagePath} missing check:home-first-screen-decision-hierarchy`);
}

if (
  !reviewGate.includes("scripts/check-home-first-screen-decision-hierarchy.mjs") ||
  !reviewGate.includes('"home-first-screen-decision-hierarchy"')
) {
  setupProblems.push(`${reviewGatePath} missing home-first-screen-decision-hierarchy registration`);
}

for (const phrase of [
  "function HomeFirstScreenDecisionSummary",
  "首頁快速判讀",
  "市場氣氛",
  "市場廣度",
  "主要風險",
  "資料時間",
  "3 分鐘複核"
]) {
  if (!dashboard.includes(phrase)) setupProblems.push(`${dashboardPath} missing ${phrase}`);
}

for (const phrase of [
  ".home-first-screen-decision",
  ".home-first-screen-decision__grid",
  ".home-first-screen-decision__main",
  ".home-first-screen-decision__next"
]) {
  if (!css.includes(phrase)) setupProblems.push(`${cssPath} missing ${phrase}`);
}

const response = await fetch(`${baseUrl}/`);
const text = normalizeVisibleText(await response.text());
const routeResult = {
  forbiddenHits: forbiddenVisible.filter((phrase) => text.includes(phrase)),
  markerHits: findHardMojibakeMarkers(text),
  missing: requiredVisible.filter((phrase) => !text.includes(phrase)),
  path: "/",
  status: response.status
};
routeResult.pass =
  response.status === 200 &&
  routeResult.missing.length === 0 &&
  routeResult.forbiddenHits.length === 0 &&
  routeResult.markerHits.length === 0;

const status = setupProblems.length === 0 && routeResult.pass ? "ok" : "blocked";

console.log(JSON.stringify({ routeResult, setupProblems, status }, null, 2));

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

function findHardMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
