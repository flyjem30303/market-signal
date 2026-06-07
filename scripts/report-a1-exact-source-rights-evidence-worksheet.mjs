import fs from "node:fs";

const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const outcomes = JSON.parse(fs.readFileSync(outcomePath, "utf8")).outcomes;

const slotQuestions = {
  "vendor-terms-evidence": {
    acceptableEvidence:
      "Name the reviewed source or contract label, permitted use boundary, redistribution/display limitation, and any attribution or retention condition.",
    exactQuestion: "Is there reviewed evidence that the TWII source terms allow the intended internal use and derived display path?",
    nextGateCandidate: "twii_source_rights_outcome_gate"
  },
  "internal-feed-owner-evidence": {
    acceptableEvidence: "Name the internal owner role/team label, authorization path, and unresolved owner approval gap.",
    exactQuestion: "If using an internal feed, who owns the feed and who can authorize project use?",
    nextGateCandidate: "twii_source_rights_outcome_gate"
  },
  "field-contract-evidence": {
    acceptableEvidence: "List approved field labels and any missing field, unit, timezone, adjustment, or historical-depth uncertainty.",
    exactQuestion: "Are the TWII fields needed by the model contract approved and stable enough to map?",
    nextGateCandidate: "twii_source_rights_outcome_gate"
  },
  "asset-mapping-evidence": {
    acceptableEvidence: "State the approved symbol, market, asset type, mapping owner, and any unresolved alias or historical continuity risk.",
    exactQuestion: "Is the index symbol/asset mapping approved for TWII coverage rows?",
    nextGateCandidate: "twii_source_rights_outcome_gate"
  },
  "etf-legal-use-evidence": {
    acceptableEvidence: "Name the reviewed source label, permitted use boundary, and unresolved legal-use caveat.",
    exactQuestion: "Is the ETF source legally usable for the intended Beta analysis scope?",
    nextGateCandidate: "etf_source_rights_outcome_gate"
  },
  "etf-redistribution-evidence": {
    acceptableEvidence: "State whether display, derived metrics, screenshots, caching, or public quote-like output are allowed or blocked.",
    exactQuestion: "Are redistribution and public display boundaries understood?",
    nextGateCandidate: "etf_source_rights_outcome_gate"
  },
  "etf-attribution-retention-evidence": {
    acceptableEvidence: "State attribution wording, retention period, deletion requirement, and unresolved audit requirement.",
    exactQuestion: "Are attribution and retention obligations understood?",
    nextGateCandidate: "etf_source_rights_outcome_gate"
  },
  "etf-derived-analysis-rate-limit-evidence": {
    acceptableEvidence: "State derived-analysis permission, fetch or refresh limits, and any manual review requirement.",
    exactQuestion: "Are derived analysis and rate-limit constraints understood?",
    nextGateCandidate: "etf_source_rights_outcome_gate"
  },
  "etf-field-contract-evidence": {
    acceptableEvidence: "List approved field labels and any missing unit, dividend, split, NAV, component, or timezone risk.",
    exactQuestion: "Are ETF fields approved and stable enough to map?",
    nextGateCandidate: "etf_source_rights_outcome_gate"
  },
  "etf-source-comparison-evidence": {
    acceptableEvidence:
      "Compare source labels, rights confidence, coverage, operational cost, and why one lane is preferred or still blocked.",
    exactQuestion: "Which ETF source lane is preferred among official disclosures, issuer pages, and paid vendor routes?",
    nextGateCandidate: "etf_source_rights_outcome_gate"
  }
};

const pendingSlots = outcomes
  .filter((outcome) => outcome.classification === "pending")
  .map((outcome) => {
    const detail = slotQuestions[outcome.id];
    if (!detail) {
      return {
        id: outcome.id,
        lane: outcome.lane,
        problem: "missing_slot_question"
      };
    }

    return {
      acceptableEvidence: detail.acceptableEvidence,
      exactQuestion: detail.exactQuestion,
      id: outcome.id,
      lane: outcome.lane,
      nextGateCandidate: detail.nextGateCandidate,
      requiredFields: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
      dryRunCommandTemplate: buildDryRunCommand(outcome.id, detail.nextGateCandidate)
    };
  });

const pendingByLane = groupPendingSlotsByLane(pendingSlots);
const recommendedBatch = buildRecommendedBatch(pendingByLane);

console.log(
  JSON.stringify(
    {
      mode: "a1_exact_source_rights_evidence_worksheet_handoff",
      status: pendingSlots.length === 0 ? "all_slots_filled" : "pending_fill_handoff_ready",
      worksheet: "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_WORKSHEET.md",
      outcomeData: outcomePath,
      pendingCount: pendingSlots.length,
      pendingByLane,
      recommendedBatch,
      pendingSlots,
      pmAcceptanceRule: {
        acceptedMeans: "PM may consider a separate source-rights outcome gate candidate only; this is not execution approval.",
        acceptedRequires: [
          "specific no-secret source reference label",
          "safe summary answers the exact slot question",
          "remaining risk does not hide execution, redistribution, field-contract, attribution, retention, rate-limit, asset-mapping, or public-display blockers",
          "evidence is enough for a separate outcome gate candidate, not direct execution"
        ],
        otherwiseClassifyAs: ["blocked", "rejected", "unavailable", "needs_bounded_repair"]
      },
      safety: {
        automatedRemoteRun: false,
        candidateArtifactGenerated: false,
        connectionAttempted: false,
        ingestionStarted: false,
        marketDataFetched: false,
        publicDataSource: "mock",
        rowCoverageAwarded: false,
        scoreSource: "mock",
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

function buildDryRunCommand(id, nextGateCandidate) {
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
    nextGateCandidate
  ].join(" ");
}

function quote(value) {
  return `"${value.replaceAll('"', '\\"')}"`;
}

function groupPendingSlotsByLane(slots) {
  return slots.reduce(
    (groups, slot) => {
      const lane = slot.lane ?? "UNKNOWN";
      groups[lane] = groups[lane] ?? [];
      groups[lane].push(slot.id);
      return groups;
    },
    { ETF: [], TWII: [] }
  );
}

function buildRecommendedBatch(groups) {
  if (groups.TWII.length > 0) {
    return {
      batchId: "twii_source_rights_unblock_first_batch",
      lane: "TWII",
      reason:
        "TWII is the current priority lane because it is the narrower 60-row unblock with an existing source-rights outcome gate.",
      slotIds: groups.TWII,
      nextAfterBatch: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
      executable: false
    };
  }

  if (groups.ETF.length > 0) {
    return {
      batchId: "etf_source_rights_parallel_batch",
      lane: "ETF",
      reason:
        "ETF becomes the next batch only after TWII slots are no longer pending or if PM explicitly chooses the ETF parallel option.",
      slotIds: groups.ETF,
      nextAfterBatch: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
      executable: false
    };
  }

  return {
    batchId: "no_pending_source_rights_slots",
    lane: "none",
    reason: "All exact source-rights worksheet slots are filled.",
    slotIds: [],
    nextAfterBatch: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
    executable: false
  };
}
