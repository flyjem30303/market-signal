import fs from "node:fs";

const docPath = "docs/A2_BRIEF_PUBLIC_RUNTIME_SURFACE_AUDIT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const problems = [];
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const coreRoutes = ["/", "/briefing", "/stocks/TWII", "/stocks/2330", "/stocks/0050", "/stocks/006208", "/stocks/2382", "/stocks/2308"];
const allRoutes = [...coreRoutes, "/weekly", "/methodology", "/disclaimer", "/terms", "/privacy"];

requireIncludes("A2 audit", doc, [
  "A2 BRIEF Public Runtime Surface Audit",
  "Status: `a2_brief_public_runtime_surface_audit_ready`",
  "30 秒市場氛圍，3 分鐘行動判斷",
  "Public Beta Reading Path",
  "Source & Coverage",
  "Data Readiness",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase approved`",
  "`scoreSource=real approved`",
  "accept_a2_brief_public_runtime_surface_audit"
]);
requireNoMojibake("A2 audit", doc);

if (
  pkg.scripts?.["check:a2-brief-public-runtime-surface-audit"] !==
  "node scripts/check-a2-brief-public-runtime-surface-audit.mjs"
) {
  problems.push(`${packagePath} missing check:a2-brief-public-runtime-surface-audit`);
}

requireIncludes("review gate", reviewGate, [
  "scripts/check-a2-brief-public-runtime-surface-audit.mjs",
  "a2-brief-public-runtime-surface-audit"
]);

const routeResults = await Promise.all(allRoutes.map(checkRoute));

if (problems.length) {
  console.error(JSON.stringify({ docPath, problems, routeResults, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      docPath,
      routeResults,
      status: "ok",
      summary: "A2 public runtime surface audit confirms public routes keep mock boundary and avoid internal workflow leakage."
    },
    null,
    2
  )
);

async function checkRoute(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const text = normalizeVisibleText(html);
  const required = coreRoutes.includes(path)
    ? [
        "publicDataSource=mock",
        "scoreSource=mock",
        "不是即時真實資料",
        "不提供買賣建議"
      ]
    : ["publicDataSource=mock", "scoreSource=mock"];

  if (path === "/" || path === "/briefing") {
    required.push("Data Readiness", "資料真實化仍在準備中，公開頁維持 mock");
  }
  if (coreRoutes.includes(path)) {
    required.push("Public Beta Decision Loop", "Public Beta Reading Path", "Source & Coverage");
  }

  const missing = required.filter((token) => !text.includes(token));
  const blocked = forbiddenPublicSignals().filter((token) => text.includes(token));
  const markers = findMojibakeMarkers(text);

  if (response.status !== 200) problems.push(`${path} returned ${response.status}`);
  for (const token of missing) problems.push(`${path} missing ${token}`);
  for (const token of blocked) problems.push(`${path} exposes ${token}`);
  for (const marker of markers) problems.push(`${path} exposes ${marker}`);

  return {
    blocked,
    markers,
    missing,
    pass: response.status === 200 && missing.length === 0 && blocked.length === 0 && markers.length === 0,
    path,
    status: response.status
  };
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}

function requireIncludes(label, text, needles) {
  for (const needle of needles) {
    if (!text.includes(needle)) problems.push(`${label} missing ${needle}`);
  }
}

function requireNoMojibake(label, text) {
  for (const marker of findMojibakeMarkers(text)) problems.push(`${label} exposes ${marker}`);
}

function forbiddenPublicSignals() {
  return [
    "Current hard blockers",
    "Remaining hard blockers",
    "External reply dry-run intake",
    "BETA_HOSTING_PROJECT_NAME",
    "BETA_TEMPORARY_URL",
    "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
    "cmd.exe /c npm run",
    "SQL execution is approved",
    "Supabase writes are approved",
    "raw market data fetch is approved",
    "complete coverage approved",
    "publicDataSource=supabase approved",
    "scoreSource=real approved",
    "buy now",
    "sell now",
    "guaranteed return approved"
  ];
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
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
