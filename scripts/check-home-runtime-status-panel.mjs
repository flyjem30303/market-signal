import fs from "node:fs";

const componentPath = "src/components/home-runtime-status-panel.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, dashboardPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [componentPath, "HomeRuntimeStatusPanel"],
  [componentPath, "getRuntimeReadinessSummary"],
  [componentPath, "getBlockerReadinessSummary"],
  [componentPath, "getRuntimeInterpretationSummary"],
  [componentPath, "getSourceDepthBlockerSummary"],
  [componentPath, "getPublicRuntimeBoundaryCopy"],
  [componentPath, "getRuntimeDeliveryCadence"],
  [componentPath, "runtime-boundary-copy-card"],
  [componentPath, "runtime-delivery-card"],
  [componentPath, "runtime-cutpoint-card"],
  [componentPath, "runtimeDeliveryCadence.nextExecutionRatio"],
  [componentPath, "runtimeDeliveryCadence.mandatoryCutpoints"],
  [componentPath, "boundaryCopy.currentState"],
  [componentPath, "boundaryCopy.blockedState"],
  [componentPath, "mock-only runtime"],
  [componentPath, "目前仍是 mock-only runtime"],
  [componentPath, "CEO 已把推進節奏調整為較大的 runtime product slice"],
  [componentPath, "Blocker readiness"],
  [componentPath, "blockerReadiness.status"],
  [componentPath, "Data / Legal / Investment checklists are local-ready"],
  [componentPath, "runtimeInterpretation.decision"],
  [componentPath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [componentPath, "runtimeInterpretation.stopLine"],
  [componentPath, "scoreSource"],
  [componentPath, "selectedSymbol"],
  [componentPath, "/briefing"],
  [dashboardPath, "import { HomeRuntimeStatusPanel }"],
  [dashboardPath, "<HomeRuntimeStatusPanel selectedSymbol={selected.symbol} />"],
  [cssPath, ".home-runtime-status-panel"],
  [cssPath, "repeat(auto-fit, minmax(150px"],
  [cssPath, ".runtime-boundary-copy-card"],
  [cssPath, ".home-runtime-status-panel article.readying"],
  [cssPath, ".home-runtime-status-panel article.blocked"],
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
