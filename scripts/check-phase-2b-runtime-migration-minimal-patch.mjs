import fs from "node:fs";

const files = {
  doc: "docs/PHASE_2B_RUNTIME_MIGRATION_MINIMAL_PATCH.md",
  nextConfig: "next.config.mjs",
  site: "src/lib/site.ts"
};

const problems = [];
const doc = read(files.doc);
const nextConfig = read(files.nextConfig);
const site = read(files.site);

for (const phrase of [
  "Slice: `phase_2b_runtime_migration_minimal_patch`",
  "`NEXT_PUBLIC_SITE_BASE_PATH` is now supported",
  "Default base path remains empty",
  "NEXT_PUBLIC_SITE_URL=https://opensignallab.com",
  "NEXT_PUBLIC_SITE_BASE_PATH=",
  "absoluteUrl(\"/\") => https://market-signal.opensignallab.com/",
  "absoluteUrl(\"/briefing\") => https://market-signal.opensignallab.com/briefing",
  "absoluteUrl(\"/sitemap.xml\") => https://market-signal.opensignallab.com/sitemap.xml",
  "absoluteUrl(\"/og-default.svg\") => https://market-signal.opensignallab.com/og-default.svg",
  "noDnsChange=true",
  "noCloudflareSettingsChange=true",
  "noVercelSettingsChange=true",
  "noGscOperationByA3=true",
  "noCanonicalHostMigration=true",
  "noSitemapHostMigration=true",
  "noRobotsSitemapHostMigration=true",
  "noProductionNextPublicSiteUrlChange=true",
  "noProductionNextBasePathChange=true",
  "noProductSubpathMigration=true",
  "stockRoutesIndexingFullyOpen=false",
  "noSql=true",
  "noSupabaseWrite=true",
  "noMarketDataFetch=true"
]) {
  if (!doc.includes(phrase)) problems.push(`${files.doc} missing: ${phrase}`);
}

for (const phrase of [
  "const siteBasePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH || \"\";",
  "...(siteBasePath ? { basePath: siteBasePath } : {})"
]) {
  if (!nextConfig.includes(phrase)) problems.push(`${files.nextConfig} missing: ${phrase}`);
}

for (const phrase of [
  "const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? \"http://localhost:3000\";",
  "const explicitBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_SITE_BASE_PATH);",
  "const inferredBasePath = explicitBasePath || normalizeBasePath(parsedSiteUrl.pathname);",
  "basePath: inferredBasePath",
  "origin: parsedSiteUrl.origin",
  "url: withTrailingSlash(`${parsedSiteUrl.origin}${inferredBasePath}`)",
  "export function absoluteUrl(path: string)",
  "stripBasePath(normalizedPath, siteConfig.basePath)",
  "function normalizeBasePath",
  "function stripBasePath",
  "function withTrailingSlash"
]) {
  if (!site.includes(phrase)) problems.push(`${files.site} missing: ${phrase}`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /DNS change approved/iu,
  /Vercel settings change approved/iu,
  /GSC submission approved/iu,
  /canonical migration approved/iu,
  /stockRoutesIndexingFullyOpen=true/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu
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
      mode: "phase_2b_runtime_migration_minimal_patch",
      parentBrandUrl: "https://opensignallab.com/",
      marketSignalProductUrl: "https://market-signal.opensignallab.com/",
      currentPublicUrl: "https://market-signal-two.vercel.app/",
      supportsNextPublicSiteBasePath: true,
      defaultBasePathRemainsEmpty: true,
      runtimePatchImplemented: true,
      platformMigrationExecuted: false,
      changesDns: false,
      changesCloudflareSettings: false,
      changesVercelSettings: false,
      changesGsc: false,
      changesProductionNextPublicSiteUrl: false,
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

