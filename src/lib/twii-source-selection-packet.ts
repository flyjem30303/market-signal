export type TwiiSourceCandidate = {
  id: "official-exchange-index" | "licensed-market-data-vendor" | "internal-approved-feed";
  label: string;
  status: "candidate_unverified";
  requiredReview: string[];
};

export type TwiiSourceSelectionPacket = {
  status: "twii_source_selection_packet_prepared";
  targetSymbol: "TWII";
  priority: "highest_row_coverage_gap";
  observedRows: 0;
  candidates: TwiiSourceCandidate[];
  acceptanceCriteria: string[];
  rejectionCriteria: string[];
  nextSafeAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getTwiiSourceSelectionPacket(): TwiiSourceSelectionPacket {
  return {
    acceptanceCriteria: [
      "Source authority and license terms are documented before parser work.",
      "Historical date, close value, volume or value coverage, and missing-session behavior are defined.",
      "Attribution, storage purpose, retention, and redistribution limits are approved.",
      "Output remains report-only until a separate dry-run reporter is approved.",
      "No row coverage credit is awarded until a bounded readonly post-run review confirms stored rows."
    ],
    candidates: [
      {
        id: "official-exchange-index",
        label: "Official exchange index history",
        requiredReview: ["license", "field contract", "rate limit", "attribution", "retention"],
        status: "candidate_unverified"
      },
      {
        id: "licensed-market-data-vendor",
        label: "Licensed market-data vendor",
        requiredReview: ["contract scope", "redistribution limit", "derived score use", "audit trail", "cost"],
        status: "candidate_unverified"
      },
      {
        id: "internal-approved-feed",
        label: "Internal approved feed",
        requiredReview: ["owner", "refresh SLA", "field lineage", "access control", "rollback"],
        status: "candidate_unverified"
      }
    ],
    nextSafeAction:
      "CEO/PM should prepare a human review packet selecting one TWII source candidate before any fetcher, parser, SQL, or Supabase read/write work.",
    observedRows: 0,
    priority: "highest_row_coverage_gap",
    publicDataSource: "mock",
    rejectionCriteria: [
      "License does not allow storage or derived use.",
      "Field contract cannot distinguish calendar gaps from source gaps.",
      "Attribution or redistribution terms are unclear.",
      "Source requires raw row output to be committed.",
      "Selection would imply publicDataSource=supabase or scoreSource=real before post-run review."
    ],
    scoreSource: "mock",
    status: "twii_source_selection_packet_prepared",
    stopLine:
      "This packet does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, create staging rows, modify daily_prices, print secrets, print row payloads, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real.",
    targetSymbol: "TWII"
  };
}
