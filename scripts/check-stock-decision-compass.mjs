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
  "StockRiskChecklist",
  "Stock Risk Checklist",
  "StockNextStepGuide",
  "Stock Next Step Guide",
  "scoreSourceLabel",
  "snapshot.riskScore",
  "snapshot.healthScore",
  "snapshot.missingModuleFlags",
  "snapshot.modelVersion",
  "snapshot.dataQualityGrade",
  "snapshot.lastUpdatedAt",
  "目前證據狀態",
  "模型版本",
  "資料品質",
  "來源深度與公開宣稱審核",
  "看完燈號後怎麼做",
  "第一步",
  "第二步",
  "停止點",
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
  ".stock-module-highlights",
  ".stock-module-highlights article.risk",
  ".stock-module-highlights article.gap",
  ".stock-risk-checklist",
  ".risk-check-grid",
  ".risk-check-grid article.watch",
  ".stock-next-step-guide",
  ".next-step-grid",
  ".next-step-grid button:hover"
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
