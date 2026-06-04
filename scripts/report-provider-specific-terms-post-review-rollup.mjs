import { spawnSync } from "node:child_process";

const packetRun = spawnSync(process.execPath, ["scripts/report-provider-specific-terms-review-packet.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});
const ledgerRun = spawnSync(process.execPath, ["scripts/report-narrow-approval-outcome-ledger.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (packetRun.status !== 0) {
  throw new Error(`provider-specific terms packet failed: ${packetRun.stderr.trim()}`);
}
if (ledgerRun.status !== 0) {
  throw new Error(`narrow approval outcome ledger failed: ${ledgerRun.stderr.trim()}`);
}

const packet = JSON.parse(packetRun.stdout);
const ledger = JSON.parse(ledgerRun.stdout);
const legalOutcome = ledger.outcomes.find((item) => item.id === "legal-source-terms-review");

if (!legalOutcome) {
  throw new Error("Missing legal-source-terms-review outcome");
}

const rollup = {
  mode: "provider_specific_terms_post_review_rollup",
  status: "local_terms_packet_output_ready_for_ceo_oral_review",
  owner: "Legal",
  recommendedBy: "CEO",
  packetId: "provider-specific-terms-review-packet",
  selectedGate: packet.selectedGate,
  basedOn: ["scripts/report-provider-specific-terms-review-packet.mjs", "scripts/report-narrow-approval-outcome-ledger.mjs", ...packet.basedOn],
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    externalTermsApproved: false,
    ingestionStarted: false,
    providerTermsFetched: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  rollupItems: packet.reviewScope.map((section) => ({
    id: section.id,
    state: "ready_for_oral_review",
    requiredDecision: section.requiredDecision
  })),
  legalOutcome: {
    id: legalOutcome.id,
    outcome: legalOutcome.outcome,
    recordedBy: legalOutcome.recordedBy,
    recordedAt: legalOutcome.recordedAt,
    meaning: legalOutcome.acceptedMeaning,
    stillDoesNotAuthorize: legalOutcome.stillDoesNotAuthorize
  },
  readyForNextReadonlyDecision: legalOutcome.outcome === "accepted",
  oralReviewQuestion:
    "Does CEO accept this local Legal terms-review packet as review-ready for future provider-specific terms classification, without approving provider terms or runtime promotion?",
  ceoDecisionOptions: [
    {
      outcome: "accepted",
      meaning:
        "Record legal-source-terms-review as accepted for local planning only; do not approve rights, runtime promotion, ingestion, or real scoring."
    },
    {
      outcome: "rejected",
      meaning:
        "Revise provider terms classification scope before any row coverage remote attempt or public source claim."
    }
  ],
  notApproved: [
    "provider terms approval",
    "source license approval",
    "raw market data redistribution",
    "public real-data source claim",
    "Supabase readonly execution",
    "SQL execution",
    "market data ingestion",
    "row coverage points",
    "publicDataSource=supabase",
    "scoreSource=real"
  ],
  nextOutcomeRecord:
    legalOutcome.outcome === "accepted"
      ? "legal-source-terms-review is already accepted for local planning only; do not duplicate the outcome or promote runtime state."
      : "If CEO orally accepts this rollup, record legal-source-terms-review as accepted for local planning only; do not promote runtime state.",
  nextRecordCommand:
    legalOutcome.outcome === "accepted"
      ? null
      : "npm run record:narrow-approval-outcome -- --apply --id legal-source-terms-review --outcome accepted --recordedBy CEO --note \"Provider-specific terms packet accepted for local planning only; no rights or runtime promotion approved.\"",
  ceoRecommendation:
    legalOutcome.outcome === "accepted"
      ? "Legal local planning outcome is already recorded. Use this rollup to keep source-rights context aligned, then prepare the next separately named bounded readonly decision while keeping publicDataSource=mock and scoreSource=mock."
      : "Use this rollup as the CEO oral review summary. If accepted, record only the local planning outcome and keep publicDataSource=mock and scoreSource=mock."
};

console.log(JSON.stringify(rollup, null, 2));
