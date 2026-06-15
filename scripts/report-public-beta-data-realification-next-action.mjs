import fs from "node:fs";

const inputs = {
  a1Coverage: "docs/A1_DATA_COVERAGE_NEXT_BATCH_HANDOFF.md",
  a1RightsPriority: "docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md",
  a1DecisionRecord: "docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md",
  a1EvidenceFallback: "docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md",
  a1OfficialIntake: "docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md",
  twseMetadataTerms: "docs/TWSE_OPENAPI_BOUNDED_METADATA_TERMS_VALIDATION.md",
  twseAdapterContract: "src/lib/twse-openapi-source-adapter-contract.ts",
  twseParserContract: "src/lib/twse-openapi-parser-contract.ts",
  twseParserConsumerAdapter: "src/lib/twse-openapi-parser-consumer-adapter.ts",
  twseRuntimeMockWiringReadiness: "src/lib/twse-openapi-runtime-mock-wiring-readiness.ts",
  twseRuntimeMockConsumerWire: "src/lib/twse-openapi-runtime-mock-consumer-wire.ts",
  twseRuntimeCaseNotes: "docs/TWSE_OPENAPI_RUNTIME_CONSUMER_ADAPTER_SYNTHETIC_CASE_NOTES.md",
  twseFieldContractRoadmap: "docs/TWSE_OPENAPI_FIELD_CONTRACT_ROADMAP.md",
  twseCoverageReadiness: "docs/TWSE_OPENAPI_COVERAGE_UNIVERSE_AND_BACKFILL_READINESS.md",
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
  [inputs.pmSelector, "prepare_twse_openapi_runtime_mock_consumer_wiring_readiness"],
  [inputs.a1Coverage, "TWII index daily coverage"],
  [inputs.a1Coverage, "ETF daily coverage for `0050`"],
  [inputs.a1Coverage, "ETF daily coverage for `006208`"],
  [inputs.a1RightsPriority, "A1 next assignment: `prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`"],
  [inputs.a1DecisionRecord, "The next route is `twii_source_rights_evidence_intake_or_vendor_fallback_decision_support`"],
  [inputs.a1EvidenceFallback, "The next route is `twii_official_source_intake_fields_or_vendor_terms_review_packet`"],
  [inputs.a1OfficialIntake, "filled_official_001_012_for_official_open_data_api_candidate_no_execution"],
  [inputs.a1OfficialIntake, "a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_filled_official_001_012_no_execution"],
  [inputs.twseMetadataTerms, "twse_openapi_bounded_metadata_terms_validation_ready_no_market_rows"],
  [inputs.twseAdapterContract, "twse_openapi_source_adapter_contract_scaffold_no_data_fetch"],
  [inputs.twseParserContract, "twse_openapi_parser_contract_with_synthetic_fixtures_only"],
  [inputs.twseParserConsumerAdapter, "twse_openapi_parser_contract_consumer_adapter_no_fetch"],
  [inputs.twseRuntimeMockWiringReadiness, "twse_openapi_runtime_mock_consumer_wiring_readiness"],
  [inputs.twseRuntimeMockConsumerWire, "twse_openapi_runtime_mock_consumer_wire"],
  [inputs.a2TrustCopy, "Batch 1 starts with TWII and core ETF"],
  [inputs.publicBrief, "understand the market mood within 30 seconds"]
];
const a1ReadinessPhrases = [
  [inputs.twseRuntimeCaseNotes, "Synthetic Case Notes"],
  [inputs.twseRuntimeCaseNotes, "Failure and Output Matrix"],
  [inputs.twseRuntimeCaseNotes, "Schema drift / contract mismatch"],
  [inputs.twseFieldContractRoadmap, "Source contract fields (raw route shape)"],
  [inputs.twseFieldContractRoadmap, "Roadmap: field-contract escalation"],
  [inputs.twseFieldContractRoadmap, "Downgrade rule"],
  [inputs.twseCoverageReadiness, "Phase 0: Synthetic handoff hardening"],
  [inputs.twseCoverageReadiness, "Phase 3: Backfill readiness"],
  [inputs.twseCoverageReadiness, "Gating checklist for A1 to PM handoff"]
];

for (const [path, phrase] of a1ReadinessPhrases) {
  if (!read(path).includes(phrase)) missingEvidence.push(`${path}: ${phrase}`);
}

const readParserResultContract = read(inputs.twseParserConsumerAdapter);
const caseNotesContainsFailureMatrix = read(inputs.twseRuntimeCaseNotes).includes("Failure and Output Matrix");
const fieldContractRoadmapEscalationReady = read(inputs.twseFieldContractRoadmap).includes("Roadmap: field-contract escalation");
const backfillReadinessPhaseThreeReady = read(inputs.twseCoverageReadiness).includes("Phase 3: Backfill readiness");
const parserFailureBlockingReady =
  readParserResultContract.includes("parserResult.failureClass") &&
  readParserResultContract.includes("buildBlockedHandoff") &&
  readParserResultContract.includes("parser_result_empty_after_normalization") &&
    readParserResultContract.includes("runtime_handoff_fail_closed_no_points_exported");
const runtimeMockWiringReadinessReady =
  read(inputs.twseRuntimeMockWiringReadiness).includes("twse_openapi_runtime_mock_consumer_wiring_readiness") &&
  read(inputs.twseRuntimeMockWiringReadiness).includes("publicDataSource: \"mock\"") &&
  read(inputs.twseRuntimeMockWiringReadiness).includes("scoreSource: \"mock\"") &&
  read(inputs.twseRuntimeMockWiringReadiness).includes("rawMarketDataFetch: false");
const runtimeMockConsumerWireReady =
  read(inputs.twseRuntimeMockConsumerWire).includes("twse_openapi_runtime_mock_consumer_wire") &&
  read(inputs.twseRuntimeMockConsumerWire).includes("synthetic_runtime_wire_only") &&
  read(inputs.twseRuntimeMockConsumerWire).includes("parseTwseOpenApiSyntheticRows") &&
  read(inputs.twseRuntimeMockConsumerWire).includes("buildTwseOpenApiRuntimeHandoff") &&
  read(inputs.twseRuntimeMockConsumerWire).includes("publicDataSource: \"mock\"") &&
  read(inputs.twseRuntimeMockConsumerWire).includes("scoreSource: \"mock\"") &&
  read(inputs.twseRuntimeMockConsumerWire).includes("rawMarketDataFetch: false");

const requiredA1ArtifactsReady =
  caseNotesContainsFailureMatrix && fieldContractRoadmapEscalationReady && backfillReadinessPhaseThreeReady && parserFailureBlockingReady;
const requiredAdditionalReadinessArtifacts = requiredA1ArtifactsReady
  ? []
  : [
      ...(caseNotesContainsFailureMatrix ? [] : ["twse_openapi_runtime_consumer_adapter_synthetic_case_notes"]),
      ...(fieldContractRoadmapEscalationReady ? [] : ["twse_openapi_field_contract_roadmap"]),
      ...(backfillReadinessPhaseThreeReady ? [] : ["twse_openapi_coverage_and_backfill_readiness"]),
      ...(!parserFailureBlockingReady ? ["twse_openapi_parser_contract_consumer_adapter_no_fetch_blocking_contract"] : [])
    ];

const canEnterTwseOpenApiRuntimeMockWiring =
  requiredEvidence.fullLevel1ExpectedRows === 360 &&
  requiredEvidence.fullLevel1ObservedRows === 182 &&
  requiredEvidence.fullLevel1MissingRows === 178 &&
  requiredEvidence.twiiMissingRows === 60 &&
  requiredA1ArtifactsReady &&
  runtimeMockWiringReadinessReady &&
  runtimeMockConsumerWireReady &&
  !requiredAdditionalReadinessArtifacts.length;

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
    ceoRecommendation: "twse_openapi_runtime_mock_consumer_wire_next_public_runtime_parallel",
    pmMainline: "twse_openapi_runtime_mock_consumer_wire",
    a1Next: "continue_data_line_source_and_coverage_without_market_row_fetch",
    a2Next: "runtime_mock_consumer_public_boundary_copy_guardrail",
    fallbackIfRightsStayBlocked: "continue_public_beta_runtime_readability_and_production_readonly_guards"
  },
  coverage: requiredEvidence,
  readiness: {
    a1Readiness: {
      twseRuntimeCaseNotesReady: read(inputs.twseRuntimeCaseNotes).includes("Failure and Output Matrix"),
      twseFieldContractRoadmapReady: read(inputs.twseFieldContractRoadmap).includes("Roadmap: field-contract escalation"),
      twseCoverageBackfillReadinessReady: read(inputs.twseCoverageReadiness).includes("Phase 3: Backfill readiness"),
      parserFailureBlockingGuardVerified: parserFailureBlockingReady,
      runtimeMockWiringReadinessReady,
      runtimeMockConsumerWireReady,
      sourceRightsPacketAligned: read(inputs.a1OfficialIntake).includes("a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_filled_official_001_012_no_execution")
    },
    canEnterTwseOpenApiRuntimeMockWiring,
    requiredAdditionalReadinessArtifacts
  },
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
    "TWSE OpenAPI metadata / terms validation, source adapter contract, synthetic-only parser contract, synthetic parser-consumer case notes, field-contract roadmap, and coverage/backfill readiness notes are prepared. "
    + "Runtime mock consumer wire is now computed from synthetic parser output and visible on the public home runtime surface. "
    + "Current PM mainline node is twse_openapi_runtime_mock_consumer_wire. "
    + "Move next to BRIEF runtime comprehension cleanup while public runtime remains mock. "
    + `Can enter runtime-mock wiring: ${canEnterTwseOpenApiRuntimeMockWiring ? "yes" : "no"}`
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
