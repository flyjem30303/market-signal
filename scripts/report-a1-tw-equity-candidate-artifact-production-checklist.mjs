const candidatePath = process.env.A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH ?? "data/candidates/tw-equity-staging-candidate.json";

const report = {
  status: "a1_tw_equity_candidate_artifact_production_checklist_ready_no_candidate_data",
  owner: "A1 Data / Supabase / Market Evidence",
  integrationOwner: "PM",
  candidateArtifactPath: candidatePath,
  purpose:
    "Make A1 artifact production executable as a checklist without creating candidate data or running remote/data operations in this slice.",
  requiredDeliverySequence: [
    {
      order: 1,
      id: "source_and_rights_evidence_attached",
      required: true,
      description:
        "A1 records the approved source, attribution, retention, redistribution posture, and delay/incompleteness notes for 2330, 2382, and 2308."
    },
    {
      order: 2,
      id: "sanitized_artifact_created_outside_this_slice",
      required: true,
      description:
        "A1 creates one sanitized JSON artifact matching the delivery spec, without source payloads, row-level source output, secrets, or public redistribution claims."
    },
    {
      order: 3,
      id: "a1_self_check_passed",
      required: true,
      command: "node scripts/check-a1-tw-equity-candidate-artifact-self-check.mjs",
      description: "A1 proves the artifact is ready for PM intake review only."
    },
    {
      order: 4,
      id: "pm_intake_review_passed",
      required: true,
      command: "node scripts/check-pm-tw-equity-candidate-intake-review.mjs",
      description: "PM proves the artifact is ready for CEO bounded staging write decision only."
    }
  ],
  requiredArtifactContract: {
    deliverySpec: "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_DELIVERY_SPEC.md",
    selfCheck: "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_SELF_CHECK.md",
    pmReview: "docs/PM_TW_EQUITY_CANDIDATE_INTAKE_REVIEW.md",
    authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
    targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
    sourceId: "twse-stock-day",
    symbols: ["2330", "2382", "2308"],
    maxRows: 180,
    sourcePayloadIncluded: false,
    sourceUrlPayloadIncluded: false,
    secretsIncluded: false
  },
  forbiddenDeliveryContent: [
    "rawSourcePayload",
    "sourcePayload",
    "sourceRows",
    "rawRows",
    "sourceUrlPayload",
    "html",
    "csv",
    "secret",
    "secrets",
    "service-role key material",
    "row-level source output",
    "public redistribution claims"
  ],
  nextAction:
    "A1 should produce the sanitized candidate artifact in its data lane, run self-check, then notify PM to run the PM intake review gate.",
  notDoneInThisSlice: [
    "candidate artifact creation",
    "market data retrieval",
    "market data ingestion",
    "Supabase connection",
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
    sqlExecuted: false,
    realSupabaseConnectionAttempted: false,
    realSupabaseWrites: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));
