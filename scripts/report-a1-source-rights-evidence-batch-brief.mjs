import fs from "node:fs";

const worksheetPath = "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_WORKSHEET.md";
const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const outcomes = JSON.parse(fs.readFileSync(outcomePath, "utf8")).outcomes;

const slotBriefs = {
  "asset-mapping-evidence": {
    completionSignal:
      "A1 can name the TWII symbol, market, asset type, mapping owner, and any alias or continuity risk without exposing raw identifiers or payloads.",
    evidenceFormat:
      "sourceReferenceLabel, safeEvidenceSummary, remainingRisk",
    ownerQuestion:
      "Which approved mapping should represent TWII coverage rows?"
  },
  "field-contract-evidence": {
    completionSignal:
      "A1 can list approved field labels and unresolved unit, timezone, adjustment, or history-depth gaps without source payloads.",
    evidenceFormat:
      "sourceReferenceLabel, safeEvidenceSummary, remainingRisk",
    ownerQuestion:
      "Are the TWII fields needed by the model contract approved and stable enough to map?"
  },
  "internal-feed-owner-evidence": {
    completionSignal:
      "A1 can name the internal owner role or team label, authorization route, and unresolved approval gap without exposing people secrets or dashboards.",
    evidenceFormat:
      "sourceReferenceLabel, safeEvidenceSummary, remainingRisk",
    ownerQuestion:
      "If using an internal feed, who owns the feed and who can authorize project use?"
  },
  "vendor-terms-evidence": {
    completionSignal:
      "A1 can identify the reviewed source or contract label, permitted use boundary, redistribution/display limit, and attribution or retention condition.",
    evidenceFormat:
      "sourceReferenceLabel, safeEvidenceSummary, remainingRisk",
    ownerQuestion:
      "Do reviewed TWII source terms allow the intended internal use and derived display path?"
  }
};

const twiiPending = outcomes
  .filter((outcome) => outcome.lane === "TWII" && outcome.classification === "pending")
  .map((outcome) => {
    const brief = slotBriefs[outcome.id];
    return {
      id: outcome.id,
      lane: outcome.lane,
      currentClassification: outcome.classification,
      ownerQuestion: brief?.ownerQuestion ?? "missing_slot_brief",
      evidenceFormat: brief?.evidenceFormat ?? "sourceReferenceLabel, safeEvidenceSummary, remainingRisk",
      completionSignal: brief?.completionSignal ?? "missing_completion_signal",
      recorderDryRunTemplate: buildDryRunCommand(outcome.id),
      fallbackIfEvidenceUnsafe:
        "Record no evidence. Return a blocked or needs_bounded_repair classification candidate only after PM review; do not paste raw source text."
    };
  });

const nextMode = twiiPending.length > 0
  ? "twii_first_batch"
  : "twii_complete_review_etf_parallel_batch";

console.log(
  JSON.stringify(
    {
      mode: "a1_source_rights_evidence_batch_brief",
      status: twiiPending.length > 0
        ? "twii_batch_brief_ready_pending_no_secret_evidence"
        : "twii_batch_not_pending_review_next_lane",
      worksheet: worksheetPath,
      outcomeData: outcomePath,
      nextMode,
      batch: {
        batchId: twiiPending.length > 0
          ? "twii_source_rights_unblock_first_batch"
          : "no_twii_pending_slots",
        lane: twiiPending.length > 0 ? "TWII" : "none",
        pendingCount: twiiPending.length,
        slotIds: twiiPending.map((slot) => slot.id),
        nextAfterEvidenceReview: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
        executable: false
      },
      assignmentForA1: {
        role: "A1 Data / Supabase / Market Evidence",
        instruction:
          "Fill only no-secret evidence summaries for the listed TWII slots; do not fetch, ingest, store, or quote raw market/source payloads.",
        outputShape: [
          "evidenceSlotId",
          "sourceReferenceLabel",
          "safeEvidenceSummary",
          "remainingRisk"
        ],
        handoffToPM:
          "PM reviews each no-secret entry, then uses the dry-run recorder template before any apply classification."
      },
      slots: twiiPending,
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      safety: {
        automatedRemoteRun: false,
        candidateArtifactGenerated: false,
        connectionAttempted: false,
        evidenceRecorded: false,
        ingestionStarted: false,
        marketDataFetched: false,
        publicSourcePromoted: false,
        rawPayloadPrinted: false,
        rowCoverageAwarded: false,
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sqlExecuted: false,
        supabaseReadsEnabled: false,
        supabaseWritesEnabled: false
      },
      stillDoesNotAuthorize: [
        "source-rights approval",
        "candidate generation",
        "SQL execution",
        "Supabase reads",
        "Supabase writes",
        "staging rows",
        "daily_prices mutation",
        "market-data fetch",
        "market-data ingestion",
        "row coverage points",
        "publicDataSource=supabase",
        "scoreSource=real"
      ]
    },
    null,
    2
  )
);

function buildDryRunCommand(id) {
  return [
    "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome --",
    "--dry-run",
    "--id",
    id,
    "--classification",
    "accepted",
    "--recordedBy",
    "A1",
    "--pm-question-resolved",
    "true",
    "--safe-summary",
    quote(`${id} REPLACE_WITH_NO_SECRET_SUMMARY`),
    "--source-reference-label",
    quote(`${id}-no-secret-reference-label`),
    "--remaining-risk",
    quote(`${id} REPLACE_WITH_NO_SECRET_REMAINING_RISK`),
    "--next-gate-candidate",
    "twii_source_rights_outcome_gate"
  ].join(" ");
}

function quote(value) {
  return `"${value.replaceAll('"', '\\"')}"`;
}
