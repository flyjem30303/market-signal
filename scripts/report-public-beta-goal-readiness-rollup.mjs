import { spawnSync } from "node:child_process";

const mainline = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-mainline-current-route"]);
const report = mainline.json ?? {};

const runtimeReady = report.runtimeHealth?.status === "ok" &&
  report.runtimeHealth?.routeCount === 9 &&
  report.runtimeHealth?.allRoutesHttp200 === true;
const platformReady = report.platformValues?.hostingProjectNameProvided === true &&
  report.platformValues?.temporaryBetaUrlProvided === true &&
  report.status !== "blocked_waiting_two_platform_values";
const packetReady = report.reviewedArtifact?.acceptedArtifactExists === true;
const a1Ready = report.parallelRoutes?.a1?.readiness?.twiiCanOpenOutcomeGate === true ||
  report.parallelRoutes?.a1?.readiness?.etfCanOpenOutcomeGate === true;
const a2Ready = report.parallelRoutes?.a2?.status === "no_urgent_first_screen_public_copy_blocker";
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
      ? "run packet-window proof map and record reviewed artifact outcome"
      : "provide only BETA_HOSTING_PROJECT_NAME and BETA_TEMPORARY_URL, then run validate:beta-platform-two-values"
  },
  {
    id: "a1_source_rights_and_coverage_frontier",
    status: a1Ready ? "ready_for_outcome_gate_candidate" : "blocked",
    evidence: a1Ready
      ? "A1 readiness has at least one lane ready for a separate source-rights outcome gate candidate"
      : `TWII pending ${Number(report.parallelRoutes?.a1?.readiness?.twiiPendingCount ?? 0)}, ETF pending ${Number(report.parallelRoutes?.a1?.readiness?.etfPendingCount ?? 0)}`,
    nextAction: a1Ready
      ? "open only the ready source-rights outcome gate candidate"
      : "use parallelRoutes.a1.batchBrief and reviewedOutcomeSurface to collect and classify TWII no-secret evidence"
  },
  {
    id: "a2_public_trust_copy",
    status: a2Ready ? "ready" : "needs_repair",
    evidence: a2Ready
      ? "A2 reports no urgent first-screen public-copy blocker"
      : "A2 has urgent first-screen public-copy blocker",
    nextAction: a2Ready
      ? "keep public copy stable and patch only launch-blocking regressions"
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

console.log(
  JSON.stringify(
    {
      mode: "public_beta_goal_readiness_rollup",
      status: blockedItems.length === 0
        ? "public_beta_goal_ready_for_final_audit"
        : "public_beta_goal_not_ready_continue_parallel_work",
      ceoDecision: "keep_mainline_on_platform_values_and_keep_a1_a2_parallel",
      sourceReports: {
        betaMainlineCurrentRoute: {
          exitCode: mainline.exitCode,
          parsedJson: Boolean(mainline.json),
          stderrPrinted: mainline.stderr.length > 0
        }
      },
      currentRoute: {
        pmMainlineStatus: report.status ?? "unknown",
        pmNextCommand: report.pmMainline?.nextCommand ?? "unknown",
        pmDefaultWhenBlocked: report.pmDefaultWhenBlocked?.active === true
      },
      completionItems,
      blockedItems: blockedItems.map((item) => item.id),
      nextBestActions: [
        report.pmMainline?.nextCommand ?? "cmd.exe /c npm run report:beta-mainline-current-route",
        "cmd.exe /c npm run report:a1-source-rights-evidence-batch-brief",
        "cmd.exe /c npm run report:a1-source-rights-reviewed-outcome-surface"
      ],
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

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: process.env,
    timeout: 300000,
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
