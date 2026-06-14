import fs from "node:fs";

const componentPath = "src/components/briefing-row-coverage-status.tsx";
const sharedComponentPath = "src/components/row-coverage-readiness-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const libPath = "src/lib/row-coverage-second-attempt-readiness.ts";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, sharedComponentPath, briefingPath, libPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [componentPath, "BriefingRowCoverageStatus"],
  [componentPath, "RowCoverageReadinessPanel"],
  [sharedComponentPath, "getRowCoverageSecondAttemptReadiness"],
  [sharedComponentPath, "rowCoverage.unresolved"],
  [libPath, "local_ready_remote_paused"],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "publicDataSource: \"mock\""],
  [briefingPath, "DataFreshnessStrip"],
  [briefingPath, "資料狀態"],
  [cssPath, ".briefing-row-coverage-status"],
  [cssPath, ".briefing-row-coverage-status article.readying"],
  [cssPath, ".briefing-row-coverage-status article.blocked"],
  [packagePath, "\"check:briefing-row-coverage-status\": \"node scripts/check-briefing-row-coverage-status.mjs\""],
  [reviewGatePath, "scripts/check-briefing-row-coverage-status.mjs"]
];

const forbidden = [
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, "process.env"],
  [componentPath, "scoreSource: \"real\""],
  [sharedComponentPath, "@supabase/supabase-js"],
  [sharedComponentPath, "createClient"],
  [sharedComponentPath, "fetch("],
  [sharedComponentPath, ".from("],
  [sharedComponentPath, "process.env"],
  [sharedComponentPath, "scoreSource: \"real\""],
  [briefingPath, "import { BriefingRowCoverageStatus }"],
  [briefingPath, "<BriefingRowCoverageStatus"],
  [briefingPath, "scoreSource=\"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
