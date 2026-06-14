import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const page = fs.readFileSync(pagePath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredPagePhrases = [
  "Model Boundary",
  "目前是 mock runtime，不是正式市場資料",
  "publicDataSource=mock",
  "scoreSource=mock",
  "partial coverage",
  "missing/delayed data",
  "真實資料尚未上線",
  "示範資料",
  "Briefing Compass",
  "model-boundary",
  "market-structure",
  "briefing-playbook",
  "watchlists",
  "DecisionPill",
  "Market Breadth",
  "Concentration Check",
  "buildMarketBreadth",
  "BreadthCard",
  "buildConcentrationSignal",
  "ConcentrationPanel",
  "Briefing Playbook",
  "三步驟閱讀市場訊號",
  "先讀市場氣氛",
  "再看風險與廣度",
  "最後確認結構",
  "buildBriefingPlaybook"
];

const requiredCssPhrases = [
  ".briefing-boundary",
  ".briefing-boundary-grid",
  ".briefing-compass",
  ".briefing-decision-strip",
  ".decision-pill",
  ".briefing-breadth",
  ".breadth-card",
  ".briefing-concentration",
  ".concentration-metrics",
  ".briefing-playbook",
  ".playbook-grid",
  ".playbook-card",
  "grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr)",
  ".briefing-boundary-grid article"
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
