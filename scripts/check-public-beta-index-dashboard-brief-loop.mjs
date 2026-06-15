import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const dashboardPath = "src/components/dashboard-shell.tsx";

const problems = [];
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");

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

requireIncludes("home dashboard source", dashboard, [
  "HomeFirstScreenDecisionSummary",
  "HomeMarketOverview",
  "HomeLists",
  "HomeDataReadinessStatus",
  "30 秒看懂台股市場狀態",
  "3 分鐘複核",
  "資料上線狀態",
  "下一階段會把公開燈號延伸成個人化追蹤",
  "偏強觀察",
  "風險觀察"
]);

const response = await fetch(`${baseUrl}/`);
const text = normalizeVisibleText(await response.text());
const requiredVisible = [
  "指數燈號總覽",
  "30 秒看懂台股市場狀態",
  "資料上線狀態",
  "偏強觀察",
  "風險觀察",
  "下一階段會把公開燈號延伸成個人化追蹤",
  "非投資建議"
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
  "Phase 2"
];

if (response.status !== 200) problems.push(`/ must return 200, got ${response.status}`);
requireIncludes("home page", text, requiredVisible);
requireExcludes("home page", text, forbiddenVisible);

for (const [label, source] of [
  ["home page", text],
  [dashboardPath, dashboard]
]) {
  for (const marker of findBadTextMarkers(source)) {
    problems.push(`${label} contains ${marker}`);
  }
}

const status = problems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      checkedRoutes: ["/"],
      guardedStatus: "public_beta_index_dashboard_brief_loop_ready_for_phase_1",
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

function findBadTextMarkers(source) {
  const markers = new Set();
  for (const ch of source) {
    const cp = ch.codePointAt(0);
    if (cp === 0xfffd) markers.add("replacement-code-point");
    if (cp >= 0xe000 && cp <= 0xf8ff) markers.add("private-use-code-point");
    if (cp >= 0x80 && cp <= 0x9f) markers.add("c1-control-character");
  }
  if (/\?{3,}/u.test(source)) markers.add("question-mark-run");
  return [...markers];
}
