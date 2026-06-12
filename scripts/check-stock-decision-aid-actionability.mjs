import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const dashboardPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const u = (value) => JSON.parse(`"${value}"`);

const requiredVisible = [
  "Decision Aid Summary",
  u("\\u6c7a\\u7b56\\u8f14\\u52a9\\u6458\\u8981"),
  u("\\u6210\\u56e0"),
  u("\\u66f4\\u65b0\\u6642\\u9593"),
  u("\\u5f71\\u97ff\\u7d1a\\u5225"),
  u("\\u4e0b\\u4e00\\u6b65\\u89c0\\u5bdf"),
  u("3 \\u5206\\u9418\\u78ba\\u8a8d"),
  "publicDataSource=mock",
  "scoreSource=mock"
];

const forbidden = [
  "cmd.exe",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource=supabase approved",
  "scoreSource=real approved",
  "SQL execution is approved",
  "Supabase writes are approved",
  "raw market data fetch is approved"
];

const files = new Map(
  [dashboardPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const dashboard = files.get(dashboardPath) ?? "";
const componentStart = dashboard.indexOf("function StockDecisionAidSummaryPanel");
const componentEnd = dashboard.indexOf("function StockEvidenceSnapshot", componentStart);
const componentSource = componentStart >= 0 && componentEnd > componentStart
  ? dashboard.slice(componentStart, componentEnd)
  : "";

const sourceResults = [
  {
    markerHits: findMojibakeMarkers(componentSource),
    missing: [
      "StockDecisionAidSummaryPanel",
      u("\\u6210\\u56e0"),
      u("\\u66f4\\u65b0\\u6642\\u9593"),
      u("\\u5f71\\u97ff\\u7d1a\\u5225"),
      u("\\u4e0b\\u4e00\\u6b65\\u89c0\\u5bdf"),
      "publicDataSource=mock",
      "scoreSource=mock"
    ].filter((phrase) => !componentSource.includes(phrase)),
    path: dashboardPath
  }
].map((item) => ({
  ...item,
  pass: item.markerHits.length === 0 && item.missing.length === 0
}));

const routeResults = await Promise.all(["/stocks/2330", "/stocks/TWII", "/stocks/0050"].map(checkRoute));

const packageJson = JSON.parse(files.get(packagePath) ?? "{}");
const reviewGate = files.get(reviewGatePath) ?? "";
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:stock-decision-aid-actionability"] ===
      "node scripts/check-stock-decision-aid-actionability.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-stock-decision-aid-actionability.mjs") &&
      reviewGate.includes('"stock-decision-aid-actionability"')
  }
];

const status =
  sourceResults.every((item) => item.pass) &&
  routeResults.every((item) => item.pass) &&
  registration.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(JSON.stringify({ registration, routeResults, sourceResults, status }, null, 2));

if (status !== "ok") process.exitCode = 1;

async function checkRoute(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const text = normalizeVisibleText(html);
  const missing = requiredVisible.filter((phrase) => !text.includes(phrase));
  const forbiddenHits = forbidden.filter((phrase) => text.includes(phrase));
  const markerHits = findMojibakeMarkers(text);

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

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
