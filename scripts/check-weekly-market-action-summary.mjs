import fs from "node:fs";

const helperPath = "src/lib/weekly-market-action-summary.ts";
const pagePath = "src/app/weekly/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const files = new Map(
  [helperPath, pagePath, cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [helperPath, "buildWeeklyMarketActionSummary"],
  [helperPath, "WeeklyMarketActionSummary"],
  [helperPath, "primary"],
  [helperPath, "secondary"],
  [helperPath, "weeklyLine"],
  [helperPath, "本週示範資料顯示"],
  [helperPath, "市場狀態"],
  [helperPath, "風險觀察"],
  [helperPath, "ETF 觀察"],
  [helperPath, "不是投資建議"],
  [pagePath, "buildWeeklyMarketActionSummary"],
  [pagePath, "actionSummary"],
  [pagePath, "weekly-market-action-summary"],
  [pagePath, "週報行動摘要"],
  [pagePath, "weekly_market_action_primary"],
  [pagePath, "weekly_market_action_secondary"],
  [pagePath, "資料更新時間"],
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
  [pagePath, "publicDataSource=\"supabase\""],
  [pagePath, "Phase 1"],
  [pagePath, "Phase 2"],
  [pagePath, "Membership MVP"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const rendered = await checkRenderedRoute();

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      rendered,
      status: missing.length === 0 && blocked.length === 0 && rendered.pass ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0 || !rendered.pass) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}

async function checkRenderedRoute() {
  try {
    const response = await fetch(`${baseUrl}/weekly`);
    const visibleText = normalizeVisibleText(await response.text());
    const requiredVisible = ["市場週報", "30 秒", "資料更新時間", "示範資料", "非投資建議", "風險聲明"];
    const forbiddenVisible = ["Phase 1", "Phase 2", "Membership MVP", "cmd.exe", "npm run", "publicDataSource", "scoreSource"];
    const missingVisible = requiredVisible.filter((phrase) => !visibleText.includes(phrase));
    const blockedVisible = forbiddenVisible.filter((phrase) => visibleText.includes(phrase));

    return {
      blockedVisible,
      missingVisible,
      pass: response.status === 200 && missingVisible.length === 0 && blockedVisible.length === 0,
      status: response.status,
      visibleLength: visibleText.length
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      pass: false
    };
  }
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
