import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const component = fs.readFileSync(componentPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const pkg = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const requiredComponentPhrases = [
  "DataFreshnessStrip",
  "PublicDataSourceBoundaryNotice",
  "PublicNextReadingFlow",
  "StockRuntimeAtAGlance",
  "StockMarketFacts",
  "StockEventContext",
  "StockDecisionCompass",
  "StockMarketContextPanel",
  "StockPublicSummary",
  "runtime-boundary-line"
];

const requiredCssPhrases = [
  ".stock-decision-compass",
  ".runtime-boundary-line",
  ".panel",
  ".briefing-actions"
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
  ...requiredComponentPhrases.filter((phrase) => !component.includes(phrase)).map((phrase) => `${componentPath}: ${phrase}`),
  ...requiredCssPhrases.filter((phrase) => !css.includes(phrase)).map((phrase) => `${cssPath}: ${phrase}`),
  ...(!pkg.includes('"check:stock-investor-action-summary"') ? [`${packagePath}: check:stock-investor-action-summary`] : []),
  ...(!reviewGate.includes("check-stock-investor-action-summary.mjs") ? [`${reviewGatePath}: check-stock-investor-action-summary.mjs`] : [])
];

const forbidden = forbiddenPhrases.filter((phrase) => component.includes(phrase));

console.log(JSON.stringify({ forbidden, missing, status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || forbidden.length > 0) process.exitCode = 1;
