import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeRequired = {
  "/": ["市場總覽", "核心指標", "警示清單", "偏強觀察", "風險觀察", "正式市場資料尚未啟用"],
  "/briefing": ["市場廣度", "偏強觀察", "風險觀察", "使用提醒", "下一步觀察", "不提供個股買賣建議"]
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
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "SQL",
  "Supabase"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-alert-list-actionability"] ===
      "node scripts/check-public-beta-alert-list-actionability.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-alert-list-actionability.mjs") &&
      reviewGate.includes('"public-beta-alert-list-actionability"')
  }
];

const routeResults = await Promise.all(
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

const status = registration.every((item) => item.pass) && routeResults.every((item) => item.pass) ? "ok" : "blocked";

console.log(JSON.stringify({ registration, routeResults, status }, null, 2));

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
