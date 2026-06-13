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
  [componentPath, "週報資料覆蓋狀態"],
  [componentPath, "示範資料與示範分數"],
  [componentPath, "正式市場資料"],
  [sharedComponentPath, "getRowCoverageSecondAttemptReadiness"],
  [sharedComponentPath, "目前狀態"],
  [sharedComponentPath, "可前進條件"],
  [sharedComponentPath, "覆蓋率缺口"],
  [sharedComponentPath, "資料邊界"],
  [sharedComponentPath, "正式資料仍在補齊"],
  [weeklyPath, "import { WeeklyRowCoverageStatus }"],
  [weeklyPath, "<WeeklyRowCoverageStatus />"],
  [libPath, "local_ready_remote_paused"],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "不執行 SQL"],
  [libPath, "不寫入 Supabase"],
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
