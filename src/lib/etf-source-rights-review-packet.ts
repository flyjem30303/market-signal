export type EtfSourceRightsCandidate = {
  id: "twse-mis-etf-surface" | "issuer-official-pages" | "licensed-vendor";
  label: string;
  status: "blocked_for_ingestion" | "candidate_requires_review";
  requiredReview: string[];
};

export type EtfSourceRightsReviewPacket = {
  status: "etf_source_rights_review_packet_prepared";
  targetSymbols: ["0050", "006208"];
  blocker: "legal_and_redistribution_terms_unapproved";
  candidates: EtfSourceRightsCandidate[];
  acceptanceCriteria: string[];
  rejectionCriteria: string[];
  nextSafeAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getEtfSourceRightsReviewPacket(): EtfSourceRightsReviewPacket {
  return {
    acceptanceCriteria: [
      "Storage, display, redistribution, and derived-score use are explicitly permitted.",
      "ETF-specific fields include NAV, premium or discount, tracking index, issuer, expense ratio, and update cadence.",
      "Manual validation outputs remain aggregate-only and do not persist raw payloads.",
      "Adapter or dry-run implementation is separately approved after legal review.",
      "ETF row coverage credit remains blocked until stored rows pass bounded readonly post-run review."
    ],
    blocker: "legal_and_redistribution_terms_unapproved",
    candidates: [
      {
        id: "twse-mis-etf-surface",
        label: "TWSE MIS ETF NAV / premium-discount surface",
        requiredReview: ["terms", "fair use", "rate limit", "redistribution", "field stability"],
        status: "blocked_for_ingestion"
      },
      {
        id: "issuer-official-pages",
        label: "ETF issuer official pages",
        requiredReview: ["issuer terms", "field coverage", "format stability", "normalization cost", "refresh cadence"],
        status: "candidate_requires_review"
      },
      {
        id: "licensed-vendor",
        label: "Licensed ETF market-data vendor",
        requiredReview: ["contract scope", "global coverage", "storage rights", "display rights", "derived-score rights"],
        status: "candidate_requires_review"
      }
    ],
    nextSafeAction:
      "Prepare a Legal-led rights decision packet comparing TWSE MIS, issuer pages, and licensed vendor routes before any ETF adapter, fetcher, SQL, or Supabase read/write work.",
    publicDataSource: "mock",
    rejectionCriteria: [
      "Terms restrict automated download, storage, redistribution, or derived commercial use.",
      "Source cannot provide ETF-specific fields beyond trading price.",
      "Use would require persisting raw MIS payloads or committing market-data files.",
      "Rate-limit or fair-use posture cannot be documented.",
      "Selection would imply publicDataSource=supabase or scoreSource=real before post-run review."
    ],
    scoreSource: "mock",
    status: "etf_source_rights_review_packet_prepared",
    stopLine:
      "This packet does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, run ETF MIS smoke, create staging rows, modify daily_prices, print secrets, print row payloads, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real.",
    targetSymbols: ["0050", "006208"]
  };
}
