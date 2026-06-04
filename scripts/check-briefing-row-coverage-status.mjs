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
  [componentPath, "資料列覆蓋準備度"],
  [componentPath, "local_ready_remote_paused"],
  [componentPath, "Supabase readonly attempt"],
  [componentPath, "不得升級公開資料來源或正式分數"],
  [sharedComponentPath, "getRowCoverageSecondAttemptReadiness"],
  [sharedComponentPath, "目前狀態"],
  [sharedComponentPath, "授權判斷"],
  [sharedComponentPath, "本地指令地圖"],
  [sharedComponentPath, "最新覆蓋觀察"],
  [sharedComponentPath, "來源與分數邊界"],
  [sharedComponentPath, "未決事項"],
  [sharedComponentPath, "rowCoverage.stopLine"],
  [libPath, "local_ready_remote_paused"],
  [briefingPath, "import { BriefingRowCoverageStatus }"],
  [briefingPath, "<BriefingRowCoverageStatus />"],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "publicDataSource: \"mock\""],
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
  [briefingPath, "scoreSource=\"real\""]
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
