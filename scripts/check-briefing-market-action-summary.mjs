import fs from "node:fs";

const helperPath = "src/lib/briefing-market-action-summary.ts";
const pagePath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, pagePath, cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [helperPath, "buildBriefingMarketActionSummary"],
  [helperPath, "BriefingMarketActionSummary"],
  [helperPath, "primary"],
  [helperPath, "secondary"],
  [helperPath, "marketLine"],
  [helperPath, "publicDataSource=mock"],
  [helperPath, "scoreSource=mock"],
  [helperPath, "不提供買賣建議"],
  [pagePath, "buildBriefingMarketActionSummary"],
  [pagePath, "marketActionSummary"],
  [pagePath, "briefing-market-action-summary"],
  [pagePath, "Market Action Summary"],
  [pagePath, "briefing_market_action_primary"],
  [pagePath, "briefing_market_action_secondary"],
  [cssPath, ".briefing-market-action-summary"],
  [cssPath, ".briefing-market-action-summary a.active"],
  [cssPath, ".briefing-market-action-summary a.hold"],
  [cssPath, ".briefing-market-action-summary a.blocked"],
  [packagePath, "\"check:briefing-market-action-summary\""],
  [reviewGatePath, "check-briefing-market-action-summary.mjs"]
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
