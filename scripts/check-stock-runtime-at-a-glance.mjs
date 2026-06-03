import fs from "node:fs";

const componentPath = "src/components/stock-runtime-at-a-glance.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const actionSummaryPath = "src/lib/home-runtime-action-summary.ts";
const consistencyPath = "src/lib/runtime-state-consistency.ts";
const failClosedPath = "src/lib/runtime-fail-closed.ts";
const headlineSummaryPath = "src/lib/stock-runtime-headline-summary.ts";
const productSummaryPath = "src/lib/runtime-product-summary.ts";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [
    componentPath,
    dashboardPath,
    actionSummaryPath,
    consistencyPath,
    failClosedPath,
    headlineSummaryPath,
    productSummaryPath,
    cssPath,
    packagePath,
    reviewGatePath
  ].map((file) => [file, fs.readFileSync(file, "utf8")])
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
  [componentPath, "getStockRuntimeHeadlineSummary"],
  [componentPath, "getFreshnessReadonlyLatestEvidenceSummary"],
  [componentPath, "stock-runtime-headline-summary"],
  [componentPath, "Stock runtime headline summary"],
  [componentPath, "stock-decision-aid-groups"],
  [componentPath, "Stock decision aid groups"],
  [componentPath, "headlineSummary.decisionAidGroups"],
  [componentPath, "headlineSummary.items"],
  [componentPath, "headlineSummary.stopLine"],
  [componentPath, "stock-runtime-governance-details"],
  [componentPath, "Stock runtime governance details"],
  [componentPath, "upgrade blockers stay below the reading summary"],
  [componentPath, "first screen into an internal checklist"],
  [headlineSummaryPath, "StockRuntimeHeadlineSummary"],
  [headlineSummaryPath, "getStockRuntimeHeadlineSummary"],
  [headlineSummaryPath, "decisionAidGroups"],
  [headlineSummaryPath, "Can reference"],
  [headlineSummaryPath, "Display only"],
  [headlineSummaryPath, "Not live yet"],
  [headlineSummaryPath, "Mock composite score and risk direction"],
  [headlineSummaryPath, "Module health/risk ranking"],
  [headlineSummaryPath, "Freshness metadata reachability"],
  [headlineSummaryPath, "Good for product validation, not investment proof"],
  [headlineSummaryPath, "Blocked until separate accepted gates"],
  [headlineSummaryPath, "mock_runtime_readable"],
  [headlineSummaryPath, "real_data_blocked"],
  [headlineSummaryPath, "mock_runtime_hardening"],
  [headlineSummaryPath, "what can be read now, what remains blocked, and what review comes next"],
  [headlineSummaryPath, "does not approve publicDataSource=supabase"],
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
  [componentPath, "has a readable mock signal"],
  [componentPath, "mock score, risk direction, and disclosure state"],
  [componentPath, "scoreSource=real is not enabled"],
  [componentPath, "Row coverage"],
  [componentPath, "Freshness metadata"],
  [componentPath, "freshnessLatestEvidence.state"],
  [componentPath, "freshnessLatestEvidence.asOfDate"],
  [componentPath, "freshnessLatestEvidence.publicDataSource"],
  [componentPath, "freshnessLatestEvidence.scoreSource"],
  [componentPath, "Metadata"],
  [componentPath, "not market-data quality or scoreSource=real approval"],
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
  [productSummaryPath, "Use mock signals for reading only"],
  [productSummaryPath, "Real-data claims are not live"],
  [productSummaryPath, "Decide post-readonly runtime interpretation"],
  [productSummaryPath, "mock-only signal reading, risk sorting, and product-flow validation"],
  [productSummaryPath, "Real market data, Supabase-backed public data, SQL scoring"],
  [actionSummaryPath, "HomeRuntimeActionSummary"],
  [actionSummaryPath, "getHomeRuntimeActionSummary"],
  [actionSummaryPath, "currentProgressPercent: 72"],
  [actionSummaryPath, "nextAction: \"post-readonly runtime decision\""],
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
  [cssPath, ".stock-runtime-headline-summary"],
  [cssPath, ".stock-decision-aid-groups"],
  [cssPath, ".stock-decision-aid-groups article.active"],
  [cssPath, ".stock-decision-aid-groups article.readying"],
  [cssPath, ".stock-decision-aid-groups article.blocked"],
  [cssPath, ".stock-runtime-headline-summary article.active"],
  [cssPath, ".stock-runtime-headline-summary article.readying"],
  [cssPath, ".stock-runtime-headline-summary article.blocked"],
  [cssPath, ".stock-runtime-headline-stop-line"],
  [cssPath, ".stock-runtime-governance-details"],
  [cssPath, ".stock-runtime-governance-details > div"],
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
  [headlineSummaryPath, "@supabase/supabase-js"],
  [headlineSummaryPath, "createClient"],
  [headlineSummaryPath, "fetch("],
  [headlineSummaryPath, "process.env"],
  [headlineSummaryPath, "node:fs"],
  [headlineSummaryPath, "from \"fs\""],
  [headlineSummaryPath, "scoreSource: \"real\""],
  [headlineSummaryPath, "publicDataSource: \"supabase\""],
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
