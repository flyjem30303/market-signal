import fs from "node:fs";

const docPath = "docs/PHASE_2B_RUNTIME_MIGRATION_URL_CONTRACT_CHECKER.md";
const sitePath = "src/lib/site.ts";
const problems = [];
const doc = read(docPath);
const siteSource = read(sitePath);

for (const phrase of [
  "Slice: `phase_2b_runtime_migration_url_contract_checker`",
  "current root mode remains stable",
  "future product-subdomain mode keeps root app routes under `market-signal.opensignallab.com`",
  "siteUrl=https://market-signal-two.vercel.app/",
  "absoluteUrl(\"/briefing\") => https://market-signal-two.vercel.app/briefing",
  "siteUrl=https://market-signal.opensignallab.com",
  "absoluteUrl(\"/\") => https://market-signal.opensignallab.com/",
  "absoluteUrl(\"/briefing\") => https://market-signal.opensignallab.com/briefing",
  "absoluteUrl(\"/weekly\") => https://market-signal.opensignallab.com/weekly",
  "absoluteUrl(\"/methodology\") => https://market-signal.opensignallab.com/methodology",
  "absoluteUrl(\"/sitemap.xml\") => https://market-signal.opensignallab.com/sitemap.xml",
  "absoluteUrl(\"/og-default.svg\") => https://market-signal.opensignallab.com/og-default.svg",
  "absoluteUrl(\"/briefing\") => https://opensignallab.com/briefing",
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
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "NEXT_PUBLIC_SITE_BASE_PATH",
  "normalizeBasePath",
  "stripBasePath",
  "withTrailingSlash",
  "basePath: inferredBasePath",
  "origin: parsedSiteUrl.origin"
]) {
  if (!siteSource.includes(phrase)) problems.push(`${sitePath} missing helper source: ${phrase}`);
}

const rootCase = makeSite("https://market-signal-two.vercel.app/", "");
expectUrl(rootCase, "/", "https://market-signal-two.vercel.app/");
expectUrl(rootCase, "/briefing", "https://market-signal-two.vercel.app/briefing");
expectUrl(rootCase, "/sitemap.xml", "https://market-signal-two.vercel.app/sitemap.xml");
expectUrl(rootCase, "/og-default.svg", "https://market-signal-two.vercel.app/og-default.svg");

const productSubdomainCase = makeSite("https://market-signal.opensignallab.com/", "");
expectUrl(productSubdomainCase, "/", "https://market-signal.opensignallab.com/");
expectUrl(productSubdomainCase, "/briefing", "https://market-signal.opensignallab.com/briefing");
expectUrl(productSubdomainCase, "/weekly", "https://market-signal.opensignallab.com/weekly");
expectUrl(productSubdomainCase, "/methodology", "https://market-signal.opensignallab.com/methodology");
expectUrl(productSubdomainCase, "/sitemap.xml", "https://market-signal.opensignallab.com/sitemap.xml");
expectUrl(productSubdomainCase, "/og-default.svg", "https://market-signal.opensignallab.com/og-default.svg");

const badUrl = absoluteUrl(productSubdomainCase, "/briefing");
if (badUrl === "https://opensignallab.com/briefing") {
  problems.push("regression: /briefing resolved to parent-brand root instead of product subdomain");
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
      mode: "phase_2b_runtime_migration_url_contract_checker",
      rootMode: {
        url: rootCase.url,
        basePath: rootCase.basePath
      },
      productSubdomainMode: {
        url: productSubdomainCase.url,
        basePath: productSubdomainCase.basePath
      },
      guardedBadCase: "https://opensignallab.com/briefing",
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

function makeSite(rawSiteUrl, rawBasePath) {
  const parsedSiteUrl = new URL(rawSiteUrl);
  const explicitBasePath = normalizeBasePath(rawBasePath);
  const inferredBasePath = explicitBasePath || normalizeBasePath(parsedSiteUrl.pathname);
  return {
    basePath: inferredBasePath,
    origin: parsedSiteUrl.origin,
    url: withTrailingSlash(`${parsedSiteUrl.origin}${inferredBasePath}`)
  };
}

function absoluteUrl(site, path) {
  if (/^https?:\/\//iu.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pathWithoutBase = stripBasePath(normalizedPath, site.basePath);
  return new URL(`${site.basePath}${pathWithoutBase}`, site.origin).toString();
}

function normalizeBasePath(path = "") {
  if (!path || path === "/") return "";
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.replace(/\/+$/u, "");
}

function stripBasePath(path, basePath) {
  if (!basePath) return path;
  if (path === basePath) return "/";
  if (path.startsWith(`${basePath}/`)) return path.slice(basePath.length);
  return path;
}

function withTrailingSlash(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

function expectUrl(site, path, expected) {
  const actual = absoluteUrl(site, path);
  if (actual !== expected) {
    problems.push(`url contract failed: ${path}; expected ${expected}; actual ${actual}`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}


