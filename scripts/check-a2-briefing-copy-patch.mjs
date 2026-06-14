import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const decisionPanelPath = "src/components/briefing-public-decision-summary-panel.tsx";
const nextReadingPath = "src/components/public-next-reading-flow.tsx";
const packagePath = "package.json";

const page = fs.readFileSync(pagePath, "utf8");
const decisionPanel = fs.readFileSync(decisionPanelPath, "utf8");
const nextReading = fs.readFileSync(nextReadingPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const missing = [];
const blocked = [];

const requiredCopy = [
  "市場訊號晨報",
  "30 秒看懂今日市場氣氛",
  "BriefingPublicDecisionSummaryPanel",
  "市場狀態",
  "更新時間",
  "影響級別",
  "下一步",
  "3 分鐘行動判斷",
  "今日提醒",
  "市場主燈號",
  "資料狀態",
  "示範資料",
  "正式資料尚未啟用",
  "不提供買賣建議",
  "DataFreshnessStrip",
  "PublicBetaPublicStatusSurface",
  "PublicBetaMembershipMvpRoadmap",
  "briefing-market-action-summary",
  "briefing-alert-decision-list",
  "briefing-runtime-action-strip",
  "experience-flow-nav"
];

const forbiddenSource = [
  "@supabase/supabase-js",
  "createClient(",
  "fetch(",
  ".from(",
  ".insert(",
  ".update(",
  ".delete(",
  ".upsert(",
  "process.env",
  "publicDataSource=supabase",
  "scoreSource=real",
  "real market data is live",
  "complete coverage is approved",
  "investment advice is allowed",
  "rawPayload",
  "rowPayload",
  "stockIdPayload",
  "stock id payload"
];

for (const token of requiredCopy) {
  if (!combinedSource().includes(token)) missing.push(`briefing source: ${token}`);
}

for (const token of forbiddenSource) {
  if (combinedSource().includes(token)) blocked.push(`briefing source: forbidden token ${token}`);
}

for (const marker of findMojibakeMarkers(combinedSource())) {
  blocked.push(`briefing source: ${marker}`);
}

if (packageJson.scripts?.["check:a2-briefing-copy-patch"] !== "node scripts/check-a2-briefing-copy-patch.mjs") {
  missing.push(`${packagePath}: check:a2-briefing-copy-patch`);
}

const result = {
  blocked,
  missing,
  checked: {
    forbiddenSource: forbiddenSource.length,
    requiredCopy: requiredCopy.length
  },
  status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
};

console.log(JSON.stringify(result, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function combinedSource() {
  return [page, decisionPanel, nextReading].join("\n");
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
