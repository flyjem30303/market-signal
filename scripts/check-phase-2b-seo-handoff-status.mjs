import fs from "node:fs";

const handoffPath = "docs/PHASE_2B_SEO_HANDOFF_STATUS.md";
const problems = [];
const handoff = read(handoffPath);

for (const phrase of [
  "Owner: A3 Phase 2B SEO support lane",
  "Governance: CEO-led, PM-integrated, karpathy-guidelines",
  "Status: `phase_2b_seo_handoff_status_current`",
  "Slice: `phase_2b_gsc_result_intake_template`",
  "SEO Foundation P0",
  "Structured Data Baseline P1",
  "WebPage/Breadcrumb Structured Data Baseline P1",
  "GSC Readiness Checklist P1",
  "SEO Index Gate Report P1",
  "GSC Post-submit Observation Checklist P1",
  "Stock First-batch Candidate Rule P1",
  "Custom Domain Preflight Checklist P1",
  "GSC Result Intake Template P1",
  "docs/PHASE_2B_GSC_READINESS_CHECKLIST.md",
  "docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md",
  "docs/PHASE_2B_STOCK_FIRST_BATCH_CANDIDATE_RULE.md",
  "docs/PHASE_2B_CUSTOM_DOMAIN_PREFLIGHT_CHECKLIST.md",
  "docs/PHASE_2B_GSC_RESULT_INTAKE_TEMPLATE.md",
  "scripts/report-phase-2b-seo-index-gate.mjs",
  "scripts/check-phase-2b-gsc-post-submit-observation-checklist.mjs",
  "scripts/check-phase-2b-stock-first-batch-candidate-rule.mjs",
  "scripts/check-phase-2b-custom-domain-preflight-checklist.mjs",
  "scripts/check-phase-2b-gsc-result-intake-template.mjs",
  "Eligible stock routes under local mock gate",
  "`0`",
  "stock universe: 1086",
  "NEXT_PUBLIC_SITE_URL",
  "noGscOperation=true",
  "noSql=true",
  "noSupabaseWrite=true",
  "noMarketDataFetch=true",
  "phase_2b_seo_warning_closeout_or_rollup_summary"
]) {
  if (!handoff.includes(phrase)) problems.push(`${handoffPath} missing: ${phrase}`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /Supabase writes approved/iu,
  /SQL execution approved/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu
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
      seoFoundationP0: "completed",
      structuredDataP1: "completed",
      seoIndexGateP1: "completed",
      gscReadinessP1: "completed",
      gscPostSubmitObservationP1: "completed",
      stockFirstBatchCandidateRuleP1: "completed",
      customDomainPreflightP1: "completed",
      gscResultIntakeTemplateP1: "completed",
      runtimeMetadataImpact: true,
      publicUiLayoutImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      nextRecommendedSlice: "phase_2b_seo_warning_closeout_or_rollup_summary"
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
