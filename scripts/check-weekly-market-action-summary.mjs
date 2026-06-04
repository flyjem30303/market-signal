import fs from "node:fs";

const helperPath = "src/lib/weekly-market-action-summary.ts";
const pagePath = "src/app/weekly/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, pagePath, cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [helperPath, "buildWeeklyMarketActionSummary"],
  [helperPath, "WeeklyMarketActionSummary"],
  [helperPath, "primary"],
  [helperPath, "secondary"],
  [helperPath, "weeklyLine"],
  [helperPath, "publicDataSource=mock"],
  [helperPath, "scoreSource=mock"],
  [helperPath, "本週先採防守觀察"],
  [helperPath, "ETF 與高風險標的"],
  [helperPath, "不提供買賣建議"],
  [pagePath, "buildWeeklyMarketActionSummary"],
  [pagePath, "marketActionSummary"],
  [pagePath, "weekly-market-action-summary"],
  [pagePath, "Market Action Summary"],
  [pagePath, "weekly_market_action_primary"],
  [pagePath, "weekly_market_action_secondary"],
  [cssPath, ".weekly-market-action-summary"],
  [cssPath, ".weekly-market-action-summary a.active"],
  [cssPath, ".weekly-market-action-summary a.hold"],
  [cssPath, ".weekly-market-action-summary a.blocked"],
  [packagePath, "\"check:weekly-market-action-summary\""],
  [reviewGatePath, "check-weekly-market-action-summary.mjs"]
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
  [pagePath, "scoreSource=\"real\""],
  [pagePath, "publicDataSource=\"supabase\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}
