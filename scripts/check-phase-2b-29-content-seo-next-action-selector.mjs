import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const files = {
  doc: "docs/PHASE_2B_29_CONTENT_SEO_NEXT_ACTION_SELECTOR.md",
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
const handoffSectionMarker = "## Latest Coherent Slice: phase_2b_29_content_seo_next_action_selector";
const handoffSection = handoff.includes(handoffSectionMarker)
  ? handoff.slice(handoff.indexOf(handoffSectionMarker))
  : "";

const requiredDocSnippets = [
  "phase_2b_29_content_seo_next_action_selector_ready",
  "selectedNext=phase_2b_30_technical_seo_internal_link_audit",
  "optionA=hold_until_next_gsc_snapshot_or_specific_page_gap",
  "optionB=selected_next",
  "optionC=plan_after_technical_audit",
  "optionD=hold_policy_only",
  "gscWaitingDoesNotBlockSeoPlanning=true",
  "pagesReportLagAccepted=true",
  "PHASE_2B_30_TECHNICAL_SEO_INTERNAL_LINK_AUDIT.md",
  "Canonical",
  "Hreflang",
  "Structured data",
  "Internal links",
  "runtimePagePatch=false",
  "metadataPatch=false",
  "canonicalPatch=false",
  "hreflangPatch=false",
  "structuredDataPatch=false",
  "internalLinkPatch=false",
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
  "nextRecommendedSlice=phase_2b_30_technical_seo_internal_link_audit"
];

const requiredHandoffSnippets = [
  "phase_2b_29_content_seo_next_action_selector_ready",
  "selectedNext=phase_2b_30_technical_seo_internal_link_audit",
  "optionB=selected_next",
  "gscWaitingDoesNotBlockSeoPlanning=true",
  "pagesReportLagAccepted=true",
  "stockRouteIndexing=keep_existing_gated_scope",
  "requestIndexingAllPages=false",
  "repeatSitemapSubmissionNow=false",
  "sitemapExpansionNow=false",
  "analyticsRuntime=false",
  "adRuntime=false",
  "supabaseWrite=false",
  "sqlExecution=false",
  "marketDataFetch=false",
  "scoringChange=false",
  "nextRecommendedSlice=phase_2b_30_technical_seo_internal_link_audit"
];

function requireSnippets(label, content, snippets) {
  for (const snippet of snippets) {
    if (!content.includes(snippet)) failures.push(`${label} missing snippet: ${snippet}`);
  }
}

requireSnippets("Doc", doc, requiredDocSnippets);
requireSnippets("Handoff", handoffSection, requiredHandoffSnippets);

const forbiddenPatterns = [
  /runtimePagePatch=true/iu,
  /metadataPatch=true/iu,
  /canonicalPatch=true/iu,
  /hreflangPatch=true/iu,
  /structuredDataPatch=true/iu,
  /internalLinkPatch=true/iu,
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

if (!packageJson.scripts?.["check:phase-2b-29-content-seo-next-action-selector"]) {
  failures.push("package.json missing Phase 2B.29 checker script.");
}

if (failures.length > 0) {
  console.error("Phase 2B.29 content SEO next action selector check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_29_content_seo_next_action_selector",
      selectedNext: "phase_2b_30_technical_seo_internal_link_audit",
      optionA: "hold_until_next_gsc_snapshot_or_specific_page_gap",
      optionB: "selected_next",
      optionC: "plan_after_technical_audit",
      optionD: "hold_policy_only",
      gscWaitingDoesNotBlockSeoPlanning: true,
      pagesReportLagAccepted: true,
      stockRouteIndexing: "keep_existing_gated_scope",
      requestIndexingAllPages: false,
      repeatSitemapSubmissionNow: false,
      sitemapExpansionNow: false,
      analyticsRuntime: false,
      adRuntime: false,
      supabaseWrite: false,
      sqlExecution: false,
      marketDataFetch: false,
      scoringChange: false,
      runtimePromotion: false,
      nextRecommendedSlice: "phase_2b_30_technical_seo_internal_link_audit"
    },
    null,
    2
  )
);
