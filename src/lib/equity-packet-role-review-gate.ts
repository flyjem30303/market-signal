export type EquityPacketRoleReview = {
  role: "PM" | "Engineering" | "Legal" | "Data" | "Investment" | "CEO";
  status: "accepted_for_packet_review" | "accepted_with_execution_blocker";
  finding: string;
  requiredBeforeExecution: string;
};

export type EquityPacketRoleReviewGate = {
  status: "equity_packet_role_review_gate_prepared";
  packetStatus: "equity_report_only_dry_run_packet_prepared";
  nextDecision: "may_request_report_only_runner_implementation_approval";
  reviews: EquityPacketRoleReview[];
  executionBlockers: string[];
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getEquityPacketRoleReviewGate(): EquityPacketRoleReviewGate {
  return {
    executionBlockers: [
      "CEO has not approved reporter implementation",
      "Legal has not approved automated source access",
      "No fetcher, parser, or reporter is authorized",
      "No Supabase read or write is authorized",
      "No raw market data may be stored or committed",
      "No row coverage credit or real score may be awarded"
    ],
    nextDecision: "may_request_report_only_runner_implementation_approval",
    packetStatus: "equity_report_only_dry_run_packet_prepared",
    publicDataSource: "mock",
    reviews: [
      {
        finding: "Packet scope is narrow enough for review and does not ask for production ingestion.",
        requiredBeforeExecution: "Confirm CEO wants to review a one-time report-only runner implementation request.",
        role: "PM",
        status: "accepted_for_packet_review"
      },
      {
        finding: "Implementation boundary is clear: future runner may emit counters only and must not import database clients.",
        requiredBeforeExecution: "Create a separate implementation approval gate before writing any runner code.",
        role: "Engineering",
        status: "accepted_with_execution_blocker"
      },
      {
        finding: "Source, rate-limit, fair-use, attribution, storage, and redistribution questions remain explicit.",
        requiredBeforeExecution: "Approve automated source access and report-only handling terms before any HTTP request.",
        role: "Legal",
        status: "accepted_with_execution_blocker"
      },
      {
        finding: "Validation counters are sufficient for packet review but not for stored-row coverage credit.",
        requiredBeforeExecution: "Define post-run evidence acceptance before any coverage promotion.",
        role: "Data",
        status: "accepted_for_packet_review"
      },
      {
        finding: "Dry-run evidence would validate source parsing only, not model credibility or investment interpretation.",
        requiredBeforeExecution: "Keep public claims and score interpretation blocked until model evidence exists.",
        role: "Investment",
        status: "accepted_for_packet_review"
      },
      {
        finding: "The packet may advance to a separate approval request, but execution remains blocked.",
        requiredBeforeExecution: "CEO must explicitly approve the next gate before implementation, execution, or data access.",
        role: "CEO",
        status: "accepted_with_execution_blocker"
      }
    ],
    scoreSource: "mock",
    status: "equity_packet_role_review_gate_prepared",
    stopLine:
      "This role review gate does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, implement a reporter, execute a dry run, create staging rows, modify daily_prices, print secrets, print row payloads, commit raw market data, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
