import fs from "node:fs";

const handoffPath = "docs/PHASE_2B_SEO_HANDOFF_STATUS.md";
const problems = [];
const handoff = read(handoffPath);

for (const phrase of [
  "Owner: A3 Phase 2B SEO support lane",
  "Governance: CEO-led, PM-integrated, karpathy-guidelines",
  "Status: `phase_2b_seo_handoff_status_current`",
  "Slice: `phase_2c_privacy_safe_analytics_readiness`",
  "privacy_safe_analytics_readiness_prepared_no_tracking_code",
  "A3 to PM Handoff Packet P1",
  "Privacy-safe Analytics Readiness P1",
  "docs/PHASE_2C_A3_PM_HANDOFF_PACKET.md",
  "docs/PHASE_2C_PRIVACY_SAFE_ANALYTICS_READINESS.md",
  "scripts/check-phase-2c-a3-pm-handoff-packet.mjs",
  "scripts/check-phase-2c-privacy-safe-analytics-readiness.mjs",
  "cmd /c npm run check:phase-2c-a3-pm-handoff-packet",
  "cmd /c npm run check:phase-2c-privacy-safe-analytics-readiness",
  "phase_2c_privacy_safe_analytics_readiness",
  "Did not modify PM mainline integration files.",
  "PM integrates A3 status into the PM mainline.",
  "phase_2b_gsc_post_submit_observation_t2_t3",
  "phase_2c_sponsor_disclosure_and_placeholder_slot",
  "adCodeImplemented=false",
  "antiAdBlockImplemented=false",
  "adBlockDetectionImplemented=false",
  "contentBlockingForAdBlock=false",
  "analyticsCodeImplemented=false",
  "ga4Installed=false",
  "clarityInstalled=false",
  "vercelAnalyticsInstalled=false",
  "thirdPartyTrackingScriptAdded=false",
  "personalizedAdTargeting=false",
  "investmentIntentTracking=false",
  "watchlistAdTargeting=false",
  "Phase 2C privacy-safe analytics readiness",
  "prepared as policy-only; no analytics runtime authority",
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
  /\bgtag\s*\(/iu,
  /googletagmanager/iu,
  /google-analytics/iu,
  /clarity\.ms/iu,
  /@vercel\/analytics/iu,
  /thirdPartyTrackingScriptAdded=true/iu,
  /analyticsCodeImplemented=true/iu,
  /personalizedAdTargeting=true/iu,
  /investmentIntentTracking=true/iu,
  /watchlistAdTargeting=true/iu,
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
      a3PmHandoffPacketP1: "ready",
      phase2cPrivacySafeAnalyticsReadinessP1: "prepared",
      adCodeImplemented: false,
      antiAdBlockImplemented: false,
      analyticsCodeImplemented: false,
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
