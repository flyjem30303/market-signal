import fs from "node:fs";

const docPath = "docs/PHASE_2B_CUSTOM_DOMAIN_RUNTIME_READINESS_INVENTORY.md";
const problems = [];
const content = read(docPath);

for (const phrase of [
  "Slice: `phase_2b_custom_domain_runtime_readiness_inventory`",
  "parentBrandUrl=https://opensignallab.com/",
  "marketSignalProductUrl=https://market-signal.opensignallab.com/",
  "currentPublicUrl=https://market-signal-two.vercel.app/",
  "not yet runtime-ready for a direct `/market-signal/` subpath migration",
  "`next.config.mjs` has no `basePath`",
  "`src/lib/site.ts` builds URLs with `new URL(path, siteConfig.url)`",
  "leading slash resets the path to the host root",
  "absoluteUrl(\"/briefing\") => https://opensignallab.com/briefing",
  "expected future URL => https://market-signal.opensignallab.com/briefing",
  "should not switch `NEXT_PUBLIC_SITE_URL` directly to `https://market-signal.opensignallab.com/`",
  "Option A: Use Next.js `basePath=\"/market-signal\"`",
  "Prefer Option A only after PM/CEO approves a coordinated runtime + Vercel + GSC migration slice",
  "noDnsChange=true",
  "noCloudflareSettingsChange=true",
  "noVercelSettingsChange=true",
  "noGscOperationByA3=true",
  "noCanonicalHostMigration=true",
  "noSitemapHostMigration=true",
  "noRobotsSitemapHostMigration=true",
  "noNextPublicSiteUrlChange=true",
  "noNextBasePathChange=true",
  "noProductSubpathMigration=true",
  "stockRoutesIndexingFullyOpen=false",
  "noSql=true",
  "noSupabaseWrite=true",
  "noMarketDataFetch=true"
]) {
  if (!content.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "`next.config.mjs`",
  "`src/lib/site.ts`",
  "`src/lib/seo.ts`",
  "`src/app/sitemap.ts`",
  "`src/app/robots.ts`",
  "`src/app/layout.tsx`"
]) {
  if (!content.includes(phrase)) problems.push(`${docPath} missing future scope file: ${phrase}`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /DNS change approved/iu,
  /Vercel settings change approved/iu,
  /GSC submission approved/iu,
  /canonical migration approved/iu,
  /NEXT_PUBLIC_SITE_URL changed/iu,
  /basePath changed/iu,
  /stockRoutesIndexingFullyOpen=true/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu
]) {
  if (pattern.test(content)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_custom_domain_runtime_readiness_inventory",
      docPath,
      parentBrandUrl: "https://opensignallab.com/",
      marketSignalProductUrl: "https://market-signal.opensignallab.com/",
      currentPublicUrl: "https://market-signal-two.vercel.app/",
      runtimeReadyForProductSubpath: false,
      blocker: "leading-slash absoluteUrl paths reset to host root without basePath/url composition migration",
      executionApproved: false,
      changesRuntimeFiles: false,
      changesDns: false,
      changesCloudflareSettings: false,
      changesVercelSettings: false,
      changesNextPublicSiteUrl: false,
      changesNextBasePath: false,
      changesGsc: false,
      changesCanonicalHost: false,
      changesSitemapHost: false,
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


