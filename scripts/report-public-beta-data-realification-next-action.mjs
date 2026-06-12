import fs from "node:fs";

const inputs = {
  a1Coverage: "docs/A1_DATA_COVERAGE_NEXT_BATCH_HANDOFF.md",
  a1RightsPriority: "docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md",
  a1DecisionRecord: "docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md",
  a1EvidenceFallback: "docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md",
  a1OfficialIntake: "docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md",
  twseMetadataTerms: "docs/TWSE_OPENAPI_BOUNDED_METADATA_TERMS_VALIDATION.md",
  twseAdapterContract: "src/lib/twse-openapi-source-adapter-contract.ts",
  a2TrustCopy: "docs/A2_PUBLIC_BETA_BATCH1_TWII_CORE_ETF_TRUST_COPY.md",
  pmSelector: "docs/DATA_REALIFICATION_POST_FIRST_CLOSED_LOOP_NEXT_LANE_SELECTOR.md",
  publicBrief: "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md"
};

const missingEvidence = [];
const requiredEvidence = {
  fullLevel1ExpectedRows: 360,
  fullLevel1ObservedRows: 182,
  fullLevel1MissingRows: 178,
  twEquityObservedRows: 180,
  twEquityExpectedRows: 180,
  twiiMissingRows: 60,
  etfMissingRows: 118
};

const requiredPhrases = [
  [inputs.pmSelector, "twii_first_if_rights_change_otherwise_beta_runtime_mainline"],
  [inputs.a1Coverage, "TWII index daily coverage"],
  [inputs.a1Coverage, "ETF daily coverage for `0050`"],
  [inputs.a1Coverage, "ETF daily coverage for `006208`"],
  [inputs.a1RightsPriority, "A1 next assignment: `twii_source_rights_unblock_decision_record_candidate`"],
  [inputs.a1DecisionRecord, "The next route is `twii_source_rights_evidence_intake_or_vendor_fallback_decision_support`"],
  [inputs.a1EvidenceFallback, "The next route is `twii_official_source_intake_fields_or_vendor_terms_review_packet`"],
  [inputs.a1OfficialIntake, "filled_official_001_012_for_official_open_data_api_candidate_no_execution"],
  [inputs.a1OfficialIntake, "a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_filled_official_001_012_no_execution"],
  [inputs.twseMetadataTerms, "twse_openapi_bounded_metadata_terms_validation_ready_no_market_rows"],
  [inputs.twseAdapterContract, "twse_openapi_source_adapter_contract_scaffold_no_data_fetch"],
  [inputs.a2TrustCopy, "Batch 1 starts with TWII and core ETF"],
  [inputs.publicBrief, "understand the market mood within 30 seconds"]
];

for (const [path, phrase] of requiredPhrases) {
  const text = read(path);
  if (!text.includes(phrase)) missingEvidence.push(`${path}: ${phrase}`);
}

const ready = missingEvidence.length === 0;

const output = {
  status: ready
    ? "public_beta_data_realification_next_action_ready"
    : "public_beta_data_realification_next_action_blocked_missing_local_evidence",
  mode: "local_only_next_action_selector",
  decision: {
    ceoRecommendation: "twse_openapi_parser_contract_next_public_runtime_mock_parallel",
    pmMainline: "prepare_twse_openapi_parser_contract_with_synthetic_fixtures_only",
    a1Next: "twse_openapi_synthetic_fixture_parser_contract_no_market_rows",
    a2Next: "open_data_attribution_delay_no_advice_public_copy_guardrail",
    fallbackIfRightsStayBlocked: "continue_public_beta_runtime_readability_and_production_readonly_guards"
  },
  coverage: requiredEvidence,
  sourceBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock",
    realDataDisplayActive: false,
    realScoreActive: false
  },
  hardStops: {
    sqlExecuted: false,
    supabaseConnected: false,
    supabaseWriteAttempted: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    rawMarketDataFetched: false,
    rawMarketDataStored: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicDataSourceSupabasePromoted: false,
    scoreSourceRealPromoted: false,
    investmentAdviceClaimed: false
  },
  missingEvidence,
  nextHumanReadableSummary:
    "TWSE OpenAPI metadata / terms validation and the no-fetch source adapter contract are ready. Move next to a parser contract using synthetic fixtures only while public runtime remains mock. No market-row fetch, data execution, Supabase write, or promotion is authorized by this report."
};

console.log(JSON.stringify(output, null, 2));
if (!ready) process.exitCode = 1;

function read(path) {
  if (!fs.existsSync(path)) {
    missingEvidence.push(`${path}: missing file`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
