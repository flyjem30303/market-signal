const checklist = {
  mode: "local_data_quality_evidence_checklist",
  status: "local_checklist_ready_remote_evidence_missing",
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
  owner: "Data",
  blockerId: "data-quality-evidence",
  decisionUse: "Define the evidence needed before any real-source runtime promotion or data-quality score increase.",
  approvalBoundary: [
    "This checklist is local-only and does not read remote rows.",
    "It does not grant row coverage points by itself.",
    "It must not approve ingestion, Supabase writes, public source promotion, or scoreSource=real.",
    "Remote count evidence must be captured only through an explicitly approved bounded readonly attempt."
  ],
  requiredSections: [
    {
      id: "row-coverage-evidence",
      owner: "Data",
      status: "waiting_explicit_remote_approval",
      acceptanceCriteria: [
        "bounded readonly run is explicitly requested",
        "runner emits count-only evidence",
        "output contains no raw rows",
        "coverage result is reviewed after execution",
        "coverage result does not directly promote scoreSource"
      ]
    },
    {
      id: "field-validity-rules",
      owner: "Data",
      status: "pending_local_review",
      acceptanceCriteria: [
        "required market fields are named",
        "numeric fields define null and zero handling",
        "date fields define trading-day and stale-data handling",
        "symbol and market identifiers define normalization rules",
        "invalid field behavior maps to downgrade or exclusion"
      ]
    },
    {
      id: "quality-score-threshold",
      owner: "QA",
      status: "pending_local_review",
      acceptanceCriteria: [
        "minimum score threshold remains at least 80 before promotion",
        "manual override is not accepted as evidence",
        "sample-size weakness reduces confidence",
        "missing-source weakness reduces confidence",
        "failed evidence keeps runtime in mock or internal-only state"
      ]
    },
    {
      id: "downgrade-behavior",
      owner: "QA",
      status: "pending_local_review",
      acceptanceCriteria: [
        "partial data maps to degraded state",
        "stale data maps to stale or unavailable state",
        "provider outage maps to safe fallback",
        "schema mismatch blocks promotion",
        "downgrade state is visible to users before any public claim"
      ]
    }
  ],
  readyToUnblockWhen: [
    "row coverage evidence is accepted after approved readonly execution",
    "field validity rules are reviewed",
    "quality threshold is met without override",
    "QA accepts downgrade behavior",
    "runtime source and score source remain truthful"
  ],
  ceoRecommendation: "Keep Data as the highest-weight blocker lane. Finish field validity and downgrade rules locally while remote row coverage stays paused."
};

console.log(JSON.stringify(checklist, null, 2));
