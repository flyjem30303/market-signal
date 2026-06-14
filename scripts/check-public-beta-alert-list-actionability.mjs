import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const routeRequired = {
  "/": ["市場燈號", "市場廣度", "主要風險", "資料更新", "3 分鐘閱讀建議", "資料狀態", "示範資料"],
  "/briefing": ["警示清單", "市場主燈號", "風險觀察", "資料邊界", "下一步閱讀", "示範資料", "正式資料尚未啟用"]
};

const forbiddenVisible = [
  "cmd.exe",
  "npm run",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "SQL",
  "Supabase",
  "資料線",
  "watchlist"
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-alert-list-actionability"] ===
      "node scripts/check-public-beta-alert-list-actionability.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-alert-list-actionability.mjs") &&
      reviewGate.includes('"public-beta-alert-list-actionability"')
  }
];

const routeResults = await Promise.all(
  Object.entries(routeRequired).map(async ([path, required]) => {
    const response = await fetch(`${baseUrl}${path}`);
    const text = normalizeVisibleText(await response.text());
    const missing = required.filter((phrase) => !text.includes(phrase));
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
  })
);

const status = registration.every((item) => item.pass) && routeResults.every((item) => item.pass) ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      registration,
      routeResults,
      status,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

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
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱", "擗", "", "", "芷"]) {
    if (source.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return markers;
}
