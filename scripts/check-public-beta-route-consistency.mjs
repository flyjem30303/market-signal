import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routes = [
  { path: "/", required: ["市場總覽", "核心指標", "警示清單"] },
  { path: "/briefing", required: ["市場廣度", "下一步觀察", "資料品質"] },
  { path: "/stocks/2330", required: ["30 秒快讀", "決策輔助摘要", "下一步觀察"] }
];

const forbiddenVisibleTerms = ["publicDataSource", "scoreSource", "mock-only", "cmd.exe", "npm run", "packet", "operator"];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-route-consistency"] ===
      "node scripts/check-public-beta-route-consistency.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-route-consistency.mjs") &&
      reviewGate.includes('"public-beta-route-consistency"')
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
    .replace(/\s+/g, " ")
    .trim();
}

function findHardMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
