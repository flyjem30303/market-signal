import fs from "node:fs";

const componentPath = "src/components/stock-runtime-at-a-glance.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const actionSummaryPath = "src/lib/home-runtime-action-summary.ts";
const consistencyPath = "src/lib/runtime-state-consistency.ts";
const failClosedPath = "src/lib/runtime-fail-closed.ts";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, dashboardPath, actionSummaryPath, consistencyPath, failClosedPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [componentPath, "StockRuntimeAtAGlance"],
  [componentPath, "getRuntimeReadinessSummary"],
  [componentPath, "getBlockerReadinessSummary"],
  [componentPath, "getRowCoverageSecondAttemptReadiness"],
  [componentPath, "getRuntimeInterpretationSummary"],
  [componentPath, "getSourceDepthBlockerSummary"],
  [componentPath, "getPublicRuntimeBoundaryCopy"],
  [componentPath, "getRuntimeDeliveryCadence"],
  [componentPath, "getHomeRuntimeActionSummary"],
  [componentPath, "getRuntimeStateConsistencySummary"],
  [componentPath, "getRuntimeFailClosedSummary"],
  [componentPath, "stock-runtime-action-strip"],
  [componentPath, "Stock CEO next runtime action summary"],
  [componentPath, "actionSummary.currentProgressPercent"],
  [componentPath, "actionSummary.nextAction"],
  [componentPath, "actionSummary.blockedTransition"],
  [componentPath, "actionSummary.safetyStopLine"],
  [componentPath, "runtime-product-summary"],
  [componentPath, "productSummary.useNow"],
  [componentPath, "productSummary.notLiveYet"],
  [componentPath, "productSummary.nextGate"],
  [componentPath, "runtime-boundary-copy-card"],
  [componentPath, "runtime-delivery-card"],
  [componentPath, "runtime-cutpoint-card"],
  [componentPath, "runtimeDeliveryCadence.nextExecutionRatio"],
  [componentPath, "runtimeDeliveryCadence.mandatoryCutpoints"],
  [componentPath, "runtimeStateConsistency.consistencyState"],
  [componentPath, "runtimeStateConsistency.statusLine"],
  [componentPath, "runtime-consistency-card"],
  [componentPath, "failClosed.failClosedState"],
  [componentPath, "failClosed.blockedActions"],
  [componentPath, "runtime-fail-closed-card"],
  [componentPath, "boundaryCopy.currentState"],
  [componentPath, "boundaryCopy.blockedState"],
  [componentPath, "is mock-only runtime"],
  [componentPath, "product-readable runtime status"],
  [componentPath, "scoreSource=real is not enabled"],
  [componentPath, "Row coverage"],
  [componentPath, "sourceDepth.sourceDepthState"],
  [componentPath, "sourceDepth.stopLine"],
  [componentPath, "Blocker readiness"],
  [componentPath, "blockerReadiness.status"],
  [componentPath, "Data / Legal / Investment checklists are local-ready"],
  [componentPath, "readiness.score"],
  [componentPath, "rowCoverage.nextDecision"],
  [componentPath, "runtimeInterpretation.decision"],
  [componentPath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [componentPath, "runtimeInterpretation.stopLine"],
  [actionSummaryPath, "HomeRuntimeActionSummary"],
  [actionSummaryPath, "getHomeRuntimeActionSummary"],
  [actionSummaryPath, "currentProgressPercent: 68"],
  [actionSummaryPath, "nextAction: \"mock runtime hardening\""],
  [actionSummaryPath, "blockedTransition: \"real-score transition\""],
  [consistencyPath, "RuntimeStateConsistencySummary"],
  [consistencyPath, "getRuntimeStateConsistencySummary"],
  [consistencyPath, "consistencyState: \"mock_consistent\""],
  [failClosedPath, "RuntimeFailClosedSummary"],
  [failClosedPath, "getRuntimeFailClosedSummary"],
  [failClosedPath, "failClosedState: \"active\""],
  [dashboardPath, "import { StockRuntimeAtAGlance }"],
  [dashboardPath, "<StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />"],
  [cssPath, ".stock-runtime-at-a-glance"],
  [cssPath, "repeat(auto-fit, minmax(150px"],
  [cssPath, ".runtime-boundary-copy-card"],
  [cssPath, ".runtime-fail-closed-card"],
  [cssPath, ".compact-runtime-blocker"],
  [cssPath, ".stock-runtime-at-a-glance article.active"],
  [cssPath, ".stock-runtime-at-a-glance article.blocked"],
  [cssPath, ".stock-runtime-at-a-glance article.readying"],
  [cssPath, ".stock-runtime-action-strip"],
  [packagePath, "\"check:stock-runtime-at-a-glance\": \"node scripts/check-stock-runtime-at-a-glance.mjs\""],
  [reviewGatePath, "scripts/check-stock-runtime-at-a-glance.mjs"]
];

const forbidden = [
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, "process.env"],
  [componentPath, "scoreSource: \"real\""],
  [componentPath, "project-progress-score"],
  [actionSummaryPath, "@supabase/supabase-js"],
  [actionSummaryPath, "createClient"],
  [actionSummaryPath, "fetch("],
  [actionSummaryPath, "process.env"],
  [actionSummaryPath, "node:fs"],
  [actionSummaryPath, "from \"fs\""],
  [actionSummaryPath, "scoreSource: \"real\""],
  [consistencyPath, "@supabase/supabase-js"],
  [consistencyPath, "createClient"],
  [consistencyPath, "fetch("],
  [consistencyPath, "process.env"],
  [consistencyPath, "node:fs"],
  [consistencyPath, "from \"fs\""],
  [consistencyPath, "scoreSource: \"real\""],
  [failClosedPath, "@supabase/supabase-js"],
  [failClosedPath, "createClient"],
  [failClosedPath, "fetch("],
  [failClosedPath, "process.env"],
  [failClosedPath, "node:fs"],
  [failClosedPath, "from \"fs\""],
  [failClosedPath, "scoreSource: \"real\""],
  [failClosedPath, "publicDataSource: \"supabase\""],
  [dashboardPath, "scoreSource=\"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
