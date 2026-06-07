import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const packagePath = "package.json";

const page = fs.readFileSync(pagePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const missing = [];
const blocked = [];

const requiredCopy = [
  "市場訊號晨報",
  "示範資料",
  "示範分數",
  "覆蓋率不足",
  "資料缺漏或延遲",
  "資料新鮮度",
  "模型限制",
  "非投資建議",
  "正式資料與正式分數尚未上線",
  "不是即時市場資料",
  "不是投資建議",
  "完整覆蓋率",
  "mock 分數不等於正式模型結論",
  "DataFreshnessStrip",
  "PublicRuntimeStateStrip",
  "PostReadonlyProductStatus",
  "RuntimeReadinessPanel",
  "BriefingRowCoverageStatus",
  "SourceDepthBlockerPanel",
  "BlockerReadinessPanel",
  "NarrowApprovalOutcomePanel",
  "briefing-executive-summary",
  "briefing-runtime-action-strip",
  "briefing-boundary",
  "briefing-playbook"
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
  if (!page.includes(token)) missing.push(`${pagePath}: ${token}`);
}

for (const token of forbiddenSource) {
  if (page.includes(token)) blocked.push(`${pagePath}: forbidden token ${token}`);
}

for (const marker of findMojibakeMarkers(page)) {
  blocked.push(`${pagePath}: ${marker}`);
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

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
