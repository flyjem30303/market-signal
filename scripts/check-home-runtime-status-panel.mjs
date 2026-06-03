import fs from "node:fs";

const componentPath = "src/components/home-runtime-status-panel.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const actionSummaryPath = "src/lib/home-runtime-action-summary.ts";
const consistencyPath = "src/lib/runtime-state-consistency.ts";
const failClosedPath = "src/lib/runtime-fail-closed.ts";
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
    productSummaryPath,
    cssPath,
    packagePath,
    reviewGatePath
  ].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [componentPath, "HomeRuntimeStatusPanel"],
  [componentPath, "getRuntimeReadinessSummary"],
  [componentPath, "getBlockerReadinessSummary"],
  [componentPath, "getRuntimeInterpretationSummary"],
  [componentPath, "getSourceDepthBlockerSummary"],
  [componentPath, "getPublicRuntimeBoundaryCopy"],
  [componentPath, "getRuntimeDeliveryCadence"],
  [componentPath, "getHomeRuntimeActionSummary"],
  [componentPath, "getRuntimeStateConsistencySummary"],
  [componentPath, "getRuntimeFailClosedSummary"],
  [componentPath, "actionSummary.currentProgressPercent"],
  [componentPath, "actionSummary.stage"],
  [componentPath, "actionSummary.nextLift"],
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
  [componentPath, "Mock signals are available for reading"],
  [componentPath, "fail-closed rules available for review"],
  [componentPath, "useful for checking product flow, risk direction"],
  [componentPath, "Runtime details: review state and blocked upgrades"],
  [componentPath, "the first screen stays focused on what users can safely read now"],
  [componentPath, "Blocker readiness"],
  [componentPath, "blockerReadiness.status"],
  [componentPath, "Data / Legal / Investment checklists are local-ready"],
  [componentPath, "runtimeInterpretation.decision"],
  [componentPath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [componentPath, "runtimeInterpretation.stopLine"],
  [componentPath, "scoreSource"],
  [componentPath, "selectedSymbol"],
  [componentPath, "/briefing"],
  [actionSummaryPath, "HomeRuntimeActionSummary"],
  [actionSummaryPath, "getHomeRuntimeActionSummary"],
  [actionSummaryPath, "currentProgressPercent: 72"],
  [actionSummaryPath, "nextAction: \"post-readonly runtime decision\""],
  [actionSummaryPath, "blockedTransition: \"real-score transition\""],
  [actionSummaryPath, "publicDataSource or scoreSource without a separate gate"],
  [productSummaryPath, "Use mock signals for reading only"],
  [productSummaryPath, "Real-data claims are not live"],
  [productSummaryPath, "Decide post-readonly runtime interpretation"],
  [productSummaryPath, "mock-only signal reading, risk sorting, and product-flow validation"],
  [productSummaryPath, "Real market data, Supabase-backed public data, SQL scoring"],
  [consistencyPath, "RuntimeStateConsistencySummary"],
  [consistencyPath, "getRuntimeStateConsistencySummary"],
  [consistencyPath, "consistencyState: \"mock_consistent\""],
  [failClosedPath, "RuntimeFailClosedSummary"],
  [failClosedPath, "getRuntimeFailClosedSummary"],
  [failClosedPath, "failClosedState: \"active\""],
  [dashboardPath, "import { HomeRuntimeStatusPanel }"],
  [dashboardPath, "<HomeRuntimeStatusPanel selectedSymbol={selected.symbol} />"],
  [cssPath, ".home-runtime-status-panel"],
  [cssPath, "repeat(auto-fit, minmax(150px"],
  [cssPath, ".runtime-boundary-copy-card"],
  [cssPath, ".runtime-fail-closed-card"],
  [cssPath, ".home-runtime-status-panel article.readying"],
  [cssPath, ".home-runtime-status-panel article.blocked"],
  [cssPath, ".home-runtime-action-strip"],
  [packagePath, "\"check:home-runtime-status-panel\": \"node scripts/check-home-runtime-status-panel.mjs\""],
  [reviewGatePath, "scripts/check-home-runtime-status-panel.mjs"]
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
