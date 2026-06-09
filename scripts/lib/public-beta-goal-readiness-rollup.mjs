export function buildPublicBetaGoalReadinessRollup(report, options = {}) {
  const responseReadinessCommand = "cmd.exe /c npm run report:public-beta-external-input-response-readiness";
  const externalInputRequestCommand = "cmd.exe /c npm run report:public-beta-external-input-request";
  const externalReplyFileRouteCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";
  const postReplyOneRunnerCommand = "cmd.exe /c npm run run:public-beta-post-reply-route-once";
  const runtimeReady = report.runtimeHealth?.status === "ok" &&
    report.runtimeHealth?.routeCount === 9 &&
    report.runtimeHealth?.allRoutesHttp200 === true;
  const platformReady = report.platformValues?.hostingProjectNameProvided === true &&
    report.platformValues?.temporaryBetaUrlProvided === true &&
    !["blocked_waiting_two_platform_values", "blocked_waiting_external_input_response"].includes(report.status);
  const packetReady = report.reviewedArtifact?.acceptedArtifactExists === true;
  const a1Ready = report.parallelRoutes?.a1?.readiness?.twiiCanOpenOutcomeGate === true ||
    report.parallelRoutes?.a1?.readiness?.etfCanOpenOutcomeGate === true;
  const a2LaunchBlockingStatus = report.parallelRoutes?.a2?.launchBlockingStatus ?? {};
  const a2Ready = a2LaunchBlockingStatus.status === "clear" &&
    a2LaunchBlockingStatus.hardBlocker === false &&
    a2LaunchBlockingStatus.allowedNextAction === "keep_stable_only_unless_launch_blocking_regression";
  const mockBoundaryHeld = report.runtimeBoundary?.publicDataSource === "mock" &&
    report.runtimeBoundary?.scoreSource === "mock" &&
    report.runtimeHealth?.runtimeBoundary?.publicDataSource === "mock" &&
    report.runtimeHealth?.runtimeBoundary?.scoreSource === "mock";

  const completionItems = [
    {
      id: "runtime_core_routes",
      status: runtimeReady ? "ready" : "blocked",
      evidence: runtimeReady
        ? "mainline runtimeHealth reports 9 checked routes and all HTTP 200"
        : "runtimeHealth is missing or not fully green",
      nextAction: runtimeReady
        ? "keep focused route health proof only when runtime changes"
        : "run cmd.exe /c npm run check:beta-runtime-fast-health"
    },
    {
      id: "beta_platform_values_and_packet",
      status: platformReady && packetReady ? "ready" : "blocked",
      evidence: platformReady
        ? "two platform values are shape-valid"
        : "BETA_HOSTING_PROJECT_NAME and BETA_TEMPORARY_URL are still missing",
      nextAction: platformReady
        ? "run the combined post-reply one-runner, then record PM reviewed artifact accepted/rejected only if the runner reaches packet review"
        : "collect the two platform values from the single external-input request; after reply run the external reply file route first, with response-readiness and the combined post-reply one-runner as lower-level proof steps"
    },
    {
      id: "a1_source_rights_and_coverage_frontier",
      status: a1Ready ? "ready_for_outcome_gate_candidate" : "blocked",
      evidence: a1Ready
        ? "A1 readiness has at least one lane ready for a separate source-rights outcome gate candidate"
        : `TWII pending ${Number(report.parallelRoutes?.a1?.readiness?.twiiPendingCount ?? 0)}, ETF pending ${Number(report.parallelRoutes?.a1?.readiness?.etfPendingCount ?? 0)}`,
      nextAction: a1Ready
        ? "open only the ready source-rights outcome gate candidate"
        : "ask A1 only for the four TWII no-secret slots; after reply run the external reply file route first, then classify the reviewed outcome surface only when the route says A1 evidence is reviewable"
    },
    {
      id: "a2_public_trust_copy",
      status: a2Ready ? "ready" : "needs_repair",
      evidence: a2Ready
        ? "A2 launchBlockingStatus is clear; no P0/P1 first-screen, boundary, or mojibake blocker is present"
        : "A2 launchBlockingStatus is not clear",
      nextAction: a2Ready
        ? "keep public copy stable; defer P2 polish unless a launch-blocking regression appears"
        : "repair urgent public-copy regression before Beta packet"
    },
    {
      id: "promotion_boundary",
      status: mockBoundaryHeld ? "held" : "blocked",
      evidence: mockBoundaryHeld
        ? "publicDataSource and scoreSource remain mock in mainline and runtime health"
        : "mock boundary is not consistently held",
      nextAction: mockBoundaryHeld
        ? "do not promote real source or real score before separate promotion gates"
        : "restore publicDataSource=mock and scoreSource=mock"
    }
  ];

  const blockedItems = completionItems.filter((item) => item.status !== "ready" && item.status !== "held");

  return {
    mode: "public_beta_goal_readiness_rollup",
    status: blockedItems.length === 0
      ? "public_beta_goal_ready_for_final_audit"
      : "public_beta_goal_not_ready_continue_parallel_work",
    ceoDecision: "use_execution_first_goal_writing_mainline_platform_values_packet_a1_only",
    goalWriting: {
      style: "operational_goal_v3_execution_first",
      rule: "Close only the active external blocker chain; each run must directly advance platform values, packet proof, A1 evidence classification, or runtime route health.",
      hardBlockers: [
        "BETA_HOSTING_PROJECT_NAME",
        "BETA_TEMPORARY_URL",
        "A1_TWII_FOUR_SLOT_NO_SECRET_SOURCE_RIGHTS_EVIDENCE"
      ],
      executionBias: [
        "prefer_existing_one_runner_commands",
        "avoid_new_governance_packets_unless_they_unlock_current_chain",
        "defer_visual_polish_role_review_and_broad_audit",
        "keep_reviewed_artifact_recording_dry_run_until_separate_pm_apply_decision",
        "run_smallest_checker_set_that_proves_the_slice"
      ],
      priorityOrder: [
      "platform_two_values",
      "post_reply_one_runner_packet_window_or_a1_gate",
      "pm_reviewed_artifact_outcome",
        "a1_twii_four_slot_no_secret_evidence",
        "a2_launch_blocking_public_copy_only"
      ],
      a1RouteSource: "parallelRoutes.a1.replyRequest",
      deScopedUntilLater: [
        "broad UI polish",
        "new governance packets without an execution blocker",
        "full review gate for every small wording change"
      ]
    },
    sourceReports: options.sourceReports ?? {},
    currentRoute: {
      pmMainlineStatus: report.status ?? "unknown",
      pmNextCommand: report.pmMainline?.nextCommand ?? "unknown",
      pmDefaultWhenBlocked: report.pmDefaultWhenBlocked?.active === true
    },
    completionItems,
    blockedItems: blockedItems.map((item) => item.id),
    nextBestActions: [
      report.pmMainline?.nextCommand ?? externalInputRequestCommand,
      externalReplyFileRouteCommand,
      responseReadinessCommand,
      postReplyOneRunnerCommand,
      "cmd.exe /c npm run report:a1-twii-four-slot-reply-request",
      "cmd.exe /c npm run report:a1-source-rights-evidence-batch-brief",
      "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface"
    ].filter((command, index, commands) => commands.indexOf(command) === index),
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    safety: {
      automatedRemoteRun: false,
      connectionAttempted: false,
      deploymentAuthorized: false,
      evidenceRecorded: false,
      ingestionStarted: false,
      marketDataFetched: false,
      rawPayloadPrinted: false,
      rowCoverageAwarded: false,
      scoreSourceRealEnabled: false,
      secretsPrinted: false,
      sqlExecuted: false,
      supabaseReadsEnabled: false,
      supabaseWritesEnabled: false
    },
    stillDoesNotAuthorize: [
      "deployment",
      "hosting mutation",
      "platform value output",
      "source-rights approval",
      "deployment-ready candidate generation",
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
  };
}
