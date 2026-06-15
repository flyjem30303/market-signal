import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const layoutPath = "src/app/layout.tsx";
const sitePath = "src/lib/site.ts";
const sitemapPath = "src/app/sitemap.ts";
const robotsPath = "src/app/robots.ts";

const pageMetadataFiles = [
  "src/app/briefing/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/methodology/page.tsx",
  "src/app/disclaimer/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/stocks/[symbol]/page.tsx"
];

const problems = [];
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const layout = read(layoutPath);
const site = read(sitePath);
const sitemap = read(sitemapPath);
const robots = read(robotsPath);
const decodedLayout = decodeUnicodeEscapes(layout);
const decodedSite = decodeUnicodeEscapes(site);

for (const phrase of [
  "指數燈號",
  "市場狀態與風險觀察",
  "非投資建議",
  "正式資料上線前會清楚標示狀態",
  "metadataBase",
  "NEXT_PUBLIC_SITE_URL"
]) {
  if (!decodedLayout.includes(phrase)) problems.push(`${layoutPath} missing public metadata/layout phrase: ${phrase}`);
}

if (!decodedSite.includes('name: "指數燈號"')) problems.push(`${sitePath} must name the site as 指數燈號`);
if (!site.includes("NEXT_PUBLIC_SITE_URL")) problems.push(`${sitePath} must keep NEXT_PUBLIC_SITE_URL support`);

for (const filePath of pageMetadataFiles) {
  const source = read(filePath);
  if (!source.includes("Metadata")) problems.push(`${filePath} missing Metadata import or use`);
  if (!source.includes("title:") && !source.includes("generateMetadata")) problems.push(`${filePath} missing title metadata`);
  if (!source.includes("description")) problems.push(`${filePath} missing description metadata`);
}

const stockPage = read("src/app/stocks/[symbol]/page.tsx");
for (const phrase of ["generateMetadata", "canonical", "openGraph", "siteConfig.name", "市場分數", "風險分數", "資料狀態"]) {
  if (!stockPage.includes(phrase)) problems.push(`src/app/stocks/[symbol]/page.tsx missing stock metadata phrase: ${phrase}`);
}

for (const phrase of [
  "staticRoutes",
  '"/briefing"',
  '"/weekly"',
  '"/methodology"',
  '"/privacy"',
  '"/terms"',
  '"/disclaimer"',
  "repository.getAssets()",
  "/stocks/",
  "MetadataRoute.Sitemap"
]) {
  if (!sitemap.includes(phrase)) problems.push(`${sitemapPath} missing sitemap phrase: ${phrase}`);
}

for (const phrase of [
  "MetadataRoute.Robots",
  'userAgent: "*"',
  'allow: "/"',
  '"/internal"',
  '"/api/internal"',
  '"/membership"',
  '"/watchlist"',
  'absoluteUrl("/sitemap.xml")'
]) {
  if (!robots.includes(phrase)) problems.push(`${robotsPath} missing robots phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:a3-phase-1-metadata-and-public-route-smoke-checker"] !==
  "node scripts/check-a3-phase-1-metadata-and-public-route-smoke-checker.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-metadata-and-public-route-smoke-checker script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-metadata-and-public-route-smoke-checker.mjs")) {
  problems.push(`${reviewGatePath} missing a3 phase 1 metadata and public route smoke checker`);
}

for (const [label, source] of [
  [layoutPath, layout],
  [sitePath, site],
  [sitemapPath, sitemap],
  [robotsPath, robots],
  ...pageMetadataFiles.map((filePath) => [filePath, read(filePath)])
]) {
  for (const marker of findMojibakeMarkers(source)) {
    problems.push(`${label} contains mojibake marker ${marker}`);
  }
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${label} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a3_phase_1_metadata_and_public_route_smoke_checker_ready",
      phase: "Phase 1 public free index-lighting site",
      productionDeployAuthorized: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /production deployment is approved/u,
    /production env mutation is approved/u,
    /raw market data fetch is approved/u,
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /real-time official market data is provided/u,
    /official endorsement is provided/u,
    /guaranteed return is provided/u,
    /investment advice is provided/u,
    /buy\/sell recommendation is provided/u
  ];
}

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  if (/[嚗蝮撣鞈銝閫瘚蝷箇][\uE000-\uF8FF?]/u.test(source)) markers.push("legacy-mojibake-cjk-run");
  return markers;
}

function decodeUnicodeEscapes(source) {
  return source.replace(/\\u([0-9a-f]{4})/giu, (_match, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));
}
