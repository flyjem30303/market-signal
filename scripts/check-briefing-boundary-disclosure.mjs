import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const page = fs.readFileSync(pagePath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredPagePhrases = [
  "Model Boundary",
  "目前為 mock 訊號體驗",
  "分數仍是模擬評分",
  "不代表真實模型、真實資料驗證或投資建議",
  "分數來源",
  "mock",
  "資料深度",
  "not_ready",
  "公開宣稱",
  "blocked",
  "BoundaryItem",
  "CEO Decision Strip",
  "可推進",
  "暫緩",
  "封鎖",
  "DecisionPill",
  "Market Breadth",
  "強勢",
  "風險升溫",
  "buildMarketBreadth",
  "BreadthCard",
  "Concentration Check",
  "族群集中度檢查",
  "主導族群",
  "強勢占比",
  "buildConcentrationSignal",
  "ConcentrationPanel",
  "Briefing Playbook",
  "今日行動框架",
  "今日姿態",
  "觀察焦點",
  "避免事項",
  "buildBriefingPlaybook"
];

const requiredCssPhrases = [
  ".briefing-boundary",
  ".briefing-boundary-grid",
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
  "真實模型輸出",
  "已通過真實資料驗證",
  "這是投資建議",
  "屬於投資建議",
  "scoreSource=real",
  "sourceDepthState=approved",
  "public claim approved"
];

const missing = [
  ...requiredPagePhrases.filter((phrase) => !page.includes(phrase)).map((phrase) => `${pagePath}: ${phrase}`),
  ...requiredCssPhrases.filter((phrase) => !css.includes(phrase)).map((phrase) => `${cssPath}: ${phrase}`)
];
const forbidden = forbiddenPhrases.filter((phrase) => page.includes(phrase));

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
