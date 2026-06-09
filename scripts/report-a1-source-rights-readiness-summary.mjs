import fs from "node:fs";

const defaultOutcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const outcomePath = process.env.A1_TWII_EVIDENCE_COMPLETION_OUTCOME_PATH || defaultOutcomePath;
const docPath = "docs/A1_SOURCE_RIGHTS_READINESS_SUMMARY.md";
const outcomes = readOutcomes(outcomePath);

const laneDefinitions = {
  ETF: {
    requiredIds: [
      "etf-legal-use-evidence",
      "etf-redistribution-evidence",
      "etf-attribution-retention-evidence",
      "etf-derived-analysis-rate-limit-evidence",
      "etf-field-contract-evidence",
      "etf-source-comparison-evidence"
    ],
    outcomeGate: "etf_source_rights_outcome_gate",
    readyCommand: "cmd.exe /c npm run report:a1-source-rights-next-action"
  },
  TWII: {
    requiredIds: [
      "vendor-terms-evidence",
      "internal-feed-owner-evidence",
      "field-contract-evidence",
      "asset-mapping-evidence"
    ],
    outcomeGate: "twii_source_rights_outcome_gate",
    readyCommand: "cmd.exe /c npm run report:a1-source-rights-next-action"
  }
};

const lanes = Object.fromEntries(
  Object.entries(laneDefinitions).map(([lane, definition]) => [
    lane,
    summarizeLane(lane, definition, outcomes)
  ])
);
const readyLanes = Object.entries(lanes)
  .filter(([, lane]) => lane.canOpenOutcomeGate)
  .map(([lane]) => lane);
const blockedLanes = Object.entries(lanes)
  .filter(([, lane]) => !lane.canOpenOutcomeGate)
  .map(([lane]) => lane);

const status =
  readyLanes.length > 0
    ? "ready_for_separate_source_rights_outcome_gate_candidate"
    : "blocked_waiting_a1_exact_source_rights_evidence";

console.log(
  JSON.stringify(
    {
      mode: "a1_source_rights_readiness_summary",
      status,
      ok: true,
      doc: docPath,
      outcomeData: outcomePath,
      pmDecision: readyLanes.length > 0
        ? "open_only_the_ready_lane_as_a_separate_source_rights_outcome_gate_candidate"
        : "keep_a1_on_twii_four_slot_no_secret_evidence_request_until_a_lane_is_complete",
      nextCommand: readyLanes.length > 0
        ? "cmd.exe /c npm run report:a1-source-rights-next-action"
        : "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
      readyLanes,
      blockedLanes,
      lanes,
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      safety: {
        automatedRemoteRun: false,
        candidateArtifactGenerated: false,
        connectionAttempted: false,
        ingestionStarted: false,
        marketDataFetched: false,
        publicSourcePromoted: false,
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

function summarizeLane(lane, definition, allOutcomes) {
  const outcomesById = new Map(allOutcomes.map((outcome) => [outcome.id, outcome]));
  const requiredOutcomes = definition.requiredIds.map((id) => outcomesById.get(id)).filter(Boolean);
  const acceptedIds = requiredOutcomes
    .filter((outcome) => outcome.classification === "accepted" && outcome.pmQuestionResolved === true)
    .map((outcome) => outcome.id);
  const repairIds = requiredOutcomes
    .filter((outcome) => outcome.classification === "needs_bounded_repair")
    .map((outcome) => outcome.id);
  const hardBlockedIds = requiredOutcomes
    .filter((outcome) => ["blocked", "rejected", "unavailable"].includes(outcome.classification))
    .map((outcome) => outcome.id);
  const pendingIds = definition.requiredIds.filter((id) => !acceptedIds.includes(id));
  const missingIds = definition.requiredIds.filter((id) => !outcomesById.has(id));
  const canOpenOutcomeGate =
    missingIds.length === 0 &&
    acceptedIds.length === definition.requiredIds.length &&
    repairIds.length === 0 &&
    hardBlockedIds.length === 0;

  return {
    status: canOpenOutcomeGate
      ? "ready_for_separate_source_rights_outcome_gate_candidate"
      : hardBlockedIds.length > 0
        ? "blocked_by_rejected_unavailable_or_blocked_evidence"
        : repairIds.length > 0
          ? "needs_bounded_repair_before_outcome_gate"
          : "awaiting_exact_source_rights_evidence",
    acceptedCount: acceptedIds.length,
    canOpenOutcomeGate,
    hardBlockedIds,
    missingIds,
    nextCommand: canOpenOutcomeGate
      ? definition.readyCommand
      : lane === "TWII"
        ? "cmd.exe /c npm run report:a1-twii-four-slot-reply-request"
        : "cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet",
    outcomeGateCandidate: canOpenOutcomeGate ? definition.outcomeGate : "blocked",
    pendingCount: pendingIds.length,
    pendingIds,
    repairIds,
    requiredCount: definition.requiredIds.length,
    requiredIds: definition.requiredIds
  };
}

function readOutcomes(filePath) {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(parsed.outcomes)) throw new Error("Outcome file must include outcomes array");
  return parsed.outcomes;
}
