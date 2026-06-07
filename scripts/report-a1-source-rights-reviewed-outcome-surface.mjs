import fs from "node:fs";

const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const batchBriefPath = "scripts/report-a1-source-rights-evidence-batch-brief.mjs";
const outcomes = JSON.parse(fs.readFileSync(outcomePath, "utf8")).outcomes;

const twiiPending = outcomes.filter((outcome) => outcome.lane === "TWII" && outcome.classification === "pending");

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
