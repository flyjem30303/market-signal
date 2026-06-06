import fs from "node:fs";

const outcomePath = "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json";
const packetPath = "docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md";
const outcomes = JSON.parse(fs.readFileSync(outcomePath, "utf8")).outcomes;
const allowedResolved = new Set([
  "accepted_for_local_planning_only",
  "accepted_for_internal_only",
  "accepted_for_delayed_public_display",
  "accepted_for_derived_metrics_only"
]);

const pending = outcomes.filter((item) => item.classification === "pending");
const rejected = outcomes.filter((item) => item.classification === "rejected");
const unknown = outcomes.filter((item) => item.classification === "unknown_keep_blocked");
const accepted = outcomes.filter((item) => allowedResolved.has(item.classification));
const allResolvedWithoutUnknown = outcomes.every((item) => allowedResolved.has(item.classification));

const ledger = {
  mode: "tw_equity_provider_specific_terms_review_outcome_ledger",
  status:
    pending.length === outcomes.length
      ? "awaiting_provider_specific_terms_review"
      : rejected.length > 0 || unknown.length > 0
        ? "provider_specific_terms_review_blocked"
        : allResolvedWithoutUnknown
          ? "provider_specific_terms_review_locally_classified_not_source_approved"
          : "partial_provider_specific_terms_review_recorded",
  packet: packetPath,
  outcomeData: outcomePath,
  symbols: ["2330", "2382", "2308"],
  sourceApprovalStatus: "not_source_approved",
  providerTermsStatus: "external_provider_terms_pending_until_human_outcome",
  runtimePosture: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicSourcePromoted: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourcePayloadStored: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false
  },
  counts: {
    acceptedForPlanning: accepted.length,
    pending: pending.length,
    rejected: rejected.length,
    unknownKeepBlocked: unknown.length,
    total: outcomes.length
  },
  outcomes,
  stillBlocked: [
    "source use",
    "provider terms approval",
    "source license approval",
    "redistribution approval",
    "retention approval",
    "public display approval",
    "derived-score use approval",
    "SQL execution",
    "Supabase connection",
    "Supabase reads",
    "Supabase writes",
    "staging rows",
    "daily_prices mutation",
    "TWSE source retrieval",
    "market-data ingestion",
    "source-derived row storage",
    "public source promotion",
    "row coverage points",
    "scoreSource=real"
  ],
  nextDecision:
    "Record human classifications as accepted_for_local_planning_only, accepted_for_internal_only, accepted_for_delayed_public_display, accepted_for_derived_metrics_only, rejected, or unknown_keep_blocked; do not promote runtime state from this ledger alone."
};

console.log(JSON.stringify(ledger, null, 2));
