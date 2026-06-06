import fs from "node:fs";

const componentPath = "src/components/home-runtime-status-panel.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const actionSummaryPath = "src/lib/home-runtime-action-summary.ts";
const decisionSummaryPath = "src/lib/runtime-decision-summary.ts";
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
    decisionSummaryPath,
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
  [componentPath, "getRuntimeDecisionSummary"],
  [componentPath, "getRuntimeStateConsistencySummary"],
  [componentPath, "getRuntimeFailClosedSummary"],
  [componentPath, "getFreshnessReadonlyLatestEvidenceSummary"],
  [componentPath, "getRuntimeExecutionReadinessSummary"],
  [componentPath, "getRuntimeActionStatusSummary"],
  [componentPath, "RuntimeTransitionRail"],
  [componentPath, "PublicRuntimeStateStrip"],
  [componentPath, "TrackedLink"],
  [componentPath, "目前可閱讀 mock 訊號"],
  [componentPath, "真實市場資料"],
  [componentPath, "scoreSource=real 仍需等待 PM 接受 gate"],
  [componentPath, "runtime-product-summary"],
  [componentPath, "productSummary.useNow.displayLabel"],
  [componentPath, "productSummary.notLiveYet.displayLabel"],
  [componentPath, "productSummary.nextGate.displayLabel"],
  [componentPath, "productSummary.readonlyDecision.displayLabel"],
  [componentPath, "Runtime action status normalization"],
  [componentPath, "runtime-action-status-strip"],
  [componentPath, "runtime-execution-readiness-card"],
  [componentPath, "post-readonly-runtime-card"],
  [componentPath, "Freshness metadata"],
  [componentPath, "does not approve market-data quality, live freshness, or real-score claims"],
  [componentPath, "查看個股 mock 訊號"],
  [componentPath, "查看公開狀態簡報"],
  [componentPath, "查看 mock 方法說明"],
  [componentPath, "查看 runtime 邊界、資料限制與下一步"],
  [componentPath, "這是覆蓋率 readiness，不是公開完整覆蓋率宣稱"],
  [componentPath, "資料可能缺值、延遲或部分覆蓋"],
  [componentPath, "公開內容只供資訊閱讀與產品理解"],
  [componentPath, "boundaryCopy.stopLine"],
  [componentPath, "decisionSummary.currentProgressPercent"],
  [componentPath, "runtimeDeliveryCadence.nextExecutionRatio"],
  [componentPath, "runtimeDeliveryCadence.mandatoryCutpoints"],
  [componentPath, "runtimeStateConsistency.consistencyState"],
  [componentPath, "failClosed.failClosedState"],
  [componentPath, "failClosed.blockedActions"],
  [componentPath, "blockerReadiness.status"],
  [componentPath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [componentPath, "runtimeInterpretation.stopLine"],
  [componentPath, "selectedSymbol"],
  [componentPath, "/briefing"],
  [decisionSummaryPath, "publicDataSource: \"mock\""],
  [decisionSummaryPath, "scoreSource: \"mock\""],
  [productSummaryPath, "Use mock signals for reading only"],
  [productSummaryPath, "Real-data claims are not live"],
  [consistencyPath, "consistencyState: \"mock_consistent\""],
  [failClosedPath, "failClosedState: \"active\""],
  [dashboardPath, "import { HomeRuntimeStatusPanel }"],
  [dashboardPath, "<HomeRuntimeStatusPanel selectedSymbol={selected.symbol} />"],
  [cssPath, ".home-runtime-status-panel"],
  [cssPath, ".runtime-boundary-copy-card"],
  [cssPath, ".runtime-fail-closed-card"],
  [cssPath, ".home-runtime-details"],
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
  [componentPath, "publicDataSource: \"supabase\""],
  [componentPath, "getHomeRuntimeActionSummary"],
  [actionSummaryPath, "@supabase/supabase-js"],
  [actionSummaryPath, "createClient"],
  [actionSummaryPath, "fetch("],
  [actionSummaryPath, "process.env"],
  [actionSummaryPath, "node:fs"],
  [actionSummaryPath, "scoreSource: \"real\""],
  [consistencyPath, "scoreSource: \"real\""],
  [failClosedPath, "scoreSource: \"real\""],
  [failClosedPath, "publicDataSource: \"supabase\""],
  [dashboardPath, "scoreSource=\"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
for (const hit of findMojibakeMarkers(read(componentPath))) blocked.push(`${componentPath}: ${hit}`);

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}

function findMojibakeMarkers(text) {
  const hits = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) hits.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) hits.push("question-mark-run");
  return hits;
}
