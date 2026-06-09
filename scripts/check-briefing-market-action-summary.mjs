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
  [helperPath, "市場風險升溫"],
  [helperPath, "市場暫時偏穩"],
  [helperPath, "不提供買賣建議"],
  [helperPath, "mock-only 公開 Beta"],
  [helperPath, "promotion gate"],
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
  [packagePath, '"check:briefing-market-action-summary"'],
  [reviewGatePath, "check-briefing-market-action-summary.mjs"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, '.from("'],
  [helperPath, ".from('"],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, 'scoreSource: "real"'],
  [helperPath, 'publicDataSource: "supabase"'],
  [pagePath, 'scoreSource="real"'],
  [pagePath, 'publicDataSource="supabase"']
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const mojibakeHits = findMojibakeMarkers(read(helperPath)).map((marker) => `${helperPath}: ${marker}`);

console.log(
  JSON.stringify(
    {
      blocked: [...blocked, ...mojibakeHits],
      missing,
      status: missing.length === 0 && blocked.length === 0 && mojibakeHits.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0 || mojibakeHits.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}

function findMojibakeMarkers(source) {
  const markers = ["嚙", "銝", "蝷", "鞈", "撠", "甇", "餃", "", "", "", "", "", "�"];
  const privateUse = /[\uE000-\uF8FF]/u.test(source) ? ["private-use-codepoint"] : [];
  return [...markers.filter((marker) => source.includes(marker)), ...privateUse];
}
