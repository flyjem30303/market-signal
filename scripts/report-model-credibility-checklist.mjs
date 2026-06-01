const checklist = {
  mode: "local_model_credibility_checklist",
  status: "local_checklist_ready_model_not_approved_for_real_scoring",
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  owner: "Investment",
  blockerId: "model-credibility",
  decisionUse: "Define model-readiness evidence before any scoreSource=real or public investment interpretation.",
  approvalBoundary: [
    "This checklist does not approve real scoring.",
    "It does not approve any buy, sell, hold, ranking, or suitability claim.",
    "It does not rely on remote data or raw market rows.",
    "It must remain separate from source-rights and data-quality approvals."
  ],
  requiredSections: [
    {
      id: "score-purpose",
      owner: "Investment",
      status: "pending_human_review",
      acceptanceCriteria: [
        "health score purpose is defined",
        "pullback-risk purpose is defined",
        "user interpretation limit is defined",
        "non-advisory framing is defined",
        "public copy avoids trade instruction"
      ]
    },
    {
      id: "formula-documentation",
      owner: "Investment",
      status: "pending_human_review",
      acceptanceCriteria: [
        "input fields are listed",
        "weighting approach is documented",
        "normalization approach is documented",
        "missing input behavior is documented",
        "version naming is documented"
      ]
    },
    {
      id: "backtest-limitations",
      owner: "Investment",
      status: "pending_human_review",
      acceptanceCriteria: [
        "sample period is named before claims",
        "survivorship bias risk is acknowledged",
        "market-regime limitation is acknowledged",
        "small-sample limitation is acknowledged",
        "past performance warning is present before public use"
      ]
    },
    {
      id: "interpretation-downgrade-policy",
      owner: "QA",
      status: "pending_human_review",
      acceptanceCriteria: [
        "low data quality blocks confident interpretation",
        "missing freshness blocks confident interpretation",
        "source uncertainty blocks public confidence wording",
        "formula version mismatch blocks public scoring",
        "downgrade reason is visible in runtime state"
      ]
    }
  ],
  readyToUnblockWhen: [
    "score purpose is approved",
    "formula documentation is complete",
    "backtest limitations are accepted",
    "downgrade policy is accepted",
    "Legal and Data gates are not contradicted"
  ],
  ceoRecommendation: "Advance Investment locally in parallel, but keep model output unapproved for real scoring until Data and Legal gates are also satisfied."
};

console.log(JSON.stringify(checklist, null, 2));
