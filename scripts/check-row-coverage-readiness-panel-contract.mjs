import fs from "node:fs";

const componentPath = "src/components/row-coverage-readiness-panel.tsx";
const readinessPath = "src/lib/row-coverage-second-attempt-readiness.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, readinessPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [componentPath, "RowCoverageReadinessPanel"],
  [componentPath, "getRowCoverageSecondAttemptReadiness"],
  [componentPath, "rowCoverage.readiness"],
  [componentPath, "rowCoverage.nextDecision"],
  [componentPath, "rowCoverage.goNoGo.decisionRequired"],
  [componentPath, "rowCoverage.goNoGo.go.join"],
  [componentPath, "rowCoverage.goNoGo.noGo.join"],
  [componentPath, "rowCoverage.publicDataSource"],
  [componentPath, "rowCoverage.scoreSource"],
  [componentPath, "rowCoverage.stopLine"],
  [componentPath, "rowCoverage.unresolved"],
  [readinessPath, "readiness: \"local_ready_remote_paused\""],
  [readinessPath, "goNoGo"],
  [readinessPath, "exactly one bounded Supabase readonly row coverage attempt"],
  [readinessPath, "no SQL execution"],
  [readinessPath, "no scoreSource=real"],
  [readinessPath, "publicDataSource: \"mock\""],
  [readinessPath, "scoreSource: \"mock\""],
  [readinessPath, "不跑 SQL、不寫 Supabase"],
  [packagePath, "\"check:row-coverage-readiness-panel-contract\": \"node scripts/check-row-coverage-readiness-panel-contract.mjs\""],
  [reviewGatePath, "scripts/check-row-coverage-readiness-panel-contract.mjs"]
];

const forbidden = [
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, "process.env"],
  [componentPath, "scoreSource: \"real\""],
  [readinessPath, "scoreSource: \"real\""],
  [readinessPath, "publicDataSource: \"real\""]
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
