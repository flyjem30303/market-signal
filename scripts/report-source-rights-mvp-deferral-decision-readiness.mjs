import { spawnSync } from "node:child_process";

const checks = [
  {
    id: "source-rights-public-placement-readiness",
    command: "scripts/check-source-rights-public-placement-readiness.mjs",
    evidence:
      "Page-level attribution, delay/incompleteness/outage wording, redistribution/storage limits, and non-advisory placement are mapped."
  },
  {
    id: "source-rights-public-copy-acceptance-readiness",
    command: "scripts/check-source-rights-public-copy-acceptance-readiness.mjs",
    evidence:
      "Public source, redistribution, investment-claim, and runtime-boundary copy can be accepted as mock-only MVP copy."
  },
  {
    id: "source-rights-specific-classification-readiness",
    command: "scripts/check-source-rights-specific-classification-readiness.mjs",
    evidence:
      "TWII, ETF, provider terms, data coverage, public placement, and investment-claim source-rights blockers are classified."
  },
  {
    id: "mvp-launch-prd",
    command: "scripts/check-mvp-launch-prd.mjs",
    evidence:
      "MVP launch baseline supports mock-only launch review without approving real source promotion."
  },
  {
    id: "stock-investor-action-summary",
    command: "scripts/check-stock-investor-action-summary.mjs",
    evidence:
      "Stock investor action summary keeps user-facing interpretation copy non-advisory and aligned to source and score boundaries."
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
  mode: "source_rights_mvp_deferral_decision_readiness",
  status: allOk
    ? "mock_mvp_launch_deferral_ready_source_promotion_blocked"
    : "blocked_mvp_deferral_decision_incomplete",
  owner: "CEO",
  coOwners: ["Legal", "Product", "Data", "Investment", "PM"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 4 : 0,
  upgradedReadinessPercent: allOk ? 96 : 92,
  targetForMvpReview: 100,
  decisionMeaning:
    "MVP launch review may proceed with mock-only public source wording while external source rights, redistribution, and real data promotion remain deferred to separate gates.",
  evidence,
  deferralDecisionMap: [
    {
      id: "mvp-launch-copy",
      decision: "accepted_for_mock_mvp_review",
      allowedState: "Public copy may describe mock-only data, limitations, delays, and review state.",
      blockedState: "It must not claim official provider approval, complete real-time data, or production source activation."
    },
    {
      id: "source-promotion",
      decision: "deferred_to_separate_gate",
      allowedState: "Source-specific packets and public placement maps can be reviewed locally.",
      blockedState: "publicDataSource=supabase remains blocked until external terms, QA, and promotion gates pass."
    },
    {
      id: "redistribution-retention",
      decision: "deferred_to_legal_terms_gate",
      allowedState: "Terms/privacy/disclaimer can state export, cache, retention, bulk access, and redistribution are unavailable.",
      blockedState: "Raw values, derived values, download/export, cache, retention, or commercial reuse are not approved."
    },
    {
      id: "investment-public-claims",
      decision: "accepted_only_as_non_advisory_mock_copy",
      allowedState: "Signal copy may stay educational, non-advisory, and tied to mock score boundaries.",
      blockedState: "scoreSource=real, buy/sell/hold, ranking, model confidence, performance, or professional indicator claims remain blocked."
    }
  ],
  mvpAllowed: [
    "mock-only MVP public review",
    "source-rights disclosure as blocked/deferred public copy",
    "non-advisory signal interpretation with mock score",
    "runtime copy that keeps publicDataSource and scoreSource mock",
    "post-MVP source promotion backlog with explicit gates"
  ],
  stillNotApproved: [
    "external provider terms approval",
    "source license approval",
    "raw market data redistribution",
    "download, export, cache, retention, or bulk access",
    "public source promotion",
    "publicDataSource=supabase",
    "SQL execution",
    "Supabase writes",
    "market data ingestion",
    "scoreSource=real",
    "public professional indicator claims",
    "investment advice or performance claims"
  ],
  nextGapsTo100: [
    "Human Legal acceptance of provider-specific terms",
    "Product acceptance of final page-level source copy",
    "Data acceptance of source-specific row coverage route after legal terms are settled",
    "Investment acceptance of final non-advisory public claims",
    "Separate promotion gate for any real source or real score state"
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
    "This MVP deferral decision readiness report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, approve external provider terms, approve redistribution, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
