import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const dashboardPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const scriptName = "check:a2-home-first-screen-public-copy-handoff";
const gateName = "a2-home-first-screen-public-copy-handoff";

const requiredVisibleTerms = [
  "指數狀態儀表站",
  "30 秒可讀",
  "3 分鐘可行動",
  "正式市場資料尚未啟用",
  "不提供個股買賣建議"
];

const forbiddenVisibleTerms = [
  "hard blocker",
  "cmd.exe",
  "npm run",
  "packet proof",
  "pre-launch executable",
  "publicDataSource",
  "scoreSource",
  "Supabase",
  "SQL",
  "daily_prices",
  "raw market data"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");

const registration = [
  { file: packagePath, pass: packageJson.scripts?.[scriptName] === `node scripts/${scriptName.replace("check:", "check-")}.mjs` },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-a2-home-first-screen-public-copy-handoff.mjs") &&
      (reviewGate.includes(`"${gateName}"`) || reviewGate.includes(`name: "${gateName}"`))
  }
];

const sourceSlice = extractFirstScreenPublicCopy(dashboard);
const sourceResult = {
  forbiddenHits: forbiddenVisibleTerms.filter((phrase) => sourceSlice.includes(phrase)),
  markerHits: findHardMojibakeMarkers(sourceSlice),
  missing: requiredVisibleTerms.filter((phrase) => !dashboard.includes(phrase)),
  pass: sourceSlice.length > 0
};
sourceResult.pass =
  sourceResult.pass &&
  sourceResult.missing.length === 0 &&
  sourceResult.forbiddenHits.length === 0 &&
  sourceResult.markerHits.length === 0;

const routeResult = await checkRoute("/");
const status = registration.every((item) => item.pass) && sourceResult.pass && routeResult.pass ? "ok" : "blocked";

console.log(JSON.stringify({ registration, routeResult, sourceResult, status }, null, 2));

if (status !== "ok") process.exitCode = 1;

async function checkRoute(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = normalizeVisibleText(await response.text());
  const missing = requiredVisibleTerms.filter((phrase) => !text.includes(phrase));
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

function extractFirstScreenPublicCopy(source) {
  const heroStart = source.indexOf('<section className="hero dashboard-hero">');
  const end = source.indexOf("</section>", heroStart);
  if (heroStart === -1 || end === -1) return "";
  return source.slice(heroStart, end);
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
