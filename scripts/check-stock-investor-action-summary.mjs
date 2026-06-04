import fs from "node:fs";

const helperPath = "src/lib/investor-action-summary.ts";
const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const helper = fs.readFileSync(helperPath, "utf8");
const component = fs.readFileSync(componentPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const pkg = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const requiredHelperPhrases = [
  "buildInvestorActionSummary",
  "InvestorActionSummary",
  "observationFocus",
  "primaryRisk",
  "stopCondition",
  "safetyLine",
  "publicDataSource=mock",
  "scoreSource=mock",
  "不構成投資建議",
  "停看條件",
  "資料品質檢查",
  "mock-only",
  "missingModuleFlags",
  "staleDataFlags",
  "snapshot.modules.reduce"
];

const requiredComponentPhrases = [
  "buildInvestorActionSummary",
  "StockInvestorActionSummary",
  "Stock Investor Action Summary",
  "Investor Action Summary",
  "summary.observationFocus",
  "summary.primaryRisk",
  "summary.stopCondition",
  "summary.safetyLine",
  "onTab(item.tab)",
  "StockDecisionCompass scoreSourceLabel",
  "StockMarketContextPanel"
];

const requiredCssPhrases = [
  ".stock-investor-action-summary",
  ".investor-action-grid",
  ".investor-action-grid article.active",
  ".investor-action-grid article.hold",
  ".investor-action-grid article.blocked",
  ".investor-action-grid button:hover"
];

const forbiddenPhrases = [
  "createClient",
  "fetch(",
  ".from(\"",
  ".from('",
  "process.env",
  "SUPABASE",
  "scoreSource=real",
  "publicDataSource=supabase"
];

const missing = [
  ...requiredHelperPhrases.filter((phrase) => !helper.includes(phrase)).map((phrase) => `${helperPath}: ${phrase}`),
  ...requiredComponentPhrases.filter((phrase) => !component.includes(phrase)).map((phrase) => `${componentPath}: ${phrase}`),
  ...requiredCssPhrases.filter((phrase) => !css.includes(phrase)).map((phrase) => `${cssPath}: ${phrase}`),
  ...(!pkg.includes('"check:stock-investor-action-summary"') ? [`${packagePath}: check:stock-investor-action-summary`] : []),
  ...(!reviewGate.includes("check-stock-investor-action-summary.mjs") ? [`${reviewGatePath}: check-stock-investor-action-summary.mjs`] : [])
];

const forbidden = forbiddenPhrases.filter((phrase) => helper.includes(phrase) || component.includes(phrase));

console.log(JSON.stringify({ forbidden, missing, status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || forbidden.length > 0) process.exitCode = 1;
