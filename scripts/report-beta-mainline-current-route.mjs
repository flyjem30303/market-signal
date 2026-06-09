import { spawnSync } from "node:child_process";
import { buildPublicBetaGoalReadinessRollup } from "./lib/public-beta-goal-readiness-rollup.mjs";

const beta = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-platform-unblock-kit"]);
const betaLaunchNextAction = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-launch-next-action"]);
const a1 = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-source-rights-next-action"]);
const a1Readiness = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-source-rights-readiness-summary"]);
const a1Worksheet = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-exact-source-rights-evidence-worksheet"]);
const a1MiniPacket = runJson(["cmd.exe", "/c", "npm", "run", "check:a1-twii-evidence-intake-mini-packet"]);
const a1BatchBrief = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-source-rights-evidence-batch-brief"]);
const a1ReplyRequest = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-four-slot-reply-request"]);
const a1CompletionStatus = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-evidence-completion-status"]);
const a1ClassificationRoute = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-evidence-pm-classification-route"]);
const a1PmIntakeDecisionSummary = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-pm-intake-decision-summary"]);
const a1ReviewedOutcomeSurface = runJson([
  "cmd.exe",
  "/c",
  "npm",
  "run",
  "report:a1-source-rights-reviewed-outcome-surface"
]);
const a2 = runJson(["cmd.exe", "/c", "npm", "run", "report:a2-public-copy-readability-candidates"]);
const runtimeFastHealth = runJson(["cmd.exe", "/c", "npm", "run", "check:beta-runtime-fast-health"]);
const coreRouteQuickProof = runJson(["cmd.exe", "/c", "npm", "run", "check:public-beta-core-route-quick-proof"]);
const mockLaunchProofBundle = runJson(["cmd.exe", "/c", "npm", "run", "report:public-beta-mock-launch-proof-bundle"]);
const shouldSkipRemainingBlockers = process.env.BETA_LAUNCH_REMAINING_BLOCKERS_CALL === "1";
const betaLaunchRemainingBlockers = shouldSkipRemainingBlockers
  ? {
    exitCode: 0,
    json: null,
    skippedToAvoidCircularReportCall: true,
    stderr: "",
    stdout: ""
  }
  : runJson(["cmd.exe", "/c", "npm", "run", "report:beta-launch-remaining-blockers"]);
const pmWorktreeReview = runJson(["cmd.exe", "/c", "npm", "run", "report:pm-worktree-review-preflight"]);

const betaReport = beta.json ?? {};
const betaLaunchNextActionReport = betaLaunchNextAction.json ?? {};
const a1Report = a1.json ?? {};
const a1ReadinessReport = a1Readiness.json ?? {};
const a1WorksheetReport = a1Worksheet.json ?? {};
const a1MiniPacketReport = a1MiniPacket.json ?? {};
const a1BatchBriefReport = a1BatchBrief.json ?? {};
const a1ReplyRequestReport = a1ReplyRequest.json ?? {};
const a1CompletionStatusReport = a1CompletionStatus.json ?? {};
const a1ClassificationRouteReport = a1ClassificationRoute.json ?? {};
const a1PmIntakeDecisionSummaryReport = a1PmIntakeDecisionSummary.json ?? {};
const a1ReviewedOutcomeSurfaceReport = a1ReviewedOutcomeSurface.json ?? {};
const a2Report = a2.json ?? {};
const runtimeFastHealthReport = runtimeFastHealth.json ?? {};
const coreRouteQuickProofReport = coreRouteQuickProof.json ?? {};
const mockLaunchProofBundleReport = mockLaunchProofBundle.json ?? {};
const betaLaunchRemainingBlockersReport = betaLaunchRemainingBlockers.json ?? {};
const pmWorktreeReviewReport = pmWorktreeReview.json ?? {};
const externalInputCopyPacketCommand = "cmd.exe /c npm run report:public-beta-external-input-copy-packet";
const externalInputFullRequestCommand = "cmd.exe /c npm run report:public-beta-external-input-request";
const externalA1ReplyPmClassificationPreviewCommand =
  "cmd.exe /c npm run report:public-beta-a1-reply-pm-classification-preview";
const externalReplyFileTemplateCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-template";
const externalReplyIntakeDryRunCommand = "cmd.exe /c npm run report:public-beta-external-reply-intake-dry-run";
const externalReplyFileRouteCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";
const externalReplyFileWorkflowProofCommand = "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof";

const platformStatus = betaReport.platformValues?.status ?? "unknown";
const acceptedArtifactExists = Boolean(betaReport.reviewedArtifact?.acceptedArtifactExists);
const betaStatus = betaReport.status ?? "unknown";
const a1FourSlotEvidencePending = Number(a1CompletionStatusReport.counts?.pending ?? 4) > 0;
const mainlineRoute = chooseMainlineRoute({
  acceptedArtifactExists,
  a1FourSlotEvidencePending,
  betaStatus,
  platformStatus
});
const exactLedger = a1Report.currentState?.exactLedger ?? {};
const a2Summary = a2Report.summary ?? {};
const worktreeSummary = buildWorktreeSafeguardSummary(pmWorktreeReviewReport);
const a1FourSlotReplyRequestCommand = "cmd.exe /c npm run report:a1-twii-four-slot-reply-request";

const report = {
  status: mainlineRoute.status,
  ok: true,
  ceoDecision: "keep_beta_mainline_moving_with_a1_a2_parallel_routes",
  pmRouteRouter: buildPmRouteRouter(betaLaunchNextActionReport),
  pmMainline: {
    currentRoute: mainlineRoute.currentRoute,
    nextAction: mainlineRoute.nextAction,
    nextCommand: mainlineRoute.nextCommand,
    afterCurrentCommand: mainlineRoute.afterCurrentCommand
  },
  externalInputRequest: buildExternalInputRequestSummary(betaReport, a1ReplyRequestReport),
  pmDefaultWhenBlocked: buildPmDefaultWhenBlocked(mainlineRoute.status),
  platformValues: {
    missingValues: Array.isArray(betaReport.platformValues?.missingValues)
      ? betaReport.platformValues.missingValues
      : [],
    status: platformStatus,
    hostingProjectNameProvided: Boolean(betaReport.platformValues?.hostingProjectNameProvided),
    temporaryBetaUrlProvided: Boolean(betaReport.platformValues?.temporaryBetaUrlProvided),
    valuesAreNotPrinted: betaReport.platformValues?.valuesAreNotPrinted === true
  },
  platformOperatorHandoff: {
    mode: betaReport.operatorHandoff?.mode ?? "placeholder_only_no_values_printed",
    replyTemplate: Array.isArray(betaReport.operatorHandoff?.replyTemplate)
      ? betaReport.operatorHandoff.replyTemplate
      : [
        "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
        "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
      ],
    safeShapeReminder: Array.isArray(betaReport.operatorHandoff?.safeShapeReminder)
      ? betaReport.operatorHandoff.safeShapeReminder
      : [],
    nextResponseReadinessCommand:
      betaReport.operatorHandoff?.nextResponseReadinessCommand ??
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    postReplyOnceRunnerCommand: "cmd.exe /c npm run run:public-beta-post-reply-route-once",
    afterValuesCommand: "cmd.exe /c npm run run:public-beta-post-reply-route-once",
    diagnosticValidationCommand:
      betaReport.proofReadiness?.diagnosticValidationCommand ?? "cmd.exe /c npm run validate:beta-platform-two-values",
    afterProofMapCommand:
      betaReport.pmMainline?.afterProofMapCommand ??
      "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\"",
    valuesAreNotStoredInRepo: betaReport.operatorHandoff?.valuesAreNotStoredInRepo === true
  },
  proofReadiness: {
    repoProofStatus: betaReport.proofReadiness?.repoProofStatus ?? "unknown",
    packetCandidateAllowed: Boolean(betaReport.proofReadiness?.packetCandidateAllowed),
    blocker: betaReport.proofReadiness?.blocker ?? null,
    worktreeState: betaReport.proofReadiness?.worktreeState ?? null,
    currentCommit: betaReport.proofReadiness?.currentCommit ?? null
  },
  reviewedArtifact: betaReport.reviewedArtifact ?? {
    acceptedArtifactExists: false,
    latestAcceptedArtifactPath: null
  },
  runtimeHealth: {
    status: runtimeFastHealthReport.status ?? "unknown",
    guardedStatus: runtimeFastHealthReport.guardedStatus ?? "unknown",
    outcome: runtimeFastHealthReport.outcome ?? "unknown",
    baseUrl: runtimeFastHealthReport.baseUrl ?? "http://localhost:3000",
    routeCount: Array.isArray(runtimeFastHealthReport.checkedRoutes)
      ? runtimeFastHealthReport.checkedRoutes.length
      : 0,
    allRoutesHttp200: Array.isArray(runtimeFastHealthReport.checkedRoutes)
      ? runtimeFastHealthReport.checkedRoutes.every((route) => route.statusCode === 200)
      : false,
    checkedRoutes: Array.isArray(runtimeFastHealthReport.checkedRoutes)
      ? runtimeFastHealthReport.checkedRoutes.map((route) => ({
        route: route.route,
        statusCode: route.statusCode
      }))
      : [],
    runtimeBoundary: {
      publicDataSource: runtimeFastHealthReport.runtimeBoundary?.publicDataSource ?? "mock",
      scoreSource: runtimeFastHealthReport.runtimeBoundary?.scoreSource ?? "mock"
    }
  },
  coreRouteQuickProof: {
    status: coreRouteQuickProofReport.status ?? "unknown",
    baseUrl: coreRouteQuickProofReport.checked?.baseUrl ?? "http://localhost:3000",
    routeCount: Array.isArray(coreRouteQuickProofReport.checked?.routes)
      ? coreRouteQuickProofReport.checked.routes.length
      : 0,
    allRoutesHttp200: Array.isArray(coreRouteQuickProofReport.checked?.routes)
      ? coreRouteQuickProofReport.checked.routes.every((route) => route.statusCode === 200)
      : false,
    fileContractCount: Number(coreRouteQuickProofReport.checked?.files ?? 0),
    missingCount: Array.isArray(coreRouteQuickProofReport.missing) ? coreRouteQuickProofReport.missing.length : 0,
    blockedCount: Array.isArray(coreRouteQuickProofReport.blocked) ? coreRouteQuickProofReport.blocked.length : 0,
    runtimeBoundary: {
      publicDataSource: coreRouteQuickProofReport.runtimeBoundary?.publicDataSource ?? "mock",
      scoreSource: coreRouteQuickProofReport.runtimeBoundary?.scoreSource ?? "mock"
    }
  },
  mockLaunchProofBundle: {
    status: mockLaunchProofBundleReport.status ?? "unknown",
    ok: mockLaunchProofBundleReport.ok === true,
    checkedCount: Number(mockLaunchProofBundleReport.localProof?.checkedCount ?? 0),
    allRequiredChecksPassed: mockLaunchProofBundleReport.localProof?.allRequiredChecksPassed === true,
    remainingHardBlockers: Number(mockLaunchProofBundleReport.remainingHardBlockers?.count ?? 2),
    nextExecutableStep: mockLaunchProofBundleReport.nextExecutableStep ?? {
      lane: "external_input_request",
      command: "cmd.exe /c npm run report:public-beta-external-input-request",
      reason: "Fallback route: keep the public Beta mainline on the single external-input request."
    },
    nextAction:
      mockLaunchProofBundleReport.nextAction ??
      "use_single_external_input_request_then_response_readiness",
    nextCommands: Array.isArray(mockLaunchProofBundleReport.nextCommands)
      ? mockLaunchProofBundleReport.nextCommands
      : [
        "cmd.exe /c npm run report:public-beta-external-input-request",
        "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
        "cmd.exe /c npm run report:beta-mainline-current-route"
      ],
    runtimeBoundary: {
      publicDataSource: mockLaunchProofBundleReport.runtimeBoundary?.publicDataSource ?? "mock",
      scoreSource: mockLaunchProofBundleReport.runtimeBoundary?.scoreSource ?? "mock"
    }
  },
  remainingBlockers: {
    status: shouldSkipRemainingBlockers
      ? "skipped_to_avoid_circular_report_call"
      : betaLaunchRemainingBlockersReport.status ?? "unknown",
    blockerCount: Number(betaLaunchRemainingBlockersReport.summary?.blockerCount ?? 2),
    nextBestAction:
      betaLaunchRemainingBlockersReport.summary?.nextBestAction ??
      "collect_beta_platform_values_and_a1_twii_four_slot_no_secret_evidence",
    blockers: Array.isArray(betaLaunchRemainingBlockersReport.blockers)
      ? betaLaunchRemainingBlockersReport.blockers.map((blocker) => ({
        id: blocker.id,
        status: blocker.status,
        nextCommand: blocker.nextCommand,
        requiredInput: blocker.requiredInput
      }))
      : [],
    a1PmIntakeDecisionSummary: betaLaunchRemainingBlockersReport.a1PmIntakeDecisionSummary ?? {
      status: "unknown",
      currentDecision: "request_a1_bounded_no_secret_repairs_before_pm_classification",
      pendingCount: 4,
      repairRequestCount: 4
    },
    postReplyOneRunnerProof: betaLaunchRemainingBlockersReport.postReplyOneRunnerProof ?? {
      status: "focused_gate_registered_lightweight_proof_summary",
      focusedGateName: "public-beta-post-reply-route-once",
      proofCommand: "cmd.exe /c npm run check:public-beta-post-reply-route-once",
      routineRunnerCommand: "cmd.exe /c npm run run:public-beta-post-reply-route-once",
      safePlatformFixtureScenario: {
        expectedStatus: "public_beta_post_reply_route_ready_for_packet_review_a1_pending",
        expectedPacketReviewCommand:
          "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run"
      },
      valuesAreFixtureOnly: true,
      ledgerModified: false
    },
    runtimeBoundary: {
      publicDataSource: betaLaunchRemainingBlockersReport.runtimeReadyEvidence?.publicDataSource ?? "mock",
      scoreSource: betaLaunchRemainingBlockersReport.runtimeReadyEvidence?.scoreSource ?? "mock"
    }
  },
  pmWorktreeReview: {
    status: pmWorktreeReviewReport.status ?? "unknown",
    nextRoute: worktreeSummary.nextRoute,
    packetCandidateAllowed: worktreeSummary.packetCandidateAllowed,
    recommendedPmOutcome: worktreeSummary.recommendedPmOutcome,
    canProceedToBackupDecision: worktreeSummary.canProceedToBackupDecision,
    safeguardReady: worktreeSummary.safeguardReady,
    hardBlocker: worktreeSummary.hardBlocker,
    packetCandidateBlocker: worktreeSummary.packetCandidateBlocker,
    worktreeState: pmWorktreeReviewReport.worktree?.worktreeState ?? "unknown",
    totalChangedFiles: Number(pmWorktreeReviewReport.worktree?.totalChangedFiles ?? 0),
    modifiedCount: Number(pmWorktreeReviewReport.worktree?.modifiedCount ?? 0),
    untrackedCount: Number(pmWorktreeReviewReport.worktree?.untrackedCount ?? 0),
    groupCounts: {
      a1DataEvidenceSupport: pmWorktreeReviewReport.groups?.a1DataEvidenceSupport?.length ?? 0,
      betaDeploymentAndPacketChain: pmWorktreeReviewReport.groups?.betaDeploymentAndPacketChain?.length ?? 0,
      excludedFromBetaLaunchPacket: pmWorktreeReviewReport.groups?.excludedFromBetaLaunchPacket?.length ?? 0,
      projectStatusAndTooling: pmWorktreeReviewReport.groups?.projectStatusAndTooling?.length ?? 0,
      publicRuntimeAndTrustSurface: pmWorktreeReviewReport.groups?.publicRuntimeAndTrustSurface?.length ?? 0,
      unrelatedOrNeedsPmDecision: pmWorktreeReviewReport.groups?.unrelatedOrNeedsPmDecision?.length ?? 0
    },
    runtimeBoundary: {
      publicDataSource: pmWorktreeReviewReport.runtimeBoundary?.publicDataSource ?? "mock",
      scoreSource: pmWorktreeReviewReport.runtimeBoundary?.scoreSource ?? "mock"
    }
  },
  parallelRoutes: {
    a1: {
      status: a1Report.status ?? "unknown",
      nextAction: "collect_a1_twii_four_slot_no_secret_evidence",
      nextCommand:
        a1FourSlotReplyRequestCommand,
      priorityDecision: a1Report.priorityDecision ?? {
        source: "docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md",
        route: "twii_source_rights_unblock_first_etf_parallel_rights_option",
        nextAssignment: "twii_source_rights_unblock_decision_record_candidate",
        firstLane: "TWII",
        parallelLane: "ETF",
        executable: false
      },
      exactLedger: {
        status: exactLedger.status ?? "unknown",
        twiiPendingCount: Number(exactLedger.twiiPendingCount ?? 0),
        twiiRequiredCount: Number(exactLedger.twiiRequiredCount ?? 0),
        canOpenTwiiOutcomeGate: Boolean(exactLedger.canOpenTwiiOutcomeGate),
        etfPendingCount: Number(exactLedger.etfPendingCount ?? 0),
        etfRequiredCount: Number(exactLedger.etfRequiredCount ?? 0),
        canOpenEtfOutcomeGate: Boolean(exactLedger.canOpenEtfOutcomeGate)
      },
      readiness: {
        status: a1ReadinessReport.status ?? "unknown",
        nextCommand:
          a1FourSlotReplyRequestCommand,
        readyLanes: Array.isArray(a1ReadinessReport.readyLanes) ? a1ReadinessReport.readyLanes : [],
        blockedLanes: Array.isArray(a1ReadinessReport.blockedLanes) ? a1ReadinessReport.blockedLanes : [],
        twiiCanOpenOutcomeGate: Boolean(a1ReadinessReport.lanes?.TWII?.canOpenOutcomeGate),
        twiiPendingCount: Number(a1ReadinessReport.lanes?.TWII?.pendingCount ?? 0),
        etfCanOpenOutcomeGate: Boolean(a1ReadinessReport.lanes?.ETF?.canOpenOutcomeGate),
        etfPendingCount: Number(a1ReadinessReport.lanes?.ETF?.pendingCount ?? 0)
      },
      worksheetBatch: {
        worksheet: a1WorksheetReport.worksheet ?? "docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_WORKSHEET.md",
        pendingCount: Number(a1WorksheetReport.pendingCount ?? 0),
        pendingByLane: {
          TWII: Array.isArray(a1WorksheetReport.pendingByLane?.TWII)
            ? a1WorksheetReport.pendingByLane.TWII
            : [],
          ETF: Array.isArray(a1WorksheetReport.pendingByLane?.ETF)
            ? a1WorksheetReport.pendingByLane.ETF
            : []
        },
        recommendedBatch: a1WorksheetReport.recommendedBatch ?? {
          batchId: "twii_source_rights_unblock_first_batch",
          lane: "TWII",
          slotIds: [],
          nextAfterBatch: "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
          executable: false
        }
      },
      miniPacket: {
        status: a1MiniPacketReport.status ?? "unknown",
        guardedStatus: a1MiniPacketReport.guardedStatus ?? "unknown",
        handoff: "A1 fills only the four TWII evidence slots before PM reruns readiness.",
        pmIntakeShortcut: a1MiniPacketReport.pmIntakeShortcut ?? {
          mode: "ninety_second_pm_intake",
          fields: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
          dryRunRecorderCommand:
            "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome -- --dry-run --id <slot-id> --classification accepted --recordedBy PM --pm-question-resolved true --safe-summary \"<safe summary>\" --source-reference-label \"<safe label>\" --remaining-risk \"<remaining risk>\" --next-gate-candidate twii_source_rights_outcome_gate",
          afterReviewCommands: [
            "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
            "cmd.exe /c npm run report:a1-source-rights-next-action"
          ]
        },
        packet: "docs/A1_TWII_EVIDENCE_INTAKE_MINI_PACKET.md",
        twiiPendingSlots: Array.isArray(a1MiniPacketReport.twiiPendingSlots) ? a1MiniPacketReport.twiiPendingSlots : [],
        nextCommand:
          a1FourSlotReplyRequestCommand,
        publicDataSource: a1MiniPacketReport.publicDataSource ?? "mock",
        scoreSource: a1MiniPacketReport.scoreSource ?? "mock",
        executable: false
      },
      batchBrief: {
        status: a1BatchBriefReport.status ?? "unknown",
        nextMode: a1BatchBriefReport.nextMode ?? "unknown",
        batchId: a1BatchBriefReport.batch?.batchId ?? "unknown",
        lane: a1BatchBriefReport.batch?.lane ?? "unknown",
        pendingCount: Number(a1BatchBriefReport.batch?.pendingCount ?? 0),
        slotIds: Array.isArray(a1BatchBriefReport.batch?.slotIds) ? a1BatchBriefReport.batch.slotIds : [],
        nextAfterEvidenceReview:
          a1BatchBriefReport.batch?.nextAfterEvidenceReview ??
          "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
        executable: a1BatchBriefReport.batch?.executable === true,
        outputShape: Array.isArray(a1BatchBriefReport.assignmentForA1?.outputShape)
          ? a1BatchBriefReport.assignmentForA1.outputShape
          : ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
        handoffToPM: a1BatchBriefReport.assignmentForA1?.handoffToPM ?? null,
        safety: {
          evidenceRecorded: a1BatchBriefReport.safety?.evidenceRecorded === true,
          marketDataFetched: a1BatchBriefReport.safety?.marketDataFetched === true,
          supabaseReadsEnabled: a1BatchBriefReport.safety?.supabaseReadsEnabled === true,
          supabaseWritesEnabled: a1BatchBriefReport.safety?.supabaseWritesEnabled === true
        }
      },
      replyRequest: {
        status: a1ReplyRequestReport.status ?? "unknown",
        pendingCount: Number(a1ReplyRequestReport.counts?.pending ?? 0),
        pendingSlotIds: Array.isArray(a1ReplyRequestReport.requestForA1?.pendingSlotIds)
          ? a1ReplyRequestReport.requestForA1.pendingSlotIds
          : [],
        requiredFields: Array.isArray(a1ReplyRequestReport.requestForA1?.requiredFields)
          ? a1ReplyRequestReport.requestForA1.requiredFields
          : ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
        pmAfterA1Reply: Array.isArray(a1ReplyRequestReport.pmAfterA1Reply)
          ? a1ReplyRequestReport.pmAfterA1Reply
          : [
            "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
            "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
            "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
            "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
          ],
        localEvidenceCandidateDraft: a1ReplyRequestReport.localEvidenceCandidateDraft ?? {
          status: "unavailable",
          readyStatus: "a1_twii_local_evidence_candidate_draft_ready_for_pm_classification",
          command: "cmd.exe /c npm run report:a1-twii-local-evidence-candidate-draft",
          candidateSlotCount: 0,
          suggestedPmClassifications: [],
          rule:
            "Use the local draft only as a PM classification aid; it does not record evidence, approve source rights, or open TWII execution."
        },
        localEvidenceBoundedRepairRequest: a1ReplyRequestReport.localEvidenceBoundedRepairRequest ?? {
          status: "unavailable",
          readyStatus: "a1_twii_local_evidence_bounded_repair_request_ready",
          command: "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
          repairRequestCount: 0,
          copyableA1Request: [],
          rule:
            "Use the bounded repair request only to ask A1 for the smallest no-secret fixes needed for PM classification."
        },
        safety: {
          evidenceRecorded: a1ReplyRequestReport.safety?.evidenceRecorded === true,
          marketDataFetched: a1ReplyRequestReport.safety?.marketDataFetched === true,
          sqlExecuted: a1ReplyRequestReport.safety?.sqlExecuted === true,
          supabaseReadsEnabled: a1ReplyRequestReport.safety?.supabaseReadsEnabled === true,
          supabaseWritesEnabled: a1ReplyRequestReport.safety?.supabaseWritesEnabled === true
        }
      },
      completionStatus: {
        status: a1CompletionStatusReport.status ?? "unknown",
        counts: a1CompletionStatusReport.counts ?? {
          accepted: 0,
          pending: 4,
          required: 4
        },
        pendingSlotIds: Array.isArray(a1CompletionStatusReport.slotIds?.pending)
          ? a1CompletionStatusReport.slotIds.pending
          : ["vendor-terms-evidence", "internal-feed-owner-evidence", "field-contract-evidence", "asset-mapping-evidence"],
        pmClassificationQueue: Array.isArray(a1CompletionStatusReport.pmClassificationQueue)
          ? a1CompletionStatusReport.pmClassificationQueue
          : [],
        pmQueueRule:
          a1CompletionStatusReport.pmQueueRule ??
          "PM may classify only pending queue slots after response-readiness and the no-secret shape guard pass; this report never emits apply commands.",
        pmOneRunnerCommand:
          a1CompletionStatusReport.pmOneRunnerCommand ??
          "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
        nextAction:
          a1CompletionStatusReport.nextAction ??
          "ask_a1_for_only_the_pending_no_secret_slot_summaries"
      },
      pmClassificationRoute: {
        status: a1ClassificationRouteReport.status ?? "unknown",
        classificationOptions:
          a1ClassificationRouteReport.pmSingleClassificationChecklist?.classificationOptions ??
          ["accepted", "rejected", "needs_bounded_repair", "blocked"],
        requiredPerSlot:
          a1ClassificationRouteReport.pmSingleClassificationChecklist?.requiredPerSlot ??
          ["classification", "pmQuestionResolved", "safeSummary", "sourceReferenceLabel", "remainingRisk", "nextGateCandidate"],
        slotIds: Array.isArray(a1ClassificationRouteReport.pmSingleClassificationChecklist?.slotIds)
          ? a1ClassificationRouteReport.pmSingleClassificationChecklist.slotIds
          : ["vendor-terms-evidence", "internal-feed-owner-evidence", "field-contract-evidence", "asset-mapping-evidence"],
        firstCommand:
          a1ClassificationRouteReport.pmSingleClassificationChecklist?.firstCommand ??
          "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
        afterAnyDryRun:
          a1ClassificationRouteReport.pmSingleClassificationChecklist?.afterAnyDryRun ??
          "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
        stillNotAllowed:
          a1ClassificationRouteReport.pmSingleClassificationChecklist?.stillNotAllowed ??
          [
            "do_not_emit_apply_command",
            "do_not_record_evidence_from_this_report",
            "do_not_approve_source_rights_from_this_report",
            "do_not_award_row_coverage_from_this_report"
          ],
        dryRunPreviewCount: Array.isArray(a1ClassificationRouteReport.dryRunCommandPreviews)
          ? a1ClassificationRouteReport.dryRunCommandPreviews.length
          : 0,
        safety: {
          applyCommandEmitted: a1ClassificationRouteReport.safety?.applyCommandEmitted === true,
          evidenceRecorded: a1ClassificationRouteReport.safety?.evidenceRecorded === true,
          sourceRightsApproved: a1ClassificationRouteReport.safety?.sourceRightsApproved === true,
          rowCoverageAwarded: a1ClassificationRouteReport.safety?.rowCoverageAwarded === true
        }
      },
      pmIntakeDecisionSummary: {
        status: a1PmIntakeDecisionSummaryReport.status ?? "unknown",
        currentDecision:
          a1PmIntakeDecisionSummaryReport.currentDecision ??
          "request_a1_bounded_no_secret_repairs_before_pm_classification",
        pendingCount: Number(a1PmIntakeDecisionSummaryReport.currentState?.pendingCount ?? 4),
        acceptedCount: Number(a1PmIntakeDecisionSummaryReport.currentState?.acceptedCount ?? 0),
        canOpenTwiiOutcomeGate: Boolean(a1PmIntakeDecisionSummaryReport.currentState?.canOpenTwiiOutcomeGate),
        boundedRepairCommand:
          a1PmIntakeDecisionSummaryReport.boundedRepairIntake?.command ??
          "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
        repairRequestCount: Number(a1PmIntakeDecisionSummaryReport.boundedRepairIntake?.repairRequestCount ?? 0),
        oneRunnerCommand:
          a1PmIntakeDecisionSummaryReport.pmClassificationAfterA1Reply?.oneRunnerCommand ??
          "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
        postReplyOneRunnerProof: a1PmIntakeDecisionSummaryReport.postReplyOneRunnerProof ?? {
          status: "focused_gate_registered_lightweight_proof_summary",
          focusedGateName: "a1-twii-post-reply-pm-classification-once",
          proofCommand: "cmd.exe /c npm run check:a1-twii-post-reply-pm-classification-once",
          routineRunnerCommand: "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
          currentPendingScenario: {
            expectedStatus: "blocked_waiting_a1_twii_four_slot_no_secret_evidence",
            expectedNextCommand: "cmd.exe /c npm run report:a1-twii-four-slot-reply-request"
          },
          acceptedFixtureScenario: {
            expectedStatus: "a1_twii_post_reply_chain_ready_for_outcome_gate_candidate",
            expectedNextCommand: "cmd.exe /c npm run report:a1-twii-outcome-gate-candidate-route"
          },
          ledgerModified: false,
          valuesAreFixtureOnly: true
        },
        nextCommands: Array.isArray(a1PmIntakeDecisionSummaryReport.nextCommands)
          ? a1PmIntakeDecisionSummaryReport.nextCommands
          : [
            "cmd.exe /c npm run report:a1-twii-local-evidence-bounded-repair-request",
            "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
            "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
            "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
          ],
        safety: {
          evidenceRecorded: a1PmIntakeDecisionSummaryReport.safety?.evidenceRecorded === true,
          marketDataFetched: a1PmIntakeDecisionSummaryReport.safety?.marketDataFetched === true,
          sourceRightsApproved: a1PmIntakeDecisionSummaryReport.safety?.sourceRightsApproved === true,
          sqlExecuted: a1PmIntakeDecisionSummaryReport.safety?.sqlExecuted === true,
          supabaseWritesEnabled: a1PmIntakeDecisionSummaryReport.safety?.supabaseWritesEnabled === true
        }
      },
      reviewedOutcomeSurface: {
        status: a1ReviewedOutcomeSurfaceReport.status ?? "unknown",
        activeLane: a1ReviewedOutcomeSurfaceReport.activeLane ?? "unknown",
        pendingCount: Number(a1ReviewedOutcomeSurfaceReport.pendingCount ?? 0),
        judgementSummary: a1ReviewedOutcomeSurfaceReport.judgementSummary ?? {
          canOpenOutcomeGate: false,
          counts: { accepted: 0, blocked: 0, needs_bounded_repair: 0, pending: 4 },
          nextPmAction: "wait_for_a1_four_slot_no_secret_evidence_then_dry_run_pm_classification",
          slots: []
        },
        pmNarrowRequest: a1ReviewedOutcomeSurfaceReport.pmNarrowRequest ?? {
          mode: "four_slot_no_secret_reply",
          askA1For: ["vendor-terms-evidence", "internal-feed-owner-evidence", "field-contract-evidence", "asset-mapping-evidence"],
          requiredFields: ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"],
          afterA1Reply: [
            "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
            "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
            "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
            "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
            "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
            "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
          ]
        },
        decisionRoutes: {
          accepted: a1ReviewedOutcomeSurfaceReport.pmDecisionMatrix?.accepted?.nextGateCandidate ?? "unknown",
          rejected: a1ReviewedOutcomeSurfaceReport.pmDecisionMatrix?.rejected?.nextGateCandidate ?? "unknown",
          needs_bounded_repair:
            a1ReviewedOutcomeSurfaceReport.pmDecisionMatrix?.needs_bounded_repair?.nextGateCandidate ?? "unknown",
          blocked: a1ReviewedOutcomeSurfaceReport.pmDecisionMatrix?.blocked?.nextGateCandidate ?? "unknown"
        },
        reviewedSlotCount: Array.isArray(a1ReviewedOutcomeSurfaceReport.reviewedOutcomeSlots)
          ? a1ReviewedOutcomeSurfaceReport.reviewedOutcomeSlots.length
          : 0,
        nextAfterAnyDryRun:
          a1ReviewedOutcomeSurfaceReport.nextAfterAnyDryRun ??
          "cmd.exe /c npm run report:a1-source-rights-readiness-summary",
        safety: {
          evidenceRecorded: a1ReviewedOutcomeSurfaceReport.safety?.evidenceRecorded === true,
          marketDataFetched: a1ReviewedOutcomeSurfaceReport.safety?.marketDataFetched === true,
          supabaseReadsEnabled: a1ReviewedOutcomeSurfaceReport.safety?.supabaseReadsEnabled === true,
          supabaseWritesEnabled: a1ReviewedOutcomeSurfaceReport.safety?.supabaseWritesEnabled === true
        }
      },
      coverage: a1Report.currentState?.coverage ?? {
        twEquity: "unknown",
        twii: "unknown",
        etf: "unknown",
        level1Mvp: "unknown"
      }
    },
    a2: {
      status: Number(a2Summary.urgentFirstScreenCandidates ?? 0) === 0
        ? "no_urgent_first_screen_public_copy_blocker"
        : "urgent_first_screen_public_copy_review_needed",
      nextAction: Number(a2Summary.urgentFirstScreenCandidates ?? 0) === 0
        ? "keep_public_copy_stable_and_patch_only_launch_blocking_changes"
        : "repair_urgent_first_screen_public_copy_before_beta_packet",
      urgentFirstScreenCandidates: Number(a2Summary.urgentFirstScreenCandidates ?? 0),
      firstScreenCandidates: Number(a2Summary.firstScreenCandidates ?? 0),
      mojibakeCandidates: Number(a2Summary.mojibakeCandidates ?? 0),
      internalTermHits: Number(a2Summary.internalTermHits ?? 0),
      priorityCounts: a2Summary.priorityCounts ?? { P0: 0, P1: 0, P2: 0 },
      launchBlockingStatus: a2Report.pmDecisionSupport?.launchBlockingStatus ?? {
        allowedNextAction: "inspect_a2_report_before_public_beta_packet",
        hardBlocker: true,
        status: "unknown"
      },
      decisionSupport: a2Report.pmDecisionSupport ?? {
        nextRecommendedSlice: "a2-public-copy-stability-watch",
        nextRecommendedPriority: "P2",
        nextRecommendedAction:
          "Keep public copy stable and patch only launch-blocking readability regressions.",
        topFiles: [],
        routeReason: "a2_decision_support_unavailable"
      }
    }
  },
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stopLines: [
    "No deployment is authorized by this report.",
    "No hosting resource is created or mutated by this report.",
    "No platform environment value is printed by this report.",
    "No SQL is executed by this report.",
    "No Supabase connection, read, or write is executed by this report.",
    "No staging rows or daily_prices rows are created or modified by this report.",
    "No raw market data is fetched, stored, ingested, or committed by this report.",
    "No secrets, raw payloads, row payloads, or stock id payloads are printed by this report.",
    "publicDataSource remains mock and scoreSource remains mock."
  ],
  sourceReports: {
    betaPlatformUnblockKit: commandStatus(beta),
    betaLaunchNextAction: commandStatus(betaLaunchNextAction),
    a1SourceRightsNextAction: commandStatus(a1),
    a1SourceRightsReadinessSummary: commandStatus(a1Readiness),
    a1ExactSourceRightsEvidenceWorksheet: commandStatus(a1Worksheet),
    a1TwiiEvidenceIntakeMiniPacket: commandStatus(a1MiniPacket),
    a1SourceRightsEvidenceBatchBrief: commandStatus(a1BatchBrief),
    a1TwiiFourSlotReplyRequest: commandStatus(a1ReplyRequest),
    a1TwiiEvidenceCompletionStatus: commandStatus(a1CompletionStatus),
    a1TwiiEvidencePmClassificationRoute: commandStatus(a1ClassificationRoute),
    a1TwiiPmIntakeDecisionSummary: commandStatus(a1PmIntakeDecisionSummary),
    a1SourceRightsReviewedOutcomeSurface: commandStatus(a1ReviewedOutcomeSurface),
    a2PublicCopyReadabilityCandidates: commandStatus(a2),
    betaRuntimeFastHealth: commandStatus(runtimeFastHealth),
    publicBetaCoreRouteQuickProof: commandStatus(coreRouteQuickProof),
    publicBetaMockLaunchProofBundle: commandStatus(mockLaunchProofBundle),
    betaLaunchRemainingBlockers: commandStatus(betaLaunchRemainingBlockers),
    pmWorktreeReviewPreflight: commandStatus(pmWorktreeReview)
  }
};

report.goalReadiness = buildPublicBetaGoalReadinessRollup(report, {
  sourceReports: {
    betaMainlineCurrentRoute: {
      exitCode: 0,
      parsedJson: true,
      stderrPrinted: false,
      embeddedInMainlineRoute: true
    }
  }
});

console.log(JSON.stringify(report, null, 2));

function chooseMainlineRoute({ acceptedArtifactExists, a1FourSlotEvidencePending, betaStatus, platformStatus }) {
  if (acceptedArtifactExists) {
    return {
      status: "ready_to_render_pre_execution_packet_candidate",
      currentRoute: "pre_execution_packet_candidate",
      nextAction: "render_pre_execution_packet_candidate_from_accepted_reviewed_artifact",
      nextCommand: "cmd.exe /c npm run render:beta-pre-execution-packet-candidate",
      afterCurrentCommand: "cmd.exe /c npm run check:beta-pre-execution-packet-candidate-template"
    };
  }

  if (betaStatus === "beta_platform_values_ready_for_packet_window" || platformStatus === "accepted_two_value_shape_only") {
    return {
      status: "ready_to_run_beta_packet_window_proof_map",
      currentRoute: "combined_post_reply_one_runner",
      nextAction: "run_public_beta_post_reply_one_runner_then_record_reviewed_artifact_outcome_if_packet_review_ready",
      nextCommand: "cmd.exe /c npm run run:public-beta-post-reply-route-once",
      afterCurrentCommand:
        "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --dry-run --outcome accepted --reviewedBy PM --note \"PM dry-run verifies the no-secret packet-window reviewed artifact before any apply decision.\""
    };
  }

  if (platformStatus === "rejected_unsafe_values") {
    return {
      status: "blocked_unsafe_platform_values",
      currentRoute: "repair_two_safe_platform_values",
      nextAction: "replace_unsafe_platform_values_with_plain_project_name_and_public_https_beta_url",
      nextCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
      afterCurrentCommand: "cmd.exe /c npm run report:beta-mainline-current-route"
    };
  }

  return {
    status: a1FourSlotEvidencePending
      ? "blocked_waiting_external_input_response"
      : "blocked_waiting_two_platform_values",
    currentRoute: "collect_external_inputs",
    nextAction: "collect_beta_platform_values_and_a1_twii_four_slot_evidence_from_copy_packet",
    nextCommand: externalInputCopyPacketCommand,
    afterCurrentCommand: "cmd.exe /c npm run report:public-beta-external-reply-file-route"
  };
}

function buildPmRouteRouter(routerReport) {
  const a1Evidence = routerReport.currentState?.a1TwiiFourSlotEvidence ?? {};

  return {
    status: routerReport.status ?? "unknown",
    command: "cmd.exe /c npm run report:beta-launch-next-action",
    pmMainlineNextAction: routerReport.pmMainlineNextAction ?? "unknown",
    pmCommand: externalInputCopyPacketCommand,
    fallbackFullRequestCommand: routerReport.pmCommand ?? externalInputFullRequestCommand,
    a1NextAction:
      routerReport.a1NextAction ?? "collect_a1_twii_four_slot_no_secret_evidence_then_response_readiness_and_pm_classify",
    a1Command: routerReport.a1Command ?? "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
    a1FourSlotEvidence: {
      status: a1Evidence.status ?? "twii_four_slot_evidence_pending",
      pendingEvidenceCount: Number(a1Evidence.pendingEvidenceCount ?? 0),
      requiredEvidenceCount: Number(a1Evidence.requiredEvidenceCount ?? 0),
      nextCommand: a1Evidence.nextCommand ?? "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
      afterReplyFirstCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness"
    },
    safety: {
      deploymentAuthorized: false,
      evidenceRecorded: false,
      marketDataFetched: false,
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sqlExecuted: false,
      supabaseWritesEnabled: false
    }
  };
}

function buildExternalInputRequestSummary(betaReport, a1ReplyRequestReport) {
  const afterExternalReplyReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";
  const afterExternalReplyFileRouteCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";
  const afterPlatformReplyOnceRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";
  const platformReplyTemplate = Array.isArray(betaReport.operatorHandoff?.replyTemplate)
    ? betaReport.operatorHandoff.replyTemplate
    : [
      "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-or-site-name>",
      "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
    ];
  const a1PendingSlotIds = Array.isArray(a1ReplyRequestReport.requestForA1?.pendingSlotIds)
    ? a1ReplyRequestReport.requestForA1.pendingSlotIds
    : [
      "vendor-terms-evidence",
      "internal-feed-owner-evidence",
      "field-contract-evidence",
      "asset-mapping-evidence"
    ];
  const a1RequiredFields = Array.isArray(a1ReplyRequestReport.requestForA1?.requiredFields)
    ? a1ReplyRequestReport.requestForA1.requiredFields
    : ["evidenceSlotId", "sourceReferenceLabel", "safeEvidenceSummary", "remainingRisk"];
  const a1CopyableReplyTemplate = Array.isArray(a1ReplyRequestReport.requestForA1?.copyableReplyTemplate)
    ? a1ReplyRequestReport.requestForA1.copyableReplyTemplate
    : buildA1FallbackCopyableReplyTemplate(a1PendingSlotIds);
  const a1AfterReplyCommands = [
    afterExternalReplyFileRouteCommand,
    afterExternalReplyReadinessCommand,
    ...(
      Array.isArray(a1ReplyRequestReport.pmAfterA1Reply)
        ? a1ReplyRequestReport.pmAfterA1Reply
        : [
          "cmd.exe /c npm run check:a1-twii-evidence-response-shape",
          "cmd.exe /c npm run report:a1-twii-evidence-pm-classification-route",
          "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface",
          "cmd.exe /c npm run report:a1-source-rights-readiness-summary"
        ]
    )
  ].filter((command, index, commands) => commands.indexOf(command) === index);

  return {
    status: "public_beta_external_input_request_ready",
    command: externalInputCopyPacketCommand,
    fallbackFullRequestCommand: externalInputFullRequestCommand,
    replyIntakeDryRun: {
      a1PmPreviewCommand: externalA1ReplyPmClassificationPreviewCommand,
      command: externalReplyIntakeDryRunCommand,
      completeReplyNextCommand: externalReplyFileWorkflowProofCommand,
      fileTextEchoed: false,
      purpose:
        "When PM/A1 has filled the copy packet into a local text file, set PUBLIC_BETA_EXTERNAL_REPLY_PATH and run this dry-run intake, then use the workflow proof to bridge into the post-reply one-runner without storing values.",
      requiredEnvVar: "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
      routeCommand: externalReplyFileRouteCommand,
      templateCommand: externalReplyFileTemplateCommand,
      unsafeReplyFallbackCommand: externalInputCopyPacketCommand,
      valueEchoed: false,
      workflowProofCommand: externalReplyFileWorkflowProofCommand
    },
    mode: "two_reply_blocks_no_secret",
    requestBlocks: [
      {
        id: "beta_platform_two_values",
        owner: "PM or hosting operator",
        requiredFields: ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"],
        replyTemplate: platformReplyTemplate,
        afterReply: [
          afterExternalReplyFileRouteCommand,
          afterExternalReplyReadinessCommand,
          afterPlatformReplyOnceRunnerCommand,
          "cmd.exe /c npm run report:beta-mainline-current-route"
        ]
      },
      {
        id: "a1_twii_four_slot_no_secret_evidence",
        owner: "A1 Data / Supabase / Market Evidence",
        requiredFields: a1RequiredFields,
        pendingSlotIds: a1PendingSlotIds,
        afterReply: a1AfterReplyCommands
      }
    ],
    pmOneScreenReplyPacket: buildPmOneScreenReplyPacket({
      a1AfterReplyCommands,
      a1CopyableReplyTemplate,
      a1PendingSlotIds,
      a1RequiredFields,
      afterExternalReplyReadinessCommand,
      afterExternalReplyFileRouteCommand,
      afterPlatformReplyOnceRunnerCommand,
      platformReplyTemplate
    }),
    pmReplyPacketContract: buildPmReplyPacketContract(a1RequiredFields),
    pmCopyableReplyChecklist: {
      platformLines: platformReplyTemplate,
      a1SlotIds: a1PendingSlotIds,
      a1RequiredPerSlot: a1RequiredFields,
      afterAnyReplyFirstCommand: afterExternalReplyFileRouteCommand,
      fallbackResponseReadinessCommand: afterExternalReplyReadinessCommand,
      completionSignals: [
        "platform_values_shape_valid_inside_public_beta_post_reply_one_runner",
        "post_reply_once_runner_routes_packet_window_or_a1_outcome_gate",
        "a1_four_slot_shape_guard_passes",
        "a1_pm_classification_route_available_for_all_four_slots"
      ],
      stillNotAllowed: [
        "do_not_print_or_store_platform_values_in_repo",
        "do_not_record_a1_evidence_from_this_report",
        "do_not_approve_source_rights_from_this_report",
        "do_not_deploy_from_this_report"
      ]
    },
    safety: {
      deploymentAuthorized: false,
      evidenceRecorded: false,
      hostingMutated: false,
      marketDataFetched: false,
      rawPayloadPrinted: false,
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sqlExecuted: false,
      supabaseReadsEnabled: false,
      supabaseWritesEnabled: false,
      valuesStored: false
    }
  };
}

function buildA1FallbackCopyableReplyTemplate(a1PendingSlotIds) {
  return a1PendingSlotIds.flatMap((slotId) => [
    `evidenceSlotId: ${slotId}`,
    "sourceReferenceLabel: <no-secret reviewed source label>",
    "safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, source extracts, raw market data, row payloads, or stock-id payloads>",
    "remainingRisk: <one to two sentences; say what still blocks execution or approval>",
    ""
  ]);
}

function buildPmOneScreenReplyPacket({
  a1AfterReplyCommands,
  a1CopyableReplyTemplate,
  a1PendingSlotIds,
  a1RequiredFields,
  afterExternalReplyReadinessCommand,
  afterExternalReplyFileRouteCommand,
  afterPlatformReplyOnceRunnerCommand,
  platformReplyTemplate
}) {
  return {
    purpose: "Copy this one screen into the PM/A1 handoff. Fill placeholders only; keep secrets and raw payloads out.",
    platformBlock: {
      title: "Block 1 - Beta platform two values",
      owner: "PM or hosting operator",
      lines: platformReplyTemplate,
      afterReply: [
        afterExternalReplyFileRouteCommand,
        afterExternalReplyReadinessCommand,
        afterPlatformReplyOnceRunnerCommand
      ]
    },
    a1Block: {
      title: "Block 2 - A1 TWII four-slot no-secret evidence",
      owner: "A1 Data / Supabase / Market Evidence",
      pendingSlotIds: a1PendingSlotIds,
      requiredPerSlot: a1RequiredFields,
      lines: a1CopyableReplyTemplate,
      afterReply: a1AfterReplyCommands,
      failFastRule:
        "If any A1 TWII slot is still missing, the one-runner stops after response-readiness and returns to report:a1-twii-four-slot-reply-request."
    },
    completeWhen: [
      "both beta platform lines are filled with safe non-secret values",
      "all four A1 TWII slot summaries are provided in no-secret shape",
      "response-readiness passes before the post-reply runner"
    ]
  };
}

function buildPmReplyPacketContract(a1RequiredFields) {
  return {
    status: "pm_reply_packet_contract_ready",
    purpose:
      "Define the smallest complete external reply that lets PM run response-readiness and the post-reply one-runner without reopening governance.",
    completeReplyRequires: [
      {
        blockId: "beta_platform_two_values",
        requiredFields: ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"],
        completionRule:
          "Both lines must be present and shape-safe; project name is a plain slug and temporary URL is public https only."
      },
      {
        blockId: "a1_twii_four_slot_no_secret_evidence",
        requiredSlotCount: 4,
        requiredFieldsPerSlot: a1RequiredFields,
        completionRule:
          "Each TWII slot must include the four no-secret fields before PM can run the A1 classification chain."
      }
    ],
    forbiddenContent: [
      "secrets",
      "dashboard URLs",
      "Supabase URLs",
      "private preview tokens",
      "copied contract text",
      "raw market data",
      "row payloads",
      "stock-id payloads"
    ],
    firstCommandAfterAnyReply: "cmd.exe /c npm run report:public-beta-external-reply-file-route",
    fallbackResponseReadinessCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
    oneRunnerAfterShapeSafeReply: "cmd.exe /c npm run run:public-beta-post-reply-route-once",
    a1OneRunnerAfterEvidenceReply: "cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once",
    doneSignals: [
      "platform_two_values_shape_valid",
      "a1_four_twii_slots_present_in_no_secret_shape",
      "response_readiness_routes_to_post_reply_one_runner"
    ],
    stillNotAllowed: [
      "do_not_store_platform_values_in_repo",
      "do_not_record_a1_evidence_from_this_request",
      "do_not_deploy_from_this_request",
      "do_not_promote_publicDataSource_or_scoreSource_from_this_request"
    ]
  };
}

function buildPmDefaultWhenBlocked(status) {
  if (!["blocked_waiting_two_platform_values", "blocked_waiting_external_input_response"].includes(status)) {
    return {
      active: false,
      reason: "mainline_has_an_executable_next_route",
      allowedLocalLanes: [],
      avoid: []
    };
  }

  return {
    active: true,
    reason: status === "blocked_waiting_external_input_response"
      ? "platform_values_and_a1_twii_evidence_are_the_current_external_blockers"
      : "platform_values_are_the_only_pm_mainline_external_blocker",
    allowedLocalLanes: [
      "refresh_focused_local_runtime_proof_only_when_runtime_or_route_health_changed",
      "keep_a1_on_twii_four_slot_no_secret_evidence_request",
      "keep_a2_on_urgent_public_copy_regression_repairs_only"
    ],
    avoid: [
      "do_not_reopen_broad_deployment_governance",
      "do_not_expand_a2_visual_polish_before_platform_values",
      "do_not_create_packet_window_artifact_before_the_combined_post_reply_one_runner_reaches_pm_review"
    ]
  };
}

function buildWorktreeSafeguardSummary(worktreeReport) {
  const acceptance = worktreeReport.pmAcceptanceSummary ?? {};
  const unresolvedCount = Number(acceptance.unresolvedCount ?? 0);
  const canProceedToBackupDecision = acceptance.canProceedToBackupDecision === true;
  const safeguardReady = canProceedToBackupDecision && unresolvedCount === 0;

  if (safeguardReady) {
    return {
      canProceedToBackupDecision,
      hardBlocker: false,
      nextRoute: "collect_external_input_response_then_run_public_beta_post_reply_one_runner",
      packetCandidateAllowed: false,
      packetCandidateBlocker: "git_snapshot_is_recommended_safeguard_not_current_public_beta_hard_blocker",
      recommendedPmOutcome:
        "classified_beta_readiness_worktree_safeguard_ready_continue_to_platform_values",
      safeguardReady
    };
  }

  return {
    canProceedToBackupDecision,
    hardBlocker: true,
    nextRoute: worktreeReport.nextRoute ?? "pm_reviews_unresolved_items_before_backup_or_packet_candidate",
    packetCandidateAllowed: Boolean(worktreeReport.packetCandidateAllowed),
    packetCandidateBlocker:
      acceptance.packetCandidateBlocker ?? "unresolved_worktree_items_still_require_pm_classification",
    recommendedPmOutcome:
      acceptance.recommendedPmOutcome ?? "hold_packet_candidate_until_unresolved_items_are_classified",
    safeguardReady: false
  };
}

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 240000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "").trim()
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
