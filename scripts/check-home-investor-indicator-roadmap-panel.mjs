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
  [componentPath, "indicatorRoadmap"],
  [componentPath, "visibleIndicatorFamilies"],
  [componentPath, "home-indicator-roadmap"],
  [componentPath, "首頁未來專業指標路線"],
  [componentPath, "Indicator Roadmap"],
  [componentPath, "未來專業指標仍在準備階段"],
  [componentPath, "indicatorRoadmap.boundary.statement"],
  [componentPath, "visibleIndicatorFamilies.map"],
  [componentPath, "getInvestorIndicatorStatusLabel"],
  [contractPath, "publicDataSource: \"mock\""],
  [contractPath, "scoreSource: \"mock\""],
  [contractPath, "不提供買賣建議"],
  [cssPath, ".home-indicator-roadmap"],
  [cssPath, ".home-indicator-roadmap article.mock-readable"],
  [cssPath, ".home-indicator-roadmap article.design-only"],
  [cssPath, ".home-indicator-roadmap article.blocked-until-real-data"],
  [packagePath, "\"check:home-investor-indicator-roadmap-panel\""],
  [reviewGatePath, "check-home-investor-indicator-roadmap-panel.mjs"]
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
