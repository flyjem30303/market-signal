import { spawnSync } from "node:child_process";

const commands = {
  boundedRepair: "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
  classificationRoute: "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
  completionStatus: "cmd.exe /c npm run report:a1-twii-evidence-completion-status",
  fourSlotReply: "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
  postReplyRunner: "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
  readinessSummary: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
  responseShapeGuard: "cmd.exe /c npm run check:a1-twii-evidence-response-shape"
};

const boundedRepair = runJson(commands.boundedRepair);
const classificationRoute = runJson(commands.classificationRoute);
const completionStatus = runJson(commands.completionStatus);
const fourSlotReply = runJson(commands.fourSlotReply);
const readinessSummary = runJson(commands.readinessSummary);

const repairRequests = Array.isArray(boundedRepair.json?.repairRequests)
  ? boundedRepair.json.repairRequests
  : [];
const pendingSlotIds = Array.isArray(fourSlotReply.json?.requestForA1?.pendingSlotIds)
  ? fourSlotReply.json.requestForA1.pendingSlotIds
  : ["vendor-terms-evidence", "internal-feed-owner-evidence", "field-contract-evidence", "asset-mapping-evidence"];
const acceptedCount = Number(completionStatus.json?.counts?.accepted ?? 0);
const pendingCount = Number(completionStatus.json?.counts?.pending ?? pendingSlotIds.length);
const canOpenTwiiOutcomeGate = readinessSummary.json?.lanes?.TWII?.canOpenOutcomeGate === true;
const allFourAccepted = acceptedCount === 4 && pendingCount === 0 && canOpenTwiiOutcomeGate;
const status = allFourAccepted
  ? "a1_twii_pm_intake_ready_for_separate_outcome_gate_candidate"
  : "a1_twii_pm_intake_decision_summary_ready_waiting_bounded_repairs";

const report = {
  status,
  ok: true,
  mode: "a1_twii_pm_intake_decision_summary",
  ceoDecision: "compress_a1_twii_evidence_intake_to_one_pm_decision_summary",
  purpose:
    "Give PM one no-secret view of the A1 TWII evidence lane: what is pending, what A1 should repair, how PM may classify after reply, and what remains forbidden.",
  currentDecision: allFourAccepted
    ? "open_separate_twii_source_rights_outcome_gate_candidate"
    : "request_a1_bounded_no_secret_repairs_before_pm_classification",
  currentState: {
    acceptedCount,
    canOpenTwiiOutcomeGate,
    pendingCount,
    pendingSlotIds,
    readyLanes: Array.isArray(readinessSummary.json?.readyLanes) ? readinessSummary.json.readyLanes : [],
    blockedLanes: Array.isArray(readinessSummary.json?.blockedLanes) ? readinessSummary.json.blockedLanes : []
  },
  boundedRepairIntake: {
    status: boundedRepair.json?.status ?? "unavailable",
    command: commands.boundedRepair,
    repairRequestCount: repairRequests.length,
    repairRequests: repairRequests.map((request) => ({
      evidenceSlotId: request.evidenceSlotId,
      currentDraftClassification: request.currentDraftClassification,
      requestedSourceReferenceLabel: request.requestedSourceReferenceLabel,
      requestedSafeEvidenceSummary: request.requestedSafeEvidenceSummary,
      requestedRemainingRisk: request.requestedRemainingRisk
    })),
    copyableA1Request: Array.isArray(boundedRepair.json?.copyableA1Request)
      ? boundedRepair.json.copyableA1Request
      : []
  },
  pmClassificationAfterA1Reply: {
    status: classificationRoute.json?.status ?? "unavailable",
    firstCommand: commands.responseShapeGuard,
    oneRunnerCommand: commands.postReplyRunner,
    classificationOptions:
      classificationRoute.json?.pmSingleClassificationChecklist?.classificationOptions ??
      ["accepted", "rejected", "needs_bounded_repair", "blocked"],
    requiredPerSlot:
      classificationRoute.json?.pmSingleClassificationChecklist?.requiredPerSlot ??
      ["classification", "pmQuestionResolved", "safeSummary", "sourceReferenceLabel", "remainingRisk", "nextGateCandidate"],
    dryRunPreviewCount: Array.isArray(classificationRoute.json?.dryRunCommandPreviews)
      ? classificationRoute.json.dryRunCommandPreviews.length
      : 0,
    afterAnyDryRunCommand: commands.readinessSummary,
    completionRule:
      "All four TWII slots must be accepted in a separate reviewed step before PM may consider the TWII source-rights outcome gate."
  },
  postReplyOneRunnerProof: {
    status: "focused_gate_registered_lightweight_proof_summary",
    focusedGateName: "a1-twii-post-reply-pm-classification-once",
    proofCommand: "cmd.exe /c npm run check:a1-twii-post-reply-pm-classification-once",
    routineRunnerCommand: commands.postReplyRunner,
    currentPendingScenario: {
      expectedStatus: "blocked_waiting_a1_twii_four_slot_no_secret_evidence",
      expectedStepIds: ["external-input-response-readiness"],
      expectedNextCommand: commands.fourSlotReply
    },
    acceptedFixtureScenario: {
      expectedStatus: "a1_twii_post_reply_chain_ready_for_outcome_gate_candidate",
      expectedStepIds: [
        "external-input-response-readiness",
        "a1-no-secret-shape-guard",
        "a1-pm-classification-route",
        "a1-reviewed-outcome-surface",
        "a1-source-rights-readiness-summary"
      ],
      expectedNextCommand: "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route"
    },
    ledgerModified: false,
    valuesAreFixtureOnly: true,
    safety: {
      applyCommandEmitted: false,
      candidateArtifactGenerated: false,
      deploymentAuthorized: false,
      evidenceRecorded: false,
      marketDataFetched: false,
      rowCoverageAwarded: false,
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sourceRightsApproved: false,
      sqlExecuted: false,
      supabaseReadsEnabled: false,
      supabaseWritesEnabled: false
    },
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    }
  },
  nextCommands: allFourAccepted
    ? [
      "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route",
      commands.readinessSummary
    ]
    : [
      commands.boundedRepair,
      commands.fourSlotReply,
      commands.postReplyRunner,
      commands.readinessSummary
    ],
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  safety: {
    applyCommandEmitted: false,
    candidateArtifactGenerated: false,
    connectionAttempted: false,
    deploymentAuthorized: false,
    evidenceRecorded: false,
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
    "This summary does not record A1 evidence.",
    "This summary does not approve source rights.",
    "This summary does not generate TWII candidates.",
    "This summary does not fetch, store, ingest, or commit raw market data.",
    "This summary does not connect to Supabase, run SQL, write Supabase, create staging rows, or modify daily_prices.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  sourceReports: {
    boundedRepair: commandStatus(boundedRepair),
    classificationRoute: commandStatus(classificationRoute),
    completionStatus: commandStatus(completionStatus),
    fourSlotReply: commandStatus(fourSlotReply),
    readinessSummary: commandStatus(readinessSummary)
  }
};

console.log(JSON.stringify(report, null, 2));

function runJson(command) {
  const parts = command.split(" ");
  const result = spawnSync(parts[0], parts.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 240000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderr: (result.stderr ?? "").trim()
  };
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}

function commandStatus(run) {
  return {
    exitCode: run.exitCode,
    parsedJson: Boolean(run.json),
    stderrPrinted: run.stderr.length > 0
  };
}
