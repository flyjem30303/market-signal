import fs from "node:fs";

const componentPath = "src/components/weekly-row-coverage-status.tsx";
const sharedComponentPath = "src/components/row-coverage-readiness-panel.tsx";
const weeklyPath = "src/app/weekly/page.tsx";
const libPath = "src/lib/row-coverage-second-attempt-readiness.ts";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, sharedComponentPath, weeklyPath, libPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [componentPath, "WeeklyRowCoverageStatus"],
  [componentPath, "RowCoverageReadinessPanel"],
  [componentPath, "Row Coverage Gate"],
  [sharedComponentPath, "getRowCoverageSecondAttemptReadiness"],
  [sharedComponentPath, "rowCoverage.readiness"],
  [componentPath, "第二次 Supabase readonly"],
  [componentPath, "仍維持 mock"],
  [sharedComponentPath, "rowCoverage.stopLine"],
  [weeklyPath, "import { WeeklyRowCoverageStatus }"],
  [weeklyPath, "<WeeklyRowCoverageStatus />"],
  [libPath, "local_ready_remote_paused"],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "不跑 SQL、不寫 Supabase"],
  [cssPath, ".weekly-row-coverage-status"],
  [cssPath, ".weekly-row-coverage-status article.readying"],
  [cssPath, ".weekly-row-coverage-status article.blocked"],
  [packagePath, "\"check:weekly-row-coverage-status\": \"node scripts/check-weekly-row-coverage-status.mjs\""],
  [reviewGatePath, "scripts/check-weekly-row-coverage-status.mjs"]
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
  [weeklyPath, "scoreSource=\"real\""],
  [libPath, "scoreSource: \"real\""]
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
