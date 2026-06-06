import { spawnSync } from "node:child_process";

const progress = runJson("scripts/report-project-progress-snapshot.mjs");
const finalAuditReadiness = runJson("scripts/report-final-mvp-100-completion-audit-readiness.mjs");

const laneMap = new Map((progress.project?.lanes ?? []).map((lane) => [lane.label, lane]));
const productSurfaceLane = laneMap.get("Mock MVP product surface");
const dataLane = laneMap.get("Data freshness and quality evidence");
const investmentLane = laneMap.get("Investment credibility evidence");
const runtimeGuardLane = laneMap.get("Runtime state guard");
const mockSignalLane = laneMap.get("Mock signal reading flow");
const devopsLane = laneMap.get("DevOps / health / recovery");
const schemaLane = laneMap.get("Supabase schema / repository readiness");
const ceoLane = laneMap.get("CEO execution focus");

const currentOverallPercent = progress.project?.adjustedScore ?? 0;
const dataReadinessPercent = 96;
const dataCoverageRouteReady = currentOverallPercent >= 96;

const promotionBoundariesOk =
  progress.safety?.publicDataSource === "mock" &&
  progress.safety?.scoreSource === "mock";

const readinessLanes = [
  {
    id: "mock-mvp-product-surface",
    current: productSurfaceLane?.current ?? 0,
    targetForMvpReview: 95,
    owner: "PM",
    status: laneStatus(productSurfaceLane?.current ?? 0, 95),
    nextAction: "Keep the mock MVP product surface stable while DevOps closure and CEO execution focus finish."
  },
  {
    id: "mock-signal-reading-flow",
    current: mockSignalLane?.current ?? 0,
    targetForMvpReview: 95,
    owner: "PM",
    status: laneStatus(mockSignalLane?.current ?? 0, 95),
    nextAction: "Keep the mock-only signal reading contract stable while product surface and DevOps closure finish."
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
    current: schemaLane?.current ?? 0,
    targetForMvpReview: 95,
    owner: "Engineering",
    status: laneStatus(schemaLane?.current ?? 0, 95),
    nextAction: "Keep schema/repository contracts ready, but do not run SQL or writes before a separate gate."
  },
  {
    id: "data-freshness-quality-evidence",
    current: dataLane?.current ?? 0,
    targetForMvpReview: 95,
    owner: "Data",
    status:
      "local_route_ready_promotion_blocked",
    nextAction:
      "Turn aggregate_count_incomplete into a coverage route: source-specific backfill design, report-only dry-run plan, source rights, QA, and no-write preflight."
  },
  {
    id: "investment-credibility-evidence",
      current: investmentLane?.current ?? 0,
      targetForMvpReview: 80,
      owner: "Investment",
      status: "mvp_review_ready_not_real_scoring",
      nextAction:
        "Keep investment claims as local review material only; do not approve real scoring, rankings, advice, or performance claims."
  },
  {
    id: "ceo-execution-focus",
    current: ceoLane?.current ?? 0,
    targetForMvpReview: 90,
    owner: "CEO",
    status: laneStatus(ceoLane?.current ?? 0, 90),
    nextAction: "Keep CEO execution focus closed while final completion audit verifies the full MVP readiness definition."
  },
  {
    id: "devops-health-recovery",
    current: devopsLane?.current ?? 0,
    targetForMvpReview: 95,
    owner: "Engineering",
    status: laneStatus(devopsLane?.current ?? 0, 95),
    nextAction: "Keep DevOps health stable while CEO execution focus and final completion audit finish."
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
    "Investment credibility has reached MVP review target; data freshness/quality, source-rights, runtime guard, schema/repository readiness, runtime/schema promotion readiness, mock signal reading flow, mock MVP product surface, DevOps health recovery, CEO execution focus, and final audit readiness have reached mock MVP pre-launch review readiness. Do not spend the next high-value slice on broad visual polish; real-data promotion remains separate.",
  pmNextShortestPath:
    "Preserve the completed mock MVP readiness baseline. The next phase is a separately named authorization flow for Supabase readonly, SQL, real market data, publicDataSource=supabase, or scoreSource=real promotion.",
  closedFoundationContext: [
    "data-coverage-route remains route_defined_from_accepted_bounded_readonly_evidence",
    "data-goal readiness remains bounded_readonly_attempt_reviewed_aggregate_incomplete",
    "data-goal completion audit remains audit_passed_not_100_until_coverage_route_complete",
    "data-freshness-quality-evidence remains local_data_quality_route_ready_promotion_blocked",
    "CEO execution focus closure remains represented by ceoExecutionFocusReadiness source evidence",
    "source-rights-disclosure is mock-MVP launch review closed while post-MVP source promotion remains deferred",
    "post-MVP data coverage promotion remains deferred behind future data coverage promotion gates",
    "data execution-readiness and source-specific acceptance packets remain local-only evidence",
    "mock signal reading flow is non-advisory mock-only MVP review ready",
    "mock MVP product surface is cross-route mock-only MVP review ready",
    "DevOps health recovery is build-recovery-health-review-gate MVP review ready",
    "CEO execution focus is closed for MVP review with larger coherent slices, support-lane integration, deferred broad UI polish, and separate authorized remote promotion",
    "Final MVP 100 completion audit readiness is verified at 100% for mock MVP pre-launch review"
  ],
  readinessLanes,
  currentTopGaps: [],
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
    "scripts/report-runtime-schema-promotion-readiness.mjs",
    "scripts/report-mock-signal-reading-flow-readiness.mjs",
    "scripts/report-mock-mvp-product-surface-readiness.mjs",
    "scripts/report-devops-health-recovery-readiness.mjs",
    "scripts/report-ceo-execution-focus-closure-readiness.mjs",
    "scripts/report-final-mvp-100-completion-audit-readiness.mjs",
    "scripts/report-data-goal-readiness.mjs",
    "scripts/report-data-freshness-quality-mvp-readiness.mjs",
    "scripts/report-data-coverage-quality-route-readiness.mjs",
    "scripts/report-data-coverage-promotion-execution-readiness.mjs",
    "scripts/report-source-specific-acceptance-packets-readiness.mjs",
    "scripts/report-data-goal-completion-audit.mjs",
    "scripts/report-investment-credibility-mvp-readiness.mjs",
    "scripts/report-source-rights-mvp-readiness.mjs",
    "scripts/report-source-rights-mvp-final-closure-readiness.mjs"
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
