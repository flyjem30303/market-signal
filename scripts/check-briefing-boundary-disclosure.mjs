import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const page = fs.readFileSync(pagePath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredPagePhrases = [
  "Model Boundary",
  "mock 分數不等於正式模型結論",
  "publicDataSource=mock",
  "scoreSource=mock",
  "partial coverage",
  "missing/delayed data",
  "資料新鮮度",
  "模型限制",
  "非投資建議",
  "not-live-yet",
  "BoundaryItem",
  "Briefing Compass",
  "模型邊界",
  "市場結構",
  "閱讀策略",
  "觀察清單",
  "model-boundary",
  "market-structure",
  "briefing-playbook",
  "watchlists",
  "晨報公開邊界",
  "目前可讀",
  "資料限制",
  "禁止宣稱",
  "DecisionPill",
  "Market Breadth",
  "可閱讀",
  "風險升溫",
  "buildMarketBreadth",
  "BreadthCard",
  "Concentration Check",
  "市場集中度",
  "領先族群",
  "正向占比",
  "buildConcentrationSignal",
  "ConcentrationPanel",
  "Briefing Playbook",
  "今天的閱讀策略",
  "方向",
  "廣度",
  "邊界",
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

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
