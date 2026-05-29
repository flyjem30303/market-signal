import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";

const component = fs.readFileSync(componentPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredComponentPhrases = [
  "StockDecisionCompass",
  "Stock Decision Compass",
  "StockPageCompass",
  "Stock Page Compass",
  "StockModuleHighlights",
  "Stock Module Highlights",
  "StockEvidenceSnapshot",
  "Stock Evidence Snapshot",
  "StockDataGapPanel",
  "Stock Data Gap Panel",
  "StockRiskChecklist",
  "Stock Risk Checklist",
  "StockNextStepGuide",
  "Stock Next Step Guide",
  "StockDecisionBoundary",
  "Stock Decision Boundary",
  "StockReviewQueue",
  "Stock Review Queue",
  "scoreSourceLabel",
  "snapshot.riskScore",
  "snapshot.healthScore",
  "snapshot.missingModuleFlags",
  "snapshot.modelVersion",
  "snapshot.dataQualityGrade",
  "snapshot.lastUpdatedAt",
  "目前證據狀態",
  "資料缺口清單",
  "看完燈號後怎麼做",
  "目前能做與不能做",
  "下一輪覆核問題",
  "資料覆核",
  "模型覆核",
  "風險覆核",
  "不代表已排會或已授權",
  "可以做",
  "不能做",
  "宣稱真實訊號",
  "直接產生買賣建議",
  "公開宣稱審核完成",
  "不提供買賣建議",
  "mock 分數",
  "先確認資料可靠度",
  "先拆解風險來源",
  "不足時先不下結論"
];

const requiredCssPhrases = [
  ".stock-decision-compass",
  ".stock-decision-compass article.active",
  ".stock-decision-compass article.hold",
  ".stock-decision-compass article.blocked",
  ".stock-page-compass",
  ".stock-page-compass button.active",
  ".stock-evidence-snapshot",
  ".evidence-snapshot-grid",
  ".evidence-snapshot-grid strong",
  ".stock-data-gap-panel",
  ".data-gap-list",
  ".data-gap-list button:hover",
  ".stock-module-highlights",
  ".stock-module-highlights article.risk",
  ".stock-module-highlights article.gap",
  ".stock-risk-checklist",
  ".risk-check-grid",
  ".risk-check-grid article.watch",
  ".stock-next-step-guide",
  ".next-step-grid",
  ".next-step-grid button:hover",
  ".stock-decision-boundary",
  ".decision-boundary-grid",
  ".decision-boundary-grid article.blocked",
  ".stock-review-queue",
  ".review-queue-grid",
  ".review-queue-grid button:hover"
];

const forbiddenPhrases = [
  "真實分數已輸出",
  "使用真實市場資料回測",
  "已可作為投資建議",
  "核准公開投資建議",
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
