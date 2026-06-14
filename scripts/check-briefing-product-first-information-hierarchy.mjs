import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const briefingPath = "src/app/briefing/page.tsx";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const problems = [];

const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const briefing = read(briefingPath);

if (
  pkg.scripts?.["check:briefing-product-first-information-hierarchy"] !==
  "node scripts/check-briefing-product-first-information-hierarchy.mjs"
) {
  problems.push(`${packagePath} missing check:briefing-product-first-information-hierarchy`);
}

for (const phrase of [
  "scripts/check-briefing-product-first-information-hierarchy.mjs",
  '"briefing-product-first-information-hierarchy"'
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
}

const orderedSourceMarkers = [
  "<BriefingPublicDecisionSummaryPanel",
  "briefing-market-action-summary",
  "briefing-alert-decision-list",
  "<DataFreshnessStrip",
  "<PublicBetaPublicStatusSurface",
  "<PublicBetaMembershipMvpRoadmap"
];

assertOrder("briefing source product-first component order", briefing, orderedSourceMarkers);

const briefingResponse = await fetch(`${baseUrl}/briefing`);
const briefingHtml = await briefingResponse.text();
const visible = normalize(briefingHtml);

if (briefingResponse.status !== 200) problems.push(`/briefing returned ${briefingResponse.status}`);
if (visible.length > 16000) {
  problems.push(`briefing visible text too dense for product-first Beta surface: ${visible.length}`);
}

const orderedVisibleMarkers = [
  "市場訊號晨報",
  "30 秒看懂今日市場氣氛",
  "3 分鐘行動判斷",
  "今日提醒",
  "市場主燈號",
  "資料狀態",
  "公開使用狀態",
  "下一階段會員功能"
];

assertOrder("briefing visible product-first order", visible, orderedVisibleMarkers);

for (const forbidden of [
  "cmd.exe",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "blocker",
  "publicDataSource",
  "scoreSource",
  "Runtime Status",
  "Supabase",
  "SQL",
  "raw market data"
]) {
  if (visible.includes(forbidden)) problems.push(`briefing visible text must not include ${forbidden}`);
}

for (const phrase of ["示範資料", "示範分數", "市場氣氛", "資料狀態", "正式資料尚未啟用", "不提供買賣建議"]) {
  if (!visible.includes(phrase)) {
    problems.push(`briefing visible text missing ${phrase}`);
  }
}

if (problems.length) {
  console.error(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ checkedRoutes: ["/briefing"], guardedStatus: "briefing_product_first_information_hierarchy_ready", status: "ok" }, null, 2));

function assertOrder(label, text, markers) {
  let cursor = -1;
  for (const marker of markers) {
    const index = text.indexOf(marker, cursor + 1);
    if (index < 0) {
      problems.push(`${label} missing ${marker}`);
      continue;
    }
    if (index <= cursor) {
      problems.push(`${label} has ${marker} out of order`);
    }
    cursor = index;
  }
}

function normalize(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing ${path}`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}
