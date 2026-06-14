import fs from "node:fs";

const docPath = "docs/A3_PUBLIC_BETA_MINIMUM_LAUNCH_ENGINEERING_READINESS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const layoutPath = "src/app/layout.tsx";
const sitePath = "src/lib/site.ts";
const sitemapPath = "src/app/sitemap.ts";
const robotsPath = "src/app/robots.ts";

const problems = [];
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const layout = read(layoutPath);
const site = read(sitePath);
const sitemap = read(sitemapPath);
const robots = read(robotsPath);

const requiredDocPhrases = [
  "a3_public_beta_minimum_launch_engineering_ready",
  "Phase 1 public Beta route/SEO/metadata/sitemap/robots/monitoring/rollback",
  "`/`",
  "`/briefing`",
  "`/weekly`",
  "`/membership`",
  "`/stocks/TWII`",
  "`/stocks/2330`",
  "`/methodology`",
  "`/disclaimer`",
  "`/terms`",
  "`/privacy`",
  "`/robots.txt`",
  "`/sitemap.xml`",
  "Disallow: /internal",
  "last known good Git commit or Vercel deployment",
  "no production env mutation",
  "no DNS change",
  "publicDataSource=mock",
  "scoreSource=mock",
  "prepare_phase_1_public_route_health_and_operator_safe_smoke_packet"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of ["指數燈號", "metadataBase", "NEXT_PUBLIC_SITE_URL", "description", "非投資建議"]) {
  if (!layout.includes(phrase)) problems.push(`${layoutPath} missing phrase: ${phrase}`);
}

for (const phrase of ["指數燈號", "NEXT_PUBLIC_SITE_URL"]) {
  if (!site.includes(phrase)) problems.push(`${sitePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "MetadataRoute.Sitemap",
  "staticRoutes",
  '"/briefing"',
  '"/weekly"',
  '"/membership"',
  '"/methodology"',
  '"/privacy"',
  '"/terms"',
  '"/disclaimer"',
  "repository.getAssets()",
  "/stocks/"
]) {
  if (!sitemap.includes(phrase)) problems.push(`${sitemapPath} missing phrase: ${phrase}`);
}

if (sitemap.includes('"/internal"') || sitemap.includes('"/api/internal"')) {
  problems.push(`${sitemapPath} must not expose internal routes`);
}

for (const phrase of [
  "MetadataRoute.Robots",
  'userAgent: "*"',
  'allow: "/"',
  '"/internal"',
  '"/api/internal"',
  'absoluteUrl("/sitemap.xml")'
]) {
  if (!robots.includes(phrase)) problems.push(`${robotsPath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:a3-public-beta-minimum-launch-engineering-readiness"] !==
  "node scripts/check-a3-public-beta-minimum-launch-engineering-readiness.mjs"
) {
  problems.push(`${packagePath} missing check:a3-public-beta-minimum-launch-engineering-readiness script`);
}

if (!reviewGate.includes("scripts/check-a3-public-beta-minimum-launch-engineering-readiness.mjs")) {
  problems.push(`${reviewGatePath} missing a3 public beta minimum launch engineering readiness checker`);
}

if (!reviewGate.includes("a3-public-beta-minimum-launch-engineering-readiness")) {
  problems.push(`${reviewGatePath} missing a3 public beta minimum launch engineering readiness check name`);
}

for (const [label, source] of [
  [docPath, doc],
  [layoutPath, layout],
  [sitePath, site],
  [sitemapPath, sitemap],
  [robotsPath, robots]
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
      guardedStatus: "a3_public_beta_minimum_launch_engineering_ready",
      phase: "Phase 1 public free index-lighting site",
      publicDataSource: "mock",
      scoreSource: "mock",
      productionDeployAuthorized: false
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
    /DNS change is approved/u,
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
  if (/[�]/u.test(source)) markers.push("visible-replacement-glyph");
  return markers;
}
