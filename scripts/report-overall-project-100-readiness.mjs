import { spawnSync } from "node:child_process";

const progress = runJson("scripts/report-project-progress-snapshot.mjs");
const dataGoal = runJson("scripts/report-data-goal-readiness.mjs");
const completionAudit = runJson("scripts/report-data-goal-completion-audit.mjs");
const dataQualityReadiness = runJson("scripts/report-data-freshness-quality-mvp-readiness.mjs");
const investmentReadiness = runJson("scripts/report-investment-credibility-mvp-readiness.mjs");
const sourceRightsReadiness = runJson("scripts/report-source-rights-mvp-readiness.mjs");

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
    current: dataQualityReadiness.upgradedReadinessPercent ?? dataLane?.current ?? 0,
    targetForMvpReview: 95,
    owner: "Data",
    status:
      dataQualityReadiness.status === "local_data_quality_route_ready_promotion_blocked"
        ? "local_route_ready_promotion_blocked"
        : "blocked",
    nextAction:
      "Turn aggregate_count_incomplete into a coverage route: source-specific backfill design, report-only dry-run plan, source rights, QA, and no-write preflight."
  },
  {
    id: "investment-credibility-evidence",
      current: investmentLane?.current ?? 0,
      targetForMvpReview: 80,
      owner: "Investment",
      status:
        investmentReadiness.status === "local_investment_review_ready_not_real_scoring" &&
        (investmentReadiness.readinessPercent ?? 0) >= 80
          ? "mvp_review_ready_not_real_scoring"
          : "local_review_ready_still_below_target",
      nextAction:
        "Keep investment claims as local review material only; do not approve real scoring, rankings, advice, or performance claims."
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
    "Investment credibility has reached MVP review target as local-only claim readiness. Do not spend the next high-value slice on visual polish; the shortest route to 100% is data freshness/quality, data coverage route closure, and source-rights approval readiness while keeping runtime, health, and mock boundaries stable.",
  pmNextShortestPath:
    "Execute a larger local-only blocker-closure slice: integrate data quality coverage route readiness, source-rights decision inputs, and review-gate checks without SQL, writes, raw data, or real-source promotion.",
  readinessLanes,
  currentTopGaps: [
    {
      id: "data-freshness-quality-evidence",
      current: dataQualityReadiness.upgradedReadinessPercent ?? dataLane?.current ?? 0,
      targetForMvpReview: 95,
      reason: "The data lane is still below MVP review target because row coverage, data quality threshold, source rights, and source-depth remain incomplete.",
      nextAction: "Prepare a no-write data coverage and quality route that can be reviewed before any Supabase write, ingestion, or source promotion."
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
      current: sourceRightsReadiness.readinessPercent ?? progress.project?.blockerClosureReadiness?.closurePercent ?? 0,
      targetForMvpReview: 100,
      reason: "Local source-rights review exists, but external provider terms, redistribution, public-source claims, and source-specific public copy remain unapproved.",
      nextAction: "Connect source-specific terms classification and attribution placement to the data coverage route before any source promotion."
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
    "scripts/report-data-freshness-quality-mvp-readiness.mjs",
    "scripts/report-data-goal-completion-audit.mjs",
    "scripts/report-investment-credibility-mvp-readiness.mjs",
    "scripts/report-source-rights-mvp-readiness.mjs"
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
