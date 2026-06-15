import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const sourcePaths = [
  "src/lib/public-beta-public-status-surface.ts",
  "src/components/public-beta-public-status-surface.tsx",
  "src/components/dashboard-shell.tsx",
  "src/app/briefing/page.tsx",
  "src/app/globals.css"
];
const publicStatusSurfaceSourcePaths = [
  "src/lib/public-beta-public-status-surface.ts",
  "src/components/public-beta-public-status-surface.tsx"
];
const requiredPublicPhrases = [
  "公開 Beta 使用狀態",
  "先用 30 秒看懂市場氣氛",
  "資料品質需持續複核",
  "會員功能規劃中",
  "市場資訊整理與風險觀察",
  "不構成投資建議"
];
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
const publicStatusSurfaceSourceText = publicStatusSurfaceSourcePaths
  .map((path) => `\n--- ${path} ---\n${readText(path)}`)
  .join("\n");
const missingSourcePhrases = requiredPublicPhrases.filter((phrase) => !sourceText.includes(phrase));
const forbiddenSourceHits = forbiddenPublicStatusFragments.filter((fragment) =>
  publicStatusSurfaceSourceText.includes(fragment)
);
const unsafeSourceHits = unsafeSourceFragments.filter((fragment) => publicStatusSurfaceSourceText.includes(fragment));
const missingMounts = [
  ["src/components/dashboard-shell.tsx", "<PublicBetaPublicStatusSurface />"],
  ["src/app/briefing/page.tsx", "<PublicBetaPublicStatusSurface />"],
  ["src/components/public-beta-public-status-surface.tsx", "getPublicBetaPublicStatusSurface"]
].filter(([path, phrase]) => !readText(path).includes(phrase));
const missingResponsiveClass = !readText("src/app/globals.css").includes(".public-beta-public-status-surface__grid");
const packageRegistered = readText("package.json").includes(
  "\"check:phase-1-public-beta-public-status-surface-alignment\": \"node scripts/check-phase-1-public-beta-public-status-surface-alignment.mjs\""
);
const reviewGateRegistered = readText("scripts/check-review-gates.mjs").includes(
  "scripts/check-phase-1-public-beta-public-status-surface-alignment.mjs"
);
const focusedGateRegistered = readText("scripts/check-review-gates.mjs").includes(
  "\"phase-1-public-beta-public-status-surface-alignment\""
);

const surfaceRouteResults = [];
const stockRouteResults = [];

for (const route of ["/", "/briefing"]) {
  surfaceRouteResults.push(await checkRoute(route, requiredPublicPhrases, forbiddenPublicStatusFragments));
}

for (const route of ["/stocks/TWII", "/stocks/2330", "/stocks/0050"]) {
  stockRouteResults.push(await checkRoute(route, [], stockForbiddenSurfacePhrases));
}

const sourceMojibakeHits = findMojibakeMarkers(publicStatusSurfaceSourceText);
const status =
  missingSourceFiles.length === 0 &&
  missingSourcePhrases.length === 0 &&
  forbiddenSourceHits.length === 0 &&
  unsafeSourceHits.length === 0 &&
  sourceMojibakeHits.length === 0 &&
  missingMounts.length === 0 &&
  !missingResponsiveClass &&
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
      missingMounts,
      missingResponsiveClass,
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
  return markers;
}
