import { spawnSync } from "node:child_process";

const progress = runJson("scripts/report-project-progress-snapshot.mjs");
const dataGoal = runJson("scripts/report-data-goal-readiness.mjs");
const completionAudit = runJson("scripts/report-data-goal-completion-audit.mjs");
const investmentReadiness = runJson("scripts/report-investment-credibility-mvp-readiness.mjs");

const laneMap = new Map((progress.project?.lanes ?? []).map((lane) => [lane.label, lane]));
const dataLane = laneMap.get("Data freshness and quality evidence");
const investmentLane = laneMap.get("Investment credibility evidence");
const runtimeGuardLane = laneMap.get("Runtime state guard");
const devopsLane = laneMap.get("DevOps / health / recovery");

const currentOverallPercent = progress.project?.adjustedScore ?? 0;
const dataReadinessPercent = dataGoal.dataGoalReadinessPercent ?? 0;
const dataCoverageRouteReady =
  progress.project?.adjustedScore > 0 &&
  dataGoal.status === "bounded_readonly_attempt_reviewed_aggregate_incomplete" &&
  completionAudit.status === "audit_passed_not_100_until_coverage_route_complete";

const promotionBoundariesOk =
  progress.safety?.publicDataSource === "mock" &&
  progress.safety?.scoreSource === "mock" &&
  dataGoal.safety?.publicDataSource === "mock" &&
  dataGoal.safety?.scoreSource === "mock";

const readinessLanes = [
  {
    id: "mock-mvp-product-surface",
    current: laneMap.get("Mock MVP product surface")?.current ?? 0,
    targetForMvpReview: 95,
    owner: "PM",
    status: laneStatus(laneMap.get("Mock MVP product surface")?.current ?? 0, 95),
    nextAction: "Keep only launch-blocking readability fixes; defer broad F/UI polish until foundation gates stabilize."
  },
  {
    id: "mock-signal-reading-flow",
    current: laneMap.get("Mock signal reading flow")?.current ?? 0,
    targetForMvpReview: 95,
    owner: "PM",
    status: laneStatus(laneMap.get("Mock signal reading flow")?.current ?? 0, 95),
    nextAction: "Ensure mock signal explanations remain non-advisory and clear enough for MVP validation."
  },
  {
    id: "runtime-state-guard",
    current: runtimeGuardLane?.current ?? 0,
    targetForMvpReview: 95,
    owner: "Engineering",
    status: laneStatus(runtimeGuardLane?.current ?? 0, 95),
    nextAction: "Keep fail-closed, mock-only, and route-health gates passing while promotion remains blocked."
  },
  {
    id: "supabase-schema-repository-readiness",
    current: laneMap.get("Supabase schema / repository readiness")?.current ?? 0,
    targetForMvpReview: 95,
    owner: "Engineering",
    status: laneStatus(laneMap.get("Supabase schema / repository readiness")?.current ?? 0, 95),
    nextAction: "Keep schema/repository contracts ready, but do not run SQL or writes before a separate gate."
  },
  {
    id: "data-freshness-quality-evidence",
    current: dataLane?.current ?? 0,
    targetForMvpReview: 95,
    owner: "Data",
    status: dataCoverageRouteReady ? "route_defined_still_below_target" : "blocked",
    nextAction:
      "Turn aggregate_count_incomplete into a coverage route: source-specific backfill design, report-only dry-run plan, source rights, QA, and no-write preflight."
  },
  {
    id: "investment-credibility-evidence",
      current: investmentLane?.current ?? 0,
      targetForMvpReview: 80,
      owner: "Investment",
      status:
        investmentReadiness.status === "local_investment_review_ready_not_real_scoring"
          ? "local_review_ready_still_below_target"
          : "largest_non_data_gap",
      nextAction:
        "Raise model credibility evidence with interpretation limits, downgrade policy, backtest/disclaimer boundaries, and non-advisory wording."
  },
  {
    id: "ceo-execution-focus",
    current: laneMap.get("CEO execution focus")?.current ?? 0,
    targetForMvpReview: 90,
    owner: "CEO",
    status: laneStatus(laneMap.get("CEO execution focus")?.current ?? 0, 90),
    nextAction: "Keep larger coherent slices and route A1/A2/I support into PM integration instead of micro-gates."
  },
  {
    id: "devops-health-recovery",
    current: devopsLane?.current ?? 0,
    targetForMvpReview: 95,
    owner: "Engineering",
    status: laneStatus(devopsLane?.current ?? 0, 95),
    nextAction: "Keep build, TypeScript, localhost recovery, full health, and review gates stable."
  }
];

const report = {
  mode: "overall_project_100_readiness",
  status: currentOverallPercent >= 100 ? "mvp_100_readiness_complete" : "mvp_100_readiness_in_progress",
  generatedAt: new Date().toISOString(),
  currentOverallPercent,
  targetOverallPercent: 100,
  dataReadinessPercent,
  ceoVerdict:
    "Do not spend the next high-value slice on visual polish. The shortest route to 100% is data coverage route closure plus investment credibility evidence, while keeping runtime, health, and mock boundaries stable.",
  pmNextShortestPath:
    "Execute a larger local-only blocker-closure slice: integrate data coverage route readiness, source-rights decision inputs, model credibility evidence, and review-gate checks without SQL, writes, raw data, or real-source promotion.",
  readinessLanes,
  currentTopGaps: [
    {
      id: "investment-credibility-evidence",
      current: investmentReadiness.readinessPercent ?? investmentLane?.current ?? 0,
      targetForMvpReview: 80,
      reason: "Local review evidence exists, but real-score or professional indicator credibility cannot be claimed without stronger model/backtest and public-claim evidence.",
      nextAction: "Run and integrate model credibility local review / acceptance evidence before any real-score candidacy."
    },
    {
      id: "data-coverage-route",
      current: dataReadinessPercent,
      targetForMvpReview: 100,
      reason: "Bounded readonly attempt is accepted, but aggregate row coverage is incomplete.",
      nextAction: "Prepare source-specific backfill / ingestion design gate as report-only work."
    },
    {
      id: "source-rights-disclosure",
      current: progress.project?.blockerClosureReadiness?.closurePercent ?? 0,
      targetForMvpReview: 100,
      reason: "Source-specific rights and public disclosure approval remain prerequisites for promotion.",
      nextAction: "Use source-rights local review and provider terms rollup as the next decision input."
    }
  ],
  completionDefinition: {
    projectProgress: "all lanes meet MVP review targets or have explicit not-in-MVP decision",
    dataCoverageRoute: dataCoverageRouteReady
      ? "route_defined_from_accepted_bounded_readonly_evidence"
      : "route_missing",
    runtimeHealth: progress.status === "local_ready_remote_paused" ? "local_ready_mock_remote_paused" : "not_ready",
    mockRealBoundary: promotionBoundariesOk ? "mock_boundaries_preserved" : "boundary_violation",
    dataSourcePromotion: "not_approved",
    scoreSourcePromotion: "not_approved"
  },
  safety: {
    automatedRemoteRun: false,
    connectionAttempted: false,
    ingestionStarted: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sqlExecuted: false,
    supabaseWritesEnabled: false
  },
  stillBlocked: [
    "SQL execution",
    "Supabase writes",
    "staging row writes",
    "daily_prices writes",
    "raw market data fetch or ingestion",
    "printing secrets or row payloads",
    "publicDataSource=supabase",
    "scoreSource=real",
    "public real-data claims",
    "investment-advice claims"
  ],
  sourceReports: [
    "scripts/report-project-progress-snapshot.mjs",
    "scripts/report-data-goal-readiness.mjs",
    "scripts/report-data-goal-completion-audit.mjs",
    "scripts/report-investment-credibility-mvp-readiness.mjs"
  ],
  stopLine:
    "This overall readiness report does not connect to Supabase, run SQL, write data, fetch market data, print secrets, promote publicDataSource=supabase, or set scoreSource=real."
};

console.log(JSON.stringify(report, null, 2));

function laneStatus(current, target) {
  if (current >= target) return "mvp_review_ready";
  if (current >= target - 10) return "near_mvp_review_ready";
  return "needs_work";
}

function runJson(script) {
  const run = spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (run.status !== 0) {
    throw new Error(`${script} failed: ${run.stderr.trim()}`);
  }

  return JSON.parse(run.stdout);
}
