import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const component = fs.readFileSync(componentPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const sourceRequired = [
  "function StockDecisionCompass",
  "<StockDecisionCompass snapshot={snapshot} />",
  "燈號狀態",
  "風險熱度",
  "資料信心",
  "下一步觀察",
  "正式市場資料尚未啟用",
  "不提供買進、賣出、持有或個人化投資建議"
];

const cssRequired = [
  ".stock-decision-compass",
  "grid-template-columns: repeat(4, minmax(0, 1fr))",
  ".stock-decision-compass__boundary"
];

const visibleRequired = [
  "股票頁決策羅盤",
  "燈號狀態",
  "風險熱度",
  "資料信心",
  "下一步觀察",
  "正式市場資料尚未啟用",
  "不提供買進、賣出、持有或個人化投資建議"
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
  "Supabase",
  "daily_prices",
  "raw payload",
  "raw market data"
];

const sourceMissing = sourceRequired.filter((phrase) => !component.includes(phrase));
const cssMissing = cssRequired.filter((phrase) => !css.includes(phrase));
const packageRegistered =
  packageJson.scripts?.["check:stock-decision-compass"] === "node scripts/check-stock-decision-compass.mjs";
const reviewGateRegistered =
  reviewGate.includes("scripts/check-stock-decision-compass.mjs") && reviewGate.includes('"stock-decision-compass"');

await waitForLocalServer();
const routeResults = await Promise.all(["/stocks/2330", "/stocks/TWII", "/stocks/0050"].map(checkRoute));
const status =
  sourceMissing.length === 0 &&
  cssMissing.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  routeResults.every((result) => result.pass)
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      cssMissing,
      packageRegistered,
      publicDataSource: "mock",
      reviewGateRegistered,
      routeResults,
      scoreSource: "mock",
      sourceMissing,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

async function checkRoute(path) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      forbiddenHits: [],
      markerHits: [],
      missing: visibleRequired,
      pass: false,
      path,
      status: "fetch_failed"
    };
  }

  const text = normalizeVisibleText(await response.text());
  const missing = visibleRequired.filter((phrase) => !text.includes(phrase));
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

async function waitForLocalServer() {
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/`, { cache: "no-store" });
      if (response.status < 500) return;
    } catch {
      // Retry below while Next dev server finishes booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
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
