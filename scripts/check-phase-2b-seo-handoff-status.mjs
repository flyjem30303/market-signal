import fs from "node:fs";

const handoffPath = "docs/PHASE_2B_SEO_HANDOFF_STATUS.md";
const problems = [];
const handoff = read(handoffPath);

for (const phrase of [
  "Owner: A3 Phase 2B SEO support lane",
  "Governance: CEO-led, PM-integrated, karpathy-guidelines",
  "Status: `phase_2b_seo_handoff_status_current`",
  "Slice: `phase_2c_monetization_readiness_policy`",
  "monetization_readiness_policy_prepared_no_ads_no_antiblock",
  "Monetization Readiness Policy P1",
  "docs/PHASE_2C_MONETIZATION_READINESS_POLICY.md",
  "scripts/check-phase-2c-monetization-readiness-policy.mjs",
  "cmd /c npm run check:phase-2c-monetization-readiness-policy",
  "phase_2c_monetization_readiness_policy",
  "phase_2c_sponsor_disclosure_and_placeholder_slot",
  "adCodeImplemented=false",
  "antiAdBlockImplemented=false",
  "adBlockDetectionImplemented=false",
  "contentBlockingForAdBlock=false",
  "Do not implement ads or anti-AdBlock during GSC processing.",
  "phase_2b_gsc_post_submit_observation_t2_t3",
  "discoveredUrls=15",
  "indexed/not-indexed counts remain pending",
  "gscSubmittedByPmCeo=true",
  "noGscOperation=true",
  "noSql=true",
  "noSupabaseWrite=true",
  "noMarketDataFetch=true",
  "noStockIndexGateOpenWithoutPmApproval=true",
  "stock universe: 1086",
  "Eligible stock routes under local mock gate",
  "`0`"
]) {
  if (!handoff.includes(phrase)) problems.push(`${handoffPath} missing: ${phrase}`);
}

for (const pattern of [
  /adsbygoogle/iu,
  /googlesyndication/iu,
  /antiAdBlockImplemented=true/iu,
  /adBlockDetectionImplemented=true/iu,
  /contentBlockingForAdBlock=true/iu,
  /adCodeImplemented=true/iu,
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
      monetizationReadinessPolicyP1: "prepared",
      adCodeImplemented: false,
      antiAdBlockImplemented: false,
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
