export type SourceReadinessCheckpointLane = {
  lane: "TWII" | "ETF" | "Equity";
  status: "human_review_required" | "rights_review_required" | "report_only_packet_ready";
  ceoDecision: string;
  pmAction: string;
};

export type SourceReadinessCheckpointSummary = {
  status: "source_readiness_checkpoint_summarized";
  primaryNextMove: "equity_report_only_packet";
  lanes: SourceReadinessCheckpointLane[];
  blockedFromExecution: string[];
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getSourceReadinessCheckpointSummary(): SourceReadinessCheckpointSummary {
  return {
    blockedFromExecution: [
      "SQL execution",
      "Supabase reads or writes",
      "market-data fetch or ingestion",
      "staging rows or daily_prices mutation",
      "raw market-data commits",
      "row coverage credit",
      "publicDataSource=supabase",
      "scoreSource=real"
    ],
    lanes: [
      {
        ceoDecision:
          "TWII has the highest coverage gap, but it needs a human source-selection decision before any technical work.",
        lane: "TWII",
        pmAction: "Prepare a human review packet selecting one candidate source and documenting license, fields, and retention.",
        status: "human_review_required"
      },
      {
        ceoDecision:
          "ETF coverage remains blocked by legal and redistribution terms; technical reachability is not permission.",
        lane: "ETF",
        pmAction: "Prepare a Legal-led rights decision packet before any ETF adapter, smoke run, or source promotion.",
        status: "rights_review_required"
      },
      {
        ceoDecision:
          "Equity has existing TWSE STOCK_DAY designs and can move next as a report-only packet, not a runner.",
        lane: "Equity",
        pmAction: "Assemble the CEO-reviewable report-only dry-run packet for 2330, 2382, and 2308.",
        status: "report_only_packet_ready"
      }
    ],
    primaryNextMove: "equity_report_only_packet",
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "source_readiness_checkpoint_summarized",
    stopLine:
      "This checkpoint does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, create staging rows, modify daily_prices, print secrets, print row payloads, commit raw market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
