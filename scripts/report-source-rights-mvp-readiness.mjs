import { spawnSync } from "node:child_process";

const evidenceChecks = [
  {
    id: "source-rights-disclosure-checklist",
    owner: "Legal",
    command: "scripts/check-source-rights-disclosure-checklist.mjs",
    proves: "local source attribution, redistribution, delay, and non-advisory disclosure checklist exists"
  },
  {
    id: "source-rights-disclosure-local-review",
    owner: "Legal",
    command: "scripts/check-source-rights-disclosure-local-review.mjs",
    proves: "local source-rights review is recorded while external rights remain unverified"
  },
  {
    id: "source-rights-disclosure-acceptance-gate",
    owner: "CEO",
    command: "scripts/check-source-rights-disclosure-acceptance-gate.mjs",
    proves: "local review packet is accepted only as planning material, not legal clearance"
  },
  {
    id: "provider-specific-terms-review-packet",
    owner: "Legal",
    command: "scripts/check-provider-specific-terms-review-packet.mjs",
    proves: "provider-specific terms classification packet is available for review"
  },
  {
    id: "provider-specific-terms-post-review-rollup",
    owner: "Legal",
    command: "scripts/check-provider-specific-terms-post-review-rollup.mjs",
    proves: "CEO oral review rollup is aligned to local planning only and does not approve rights"
  },
  {
    id: "narrow-approval-outcome-ledger",
    owner: "PM",
    command: "scripts/check-narrow-approval-outcome-ledger.mjs",
    proves: "accepted and rejected decision outcomes can be recorded without changing runtime state"
  }
];

const evidence = evidenceChecks.map((item) => {
  const run = spawnSync(process.execPath, [item.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    id: item.id,
    owner: item.owner,
    ok: run.status === 0,
    proves: item.proves
  };
});

const allOk = evidence.every((item) => item.ok);

const report = {
  mode: "source_rights_mvp_readiness",
  status: allOk
    ? "local_source_rights_review_ready_external_rights_unapproved"
    : "local_source_rights_review_incomplete",
  owner: "Legal",
  recommendedBy: "CEO",
  readinessPercent: allOk ? 68 : 50,
  targetForMvpReview: 100,
  mvpMeaning:
    "Source-rights work is locally organized for MVP review, but external provider terms, redistribution rights, public source claims, and runtime promotion are not approved.",
  evidence,
  locallyAccepted: [
    "source-rights disclosure checklist is present",
    "local source-rights review is recorded",
    "source-rights acceptance gate is local-review-only",
    "provider-specific terms packet is ready for human classification",
    "provider-specific terms rollup is aligned to CEO oral review",
    "approval outcome ledger can record accepted or rejected results without runtime promotion"
  ],
  notApproved: [
    "External provider terms are not approved",
    "source license approval",
    "raw market data redistribution",
    "download, export, or bulk access",
    "public source promotion",
    "publicDataSource=supabase",
    "Supabase readonly execution",
    "SQL execution",
    "market data ingestion",
    "staging row writes",
    "daily_prices writes",
    "scoreSource=real",
    "investment advice or buy/sell claims"
  ],
  remainingTo100: [
    {
      id: "provider-specific-human-terms-classification",
      owner: "Legal",
      blocker: "Human review must classify each selected source provider's terms and attribution requirements."
    },
    {
      id: "public-attribution-placement",
      owner: "Product",
      blocker: "Page-level attribution, delay, incompleteness, outage, and fallback wording still need public-copy acceptance."
    },
    {
      id: "redistribution-storage-policy",
      owner: "Legal",
      blocker: "Raw values, derived values, retention, cache, export, and bulk access posture still need explicit approval."
    },
    {
      id: "source-specific-packet-per-instrument",
      owner: "Data",
      blocker: "TWII, ETF, and equity sources still need source-specific packet linkage before real-data promotion."
    },
    {
      id: "public-claim-acceptance",
      owner: "Investment",
      blocker: "Investment and legal teams must approve non-advisory wording before any professional indicator claim."
    }
  ],
  ceoRecommendation:
    "Treat source-rights as locally review-ready but not externally approved. The next high-value move is to connect source-specific packets to the data coverage route while keeping runtime mock-only.",
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
    "This source-rights MVP readiness report does not connect to Supabase, does not run SQL, write data, fetch market data, print secrets, approve provider terms, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
