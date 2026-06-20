import fs from "node:fs";

const docPath = "docs/PHASE_2B_PRODUCT_SUBDOMAIN_STRATEGY_DECISION.md";
const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Status: `product_subdomain_strategy_selected`",
  "parentBrandUrl=https://opensignallab.com/",
  "marketSignalProductUrl=https://market-signal.opensignallab.com/",
  "previousProductSubpath=https://opensignallab.com/market-signal/",
  "superseded for production canonical planning",
  "Production does not need Next.js `basePath`",
  "NEXT_PUBLIC_SITE_URL=https://market-signal.opensignallab.com",
  "NEXT_PUBLIC_SITE_BASE_PATH=",
  "market-signal.opensignallab.com=Valid Configuration",
  "opensignallab.com=Valid Configuration",
  "market-signal-two.vercel.app=Valid Configuration",
  "noDnsChangeByA3=true",
  "noCloudflareSettingsChangeByA3=true",
  "noVercelSettingsChangeByA3=true",
  "noGscOperationByA3=true",
  "noCanonicalHostMigrationByA3=true",
  "noSitemapSubmissionByA3=true",
  "stockRoutesIndexingFullyOpen=false",
  "noSql=true",
  "noSupabaseWrite=true",
  "noMarketDataFetch=true"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
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
      mode: "phase_2b_product_subdomain_strategy_decision",
      parentBrandUrl: "https://opensignallab.com/",
      marketSignalProductUrl: "https://market-signal.opensignallab.com/",
      previousProductSubpath: "https://opensignallab.com/market-signal/",
      productSubpathSuperseded: true,
      productionNextPublicSiteUrl: "https://market-signal.opensignallab.com",
      productionNextPublicSiteBasePath: "",
      platformMigrationExecutedByA3: false,
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

