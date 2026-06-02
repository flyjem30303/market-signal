import fs from "node:fs";

const helperPath = "src/lib/home-market-action-summary.ts";
const dashboardPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const helper = fs.readFileSync(helperPath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const required = [
  [helperPath, "buildHomeMarketActionSummary"],
  [helperPath, "HomeMarketActionSummary"],
  [helperPath, "primaryAction"],
  [helperPath, "secondaryAction"],
  [helperPath, "marketBreadthLine"],
  [helperPath, "publicDataSource=mock"],
  [helperPath, "scoreSource=mock"],
  [helperPath, "不提供買賣建議"],
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

const files = new Map([
  [helperPath, helper],
  [dashboardPath, dashboard],
  [cssPath, css],
  [packagePath, packageJson],
  [reviewGatePath, reviewGate]
]);

const missing = required.filter(([file, phrase]) => !files.get(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => files.get(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

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
