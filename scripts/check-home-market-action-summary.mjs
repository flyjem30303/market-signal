import fs from "node:fs";

const helperPath = "src/lib/home-market-action-summary.ts";
const dashboardPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, dashboardPath, cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [helperPath, "buildHomeMarketActionSummary"],
  [helperPath, "HomeMarketActionSummary"],
  [helperPath, "primaryAction"],
  [helperPath, "secondaryAction"],
  [helperPath, "marketBreadthLine"],
  [helperPath, "publicDataSource=mock"],
  [helperPath, "scoreSource=mock"],
  [helperPath, "資料品質優先"],
  [helperPath, "優先檢查風險"],
  [helperPath, "相對強勢"],
  [helperPath, "missingModuleFlags"],
  [helperPath, "staleDataFlags"],
  [dashboardPath, "buildHomeMarketActionSummary"],
  [dashboardPath, "home-market-action-summary"],
  [dashboardPath, "Market Action Summary"],
  [dashboardPath, "actionSummary.primaryAction"],
  [dashboardPath, "actionSummary.secondaryAction"],
  [dashboardPath, "home_market_action_primary"],
  [dashboardPath, "home_market_action_secondary"],
  [cssPath, ".home-market-action-summary"],
  [cssPath, ".home-market-action-summary article.active"],
  [cssPath, ".home-market-action-summary article.hold"],
  [cssPath, ".home-market-action-summary article.blocked"],
  [packagePath, "\"check:home-market-action-summary\""],
  [reviewGatePath, "check-home-market-action-summary.mjs"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from(\""],
  [helperPath, ".from('"],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "publicDataSource: \"supabase\""],
  [dashboardPath, "scoreSource=\"real\""],
  [dashboardPath, "publicDataSource=\"supabase\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}
