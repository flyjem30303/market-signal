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
  "指數燈號網站 BRIEF",
  "Phase 1 is the public free index-lighting site",
  "Phase 2 is the membership MVP path",
  "Phase 1 is current execution priority.",
  "Phase 2 should not delay Phase 1 launch readiness.",
  "首頁可顯示市場總覽燈號、核心指標、主要風險提示與資料更新時間",
  "會員 watchlist + 自訂警示條件",
  "understand the market mood within 30 seconds",
  "decide within 3 minutes",
  "Home includes three layers: full-market overview, core indicator panel, alert list",
  "Each alert includes status, cause, update time, impact level, and next step"
]);

requireIncludes("home dashboard source", dashboard, [
  "home-public-beta-layers",
  "HomeFirstScreenDecisionSummary",
  "PublicBetaPublicStatusSurface",
  "PublicBetaSourceCoverageBridge",
  "PublicNextReadingFlow",
  "PublicBetaMembershipMvpRoadmap"
]);

requireIncludes("home dashboard helper", helper, [
  "PublicBetaIndexDashboardBriefLoop",
  "indicatorPanel",
  "alerts",
  "publicDataSource",
  "scoreSource"
]);

requireIncludes("home dashboard component", component, [
  "PublicBetaIndexDashboardBriefLoopPanel",
  "Index Dashboard",
  "indicatorPanel",
  "alerts",
  "stopLine"
]);

const response = await fetch(`${baseUrl}/`);
const text = normalizeVisibleText(await response.text());
const requiredVisible = [
  "指數燈號",
  "公開 Beta 指數狀態儀表站",
  "30 秒內看懂市場氛圍",
  "3 分鐘內判斷",
  "市場氣氛",
  "資料更新時間",
  "示範資料",
  "資料邊界",
  "會員功能規劃中",
  "不提供個股買賣建議"
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
  "Membership MVP"
];

if (response.status !== 200) problems.push(`/ must return 200, got ${response.status}`);
requireIncludes("home page", text, requiredVisible);
requireExcludes("home page", text, forbiddenVisible);

for (const [label, source] of [
  ["home page", text],
  [dashboardPath, dashboard],
  [helperPath, helper],
  [componentPath, component],
  [briefPath, brief]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${label} contains ${marker}`);
  }
}

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

function findBadEncodingMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-character");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/[?]{4,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
