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
  [componentPath, "Mock signals are available for reading"],
  [componentPath, "useful for checking product flow, risk direction"],
  [componentPath, "scoreSource=real remain blocked"],
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
  [componentPath, "not market-data quality or real-score approval"],
  [componentPath, "runtime-next-links"],
  [componentPath, "查看標的頁"],
  [componentPath, "查看晨報"],
  [componentPath, "了解 mock 邊界"],
  [componentPath, "展開 runtime 細節、邊界與下一步依據"],
  [componentPath, "公開畫面維持"],
  [componentPath, "readonly 證據只代表連線與物件可達"],
  [componentPath, "推進節奏"],
  [componentPath, "可用狀態"],
  [componentPath, "尚未開放"],
  [componentPath, "專案進度"],
  [componentPath, "下一步"],
  [componentPath, "被擋住的升級"],
  [componentPath, "來源深度"],
  [componentPath, "Runtime 解讀"],
  [componentPath, "必要切點"],
  [componentPath, "狀態一致性"],
  [componentPath, "Fail-closed"],
  [componentPath, "任何 gate 未通過時"],
  [componentPath, "唯讀後下一關"],
  [componentPath, "Readonly 證據"],
  [componentPath, "封鎖項目準備度"],
  [componentPath, "失敗即封鎖規則"],
  [componentPath, "未通過 gate 就維持 mock"],
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
  [componentPath, "蝟餌"],
  [componentPath, "擐"],
  [componentPath, "鞈"],
  [componentPath, "撠"],
  [componentPath, "銝"],
  [componentPath, "憭望"],
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

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}
