import fs from "node:fs";

const policyPath = "docs/PHASE_2C_MONETIZATION_READINESS_POLICY.md";
const problems = [];
const content = read(policyPath);

for (const phrase of [
  "Slice: `phase_2c_monetization_readiness_policy`",
  "Status: prepared; no ad code implemented",
  "Do not implement advertising placement yet.",
  "Do not implement anti-AdBlock behavior.",
  "adCodeImplemented=false",
  "adsenseApplicationStarted=false",
  "adNetworkIntegrated=false",
  "antiAdBlockImplemented=false",
  "adBlockDetectionImplemented=false",
  "contentBlockingForAdBlock=false",
  "personalizedAdsAllowed=false",
  "investmentAdviceAdsAllowed=false",
  "supabaseChange=false",
  "sqlChange=false",
  "marketDataFetchChange=false",
  "stockIndexingChange=false",
  "Allowed Work Now",
  "Not allowed in this phase",
  "Banned:",
  "Guaranteed returns",
  "High-leverage trading products",
  "antiAdBlockPolicy=no-blocking",
  "Do not detect ad blockers.",
  "Do not block content for ad blocker users.",
  "Direct Sponsor Path",
  "Analytics Boundary",
  "phase_2c_sponsor_disclosure_and_placeholder_slot",
  "No third-party ad network script.",
  "No stock route placement.",
  "Requires PM integration: yes"
]) {
  if (!content.includes(phrase)) problems.push(`${policyPath} missing: ${phrase}`);
}

for (const pattern of [
  /adsbygoogle/iu,
  /googlesyndication/iu,
  /pagead2\.googlesyndication/iu,
  /antiAdBlockImplemented=true/iu,
  /adBlockDetectionImplemented=true/iu,
  /contentBlockingForAdBlock=true/iu,
  /adCodeImplemented=true/iu,
  /adsenseApplicationStarted=true/iu,
  /stockRoutesIndexingFullyOpen=true/iu,
  /Supabase writes approved/iu,
  /SQL execution approved/iu
]) {
  if (pattern.test(content)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  mode: "phase_2c_monetization_readiness_policy",
  policyPath,
  adCodeImplemented: false,
  adsenseApplicationStarted: false,
  adNetworkIntegrated: false,
  antiAdBlockImplemented: false,
  adBlockDetectionImplemented: false,
  contentBlockingForAdBlock: false,
  requiresPmIntegration: true,
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
