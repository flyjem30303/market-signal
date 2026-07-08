import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const files = {
  doc: "docs/PHASE_2B_28_CORE_PAGE_POST_DEPLOY_OBSERVATION.md",
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
const handoffSectionMarker = "## Latest Coherent Slice: phase_2b_28_core_page_post_deploy_observation";
const handoffSection = handoff.includes(handoffSectionMarker)
  ? handoff.slice(handoff.indexOf(handoffSectionMarker))
  : "";

const requiredDocSnippets = [
  "phase_2b_28_core_page_post_deploy_observation_ready",
  "https://market-signal.opensignallab.com",
  "2026-07-08",
  "`/markets` | 200",
  "`/stocks` | 200",
  "`/methodology` | 200",
  "phase2b27CopyPresent=true",
  "coreRoutesInSitemap=true",
  "sitemapUrlCount=26",
  "pagesReportLagAccepted=true",
  "requestIndexingAllPages=false",
  "repeatSitemapSubmissionNow=false",
  "sitemapExpansionNow=false",
  "stockRouteIndexing=keep_existing_gated_scope",
  "globalRouteIndexing=gated",
  "nonTaiwanMarketIndexing=gated",
  "analyticsRuntime=false",
  "adRuntime=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "runtimePromotion=false",
  "nextRecommendedSlice=phase_2b_29_content_seo_next_action_selector"
];

const requiredHandoffSnippets = [
  "phase_2b_28_core_page_post_deploy_observation_ready",
  "observedHost=https://market-signal.opensignallab.com",
  "coreRoutes200=true",
  "phase2b27CopyPresent=true",
  "coreRoutesInSitemap=true",
  "pagesReportLagAccepted=true",
  "requestIndexingAllPages=false",
  "repeatSitemapSubmissionNow=false",
  "stockRouteIndexing=keep_existing_gated_scope",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "nextRecommendedSlice=phase_2b_29_content_seo_next_action_selector"
];

function requireSnippets(label, content, snippets) {
  for (const snippet of snippets) {
    if (!content.includes(snippet)) failures.push(`${label} missing snippet: ${snippet}`);
  }
}

requireSnippets("Doc", doc, requiredDocSnippets);
requireSnippets("Handoff", handoffSection, requiredHandoffSnippets);

const forbiddenPatterns = [
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

if (!packageJson.scripts?.["check:phase-2b-28-core-page-post-deploy-observation"]) {
  failures.push("package.json missing Phase 2B.28 checker script.");
}

if (failures.length > 0) {
  console.error("Phase 2B.28 core page post-deploy observation check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_28_core_page_post_deploy_observation",
      observedHost: "https://market-signal.opensignallab.com",
      observedDate: "2026-07-08",
      coreRoutes200: true,
      phase2b27CopyPresent: true,
      coreRoutesInSitemap: true,
      sitemapUrlCount: 26,
      pagesReportLagAccepted: true,
      requestIndexingAllPages: false,
      repeatSitemapSubmissionNow: false,
      sitemapExpansionNow: false,
      stockRouteIndexing: "keep_existing_gated_scope",
      analyticsRuntime: false,
      adRuntime: false,
      supabaseWrite: false,
      sqlExecution: false,
      marketDataFetch: false,
      scoringChange: false,
      runtimePromotion: false,
      nextRecommendedSlice: "phase_2b_29_content_seo_next_action_selector"
    },
    null,
    2
  )
);
