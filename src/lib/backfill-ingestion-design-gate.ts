export type BackfillIngestionDesignGateRequirement = {
  id:
    | "source-rights"
    | "target-table-boundary"
    | "dry-run-report"
    | "rollback-retention"
    | "post-run-review";
  owner: "Data" | "Engineering" | "Legal" | "PM" | "QA";
  status: "required_before_execution";
  requirement: string;
};

export type BackfillIngestionDesignGate = {
  blockedReason: "aggregate_count_incomplete";
  gateStatus: "design_gate_required_not_authorized_for_execution";
  missingRows: 178;
  publicDataSource: "mock";
  requirements: BackfillIngestionDesignGateRequirement[];
  scoreSource: "mock";
  targetRelation: "daily_prices";
  title: string;
  stopLine: string;
};

export function getBackfillIngestionDesignGate(): BackfillIngestionDesignGate {
  return {
    blockedReason: "aggregate_count_incomplete",
    gateStatus: "design_gate_required_not_authorized_for_execution",
    missingRows: 178,
    publicDataSource: "mock",
    requirements: [
      {
        id: "source-rights",
        owner: "Legal",
        requirement:
          "Approve source-specific attribution, redistribution, storage purpose, and display limits before any backfill.",
        status: "required_before_execution"
      },
      {
        id: "target-table-boundary",
        owner: "Engineering",
        requirement:
          "Specify whether future writes target staging or daily_prices, including RLS, service-role posture, and no-write preflight.",
        status: "required_before_execution"
      },
      {
        id: "dry-run-report",
        owner: "Data",
        requirement:
          "Produce a report-only dry-run plan with expected symbols, sessions, row counts, validation rules, and sanitized output.",
        status: "required_before_execution"
      },
      {
        id: "rollback-retention",
        owner: "QA",
        requirement:
          "Define rollback, cleanup dry-run count, retention window, and failure classification before any data mutation.",
        status: "required_before_execution"
      },
      {
        id: "post-run-review",
        owner: "PM",
        requirement:
          "Require a post-run review before any public source, score source, row coverage points, or readiness promotion.",
        status: "required_before_execution"
      }
    ],
    scoreSource: "mock",
    targetRelation: "daily_prices",
    title: "Backfill / ingestion design gate is required before data coverage can move",
    stopLine:
      "This design gate does not run SQL, write Supabase, fetch or ingest market data, modify daily_prices, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
