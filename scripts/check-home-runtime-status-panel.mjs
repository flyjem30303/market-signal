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
  [componentPath, "查看個股燈號"],
  [componentPath, "查看市場晨報"],
  [componentPath, "了解 mock 方法"],
  [componentPath, "查看 runtime 邊界、推進比例與阻塞項目"],
  [componentPath, "Supabase readonly"],
  [componentPath, "不能直接升級公開資料來源"],
  [componentPath, "推進比例"],
  [componentPath, "目前可用"],
  [componentPath, "仍被阻塞"],
  [componentPath, "真實資料與正式分數仍未開放"],
  [componentPath, "專案進度"],
  [componentPath, "下一步"],
  [componentPath, "禁止升級"],
  [componentPath, "來源深度"],
  [componentPath, "Row coverage"],
  [componentPath, "Runtime 解讀"],
  [componentPath, "必要切點"],
  [componentPath, "保留必要 gate，但避免過細切片"],
  [componentPath, "狀態一致性"],
  [componentPath, "Fail-closed"],
  [componentPath, "任何 gate 未通過時"],
  [componentPath, "Readonly 後狀態"],
  [componentPath, "Readonly 證據"],
  [componentPath, "阻塞項目"],
  [componentPath, "升級條件"],
  [componentPath, "下一個 gate 通過前維持 mock"],
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
  [componentPath, "�"],
  [componentPath, "嚙"],
  [componentPath, "稽"],
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
const privateUseHits = findPrivateUseHits(read(componentPath));
for (const hit of privateUseHits) blocked.push(`${componentPath}: private-use code point ${hit}`);

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}

function findPrivateUseHits(text) {
  const hits = new Set();
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code === undefined) continue;
    if (
      (code >= 0xe000 && code <= 0xf8ff) ||
      (code >= 0xf0000 && code <= 0xffffd) ||
      (code >= 0x100000 && code <= 0x10fffd)
    ) {
      hits.add(`U+${code.toString(16).toUpperCase()}`);
    }
  }
  return [...hits];
}
