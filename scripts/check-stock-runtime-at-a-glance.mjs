import fs from "node:fs";

const componentPath = "src/components/stock-runtime-at-a-glance.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const actionSummaryPath = "src/lib/home-runtime-action-summary.ts";
const decisionSummaryPath = "src/lib/runtime-decision-summary.ts";
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
    decisionSummaryPath,
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
  [componentPath, "getRuntimeDecisionSummary"],
  [componentPath, "getRuntimeStateConsistencySummary"],
  [componentPath, "getRuntimeFailClosedSummary"],
  [componentPath, "getStockRuntimeHeadlineSummary"],
  [componentPath, "getFreshnessReadonlyLatestEvidenceSummary"],
  [componentPath, "getRuntimeExecutionReadinessSummary"],
  [componentPath, "getRuntimeActionStatusSummary"],
  [componentPath, "RuntimeTransitionRail"],
  [componentPath, "PublicRuntimeStateStrip"],
  [componentPath, "TrackedLink"],
  [componentPath, "has a readable mock signal"],
  [componentPath, "mock score, risk direction, and disclosure state"],
  [componentPath, "scoreSource=real still require separate accepted gates"],
  [componentPath, "stock-runtime-headline-summary"],
  [componentPath, "Stock decision aid groups"],
  [componentPath, "runtime-product-summary"],
  [componentPath, "productSummary.useNow.displayLabel"],
  [componentPath, "productSummary.notLiveYet.displayLabel"],
  [componentPath, "productSummary.nextGate.displayLabel"],
  [componentPath, "productSummary.readonlyDecision.displayLabel"],
  [componentPath, "Runtime action status normalization"],
  [componentPath, "runtime-action-status-strip"],
  [componentPath, "runtime-execution-readiness-card"],
  [componentPath, "runtime-next-links"],
  [componentPath, "查看晨報"],
  [componentPath, "了解 mock 邊界"],
  [componentPath, "回到首頁"],
  [componentPath, "stock-runtime-action-strip"],
  [componentPath, "專案進度"],
  [componentPath, "下一步"],
  [componentPath, "被擋住的升級"],
  [componentPath, "stock-runtime-governance-details"],
  [componentPath, "治理摘要"],
  [componentPath, "公開頁面仍停在 mock runtime"],
  [componentPath, "尚未宣稱真實市場資料"],
  [componentPath, "任何升級都要等獨立 gate 接受"],
  [componentPath, "scoreSource=real is not enabled"],
  [componentPath, "Readonly result"],
  [componentPath, "Freshness metadata"],
  [componentPath, "not market-data quality or scoreSource=real approval"],
  [componentPath, "來源深度"],
  [componentPath, "推進節奏"],
  [componentPath, "可用狀態"],
  [componentPath, "尚未開放"],
  [componentPath, "Fail-closed"],
  [componentPath, "下一個 runtime gate"],
  [componentPath, "Runtime 解讀"],
  [componentPath, "必要切點"],
  [componentPath, "狀態一致性"],
  [componentPath, "Readonly 證據"],
  [componentPath, "封鎖項目"],
  [componentPath, "decisionSummary.currentProgressPercent"],
  [componentPath, "runtimeDeliveryCadence.nextExecutionRatio"],
  [componentPath, "runtimeDeliveryCadence.mandatoryCutpoints"],
  [componentPath, "runtimeStateConsistency.consistencyState"],
  [componentPath, "failClosed.failClosedState"],
  [componentPath, "failClosed.blockedActions"],
  [componentPath, "blockerReadiness.status"],
  [componentPath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [componentPath, "runtimeInterpretation.stopLine"],
  [productSummaryPath, "Use mock signals for reading only"],
  [productSummaryPath, "Real-data claims are not live"],
  [headlineSummaryPath, "StockRuntimeHeadlineSummary"],
  [headlineSummaryPath, "decisionAidGroups"],
  [headlineSummaryPath, "does not approve publicDataSource=supabase"],
  [decisionSummaryPath, "publicDataSource: \"mock\""],
  [decisionSummaryPath, "scoreSource: \"mock\""],
  [consistencyPath, "consistencyState: \"mock_consistent\""],
  [failClosedPath, "failClosedState: \"active\""],
  [dashboardPath, "import { StockRuntimeAtAGlance }"],
  [dashboardPath, "<StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />"],
  [cssPath, ".stock-runtime-at-a-glance"],
  [cssPath, ".stock-runtime-headline-summary"],
  [cssPath, ".stock-decision-aid-groups"],
  [cssPath, ".stock-runtime-governance-details"],
  [cssPath, ".runtime-boundary-copy-card"],
  [cssPath, ".runtime-fail-closed-card"],
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
  [componentPath, "publicDataSource: \"supabase\""],
  [componentPath, "getHomeRuntimeActionSummary"],
  [componentPath, "銝"],
  [componentPath, "撠"],
  [componentPath, "鞈"],
  [componentPath, "憭望"],
  [actionSummaryPath, "scoreSource: \"real\""],
  [consistencyPath, "scoreSource: \"real\""],
  [failClosedPath, "scoreSource: \"real\""],
  [failClosedPath, "publicDataSource: \"supabase\""],
  [headlineSummaryPath, "scoreSource: \"real\""],
  [headlineSummaryPath, "publicDataSource: \"supabase\""],
  [dashboardPath, "scoreSource=\"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}
