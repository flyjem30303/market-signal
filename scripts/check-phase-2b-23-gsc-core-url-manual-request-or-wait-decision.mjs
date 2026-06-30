import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const files = {
  doc: "docs/PHASE_2B_23_GSC_CORE_URL_MANUAL_REQUEST_OR_WAIT_DECISION.md",
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

const requiredDocSnippets = [
  "phase_2b_23_gsc_core_url_manual_request_or_wait_decision_ready",
  "selectedSlice=phase_2b_23_gsc_core_url_manual_request_or_wait_decision",
  "priorSlice=phase_2b_22_technical_indexability_audit",
  "decision=core_urls_requested_once_then_wait_for_gsc_processing",
  "productionDomain=https://market-signal.opensignallab.com/",
  "publicScope=taiwan_only",
  "productionMarket=tw",
  "technicalIndexabilityStatus=pass",
  "gscLiveTestIndexable=true",
  "gscPagesIndexingReportStatus=processing_or_pending_concrete_result",
  "coreUrlManualRequestStatus=completed_by_pm_once",
  "requestIndexingAllPages=false",
  "repeatRequestIndexingNow=false",
  "sitemapResubmissionNow=false",
  "sitemapUrlExpansionNow=false",
  "gscActionNow=false",
  "coreUrlsRequested=/",
  "coreUrlsRequested=/markets",
  "coreUrlsRequested=/markets/tw",
  "coreUrlsRequested=/stocks",
  "coreUrlsRequested=/methodology",
  "stockRouteIndexing=keep_existing_gated_scope",
  "globalRouteIndexing=gated",
  "nonTaiwanMarketIndexing=gated",
  "phase2aLiveMarketExpansion=paused",
  "globalPublicDataSource=mock",
  "marketDataFetch=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "runtimePromotion=false",
  "phase_2b_gsc_observation_result_intake_when_report_available"
];

const requiredSections = [
  "## Purpose",
  "## Decision Snapshot",
  "## CEO / PM Decision",
  "## Core URL Scope",
  "## Observation Rule",
  "## Explicit Holds",
  "## Result Classification When GSC Reports",
  "## Next Recommendation"
];

const requiredStatusSnippets = [
  "Phase 2B.23 GSC core URL manual request or wait decision is accepted.",
  "phase_2b_23_gsc_core_url_manual_request_or_wait_decision_ready",
  "coreUrlManualRequestStatus=completed_by_pm_once",
  "repeatRequestIndexingNow=false",
  "sitemapResubmissionNow=false",
  "sitemapUrlExpansionNow=false",
  "gscActionNow=false",
  "phase2aLiveMarketExpansion=paused",
  "globalPublicDataSource=mock"
];

for (const snippet of requiredDocSnippets) {
  if (!doc.includes(snippet)) failures.push(`Doc missing snippet: ${snippet}`);
}

for (const section of requiredSections) {
  if (!doc.includes(section)) failures.push(`Doc missing section: ${section}`);
}

for (const snippet of requiredStatusSnippets) {
  if (!handoff.includes(snippet)) failures.push(`Handoff missing snippet: ${snippet}`);
}

const forbiddenPatterns = [
  /requestIndexingAllPages=true/iu,
  /repeatRequestIndexingNow=true/iu,
  /sitemapResubmissionNow=true/iu,
  /sitemapUrlExpansionNow=true/iu,
  /gscActionNow=true/iu,
  /stockRouteIndexing=opened/iu,
  /globalRouteIndexing=opened/iu,
  /nonTaiwanMarketIndexing=opened/iu,
  /phase2aLiveMarketExpansion=active/iu,
  /globalPublicDataSource\s*=\s*(vendor|supabase|real)/iu,
  /(?:^|\n)marketDataFetch=true/iu,
  /(?:^|\n)supabaseWrite=true/iu,
  /(?:^|\n)sqlExecution=true/iu,
  /(?:^|\n)runtimePromotion=true/iu,
  /Signal Framework production scoring migration approved/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) failures.push(`Doc contains forbidden pattern: ${pattern}`);
  if (pattern.test(handoff)) failures.push(`Handoff contains forbidden pattern: ${pattern}`);
}

if (!packageJson.scripts?.["check:phase-2b-23-gsc-core-url-manual-request-or-wait-decision"]) {
  failures.push("package.json missing Phase 2B.23 checker script.");
}

if (failures.length > 0) {
  console.error("Phase 2B.23 GSC core URL manual request or wait decision check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_23_gsc_core_url_manual_request_or_wait_decision",
      decision: "core_urls_requested_once_then_wait_for_gsc_processing",
      productionDomain: "https://market-signal.opensignallab.com/",
      publicScope: "taiwan_only",
      technicalIndexabilityStatus: "pass",
      coreUrlManualRequestStatus: "completed_by_pm_once",
      requestIndexingAllPages: false,
      repeatRequestIndexingNow: false,
      sitemapResubmissionNow: false,
      sitemapUrlExpansionNow: false,
      gscActionNow: false,
      phase2aLiveMarketExpansion: "paused",
      globalPublicDataSource: "mock",
      marketDataFetch: false,
      supabaseWrite: false,
      sqlExecution: false,
      runtimePromotion: false,
      nextRecommendedSlice: "phase_2b_gsc_observation_result_intake_when_report_available"
    },
    null,
    2
  )
);
