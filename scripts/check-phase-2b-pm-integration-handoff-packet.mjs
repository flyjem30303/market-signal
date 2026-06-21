import fs from "node:fs";

const docPath = "docs/PHASE_2B_PM_INTEGRATION_HANDOFF_PACKET.md";
const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Slice: `phase_2b_pm_integration_handoff_packet`",
  "Status: ready for PM mainline integration",
  "marketSignalProductUrl=https://market-signal.opensignallab.com/",
  "parentBrandUrl=https://opensignallab.com/",
  "gscPropertyType=url-prefix",
  "gscSubmittedByPmCeo=true",
  "gscSitemapSubmitted=true",
  "gscSitemapUrl=https://market-signal.opensignallab.com/sitemap.xml",
  "gscDiscoveredUrls=15",
  "gscPagesReport=processing",
  "indexedNotIndexedInterpretation=pending",
  "stockRoutesIndexing=gated",
  "stockRoutesFullyIndexed=false",
  "Phase 2B SEO baseline is operational",
  "Stock routes remain gated",
  "noPmMainlineFileEdit=true",
  "noDnsChange=true",
  "noVercelSettingsChange=true",
  "noFurtherGscOperationByA3=true",
  "noSupabaseWrite=true",
  "noSql=true",
  "noMarketDataFetch=true",
  "noStockIndexGateOpenWithoutPmApproval=true",
  "noAdCode=true",
  "noAntiAdBlockBehavior=true",
  "noAnalyticsCode=true",
  "runtime code | none",
  "Supabase schema / writes | none",
  "phase_2b_gsc_pages_indexing_observation_result_intake",
  "gscPagesReport!=processing",
  "Requires PM integration: yes",
  "A3 did not modify PM mainline integration files"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const pattern of [
  /stockRoutesFullyIndexed=true/iu,
  /noPmMainlineFileEdit=false/iu,
  /noDnsChange=false/iu,
  /noVercelSettingsChange=false/iu,
  /noFurtherGscOperationByA3=false/iu,
  /noSupabaseWrite=false/iu,
  /noSql=false/iu,
  /noMarketDataFetch=false/iu,
  /noStockIndexGateOpenWithoutPmApproval=false/iu,
  /noAdCode=false/iu,
  /noAntiAdBlockBehavior=false/iu,
  /noAnalyticsCode=false/iu,
  /Supabase writes approved/iu,
  /SQL execution approved/iu,
  /all stock routes indexing open/iu
]) {
  if (pattern.test(doc)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_pm_integration_handoff_packet",
      docPath,
      requiresPmIntegration: true,
      productUrl: "https://market-signal.opensignallab.com/",
      gscSubmittedByPmCeo: true,
      gscDiscoveredUrls: 15,
      gscPagesReport: "processing",
      stockRoutesIndexing: "gated",
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      pmMainlineEditedByA3: false
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
