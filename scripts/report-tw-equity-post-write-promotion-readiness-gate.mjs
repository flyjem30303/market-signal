const report = {
  acceptedEvidence: {
    postWriteVerificationStatus: "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
    stagingPriceRows: 180,
    stagingRunRows: 1,
    stagingWriteStatus: "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion",
    verificationEvidenceType: "sanitized_aggregate_counts_only"
  },
  allowedNextWork: [
    "staging_to_daily_prices_merge_design_packet",
    "idempotency_and_duplicate_policy",
    "production_readback_verification_design",
    "row_coverage_calculation_gate",
    "runtime_mock_label_readability"
  ],
  blockedPromotions: [
    "daily_prices_merge",
    "row_coverage_points",
    "publicDataSource=supabase",
    "scoreSource=real",
    "public_real_data_claim"
  ],
  decision: "staging_verified_promotion_blocked_prepare_merge_design",
  mode: "tw_equity_post_write_promotion_readiness_gate",
  readinessMatrix: {
    dailyPricesMerge: "blocked",
    publicDataSource: "blocked",
    rowCoveragePoints: "blocked",
    runtimeUiCopy: "allowed_to_prepare",
    scoreSourceReal: "blocked",
    stagingEvidence: "accepted"
  },
  safety: {
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    publicDataSource: "mock",
    publicPromotionAllowed: false,
    rawPayloadsPrinted: false,
    rowCoveragePointsAwarded: false,
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealAllowed: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false
  },
  status: "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked"
};

console.log(JSON.stringify(report, null, 2));
