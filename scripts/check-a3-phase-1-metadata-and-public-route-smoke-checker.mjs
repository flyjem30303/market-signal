import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_METADATA_AND_PUBLIC_ROUTE_SMOKE_CHECKER.md";
const postDeployPacketPath = "docs/A3_PHASE_1_POST_DEPLOY_SMOKE_AND_MONITORING_PACKET.md";
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
const doc = read(docPath);
const postDeployPacket = read(postDeployPacketPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const layout = read(layoutPath);
const site = read(sitePath);
const sitemap = read(sitemapPath);
const robots = read(robotsPath);

const requiredDocPhrases = [
  "a3_phase_1_metadata_and_public_route_smoke_checker_ready",
  "Phase 1 Metadata Scope",
  "Route Smoke Scope",
  "check:a3-phase-1-metadata-and-public-route-smoke-checker",
  "prepare_phase_1_release_candidate_public_smoke_report",
  "metadata and route copy support the revised BRIEF",
  "latest public-language and product-readability gates are part of the release smoke chain",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const route of ["/", "/briefing", "/weekly", "/methodology", "/disclaimer", "/terms", "/privacy", "/stocks/TWII", "/stocks/2330", "/stocks/0050"]) {
  if (!doc.includes(`\`${route}\``)) problems.push(`${docPath} missing smoke route: ${route}`);
  if (!postDeployPacket.includes(`\`${route}\``)) problems.push(`${postDeployPacketPath} missing inherited smoke route: ${route}`);
}

for (const phrase of [
  "指數燈號",
  "市場狀態儀表站",
  "風險提示",
  "資料更新時間",
  "非投資建議",
  "metadataBase",
  "NEXT_PUBLIC_SITE_URL"
]) {
  if (!layout.includes(phrase)) problems.push(`${layoutPath} missing metadata phrase: ${phrase}`);
}

if (!site.includes('name: "指數燈號"')) problems.push(`${sitePath} must name the site as 指數燈號`);
if (!site.includes("NEXT_PUBLIC_SITE_URL")) problems.push(`${sitePath} must keep NEXT_PUBLIC_SITE_URL support`);

for (const filePath of pageMetadataFiles) {
  const source = read(filePath);
  if (!source.includes("Metadata")) problems.push(`${filePath} missing Metadata import or use`);
  if (!source.includes("title:") && !source.includes("generateMetadata")) problems.push(`${filePath} missing title metadata`);
  if (!source.includes("description")) problems.push(`${filePath} missing description metadata`);
}

const stockPage = read("src/app/stocks/[symbol]/page.tsx");
for (const phrase of ["generateMetadata", "canonical", "openGraph", "siteConfig.name", "市場燈號", "非投資建議", "資料更新時間"]) {
  if (!stockPage.includes(phrase)) problems.push(`src/app/stocks/[symbol]/page.tsx missing stock metadata phrase: ${phrase}`);
}

for (const phrase of ["staticRoutes", '"/briefing"', '"/weekly"', '"/methodology"', '"/privacy"', '"/terms"', '"/disclaimer"', "repository.getAssets()", "/stocks/", "MetadataRoute.Sitemap"]) {
  if (!sitemap.includes(phrase)) problems.push(`${sitemapPath} missing sitemap phrase: ${phrase}`);
}

for (const phrase of ["MetadataRoute.Robots", 'userAgent: "*"', 'allow: "/"', '"/internal"', '"/api/internal"', 'absoluteUrl("/sitemap.xml")']) {
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
  [docPath, doc],
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
  if (/(?:瘞|鞈|撣|蝷|隤|蝚|銝|閮|甇|霈|憸|雿|璇|蝭|靘|摰|敺|嚗|銴|鈭|銵|蝡|脫|蝘|餈|頝|鞎)/u.test(source)) {
    markers.push("legacy-mojibake-cjk-run");
  }
  return markers;
}
