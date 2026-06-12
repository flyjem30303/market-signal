import fs from "node:fs";
import http from "node:http";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const dashboardPath = "src/components/dashboard-shell.tsx";
const componentPath = "src/components/public-beta-index-dashboard-brief-loop-panel.tsx";
const modulePath = "src/lib/public-beta-index-dashboard-brief-loop.ts";
const cssPath = "src/app/globals.css";
const briefPath = "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const problems = [];

const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const dashboard = readText(dashboardPath);
const component = readText(componentPath);
const moduleSource = readText(modulePath);
const css = readText(cssPath);
const brief = readText(briefPath);

if (
  pkg.scripts?.["check:public-beta-index-dashboard-brief-loop"] !==
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
  "publicDataSource remains `mock`",
  "scoreSource remains `mock`"
]);

requireIncludes("home dashboard source", dashboard, [
  "PublicBetaIndexDashboardBriefLoopPanel",
  "<PublicBetaIndexDashboardBriefLoopPanel />"
]);

requireIncludes("brief loop module", moduleSource, [
  "getPublicBetaIndexDashboardBriefLoop",
  "30 秒看懂市場氣氛，3 分鐘形成下一步觀察",
  "30 秒看懂市場氛圍",
  "3 分鐘形成下一步觀察",
  "首頁把全市場總覽、核心指標與警示清單放在同一條路徑",
  "市場氛圍",
  "風險焦點",
  "資料可信度",
  "TWII 市場氛圍仍是示範狀態",
  "資料與分數仍維持 mock",
  "更新時間",
  "影響級別",
  "下一步",
  "不宣稱即時真實資料",
  "不提供買賣建議",
  "publicDataSource",
  "scoreSource"
]);

requireIncludes("brief loop component", component, [
  "home-public-beta-loop",
  "core indicator panel",
  "market alert list",
  "第一步",
  "第二步",
  "更新時間：",
  "影響級別：",
  "下一步：",
  "publicDataSource=",
  "scoreSource="
]);

requireIncludes("brief loop css", css, [
  ".home-public-beta-loop__hero",
  ".home-public-beta-loop__grid",
  ".home-public-beta-loop__alerts",
  ".home-public-beta-loop__boundary"
]);

requireExcludes("home dashboard source", dashboard, publicResiduePhrases());
requireExcludes("brief loop module", moduleSource, forbiddenRuntimePhrases());
requireExcludes("brief loop component", component, forbiddenRuntimePhrases());
requireExcludes("brief loop module", moduleSource, mojibakeMarkers());
requireExcludes("brief loop component", component, mojibakeMarkers());

const home = await get("/");
if (home.statusCode !== 200) problems.push(`/ must return 200, got ${home.statusCode}`);

requireIncludes("home page", home.body, [
  "Public Beta Index Dashboard",
  "30 秒看懂市場氣氛，3 分鐘形成下一步觀察",
  "30 秒看懂市場氛圍",
  "3 分鐘形成下一步觀察",
  "市場氛圍",
  "風險焦點",
  "資料可信度",
  "TWII 市場氛圍仍是示範狀態",
  "資料與分數仍維持 mock",
  "更新時間",
  "影響級別",
  "下一步",
  "publicDataSource=mock",
  "scoreSource=mock",
  "不宣稱即時真實資料",
  "不提供買賣建議"
]);

requireExcludes("home page", home.body, [
  ...publicResiduePhrases(),
  ...mojibakeMarkers(),
  "readonly-attempt",
  "post-run",
  "preflight",
  "operator"
]);

if (problems.length) {
  console.error(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      checkedRoutes: ["/"],
      status: "ok",
      summary:
        "Public Beta index dashboard matches the BRIEF loop with readable 30-second and 3-minute copy, mock boundary, and no public developer residue."
    },
    null,
    2
  )
);

function readText(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}

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

function publicResiduePhrases() {
  return [
    "Public Beta pre-launch executable state",
    "CURRENT HARD BLOCKERS",
    "BETA_HOSTING_PROJECT_NAME",
    "BETA_TEMPORARY_URL",
    "EXTERNAL REPLY DRY-RUN",
    "REQUEST BLOCKS"
  ];
}

function forbiddenRuntimePhrases() {
  return [
    "publicDataSource: \"supabase\"",
    "scoreSource: \"real\"",
    "rawMarketDataFetch: true",
    "sqlExecution: true",
    "supabaseWrite: true"
  ];
}

function mojibakeMarkers() {
  return ["嚗", "銝", "蝚", "甇", "摰", "閬", "隤", "蝷", "霅", "璅"];
}

function get(urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${baseUrl}${urlPath}`, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({ body, statusCode: res.statusCode ?? 0 });
      });
    });
    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy(new Error(`Timeout fetching ${urlPath}`));
    });
  });
}
