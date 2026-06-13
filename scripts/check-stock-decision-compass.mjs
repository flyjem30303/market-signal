import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const component = fs.readFileSync(componentPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredComponentPhrases = [
  "function StockDecisionCompass",
  "Stock Decision Compass",
  "scoreSourceLabel",
  "snapshot.riskScore",
  "function StockInvestorActionSummary",
  "Investor Action Summary",
  "function StockIndicatorPriorityPanel",
  "指標優先順序",
  "function StockMarketContextPanel",
  "市場脈絡",
  "function StockDataBoundaryPanel",
  "資料邊界",
  "示範資料與示範分數",
  "不提供個股買賣建議"
];

const requiredCssPhrases = [
  ".stock-decision-compass",
  ".stock-investor-action-summary",
  ".stock-indicator-priority-panel",
  ".stock-indicator-priority-grid",
  ".stock-market-context",
  ".stock-risk-checklist"
];

const forbiddenComponentPhrases = [
  "真實分數已輸出",
  "使用真實市場資料回測",
  "已可作為投資建議",
  "核准公開投資建議",
  "scoreSource=real",
  "sourceDepthState=approved",
  "public claim approved"
];

const missing = [
  ...requiredComponentPhrases.filter((phrase) => !component.includes(phrase)).map((phrase) => `${componentPath}: ${phrase}`),
  ...requiredCssPhrases.filter((phrase) => !css.includes(phrase)).map((phrase) => `${cssPath}: ${phrase}`)
];
const forbidden = forbiddenComponentPhrases.filter((phrase) => component.includes(phrase));

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

if (missing.length > 0 || forbidden.length > 0) process.exitCode = 1;
