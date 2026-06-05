import { spawnSync } from "node:child_process";

const packets = [
  {
    id: "twii-source-selection-acceptance",
    command: "scripts/check-twii-source-selection-acceptance-gate.mjs",
    lane: "TWII",
    acceptanceState: "accepted_for_rights_and_field_contract_review_only",
    decisionUse:
      "Official exchange index route is accepted only as the first TWII candidate for rights and field-contract review."
  },
  {
    id: "twii-report-only-probe-acceptance",
    command: "scripts/check-twii-report-only-probe-acceptance-gate.mjs",
    lane: "TWII",
    acceptanceState: "accepted_for_implementation_preparation_only",
    decisionUse:
      "A future one-attempt report-only probe can be prepared, but execution remains separate and not authorized by this report."
  },
  {
    id: "etf-source-rights-review-packet",
    command: "scripts/check-etf-source-rights-review-packet.mjs",
    lane: "ETF",
    acceptanceState: "packet_prepared_legal_terms_unapproved",
    decisionUse:
      "ETF source candidates, rights criteria, rejection criteria, and blocker state are explicit before any ETF dry-run work."
  },
  {
    id: "equity-row-coverage-evidence-acceptance",
    command: "scripts/check-equity-row-coverage-evidence-acceptance-gate.mjs",
    lane: "Equity",
    acceptanceState: "accepted_as_local_decision_quality_evidence_only",
    decisionUse:
      "Clean equity report-only sample is accepted as local decision-quality evidence, not as production ingestion or row coverage points."
  },
  {
    id: "backfill-ingestion-design-gate",
    command: "scripts/check-backfill-ingestion-design-gate.mjs",
    lane: "Storage",
    acceptanceState: "design_gate_required_not_authorized_for_execution",
    decisionUse:
      "Staging-first versus direct-write choice, rollback, retention, dry-run report, and post-run review remain required before mutation."
  }
];

const evidence = packets.map((packet) => {
  const run = spawnSync(process.execPath, [packet.command], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    acceptanceState: packet.acceptanceState,
    decisionUse: packet.decisionUse,
    id: packet.id,
    lane: packet.lane,
    ok: run.status === 0
  };
});

const allOk = evidence.every((item) => item.ok);

const report = {
  mode: "source_specific_acceptance_packets_readiness",
  status: allOk ? "source_specific_acceptance_packets_reviewable_no_write" : "blocked_acceptance_packets_incomplete",
  owner: "PM",
  coOwners: ["Data", "Engineering", "Legal", "QA"],
  recommendedBy: "CEO",
  readinessLift: allOk ? 24 : 0,
  upgradedReadinessPercent: allOk ? 88 : 64,
  targetForMvpReview: 95,
  evidence,
  acceptedForReview: [
    "TWII source selection is accepted for rights and field-contract review only",
    "TWII report-only probe is accepted for implementation preparation only, not execution",
    "ETF source-rights packet is prepared but legal and redistribution terms remain unapproved",
    "Equity row coverage sample is accepted as local decision-quality evidence only",
    "Backfill or ingestion remains blocked behind staging-first, rollback, retention, and post-run review decisions"
  ],
  stillNotApproved: [
    "TWII source rights approval",
    "TWII probe execution",
    "ETF source approval",
    "ETF dry-run implementation",
    "production ingestion",
    "SQL execution",
    "Supabase writes",
    "staging rows",
    "daily_prices modification",
    "market data fetch",
    "raw market data storage",
    "row coverage points",
    "data-quality score increase",
    "publicDataSource=supabase",
    "scoreSource=real",
    "public coverage claims"
  ],
  nextGapsTo95: [
    "CEO/Legal acceptance of TWII rights and field-contract packet",
    "explicit one-attempt authorization before any TWII report-only probe execution",
    "Legal acceptance or rejection of ETF source route",
    "Engineering/QA acceptance of equity report-only dry-run thresholds",
    "PM decision packet for staging-first mutation boundary"
  ],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  stopLine:
    "This source-specific acceptance packet readiness report does not connect to Supabase, run SQL, write Supabase, create staging rows, modify daily_prices, execute a TWII probe, fetch or ingest market data, print secrets, print row payloads, award row coverage points, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));
