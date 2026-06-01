import fs from "node:fs";

const packetPath = "src/lib/data-source-readiness-packet.ts";
const routePath = "src/lib/data-coverage-route-decision.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [packetPath, routePath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [packetPath, "getDataSourceReadinessPacket"],
  [packetPath, "getEtfSourceRightsReviewPacket"],
  [packetPath, "getEquityDryRunPacketReadiness"],
  [packetPath, "getEquityPacketRoleReviewGate"],
  [packetPath, "getEquityReportOnlyDryRunPacket"],
  [packetPath, "getEquityRunnerImplementationApprovalGate"],
  [packetPath, "getRunnerApprovalDecisionOutcomeLedger"],
  [packetPath, "getRunnerApprovalDecisionRequestSummary"],
  [packetPath, "getSourceReadinessCheckpointSummary"],
  [packetPath, "getTwiiSourceSelectionPacket"],
  [packetPath, "source_readiness_packet_prepared"],
  [packetPath, "etfSourceRightsReviewPacket: EtfSourceRightsReviewPacket"],
  [packetPath, "etfSourceRightsReviewPacket: getEtfSourceRightsReviewPacket()"],
  [packetPath, "equityDryRunPacketReadiness: EquityDryRunPacketReadiness"],
  [packetPath, "equityDryRunPacketReadiness: getEquityDryRunPacketReadiness()"],
  [packetPath, "equityPacketRoleReviewGate: EquityPacketRoleReviewGate"],
  [packetPath, "equityPacketRoleReviewGate: getEquityPacketRoleReviewGate()"],
  [packetPath, "equityReportOnlyDryRunPacket: EquityReportOnlyDryRunPacket"],
  [packetPath, "equityReportOnlyDryRunPacket: getEquityReportOnlyDryRunPacket()"],
  [packetPath, "equityRunnerImplementationApprovalGate: EquityRunnerImplementationApprovalGate"],
  [packetPath, "equityRunnerImplementationApprovalGate: getEquityRunnerImplementationApprovalGate()"],
  [packetPath, "runnerApprovalDecisionOutcomeLedger: RunnerApprovalDecisionOutcomeLedger"],
  [packetPath, "runnerApprovalDecisionOutcomeLedger: getRunnerApprovalDecisionOutcomeLedger()"],
  [packetPath, "runnerApprovalDecisionRequestSummary: RunnerApprovalDecisionRequestSummary"],
  [packetPath, "runnerApprovalDecisionRequestSummary: getRunnerApprovalDecisionRequestSummary()"],
  [packetPath, "sourceReadinessCheckpointSummary: SourceReadinessCheckpointSummary"],
  [packetPath, "sourceReadinessCheckpointSummary: getSourceReadinessCheckpointSummary()"],
  [packetPath, "twiiSourceSelectionPacket: TwiiSourceSelectionPacket"],
  [packetPath, "twiiSourceSelectionPacket: getTwiiSourceSelectionPacket()"],
  [packetPath, "twii-source-selection"],
  [packetPath, "etf-source-rights"],
  [packetPath, "equity-dry-run-packet"],
  [packetPath, "blocked_needs_source_decision"],
  [packetPath, "blocked_needs_rights_review"],
  [packetPath, "ready_for_report_only_packet"],
  [packetPath, "priorityOrder: [\"TWII\", \"ETF\", \"Equity\"]"],
  [packetPath, "publicDataSource: \"mock\""],
  [packetPath, "scoreSource: \"mock\""],
  [packetPath, "TWII"],
  [packetPath, "0050"],
  [packetPath, "006208"],
  [packetPath, "2330"],
  [packetPath, "2382"],
  [packetPath, "2308"],
  [packetPath, "does not run SQL"],
  [packetPath, "connect to Supabase"],
  [packetPath, "write Supabase"],
  [packetPath, "fetch or ingest market data"],
  [packetPath, "create staging rows"],
  [packetPath, "modify daily_prices"],
  [packetPath, "print secrets"],
  [packetPath, "print row payloads"],
  [packetPath, "promote publicDataSource=supabase"],
  [packetPath, "award row coverage points"],
  [packetPath, "set scoreSource=real"],
  [routePath, "getDataSourceReadinessPacket"],
  [routePath, "sourceReadinessPacket: DataSourceReadinessPacket"],
  [routePath, "sourceReadinessPacket: getDataSourceReadinessPacket()"],
  [componentPath, "project-progress-source-readiness"],
  [componentPath, "project-progress-etf-rights-review"],
  [componentPath, "project-progress-equity-dry-run"],
  [componentPath, "project-progress-equity-dry-run-packet"],
  [componentPath, "project-progress-equity-role-review"],
  [componentPath, "project-progress-equity-runner-approval"],
  [componentPath, "project-progress-runner-decision-request"],
  [componentPath, "project-progress-runner-outcome-ledger"],
  [componentPath, "project-progress-source-checkpoint"],
  [componentPath, "project-progress-twii-source-selection"],
  [componentPath, "progress.dataCoverageRouteDecision.sourceReadinessPacket.etfSourceRightsReviewPacket.candidates.map"],
  [componentPath, "progress.dataCoverageRouteDecision.sourceReadinessPacket.equityDryRunPacketReadiness.requirements.map"],
  [componentPath, "progress.dataCoverageRouteDecision.sourceReadinessPacket.equityReportOnlyDryRunPacket.sections.map"],
  [componentPath, "progress.dataCoverageRouteDecision.sourceReadinessPacket.equityPacketRoleReviewGate.reviews.map"],
  [
    componentPath,
    "progress.dataCoverageRouteDecision.sourceReadinessPacket.equityRunnerImplementationApprovalGate.requirements.map"
  ],
  [
    componentPath,
    "progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionRequestSummary.options.map"
  ],
  [
    componentPath,
    "progress.dataCoverageRouteDecision.sourceReadinessPacket.runnerApprovalDecisionOutcomeLedger.outcomes.map"
  ],
  [componentPath, "progress.dataCoverageRouteDecision.sourceReadinessPacket.lanes.map"],
  [componentPath, "progress.dataCoverageRouteDecision.sourceReadinessPacket.sourceReadinessCheckpointSummary.lanes.map"],
  [componentPath, "progress.dataCoverageRouteDecision.sourceReadinessPacket.twiiSourceSelectionPacket.candidates.map"],
  [componentPath, "progress.dataCoverageRouteDecision.sourceReadinessPacket.stopLine"],
  [cssPath, ".project-progress-source-readiness"],
  [cssPath, ".project-progress-etf-rights-review"],
  [cssPath, ".project-progress-equity-dry-run"],
  [cssPath, ".project-progress-equity-dry-run-packet"],
  [cssPath, ".project-progress-equity-role-review"],
  [cssPath, ".project-progress-equity-runner-approval"],
  [cssPath, ".project-progress-runner-decision-request"],
  [cssPath, ".project-progress-runner-outcome-ledger"],
  [cssPath, ".project-progress-source-checkpoint"],
  [cssPath, ".project-progress-twii-source-selection"],
  [packagePath, "\"check:data-source-readiness-packet\": \"node scripts/check-data-source-readiness-packet.mjs\""],
  [reviewGatePath, "scripts/check-data-source-readiness-packet.mjs"]
];

const forbidden = [
  [packetPath, "@supabase/supabase-js"],
  [packetPath, "createClient"],
  [packetPath, "fetch("],
  [packetPath, ".from("],
  [packetPath, ".insert("],
  [packetPath, ".update("],
  [packetPath, ".delete("],
  [packetPath, "process.env"],
  [packetPath, "publicDataSource: \"supabase\""],
  [packetPath, "scoreSource: \"real\""],
  [componentPath, "run SQL"],
  [componentPath, "fetch("]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
