import fs from "node:fs";

const requiredPackets = [
  {
    path: "docs/DATA_REALIFICATION_ACCELERATION_GATE.md",
    phrases: ["data_realification_acceleration_gate_ready_for_named_authorization", "TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET"]
  },
  {
    path: "docs/TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET.md",
    phrases: [
      "tw_equity_staging_first_authorization_packet_ready_not_executable",
      "tw_equity_daily_prices_staging",
      "observed `3` rows",
      "missing `177` rows"
    ]
  },
  {
    path: "docs/TW_EQUITY_SOURCE_REVIEW_READINESS_SUMMARY.md",
    phrases: ["waiting for a specific human source/legal classification", "not_source_approved"]
  },
  {
    path: "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
    phrases: ["expectedRows", "180", "latestObservedRows", "3", "latestMissingRows", "177"]
  }
];

const problems = [];

for (const packet of requiredPackets) {
  if (!fs.existsSync(packet.path)) {
    problems.push(`missing packet: ${packet.path}`);
    continue;
  }

  const text = fs.readFileSync(packet.path, "utf8");
  for (const phrase of packet.phrases) {
    if (!text.includes(phrase)) problems.push(`${packet.path} missing: ${phrase}`);
  }
}

const report = {
  status: problems.length === 0 ? "blocked_until_source_classification_and_write_authorization" : "blocked_local_packet_consistency_failed",
  laneId: "tw-equity",
  symbols: ["2330", "2382", "2308"],
  expectedTradingSessions: 60,
  expectedRows: 180,
  latestObservedRows: 3,
  latestMissingRows: 177,
  sourceClassificationStatus: "waiting_human_source_legal_classification",
  targetRelationProposal: "tw_equity_daily_prices_staging",
  productionDailyPricesBlocked: true,
  requiredAuthorizationMissing: [
    "authorization id",
    "exact command",
    "target relation",
    "maximum rows allowed",
    "service-role posture",
    "RLS posture",
    "rollback owner",
    "retention window",
    "post-run review artifact path"
  ],
  validationRulesSummary: [
    "OHLCV values must be non-negative when present",
    "high must be greater than or equal to low",
    "close must be inside high / low range when all are present",
    "trade date must be parseable",
    "duplicate symbol plus trade date is blocked",
    "missing sessions are counted, not filled"
  ],
  rollbackPosture: "required_not_authorized",
  retentionPosture: "required_not_authorized",
  postRunReviewReadiness: "template_fields_defined_not_executable",
  filesWritten: false,
  mutations: false,
  sqlExecuted: false,
  supabaseConnectionAttempted: false,
  supabaseWrites: false,
  marketDataFetched: false,
  marketDataIngested: false,
  sourcePayloadsPrinted: false,
  sourceDerivedRowsStored: false,
  secretsPrinted: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  problems
};

console.log(JSON.stringify(report, null, 2));

if (problems.length > 0) {
  process.exitCode = 1;
}
