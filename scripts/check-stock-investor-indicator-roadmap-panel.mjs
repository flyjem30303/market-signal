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
  [componentPath, "Investor Indicator Roadmap"],
  [componentPath, "Indicator Roadmap"],
  [componentPath, "未來專業指標路線"],
  [componentPath, "roadmap.boundary.statement"],
  [componentPath, "roadmap.families.map"],
  [componentPath, "getInvestorIndicatorStatusLabel"],
  [componentPath, "mock 可讀"],
  [componentPath, "設計保留"],
  [componentPath, "等待真實資料"],
  [contractPath, "publicDataSource: \"mock\""],
  [contractPath, "scoreSource: \"mock\""],
  [contractPath, "不提供買賣建議"],
  [cssPath, ".stock-investor-indicator-roadmap"],
  [cssPath, ".indicator-roadmap-grid"],
  [cssPath, ".indicator-roadmap-grid article.mock-readable"],
  [cssPath, ".indicator-roadmap-grid article.design-only"],
  [cssPath, ".indicator-roadmap-grid article.blocked-until-real-data"],
  [packagePath, "\"check:stock-investor-indicator-roadmap-panel\""],
  [reviewGatePath, "check-stock-investor-indicator-roadmap-panel.mjs"]
];

const forbidden = [
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from(\""],
  [componentPath, ".from('"],
  [componentPath, "scoreSource=\"real\""],
  [componentPath, "publicDataSource=\"supabase\""],
  [contractPath, "scoreSource: \"real\""],
  [contractPath, "publicDataSource: \"supabase\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

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
