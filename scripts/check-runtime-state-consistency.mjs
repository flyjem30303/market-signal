import fs from "node:fs";
import { spawnSync } from "node:child_process";

const consistencyPath = "src/lib/runtime-state-consistency.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [consistencyPath, homePath, stockPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [consistencyPath, "RuntimeStateConsistencySummary"],
  [consistencyPath, "getRuntimeStateConsistencySummary"],
  [consistencyPath, "getHomeRuntimeActionSummary"],
  [consistencyPath, "getRuntimeReadinessSummary"],
  [consistencyPath, "getRowCoverageSecondAttemptReadiness"],
  [consistencyPath, "getSourceDepthBlockerSummary"],
  [consistencyPath, "getFreshnessReadonlyLatestEvidenceSummary"],
  [consistencyPath, "consistencyState: \"mock_consistent\""],
  [consistencyPath, "publicDataSource: \"mock\""],
  [consistencyPath, "scoreSource: \"mock\""],
  [consistencyPath, "sourceDepthState: sourceDepth.sourceDepthState"],
  [consistencyPath, "rowCoverageState: rowCoverage.readiness"],
  [consistencyPath, "readinessState: readiness.status"],
  [consistencyPath, "freshnessEvidence.evidenceStatus"],
  [consistencyPath, "Keep every public surface aligned to mock publicDataSource and mock scoreSource"],
  [homePath, "getRuntimeStateConsistencySummary"],
  [homePath, "runtimeStateConsistency.consistencyState"],
  [homePath, "runtimeStateConsistency.statusLine"],
  [homePath, "runtime-consistency-card"],
  [stockPath, "getRuntimeStateConsistencySummary"],
  [stockPath, "runtimeStateConsistency.consistencyState"],
  [stockPath, "runtimeStateConsistency.statusLine"],
  [stockPath, "runtime-consistency-card"],
  [cssPath, ".runtime-consistency-card"],
  [packagePath, "\"check:runtime-state-consistency\": \"node scripts/check-runtime-state-consistency.mjs\""],
  [reviewGatePath, "scripts/check-runtime-state-consistency.mjs"]
];

const forbidden = [
  [consistencyPath, "@supabase/supabase-js"],
  [consistencyPath, "createClient"],
  [consistencyPath, "fetch("],
  [consistencyPath, "process.env"],
  [consistencyPath, "node:fs"],
  [consistencyPath, "from \"fs\""],
  [consistencyPath, "scoreSource: \"real\""],
  [consistencyPath, "publicDataSource: \"supabase\""],
  [homePath, "project-progress-score"],
  [stockPath, "project-progress-score"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

const typeRun = spawnSync(process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit"], {
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024
});

if (typeRun.status !== 0) {
  blocked.push(`tsc --noEmit failed: ${typeRun.stderr.trim() || typeRun.stdout.trim()}`);
}

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
