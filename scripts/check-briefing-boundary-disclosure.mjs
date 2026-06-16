import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const page = fs.readFileSync(pagePath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredPagePhrases = [
  "DataFreshnessStrip",
  "PublicDataSourceBoundaryNotice",
  "PublicNextReadingFlow",
  "getDataFreshnessSnapshot",
  "getMarketSignalSourceStatus",
  "briefing-public-summary",
  "runtime-boundary-line",
  "briefing-executive-summary",
  "briefing-grid",
  "buildMarketBreadth",
  "briefing_page_viewed"
];

const requiredCssPhrases = [
  ".briefing-executive-summary",
  ".runtime-boundary-line",
  ".panel",
  ".briefing-actions"
];

const forbiddenPhrases = [
  "scoreSource=real",
  "publicDataSource=supabase",
  "sourceDepthState=approved",
  "public claim approved",
  "real market data is live",
  "complete coverage is approved",
  "investment advice is allowed"
];

const missing = [
  ...requiredPagePhrases.filter((phrase) => !page.includes(phrase)).map((phrase) => `${pagePath}: ${phrase}`),
  ...requiredCssPhrases.filter((phrase) => !css.includes(phrase)).map((phrase) => `${cssPath}: ${phrase}`)
];
const forbidden = forbiddenPhrases.filter((phrase) => page.includes(phrase));

for (const marker of findMojibakeMarkers(page)) {
  forbidden.push(`${pagePath}: ${marker}`);
}

console.log(JSON.stringify({ forbidden, missing, status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || forbidden.length > 0) process.exitCode = 1;

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
