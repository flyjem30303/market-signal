import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const sourcePaths = [
  "src/components/dashboard-shell.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx"
];

const routeChecks = [
  {
    path: "/",
    required: ["公開 Beta", "30 秒", "3 分鐘", "市場總覽", "資料狀態", "示範資料", "非投資建議"]
  },
  {
    path: "/briefing",
    required: ["市場簡報", "30 秒", "3 分鐘", "警示清單", "資料邊界", "正式資料尚未啟用"]
  },
  {
    path: "/stocks/2330",
    required: ["2330", "指數燈號", "資料來源與覆蓋", "示範資料", "市場簡報", "不是投資建議"]
  },
  {
    path: "/weekly",
    required: ["市場週報", "本週市場狀態", "示範資料", "週報僅提供市場資訊整理", "不提供買賣建議"]
  },
  {
    path: "/methodology",
    required: ["方法說明", "燈號方法", "市場狀態", "資料狀態", "不是交易指令"]
  },
  {
    path: "/disclaimer",
    required: ["風險聲明", "市場資訊整理", "不構成個股買賣建議", "示範資料", "交易指令"]
  }
];

const forbiddenVisibleTerms = [
  "Current hard blockers",
  "Remaining hard blockers",
  "External reply dry-run intake",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "cmd.exe",
  "npm run",
  "packet",
  "operator",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "SQL execution is approved",
  "Supabase writes are approved",
  "real market data is live"
];

const forbiddenSourcePatterns = [
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /publicDataSource["']?\s*:\s*["']supabase["']/u,
  /scoreSource["']?\s*:\s*["']real["']/u,
  /investment advice approved/iu,
  /real market data is live/iu
];

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const registration = [
  {
    file: packagePath,
    pass:
      packageJson.scripts?.["check:public-beta-mock-launch-proof-bundle"] ===
      "node scripts/check-public-beta-mock-launch-proof-bundle.mjs"
  },
  {
    file: reviewGatePath,
    pass:
      reviewGate.includes("scripts/check-public-beta-mock-launch-proof-bundle.mjs") &&
      reviewGate.includes('"public-beta-mock-launch-proof-bundle"')
  }
];

const sourceResults = sourcePaths.map((path) => {
  const source = fs.readFileSync(path, "utf8");
  const forbiddenHits = forbiddenSourcePatterns.filter((pattern) => pattern.test(source)).map(String);
  const markerHits = findHardMojibakeMarkers(source);
  return { forbiddenHits, markerHits, pass: forbiddenHits.length === 0 && markerHits.length === 0, path };
});
const routeResults = await Promise.all(routeChecks.map(checkRoute));
const status =
  registration.every((item) => item.pass) &&
  sourceResults.every((item) => item.pass) &&
  routeResults.every((item) => item.pass)
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      registration,
      routeResults,
      sourceResults,
      status,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

async function checkRoute({ path, required }) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = normalizeVisibleText(await response.text());
  const missing = required.filter((phrase) => !text.includes(phrase));
  const forbiddenHits = forbiddenVisibleTerms.filter((phrase) => text.includes(phrase));
  const markerHits = findHardMojibakeMarkers(text);
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

function findHardMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  if (/[\u0080-\u009F]/u.test(text)) markers.push("c1-control-character");
  for (const fragment of ["蝬", "嚗", "銝", "雿", "撣", "摰", "閬", "霈", "蝡", "璅", "餈質馱", "擗", "", "", "芷"]) {
    if (text.includes(fragment)) markers.push(`mojibake-fragment:${fragment}`);
  }
  return markers;
}
