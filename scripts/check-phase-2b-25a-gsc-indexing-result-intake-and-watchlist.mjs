import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const files = {
  doc: "docs/PHASE_2B_25A_GSC_INDEXING_RESULT_INTAKE_AND_WATCHLIST.md",
  handoff: "docs/PHASE_2B_SEO_HANDOFF_STATUS.md",
  packageJson: "package.json"
};

const failures = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

const doc = read(files.doc);
const handoff = read(files.handoff);
const packageJson = JSON.parse(read(files.packageJson) || "{}");
const handoffSectionMarker = "## Latest Coherent Slice: phase_2b_25a_gsc_indexing_result_intake_and_watchlist";
const handoffSection = handoff.includes(handoffSectionMarker)
  ? handoff.slice(handoff.indexOf(handoffSectionMarker))
  : "";

const requiredDocSnippets = [
  "phase_2b_25a_gsc_indexing_result_intake_and_watchlist_ready",
  "productionDomain=https://market-signal.opensignallab.com/",
  "gscPagesReportAvailable=true",
  "gscIndexedCount=1",
  "gscNotIndexedCount=17",
  "gscReasonCount=3",
  "sitemapSubmitted=true",
  "sitemapStatus=success",
  "sitemapUrlCountProduction=26",
  "sitemapUrlCountGscDisplay=25_pending_refresh",
  "duplicateValidationRequested=true",
  "duplicateValidationRequestedAt=2026-07-04",
  "issue=duplicate_user_not_selected_canonical",
  "fixStatus=deployed",
  "gscValidationStatus=requested",
  "issue=discovered_currently_not_indexed",
  "currentCount=13",
  "issue=crawled_currently_not_indexed",
  "currentCount=3",
  "interpretation=gsc_display_lag",
  "requestIndexingAllPages=false",
  "repeatSitemapSubmissionNow=false",
  "stockRouteIndexing=keep_existing_gated_scope",
  "globalRouteIndexing=gated",
  "nonTaiwanMarketIndexing=gated",
  "globalRoutePublicExposure=false",
  "mockMarketPublicSeo=false",
  "analyticsRuntime=false",
  "adRuntime=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "runtimePromotion=false",
  "nextRecommendedSlice=phase_2b_26_core_page_content_seo_audit"
];

const requiredSections = [
  "## Purpose",
  "## Current GSC Snapshot",
  "## GSC Buckets",
  "## Fixed Item",
  "## Watchlist",
  "## Explicit Holds",
  "## Next Actions",
  "## Completion Criteria"
];

const requiredHandoffSnippets = [
  "phase_2b_25a_gsc_indexing_result_intake_and_watchlist_ready",
  "gscIndexedCount=1",
  "gscNotIndexedCount=17",
  "sitemapUrlCountProduction=26",
  "sitemapUrlCountGscDisplay=25_pending_refresh",
  "duplicateValidationRequested=true",
  "stockRouteIndexing=keep_existing_gated_scope",
  "globalRouteIndexing=gated",
  "nonTaiwanMarketIndexing=gated",
  "nextRecommendedSlice=phase_2b_26_core_page_content_seo_audit"
];

for (const snippet of requiredDocSnippets) {
  if (!doc.includes(snippet)) failures.push(`Doc missing snippet: ${snippet}`);
}

for (const section of requiredSections) {
  if (!doc.includes(section)) failures.push(`Doc missing section: ${section}`);
}

for (const snippet of requiredHandoffSnippets) {
  if (!handoffSection.includes(snippet)) failures.push(`Handoff missing snippet: ${snippet}`);
}

const forbiddenPatterns = [
  /requestIndexingAllPages=true/iu,
  /repeatSitemapSubmissionNow=true/iu,
  /stockRouteIndexing=opened/iu,
  /globalRouteIndexing=opened/iu,
  /nonTaiwanMarketIndexing=opened/iu,
  /globalRoutePublicExposure=true/iu,
  /mockMarketPublicSeo=true/iu,
  /analyticsRuntime=true/iu,
  /adRuntime=true/iu,
  /supabaseWrite=true/iu,
  /sqlExecution=true/iu,
  /marketDataFetch=true/iu,
  /runtimePromotion=true/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) failures.push(`Doc contains forbidden pattern: ${pattern}`);
  if (pattern.test(handoffSection)) failures.push(`Handoff section contains forbidden pattern: ${pattern}`);
}

if (!packageJson.scripts?.["check:phase-2b-25a-gsc-indexing-result-intake-and-watchlist"]) {
  failures.push("package.json missing Phase 2B.25a checker script.");
}

if (failures.length > 0) {
  console.error("Phase 2B.25a GSC indexing result intake and watchlist check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_25a_gsc_indexing_result_intake_and_watchlist",
      productionDomain: "https://market-signal.opensignallab.com/",
      gscIndexedCount: 1,
      gscNotIndexedCount: 17,
      sitemapUrlCountProduction: 26,
      sitemapUrlCountGscDisplay: "25_pending_refresh",
      duplicateValidationRequested: true,
      requestIndexingAllPages: false,
      repeatSitemapSubmissionNow: false,
      stockRouteIndexing: "keep_existing_gated_scope",
      globalRouteIndexing: "gated",
      nonTaiwanMarketIndexing: "gated",
      analyticsRuntime: false,
      adRuntime: false,
      supabaseWrite: false,
      sqlExecution: false,
      marketDataFetch: false,
      runtimePromotion: false,
      nextRecommendedSlice: "phase_2b_26_core_page_content_seo_audit"
    },
    null,
    2
  )
);
