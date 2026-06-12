import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const componentPath = "src/components/public-beta-usable-loop-panel.tsx";
const libPath = "src/lib/public-beta-usable-loop.ts";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const publicRequired = [
  "可用閉環",
  "公開 Beta 可用閉環",
  "30 秒",
  "看懂市場氛圍",
  "3 分鐘",
  "形成觀察行動",
  "先確認資料限制",
  "現在可用",
  "公開 Beta 閱讀閉環",
  "真實資料升級",
  "非投資建議",
  "publicDataSource=mock",
  "scoreSource=mock"
];

const forbidden = [
  "publicDataSource=supabase approved",
  "scoreSource=real approved",
  "SQL execution is approved",
  "Supabase writes are approved",
  "raw market data fetch is approved",
  "cmd.exe /c npm run",
  "readonly-attempt",
  "post-run",
  "preflight",
  "packet",
  "operator"
];

const files = new Map(
  [componentPath, libPath, dashboardPath, briefingPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const sourceChecks = [
  {
    path: libPath,
    required: [
      "PublicBetaUsableLoop",
      "getPublicBetaUsableLoop",
      "home",
      "briefing",
      "stock",
      ...publicRequired,
      "不寫 Supabase",
      "不切換 real score"
    ]
  },
  {
    path: componentPath,
    required: [
      "PublicBetaUsableLoopPanel",
      "public-beta-usable-loop",
      "30 second and 3 minute usable loop",
      "Usable loop source and advice boundary"
    ]
  },
  {
    allowLegacyProcessTerms: true,
    path: dashboardPath,
    required: [
      "PublicBetaUsableLoopPanel",
      'context="home"',
      'context="stock"'
    ]
  },
  {
    path: briefingPath,
    required: ["PublicBetaUsableLoopPanel", 'context="briefing"']
  },
  {
    allowLegacyProcessTerms: true,
    path: cssPath,
    required: [
      ".public-beta-usable-loop",
      ".public-beta-usable-loop__cards",
      ".public-beta-usable-loop__boundary",
      ".public-beta-usable-loop__stop-line"
    ]
  }
];

const sourceResults = sourceChecks.map((check) => {
  const source = files.get(check.path) ?? "";
  const forbiddenHits = check.allowLegacyProcessTerms ? [] : forbidden.filter((phrase) => source.includes(phrase));
  const markerHits = findMojibakeMarkers(source);
  const missing = check.required.filter((phrase) => !source.includes(phrase));
  return {
    forbiddenHits,
    markerHits,
    missing,
    pass: missing.length === 0 && forbiddenHits.length === 0 && markerHits.length === 0,
    path: check.path
  };
});

const routeResults = await Promise.all(["/", "/briefing", "/stocks/2330", "/stocks/TWII", "/stocks/0050"].map(checkRoute));

const registration = [
  {
    file: packagePath,
    pass:
      JSON.parse(files.get(packagePath) ?? "{}").scripts?.["check:public-beta-usable-loop-panel"] ===
      "node scripts/check-public-beta-usable-loop-panel.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      (files.get(reviewGatePath) ?? "").includes("scripts/check-public-beta-usable-loop-panel.mjs") &&
      (files.get(reviewGatePath) ?? "").includes('"public-beta-usable-loop-panel"')
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
  const forbiddenHits = forbidden.filter((phrase) => text.includes(phrase));
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
