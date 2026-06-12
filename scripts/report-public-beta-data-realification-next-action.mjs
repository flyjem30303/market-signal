import fs from "node:fs";

const inputs = {
  a1Coverage: "docs/A1_DATA_COVERAGE_NEXT_BATCH_HANDOFF.md",
  a1RightsPriority: "docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md",
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
    ceoRecommendation: "twii_source_rights_unblock_first_etf_parallel_public_runtime_mock",
    pmMainline: "prepare_twii_source_rights_unblock_decision_record_candidate",
    a1Next: "twii_source_rights_unblock_decision_record_candidate",
    a2Next: "keep_batch1_twii_core_etf_public_copy_mock_labeled",
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
    "Keep public Beta readable while A1 prepares a no-secret TWII source-rights unblock decision record. ETF remains parallel but blocked by rights evidence. No data execution or promotion is authorized by this report."
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
