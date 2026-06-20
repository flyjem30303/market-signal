import fs from "node:fs";

const handoffPath = "docs/PHASE_2B_SEO_HANDOFF_STATUS.md";
const problems = [];
const handoff = read(handoffPath);

for (const phrase of [
  "Owner: A3 Phase 2B SEO support lane",
  "Governance: CEO-led, PM-integrated, karpathy-guidelines",
  "Status: `phase_2b_seo_handoff_status_current`",
  "Slice: `phase_2b_gsc_post_submit_observation_t1`",
  "gsc_t1_sitemap_success_page_indexing_processing",
  "parentBrandUrl=https://opensignallab.com/",
  "marketSignalProductUrl=https://market-signal.opensignallab.com/",
  "GSC Sitemap Submission Record P1",
  "GSC Post-submit Observation T1 P1",
  "T1 observed; sitemap success; discoveredUrls=15; page indexing processing",
  "submitted by PM/CEO; sitemap success; discoveredUrls=15; page indexing processing",
  "https://market-signal.opensignallab.com/sitemap.xml",
  "submissionDate=2026-06-21",
  "A3 did not perform GSC platform operations",
  "discoveredUrls=15",
  "page indexing processing",
  "indexed/not-indexed counts remain pending",
  "gscSubmittedByPmCeo=true",
  "noGscOperation=true",
  "noSql=true",
  "noSupabaseWrite=true",
  "noMarketDataFetch=true",
  "noStockIndexGateOpenWithoutPmApproval=true",
  "phase_2b_gsc_post_submit_observation_t1",
  "phase_2b_gsc_post_submit_observation_t2_t3",
  "stock universe: 1086",
  "Eligible stock routes under local mock gate",
  "`0`"
]) {
  if (!handoff.includes(phrase)) problems.push(`${handoffPath} missing: ${phrase}`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /Supabase writes approved/iu,
  /SQL execution approved/iu,
  /stockRoutesIndexingFullyOpen=true/iu
]) {
  if (pattern.test(handoff)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2b_seo_handoff_status",
      handoffPath,
      ceoLed: true,
      karpathyGuidelines: true,
      requiresPmIntegration: true,
      gscPostSubmitObservationT1P1: "completed",
      discoveredUrls: 15,
      pageIndexingStatus: "processing",
      nextRecommendedSlice: "phase_2b_gsc_post_submit_observation_t2_t3",
      publicUiLayoutImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      stockRoutesIndexingFullyOpen: false
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
