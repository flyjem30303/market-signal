import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routes = [
  { path: "/stocks/TWII", required: ["正式市場資料尚未啟用", "資料品質", "下一步觀察"] },
  { path: "/stocks/2330", required: ["正式市場資料尚未啟用", "資料品質", "下一步觀察"] },
  { path: "/stocks/0050", required: ["正式市場資料尚未啟用", "資料品質", "下一步觀察"] }
];

const forbiddenVisibleTerms = ["publicDataSource", "scoreSource", "mock-only", "cmd.exe", "npm run", "packet", "operator"];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-source-coverage-runtime-labels"] ===
      "node scripts/check-public-beta-source-coverage-runtime-labels.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-source-coverage-runtime-labels.mjs") &&
      reviewGate.includes('"public-beta-source-coverage-runtime-labels"')
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
