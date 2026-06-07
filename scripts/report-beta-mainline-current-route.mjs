import { spawnSync } from "node:child_process";

const beta = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-platform-unblock-kit"]);
const a1 = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-source-rights-next-action"]);
const a1Readiness = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-source-rights-readiness-summary"]);
const a1Worksheet = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-exact-source-rights-evidence-worksheet"]);
const a1BatchBrief = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-source-rights-evidence-batch-brief"]);
const a1ReviewedOutcomeSurface = runJson([
  "cmd.exe",
  "/c",
  "npm",
  "run",
  "report:a1-source-rights-reviewed-outcome-surface"
]);
const a2 = runJson(["cmd.exe", "/c", "npm", "run", "report:a2-public-copy-readability-candidates"]);
const runtimeFastHealth = runJson(["cmd.exe", "/c", "npm", "run", "check:beta-runtime-fast-health"]);

const betaReport = beta.json ?? {};
const a1Report = a1.json ?? {};
const a1ReadinessReport = a1Readiness.json ?? {};
const a1WorksheetReport = a1Worksheet.json ?? {};
const a1BatchBriefReport = a1BatchBrief.json ?? {};
const a1ReviewedOutcomeSurfaceReport = a1ReviewedOutcomeSurface.json ?? {};
const a2Report = a2.json ?? {};
const runtimeFastHealthReport = runtimeFastHealth.json ?? {};

const platformStatus = betaReport.platformValues?.status ?? "unknown";
const acceptedArtifactExists = Boolean(betaReport.reviewedArtifact?.acceptedArtifactExists);
const betaStatus = betaReport.status ?? "unknown";
const mainlineRoute = chooseMainlineRoute(betaStatus, platformStatus, acceptedArtifactExists);
const exactLedger = a1Report.currentState?.exactLedger ?? {};
const a2Summary = a2Report.summary ?? {};

const report = {
  status: mainlineRoute.status,
  ok: true,
  ceoDecision: "keep_beta_mainline_moving_with_a1_a2_parallel_routes",
  pmMainline: {
    currentRoute: mainlineRoute.currentRoute,
    nextAction: mainlineRoute.nextAction,
    nextCommand: mainlineRoute.nextCommand,
    afterCurrentCommand: mainlineRoute.afterCurrentCommand
  },
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
        "BETA_HOSTING_PROJECT_NAME=<plain-hosting-project-slug>",
        "BETA_TEMPORARY_URL=https://<public-beta-hostname>/"
      ],
    safeShapeReminder: Array.isArray(betaReport.operatorHandoff?.safeShapeReminder)
      ? betaReport.operatorHandoff.safeShapeReminder
      : [],
    nextValidationCommand:
      betaReport.operatorHandoff?.nextValidationCommand ?? "cmd.exe /c npm run validate:beta-platform-two-values",
    afterValuesCommand:
      betaReport.pmMainline?.afterValuesCommand ?? "cmd.exe /c npm run run:beta-packet-window-proof-map",
    afterProofMapCommand:
      betaReport.pmMainline?.afterProofMapCommand ??
      "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --outcome accepted --reviewedBy PM --note \"PM accepts the no-secret packet-window proof map for pre-execution packet preparation only\" --apply",
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
  parallelRoutes: {
    a1: {
      status: a1Report.status ?? "unknown",
      nextAction: a1Report.a1NextAction ?? "continue_exact_source_rights_evidence_intake",
      nextCommand:
        a1Report.a1NextCommand ?? "cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet",
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
          a1ReadinessReport.nextCommand ?? "cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet",
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
      reviewedOutcomeSurface: {
        status: a1ReviewedOutcomeSurfaceReport.status ?? "unknown",
        activeLane: a1ReviewedOutcomeSurfaceReport.activeLane ?? "unknown",
        pendingCount: Number(a1ReviewedOutcomeSurfaceReport.pendingCount ?? 0),
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
    a1SourceRightsNextAction: commandStatus(a1),
    a1SourceRightsReadinessSummary: commandStatus(a1Readiness),
    a1ExactSourceRightsEvidenceWorksheet: commandStatus(a1Worksheet),
    a1SourceRightsEvidenceBatchBrief: commandStatus(a1BatchBrief),
    a1SourceRightsReviewedOutcomeSurface: commandStatus(a1ReviewedOutcomeSurface),
    a2PublicCopyReadabilityCandidates: commandStatus(a2),
    betaRuntimeFastHealth: commandStatus(runtimeFastHealth)
  }
};

console.log(JSON.stringify(report, null, 2));

function chooseMainlineRoute(betaStatus, platformStatus, acceptedArtifactExists) {
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
      currentRoute: "packet_window_proof_map",
      nextAction: "run_packet_window_proof_map_then_record_reviewed_artifact_outcome",
      nextCommand: "cmd.exe /c npm run run:beta-packet-window-proof-map",
      afterCurrentCommand:
        "cmd.exe /c npm run record:beta-packet-window-reviewed-artifact-outcome -- --outcome accepted --reviewedBy PM --note \"PM accepts the no-secret packet-window proof map for pre-execution packet preparation only\" --apply"
    };
  }

  if (platformStatus === "rejected_unsafe_values") {
    return {
      status: "blocked_unsafe_platform_values",
      currentRoute: "repair_two_safe_platform_values",
      nextAction: "replace_unsafe_platform_values_with_plain_project_name_and_public_https_beta_url",
      nextCommand: "cmd.exe /c npm run validate:beta-platform-two-values",
      afterCurrentCommand: "cmd.exe /c npm run report:beta-mainline-current-route"
    };
  }

  return {
    status: "blocked_waiting_two_platform_values",
    currentRoute: "obtain_two_safe_platform_values",
    nextAction: "provide_only_BETA_HOSTING_PROJECT_NAME_and_BETA_TEMPORARY_URL_then_rerun_route_report",
    nextCommand: "cmd.exe /c npm run validate:beta-platform-two-values",
    afterCurrentCommand: "cmd.exe /c npm run report:beta-mainline-current-route"
  };
}

function buildPmDefaultWhenBlocked(status) {
  if (status !== "blocked_waiting_two_platform_values") {
    return {
      active: false,
      reason: "mainline_has_an_executable_next_route",
      allowedLocalLanes: [],
      avoid: []
    };
  }

  return {
    active: true,
    reason: "platform_values_are_the_only_pm_mainline_external_blocker",
    allowedLocalLanes: [
      "refresh_focused_local_runtime_proof_only_when_runtime_or_route_health_changed",
      "keep_a1_on_exact_twii_etf_source_rights_evidence_intake",
      "keep_a2_on_urgent_public_copy_regression_repairs_only"
    ],
    avoid: [
      "do_not_reopen_broad_deployment_governance",
      "do_not_expand_a2_visual_polish_before_platform_values",
      "do_not_create_packet_window_artifact_before_two_platform_values_validate"
    ]
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
