import fs from "node:fs";
import http from "node:http";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefPath = "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const problems = [];

function readText(path) {
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

const pkg = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const dashboard = readText(dashboardPath);
const brief = readText(briefPath);

if (
  pkg.scripts?.["check:public-beta-index-dashboard-brief-loop"] !==
  "node scripts/check-public-beta-index-dashboard-brief-loop.mjs"
) {
  problems.push(`${packagePath} missing check:public-beta-index-dashboard-brief-loop`);
}

if (!reviewGate.includes("scripts/check-public-beta-index-dashboard-brief-loop.mjs")) {
  problems.push(`${reviewGatePath} missing public beta dashboard brief checker`);
}

requireIncludes("BRIEF", brief, [
  "understand the market mood within 30 seconds",
  "decide within 3 minutes",
  "Home includes three layers: full-market overview, core indicator panel, alert list",
  "Each alert includes status, cause, update time, impact level, and next step",
  "publicDataSource remains `mock`",
  "scoreSource remains `mock`"
]);

requireIncludes("home dashboard source", dashboard, [
  "home-public-beta-loop",
  "全市場總覽",
  "核心指標面板",
  "警示清單",
  "30 秒看懂市場氛圍",
  "3 分鐘決定關注",
  "成因",
  "更新時間",
  "影響級別",
  "下一步建議",
  "publicDataSource=mock",
  "scoreSource=mock",
  "非投資建議"
]);

requireExcludes("home dashboard source", dashboard, [
  "Public Beta pre-launch executable state",
  "CURRENT HARD BLOCKERS",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "EXTERNAL REPLY DRY-RUN",
  "REQUEST BLOCKS"
]);

const home = await get("/");
if (home.statusCode !== 200) problems.push(`/ must return 200, got ${home.statusCode}`);

requireIncludes("home page", home.body, [
  "Public Beta Index Dashboard",
  "全市場總覽",
  "核心指標面板",
  "警示清單",
  "30 秒看懂市場氛圍",
  "3 分鐘決定關注",
  "市場氣氛",
  "風險熱度",
  "資料可信度",
  "成因",
  "更新時間",
  "影響級別",
  "下一步建議",
  "publicDataSource=mock",
  "scoreSource=mock",
  "非投資建議",
  "資料真實化路徑",
  "覆蓋範圍",
  "來源與權利",
  "公開資料升級"
]);

requireExcludes("home page", home.body, [
  "Public Beta pre-launch executable state",
  "pre-launch executable",
  "CURRENT HARD BLOCKERS",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "EXTERNAL REPLY DRY-RUN",
  "REQUEST BLOCKS",
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
        "Public Beta index dashboard matches the BRIEF loop: overview, indicators, alerts, mock boundary, and non-advice wording are present without public developer residue."
    },
    null,
    2
  )
);
