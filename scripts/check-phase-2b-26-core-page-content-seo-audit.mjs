import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const files = {
  doc: "docs/PHASE_2B_26_CORE_PAGE_CONTENT_SEO_AUDIT.md",
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
const handoffSectionMarker = "## Latest Coherent Slice: phase_2b_26_core_page_content_seo_audit";
const handoffSection = handoff.includes(handoffSectionMarker)
  ? handoff.slice(handoff.indexOf(handoffSectionMarker))
  : "";

const requiredDocSnippets = [
  "phase_2b_26_core_page_content_seo_audit_ready",
  "productionDomain=https://market-signal.opensignallab.com/",
  "gscIndexedCount=1",
  "gscNotIndexedCount=17",
  "gscReasonObserved=crawled_currently_not_indexed",
  "affectedCoreExamples=/methodology,/stocks,/markets",
  "phase2SitemapLive=true",
  "stockRouteIndexing=keep_existing_gated_scope",
  "globalRouteIndexing=gated",
  "nonTaiwanMarketIndexing=gated",
  "| `/markets` | Market Explorer |",
  "| `/stocks` | Target Finder |",
  "| `/methodology` | Evidence / Methodology |",
  "route=/markets",
  "route=/stocks",
  "route=/methodology",
  "runtimePagePatch=false",
  "requestIndexingAllPages=false",
  "repeatSitemapSubmissionNow=false",
  "sitemapExpansionNow=false",
  "analyticsRuntime=false",
  "adRuntime=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "runtimePromotion=false",
  "nextRecommendedSlice=phase_2b_27_core_page_content_patch",
  "patchRoutes=/markets,/stocks,/methodology",
  "patchMode=small_static_content_only"
];

const requiredSections = [
  "## Purpose",
  "## Input Evidence",
  "## Audit Summary",
  "## Route-Level Findings",
  "## Recommended Execution Order",
  "## Explicit Holds",
  "## Completion Criteria",
  "## Next Recommended Slice"
];

const requiredHandoffSnippets = [
  "phase_2b_26_core_page_content_seo_audit_ready",
  "gscReasonObserved=crawled_currently_not_indexed",
  "affectedCoreExamples=/methodology,/stocks,/markets",
  "stockRouteIndexing=keep_existing_gated_scope",
  "globalRouteIndexing=gated",
  "nonTaiwanMarketIndexing=gated",
  "runtimePagePatch=false",
  "requestIndexingAllPages=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "nextRecommendedSlice=phase_2b_27_core_page_content_patch"
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
  /runtimePagePatch=true/iu,
  /requestIndexingAllPages=true/iu,
  /repeatSitemapSubmissionNow=true/iu,
  /sitemapExpansionNow=true/iu,
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
  /scoringChange=true/iu,
  /runtimePromotion=true/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) failures.push(`Doc contains forbidden pattern: ${pattern}`);
  if (pattern.test(handoffSection)) failures.push(`Handoff section contains forbidden pattern: ${pattern}`);
}

if (!packageJson.scripts?.["check:phase-2b-26-core-page-content-seo-audit"]) {
  failures.push("package.json missing Phase 2B.26 checker script.");
}

if (failures.length > 0) {
  console.error("Phase 2B.26 core page content SEO audit check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_26_core_page_content_seo_audit",
      productionDomain: "https://market-signal.opensignallab.com/",
      gscReasonObserved: "crawled_currently_not_indexed",
      affectedCoreExamples: ["/methodology", "/stocks", "/markets"],
      runtimePagePatch: false,
      requestIndexingAllPages: false,
      repeatSitemapSubmissionNow: false,
      sitemapExpansionNow: false,
      stockRouteIndexing: "keep_existing_gated_scope",
      globalRouteIndexing: "gated",
      nonTaiwanMarketIndexing: "gated",
      analyticsRuntime: false,
      adRuntime: false,
      supabaseWrite: false,
      sqlExecution: false,
      marketDataFetch: false,
      scoringChange: false,
      runtimePromotion: false,
      nextRecommendedSlice: "phase_2b_27_core_page_content_patch"
    },
    null,
    2
  )
);
