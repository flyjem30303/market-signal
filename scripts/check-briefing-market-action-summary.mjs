import fs from "node:fs";

const helperPath = "src/lib/briefing-market-action-summary.ts";
const decisionHelperPath = "src/lib/briefing-public-decision-summary.ts";
const decisionPanelPath = "src/components/briefing-public-decision-summary-panel.tsx";
const pagePath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const paths = [helperPath, decisionHelperPath, decisionPanelPath, pagePath, cssPath, packagePath, reviewGatePath];
const files = new Map(paths.map((file) => [file, fs.readFileSync(file, "utf8")]));

const required = [
  [helperPath, "buildBriefingMarketActionSummary"],
  [helperPath, "BriefingMarketActionSummary"],
  [helperPath, "primary"],
  [helperPath, "secondary"],
  [helperPath, "marketLine"],
  [helperPath, "publicDataSource=mock"],
  [helperPath, "scoreSource=mock"],
  [helperPath, "\\u5e02\\u5834\\u98a8\\u96aa"],
  [helperPath, "\\u5e02\\u5834\\u6c23\\u6c1b"],
  [helperPath, "不提供個股買賣建議"],
  [helperPath, "mock-only"],
  [decisionHelperPath, "buildBriefingPublicDecisionSummary"],
  [decisionHelperPath, "30 秒看懂今日市場氣氛"],
  [decisionHelperPath, "3 分鐘內先看市場氣氛"],
  [decisionHelperPath, "publicDataSource=mock"],
  [decisionHelperPath, "scoreSource=mock"],
  [decisionHelperPath, "不提供買賣建議"],
  [decisionPanelPath, "BriefingPublicDecisionSummaryPanel"],
  [decisionPanelPath, "市場狀態"],
  [decisionPanelPath, "更新時間"],
  [decisionPanelPath, "影響級別"],
  [decisionPanelPath, "下一步"],
  [pagePath, "BriefingPublicDecisionSummaryPanel"],
  [pagePath, "buildBriefingMarketActionSummary"],
  [pagePath, "marketActionSummary"],
  [pagePath, "briefing-market-action-summary"],
  [pagePath, "briefing_market_action_primary"],
  [pagePath, "briefing_market_action_secondary"],
  [pagePath, "30 秒看懂今日市場氣氛"],
  [pagePath, "3 分鐘行動判斷"],
  [pagePath, "今日提醒"],
  [cssPath, ".briefing-public-decision-summary"],
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
  [decisionHelperPath, "@supabase/supabase-js"],
  [decisionHelperPath, "createClient"],
  [decisionHelperPath, "fetch("],
  [decisionHelperPath, ".from(\""],
  [decisionHelperPath, ".from('"],
  [decisionHelperPath, "process.env"],
  [decisionHelperPath, "node:fs"],
  [decisionHelperPath, "scoreSource: \"real\""],
  [decisionHelperPath, "publicDataSource: \"supabase\""],
  [decisionPanelPath, "@supabase/supabase-js"],
  [decisionPanelPath, "createClient"],
  [decisionPanelPath, "fetch("],
  [decisionPanelPath, ".from(\""],
  [decisionPanelPath, ".from('"],
  [decisionPanelPath, "process.env"],
  [decisionPanelPath, "node:fs"],
  [pagePath, "scoreSource=\"real\""],
  [pagePath, "publicDataSource=\"supabase\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const mojibakeHits = [helperPath, decisionHelperPath, decisionPanelPath, pagePath].flatMap((file) =>
  findMojibakeMarkers(read(file)).map((marker) => `${file}: ${marker}`)
);

console.log(JSON.stringify({ blocked: [...blocked, ...mojibakeHits], missing, status: missing.length === 0 && blocked.length === 0 && mojibakeHits.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0 || mojibakeHits.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
