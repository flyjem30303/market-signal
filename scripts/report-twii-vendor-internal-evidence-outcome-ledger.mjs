import fs from "node:fs";

const outcomePath = "data/source-gates/twii-vendor-internal-evidence-outcomes.json";
const docPath = "docs/TWII_VENDOR_INTERNAL_EVIDENCE_OUTCOME_LEDGER.md";
const outcomes = JSON.parse(fs.readFileSync(outcomePath, "utf8")).outcomes;

const accepted = outcomes.filter((item) => item.classification === "accepted_for_source_rights_outcome_gate_only");
const pending = outcomes.filter((item) => item.classification === "pending");
const rejected = outcomes.filter((item) => item.classification === "rejected");
const needsRepair = outcomes.filter((item) => item.classification === "needs_bounded_repair");
const blocked = outcomes.filter((item) => item.classification === "blocked_external_vendor_or_internal_owner_pending");
const allAccepted = accepted.length === outcomes.length;

console.log(
  JSON.stringify(
    {
      mode: "twii_vendor_internal_evidence_outcome_ledger",
      status:
        pending.length === outcomes.length
          ? "awaiting_twii_vendor_internal_evidence"
          : allAccepted
            ? "ready_for_twii_source_rights_outcome_gate_only"
            : rejected.length > 0 || blocked.length > 0
              ? "twii_vendor_internal_evidence_blocked"
              : needsRepair.length > 0
                ? "twii_vendor_internal_evidence_needs_bounded_repair"
                : "partial_twii_vendor_internal_evidence_recorded",
      doc: docPath,
      outcomeData: outcomePath,
      canOpenTwiiSourceRightsOutcomeGate: allAccepted,
      runtimeBoundary: {
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
        acceptedForSourceRightsOutcomeGateOnly: accepted.length,
        blockedExternalVendorOrInternalOwnerPending: blocked.length,
        needsBoundedRepair: needsRepair.length,
        pending: pending.length,
        rejected: rejected.length,
        total: outcomes.length
      },
      outcomes,
      stillBlocked: [
        "source-rights approval",
        "field-contract approval",
        "asset-mapping approval",
        "TWII candidate generation",
        "TWII probe execution",
        "SQL execution",
        "Supabase connection",
        "Supabase reads",
        "Supabase writes",
        "staging rows",
        "daily_prices mutation",
        "market-data fetch",
        "market-data ingestion",
        "source-derived row storage",
        "row coverage points",
        "publicDataSource=supabase",
        "scoreSource=real"
      ],
      nextDecision: allAccepted
        ? "Open a separate TWII source-rights outcome gate; do not execute from this ledger."
        : "Record safe A1 evidence classifications or continue Beta/platform-value work while evidence remains pending."
    },
    null,
    2
  )
);
