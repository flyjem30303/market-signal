import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const paths = {
  briefing: "src/app/briefing/page.tsx",
  component: "src/components/public-beta-usable-loop-panel.tsx",
  css: "src/app/globals.css",
  dashboard: "src/components/dashboard-shell.tsx",
  lib: "src/lib/public-beta-usable-loop.ts",
  package: "package.json",
  reviewGate: "scripts/check-review-gates.mjs"
};

const publicRequired = [
  "公開 Beta 可用閉環",
  "30 秒",
  "3 分鐘",
  "看懂市場氛圍",
  "形成觀察行動",
  "先確認資料限制",
  "現在可用",
  "公開 Beta 閱讀閉環",
  "真實資料升級前維持保守標示",
  "不是投資建議"
];

const publicForbidden = [
  "cmd.exe",
  "npm run",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL",
  "daily_prices",
  "raw market data",
  "raw payload"
];

const files = Object.fromEntries(
  Object.entries(paths).map(([key, file]) => [key, fs.readFileSync(file, "utf8")])
);

const sourceChecks = [
  {
    path: paths.lib,
    required: [
      "PublicBetaUsableLoop",
      "getPublicBetaUsableLoop",
      "home",
      "briefing",
      "stock",
      "30 秒",
      "3 分鐘",
      "看懂市場氛圍",
      "形成觀察行動",
      "先確認資料限制",
      "公開 Beta 閱讀閉環",
      "真實資料升級前維持保守標示",
      "不是投資建議"
    ],
    source: files.lib
  },
  {
    path: paths.component,
    required: [
      "PublicBetaUsableLoopPanel",
      "公開 Beta 可用閉環",
      "30 秒與 3 分鐘閱讀流程",
      "資料來源與非投資建議邊界"
    ],
    source: files.component
  },
  {
    path: paths.dashboard,
    required: [
      "PublicBetaUsableLoopPanel",
      'context={isStockPage ? "stock" : "home"}'
    ],
    source: files.dashboard
  },
  {
    path: paths.briefing,
    required: ["PublicBetaUsableLoopPanel", 'context="briefing"'],
    source: files.briefing
  },
  {
    path: paths.css,
    required: [
      ".public-beta-usable-loop",
      ".public-beta-usable-loop__cards",
      ".public-beta-usable-loop__boundary",
      ".public-beta-usable-loop__stop-line"
    ],
    source: files.css
  }
];

const sourceResults = sourceChecks.map((check) => {
  const missing = check.required.filter((phrase) => !check.source.includes(phrase));
  const markerHits = findMojibakeMarkers(check.source);

  return {
    markerHits,
    missing,
    pass: missing.length === 0 && markerHits.length === 0,
    path: check.path
  };
});

const routeResults = await Promise.all(["/", "/briefing", "/stocks/2330", "/stocks/TWII", "/stocks/0050"].map(checkRoute));

const registration = [
  {
    file: paths.package,
    pass:
      JSON.parse(files.package).scripts?.["check:public-beta-usable-loop-panel"] ===
      "node scripts/check-public-beta-usable-loop-panel.mjs"
  },
  {
    file: paths.reviewGate,
    pass:
      files.reviewGate.includes("scripts/check-public-beta-usable-loop-panel.mjs") &&
      files.reviewGate.includes('"public-beta-usable-loop-panel"')
  }
];

const status =
  sourceResults.every((item) => item.pass) &&
  routeResults.every((item) => item.pass) &&
  registration.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(JSON.stringify({ registration, routeResults, sourceResults, status }, null, 2));

if (status !== "ok") process.exitCode = 1;

async function checkRoute(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const text = normalizeVisibleText(html);
  const missing = publicRequired.filter((phrase) => !text.includes(phrase));
  const forbiddenHits = publicForbidden.filter((phrase) => text.includes(phrase));
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
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
