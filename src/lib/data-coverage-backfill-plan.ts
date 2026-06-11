export type DataCoverageBackfillLane = {
  id: "tw-index" | "tw-etf" | "tw-equity";
  coverageTarget: string;
  owner: "Data" | "Engineering" | "Legal";
  readiness: "source_required" | "design_reference_available";
  reportOnlyNextStep: string;
  symbols: string[];
};

export type DataCoverageBackfillPlan = {
  status: "report_only_source_lane_plan";
  expectedRows: 360;
  observedRows: 182;
  missingRows: 178;
  lanes: DataCoverageBackfillLane[];
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getDataCoverageBackfillPlan(): DataCoverageBackfillPlan {
  return {
    expectedRows: 360,
    lanes: [
      {
        coverageTarget: "Taiwan weighted index history",
        id: "tw-index",
        owner: "Data",
        readiness: "source_required",
        reportOnlyNextStep:
          "Select and review a TWII source before any parser, fetcher, SQL, Supabase write, or public claim.",
        symbols: ["TWII"]
      },
      {
        coverageTarget: "Taiwan ETF history",
        id: "tw-etf",
        owner: "Legal",
        readiness: "source_required",
        reportOnlyNextStep:
          "Resolve ETF source rights and data-field coverage before any report-only dry-run implementation.",
        symbols: ["0050", "006208"]
      },
      {
        coverageTarget: "Taiwan listed equity history",
        id: "tw-equity",
        owner: "Engineering",
        readiness: "design_reference_available",
        reportOnlyNextStep:
          "Reuse the existing TWSE STOCK_DAY design documents to prepare a report-only dry-run packet for equities.",
        symbols: ["2330", "2382", "2308"]
      }
    ],
    missingRows: 178,
    observedRows: 182,
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "report_only_source_lane_plan",
    stopLine:
      "This plan does not run SQL, write Supabase, fetch or ingest market data, create staging rows, modify daily_prices, print row payloads, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
