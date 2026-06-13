import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const dashboardPath = "src/components/dashboard-shell.tsx";
const helperPath = "src/lib/public-beta-index-dashboard-brief-loop.ts";
const componentPath = "src/components/public-beta-index-dashboard-brief-loop-panel.tsx";
const briefPath = "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md";

const problems = [];
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const helper = fs.readFileSync(helperPath, "utf8");
const component = fs.readFileSync(componentPath, "utf8");
const brief = fs.readFileSync(briefPath, "utf8");

if (
  packageJson.scripts?.["check:public-beta-index-dashboard-brief-loop"] !==
  "node scripts/check-public-beta-index-dashboard-brief-loop.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-index-dashboard-brief-loop`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-public-beta-index-dashboard-brief-loop.mjs",
  "public-beta-index-dashboard-brief-loop"
]);

requireIncludes("BRIEF", brief, [
  "understand the market mood within 30 seconds",
  "decide within 3 minutes",
  "Home includes three layers: full-market overview, core indicator panel, alert list",
  "Each alert includes status, cause, update time, impact level, and next step",
  "Phase 1 是「所有人可以使用的公開免費指數燈號網站」",
  "Phase 2 是「會員 MVP」",
  "Phase 1 is current execution priority.",
  "Phase 2 should not delay Phase 1 launch readiness."
]);

requireIncludes("home dashboard source", dashboard, [
  "home-public-beta-layers",
  "市場氣氛",
  "市場廣度",
  "核心指標快讀",
  "資料可信度",
  "3 分鐘行動判斷"
]);

requireIncludes("home dashboard helper", helper, [
  "30 秒可讀",
  "3 分鐘可行動",
  "全市場總覽",
  "核心指標",
  "警示清單",
  "示範資料",
  "不提供個股買賣建議"
]);

requireIncludes("home dashboard component", component, [
  "Index Dashboard",
  "indicatorPanel",
  "alerts",
  "stopLine"
]);

const response = await fetch(`${baseUrl}/`);
const text = normalizeVisibleText(await response.text());
const requiredVisible = [
  "指數狀態儀表站",
  "30 秒",
  "3 分鐘",
  "市場氣氛",
  "市場廣度",
  "風險熱度",
  "資料可信度",
  "示範資料",
  "非投資建議",
  "會員功能預覽"
];

const forbiddenVisible = [
  "Public Beta pre-launch executable state",
  "CURRENT HARD BLOCKERS",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "EXTERNAL REPLY DRY-RUN",
  "REQUEST BLOCKS",
  "cmd.exe",
  "npm run",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "readonly-attempt",
  "post-run",
  "preflight",
  "operator",
  "Phase 1",
  "Phase 2",
  "Membership MVP"
];

if (response.status !== 200) problems.push(`/ must return 200, got ${response.status}`);
requireIncludes("home page", text, requiredVisible);
requireExcludes("home page", text, forbiddenVisible);

const markerHits = findMojibakeMarkers(text);
for (const marker of markerHits) problems.push(`home page marker ${marker}`);

const sourceMarkerHits = [
  ...findMojibakeMarkers(dashboard).map((marker) => `${dashboardPath}: ${marker}`),
  ...findMojibakeMarkers(helper).map((marker) => `${helperPath}: ${marker}`),
  ...findMojibakeMarkers(component).map((marker) => `${componentPath}: ${marker}`),
  ...findMojibakeMarkers(brief).map((marker) => `${briefPath}: ${marker}`)
];
for (const marker of sourceMarkerHits) problems.push(`source marker ${marker}`);

const status = problems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      checkedRoutes: ["/"],
      problems,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function requireIncludes(label, text, needles) {
  for (const needle of needles) {
    if (!text.includes(needle)) problems.push(`${label} missing ${needle}`);
  }
}

function requireExcludes(label, text, needles) {
  for (const needle of needles) {
    if (text.includes(needle)) problems.push(`${label} must not expose ${needle}`);
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

function findMojibakeMarkers(source) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(source)) markers.push("private-use-or-replacement-codepoint");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("control-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
