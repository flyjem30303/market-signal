import fs from "node:fs";

const handoffPath = "docs/PHASE_2B_SEO_HANDOFF_STATUS.md";
const problems = [];
const handoff = read(handoffPath);

for (const phrase of [
  "Owner: A3 Phase 2B SEO support lane",
  "Governance: CEO-led, PM-integrated, karpathy-guidelines",
  "Status: `phase_2b_seo_handoff_status_current`",
  "Slice: `phase_2b_runtime_canonical_og_public_html_patch`",
  "custom_domain_strategy_selected_execution_deferred",
  "parentBrandUrl=https://opensignallab.com/",
  "marketSignalProductUrl=https://market-signal.opensignallab.com/",
  "SEO Foundation P0",
  "Structured Data Baseline P1",
  "WebPage/Breadcrumb Structured Data Baseline P1",
  "GSC Readiness Checklist P1",
  "SEO Index Gate Report P1",
  "GSC Post-submit Observation Checklist P1",
  "Stock First-batch Candidate Rule P1",
  "Custom Domain Preflight Checklist P1",
  "GSC Result Intake Template P1",
  "SEO Warning Closeout Checklist P1",
  "SEO Rollup for PM Integration P1",
  "GSC Platform Execution Packet P1",
  "Domain Usage Decision Record P1",
  "Parent Brand / Product Path Decision P1",
  "Custom Domain Product Subdomain Execution Preflight P1",
  "Custom Domain Runtime Readiness Inventory P1",
  "Runtime Migration Patch Plan P1",
  "Runtime Migration Minimal Patch P1",
  "Runtime Migration URL Contract Checker P1",
  "Product Subdomain Strategy Decision P1",
  "Runtime Canonical OG Public HTML Patch P1",
  "docs/PHASE_2B_GSC_READINESS_CHECKLIST.md",
  "docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md",
  "docs/PHASE_2B_STOCK_FIRST_BATCH_CANDIDATE_RULE.md",
  "docs/PHASE_2B_CUSTOM_DOMAIN_PREFLIGHT_CHECKLIST.md",
  "docs/PHASE_2B_GSC_RESULT_INTAKE_TEMPLATE.md",
  "docs/PHASE_2B_SEO_WARNING_CLOSEOUT_CHECKLIST.md",
  "docs/PHASE_2B_SEO_ROLLUP_FOR_PM_INTEGRATION.md",
  "docs/PHASE_2B_GSC_PLATFORM_EXECUTION_PACKET.md",
  "docs/PHASE_2B_DOMAIN_USAGE_DECISION_RECORD.md",
  "docs/PHASE_2B_CUSTOM_DOMAIN_PRODUCT_SUBPATH_EXECUTION_PREFLIGHT.md",
  "docs/PHASE_2B_CUSTOM_DOMAIN_RUNTIME_READINESS_INVENTORY.md",
  "docs/PHASE_2B_RUNTIME_MIGRATION_PATCH_PLAN.md",
  "docs/PHASE_2B_RUNTIME_MIGRATION_MINIMAL_PATCH.md",
  "docs/PHASE_2B_RUNTIME_MIGRATION_URL_CONTRACT_CHECKER.md",
  "docs/PHASE_2B_PRODUCT_SUBDOMAIN_STRATEGY_DECISION.md",
  "docs/PHASE_2B_RUNTIME_CANONICAL_OG_PUBLIC_HTML_PATCH.md",
  "scripts/report-phase-2b-seo-index-gate.mjs",
  "scripts/check-phase-2b-gsc-platform-execution-packet.mjs",
  "scripts/check-phase-2b-domain-usage-decision-record.mjs",
  "scripts/check-phase-2b-custom-domain-product-subpath-execution-preflight.mjs",
  "scripts/check-phase-2b-custom-domain-runtime-readiness-inventory.mjs",
  "scripts/check-phase-2b-runtime-migration-patch-plan.mjs",
  "scripts/check-phase-2b-runtime-migration-minimal-patch.mjs",
  "scripts/check-phase-2b-runtime-migration-url-contract.mjs",
  "scripts/check-phase-2b-product-subdomain-strategy-decision.mjs",
  "scripts/check-phase-2b-runtime-canonical-og-public-html-patch.mjs",
  "scripts/check-phase-2b-gsc-post-submit-observation-checklist.mjs",
  "scripts/check-phase-2b-stock-first-batch-candidate-rule.mjs",
  "scripts/check-phase-2b-custom-domain-preflight-checklist.mjs",
  "scripts/check-phase-2b-gsc-result-intake-template.mjs",
  "scripts/check-phase-2b-seo-warning-closeout-checklist.mjs",
  "scripts/check-phase-2b-seo-rollup-for-pm-integration.mjs",
  "Eligible stock routes under local mock gate",
  "`0`",
  "stock universe: 1086",
  "NEXT_PUBLIC_SITE_URL",
  "opensignallab.com",
  "https://market-signal.opensignallab.com/",
  "Custom domain product subdomain execution preflight",
  "Custom domain runtime readiness inventory",
  "direct `/market-signal/` migration is not runtime-ready yet",
  "Runtime migration patch plan",
  "Runtime migration minimal patch",
  "supports `NEXT_PUBLIC_SITE_BASE_PATH` but does not switch platform",
  "Runtime migration URL contract checker",
  "validates Vercel root mode and product-subdomain root mode",
  "Product subdomain strategy decision",
  "`/market-signal/` product-subpath strategy is superseded",
  "Runtime canonical / OG public HTML patch",
  "waiting for redeploy observation",
  "https://opensignallab.com/briefing",
  "NEXT_PUBLIC_SITE_URL=https://market-signal.opensignallab.com",
  "NEXT_PUBLIC_SITE_BASE_PATH",
  "noGscOperation=true",
  "runtimePatchImplemented=true",
  "noPlatformMigration=true",
  "noCanonicalHostMigration=true",
  "noProductSubpathMigration=true",
  "noSql=true",
  "noSupabaseWrite=true",
  "noMarketDataFetch=true",
  "phase_2b_runtime_canonical_og_public_html_observation"
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
      seoWarningCloseoutChecklistP1: "completed",
      seoRollupForPmIntegrationP1: "completed",
      gscPlatformExecutionPacketP1: "prepared",
      domainUsageDecisionRecordP1: "completed",
      customDomainProductSubpathExecutionPreflightP1: "prepared",
      customDomainRuntimeReadinessInventoryP1: "completed",
      runtimeMigrationPatchPlanP1: "planned",
      runtimeMigrationMinimalPatchP1: "implemented",
      runtimeMigrationUrlContractCheckerP1: "implemented",
      productSubdomainStrategyDecisionP1: "completed",
      runtimeCanonicalOgPublicHtmlPatchP1: "implemented",
      runtimeMetadataImpact: true,
      publicUiLayoutImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      selectedDomain: "opensignallab.com",
      parentBrandUrl: "https://opensignallab.com/",
      marketSignalProductUrl: "https://market-signal.opensignallab.com/",
      customDomainExecutionDeferred: true,
      nextRecommendedSlice: "phase_2b_runtime_canonical_og_public_html_observation"
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

