import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "source-rights-mvp-deferral-decision-readiness",
    command: "scripts/check-source-rights-mvp-deferral-decision-readiness.mjs",
    evidence:
      "Mock MVP launch deferral decision is ready while external source rights and real source promotion remain blocked."
  },
  {
    id: "source-rights-public-copy-acceptance-readiness",
    command: "scripts/check-source-rights-public-copy-acceptance-readiness.mjs",
    evidence:
      "Public copy acceptance map covers attribution, redistribution, runtime boundary, and non-advisory claim wording."
  },
  {
    id: "source-rights-specific-classification-readiness",
    command: "scripts/check-source-rights-specific-classification-readiness.mjs",
    evidence:
      "TWII, ETF, provider terms, data coverage, public placement, and investment-claim source-rights blockers are locally classified."
  },
  {
    id: "provider-specific-terms-post-review-rollup",
    command: "scripts/check-provider-specific-terms-post-review-rollup.mjs",
    evidence:
      "Provider-specific terms rollup is aligned to CEO oral review as local planning only and does not approve external rights."
  },
  {
    id: "mvp-launch-prd",
    command: "scripts/check-mvp-launch-prd.mjs",
    evidence:
      "MVP launch PRD supports mock-only review while keeping real source promotion and production data claims out of MVP scope."
  },
  {
    id: "source-rights-public-placement-readiness",
    command: "scripts/check-source-rights-public-placement-readiness.mjs",
    evidence:
      "Public placement map keeps attribution, outage, redistribution, source limits, and non-advisory claim boundaries visible."
  }
];

const evidence = checks.map((check) => {
  const run = spawnSync(process.execPath, [check.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    id: check.id,
    ok: run.status === 0,
    evidence: check.evidence
  };
});

const allOk = evidence.every((item) => item.ok);

const report = {
  mode: "source_rights_mvp_final_closure_readiness",
  status: allOk
    ? "mock_mvp_source_rights_closure_ready_external_rights_unapproved"
    : "blocked_source_rights_final_closure_incomplete",
  owner: "Legal",
  coOwners: ["CEO", "PM", "Product", "Data", "Investment"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 4 : 0,
  upgradedReadinessPercent: allOk ? 100 : 96,
  targetForMvpReview: 100,
  closureMeaning:
    "Source-rights can be closed for mock MVP review because public copy, deferral, classification, provider-terms rollup, data-promotion dependency, and investment-claim boundaries are locally accepted; this does not approve external rights or real source promotion.",
  evidence,
  closureDecisionMap: [
    {
      id: "mock-mvp-source-copy",
      decision: "closed_for_mock_mvp_review",
      acceptedState: "Public MVP copy may disclose mock-only source state, limitations, delay/outage posture, and no redistribution.",
      blockedState: "It may not claim official provider approval, production source activation, or complete real-time market coverage."
    },
    {
      id: "external-provider-terms",
      decision: "not_approved_deferred_to_external_review",
      acceptedState: "Provider-specific questions are organized for later human review.",
      blockedState: "External rights, source license, raw value redistribution, and public source promotion remain unapproved."
    },
    {
      id: "source-promotion-dependency",
      decision: "blocked_until_separate_promotion_gate",
      acceptedState: "Data coverage and source promotion dependencies are visible in the readiness model.",
      blockedState: "publicDataSource=supabase, Supabase execution, SQL, ingestion, and daily_prices writes remain blocked."
    },
    {
      id: "public-investment-claims",
      decision: "closed_for_non_advisory_mock_claims",
      acceptedState: "Public signal copy may remain educational and non-advisory under mock score boundaries.",
      blockedState: "scoreSource=real, professional indicator claims, buy/sell/hold language, model confidence, and performance claims remain blocked."
    }
  ],
  mvpAllowed: [
    "mock-only MVP source-rights review closure",
    "public disclosure that real source promotion is deferred",
    "non-advisory public investment claim wording under mock score",
    "source-specific promotion backlog that requires separate legal and execution gates",
    "runtime copy that keeps publicDataSource and scoreSource mock"
  ],
  stillNotApproved: [
    "external provider terms approval",
    "source license approval",
    "raw market data redistribution",
    "download, export, cache, retention, or bulk access",
    "public source promotion",
    "publicDataSource=supabase",
    "Supabase readonly execution",
    "SQL execution",
    "market data ingestion",
    "staging row writes",
    "daily_prices writes",
    "scoreSource=real",
    "professional indicator claims",
    "investment advice or performance claims"
  ],
  nextAfterMvpReview: [
    "Legal performs external provider terms review outside this local closure",
    "Product accepts final public source copy only after Legal terms are settled",
    "Data runs a separately approved source promotion or coverage execution gate",
    "Investment reviews any future real-score public claims after scoreSource promotion"
  ],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    externalRightsVerified: false,
    externalTermsApproved: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  stopLine:
    "This source-rights MVP final closure readiness report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, approve external provider terms, approve redistribution, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
