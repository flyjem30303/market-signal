import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const helperPaths = [
  "src/lib/home-market-action-summary.ts",
  "src/lib/briefing-market-action-summary.ts",
  "src/lib/investor-action-summary.ts"
];

const routes = [
  { path: "/", required: ["30 秒可讀", "3 分鐘可行動", "下一步觀察"] },
  { path: "/briefing", required: ["3 分鐘行動判斷", "下一步觀察", "使用提醒"] },
  { path: "/stocks/2330", required: ["決策輔助摘要", "下一步觀察", "不提供個股買賣建議"] }
];

const forbiddenVisibleTerms = [
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "cmd.exe",
  "npm run",
  "packet",
  "operator",
  "Supabase writes are approved",
  "SQL execution is approved"
];

const forbiddenHelperPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /scoreSource\s*:\s*"real"/u,
  /publicDataSource\s*:\s*"supabase"/u,
  /real market data is live/iu,
  /investment advice is allowed/iu
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-mainline-action-bridge"] ===
      "node scripts/check-public-beta-mainline-action-bridge.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-mainline-action-bridge.mjs") &&
      reviewGate.includes('"public-beta-mainline-action-bridge"')
  }
];

const helperResults = helperPaths.map((path) => {
  const source = fs.readFileSync(path, "utf8");
  const forbiddenHits = forbiddenHelperPatterns.filter((pattern) => pattern.test(source)).map(String);
  const markerHits = findHardMojibakeMarkers(source);
  return { forbiddenHits, markerHits, pass: forbiddenHits.length === 0 && markerHits.length === 0, path };
});
const routeResults = await Promise.all(routes.map(checkRoute));
const status =
  registration.every((item) => item.pass) &&
  helperResults.every((item) => item.pass) &&
  routeResults.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(JSON.stringify({ helperResults, registration, routeResults, status }, null, 2));

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
    .replace(/\s+/g, " ")
    .trim();
}

function findHardMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
