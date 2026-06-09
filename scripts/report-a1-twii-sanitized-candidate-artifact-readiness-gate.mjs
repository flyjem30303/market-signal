const candidatePath =
  process.env.A1_TWII_SANITIZED_CANDIDATE_ARTIFACT_PATH ??
  "data/candidates/twii-sanitized-candidate.json";

const report = {
  status: "a1_twii_sanitized_candidate_artifact_readiness_gate_ready_no_candidate_data",
  ok: true,
  mode: "a1_twii_sanitized_candidate_artifact_readiness_gate",
  owner: "A1 Data / Supabase / Market Evidence",
  integrationOwner: "PM",
  doc: "docs/A1_TWII_SANITIZED_CANDIDATE_ARTIFACT_READINESS_GATE.md",
  candidateArtifactPath: candidatePath,
  purpose:
    "Define the future TWII sanitized candidate artifact contract without creating source-derived candidate data or running remote/data operations.",
  currentContext: {
    sourceRightsGateStatus: "twii_source_rights_outcome_gate_candidate_ready_for_pm_review",
    exactEvidenceAccepted: 4,
    bridgeEvidenceAccepted: 4,
    twiiObservedRows: 0,
    twiiExpectedRows: 60,
    twiiCandidateMissingRows: 60,
    level1MvpCoverage: "182/360",
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  requiredDeliverySequence: [
    {
      order: 1,
      id: "source_rights_candidate_review_passed",
      required: true,
      description: "PM/CEO accepts the TWII source-rights outcome gate candidate before any filled artifact is considered."
    },
    {
      order: 2,
      id: "field_contract_reference_attached",
      required: true,
      description:
        "PM attaches a TWII index field-contract reference for calendar, session, timezone, precision, missing-session behavior, and daily_prices mapping."
    },
    {
      order: 3,
      id: "artifact_contract_confirmed",
      required: true,
      description: "A1 confirms the future local JSON artifact matches the required TWII aggregate-only top-level fields."
    },
    {
      order: 4,
      id: "sanitized_aggregate_policy_confirmed",
      required: true,
      description: "A1 confirms aggregate-only output and all forbidden payload flags are false."
    },
    {
      order: 5,
      id: "post_run_review_template_ready",
      required: true,
      description: "PM has a post-run review template ready before any later attempt."
    },
    {
      order: 6,
      id: "readback_gate_ready",
      required: true,
      description: "PM has a bounded aggregate readback gate ready before any later write/readback attempt."
    }
  ],
  requiredArtifactContract: {
    lane: "TWII",
    assetType: "index",
    symbol: "TWII",
    scope: "twii_index_daily_prices_missing_rows",
    allowedSourceLanes: ["official-exchange-index", "licensed-market-data-vendor", "internal-approved-feed"],
    sourceRightsGateStatus: "twii_source_rights_outcome_gate_candidate_ready_for_pm_review",
    coverageWindowSessions: 60,
    alreadyObservedRows: 0,
    candidateMissingRows: 60,
    expectedRows: 60,
    reviewOutputPolicy: "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads",
    sanitizedAggregateOnly: true,
    rawPayloadIncluded: false,
    rowPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false
  },
  allowedFutureArtifactContent: [
    "aggregate expected row counts",
    "aggregate candidate row counts",
    "aggregate missing rejected duplicate counts",
    "field names without field values",
    "source lane labels without source bodies",
    "PM-approved authorization and gate ids",
    "validation status labels",
    "no-secret risk labels"
  ],
  forbiddenDeliveryContent: [
    "raw payload",
    "source response body",
    "source URL with tokens or query credentials",
    "row payload",
    "per-row source values",
    "stock id payload",
    "source-derived real candidate rows",
    "secrets",
    "service role keys",
    "SQL snippets for execution",
    "public redistribution claims",
    "committed market-data files"
  ],
  nextAction:
    "Prepare a future local-only TWII candidate artifact contract or self-check gate; do not generate a filled source-derived artifact from this readiness gate.",
  notDoneInThisSlice: [
    "filled TWII candidate artifact creation",
    "source-derived TWII candidate rows",
    "market data retrieval",
    "market data ingestion",
    "Supabase connection",
    "Supabase read",
    "SQL execution",
    "Supabase write",
    "staging row creation",
    "daily_prices mutation",
    "public source promotion",
    "row coverage point award",
    "scoreSource=real"
  ],
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    candidateArtifactCreated: false,
    sourceDerivedCandidateRowsCreated: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    marketDataStored: false,
    marketDataCommitted: false,
    rawPayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  },
  stopLines: [
    "This readiness gate does not create a filled TWII candidate artifact.",
    "This readiness gate does not generate source-derived TWII candidate rows.",
    "This readiness gate does not fetch, store, ingest, or commit raw market data.",
    "This readiness gate does not run SQL, connect to Supabase, read Supabase, or write Supabase.",
    "This readiness gate keeps publicDataSource=mock and scoreSource=mock."
  ]
};

console.log(JSON.stringify(report, null, 2));
