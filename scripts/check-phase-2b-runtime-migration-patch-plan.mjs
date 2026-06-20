import fs from "node:fs";

const docPath = "docs/PHASE_2B_RUNTIME_MIGRATION_PATCH_PLAN.md";
const problems = [];
const content = read(docPath);

for (const phrase of [
  "Slice: `phase_2b_runtime_migration_patch_plan`",
  "parentBrandUrl=https://opensignallab.com/",
  "marketSignalProductUrl=https://market-signal.opensignallab.com/",
  "currentPublicUrl=https://market-signal-two.vercel.app/",
  "Use Next.js basePath=\"/market-signal\"",
  "changing only `NEXT_PUBLIC_SITE_URL` is unsafe",
  "`next.config.mjs`: add an explicit `basePath` plan for `/market-signal`",
  "`src/lib/site.ts`: split site origin from product base path",
  "`src/lib/seo.ts`",
  "`src/app/sitemap.ts`",
  "`src/app/robots.ts`",
  "`src/app/layout.tsx`",
  "siteOrigin=https://opensignallab.com",
  "siteBasePath=",
  "absoluteUrl(\"/\") => https://market-signal.opensignallab.com/",
  "absoluteUrl(\"/briefing\") => https://market-signal.opensignallab.com/briefing",
  "absoluteUrl(\"/sitemap.xml\") => https://market-signal.opensignallab.com/sitemap.xml",
  "absoluteUrl(\"/og-default.svg\") => https://market-signal.opensignallab.com/og-default.svg",
  "absoluteUrl(\"/briefing\") => https://opensignallab.com/briefing",
  "cmd /c npm run check:phase-2b-seo-foundation",
  "cmd /c npm run check:phase-2b-custom-domain-runtime-readiness-inventory",
  "cmd /c npm run check:phase-2b-runtime-migration-patch-plan",
  "noRuntimePatch=true",
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
  "noMarketDataFetch=true",
  "stock indexing remains gated"
]) {
  if (!content.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /DNS change approved/iu,
  /Vercel settings change approved/iu,
  /GSC submission approved/iu,
  /canonical migration approved/iu,
  /runtime patch approved/iu,
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
      mode: "phase_2b_runtime_migration_patch_plan",
      docPath,
      parentBrandUrl: "https://opensignallab.com/",
      marketSignalProductUrl: "https://market-signal.opensignallab.com/",
      currentPublicUrl: "https://market-signal-two.vercel.app/",
      recommendedApproach: "Next.js basePath plus explicit URL helper contract",
      runtimePatchPlanned: true,
      runtimePatchExecuted: false,
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


