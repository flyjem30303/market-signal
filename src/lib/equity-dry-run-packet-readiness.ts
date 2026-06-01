export type EquityDryRunReadinessRequirement = {
  id:
    | "scope-lock"
    | "source-contract"
    | "report-only-output"
    | "validation-thresholds"
    | "post-run-review";
  status: "ready_for_packet" | "requires_confirmation";
  requirement: string;
};

export type EquityDryRunPacketReadiness = {
  status: "equity_dry_run_packet_ready_for_report_only_design";
  sourceId: "twse-stock-day";
  targetSymbols: ["2330", "2382", "2308"];
  referenceDocuments: string[];
  requirements: EquityDryRunReadinessRequirement[];
  nextSafeAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getEquityDryRunPacketReadiness(): EquityDryRunPacketReadiness {
  return {
    nextSafeAction:
      "Assemble a CEO-reviewable report-only dry-run packet for 2330, 2382, and 2308 from the existing TWSE STOCK_DAY designs; do not implement a fetcher or reporter in this slice.",
    publicDataSource: "mock",
    referenceDocuments: [
      "docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md",
      "docs/CP3_TWSE_STOCK_DAY_DRY_RUN_REPORTER_DESIGN_2026-05-29.md"
    ],
    requirements: [
      {
        id: "scope-lock",
        requirement:
          "Limit the first equity packet to 2330, 2382, and 2308 with TWSE STOCK_DAY as the only candidate source.",
        status: "ready_for_packet"
      },
      {
        id: "source-contract",
        requirement:
          "Carry forward source URL, attribution, rate-limit, date window, and field mapping from the existing design docs.",
        status: "ready_for_packet"
      },
      {
        id: "report-only-output",
        requirement:
          "Allow only aggregate run metadata, HTTP status summary, row counts, validation counters, and schema-key summaries.",
        status: "ready_for_packet"
      },
      {
        id: "validation-thresholds",
        requirement:
          "Require duplicate-date, missing-field, non-numeric, zero-row-month, and parser-exception checks before review.",
        status: "ready_for_packet"
      },
      {
        id: "post-run-review",
        requirement:
          "No row coverage credit is allowed without separate CEO approval, stored-row evidence, and post-run review before any public source or real score.",
        status: "requires_confirmation"
      }
    ],
    scoreSource: "mock",
    sourceId: "twse-stock-day",
    status: "equity_dry_run_packet_ready_for_report_only_design",
    stopLine:
      "This readiness packet does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, implement a reporter, create staging rows, modify daily_prices, print secrets, print row payloads, commit raw market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real.",
    targetSymbols: ["2330", "2382", "2308"]
  };
}
