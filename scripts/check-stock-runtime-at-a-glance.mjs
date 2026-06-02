import fs from "node:fs";

const componentPath = "src/components/stock-runtime-at-a-glance.tsx";
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
  [componentPath, "StockRuntimeAtAGlance"],
  [componentPath, "getRuntimeReadinessSummary"],
  [componentPath, "getBlockerReadinessSummary"],
  [componentPath, "getRowCoverageSecondAttemptReadiness"],
  [componentPath, "getRuntimeInterpretationSummary"],
  [componentPath, "getSourceDepthBlockerSummary"],
  [componentPath, "getPublicRuntimeBoundaryCopy"],
  [componentPath, "runtime-boundary-copy-card"],
  [componentPath, "boundaryCopy.currentState"],
  [componentPath, "boundaryCopy.blockedState"],
  [componentPath, "mock-only"],
  [componentPath, "scoreSource=real"],
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
  [dashboardPath, "import { StockRuntimeAtAGlance }"],
  [dashboardPath, "<StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />"],
  [cssPath, ".stock-runtime-at-a-glance"],
  [cssPath, "repeat(auto-fit, minmax(150px"],
  [cssPath, ".runtime-boundary-copy-card"],
  [cssPath, ".compact-runtime-blocker"],
  [cssPath, ".stock-runtime-at-a-glance article.active"],
  [cssPath, ".stock-runtime-at-a-glance article.blocked"],
  [cssPath, ".stock-runtime-at-a-glance article.readying"],
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
