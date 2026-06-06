import fs from "node:fs";

const requiredPackets = [
  {
    path: "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md",
    phrases: [
      "tw_equity_local_report_only_runner_implementation_gate_ready_not_executed",
      "scripts/report-tw-equity-local-report-only-dry-run.mjs"
    ]
  },
  {
    path: "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md",
    phrases: ["tw_equity_local_report_only_runner_design_ready_not_executable", "publicDataSource mock", "scoreSource mock"]
  },
  {
    path: "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md",
    phrases: ["not source approved", "external provider terms pending", "Redistribution status: not approved", "Retention status: not approved"]
  },
  {
    path: "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
    phrases: ["expectedTradingSessions", "expectedRows", "latestObservedRows", "latestMissingRows"]
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
  status: problems.length === 0 ? "blocked_until_source_approval" : "blocked_local_packet_consistency_failed",
  laneId: "tw-equity",
  symbols: ["2330", "2382", "2308"],
  expectedTradingSessions: 60,
  expectedRows: 180,
  latestObservedRows: 3,
  latestMissingRows: 177,
  sourceRightsStatus: "not_source_approved",
  providerTermsStatus: "external_provider_terms_pending",
  redistributionStatus: "not_approved",
  retentionStatus: "not_approved",
  targetTablePosture: "staging_first",
  productionDailyPricesBlocked: true,
  validationStatus: problems.length === 0 ? "local_packet_consistency_only" : "local_packet_consistency_failed",
  filesWritten: false,
  mutations: false,
  sqlExecuted: false,
  supabaseConnectionAttempted: false,
  supabaseWrites: false,
  marketFetchAttempted: false,
  marketIngestionAttempted: false,
  secretsPrinted: false,
  sourcePayloadsPrinted: false,
  sourceDerivedRowsStored: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  problems
};

console.log(JSON.stringify(report, null, 2));

if (problems.length > 0) {
  process.exitCode = 1;
}
