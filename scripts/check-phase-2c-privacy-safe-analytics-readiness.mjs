import fs from "node:fs";

const docPath = "docs/PHASE_2C_PRIVACY_SAFE_ANALYTICS_READINESS.md";
const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Slice: `phase_2c_privacy_safe_analytics_readiness`",
  "Status: prepared; no analytics code implemented",
  "analyticsCodeImplemented=false",
  "ga4Installed=false",
  "clarityInstalled=false",
  "vercelAnalyticsInstalled=false",
  "thirdPartyTrackingScriptAdded=false",
  "personalizedAdTargeting=false",
  "investmentIntentTracking=false",
  "watchlistAdTargeting=false",
  "supabaseChange=false",
  "sqlChange=false",
  "marketDataFetchChange=false",
  "stockIndexingChange=false",
  "`page_view`",
  "`cta_click`",
  "`sponsor_slot_view`",
  "`sponsor_slot_click`",
  "`support_message_view`",
  "`support_message_dismiss`",
  "`seo_funnel_summary`",
  "Personalized ad targeting",
  "Investment intent tracking",
  "Watchlist ad targeting",
  "Anti-AdBlock detection or enforcement",
  "Google Analytics 4",
  "Microsoft Clarity",
  "Vercel Analytics",
  "not installed",
  "requires PM/CEO approval",
  "Requires PM integration: yes"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const pattern of [
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
  /Supabase writes approved/iu,
  /SQL execution approved/iu,
  /stockRoutesIndexingFullyOpen=true/iu
]) {
  if (pattern.test(doc)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2c_privacy_safe_analytics_readiness",
      docPath,
      analyticsCodeImplemented: false,
      ga4Installed: false,
      clarityInstalled: false,
      vercelAnalyticsInstalled: false,
      thirdPartyTrackingScriptAdded: false,
      personalizedAdTargeting: false,
      investmentIntentTracking: false,
      watchlistAdTargeting: false,
      supabaseChange: false,
      sqlChange: false,
      marketDataFetchChange: false,
      stockIndexingChange: false,
      requiresPmIntegration: true
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
