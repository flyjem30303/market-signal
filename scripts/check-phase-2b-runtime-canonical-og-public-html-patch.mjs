import fs from "node:fs";

const files = {
  doc: "docs/PHASE_2B_RUNTIME_CANONICAL_OG_PUBLIC_HTML_PATCH.md",
  seo: "src/lib/seo.ts",
  routes: [
    ["src/app/page.tsx", "/"],
    ["src/app/briefing/page.tsx", "/briefing"],
    ["src/app/weekly/page.tsx", "/weekly"],
    ["src/app/methodology/page.tsx", "/methodology"],
    ["src/app/disclaimer/page.tsx", "/disclaimer"],
    ["src/app/privacy/page.tsx", "/privacy"],
    ["src/app/terms/page.tsx", "/terms"]
  ]
};

const problems = [];
const doc = read(files.doc);
const seo = read(files.seo);

for (const phrase of [
  "Slice: `phase_2b_route_level_public_head_metadata_patch`",
  "https://market-signal.opensignallab.com/ = 200",
  "https://market-signal.opensignallab.com/market-signal = 404",
  "public HTML did not expose expected canonical or `og:url` tags",
  "plain `title` / `description` metadata",
  "Core public routes now use `buildRouteMetadata(...)` directly",
  "`/`",
  "`/briefing`",
  "`/weekly`",
  "`/methodology`",
  "`/disclaimer`",
  "`/privacy`",
  "`/terms`",
  "`metadataBase: new URL(siteConfig.url)`",
  "relative `alternates.canonical`",
  "relative `openGraph.url`",
  "<link rel=\"canonical\" href=\"https://market-signal.opensignallab.com/\">",
  "<meta property=\"og:url\" content=\"https://market-signal.opensignallab.com/\">",
  "noDnsChangeByA3=true",
  "noCloudflareSettingsChangeByA3=true",
  "noVercelSettingsChangeByA3=true",
  "noGscOperationByA3=true",
  "noSitemapSubmissionByA3=true",
  "stockRoutesIndexingFullyOpen=false",
  "noSql=true",
  "noSupabaseWrite=true",
  "noMarketDataFetch=true"
]) {
  if (!doc.includes(phrase)) problems.push(`${files.doc} missing: ${phrase}`);
}

for (const phrase of [
  "metadataBase: new URL(siteConfig.url)",
  "canonical: path",
  "url: seoDefaultImagePath",
  "url: path",
  "images: [seoDefaultImagePath]"
]) {
  if (!seo.includes(phrase)) problems.push(`${files.seo} missing: ${phrase}`);
}

for (const [routeFile, routePath] of files.routes) {
  const route = read(routeFile);
  if (!route.includes('import { buildRouteMetadata } from "@/lib/seo";')) {
    problems.push(`${routeFile} missing buildRouteMetadata import`);
  }
  if (!route.includes("export const metadata")) {
    problems.push(`${routeFile} missing metadata export`);
  }
  if (!route.includes("buildRouteMetadata({")) {
    problems.push(`${routeFile} does not call buildRouteMetadata`);
  }
  if (!route.includes(`path: "${routePath}"`)) {
    problems.push(`${routeFile} missing canonical path ${routePath}`);
  }
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /DNS change approved/iu,
  /Vercel settings change approved/iu,
  /GSC submission approved/iu,
  /stockRoutesIndexingFullyOpen=true/iu
]) {
  if (pattern.test(doc)) problems.push(`forbidden doc pattern found: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_route_level_public_head_metadata_patch",
      expectedCanonicalHost: "https://market-signal.opensignallab.com",
      routeLevelMetadataImplemented: true,
      coreRoutesChecked: files.routes.length,
      requiresRedeployObservation: true,
      changesDns: false,
      changesCloudflareSettings: false,
      changesVercelSettings: false,
      changesGsc: false,
      stockRoutesIndexingFullyOpen: false,
      supabaseImpact: false,
      sqlImpact: false,
      marketDataFetchImpact: false
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
