import fs from "node:fs";

const recordPath = "docs/PHASE_2B_DOMAIN_USAGE_DECISION_RECORD.md";
const problems = [];
const record = read(recordPath);

for (const phrase of [
  "Owner: CEO / PM mainline",
  "Handoff owner: A3 Phase 2B SEO support lane",
  "Decision date: 2026-06-21",
  "Status: `domain_usage_decision_recorded_for_a3_handoff`",
  "CEO selected `opensignallab.com` as the parent brand domain",
  "not a Market Signal-only domain",
  "Parent brand URL: `https://opensignallab.com/`",
  "Market Signal product URL: `https://market-signal.opensignallab.com/`",
  "Use lowercase host and path",
  "https://opensignallab.com/",
  "https://market-signal.opensignallab.com/",
  "https://opensignallab.com/life-pressure-lab/",
  "https://opensignallab.com/project-3/",
  "parent root must not be treated as the Market Signal canonical URL",
  "public-data and social-observation brand direction",
  "custom_domain_strategy_selected_execution_deferred",
  "https://market-signal-two.vercel.app/",
  "product subdomain strategy for `https://market-signal.opensignallab.com/`",
  "CEO reported that `OpenSignalLab.com` was purchased through Cloudflare Registrar on 2026-06-21",
  "Auto-renewal is intentionally not enabled yet"
]) {
  if (!record.includes(phrase)) problems.push(`${recordPath} missing: ${phrase}`);
}

for (const phrase of [
  "DNS changes",
  "Cloudflare settings changes",
  "Vercel project settings changes",
  "`NEXT_PUBLIC_SITE_URL` changes",
  "canonical host migration",
  "sitemap host migration",
  "Google Search Console property creation",
  "sitemap submission",
  "Supabase reads or writes",
  "SQL execution",
  "market-data fetch, ingest, storage, or source promotion"
]) {
  if (!record.includes(phrase)) problems.push(`${recordPath} missing boundary: ${phrase}`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /Supabase writes approved/iu,
  /SQL execution approved/iu,
  /DNS change approved/iu,
  /Vercel settings change approved/iu,
  /GSC submission approved/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu
]) {
  if (pattern.test(record)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_domain_usage_decision_record",
      recordPath,
      selectedDomain: "opensignallab.com",
      parentBrandUrl: "https://opensignallab.com/",
      marketSignalProductUrl: "https://market-signal.opensignallab.com/",
      parentBrandDomain: true,
      marketSignalUsesProductSubdomain: true,
      a3Handoff: true,
      executionDeferred: true,
      changesDns: false,
      changesCloudflareSettings: false,
      changesVercelSettings: false,
      changesNextPublicSiteUrl: false,
      changesGsc: false,
      changesCanonicalHost: false,
      changesSitemapHost: false,
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

