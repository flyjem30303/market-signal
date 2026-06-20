import fs from "node:fs";

const docPath = "docs/PHASE_2B_CUSTOM_DOMAIN_PRODUCT_SUBPATH_EXECUTION_PREFLIGHT.md";
const problems = [];
const content = read(docPath);

for (const phrase of [
  "Slice: `phase_2b_custom_domain_product_subpath_execution_preflight`",
  "parentBrandUrl=https://opensignallab.com/",
  "marketSignalProductUrl=https://market-signal.opensignallab.com/",
  "https://market-signal-two.vercel.app/",
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
  "The parent-brand root must not become the Market Signal canonical URL",
  "https://market-signal.opensignallab.com/briefing",
  "URL prefix property: `https://market-signal.opensignallab.com/`",
  "Stock routes remain gated"
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
      mode: "phase_2b_custom_domain_product_subpath_execution_preflight",
      docPath,
      parentBrandUrl: "https://opensignallab.com/",
      marketSignalProductUrl: "https://market-signal.opensignallab.com/",
      currentPublicUrl: "https://market-signal-two.vercel.app/",
      executionPrepared: true,
      executionApproved: false,
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


