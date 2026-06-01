export type EquityDryRunPacketSection = {
  id:
    | "scope"
    | "source"
    | "report-contract"
    | "validation"
    | "review-decision";
  owner: "Data" | "Engineering" | "Investment" | "Legal" | "PM";
  status: "packet_ready";
  summary: string;
};

export type EquityReportOnlyDryRunPacket = {
  status: "equity_report_only_dry_run_packet_prepared";
  sourceId: "twse-stock-day";
  targetSymbols: ["2330", "2382", "2308"];
  firstApprovedWindow: {
    startMonth: "2023-03-01";
    endMonth: "2026-05-01";
    expectedMonths: 39;
    minimumDelayMs: 800;
  };
  allowedOutput: string[];
  forbiddenOutput: string[];
  sections: EquityDryRunPacketSection[];
  nextSafeAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getEquityReportOnlyDryRunPacket(): EquityReportOnlyDryRunPacket {
  return {
    allowedOutput: [
      "run metadata",
      "HTTP status summary",
      "month count",
      "aggregate parsed row count",
      "first and last observed trade date",
      "validation counters",
      "schema-key summary",
      "decision: report_only / blocked / ready_for_review"
    ],
    firstApprovedWindow: {
      endMonth: "2026-05-01",
      expectedMonths: 39,
      minimumDelayMs: 800,
      startMonth: "2023-03-01"
    },
    forbiddenOutput: [
      "daily row data",
      "raw response body",
      "CSV or JSON market data files",
      "SQL inserts",
      "Supabase mutations",
      "price series charts",
      "model scores",
      "backtest metrics",
      "row coverage credit"
    ],
    nextSafeAction:
      "CEO may review this packet for a future separately approved report-only dry-run reporter; this slice does not implement or execute that reporter.",
    publicDataSource: "mock",
    scoreSource: "mock",
    sections: [
      {
        id: "scope",
        owner: "PM",
        status: "packet_ready",
        summary: "Limit the packet to 2330, 2382, and 2308, using TWSE STOCK_DAY as the only candidate source."
      },
      {
        id: "source",
        owner: "Legal",
        status: "packet_ready",
        summary: "Carry source attribution, rate-limit, fair-use, retention, and redistribution questions into review."
      },
      {
        id: "report-contract",
        owner: "Engineering",
        status: "packet_ready",
        summary: "Future output must be metadata and validation counters only, with no raw rows or persisted payloads."
      },
      {
        id: "validation",
        owner: "Data",
        status: "packet_ready",
        summary: "Require duplicate-date, missing-field, non-numeric, zero-row-month, and parser-exception counters."
      },
      {
        id: "review-decision",
        owner: "Investment",
        status: "packet_ready",
        summary: "Dry-run readiness does not validate adjusted returns, model credibility, public claims, or real scores."
      }
    ],
    sourceId: "twse-stock-day",
    status: "equity_report_only_dry_run_packet_prepared",
    stopLine:
      "This packet does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, implement a reporter, execute a dry run, create staging rows, modify daily_prices, print secrets, print row payloads, commit raw market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real.",
    targetSymbols: ["2330", "2382", "2308"]
  };
}
