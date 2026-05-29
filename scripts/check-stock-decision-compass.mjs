import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";

const component = fs.readFileSync(componentPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredComponentPhrases = [
  "StockDecisionCompass",
  "Stock Decision Compass",
  "模型狀態",
  "風險溫度",
  "閱讀順序",
  "目前仍是 mock 閱讀體驗",
  "不把分數當成交易訊號",
  "scoreSourceLabel",
  "snapshot.riskScore",
  "StockPageCompass",
  "Stock Page Compass",
  "分數與模型狀態",
  "長期分數路徑",
  "歷史模擬表現"
];

const requiredCssPhrases = [
  ".stock-decision-compass",
  ".stock-decision-compass article.active",
  ".stock-decision-compass article.hold",
  ".stock-decision-compass article.blocked",
  ".stock-page-compass",
  ".stock-page-compass button.active"
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
  ...requiredComponentPhrases
    .filter((phrase) => !component.includes(phrase))
    .map((phrase) => `${componentPath}: ${phrase}`),
  ...requiredCssPhrases.filter((phrase) => !css.includes(phrase)).map((phrase) => `${cssPath}: ${phrase}`)
];
const forbidden = forbiddenPhrases.filter((phrase) => component.includes(phrase));

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
