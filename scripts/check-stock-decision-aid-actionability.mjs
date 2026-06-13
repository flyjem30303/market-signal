import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const dashboardPath = "src/components/dashboard-shell.tsx";
const runtimeAtAGlancePath = "src/components/stock-runtime-at-a-glance.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredVisible = [
  "30 秒快讀",
  "決策輔助摘要",
  "成因",
  "更新時間",
  "影響級別",
  "下一步觀察",
  "30 秒可用",
  "3 分鐘要複核",
  "不能當成個股買賣指令",
  "示範資料",
  "正式市場資料尚未啟用",
  "不提供個股買賣建議"
];

const forbiddenVisible = [
  "cmd.exe",
  "npm run",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "SQL",
  "Supabase"
];

const files = new Map(
  [dashboardPath, runtimeAtAGlancePath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const dashboard = files.get(dashboardPath) ?? "";
const runtimeAtAGlance = files.get(runtimeAtAGlancePath) ?? "";
const dashboardMissing = ["30 秒快讀", "決策輔助摘要", "成因", "更新時間", "影響級別", "下一步觀察"].filter(
  (phrase) => !dashboard.includes(phrase)
);
const runtimeAtAGlanceMissing = [
  "30 秒快速閱讀",
  "標的決策摘要",
  "成因",
  "更新時間",
  "影響級別",
  "下一步觀察",
  "30 秒可用",
  "3 分鐘要複核",
  "不能當成個股買賣指令"
].filter((phrase) => !runtimeAtAGlance.includes(phrase));

const routeResults = await Promise.all(["/stocks/2330", "/stocks/TWII", "/stocks/0050"].map(checkRoute));

const packageJson = JSON.parse(files.get(packagePath) ?? "{}");
const reviewGate = files.get(reviewGatePath) ?? "";
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:stock-decision-aid-actionability"] ===
      "node scripts/check-stock-decision-aid-actionability.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-stock-decision-aid-actionability.mjs") &&
      reviewGate.includes('"stock-decision-aid-actionability"')
  }
];

const status =
  dashboardMissing.length === 0 &&
  runtimeAtAGlanceMissing.length === 0 &&
  routeResults.every((item) => item.pass) &&
  registration.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      registration,
      routeResults,
      sourceResults: [
        { missing: dashboardMissing, path: dashboardPath, pass: dashboardMissing.length === 0 },
        {
          missing: runtimeAtAGlanceMissing,
          path: runtimeAtAGlancePath,
          pass: runtimeAtAGlanceMissing.length === 0
        }
      ],
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

async function checkRoute(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = normalizeVisibleText(await response.text());
  const missing = requiredVisible.filter((phrase) => !text.includes(phrase));
  const forbiddenHits = forbiddenVisible.filter((phrase) => text.includes(phrase));
  const markerHits = findMojibakeMarkers(text);
  return {
    forbiddenHits,
    markerHits,
    missing,
    pass: response.status === 200 && missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
    path,
    status: response.status
  };
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
