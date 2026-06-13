import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-home-briefing-investor-reading-bridge.mjs";

const files = new Map(
  [dashboardPath, briefingPath, packagePath, reviewGatePath, checkerPath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const sourceRequired = [
  [dashboardPath, "30 秒起點"],
  [dashboardPath, "示範資料公開 Beta"],
  [dashboardPath, "publicDataSource=mock"],
  [dashboardPath, "scoreSource=mock"],
  [dashboardPath, "示範資料閱讀模式"],
  [dashboardPath, "查看第一批資料準備細節"],
  [dashboardPath, "先看市場晨報"],
  [briefingPath, "示範資料閱讀介面"],
  [briefingPath, "正式資料尚未升級"],
  [briefingPath, "真實資料升級檢查"],
  [briefingPath, "沒有原始資料酬載"],
  [packagePath, "\"check:home-briefing-investor-reading-bridge\""],
  [reviewGatePath, "check-home-briefing-investor-reading-bridge.mjs"],
  [reviewGatePath, "home-briefing-investor-reading-bridge"]
];

const sourceForbidden = [
  [dashboardPath, "mock-only 閱讀模式"],
  [dashboardPath, "Batch 1 readiness"],
  [dashboardPath, "真實資料推廣"],
  [briefingPath, "mock-only，正式資料尚未 promotion"],
  [briefingPath, "raw market data"],
  [briefingPath, "real score promotion"],
  [briefingPath, "promotion gate"],
  [briefingPath, "partial coverage"],
  [briefingPath, "missing/delayed data"],
  [briefingPath, "mock runtime"],
  [briefingPath, "Model Boundary"]
];

const routeRequired = {
  "/": [
    "30 秒起點",
    "指數狀態儀表站",
    "30 秒看懂市場氛圍",
    "3 分鐘決定關注",
    "示範資料公開 Beta",
    "publicDataSource=mock",
    "scoreSource=mock",
    "示範資料閱讀模式",
    "先看市場晨報"
  ],
  "/briefing": [
    "市場訊號晨報",
    "30 秒看懂今日市場氣氛",
    "3 分鐘行動判斷",
    "示範資料閱讀介面",
    "正式資料尚未升級",
    "publicDataSource=mock",
    "scoreSource=mock",
    "不提供買賣建議"
  ]
};

const routeForbidden = [
  "mock-only 閱讀模式",
  "mock-only，正式資料尚未 promotion",
  "promotion gate",
  "partial coverage",
  "missing/delayed data",
  "raw market data",
  "real score promotion",
  "Batch 1 readiness",
  "cmd.exe",
  "PUBLIC_BETA",
  "BETA_",
  "operator packet",
  "execution packet",
  "publicDataSource=supabase approved",
  "scoreSource=real approved",
  "Visible now: supabase",
  "Visible now: real"
];

const missing = sourceRequired
  .filter(([file, phrase]) => !read(file).includes(phrase))
  .map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = sourceForbidden
  .filter(([file, phrase]) => read(file).includes(phrase))
  .map(([file, phrase]) => `${file}: ${phrase}`);
const markerHits = [dashboardPath, briefingPath].flatMap((file) =>
  findMojibakeMarkers(read(file)).map((marker) => `${file}: ${marker}`)
);

const routeResults = await Promise.all(
  Object.entries(routeRequired).map(async ([path, required]) => {
    const response = await fetch(`${baseUrl}${path}`);
    const html = await response.text();
    const text = normalizeVisibleText(html);
    const routeMissing = required.filter((phrase) => !text.includes(phrase));
    const routeBlocked = routeForbidden.filter((phrase) => text.includes(phrase));
    const routeMarkers = findMojibakeMarkers(text);

    return {
      blocked: routeBlocked,
      markerHits: routeMarkers,
      missing: routeMissing,
      pass: response.status === 200 && routeMissing.length === 0 && routeBlocked.length === 0 && routeMarkers.length === 0,
      path,
      status: response.status
    };
  })
);

const status =
  missing.length === 0 &&
  blocked.length === 0 &&
  markerHits.length === 0 &&
  routeResults.every((result) => result.pass)
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      blocked: [...blocked, ...markerHits],
      missing,
      routeResults,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
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
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
