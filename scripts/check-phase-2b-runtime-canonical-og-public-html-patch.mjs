import fs from "node:fs";

const files = {
  doc: "docs/PHASE_2B_RUNTIME_CANONICAL_OG_PUBLIC_HTML_PATCH.md",
  seo: "src/lib/seo.ts"
};

const problems = [];
const doc = read(files.doc);
const seo = read(files.seo);

for (const phrase of [
  "Slice: `phase_2b_runtime_canonical_og_public_html_patch`",
  "https://market-signal.opensignallab.com/ = 200",
  "public HTML did not expose expected canonical or `og:url` tags before this patch",
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
      mode: "phase_2b_runtime_canonical_og_public_html_patch",
      expectedCanonicalHost: "https://market-signal.opensignallab.com",
      runtimeSeoPatchImplemented: true,
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

