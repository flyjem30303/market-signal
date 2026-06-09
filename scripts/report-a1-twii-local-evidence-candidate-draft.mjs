import fs from "node:fs";

const requiredSlots = [
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence"
];

const evidenceLedgerPath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const sourceRightsPacketPath = "docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const fieldContractPacketPath = "docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md";
const outcomeGatePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const bridgePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE_BRIDGE.md";

const ledger = readJson(evidenceLedgerPath, { outcomes: [] });
const localEvidence = {
  sourceRightsPacket: read(sourceRightsPacketPath),
  fieldContractPacket: read(fieldContractPacketPath),
  outcomeGate: read(outcomeGatePath),
  bridge: read(bridgePath)
};
const twiiOutcomes = requiredSlots.map((slotId) =>
  ledger.outcomes?.find((outcome) => outcome.id === slotId && outcome.lane === "TWII") ?? null
);
const pendingCount = twiiOutcomes.filter((outcome) => outcome?.classification === "pending").length;
const candidateSlots = buildCandidateSlots();

const report = {
  status: "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification",
  ok: true,
  mode: "a1_twii_local_evidence_candidate_draft",
  ceoDecision: "move_a1_from_blank_waiting_to_pm_classifiable_local_no_secret_draft",
  purpose:
    "Use existing local no-secret TWII planning packets to give PM a classification-ready draft for the four A1 TWII evidence slots without recording evidence or approving source rights.",
  sourceInputs: {
    evidenceLedgerPath,
    sourceRightsPacketPath,
    fieldContractPacketPath,
    outcomeGatePath,
    bridgePath
  },
  currentLedgerState: {
    requiredSlotCount: requiredSlots.length,
    pendingCount,
    acceptedCount: twiiOutcomes.filter((outcome) => outcome?.classification === "accepted").length,
    ledgerModified: false
  },
  candidateSlots,
  pmClassificationOptions: ["accepted", "rejected", "needs_bounded_repair", "blocked"],
  pmReviewRule:
    "PM may use this draft only as a no-secret classification aid. Any real ledger change still requires a separate dry-run review and explicit apply decision.",
  recommendedNextCommands: [
    "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
    "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
    "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
    "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
  ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    candidateArtifactGenerated: false,
    connectionAttempted: false,
    deploymentAuthorized: false,
    evidenceRecorded: false,
    hostingMutated: false,
    marketDataFetched: false,
    publicSourcePromoted: false,
    rawPayloadPrinted: false,
    rowCoverageAwarded: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false
  },
  stopLines: [
    "This report does not record A1 evidence.",
    "This report does not approve source rights.",
    "This report does not generate TWII candidates.",
    "This report does not fetch, store, ingest, or commit raw market data.",
    "This report does not print secrets, raw payloads, row payloads, or stock id payloads.",
    "This report does not connect to Supabase, run SQL, write Supabase, create staging rows, or modify daily_prices.",
    "publicDataSource remains mock and scoreSource remains mock."
  ]
};

console.log(JSON.stringify(report, null, 2));

function buildCandidateSlots() {
  return [
    {
      evidenceSlotId: "vendor-terms-evidence",
      sourceReferenceLabel: "local-twii-source-rights-packets-official-exchange-index-review-only",
      safeEvidenceSummary:
        "Local packets identify official-exchange-index as the first TWII source candidate for rights and field-contract review only. The same local packets state that automated access, storage, redistribution, attribution, derived analysis, rate limits, and commercial-use terms remain unresolved.",
      remainingRisk:
        "PM cannot accept source rights from this draft alone; external or reviewed rights evidence is still required before probe, candidate generation, storage, display, or row coverage.",
      suggestedPmClassification: "needs_bounded_repair",
      reason:
        "The local source candidate is identified, but terms evidence is incomplete and must be repaired with a no-secret reviewed rights summary."
    },
    {
      evidenceSlotId: "internal-feed-owner-evidence",
      sourceReferenceLabel: "local-twii-source-rights-packets-internal-approved-feed-fallback",
      safeEvidenceSummary:
        "Local packets list internal-approved-feed as a fallback route, but no internal owner role, authorization path, or approval authority is recorded in the current evidence ledger.",
      remainingRisk:
        "The internal feed branch cannot proceed until A1 supplies a no-secret owner or authorization-path label and PM can classify whether it is sufficient.",
      suggestedPmClassification: "blocked",
      reason:
        "The owner and authorization path are not present locally, so this slot is not repairable without external/internal input."
    },
    {
      evidenceSlotId: "field-contract-evidence",
      sourceReferenceLabel: "local-twii-index-field-contract-decision-support",
      safeEvidenceSummary:
        "Local field-contract support defines a minimum TWII index daily contract around symbol TWII, asset_type index, trade_date, index_close, source_label, source_rights_status, validation_status, and aggregate-only review counts. Calendar/session, timezone, precision, optional OHLC/turnover, revision, and daily_prices mapping decisions remain unresolved.",
      remainingRisk:
        "PM can use this as a draft field-contract basis, but a separate field-contract decision is still required before any TWII candidate or daily_prices mapping.",
      suggestedPmClassification: "needs_bounded_repair",
      reason:
        "The local minimum contract is concrete enough for bounded PM repair questions, but not enough for acceptance."
    },
    {
      evidenceSlotId: "asset-mapping-evidence",
      sourceReferenceLabel: "local-twii-field-contract-asset-mapping-not-approved",
      safeEvidenceSummary:
        "Local packets consistently identify TWII as an index lane and forbid stock id payload output. They also state that mapping to an internal stock id or market asset id remains unresolved.",
      remainingRisk:
        "A safe asset mapping decision is still required before coverage rows, candidate artifacts, Supabase work, or scoring can recognize TWII rows.",
      suggestedPmClassification: "needs_bounded_repair",
      reason:
        "Symbol and asset type are locally clear, but the approved internal mapping remains unresolved."
    }
  ].map((slot) => ({
    ...slot,
    noSecret: true,
    forbiddenContentIncluded: false,
    nextGateCandidate:
      slot.suggestedPmClassification === "blocked" ? "blocked" : "needs_bounded_repair"
  }));
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}
