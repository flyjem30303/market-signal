import fs from "node:fs";

const packetPath = "docs/PHASE_2C_A3_PM_HANDOFF_PACKET.md";
const problems = [];
const content = read(packetPath);

for (const phrase of [
  "Slice: `phase_2c_a3_pm_handoff_packet`",
  "Status: ready for PM integration",
  "https://market-signal.opensignallab.com/",
  "sitemapStatus=success",
  "discoveredUrls=15",
  "pageIndexingStatus=processing",
  "A3PerformedGscOperation=false",
  "adCodeImplemented=false",
  "adsenseApplicationStarted=false",
  "adNetworkIntegrated=false",
  "antiAdBlockImplemented=false",
  "adBlockDetectionImplemented=false",
  "contentBlockingForAdBlock=false",
  "stockRouteAdsApproved=false",
  "docs/PHASE_2B_SEO_HANDOFF_STATUS.md",
  "docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md",
  "docs/PHASE_2B_PUBLIC_SEO_OBSERVATION_PROBE.md",
  "docs/PHASE_2C_MONETIZATION_READINESS_POLICY.md",
  "cmd /c npm run check:phase-2b-public-seo-observation-probe",
  "cmd /c npm run check:phase-2c-monetization-readiness-policy",
  "cmd /c npm run check:phase-2c-a3-pm-handoff-packet",
  "Do not add Google AdSense or ad network scripts.",
  "Do not add anti-AdBlock detection.",
  "Do not open all stock routes for indexing.",
  "Do not edit PM mainline integration files from the A3 lane.",
  "phase_2b_gsc_post_submit_observation_t2_t3",
  "phase_2b_gsc_post_submit_observation_t2_still_processing",
  "Requires PM integration: yes"
]) {
  if (!content.includes(phrase)) problems.push(`${packetPath} missing: ${phrase}`);
}

for (const pattern of [
  /adsbygoogle/iu,
  /googlesyndication/iu,
  /antiAdBlockImplemented=true/iu,
  /adBlockDetectionImplemented=true/iu,
  /contentBlockingForAdBlock=true/iu,
  /adCodeImplemented=true/iu,
  /A3PerformedGscOperation=true/iu,
  /stockRoutesIndexingFullyOpen=true/iu,
  /SQL execution approved/iu,
  /Supabase writes approved/iu
]) {
  if (pattern.test(content)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  mode: "phase_2c_a3_pm_handoff_packet",
  packetPath,
  readyForPmIntegration: true,
  discoveredUrls: 15,
  pageIndexingStatus: "processing",
  adCodeImplemented: false,
  antiAdBlockImplemented: false,
  gscOperationByA3: false,
  supabaseImpact: false,
  sqlImpact: false,
  marketDataFetchImpact: false,
  stockIndexingImpact: false
}, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
