const checklist = {
  mode: "local_source_rights_disclosure_checklist",
  status: "local_checklist_ready_external_rights_unverified",
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    externalRightsVerified: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  owner: "Legal",
  blockerId: "source-rights-and-disclosure",
  decisionUse: "Prepare the minimum local evidence packet before any public promotion, real source claim, or real scoring discussion.",
  approvalBoundary: [
    "This checklist is a local readiness artifact only.",
    "It does not verify source licenses, provider terms, redistribution rights, or attribution sufficiency.",
    "It must not approve Supabase writes, ingestion, public data-source promotion, or scoreSource=real.",
    "Any source-specific legal conclusion still requires explicit human approval after reviewing the source terms."
  ],
  requiredSections: [
    {
      id: "source-attribution",
      owner: "Legal",
      status: "pending_human_review",
      acceptanceCriteria: [
        "source name is documented for every public-facing market figure",
        "provider role is described without overstating official endorsement",
        "page-level attribution placement is defined",
        "API or data file attribution placement is defined when applicable",
        "missing-attribution fallback copy is defined"
      ]
    },
    {
      id: "redistribution-display-limits",
      owner: "Legal",
      status: "pending_human_review",
      acceptanceCriteria: [
        "redistribution permission is classified before raw values are displayed publicly",
        "derived metric display permission is classified separately from raw data display",
        "download, export, and bulk access behavior is explicitly blocked or approved",
        "cache and retention limits are documented",
        "unsupported provider terms force mock or internal-only runtime state"
      ]
    },
    {
      id: "delay-incompleteness-disclosure",
      owner: "Product",
      status: "pending_human_review",
      acceptanceCriteria: [
        "market data delay wording is approved",
        "missing field wording is approved",
        "partial coverage wording is approved",
        "source outage wording is approved",
        "user-visible freshness state remains aligned with runtime state"
      ]
    },
    {
      id: "non-advisory-public-claim",
      owner: "Investment",
      status: "pending_human_review",
      acceptanceCriteria: [
        "signals are framed as informational and non-advisory",
        "ranking, health, and pullback-risk wording avoids buy or sell instruction",
        "score limitations are visible near score interpretation",
        "model confidence wording is separated from source reliability wording",
        "public claim wording remains blocked until Legal and Investment both approve"
      ]
    }
  ],
  readyToUnblockWhen: [
    "all required sections are reviewed by their owner",
    "source-specific rights are approved by Legal",
    "public disclosure copy is accepted by Product",
    "non-advisory claim wording is accepted by Investment",
    "runtime source state remains truthful and downgrade-safe"
  ],
  ceoRecommendation: "Treat Legal as the next blocker-reduction lane while Data keeps readonly readiness warm. This is a local preparation gate, not a source-rights approval."
};

console.log(JSON.stringify(checklist, null, 2));
