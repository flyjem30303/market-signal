import fs from "node:fs";

const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const batchBriefPath = "scripts/report-a1-source-rights-evidence-batch-brief.mjs";
const outcomes = JSON.parse(fs.readFileSync(outcomePath, "utf8")).outcomes;

const twiiPending = outcomes.filter((outcome) => outcome.lane === "TWII" && outcome.classification === "pending");
const twiiSlots = outcomes.filter((outcome) => outcome.lane === "TWII");
const judgementSummary = buildJudgementSummary(twiiSlots);

console.log(
  JSON.stringify(
    {
      mode: "a1_source_rights_reviewed_outcome_surface",
      status: twiiPending.length > 0
        ? "pm_reviewed_outcome_surface_ready_waiting_no_secret_evidence"
        : "pm_reviewed_outcome_surface_waiting_next_lane",
      source: {
        outcomeData: outcomePath,
        batchBrief: batchBriefPath
      },
      activeLane: twiiPending.length > 0 ? "TWII" : "none",
      pendingCount: twiiPending.length,
      judgementSummary,
      pmNarrowRequest: {
        mode: "four_slot_no_secret_reply",
        askA1For: twiiPending.map((outcome) => outcome.id),
        requiredFields: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
        copyableReplyShape: [
          "evidenceSlotId: <one TWII slot id>",
          "sourceReferenceLabel: <no-secret reviewed source label>",
          "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, or source extracts>",
          "remainingRisk: <one to two sentences; state what still blocks execution>"
        ],
        pmReviewRule:
          "Classify each slot as accepted, rejected, needs_bounded_repair, or blocked; all four accepted slots are required before a separate TWII outcome gate candidate.",
        afterA1Reply: [
          "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
          "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
          "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
          "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
          "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
          "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
        ]
      },
      pmDecisionMatrix: {
        accepted: {
          meaning:
            "PM judges the no-secret evidence summary sufficient to consider a separate TWII source-rights outcome gate.",
          pmQuestionResolved: true,
          nextGateCandidate: "twii_source_rights_outcome_gate",
          stillNotAuthorized: [
            "source-rights approval",
            "candidate generation",
            "market-data fetch",
            "market-data ingestion",
            "row coverage points",
            "publicDataSource=supabase",
            "scoreSource=real"
          ]
        },
        rejected: {
          meaning: "PM rejects the evidence because it is wrong, unsafe, or does not answer the slot question.",
          pmQuestionResolved: false,
          nextGateCandidate: "blocked",
          nextAction: "ask A1 for a replacement no-secret evidence summary"
        },
        needs_bounded_repair: {
          meaning: "PM sees a narrow missing field or ambiguity that A1 can repair without reopening broad governance.",
          pmQuestionResolved: false,
          nextGateCandidate: "needs_bounded_repair",
          nextAction: "ask A1 for the smallest missing no-secret clarification"
        },
        blocked: {
          meaning: "The evidence path is blocked by unavailable owner, rights, field, attribution, display, or mapping proof.",
          pmQuestionResolved: false,
          nextGateCandidate: "blocked",
          nextAction: "keep public Beta runtime mock-visible and switch to another safe lane"
        }
      },
      reviewedOutcomeSlots: twiiPending.map((outcome) => ({
        id: outcome.id,
        lane: outcome.lane,
        currentClassification: outcome.classification,
        dryRunCommands: {
          accepted: buildCommand(outcome.id, "accepted", true, "twii_source_rights_outcome_gate"),
          rejected: buildCommand(outcome.id, "rejected", false, "blocked"),
          needs_bounded_repair: buildCommand(outcome.id, "needs_bounded_repair", false, "needs_bounded_repair"),
          blocked: buildCommand(outcome.id, "blocked", false, "blocked")
        }
      })),
      nextAfterAnyDryRun: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
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

function buildJudgementSummary(slots) {
  const counts = {
    accepted: slots.filter((slot) => slot.classification === "accepted" && slot.pmQuestionResolved === true).length,
    blocked: slots.filter((slot) => ["blocked", "rejected", "unavailable"].includes(slot.classification)).length,
    needs_bounded_repair: slots.filter((slot) => slot.classification === "needs_bounded_repair").length,
    pending: slots.filter((slot) => slot.classification === "pending").length
  };
  const canOpenOutcomeGate =
    counts.accepted === slots.length &&
    counts.pending === 0 &&
    counts.needs_bounded_repair === 0 &&
    counts.blocked === 0;

  return {
    canOpenOutcomeGate,
    counts,
    nextPmAction: canOpenOutcomeGate
      ? "open_separate_twii_source_rights_outcome_gate_candidate"
      : "wait_for_a1_four_slot_no_secret_evidence_then_dry_run_pm_classification",
    slots: slots.map((slot) => ({
      id: slot.id,
      currentDecision: classifyCurrentDecision(slot),
      currentClassification: slot.classification,
      pmQuestionResolved: slot.pmQuestionResolved === true,
      nextAction: nextActionForSlot(slot),
      remainingRisk: slot.remainingRisk
    }))
  };
}

function classifyCurrentDecision(slot) {
  if (slot.classification === "accepted" && slot.pmQuestionResolved === true) return "accepted";
  if (slot.classification === "needs_bounded_repair") return "needs_bounded_repair";
  if (["blocked", "rejected", "unavailable"].includes(slot.classification)) return "blocked";
  return "pending_a1_evidence";
}

function nextActionForSlot(slot) {
  if (slot.classification === "accepted" && slot.pmQuestionResolved === true) {
    return "hold_until_all_twii_slots_are_accepted";
  }
  if (slot.classification === "needs_bounded_repair") {
    return "ask_a1_for_smallest_missing_no_secret_clarification";
  }
  if (["blocked", "rejected", "unavailable"].includes(slot.classification)) {
    return "keep_twii_outcome_gate_blocked_or_choose_another_safe_lane";
  }
  return "ask_a1_to_return_evidenceSlotId_sourceReferenceLabel_safeEvidenceSummary_remainingRisk";
}

function buildCommand(id, classification, pmQuestionResolved, nextGateCandidate) {
  return [
    "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome --",
    "--dry-run",
    "--id",
    id,
    "--classification",
    classification,
    "--recordedBy",
    "PM",
    "--pm-question-resolved",
    String(pmQuestionResolved),
    "--safe-summary",
    quote(`${id} REPLACE_WITH_PM_REVIEWED_NO_SECRET_SUMMARY`),
    "--source-reference-label",
    quote(`${id}-reviewed-no-secret-reference-label`),
    "--remaining-risk",
    quote(`${id} REPLACE_WITH_PM_REVIEWED_REMAINING_RISK`),
    "--next-gate-candidate",
    nextGateCandidate
  ].join(" ");
}

function quote(value) {
  return `"${value.replaceAll('"', '\\"')}"`;
}
