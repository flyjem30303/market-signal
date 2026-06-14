import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeRequirements = {
  "/": ["指數狀態儀表站", "30 秒", "3 分鐘", "核心指標", "資料邊界", "示範資料"],
  "/briefing": ["市場簡報", "30 秒看市場氣氛", "3 分鐘", "今日警示清單", "資料邊界", "示範資料"]
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
    const markerHits = findBadTextMarkers(text);
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

console.log(JSON.stringify({ setupProblems, routeResults, status }, null, 2));

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

function findBadTextMarkers(source) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(source)) markers.push("private-use-or-replacement-codepoint");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱"]) {
    if (source.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return [...new Set(markers)];
}
