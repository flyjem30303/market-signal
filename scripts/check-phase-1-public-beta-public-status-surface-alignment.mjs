import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const sourcePaths = [
  "src/components/dashboard-shell.tsx",
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/components/data-freshness-strip.tsx",
  "src/components/public-data-source-boundary-notice.tsx",
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/components/public-next-reading-flow.tsx",
  "src/app/globals.css"
];

const requiredPublicPhrases = ["市場總覽", "30 秒", "資料狀態", "免責聲明", "市場快報", "資料邊界"];

const routeRequiredPhrases = {
  "/": ["市場總覽", "30 秒看懂今天的市場狀態", "資料狀態", "重要提醒"],
  "/briefing": ["市場快報", "30 秒看懂市場燈號", "下一步行動", "資料邊界"]
};

const forbiddenPublicStatusFragments = [
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "operator",
  "smoke",
  "packet",
  "phase_1",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL",
  "daily_prices",
  "raw market data",
  "raw payload",
  "go/no-go",
  "rollback",
  "PM ",
  "A1 ",
  "A2 ",
  "A3 ",
  "A4 "
];

const stockForbiddenSurfacePhrases = [
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "publicDataSource",
  "scoreSource",
  "mock-only",
  "Supabase",
  "SQL",
  "raw market data"
];

const unsafeSourceFragments = [
  "@supabase/supabase-js",
  "createClient(",
  ".insert(",
  ".update(",
  ".delete(",
  ".upsert(",
  'publicDataSource: "supabase"',
  "publicDataSource='supabase'",
  'scoreSource: "real"',
  "scoreSource='real'"
];

const sources = sourcePaths.map((path) => ({ path, text: readText(path) }));
const missingSourceFiles = sources.filter((source) => source.text.length === 0).map((source) => source.path);
const sourceText = sources.map((source) => `\n--- ${source.path} ---\n${source.text}`).join("\n");
const missingSourcePhrases = requiredPublicPhrases.filter((phrase) => !sourceText.includes(phrase));
const forbiddenSourceHits = [];
const unsafeSourceHits = unsafeSourceFragments.filter((fragment) => sourceText.includes(fragment));
const packageRegistered = readText("package.json").includes(
  '"check:phase-1-public-beta-public-status-surface-alignment": "node scripts/check-phase-1-public-beta-public-status-surface-alignment.mjs"'
);
const reviewGateRegistered = readText("scripts/check-review-gates.mjs").includes(
  "scripts/check-phase-1-public-beta-public-status-surface-alignment.mjs"
);
const focusedGateRegistered = readText("scripts/check-review-gates.mjs").includes(
  '"phase-1-public-beta-public-status-surface-alignment"'
);

const surfaceRouteResults = [];
const stockRouteResults = [];

for (const route of ["/", "/briefing"]) {
  surfaceRouteResults.push(await checkRoute(route, routeRequiredPhrases[route], forbiddenPublicStatusFragments));
}

for (const route of ["/stocks/TWII", "/stocks/2330", "/stocks/0050"]) {
  stockRouteResults.push(await checkRoute(route, ["個股燈號", "綜合分數", "風險分數"], stockForbiddenSurfacePhrases));
}

const sourceMojibakeHits = findMojibakeMarkers(sourceText);
const status =
  missingSourceFiles.length === 0 &&
  missingSourcePhrases.length === 0 &&
  forbiddenSourceHits.length === 0 &&
  unsafeSourceHits.length === 0 &&
  sourceMojibakeHits.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered &&
  surfaceRouteResults.every((result) => result.pass) &&
  stockRouteResults.every((result) => result.pass)
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_public_beta_public_status_surface_alignment_ready_public_copy",
      missingSourceFiles,
      missingSourcePhrases,
      forbiddenSourceHits,
      unsafeSourceHits,
      sourceMojibakeHits,
      packageRegistered,
      reviewGateRegistered,
      focusedGateRegistered,
      surfaceRouteResults,
      stockRouteResults,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

async function checkRoute(route, required, forbiddenFragments) {
  try {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    const text = normalizeVisibleText(html);
    const missing = required.filter((phrase) => !text.includes(phrase));
    const forbidden = forbiddenFragments.filter((phrase) => text.includes(phrase));
    const mojibakeHits = findMojibakeMarkers(text);

    return {
      forbidden,
      missing,
      mojibakeHits,
      pass: response.status === 200 && missing.length === 0 && forbidden.length === 0 && mojibakeHits.length === 0,
      route,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      pass: false,
      route
    };
  }
}

function readText(path) {
  if (!fs.existsSync(path)) return "";
  return fs.readFileSync(path, "utf8");
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  if (/(?:嚗|銝|蝭|憟|璅|鞈|撣|閮|瘥|摨|甈|雿|蹐|蹓||){2,}/u.test(source)) {
    markers.push("common-mojibake-run");
  }
  return markers;
}
