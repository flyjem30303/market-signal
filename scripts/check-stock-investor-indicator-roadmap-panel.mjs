import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const contractPath = "src/lib/investor-indicator-roadmap.ts";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, contractPath, cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [componentPath, "getInvestorIndicatorRoadmap"],
  [componentPath, "InvestorIndicatorStatus"],
  [componentPath, "StockInvestorIndicatorRoadmap"],
  [componentPath, "<StockInvestorIndicatorRoadmap />"],
  [componentPath, "Stock investor indicator roadmap"],
  [componentPath, "指標路線圖"],
  [componentPath, "未來專業指標路線"],
  [componentPath, "roadmap.boundary.statement"],
  [componentPath, "roadmap.families.map"],
  [componentPath, "getInvestorIndicatorStatusLabel"],
  [componentPath, "目前維持示範資料與示範分數"],
  [componentPath, "mock 可讀"],
  [componentPath, "設計保留"],
  [componentPath, "等待真實資料"],
  [contractPath, 'publicDataSource: "mock"'],
  [contractPath, 'scoreSource: "mock"'],
  [contractPath, "投資指標目前只是 mock 路線圖"],
  [cssPath, ".stock-investor-indicator-roadmap"],
  [cssPath, ".indicator-roadmap-grid"],
  [cssPath, ".indicator-roadmap-grid article.mock-readable"],
  [cssPath, ".indicator-roadmap-grid article.design-only"],
  [cssPath, ".indicator-roadmap-grid article.blocked-until-real-data"],
  [packagePath, '"check:stock-investor-indicator-roadmap-panel"'],
  [reviewGatePath, "check-stock-investor-indicator-roadmap-panel.mjs"]
];

const forbidden = [
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from(\""],
  [componentPath, ".from('"],
  [componentPath, 'scoreSource="real"'],
  [componentPath, 'publicDataSource="supabase"'],
  [componentPath, "Runtime/data foundation"],
  [componentPath, "Future notes"],
  [contractPath, 'scoreSource: "real"'],
  [contractPath, 'publicDataSource: "supabase"'],
  [contractPath, "Market temperature"],
  [contractPath, "Stock health"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const focusedStockSection = sectionBetween(read(componentPath), "stock-investor-indicator-roadmap", "</section>");
const mojibakePattern = /[\uE000-\uF8FF\uFFFD]|[嚗餅銝蝡舫摰祇雿輻閮踹]{2,}|\?{2,}/u;

if (mojibakePattern.test(focusedStockSection)) {
  blocked.push(`${componentPath}: stock investor indicator roadmap contains mojibake-like text`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}

function sectionBetween(text, startNeedle, endNeedle) {
  const start = text.indexOf(startNeedle);
  if (start < 0) return "";
  const end = text.indexOf(endNeedle, start);
  return end < 0 ? text.slice(start) : text.slice(start, end + endNeedle.length);
}
